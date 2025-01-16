import { BaseAPI } from './BaseAPI';
import type {
  ProfileData,
  UpdatePasswordData,
  UpdateProfileData,
} from '../types/Profile';
import type { ErrorResponse } from '../types/Common';

export class ProfileAPI extends BaseAPI {
  private host = 'https://ya-praktikum.tech/api/v2';
  // [TODO] Добавлять из env

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      return response.json() as Promise<T>;
    } else {
      // Возможно, сервер вернёт простой текст (OK или ошибка)
      const text = await response.text();
      return text as unknown as T;
    }
  }

  public fetchProfile(): Promise<ProfileData> {
    return fetch(`${this.host}/auth/user`, {
      method: 'GET',
      credentials: 'include',
    }).then(async response => {
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      return response.json() as Promise<ProfileData>;
    });
  }

  public updateProfile(
    data: UpdateProfileData,
  ): Promise<ProfileData | ErrorResponse> {
    return fetch(`${this.host}/user/profile`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(this.handleResponse<ProfileData | ErrorResponse>);
  }

  public updateAvatar(file: File): Promise<ProfileData | ErrorResponse> {
    const formData = new FormData();
    formData.append('avatar', file);

    return fetch(`${this.host}/user/profile/avatar`, {
      method: 'PUT',
      credentials: 'include',
      body: formData,
    }).then(this.handleResponse<ProfileData | ErrorResponse>);
  }

  public updatePassword(
    data: UpdatePasswordData,
  ): Promise<string | ErrorResponse> {
    return fetch(`${this.host}/user/password`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(this.handleResponse<string | ErrorResponse>);
  }

  public getUserById(userId: number): Promise<ProfileData | ErrorResponse> {
    return fetch(`${this.host}/user/${userId}`, {
      method: 'GET',
      credentials: 'include',
    }).then(this.handleResponse<ProfileData | ErrorResponse>);
  }

  public searchUsers(login: string): Promise<ProfileData[] | ErrorResponse> {
    return fetch(`${this.host}/user/search`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login }),
    }).then(this.handleResponse<ProfileData[] | ErrorResponse>);
  }
}
