import { BasePage } from './basePage';

const template = `
  <h1>Я страница Registration</h1>
  <nav>
    <a href="/login" class="nav-link">Login</a>
    <a href="/chats" class="nav-link">Chats</a>
    <a href="/profile" class="nav-link">Profile</a>
  </nav>
`;

export class RegistrationPage extends BasePage {
  constructor() {
    super(template);
  }
}
