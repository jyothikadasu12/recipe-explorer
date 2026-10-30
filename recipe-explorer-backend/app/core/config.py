
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str
    frontend_url: str = "http://localhost:5173"
    themealdb_base_url: str = (
        "https://www.themealdb.com/api/json/v1/1"
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
