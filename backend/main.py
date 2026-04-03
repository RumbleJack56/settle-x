from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.session import engine, Base
from core.config import settings

from api.auth import router as auth_router

# Initialize database tables locally (sqlite)
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev only, restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routing
app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])

@app.get("/")
def read_root():
    return {"message": "MSME Intelligence Platform API is running."}

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "ok",
        "services": {
            "database": "ok",
        },
        "version": "1.0.0"
    }
