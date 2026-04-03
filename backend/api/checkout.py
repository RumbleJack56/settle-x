import json
import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from database.session import get_db
from models.user import User
from models.ledger import LedgerAccount, AccountType, EntryDirection, PaymentIntent, IntentStatus
from schemas.checkout import IntentCreate, IntentExecute
from api.deps import get_current_user
from api.payments import get_wallet, calculate_balance
from core.http import api_error
from core.transaction_types import resolve_intent_transaction_type, validate_intent_metadata
from core.settlement import SettlementEntry, execute_settlement_transaction

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_event_account(db: Session, target_type: str) -> LedgerAccount:
    """Gets or securely provisions a generalized Revenue/Liability Event Account for a specific utility."""
    account_name = f"External {target_type} Processor"
    event_wallet = db.query(LedgerAccount).filter(
        LedgerAccount.name == account_name,
        LedgerAccount.is_system == True
    ).first()
    
    if not event_wallet:
        # We attribute utility/merchant settlements natively to the System Central Bank user.
        sys_user = db.query(User).filter(User.mobile_number == "0000000000").first()
        event_wallet = LedgerAccount(
            user_id=sys_user.id, 
            name=account_name, 
            account_type=AccountType.EXPENSE, 
            is_system=True
        )
        db.add(event_wallet)
        db.commit()
        db.refresh(event_wallet)
        
    return event_wallet


@router.post("/intent")
def create_intent(payload: IntentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if payload.amount_paise <= 0:
         api_error(400, "INVALID_AMOUNT", "Invalid transfer amount.")
    validate_intent_metadata(payload.target_type, payload.transaction_metadata)
         
    raw_metadata = json.dumps(payload.transaction_metadata) if payload.transaction_metadata else None
    
    intent = PaymentIntent(
        token=f"chk_{uuid.uuid4().hex[:16]}",
        user_id=current_user.id,
        amount_paise=payload.amount_paise,
        description=payload.description,
        target_type=payload.target_type,
        transaction_metadata=raw_metadata
    )
    db.add(intent)
    db.commit()
    db.refresh(intent)
    
    return {"token": intent.token}

@router.get("/intent/{token}")
def get_intent(token: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    intent = db.query(PaymentIntent).filter(PaymentIntent.token == token).first()
    if not intent:
        api_error(404, "INTENT_NOT_FOUND", "Payment Intent not found.")
    if intent.user_id != current_user.id:
        api_error(403, "UNAUTHORIZED_INTENT_ACCESS", "Unauthorized token access.")
        
    return {
        "amount_paise": intent.amount_paise,
        "amount_inr": intent.amount_paise / 100,
        "description": intent.description,
        "target_type": intent.target_type,
        "metadata": json.loads(intent.transaction_metadata) if intent.transaction_metadata else {},
        "status": intent.status
    }

@router.post("/execute-intent")
def execute_intent(payload: IntentExecute, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # 1. Fetch Intent
    intent = db.query(PaymentIntent).filter(PaymentIntent.token == payload.token).first()
    if not intent:
        api_error(404, "INTENT_NOT_FOUND", "Intent not found.")
        
    if intent.status == IntentStatus.COMPLETED:
        return {"message": "Intent already executed successfully", "status": intent.status}
        
    if intent.user_id != current_user.id:
        api_error(403, "UNAUTHORIZED_INTENT_ACCESS", "Unauthorized token access.")

    # 2. PIN Validation
    if not current_user.transaction_pin_hash:
        api_error(403, "PIN_NOT_SET", "Transaction PIN is not set.")
    if not pwd_context.verify(payload.pin, current_user.transaction_pin_hash):
        api_error(403, "INVALID_PIN", "Invalid PIN.")
        
    # 3. Balance Verification
    sender_wallet = get_wallet(db, current_user.id)
    sender_balance = calculate_balance(db, sender_wallet.id)
    
    if sender_balance < intent.amount_paise:
        api_error(400, "INSUFFICIENT_BALANCE", "Insufficient Wallet Balance.")
        
    # 4. Target Event Account
    event_account = get_event_account(db, intent.target_type)
    
    # 5. Execute Double Entry Ledger Logic
    metadata = json.loads(intent.transaction_metadata) if intent.transaction_metadata else {}
    txn_type = resolve_intent_transaction_type(intent.target_type)
    try:
        result = execute_settlement_transaction(
            db=db,
            user_id=current_user.id,
            idempotency_key=intent.token,
            description=intent.description,
            transaction_type=txn_type,
            ai_category=intent.target_type,
            metadata={"target_type": intent.target_type, **metadata},
            entries=[
                SettlementEntry(
                    account_id=sender_wallet.id,
                    direction=EntryDirection.CREDIT,
                    amount=intent.amount_paise
                ),
                SettlementEntry(
                    account_id=event_account.id,
                    direction=EntryDirection.DEBIT,
                    amount=intent.amount_paise
                ),
            ],
        )
        if result.idempotent_replay:
            intent.status = IntentStatus.COMPLETED
            db.add(intent)
            db.commit()
            return {
                "message": "Intent already executed successfully",
                "status": IntentStatus.COMPLETED,
                "transaction_id": result.transaction.id,
                "amount_inr": intent.amount_paise / 100
            }
        
        # Mark intent complete safely
        intent.status = IntentStatus.COMPLETED
        db.add(intent)
        db.commit()
    except Exception as e:
        intent.status = IntentStatus.FAILED
        db.add(intent)
        db.commit()
        api_error(500, "LEDGER_TXN_FAILED", "Ledger transaction failed.", reason=str(e))
        
    return {
        "message": "Transaction Successful",
        "transaction_id": result.transaction.id,
        "amount_inr": intent.amount_paise / 100
    }
