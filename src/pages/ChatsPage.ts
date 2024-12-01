import { BasePage } from './basePage';

const chatData = [
  { avatar: '', name: 'John Doe', lastMessage: 'Hello!' },
  {
    avatar: '',
    name: 'Jane Smith',
    lastMessage: 'How are you?',
  },
];

const template = `
  <h1>Я страница Chats</h1>
  <nav>
    <li>{{> Link href="/login" text="Login"}}</li>
    <li>{{> Link href="/registration" text="Registration"}}</li>
    <li>{{> Link href="/profile" text="Profile"}}</li>
  </nav>
  <div>
    {{> FloatingLabelInput type="text" id="username" name="username" label="Username" value="" className="input-primary"}}
    {{> SimpleInput  placeholder="Password" value=""}}
    {{> Button type="submit" text="Login" className="btn-primary"}}
    {{> Avatar src="/avatar.jpg" alt=""}}
    {{> Avatar alt="Default User"}}
  </div>
`;

export class ChatsPage extends BasePage {
  constructor() {
    super(template);
  }

  render(): string {
    return super.render({ chatData });
  }
}
