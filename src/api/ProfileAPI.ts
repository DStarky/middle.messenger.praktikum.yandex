import { BaseAPI } from './BaseAPI';
import type {
  ProfileData,
  UpdatePasswordData,
  UpdateProfileData,
} from '../types/Profile';
import type { ErrorResponse } from '../types/common';
import { API_URL } from '../consts/URLs';
import { HTTPTransport } from '../app/HTTPTransport';

export class ProfileAPI extends BaseAPI {
  private host = API_URL;
  private http = new HTTPTransport();
  public fetchProfile(): Promise<ProfileData> {
    return this.http.get(`${this.host}auth/user`);
  }
  public updateProfile(
    data: UpdateProfileData,
  ): Promise<ProfileData | ErrorResponse> {
    return this.http.put(`${this.host}user/profile`, {
      data,
    });
  }
  public updateAvatar(file: File): Promise<ProfileData | ErrorResponse> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.put(`${this.host}user/profile/avatar`, {
      data: formData,
    });
  }
  public updatePassword(
    data: UpdatePasswordData,
  ): Promise<string | ErrorResponse> {
    return this.http.put(`${this.host}user/password`, {
      data,
    });
  }
  public getUserById(userId: number): Promise<ProfileData | ErrorResponse> {
    return this.http.get(`${this.host}user/${userId}`);
  }
  public searchUsers(login: string): Promise<ProfileData[] | ErrorResponse> {
    return this.http.post(`${this.host}user/search`, {
      data: { login },
    });
  }
}
