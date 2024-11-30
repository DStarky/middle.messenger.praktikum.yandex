import { BasePage } from './basePage';

const template = `
  <h1>Я страница Profile</h1>
  <nav>
    <a href="/login" class="nav-link">Login</a>
    <a href="/registration" class="nav-link">Registration</a>
    <a href="/chats" class="nav-link">Chats</a>
  </nav>
`;

export class ProfilePage extends BasePage {
  constructor() {
    super(template);
  }
}
