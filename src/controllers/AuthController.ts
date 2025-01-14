import { AuthAPI } from '../api/AuthAPI';
import store from '../app/Store';
import { router } from '../app/Router';
import { ROUTES } from '../app/routes';

class AuthController {
  private api: AuthAPI;

  constructor() {
    this.api = new AuthAPI();
  }

  public async signIn(login: string, password: string) {
    try {
      store.set('error', null);
      store.set('isLoading', true);

      const loginRes = await this.api.signIn({ login, password });

      if (loginRes.reason) {
        if (loginRes.reason === 'Login or password is incorrect') {
          store.set('error', 'Логин или пароль пользователя неверный');
          return;
        }

        store.set('error', loginRes.reason);
        return;
      }

      const user = await this.api.getUser();

      store.set('user', user);
      router.navigate(ROUTES.CHATS);
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
  ) {
    try {
      store.set('error', null);
      store.set('isLoading', true);

      const signUpResponse = await this.api.signUp({
        first_name,
        second_name,
        login,
        email,
        password,
        phone,
      });

      if (signUpResponse?.reason) {
        store.set('error', signUpResponse.reason);
        return;
      }

      const user = await this.api.getUser();
      store.set('user', user);

      router.navigate(ROUTES.CHATS);
    } catch (error: unknown) {
      console.error('Sign Up Error:', error);
      store.set('error', (error as Error).message);
    } finally {
      store.set('isLoading', false);
    }
  }

  public async getUserInfo() {
    try {
      store.set('isLoading', true);
      const user = await this.api.getUser();
      store.set('user', user);
      return user;
    } catch (error: unknown) {
      console.error('getUserInfo error', error);
      store.set('user', null);
      throw error;
    } finally {
      store.set('isLoading', false);
    }
  }

  public async logout() {
    try {
      store.set('error', null);
      store.set('isLoading', true);

      await this.api.logout();
      store.set('user', null);

      router.navigate(ROUTES.LOGIN);
    } catch (error: unknown) {
      console.error('Logout error', error);
      store.set('error', (error as Error).message);
    } finally {
      store.set('isLoading', false);
    }
  }
}

export default new AuthController();
