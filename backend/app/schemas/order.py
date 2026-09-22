from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    unit_price: float

class OrderItemCreate(OrderItemBase):
    pass

class OrderItemOut(OrderItemBase):
    id: int

    class Config:
        from_attributes = True


class OrderBase(BaseModel):
    customer_id: int
    total_amount: float
    status: Optional[str] = "Completed"

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class OrderOut(OrderBase):
    id: int
    created_at: datetime
    items: List[OrderItemOut] = []

    class Config:
        from_attributes = True