from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Database setup
from app.database import Base, engine
import app.models.customer  # Loads customer model definition into Base
import app.models.product   # Loads product model definition into Base
import app.models.order     # Loads order model definition into Base

# Import all routers including orders
from app.routers import customers, products, orders


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all tables on startup if they do not exist
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://frontend-ohxaum9gc-tejs-projects-95a3334f.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    # Matches any future preview deployment on your Vercel project:
    allow_origin_regex=r"https://.*-tejs-projects-95a3334f\.vercel\.app",
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