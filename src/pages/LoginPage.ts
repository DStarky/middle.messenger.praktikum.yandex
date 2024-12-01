import { BasePage } from './basePage';

const template = `
  <h1>Я страница Login</h1>
  <nav>
    <li>{{> Link href="/registration" text="Registration"}}</li>
    <li>{{> Link href="/chats" text="Chats"}}</li>
    <li>{{> Link href="/profile" text="Profile"}}</li>
    <div class="login-form-container">
      {{> FloatingLabelInput type="text" id="username" name="username" label="Логин" value=""}}
      {{> FloatingLabelInput type="password" id="password" name="password" label="Пароль" value=""}}
      {{> Button type="submit" text="Авторизоваться" className="btn-primary"}}
    </div>
  </nav>
`;

export class LoginPage extends BasePage {
  constructor() {
    super(template);
  }
}
