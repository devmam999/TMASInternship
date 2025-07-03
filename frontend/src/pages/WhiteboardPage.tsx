import React from "react"
import { useState, useRef, useEffect } from 'react'
import { Brain, Download, Trash2, Send } from 'lucide-react'

export default function WhiteboardPage() {
  const [userRequest, setUserRequest] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      console.log('🎨 Initializing HTML5 canvas...')
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        // Set canvas size
        canvas.width = 800
        canvas.height = 600
        
        // Clear canvas with white background
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, 800, 600)
      }
    }
  }, [])

  const clearCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, 800, 600)
      }
    }
  }

  const downloadCanvas = () => {
    if (canvasRef.current) {
      const dataURL = canvasRef.current.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = 'ai-whiteboard.png'
      link.href = dataURL
      link.click()
    }
  }

  const handleAIRequest = async () => {
    if (!userRequest.trim() || !canvasRef.current) return

    setIsLoading(true)
    
    try {
      // Send request to AI to generate drawing
      const response = await fetch('http://localhost:8000/api/whiteboard/draw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request: userRequest,
          canvas_width: 800,
          canvas_height: 600
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('🎨 Received whiteboard data:', data)
        
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        
        if (ctx) {
          // Clear canvas first
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, 800, 600)
          
          // Parse AI response and draw on canvas
          if (data.shapes && Array.isArray(data.shapes)) {
            console.log(`🎨 Processing ${data.shapes.length} shapes`)
            
            data.shapes.forEach((shape: any, index: number) => {
              console.log(`🎨 Processing shape ${index}:`, shape)
              
              switch (shape.type) {
                case 'rectangle':
                  ctx.fillStyle = shape.fill || '#000000'
                  ctx.strokeStyle = shape.stroke || '#000000'
                  ctx.lineWidth = shape.strokeWidth || 2
                  ctx.fillRect(shape.left, shape.top, shape.width, shape.height)
                  ctx.strokeRect(shape.left, shape.top, shape.width, shape.height)
                  console.log(`🎨 Drew rectangle`)
                  break
                case 'circle':
                  ctx.fillStyle = shape.fill || '#000000'
                  ctx.strokeStyle = shape.stroke || '#000000'
                  ctx.lineWidth = shape.strokeWidth || 2
                  ctx.beginPath()
                  ctx.arc(shape.left + shape.radius, shape.top + shape.radius, shape.radius, 0, 2 * Math.PI)
                  ctx.fill()
                  ctx.stroke()
                  console.log(`🎨 Drew circle`)
                  break
                case 'line':
                  ctx.strokeStyle = shape.stroke || '#000000'
                  ctx.lineWidth = shape.strokeWidth || 2
                  ctx.beginPath()
                  ctx.moveTo(shape.x1, shape.y1)
                  ctx.lineTo(shape.x2, shape.y2)
                  ctx.stroke()
                  console.log(`🎨 Drew line`)
                  break
                case 'text':
                  ctx.fillStyle = shape.fill || '#000000'
                  ctx.font = `${shape.fontSize || 20}px Arial`
                  ctx.fillText(shape.text, shape.left, shape.top + (shape.fontSize || 20))
                  console.log(`🎨 Drew text`)
                  break
                default:
                  console.log(`🎨 Unknown shape type: ${shape.type}`)
              }
            })
          } else {
            console.log(' No shapes found in response')
          }
        }
        
        console.log('🎨 Canvas rendered')
        setUserRequest('')
      } else {
        console.log('🎨 Response not ok:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error requesting AI drawing:', error)
      alert('Failed to generate drawing. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAIRequest()
    }
  }

  return (
    <div className="max-w-full mx-auto p-16 bg-gray-50 min-h-screen flex flex-col items-center justify-center dark:bg-gray-900">
      <div className="card p-12 w-full max-w-7xl min-h-[900px] dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 transition-colors duration-300">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center space-x-3">
            <Brain className="w-6 h-6 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">AI Whiteboard</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={downloadCanvas} className="btn-secondary">
              <Download className="w-4 h-4" />
            </button>
            <button onClick={clearCanvas} className="btn-secondary">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Responsive two-column layout with more separation */}
        <div className="flex flex-col lg:flex-row gap-20 items-start justify-center">
          {/* AI Request Panel */}
          <div className="w-full lg:w-1/3 mt-12">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3 dark:text-gray-200">AI Drawing Request</h3>
                <div className="space-y-3">
                  <textarea
                    value={userRequest}
                    onChange={(e) => setUserRequest(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Describe what you want the AI to draw...

Examples:
• Draw a free-body diagram for a block on an inclined plane
• Create a coordinate plane with the function y = x²
• Draw a chemical reaction diagram
• Sketch a circuit with a battery and resistor`}
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                  />
                  <button
                    onClick={handleAIRequest}
                    disabled={isLoading || !userRequest.trim()}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Generate Drawing</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">How it works:</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Describe what you want drawn</li>
                  <li>• AI analyzes your request</li>
                  <li>• Generates appropriate shapes and text</li>
                  <li>• Perfect for diagrams, graphs, and sketches</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Canvas Panel */}
          <div className="w-full lg:w-2/3 flex flex-col items-center justify-start mt-10 lg:mt-20 lg:ml-12">
            <div className="flex justify-center items-start w-full h-full min-h-[700px]">
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="border-2 border-gray-300 rounded-lg shadow-lg bg-white dark:bg-gray-900 dark:border-gray-700"
                style={{ display: 'block', margin: '0 auto' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 