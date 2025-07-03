import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { BookOpen, ArrowLeft, CheckCircle } from 'lucide-react'
import { useSubjects } from '../contexts/SubjectContext'

export default function SubjectPage() {
  const { subjectName } = useParams<{ subjectName: string }>()
  const { getSubjectByName } = useSubjects()
  const subject = subjectName ? getSubjectByName(subjectName) : null

  if (!subject) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card text-center py-12 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 transition-colors duration-300">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Subject Not Found</h2>
          <p className="text-gray-600 mb-4">The requested subject could not be found.</p>
          <Link to="/" className="btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Chat
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 transition-colors duration-300">
        <div className="flex items-center space-x-3 mb-6">
          <Link to="/" className="btn-secondary">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center space-x-3">
            <BookOpen className="w-6 h-6 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">{subject.name}</h1>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed">{subject.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Topics Covered</h2>
            <div className="space-y-3">
              {subject.topics.map((topic, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Example Problems</h2>
            <div className="space-y-3">
              {subject.examples.map((example, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 text-sm">{example}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/chat" className="btn-primary text-center">
              Start Chatting
            </Link>
            <Link to="/math-solver" className="btn-secondary text-center">
              Try Math Solver
            </Link>
            <Link to="/whiteboard" className="btn-secondary text-center">
              Open Whiteboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 