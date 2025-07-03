import asyncio
import httpx
import json

async def test_backend():
    """Test the backend API directly"""
    
    # Test the chat endpoint
    test_message = {
        "message": "How do I find the derivative of x²·sin(x)?",
        "subject": "AP Calculus"
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://localhost:8000/api/chat",
                json=test_message,
                timeout=30.0
            )
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Backend working! Response: {data.get('response', 'No response')}")
            else:
                print(f"❌ Backend error: {response.status_code}")
                
    except Exception as e:
        print(f"❌ Connection error: {e}")

if __name__ == "__main__":
    asyncio.run(test_backend()) 