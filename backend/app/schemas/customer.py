from pydantic import BaseModel

class CustomerCreate(BaseModel):
    name: str
    phone: str
    email: str
    address: str

class Customer(BaseModel):
    id: int
    name: str
    phone: str
    email: str
    address: str

    class Config:
        orm_mode = True