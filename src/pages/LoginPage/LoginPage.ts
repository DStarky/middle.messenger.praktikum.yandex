import { BasePage } from '../basePage';

const template = `
    <main class="login-page">
      <div class="form-container">
        <div class="form-container__title">{{> CardTitle text="Вход"}}</div>
        <div class="form-container__inputs">
          {{> FloatingLabelInput type="text" id="username" name="username" label="Логин" value=""}}
          {{> FloatingLabelInput type="password" id="password" name="password" label="Пароль" value=""}}
        </div>
        <div class="form-container__links">
          {{> Button type="submit" text="Авторизоваться" className="w-full"}}
          {{> Link href="/registration" text="Нет аккаунта?"}}
         </div>
      </div>
    </main>
`;

export class LoginPage extends BasePage {
  constructor() {
    super(template);
  }
}
