const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface ChatRequest {
  message: string
  subject?: string
  context?: string
}

export interface ChatResponse {
  response: string
  subject: string
  latex_expressions: string[]
  suggestions: string[]
}

export interface MathRequest {
  expression: string
  operation?: string
  variables?: string[]
  values?: Record<string, number>
}

export interface MathResponse {
  result: string
  steps: string[]
  latex: string
  operation: string
  variables: string[]
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    console.log(`🌐 Frontend making request to: ${url}`)
    console.log(`📝 Request options:`, options)
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, defaultOptions)
      
      console.log(`📡 Response status: ${response.status}`)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`❌ HTTP error: ${response.status} - ${errorText}`)
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log(`✅ Response data:`, data)
      return data
    } catch (error) {
      console.error('❌ API request failed:', error)
      throw error
    }
  }

  // Chat endpoints
  async sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
    return this.request<ChatResponse>('/api/chat', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  // Math solver endpoints
  async solveMath(request: MathRequest): Promise<MathResponse> {
    return this.request<MathResponse>('/api/solve', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async differentiateExpression(request: MathRequest): Promise<MathResponse> {
    return this.request<MathResponse>('/api/differentiate', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async integrateExpression(request: MathRequest): Promise<MathResponse> {
    return this.request<MathResponse>('/api/integrate', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async simplifyExpression(request: MathRequest): Promise<MathResponse> {
    return this.request<MathResponse>('/api/simplify', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async evaluateExpression(request: MathRequest): Promise<MathResponse> {
    return this.request<MathResponse>('/api/evaluate', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async getMathOperations(): Promise<{
    operations: string[]
    examples: Record<string, string>
  }> {
    return this.request('/api/operations')
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.request('/health')
  }
}

export const apiService = new ApiService() 