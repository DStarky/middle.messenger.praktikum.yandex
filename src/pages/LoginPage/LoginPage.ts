import type { Router } from '../../app/Router';
import { ROUTES } from '../../app/routes';
import { BasePage } from '../basePage';

const template = `
    <main class="screen-center login-page">
      <form class="form-container" id="login-form">
        <div class="form-container__title">{{> CardTitle text="Вход"}}</div>
        <div class="form-container__inputs">
          {{> FloatingLabelInput type="text" id="login" name="login" label="Логин" value=""}}
          {{> FloatingLabelInput type="password" id="password" name="password" label="Пароль" value=""}}
        </div>
        <div class="form-container__links">
          {{> Button type="submit" text="Войти" className="w-full"}}
          {{> Link href="${ROUTES.REGISTRATION}" text="Нет аккаунта?"}}
         </div>
      </form>
    </main>
`;

export class LoginPage extends BasePage {
  private router: Router;

  constructor(router: Router) {
    super(template);
    this.router = router;
    this.addEventListeners();
  }

  addEventListeners() {
    document.addEventListener('submit', event => {
      const form = event.target as HTMLFormElement;
      if (form.id === 'login-form') {
        event.preventDefault();
        // потом сюда надо будет добавить валидацию формы

        // const formData = new FormData(form);
        // const username = formData.get('login') as string;
        // const password = formData.get('password') as string;

        this.router.navigate(ROUTES.CHATS);
      }
    });
  }
}
