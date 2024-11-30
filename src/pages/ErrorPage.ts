import { BasePage } from './basePage';

const template = `
  <div class="error-page">
    <h1>404 - Страница не найдена</h1>
    <nav>
      <a href="/login" class="nav-link">Login</a>
      <a href="/registration" class="nav-link">Registration</a>
      <a href="/chats" class="nav-link">Chats</a>
      <a href="/profile" class="nav-link">Profile</a>
    </nav>
  </div>
`;

export class ErrorPage extends BasePage {
  constructor() {
    super(template);
  }
}
