from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import httpx
import json
from app.utils.config import settings
from app.services.ai_service import AIService
from app.services.subject_service import SubjectService

router = APIRouter()

# Pydantic models
class ChatMessage(BaseModel):
    message: str
    subject: Optional[str] = None
    context: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    subject: str
    latex_expressions: List[str] = []
    suggestions: List[str] = []

class WhiteboardRequest(BaseModel):
    request: str
    canvas_width: int = 800
    canvas_height: int = 600

class Shape(BaseModel):
    type: str
    left: Optional[float] = None
    top: Optional[float] = None
    width: Optional[float] = None
    height: Optional[float] = None
    radius: Optional[float] = None
    x1: Optional[float] = None
    y1: Optional[float] = None
    x2: Optional[float] = None
    y2: Optional[float] = None
    text: Optional[str] = None
    fontSize: Optional[int] = None
    fill: Optional[str] = None
    stroke: Optional[str] = None
    strokeWidth: Optional[int] = None

class WhiteboardResponse(BaseModel):
    shapes: List[Shape]
    description: str

class SubjectInfo(BaseModel):
    name: str
    description: str
    topics: List[str]
    examples: List[str]

# Initialize services
ai_service = AIService()
subject_service = SubjectService()

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(chat_message: ChatMessage):
    """
    Send a message to the AI assistant and get a response
    """
    try:
        # No longer require subject
        # Use context if provided (full conversation)
        response = await ai_service.get_response(
            message=chat_message.message,
            subject=None,  # subject is now unused
            context=chat_message.context
        )

        # Generate follow-up suggestions
        suggestions = ai_service.generate_suggestions(chat_message.message, None)

        return ChatResponse(
            response=response,
            subject="General",
            latex_expressions=[],  # No longer extracting separately
            suggestions=suggestions
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat request: {str(e)}")

@router.get("/subjects", response_model=List[SubjectInfo])
async def get_subjects():
    """
    Get list of available subjects with their descriptions and topics
    """
    return subject_service.get_subject_info()

@router.get("/subjects/{subject_name}", response_model=SubjectInfo)
async def get_subject_details(subject_name: str):
    """
    Get detailed information about a specific subject
    """
    subject_info = subject_service.get_subject_info_by_name(subject_name)
    if not subject_info:
        raise HTTPException(status_code=404, detail=f"Subject '{subject_name}' not found")
    return subject_info

@router.post("/chat/stream")
async def chat_stream(chat_message: ChatMessage):
    """
    Stream chat response (for future implementation)
    """
    # This would implement streaming responses
    # For now, return a simple response
    return {"message": "Streaming not implemented yet"}

@router.post("/whiteboard/draw", response_model=WhiteboardResponse)
async def generate_whiteboard_drawing(request: WhiteboardRequest):
    """
    Generate drawing instructions for the whiteboard based on user request using DeepSeek
    """
    import re
    try:
        print(f"🎨 Whiteboard request: {request.request}")

        # Prompt for DeepSeek
        prompt = (
            f"""
You are an AI whiteboard assistant. Given a user's request, output a JSON array of shapes to draw on a whiteboard canvas. 
Each shape should be an object with a type (one of: line, rectangle, circle, text), and relevant properties:
- line: x1, y1, x2, y2, stroke, strokeWidth
- rectangle: left, top, width, height, fill, stroke, strokeWidth
- circle: left, top, radius, fill, stroke, strokeWidth
- text: left, top, text, fontSize, fill

Canvas size: {request.canvas_width}x{request.canvas_height}

Example:
[
  {{"type": "line", "x1": 50, "y1": 300, "x2": 750, "y2": 300, "stroke": "#000000", "strokeWidth": 2}},
  {{"type": "text", "left": 760, "top": 295, "text": "x", "fontSize": 20, "fill": "#000000"}}
]

User request: {request.request}

Respond ONLY with the JSON array, no explanation or extra text."""
        )

        # Call DeepSeek via ai_service
        ai_response = await ai_service.get_response(prompt)

        # Extract JSON array from response (handle possible extra text)
        match = re.search(r'\[.*\]', ai_response, re.DOTALL)
        if match:
            shapes_json = match.group(0)
        else:
            # Fallback: try to parse the whole response
            shapes_json = ai_response

        try:
            shapes_data = json.loads(shapes_json)
        except Exception as e:
            print(f"❌ Failed to parse shapes JSON: {e}")
            raise HTTPException(status_code=500, detail=f"AI response could not be parsed as shapes JSON. Raw response: {ai_response}")

        # Convert dicts to Shape models
        shapes = [Shape(**shape) for shape in shapes_data]
        description = f"AI-generated drawing for: {request.request}"
        print(f"✅ Generated {len(shapes)} shapes (AI)")
        return WhiteboardResponse(shapes=shapes, description=description)

    except Exception as e:
        print(f"❌ Whiteboard error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating drawing: {str(e)}") 
