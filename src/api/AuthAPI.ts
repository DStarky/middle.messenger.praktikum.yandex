import type {
  SignUpSuccessResponse,
  SignInSuccessResponse,
  UserData,
} from '../types/AuthResponses';
import type { ErrorResponse } from '../types/common';
import { BaseAPI } from './BaseAPI';

interface SignInData {
  login: string;
  password: string;
}

interface SignUpData {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  phone: string;
  password: string;
}

export class AuthAPI extends BaseAPI {
  private host = 'https://ya-praktikum.tech/api/v2';
  // TODO: переделать на переменную окружения

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      return response.json() as Promise<T>;
    } else {
      const text = await response.text();
      return text as unknown as T;
    }
  }

  public signUp(
    data: SignUpData,
  ): Promise<SignUpSuccessResponse | ErrorResponse | string> {
    return fetch(`${this.host}/auth/signup`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(
      this.handleResponse<SignUpSuccessResponse | ErrorResponse | string>,
    );
  }

  public signIn(
    data: SignInData,
  ): Promise<SignInSuccessResponse | ErrorResponse | string> {
    return fetch(`${this.host}/auth/signin`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(
      this.handleResponse<SignInSuccessResponse | ErrorResponse | string>,
    );
  }

  public getUser(): Promise<UserData> {
    return fetch(`${this.host}/auth/user`, {
      method: 'GET',
      credentials: 'include',
    }).then(async response => {
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      return response.json() as Promise<UserData>;
    });
  }

  public logout(): Promise<string | ErrorResponse> {
    return fetch(`${this.host}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    }).then(this.handleResponse<string | ErrorResponse>);
  }
}
