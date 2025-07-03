import React, { useEffect } from 'react'
import { ChatMessage as ChatMessageType } from '../contexts/ChatContext'

interface ChatMessageProps {
  message: ChatMessageType
}

export default function ChatMessage({ message }: ChatMessageProps) {
  useEffect(() => {
    // Re-render MathJax when message content changes
    setTimeout(() => {
      if ((window as any).MathJax) {
        (window as any).MathJax.typesetPromise()
      }
    }, 100) // Small delay to ensure DOM is updated
  }, [message.content])

  // Process markdown formatting
  const processContent = (content: string) => {
    let processed = content
    
    // Convert markdown bold to HTML
    processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    
    // Convert markdown italic to HTML
    processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    return processed
  }

  return (
    <div className={`chat-message ${message.sender}`}>
      <div className="flex items-start space-x-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          message.sender === 'user' 
            ? 'bg-primary-600 text-white' 
            : 'bg-gray-600 text-white'
        }`}>
          {message.sender === 'user' ? 'U' : 'AI'}
        </div>
        <div className="flex-1">
          <div className={
            `prose prose-sm max-w-none rounded-lg p-3 mb-1 transition-colors duration-300 dark:prose-invert ` +
            (message.sender === 'user'
              ? 'bg-primary-100 dark:bg-primary-800 text-gray-900 dark:text-gray-100'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100')
          }>
            <div 
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: processContent(message.content) }}
            />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  )
} 