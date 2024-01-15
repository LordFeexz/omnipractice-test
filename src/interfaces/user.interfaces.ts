export interface SignUpInput {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignInInput {
  email: string;
  password: string;
}
