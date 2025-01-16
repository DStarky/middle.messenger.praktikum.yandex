export interface SignUpSuccessResponse {
  id: number;
}

export interface SignInSuccessResponse {
  message: string;
}

export interface UserData {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  phone: string;
  login: string;
  avatar: string;
  email: string;
}
