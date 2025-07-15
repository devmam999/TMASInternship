# 🚀 AI Study Assistant - Quick Start Guide

## What You've Built

You now have a complete MVP of an AI-powered study assistant with:

### ✅ Core Features
- **Intelligent Chat Interface** - Ask questions about AP Math & Science
- **Interactive Whiteboard** - Draw diagrams and graphs
- **Math Solver** - Symbolic mathematics with SymPy
- **Beautiful UI** - Modern React + Tailwind CSS design

### 🛠️ Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS + Fabric.js
- **Backend**: Python + FastAPI + SymPy + OpenRouter API
- **Math Rendering**: MathJax for LaTeX
- **Drawing**: Fabric.js canvas

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Python 3.11+
- OpenRouter API key (free tier available)

### 1. Setup the Project

```bash
# Make setup script executable
chmod +x setup.sh

# Run the setup script
./setup.sh
```

### 2. Get Your API Key

1. Go to [OpenRouter.ai](https://openrouter.ai/)
2. Sign up for a free account
3. Get your API key
4. Update `backend/.env`:
   ```
   OPENROUTER_API_KEY=your_actual_api_key_here
   ```

### 3. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
python3 -m uvicorn main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Open Your Browser

Navigate to: http://localhost:5173

## 🎯 Try These Examples

### Chat Examples
- "How do I find the derivative of x²·sin(x)?"
- "Calculate the acceleration of a 2kg block on a 30° incline"
- "Balance the chemical equation Fe + O₂ → Fe₂O₃"

### Math Solver Examples
- Solve: `x^2 + 5x + 6 = 0`
- Differentiate: `x^2 * sin(x)`
- Integrate: `x^2 * exp(x)`
- Evaluate: `x^2 + 2x + 1` where `x=3`

### Whiteboard Features
- Draw freehand diagrams
- Add shapes (rectangles, circles)
- Add text labels
- Download your drawings

## 📁 Project Structure

```
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── routers/        # API endpoints
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utilities
│   ├── main.py            # FastAPI app
│   └── requirements.txt   # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── contexts/      # React contexts
│   ├── package.json       # Node.js dependencies
│   └── vite.config.ts     # Vite configuration
└── README.md              # Full documentation
```

## 🔧 API Endpoints

- `POST /api/chat` - Send message to AI
- `POST /api/solve` - Solve mathematical expressions
- `GET /api/subjects` - Get available subjects
- `GET /health` - Health check

## 🎨 Features in Action

### Chat Interface
- Real-time AI responses
- Subject-specific help
- LaTeX math rendering
- Follow-up suggestions

### Math Solver
- Symbolic mathematics
- Step-by-step solutions
- Multiple operations (solve, differentiate, integrate)
- LaTeX output

### Whiteboard
- Interactive drawing canvas
- Multiple tools (pen, shapes, text)
- Color and brush size controls
- Download functionality

## 🚀 Next Steps

### Immediate Improvements
1. Add user authentication
2. Save chat history
3. Voice input/output
4. Image recognition for diagrams

### Advanced Features
1. Real-time collaboration
2. Practice problem banks
3. Progress tracking
4. Mobile app

## 🆘 Troubleshooting

### Common Issues

**Backend won't start:**
- Check Python version: `python3 --version`
- Install dependencies: `pip install -r requirements.txt`

**Frontend won't start:**
- Check Node.js version: `node --version`
- Install dependencies: `npm install`

**API errors:**
- Verify OpenRouter API key in `backend/.env`
- Check API key has sufficient credits

**Math rendering issues:**
- Ensure MathJax loads properly
- Check browser console for errors

### Getting Help
- Check the browser console for errors
- Review the backend logs
- Ensure all environment variables are set
- Verify API key is valid

## 🎉 You're Ready!

Your AI Study Assistant MVP is now running! Students can:

1. **Ask questions** about AP subjects
2. **Solve math problems** step-by-step
3. **Draw diagrams** on the whiteboard
4. **Get personalized help** for their studies

The application is fully functional and ready for students to use. All core MVP features are implemented and working! 