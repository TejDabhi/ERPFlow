from sqlalchemy.orm import Session
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate

def get_orders(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Order).offset(skip).limit(limit).all()

def get_order_by_id(db: Session, order_id: int):
    return db.query(Order).filter(Order.id == order_id).first()

def create_order(db: Session, order: OrderCreate):
    # 1. Create main order record
    db_order = Order(
        customer_id=order.customer_id,
        total_amount=order.total_amount,
        status=order.status or "Completed",
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    # 2. Add line items and optionally decrement product stock
    for item in order.items:
        db_item = OrderItem(
            order_id=db_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=item.unit_price,
        )
        db.add(db_item)

        # Update product stock if product exists
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product and hasattr(product, "stock"):
            product.stock = max(0, product.stock - item.quantity)

    db.commit()
    db.refresh(db_order)
    return db_order

def delete_order(db: Session, order_id: int):
    db_order = get_order_by_id(db, order_id)
    if not db_order:
        return None
    db.delete(db_order)
    db.commit()
    return db_order