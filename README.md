# React + FastAPI ERP System

A full-stack ERP (Enterprise Resource Planning) web application built with:

* **Frontend:** React + TypeScript
* **Backend:** FastAPI
* **Database:** PostgreSQL
* **ORM:** SQLAlchemy

This project demonstrates a modern **full-stack architecture** using a Python API backend and a TypeScript React frontend.

---

# Tech Stack

### Frontend

* React
* TypeScript
* Axios
* HTML / CSS

### Backend

* FastAPI
* SQLAlchemy
* Pydantic
* Uvicorn

### Database

* PostgreSQL

---

# Project Structure

```
react-fastapi-erp
│
├── backend
│   ├── app
│   │   ├── routers
│   │   │   └── customers.py
│   │   ├── models
│   │   │   └── customer.py
│   │   ├── schemas
│   │   │   └── customer.py
│   │   ├── database.py
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── frontend
│   ├── src
│   │   ├── components
│   │   │   └── CustomerForm.tsx
│   │   ├── services
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   └── index.tsx
│   │
│   └── package.json
│
└── README.md
```

---

# Features

* Create customers
* REST API with FastAPI
* PostgreSQL database integration
* React frontend with TypeScript
* API testing with Swagger UI

More modules planned:

* Products management
* Orders
* Shipping
* Invoice generation
* Dashboard analytics

---

# Backend Setup (FastAPI)

### 1 Install Python dependencies

```
pip install fastapi uvicorn sqlalchemy psycopg2-binary
```

or

```
pip install -r requirements.txt
```

---

### 2 Configure PostgreSQL

Update database connection in:

```
backend/app/database.py
```

Example:

```
DATABASE_URL = "postgresql://postgres:password@localhost:5432/erp_system"
```

---

### 3 Run FastAPI server

Navigate to backend folder:

```
cd backend
```

Run server:

```
uvicorn app.main:app --reload
```

Server will run at:

```
http://127.0.0.1:8000
```

Swagger API docs:

```
http://127.0.0.1:8000/docs
```

---

# Frontend Setup (React + TypeScript)

Navigate to frontend folder:

```
cd frontend
```

Install dependencies:

```
npm install
```

Run the development server:

```
npm start
```

Frontend will run at:

```
http://localhost:3000
```

---

# API Example

Create customer:

```
POST /customers
```

Example request body:

```
{
  "name": "John Doe",
  "phone": "123456789",
  "email": "john@example.com",
  "address": "New York"
}
```

Example response:

```
{
  "id": 1,
  "name": "John Doe",
  "phone": "123456789",
  "email": "john@example.com",
  "address": "New York",
  "created_at": "2026-03-07T12:01:46"
}
```

---

# Future Improvements

* Authentication (JWT)
* Role-based access control
* Product inventory management
* Order processing
* Invoice generation
* Dashboard analytics
* Docker deployment

---

# Author

Developed by **[Your Name]**

GitHub: https://github.com/yourusername

---

# License

This project is open source and available under the MIT License.
