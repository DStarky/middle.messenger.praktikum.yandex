import { BasePage } from './basePage';

const template = `
  <h1>Я страница Chats</h1>
  <nav>
    <a href="/login" class="nav-link">Login</a>
    <a href="/registration" class="nav-link">Registration</a>
    <a href="/profile" class="nav-link">Profile</a>
  </nav>
`;

export class ChatsPage extends BasePage {
  constructor() {
    super(template);
  }
}
