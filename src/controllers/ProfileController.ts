import { ProfileAPI } from '../api/ProfileAPI';
import store from '../app/Store';
import type {
  ProfileData,
  UpdateProfileData,
  UpdatePasswordData,
} from '../types/Profile';

class ProfileController {
  private api: ProfileAPI;

  constructor() {
    this.api = new ProfileAPI();
  }

  public async fetchProfile(
    onLoading: (loading: boolean) => void,
    onError: (error: string | null) => void,
    onSuccess: (data: ProfileData) => void,
  ): Promise<void> {
    try {
      onLoading(true);
      onError(null);

      const profile = await this.api.fetchProfile();
      store.set('user', profile);
      onSuccess(profile);
    } catch (error: unknown) {
      const errMsg = (error as Error).message;
      console.error('fetchProfile error:', errMsg);
      onError(errMsg);
    } finally {
      onLoading(false);
    }
  }

  public async updateProfile(
    data: UpdateProfileData,
    onLoading: (loading: boolean) => void,
    onError: (error: string | null) => void,
    onSuccess: (data: ProfileData) => void,
  ): Promise<void> {
    try {
      onLoading(true);
      onError(null);

      const response = await this.api.updateProfile(data);

      if ('reason' in response) {
        onError(response.reason as string);
        return;
      }

      store.set('user', response);
      onSuccess(response);
    } catch (error: unknown) {
      const errMsg = (error as Error).message;
      console.error('updateProfile error:', errMsg);
      onError(errMsg);
    } finally {
      onLoading(false);
    }
  }

  public async updateAvatar(
    file: File,
    onLoading: (loading: boolean) => void,
    onError: (error: string | null) => void,
    onSuccess: (data: ProfileData) => void,
  ): Promise<void> {
    try {
      onLoading(true);
      onError(null);

      const response = await this.api.updateAvatar(file);

      if ('reason' in response) {
        onError(response.reason as string);
        return;
      }

      store.set('user', response);
      onSuccess(response);
    } catch (error: unknown) {
      console.error('updateAvatar error:', error);
      onError((error as Error).message);
    } finally {
      onLoading(false);
    }
  }

  public async updatePassword(
    data: UpdatePasswordData,
    onLoading: (loading: boolean) => void,
    onError: (error: string | null) => void,
    onSuccess: () => void,
  ): Promise<void> {
    try {
      onLoading(true);
      onError(null);

      const response = await this.api.updatePassword(data);

      if (typeof response === 'string') {
        if (response.toUpperCase() === 'OK') {
          onSuccess();
        } else {
          onError(response);
        }

        return;
      }

      if ('reason' in response) {
        onError(response.reason);
        return;
      }

      onError('Неизвестный ответ при смене пароля');
    } catch (error: unknown) {
      console.error('updatePassword error:', error);
      onError((error as Error).message);
    } finally {
      onLoading(false);
    }
  }
}

export default new ProfileController();
