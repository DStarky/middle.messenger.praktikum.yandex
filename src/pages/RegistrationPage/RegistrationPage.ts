import { ROUTES } from '../../app/routes';
import { BasePage } from '../basePage';

const template = `
    <main class="screen-center login-page">
      <form class="form-container">
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
  constructor() {
    super(template);
  }
}
