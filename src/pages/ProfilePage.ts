import { BasePage } from './basePage';

const template = `
  <h1>Я страница Profile</h1>
  <nav>
    <li>{{> Link href="/login" text="Login"}}</li>
    <li>{{> Link href="/registration" text="Registration"}}</li>
    <li>{{> Link href="/chats" text="Chats"}}</li>
  </nav>
`;

export class ProfilePage extends BasePage {
  constructor() {
    super(template);
  }
}
