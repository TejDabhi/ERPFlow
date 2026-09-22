from sqlalchemy.orm import Session
from app.models.product import Product
from app.models.order import OrderItem
from app.schemas.product import ProductCreate, ProductUpdate


def get_product(db: Session, product_id: int):
    return db.query(Product).filter(Product.id == product_id).first()


def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Product).offset(skip).limit(limit).all()


def create_product(db: Session, product: ProductCreate):
    # Using model_dump() directly handles all fields matching Product model
    db_product = Product(
        name=product.name,
        description=getattr(product, "description", None),
        price=product.price,
        stock_quantity=getattr(product, "stock_quantity", 0)  # Corrected from stock
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def update_product(db: Session, product_id: int, product_update: ProductUpdate):
    db_product = get_product(db, product_id)
    if not db_product:
        return None

    update_data = (
        product_update.model_dump(exclude_unset=True)
        if hasattr(product_update, "model_dump")
        else product_update.dict(exclude_unset=True)
    )

    for key, value in update_data.items():
        setattr(db_product, key, value)

    db.commit()
    db.refresh(db_product)
    return db_product


def delete_product(db: Session, product_id: int):
    db_product = get_product(db, product_id)
    if not db_product:
        return None

    # Check if order items reference this product
    existing_items = db.query(OrderItem).filter(OrderItem.product_id == product_id).count()
    if existing_items > 0:
        raise ValueError("Cannot delete product: You need to delete associated orders first.")

    db.delete(db_product)
    db.commit()
    return db_product