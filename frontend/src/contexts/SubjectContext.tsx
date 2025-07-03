import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiService } from '../services/apiService'

export interface Subject {
  name: string
  description: string
  topics: string[]
  examples: string[]
}

interface SubjectContextType {
  subjects: Subject[]
  selectedSubject: string | null
  setSelectedSubject: (subject: string | null) => void
  loading: boolean
  error: string | null
  getSubjectByName: (name: string) => Subject | undefined
}

const SubjectContext = createContext<SubjectContextType | undefined>(undefined)

export function SubjectProvider({ children }: { children: ReactNode }) {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSubjects()
  }, [])

  const fetchSubjects = async () => {
    try {
      setLoading(true)
      const data = await apiService.getSubjects()
      setSubjects(data)
      setError(null)
    } catch (err) {
      setError('Failed to load subjects')
      console.error('Error fetching subjects:', err)
    } finally {
      setLoading(false)
    }
  }

  const getSubjectByName = (name: string): Subject | undefined => {
    return subjects.find(subject => subject.name === name)
  }

  const value: SubjectContextType = {
    subjects,
    selectedSubject,
    setSelectedSubject,
    loading,
    error,
    getSubjectByName
  }

  return (
    <SubjectContext.Provider value={value}>
      {children}
    </SubjectContext.Provider>
  )
}

export function useSubjects() {
  const context = useContext(SubjectContext)
  if (context === undefined) {
    throw new Error('useSubjects must be used within a SubjectProvider')
  }
  return context
} 