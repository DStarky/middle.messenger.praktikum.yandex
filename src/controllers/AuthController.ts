import { AuthAPI } from '../api/AuthAPI';
import store from '../app/Store';
import { router } from '../app/Router';
import { ROUTES } from '../app/routes';
import type { UserData } from '../types/AuthResponses';

class AuthController {
  private api: AuthAPI;

  constructor() {
    this.api = new AuthAPI();
  }

  public async signIn(login: string, password: string): Promise<void> {
    try {
      store.set('error', null);
      store.set('isLoading', true);

      const loginRes = await this.api.signIn({ login, password });

      if (typeof loginRes === 'string') {
        if (loginRes.toUpperCase() === 'OK') {
          const user = await this.api.getUser();
          store.set('user', user);
          router.navigate(ROUTES.CHATS);
        } else {
          store.set('error', loginRes);
        }

        return;
      }

      if ('reason' in loginRes) {
        store.set('error', loginRes.reason);
        return;
      }

      if ('message' in loginRes && loginRes.message.toUpperCase() === 'OK') {
        const user = await this.api.getUser();
        store.set('user', user);
        router.navigate(ROUTES.CHATS);
      } else {
        store.set('error', 'Неизвестный ответ от сервера');
      }
    } catch (error: unknown) {
      console.error('Sign In Error:', error);
      store.set('error', (error as Error).message);
    } finally {
      store.set('isLoading', false);
    }
  }

  public async signUp(
    first_name: string,
    second_name: string,
    login: string,
    email: string,
    password: string,
    phone: string,
  ): Promise<void> {
    try {
      store.set('error', null);
      store.set('isLoading', true);

      const signUpRes = await this.api.signUp({
        first_name,
        second_name,
        login,
        email,
        password,
        phone,
      });

      if (typeof signUpRes === 'string') {
        if (signUpRes.toUpperCase() === 'OK') {
          const user = await this.api.getUser();
          store.set('user', user);
          router.navigate(ROUTES.CHATS);
        } else {
          store.set('error', signUpRes);
        }

        return;
      }

      if ('reason' in signUpRes) {
        store.set('error', signUpRes.reason);
        return;
      }

      if ('id' in signUpRes) {
        const user = await this.api.getUser();
        store.set('user', user);
        router.navigate(ROUTES.CHATS);
      } else {
        store.set('error', 'Неизвестный ответ от сервера');
      }
    } catch (error: unknown) {
      console.error('Sign Up Error:', error);
      store.set('error', (error as Error).message);
    } finally {
      store.set('isLoading', false);
    }
  }

  public async getUserInfo(): Promise<UserData | null> {
    try {
      store.set('isLoading', true);
      const user = await this.api.getUser();
      store.set('user', user);
      return user;
    } catch (error: unknown) {
      console.error('getUserInfo error:', error);
      store.set('user', null);
      throw error;
    } finally {
      store.set('isLoading', false);
    }
  }

  public async logout(): Promise<void> {
    try {
      store.set('error', null);
      store.set('isLoading', true);

      const logoutRes = await this.api.logout();

      if (typeof logoutRes === 'string') {
        if (logoutRes.toUpperCase() === 'OK') {
          store.set('user', null);
          router.navigate(ROUTES.LOGIN);
        } else {
          store.set('error', logoutRes);
        }

        return;
      }

      if ('reason' in logoutRes) {
        store.set('error', logoutRes.reason);
        return;
      }

      store.set('error', 'Неизвестный ответ от сервера');
    } catch (error: unknown) {
      console.error('Logout error:', error);
      store.set('error', (error as Error).message);
    } finally {
      store.set('isLoading', false);
    }
  }
}

export default new AuthController();
