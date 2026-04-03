from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.session import get_db
from models.ledger import LedgerAccount
from api.payments import calculate_balance

router = APIRouter()

@router.get("/event-accounts")
def get_events(db: Session = Depends(get_db)):
    accounts = db.query(LedgerAccount).filter(LedgerAccount.is_system == True).all()
    results = []
    for acc in accounts:
        # Debits - Credits mathematically
        bal = calculate_balance(db, acc.id)
        # If it's EQUITY (like Central Bank Reserve), the math implies a Credit is an increase. Let's flip it for display.
        if acc.account_type.value == "EQUITY":
            bal = -bal
            
        results.append({
            "name": acc.name,
            "type": acc.account_type.value,
            "balance_inr": bal / 100
        })
    return results
