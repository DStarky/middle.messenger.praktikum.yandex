import { BasePage } from './basePage';

const template = `
  <div class="error-page">
    <h1>404 - Страница не найдена</h1>
    <nav>
      <li>{{> Link href="/login" text="Login"}}</li>
      <li>{{> Link href="/registration" text="Registration"}}</li>
      <li>{{> Link href="/chats" text="Chats"}}</li>
      <li>{{> Link href="/profile" text="Profile"}}</li>
    </nav>
  </div>
`;

export class ErrorPage extends BasePage {
  constructor() {
    super(template);
  }
}
