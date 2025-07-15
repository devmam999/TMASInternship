import React from "react"
import { useState, useRef, useEffect } from 'react'
import { Send, Trash2, MessageCircle } from 'lucide-react'
import { useChat } from '../contexts/ChatContext'
import { apiService } from '../services/apiService'
import ChatMessage from '../components/ChatMessage'
import SuggestionButton from '../components/SuggestionButton'

export default function ChatPage() {
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, addMessage, clearMessages, isLoading, setIsLoading } = useChat()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = inputMessage.trim()
    setInputMessage('')
    setIsLoading(true)

    // Add user message
    addMessage({
      content: userMessage,
      sender: 'user'
    })

    try {
      // Build full conversation context
      const conversationContext = messages
        .map((msg) => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n')
      const fullContext = `${conversationContext}\nUser: ${userMessage}`

      // Send to AI
      const response = await apiService.sendChatMessage({
        message: userMessage,
        context: fullContext
      })

      // Add AI response
      addMessage({
        content: response.response,
        sender: 'assistant',
        latexExpressions: response.latex_expressions,
        suggestions: response.suggestions
      })
    } catch (error) {
      console.error('Error sending message:', error)
      addMessage({
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'assistant'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
  }

  return (
    <div className="max-w-4xl mx-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="card bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 transition-colors duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-6 h-6 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">AI Study Assistant</h1>
          </div>
          <button
            onClick={clearMessages}
            className="btn-secondary flex items-center space-x-2 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 dark:border-gray-700"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Chat</span>
          </button>
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto chat-container mb-6 bg-gray-50 dark:bg-gray-900 dark:text-gray-100 rounded-lg transition-colors duration-300">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Welcome to AI Study Assistant!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Ask me anything about AP Calculus, Physics, Chemistry, or AMC Math.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Try asking:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <SuggestionButton
                    suggestion="How do I find the derivative of x²·sin(x)?"
                    onClick={handleSuggestionClick}
                  />
                  <SuggestionButton
                    suggestion="Calculate the acceleration of a block on an inclined plane"
                    onClick={handleSuggestionClick}
                  />
                  <SuggestionButton
                    suggestion="Balance the chemical equation Fe + O₂ → Fe₂O₃"
                    onClick={handleSuggestionClick}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="chat-message assistant">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about math or science..."
              className="input-field resize-none h-12 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
              rows={1}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Suggestions */}
        {messages.length > 0 && messages[messages.length - 1].suggestions && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 dark:text-gray-100 mb-2">Suggested follow-ups:</p>
            <div className="flex flex-wrap gap-2">
              {messages[messages.length - 1].suggestions?.map((suggestion, index) => (
                <SuggestionButton
                  key={index}
                  suggestion={suggestion}
                  onClick={handleSuggestionClick}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 