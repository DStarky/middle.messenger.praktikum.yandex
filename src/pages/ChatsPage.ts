import { BasePage } from './basePage';

const template = `
  <h1>Я страница Chats</h1>
  <nav>
    <li>{{> Link href="/login" text="Login"}}</li>
    <li>{{> Link href="/registration" text="Registration"}}</li>
    <li>{{> Link href="/profile" text="Profile"}}</li>
  </nav>
`;

export class ChatsPage extends BasePage {
  constructor() {
    super(template);
  }
}
