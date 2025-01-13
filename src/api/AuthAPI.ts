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

  public signUp(data: SignUpData) {
    return fetch(`${this.host}/auth/signup`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(response => response.json());
  }

  public signIn(data: SignInData) {
    return fetch(`${this.host}/auth/signin`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(response => {
      return response.json();
    });
  }

  public getUser() {
    return fetch(`${this.host}/auth/user`, {
      method: 'GET',
      credentials: 'include',
    }).then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(text);
        });
      }

      return response.json();
    });
  }

  public logout() {
    return fetch(`${this.host}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    }).then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(text);
        });
      }

      return response;
    });
  }
}
