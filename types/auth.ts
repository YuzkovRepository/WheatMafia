export interface LoginRequest {
  login: string
  password: string
}

export interface LoginResponse {
  token: string
  refreshToken?: string
  user?: User
}

export interface User {
  id: number
  login: string
  email: string
  firstName?: string
  lastName?: string
  balance?: number
  roles?: string[]
}

export interface RegisterRequest {
  login: string
  password: string
  email: string
  firstName?: string
  lastName?: string
}

export interface RegisterResponse {
  id: number
  login: string
  email: string
  firstName?: string
  lastName?: string
}