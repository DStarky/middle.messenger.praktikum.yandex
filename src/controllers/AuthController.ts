import { AuthAPI } from '../api/AuthAPI';
import store from '../app/Store';
import { Router } from '../app/Router';
import { ROUTES } from '../app/routes';

class AuthController {
  private api: AuthAPI;
  private router: Router;

  constructor() {
    this.api = new AuthAPI();
    this.router = new Router('#app');
  }

  public async signIn(login: string, password: string) {
    try {
      store.set('error', null); // Сбрасываем ошибку перед запросом
      store.set('isLoading', true);

      await this.api.signIn({ login, password });
      const user = await this.api.getUser();

      store.set('user', user);
      this.router.navigate(ROUTES.CHATS);
    } catch (error: unknown) {
      console.error('Sign In Error:', error);
      store.set('error', (error as Error).message);
      // Можете здесь не делать alert, а вывести ошибку через Store
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

      await this.api.signUp({
        first_name,
        second_name,
        login,
        email,
        password,
        phone,
      });
      const user = await this.api.getUser();

      store.set('user', user);
      this.router.navigate(ROUTES.CHATS);
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
      // Может бросить ошибку выше, чтобы перехватить в route guard
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
      this.router.navigate(ROUTES.LOGIN);
    } catch (error: unknown) {
      console.error('Logout error', error);
      store.set('error', (error as Error).message);
    } finally {
      store.set('isLoading', false);
    }
  }
}

export default new AuthController();
