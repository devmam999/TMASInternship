import httpx
import json
import re
from typing import List, Optional
from app.utils.config import settings

class AIService:
    """Service for handling AI chat interactions via OpenRouter API"""
    
    def __init__(self):
        self.api_key = settings.OPENROUTER_API_KEY
        self.base_url = "https://openrouter.ai/api/v1"
        self.model = "deepseek/deepseek-chat-v3:free"  # Completely free model
        self.max_tokens = 1000  # More tokens since it's free
        self.temperature = settings.TEMPERATURE
    
    async def get_response(self, message: str, context: Optional[str] = None) -> str:
        """
        Get AI response for a given message
        """
        print(f"🔍 AI Service Debug:")
        print(f"  API Key length: {len(self.api_key) if self.api_key else 0}")
        print(f"  API Key starts with: {self.api_key[:10] if self.api_key else 'None'}...")
        print(f"  Message: {message}")
        
        if not self.api_key:
            print("❌ No API key found, using fallback")
            return self._get_fallback_response(message)
        
        print("✅ API key found, making request to Open Router")
        
        try:
            # Build system prompt (no subject)
            system_prompt = self._build_system_prompt()
            
            # Build user message with context
            user_message = self._build_user_message(message, context)
            
            # Make API request
            print(f"🌐 Making request to: {self.base_url}")
            print(f"📝 Using model: {self.model}")
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                        "HTTP-Referer": "http://localhost:3000",
                        "X-Title": "TMAS AI Tutor"
                    },
                    json={
                        "model": self.model,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_message}
                        ],
                        "max_tokens": self.max_tokens,
                        "temperature": self.temperature
                    },
                    timeout=60.0
                )
                
                print(f"📡 Response status: {response.status_code}")
                
                if response.status_code == 200:
                    data = response.json()
                    print(f"✅ Success! Response received")
                    # OpenRouter returns OpenAI-compatible format
                    if "choices" in data and len(data["choices"]) > 0:
                        return data["choices"][0]["message"]["content"].strip()
                    else:
                        print(f"❌ Unexpected response format: {data}")
                        return self._get_fallback_response(message)
                else:
                    print(f"❌ Error response: {response.status_code}")
                    print(f"Response text: {response.text}")
                    print(f"Response headers: {response.headers}")
                    return self._get_fallback_response(message)
                    
        except Exception as e:
            print(f"Error calling Hugging Face API: {e}")
            print(f"Full error details: {type(e).__name__}: {str(e)}")
            return self._get_fallback_response(message)
    
    def _build_system_prompt(self) -> str:
        """Build system prompt for general math and science tutoring"""
        base_prompt = """You are an expert AI tutor specializing in AP Math and Science.\nProvide clear, step-by-step explanations with mathematical expressions in LaTeX format.\nAlways show your work and explain the reasoning behind each step.\nUse proper mathematical notation and include units where applicable."""
        return base_prompt
    
    def _build_user_message(self, message: str, context: Optional[str] = None) -> str:
        """Build user message with optional context"""
        if context:
            return f"Context: {context}\n\nQuestion: {message}"
        return message
    
    def _get_fallback_response(self, message: str) -> str:
        """Fallback response when API is not available"""
        return f"I'm here to help you with your question: '{message}'. However, I'm currently in demo mode. Please set up your OpenRouter API key to get full AI-powered responses."
    
    def extract_latex(self, text: str) -> List[str]:
        """Extract LaTeX expressions from text"""
        # Look for LaTeX expressions in various formats
        patterns = [
            r'\$([^$]+)\$',  # Inline math: $...$
            r'\$\$([^$]+)\$\$',  # Display math: $$...$$
            r'\\\[([^\]]+)\\\]',  # Display math: \[...\]
            r'\\\(([^)]+)\\\)',  # Inline math: \(...\)
        ]
        
        latex_expressions = []
        for pattern in patterns:
            matches = re.findall(pattern, text)
            latex_expressions.extend(matches)
        
        return list(set(latex_expressions))  # Remove duplicates
    
    def generate_suggestions(self, message: str) -> List[str]:
        """Generate follow-up question suggestions"""
        suggestions = []
        
        if "derivative" in message.lower() or "differentiate" in message.lower():
            suggestions.extend([
                "Can you show me the step-by-step process?",
                "What are the different differentiation rules?",
                "How do I find the second derivative?"
            ])
        
        if "integral" in message.lower() or "integrate" in message.lower():
            suggestions.extend([
                "What integration technique should I use?",
                "Can you explain integration by parts?",
                "How do I evaluate definite integrals?"
            ])
        
        if "force" in message.lower() or "acceleration" in message.lower():
            suggestions.extend([
                "Can you draw a free-body diagram?",
                "What are the forces acting on the object?",
                "How do I use Newton's second law?"
            ])
        
        if "equation" in message.lower() or "solve" in message.lower():
            suggestions.extend([
                "What method should I use to solve this?",
                "Can you check my work?",
                "Are there multiple solutions?"
            ])
        
        # Add general suggestions if none specific
        if not suggestions:
            suggestions = [
                "Can you explain this step by step?",
                "What's the underlying concept here?",
                "Can you show me a similar example?",
                "What are the key formulas I should remember?"
            ]
        
        return suggestions[:3]  # Return top 3 suggestions 