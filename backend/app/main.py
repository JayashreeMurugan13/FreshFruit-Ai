import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database.db import init_db
from app.api.routes import router
from app.services.model_service import model_manager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite database
    init_db()
    # Check model weights
    model_manager.reload_model()
    yield

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Deep Learning-Based Fruit Freshness Detection API using Computer Vision",
    lifespan=lifespan
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS + ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API router
app.include_router(router)

# Mount public assets if present
frontend_assets = os.path.join(settings.PROJECT_ROOT, "frontend", "public", "assets")
if os.path.exists(frontend_assets):
    app.mount("/api/assets", StaticFiles(directory=frontend_assets), name="assets")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
