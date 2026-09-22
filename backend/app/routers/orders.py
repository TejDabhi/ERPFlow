from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import SessionLocal
from app.schemas.order import OrderCreate, OrderOut
from app.crud import order as crud_order

router = APIRouter(prefix="/orders", tags=["Orders"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[OrderOut])
def list_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_order.get_orders(db, skip=skip, limit=limit)

@router.post("/", response_model=OrderOut)
def place_order(order: OrderCreate, db: Session = Depends(get_db)):
    return crud_order.create_order(db, order)

@router.get("/{order_id}", response_model=OrderOut)
def read_order(order_id: int, db: Session = Depends(get_db)):
    db_order = crud_order.get_order_by_id(db, order_id=order_id)
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order