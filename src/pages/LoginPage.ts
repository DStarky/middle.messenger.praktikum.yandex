import { BasePage } from './basePage';

const template = `
  <h1>Я страница Login</h1>
  <nav>
    <a href="/registration" class="nav-link">Registration</a>
    <a href="/chats" class="nav-link">Chats</a>
    <a href="/profile" class="nav-link">Profile</a>
  </nav>
`;

export class LoginPage extends BasePage {
  constructor() {
    super(template);
  }
}
