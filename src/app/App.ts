import { ROUTES } from './routes';
import { Router } from './Router';

import { Page404 } from '../pages/404/Page404';
import { Page500 } from '../pages/500/Page500';
import { LoginPage } from '../pages/LoginPage/LoginPage';

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

    this.router.init();
  }

  render(): void {}
}
