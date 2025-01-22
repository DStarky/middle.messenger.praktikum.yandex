import { BaseAPI } from './BaseAPI';
import { API_URL } from '../consts/URLs';
import type {
  SignUpSuccessResponse,
  SignInSuccessResponse,
  UserData,
} from '../types/AuthResponses';
import type { ErrorResponse } from '../types/common';
import { HTTPTransport } from '../app/HTTPTransport';

interface SignInData extends Record<string, unknown> {
  login: string;
  password: string;
}

interface SignUpData extends Record<string, unknown> {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  phone: string;
  password: string;
}

export class AuthAPI extends BaseAPI {
  private host = API_URL;
  private http = new HTTPTransport();
  public signUp(
    data: SignUpData,
  ): Promise<SignUpSuccessResponse | ErrorResponse | string> {
    return this.http.post(`${this.host}auth/signup`, {
      data,
    });
  }
  public signIn(
    data: SignInData,
  ): Promise<SignInSuccessResponse | ErrorResponse | string> {
    return this.http.post(`${this.host}auth/signin`, {
      data,
    });
  }
  public getUser(): Promise<UserData> {
    return this.http.get(`${this.host}auth/user`);
  }
  public logout(): Promise<string | ErrorResponse> {
    return this.http.post(`${this.host}auth/logout`);
  }
}
