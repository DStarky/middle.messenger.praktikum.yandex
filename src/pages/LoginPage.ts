import { BasePage } from './basePage';

const template = `
  <h1>Я страница Login</h1>
  <nav>
    <li>{{> Link href="/registration" text="Registration"}}</li>
    <li>{{> Link href="/chats" text="Chats"}}</li>
    <li>{{> Link href="/profile" text="Profile"}}</li>
  </nav>
`;

export class LoginPage extends BasePage {
  constructor() {
    super(template);
  }
}
