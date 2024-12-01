import { BasePage } from './basePage';

const template = `
  <h1>Я страница Registration</h1>
  <nav>
    <li>{{> Link href="/login" text="Login"}}</li>
    <li>{{> Link href="/chats" text="Chats"}}</li>
    <li>{{> Link href="/profile" text="Profile"}}</li>
  </nav>
`;

export class RegistrationPage extends BasePage {
  constructor() {
    super(template);
  }
}
