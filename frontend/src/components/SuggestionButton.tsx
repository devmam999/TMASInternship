import React from 'react'

interface SuggestionButtonProps {
  suggestion: string
  onClick: (suggestion: string) => void
}

export default function SuggestionButton({ suggestion, onClick }: SuggestionButtonProps) {
  return (
    <button
      onClick={() => onClick(suggestion)}
      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors duration-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
    >
      {suggestion}
    </button>
  )
} 