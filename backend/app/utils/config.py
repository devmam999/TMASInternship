from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # API Configuration
    OPENROUTER_API_KEY: str = ""  # Now used for Hugging Face token
    OPENROUTER_BASE_URL: str = "https://api-inference.huggingface.co/models"
    
    # CORS Configuration - use string and parse it
    CORS_ORIGINS_STR: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000"
    
    # AI Model Configuration
    DEFAULT_MODEL: str = "openai/gpt-3.5-turbo"  # More cost-effective
    MAX_TOKENS: int = 1024  # Reduced for cost
    TEMPERATURE: float = 0.7
    
    # Math Engine Configuration
    SYMPY_TIMEOUT: int = 30  # seconds
    
    @property
    def CORS_ORIGINS(self) -> List[str]:
        """Parse CORS_ORIGINS_STR into a list"""
        return [origin.strip() for origin in self.CORS_ORIGINS_STR.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
print("🔍 Loading settings...")

# Check if .env file exists
env_file_path = os.path.join(os.getcwd(), ".env")
print(f"Looking for .env file at: {env_file_path}")
print(f".env file exists: {os.path.exists(env_file_path)}")

if os.path.exists(env_file_path):
    with open(env_file_path, 'r') as f:
        print("📄 .env file contents:")
        for line in f:
            if line.strip() and not line.startswith('#'):
                key = line.split('=')[0] if '=' in line else 'unknown'
                print(f"  {key}=...")

settings = Settings()

# Debug: Check if .env is loaded
print(f"Current working directory: {os.getcwd()}")
print(f"OPENROUTER_API_KEY length: {len(settings.OPENROUTER_API_KEY)}")
print(f"API Key starts with: {settings.OPENROUTER_API_KEY[:10] if settings.OPENROUTER_API_KEY else 'None'}...")

# Validate required settings
if not settings.OPENROUTER_API_KEY:
    print("❌ Warning: OPENROUTER_API_KEY not set. Chat functionality will be limited.")
else:
    print("✅ API key loaded successfully!") 