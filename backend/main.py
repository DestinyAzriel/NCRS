from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.config import settings
from backend.database import engine, Base
from backend import models  # ensure all models are registered
from backend.routes import auth as auth_router
from backend.routes import public as public_router
from backend.routes import admin as admin_router

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="CMS API for Nyanthepa Community Radio 107.6 FM, Nsanje & Lower Shire, Malawi.",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount route groups
app.include_router(auth_router.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(public_router.router, prefix=f"{settings.API_V1_STR}", tags=["Public Broadcast API"])
app.include_router(admin_router.router, prefix=f"{settings.API_V1_STR}/admin", tags=["Staff Admin CMS"])

@app.get("/")
def root():
    return {
        "station": "Nyanthepa Community Radio",
        "frequency": "107.6 FM",
        "location": "Nsanje, Lower Shire, Malawi",
        "api_version": settings.VERSION,
        "docs": "/api/docs",
    }

@app.get("/health")
def health():
    return {"status": "ok", "service": "nyanthepa-api"}
