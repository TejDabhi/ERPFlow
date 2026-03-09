from pydantic import BaseModel


class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    unit_id: int


class Product(BaseModel):
    id: int
    name: str
    description: str
    price: float
    unit_id: int

    class Config:
        orm_mode = True