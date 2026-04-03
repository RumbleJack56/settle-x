from fastapi import APIRouter, Depends
import json
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from passlib.context import CryptContext

from database.session import get_db
from models.user import User
from models.ledger import LedgerAccount, AccountType, Transaction, LedgerEntry, EntryDirection, TransactionStatus
from schemas.payments import PinSetup, TransferRequest
from api.deps import get_current_user
from core.http import api_error
from core.settlement import SettlementEntry, execute_settlement_transaction
from core.transaction_types import TransactionTypes

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_wallet(db: Session, user_id: str) -> LedgerAccount:
    """Gets or securely provisions a Main Wallet Asset account for a user."""
    wallet = db.query(LedgerAccount).filter(
        LedgerAccount.user_id == user_id, 
        LedgerAccount.name == "Main Wallet",
        LedgerAccount.account_type == AccountType.ASSET
    ).first()

    # Backward compatibility for older seeded wallets.
    if not wallet:
        wallet = db.query(LedgerAccount).filter(
            LedgerAccount.user_id == user_id,
            LedgerAccount.name == "SettleX Main Wallet",
            LedgerAccount.account_type == AccountType.ASSET
        ).first()
        if wallet:
            wallet.name = "Main Wallet"
            db.commit()
            db.refresh(wallet)
    
    if not wallet:
        wallet = LedgerAccount(user_id=user_id, name="Main Wallet", account_type=AccountType.ASSET)
        db.add(wallet)
        # Give them some mock test funds if it's a new wallet for testing
        db.commit()
        db.refresh(wallet)
        
        # Inject 50,000 INR natively to test network
        txn = Transaction(user_id=user_id, description="Welcome Bonus Initialization", status=TransactionStatus.COMPLETED)
        db.add(txn)
        db.commit()
        db.refresh(txn)
        
        entry = LedgerEntry(transaction_id=txn.id, account_id=wallet.id, direction=EntryDirection.DEBIT, amount=5000000)
        db.add(entry)
        db.commit()
        
    return wallet

def calculate_balance(db: Session, account_id: str) -> int:
    """Calculates active balance mapping Asset properties natively."""
    debits = db.query(func.sum(LedgerEntry.amount)).filter(
        LedgerEntry.account_id == account_id, 
        LedgerEntry.direction == EntryDirection.DEBIT
    ).scalar() or 0
    
    credits = db.query(func.sum(LedgerEntry.amount)).filter(
        LedgerEntry.account_id == account_id, 
        LedgerEntry.direction == EntryDirection.CREDIT
    ).scalar() or 0
    
    # Asset definition: Debits increase, Credits decrease
    return debits - credits

@router.post("/setup-pin")
def setup_pin(payload: PinSetup, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    hashed_pin = pwd_context.hash(payload.pin)
    current_user.transaction_pin_hash = hashed_pin
    db.commit()
    return {"message": "Transaction PIN activated securely."}

@router.get("/balance")
def get_balance(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    wallet = get_wallet(db, current_user.id)
    balance_paise = calculate_balance(db, wallet.id)
    return {
        "wallet_id": wallet.id,
        "balance_paise": balance_paise,
        "balance_inr": balance_paise / 100,
        "pin_set": current_user.transaction_pin_hash is not None
    }

@router.post("/transfer")
def execute_transfer(payload: TransferRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # 0. Formatting
    recipient_num = payload.recipient_mobile.replace("+91", "").replace(" ", "")
    if current_user.mobile_number == recipient_num:
        api_error(400, "SELF_TRANSFER_BLOCKED", "Cannot transfer to yourself.")
    
    if payload.amount_paise <= 0:
         api_error(400, "INVALID_AMOUNT", "Invalid transfer amount.")
    
    # 1. PIN Validation
    if not current_user.transaction_pin_hash:
        api_error(403, "PIN_NOT_SET", "Transaction PIN is not set.")
    if not pwd_context.verify(payload.pin, current_user.transaction_pin_hash):
        api_error(403, "INVALID_PIN", "Invalid PIN.")
        
    # 2. Recipient Check
    recipient = db.query(User).filter(User.mobile_number == recipient_num).first()
    if not recipient:
        api_error(404, "RECIPIENT_NOT_FOUND", "Recipient is not registered on SettleX network.")
        
    # 3. Balance Verification
    sender_wallet = get_wallet(db, current_user.id)
    sender_balance = calculate_balance(db, sender_wallet.id)
    
    if sender_balance < payload.amount_paise:
        api_error(400, "INSUFFICIENT_BALANCE", "Insufficient Wallet Balance.")
        
    # 4. Execute Double Entry Ledger Logic
    recipient_wallet = get_wallet(db, recipient.id)
    
    try:
        result = execute_settlement_transaction(
            db=db,
            user_id=current_user.id, 
            description=f"P2P Transfer to {recipient_num}",
            transaction_type=TransactionTypes.P2P,
            idempotency_key=payload.idempotency_key,
            metadata={"recipient_mobile": recipient_num, "amount_paise": payload.amount_paise},
            entries=[
                SettlementEntry(
                    account_id=sender_wallet.id,
                    direction=EntryDirection.CREDIT,
                    amount=payload.amount_paise
                ),
                SettlementEntry(
                    account_id=recipient_wallet.id,
                    direction=EntryDirection.DEBIT,
                    amount=payload.amount_paise
                ),
            ]
        )
        if result.idempotent_replay:
            return {
                "message": "Payment already processed",
                "transaction_id": result.transaction.id,
                "status": result.transaction.status
            }
    except Exception as e:
        api_error(500, "LEDGER_TXN_FAILED", "Ledger transaction failed.", reason=str(e))
        
    return {
        "message": "Transfer Successful",
        "transaction_id": result.transaction.id,
        "amount_inr": payload.amount_paise / 100
    }

@router.get("/transactions")
def get_transactions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    wallet = get_wallet(db, current_user.id)
    
    entries = db.query(LedgerEntry, Transaction).join(
        Transaction, LedgerEntry.transaction_id == Transaction.id
    ).filter(
        LedgerEntry.account_id == wallet.id
    ).order_by(Transaction.posted_date.desc()).all()
    
    results = []
    for entry, txn in entries:
        results.append({
            "id": txn.id,
            "description": txn.description,
            "transaction_type": txn.transaction_type,
            "metadata": json.loads(txn.transaction_metadata) if txn.transaction_metadata else {},
            "direction": entry.direction.value, # DEBIT (Money Received via Asset Increase), CREDIT (Money Sent via Asset Decrease)
            "amount_inr": entry.amount / 100,
            "status": txn.status.value,
            "date": txn.posted_date.isoformat()
        })
    return {"transactions": results}
