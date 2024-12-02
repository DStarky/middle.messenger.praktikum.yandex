import type { Route } from './routes.ts';
import { ROUTES, isValidRoute } from './routes.ts';
import { Router } from './Router';

import Handlebars from 'handlebars';
import { LoginPage } from '../pages/LoginPage/LoginPage.ts';
import { RegistrationPage } from '../pages/RegistrationPage/RegistrationPage.ts';
import { Page404 } from '../pages/404/Page404.ts';
import { Page500 } from '../pages/500/Page500.ts';
import { ChatsPage } from '../pages/ChatsPage';
import { ProfilePage } from '../pages/ProfilePage';

import { Avatar } from '../components/common/Avatar/Avatar.ts';
import { Button } from '../components/common/Button/Button.ts';
import { CardTitle } from '../components/common/CardTitle/CardTitle.ts';
import { FloatingLabelInput } from '../components/common/FloatingLabelInput/FloatingLabelInput.ts';
import { Link } from '../components/common/Link/Link.ts';
import { Sidebar } from '../components/common/Sidebar/Sidebar.ts';
import { SimpleInput } from '../components/common/SimpleInput/SimpleInput.ts';
import '../helpers/handlebarsHelpers.ts';

Handlebars.registerPartial('Link', Link);
Handlebars.registerPartial('FloatingLabelInput', FloatingLabelInput);
Handlebars.registerPartial('SimpleInput', SimpleInput);
Handlebars.registerPartial('Button', Button);
Handlebars.registerPartial('Sidebar', Sidebar);
Handlebars.registerPartial('Avatar', Avatar);
Handlebars.registerPartial('CardTitle', CardTitle);

export class App {
  private router: Router;

  constructor() {
    this.router = new Router('#app');

    this.router.addRoute(ROUTES.LOGIN, () =>
      this.router.render(new LoginPage().render()),
    );
    this.router.addRoute(ROUTES.REGISTRATION, () =>
      this.router.render(new RegistrationPage().render()),
    );
    this.router.addRoute(ROUTES.CHATS, () =>
      this.router.render(new ChatsPage().render()),
    );
    this.router.addRoute(ROUTES.PROFILE, () =>
      this.router.render(new ProfilePage().render()),
    );
    this.router.addRoute(ROUTES.NOT_FOUND, () =>
      this.router.render(new Page404().render()),
    );
    this.router.addRoute(ROUTES.ERROR_500, () =>
      this.router.render(new Page500().render()),
    );

    this.router.init();
  }

  render(): void {
    const path = window.location.pathname as Route;
    if (isValidRoute(path)) {
      this.router.navigate(path);
    } else {
      this.router.navigate(ROUTES.NOT_FOUND);
    }
  }
}
