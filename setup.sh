#!/bin/bash

echo "🚀 Setting up AI Study Assistant MVP..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.11+ first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Create environment files
echo "📝 Creating environment files..."

# Backend .env
cat > backend/.env << EOF
OPENROUTER_API_KEY=your_api_key_here
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
EOF

# Frontend .env
cat > frontend/.env << EOF
VITE_API_URL=http://localhost:8000
EOF

echo "✅ Environment files created"

# Install backend dependencies
echo "🐍 Installing Python dependencies..."
cd backend
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt
cd ..

# Install frontend dependencies
echo "📦 Installing Node.js dependencies..."
cd frontend
npm install
cd ..

echo "✅ Dependencies installed"

echo ""
echo "🎉 Setup complete! To start the application:"
echo ""
echo "1. Get your OpenRouter API key from https://openrouter.ai/"
echo "2. Update backend/.env with your API key"
echo "3. Start the backend:"
echo "   cd backend && python3 -m uvicorn main:app --reload"
echo ""
echo "4. Start the frontend (in a new terminal):"
echo "   cd frontend && npm run dev"
echo ""
echo "5. Open http://localhost:5173 in your browser"
echo ""
echo "📚 For more information, see README.md" 