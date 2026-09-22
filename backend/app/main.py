from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Database setup
from app.database import Base, engine
import app.models.customer  # Loads customer model definition into Base
import app.models.product   # Loads product model definition into Base
import app.models.order     # Loads order model definition into Base

# Create all tables if they do not exist
Base.metadata.create_all(bind=engine)

# Import all routers including orders
from app.routers import customers, products, orders

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(customers.router)
app.include_router(products.router)
app.include_router(orders.router)

@app.get("/")
def read_root():
    return {"message": "ERP API running"}