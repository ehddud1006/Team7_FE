export interface EmailCodeCheckRequest {
  email: string;
  code: string;
}

export interface JoinRequest {
  email: string;
  name: string;
  password: string;
  passwordConfirm: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface PasswordChangeRequest {
  email: string;
  password: string;
}

export interface EmailCheckResponse {
  success: boolean;
  code: number;
  message: string;
  result: null;
}

export interface EmailCodeResponse {
  success: boolean;
  code: number;
  message: string;
  result: null;
}

export interface EmailCodeCheckResponse {
  success: boolean;
  code: number;
  message: string;
  result: { email: string } | null;
}

export interface JoinResponse {
  success: boolean;
  code: number;
  message: string;
  result: null;
}

export interface LoginResponse {
  success: boolean;
  code: number;
  message: string;
  result: { accessToken: string } | null;
}

export interface PasswordChangeResponse {
  success: boolean;
  code: number;
  message: string;
  result: null;
}
