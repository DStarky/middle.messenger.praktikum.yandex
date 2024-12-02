import Handlebars from 'handlebars';
import { ChatsPage } from '../pages/ChatsPage';
import { ErrorPage } from '../pages/ErrorPage';
import { LoginPage } from '../pages/LoginPage/LoginPage.ts';
import { ProfilePage } from '../pages/ProfilePage';
import { RegistrationPage } from '../pages/RegistrationPage/RegistrationPage.ts';
import { Router } from './Router';

import { Link } from '../components/common/Link/Link.ts';
import { Avatar } from '../components/common/Avatar/Avatar.ts';
import { Button } from '../components/common/Button/Button.ts';
import { Sidebar } from '../components/common/Sidebar/Sidebar.ts';
import { FloatingLabelInput } from '../components/common/FloatingLabelInput/FloatingLabelInput.ts';
import { SimpleInput } from '../components/common/SimpleInput/SimpleInput.ts';
import { CardTitle } from '../components/common/CardTitle/CardTitle.ts';
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

    this.router.addRoute('/login', () =>
      this.router.render(new LoginPage().render()),
    );
    this.router.addRoute('/registration', () =>
      this.router.render(new RegistrationPage().render()),
    );
    this.router.addRoute('/chats', () =>
      this.router.render(new ChatsPage().render()),
    );
    this.router.addRoute('/profile', () =>
      this.router.render(new ProfilePage().render()),
    );
    this.router.addRoute('/404', () =>
      this.router.render(new ErrorPage().render()),
    );

    this.router.init();
  }

  render(): void {
    const path = window.location.pathname;
    this.router.navigate(path);
  }
}
