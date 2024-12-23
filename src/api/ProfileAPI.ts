import { DEFAULT_PROFILE } from '../consts/ProfileData';
import type { ProfileData, UpdateProfileData } from '../types/Profile';

let mockProfileData: ProfileData = { ...DEFAULT_PROFILE };

export class ProfileAPI {
  public static fetchProfile(): Promise<ProfileData> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ ...mockProfileData });
      }, 500);
    });
  }

  public static updateProfile(data: UpdateProfileData): Promise<ProfileData> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!data.email || !data.login) {
          reject(new Error('Некорректные данные профиля.'));
          return;
        }

        mockProfileData = { ...mockProfileData, ...data };
        resolve({ ...mockProfileData });
      }, 500);
    });
  }

  public static updateAvatar(avatarUrl: string): Promise<ProfileData> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!avatarUrl) {
          reject(new Error('Некорректный URL аватара.'));
          return;
        }

        mockProfileData.avatar = avatarUrl;
        resolve({ ...mockProfileData });
      }, 500);
    });
  }
}
