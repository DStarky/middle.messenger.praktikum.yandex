import { ROUTES } from './routes';
import { Router } from './Router';

import { Page404 } from '../pages/404/Page404';
import { Page500 } from '../pages/500/Page500';
import { LoginPage } from '../pages/LoginPage/LoginPage';
import { RegistrationPage } from '../pages/RegistrationPage/RegistrationPage';
import { ChatsPage } from '../pages/ChatsPage/ChatsPage';
import { ProfilePage } from '../pages/ProfilePage/ProfilePage';

export class App {
  private router: Router;

  constructor() {
    this.router = new Router('#app');

    this.router.addRoute(ROUTES.NOT_FOUND, () => {
      const page = new Page404();
      this.router.render(page.getContent()!);
    });

    this.router.addRoute(ROUTES.ERROR_500, () => {
      const page = new Page500();
      this.router.render(page.getContent()!);
    });

    this.router.addRoute(ROUTES.LOGIN, () => {
      const page = new LoginPage(this.router);
      this.router.render(page.getContent()!);
    });

    this.router.addRoute(ROUTES.REGISTRATION, () => {
      const page = new RegistrationPage(this.router);
      this.router.render(page.getContent()!);
    });

    this.router.addRoute(ROUTES.CHATS, () => {
      const page = new ChatsPage(this.router);
      this.router.render(page.getContent()!);
    });

    this.router.addRoute(ROUTES.PROFILE, () => {
      const page = new ProfilePage();
      this.router.render(page.getContent()!);
    });

    this.router.init();
  }

  render(): void {}
}
