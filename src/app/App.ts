import Handlebars from 'handlebars';
import { ChatsPage } from '../pages/ChatsPage';
import { ErrorPage } from '../pages/ErrorPage';
import { LoginPage } from '../pages/LoginPage';
import { ProfilePage } from '../pages/ProfilePage';
import { RegistrationPage } from '../pages/RegistrationPage';
import { Router } from './Router';

import { Link } from '../components/common/Link.ts';
import { Avatar } from '../components/common/Avatar.ts';
import { Button } from '../components/common/Button.ts';
import { FixedSidebar } from '../components/common/FixedSidebar.ts';
import { FloatingLabelInput } from '../components/common/FloatingLabelInput.ts';
import { SimpleInput } from '../components/common/SimpleInput.ts';
import '../helpers/handlebarsHelpers.ts';

Handlebars.registerPartial('Link', Link);
Handlebars.registerPartial('FloatingLabelInput', FloatingLabelInput);
Handlebars.registerPartial('SimpleInput', SimpleInput);
Handlebars.registerPartial('Button', Button);
Handlebars.registerPartial('FixedSidebar', FixedSidebar);
Handlebars.registerPartial('Avatar', Avatar);

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
