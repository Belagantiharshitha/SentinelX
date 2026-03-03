from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database.db import engine, Base, SessionLocal
from .database import models
from .database.seed import seed_database

from .routes import dashboard, accounts, events, incidents, simulate

# Create FastAPI app
app = FastAPI(title=settings.PROJECT_NAME)

# ✅ Create database tables automatically (IMPORTANT)
Base.metadata.create_all(bind=engine)

# ✅ Seed initial data if empty
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

# ✅ CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Include Routers
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(accounts.router, prefix="/api/accounts", tags=["Accounts"])
app.include_router(events.router, prefix="/api/events", tags=["Events"])
app.include_router(incidents.router, prefix="/api/incidents", tags=["Incidents"])
app.include_router(simulate.router, prefix="/api/simulate", tags=["Simulate"])

# ✅ Health Check
@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "project": settings.PROJECT_NAME
    }

# ✅ Root Endpoint
@app.get("/")
def read_root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME} API"
    }