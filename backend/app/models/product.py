from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from app.database import Base


class Product(Base):

    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    price = Column(Float)
    unit_id = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)