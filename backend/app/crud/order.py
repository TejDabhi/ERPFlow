from sqlalchemy.orm import Session
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate


def get_orders(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Order).offset(skip).limit(limit).all()


def get_order_by_id(db: Session, order_id: int):
    return db.query(Order).filter(Order.id == order_id).first()


def create_order(db: Session, order: OrderCreate):
    # 1. Create main order record using 'total_price'
    db_order = Order(
        customer_id=order.customer_id,
        total_price=order.total_price,
        status=order.status or "Completed",
    )
    db.add(db_order)
    db.flush()  # Generates db_order.id without ending the transaction

    # 2. Add line items using 'price' and update 'stock_quantity'
    for item in order.items:
        db_item = OrderItem(
            order_id=db_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.price,
        )
        db.add(db_item)

        # Update product stock using 'stock_quantity'
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product and hasattr(product, "stock_quantity") and product.stock_quantity is not None:
            product.stock_quantity = max(0, product.stock_quantity - item.quantity)

    # 3. Commit everything as a single atomic transaction
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