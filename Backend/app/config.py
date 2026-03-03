from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SentinelX"
    DATABASE_URL: str = "sqlite:///./sentinelx.db" # Standardized relative to backend app start
    OPENAI_API_KEY: str = "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"
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173", 
        "http://127.0.0.1:5173", 
        "http://localhost:5174", 
        "http://127.0.0.1:5174",
        "http://localhost:3000"
    ]

    class Config:
        env_file = ".env"

settings = Settings()
