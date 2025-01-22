import AuthController from '../controllers/AuthController';
import { Page404 } from '../pages/404/Page404';
import { Page500 } from '../pages/500/Page500';
import { ChatsPage } from '../pages/ChatsPage/ChatsPage';
import { LoginPage } from '../pages/LoginPage/LoginPage';
import { ProfilePage } from '../pages/ProfilePage/ProfilePage';
import { RegistrationPage } from '../pages/RegistrationPage/RegistrationPage';
import type Block from './Block';
import { router } from './Router';
import type { Route } from './routes';
import { protectedRoutes, publicRoutes, ROUTES } from './routes';
import store from './Store';

export class App {
  constructor() {
    this.initProtectedRoutes();
    this.initPublicRoutes();
    this.initErrorRoutes();

    AuthController.getUserInfo().finally(() => {
      router.init();
      this.checkInitialRoute();
    });
  }

  private initProtectedRoutes() {
    protectedRoutes.forEach(path => {
      router.addRoute(path, async () => {
        try {
          if (path === ROUTES.CHATS) {
            renderPage(new ChatsPage());
          } else {
            renderPage(new ProfilePage({}));
          }
        } catch (error) {
          console.error(error);
          store.set('user', null);
          router.navigate(ROUTES.MAIN);
        }
      });
    });
  }

  private initPublicRoutes() {
    publicRoutes.forEach(path => {
      router.addRoute(path, async () => {
        try {
          const user = await AuthController.getUserInfo();
          if (user) {
            router.navigate(ROUTES.CHATS);
            return;
          }

          if (path === ROUTES.REGISTRATION) {
            renderPage(new RegistrationPage());
          } else {
            renderPage(new LoginPage());
          }
        } catch (error) {
          console.error(error);
          if (path === ROUTES.REGISTRATION) {
            renderPage(new RegistrationPage());
          } else {
            renderPage(new LoginPage());
          }
        }
      });
    });
  }

  private initErrorRoutes() {
    router.addRoute(ROUTES.NOT_FOUND, () => renderPage(new Page404()));
    router.addRoute(ROUTES.ERROR_500, () => renderPage(new Page500()));
  }

  private checkInitialRoute() {
    const currentPath = window.location.pathname as Route;
    if (!Object.values(ROUTES).includes(currentPath)) {
      router.navigate(ROUTES.NOT_FOUND);
    }
  }

  render(): void {}
}

function renderPage(page: Block) {
  const content = page.getContent();
  if (content) {
    router.render(content);
  }
}
