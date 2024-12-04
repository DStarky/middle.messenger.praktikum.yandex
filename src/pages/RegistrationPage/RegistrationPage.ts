import type { Router } from '../../app/Router';
import { ROUTES } from '../../app/routes';
import { BasePage } from '../basePage';

const template = `
    <main class="screen-center login-page">
      <form class="form-container" id="registration-form">
        <div class="form-container__title">{{> CardTitle text="Регистрация"}}</div>
        <div class="form-container__inputs">
          {{> FloatingLabelInput type="text" id="email" name="email" label="Почта" value=""}}
          {{> FloatingLabelInput type="text" id="username" name="username" label="Логин" value=""}}
          {{> FloatingLabelInput type="text" id="firstname" name="firstname" label="Имя" value=""}}
          {{> FloatingLabelInput type="text" id="lastname" name="lastname" label="Фамилия" value=""}}
          {{> FloatingLabelInput type="text" id="phone" name="phone" label="Телефон" value=""}}
          {{> FloatingLabelInput type="password" id="password" name="password" label="Пароль" value=""}}
          {{> FloatingLabelInput type="password" id="repeatPassword" name="repeatPassword" label="Пароль (ещё раз)" value=""}}
        </div>
        <div class="form-container__links">
          {{> Button type="submit" text="Зарегистрироваться" className="w-full"}}
          {{> Link href="${ROUTES.LOGIN}" text="Войти"}}
         </div>
      </form>
    </main>
`;

export class RegistrationPage extends BasePage {
  private router: Router;
  constructor(router: Router) {
    super(template);
    this.router = router;
    this.addEventListeners();
  }

  addEventListeners() {
    document.addEventListener('submit', event => {
      const form = event.target as HTMLFormElement;
      if (form.id === 'registration-form') {
        event.preventDefault();
        // потом сюда надо будет добавить валидацию формы

        // const formData = new FormData(form);
        // const email = formData.get('email') as string;
        // const username = formData.get('username') as string;
        // const firstname = formData.get('firstname') as string;
        // const lastname = formData.get('lastname') as string;
        // const phone = formData.get('phone') as string;
        // const password = formData.get('password') as string;

        this.router.navigate(ROUTES.CHATS);
      }
    });
  }
}
