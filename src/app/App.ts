import { ROUTES } from './routes';
import { router } from './Router';

import { Page404 } from '../pages/404/Page404';
import { Page500 } from '../pages/500/Page500';
import { LoginPage } from '../pages/LoginPage/LoginPage';
import { RegistrationPage } from '../pages/RegistrationPage/RegistrationPage';
import { ChatsPage } from '../pages/ChatsPage/ChatsPage';
import { ProfilePage } from '../pages/ProfilePage/ProfilePage';
import type Block from './Block';
import store from './Store';
import AuthController from '../controllers/AuthController';

function renderPage(page: Block) {
  const content = page.getContent();
  if (content) {
    router.render(content);
  }
}

export class App {
  constructor() {
    router.addRoute(ROUTES.LOGIN, () => {
      const state = store.getState();
      if (state.user) {
        router.navigate(ROUTES.CHATS);
        return;
      }

      const loginPage = new LoginPage();
      renderPage(loginPage);
    });

    router.addRoute(ROUTES.REGISTRATION, () => {
      const state = store.getState();
      if (state.user) {
        router.navigate(ROUTES.CHATS);
        return;
      }

      const registrationPage = new RegistrationPage();
      renderPage(registrationPage);
    });

    router.addRoute(ROUTES.CHATS, () => {
      const state = store.getState();
      if (!state.user) {
        router.navigate(ROUTES.LOGIN);
        return;
      }

      const chatsPage = new ChatsPage();
      renderPage(chatsPage);
    });

    router.addRoute(ROUTES.PROFILE, () => {
      const state = store.getState();
      if (!state.user) {
        router.navigate(ROUTES.LOGIN);
        return;
      }

      const profilePage = new ProfilePage({});
      renderPage(profilePage);
    });

    router.addRoute(ROUTES.NOT_FOUND, () => {
      const notFoundPage = new Page404();
      renderPage(notFoundPage);
    });

    router.addRoute(ROUTES.ERROR_500, () => {
      const error500Page = new Page500();
      renderPage(error500Page);
    });

    router.addRoute('/', () => {
      const state = store.getState();
      if (state.user) {
        router.navigate(ROUTES.CHATS);
      } else {
        router.navigate(ROUTES.LOGIN);
      }
    });

    AuthController.getUserInfo()
      .then(() => {
        router.init();
      })
      .catch(() => {
        router.init();
      });
  }

  render(): void {}
}
