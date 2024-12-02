import { BasePage } from '../basePage';

const template = `
<main class="chats-page">
  {{> Sidebar chats=chats}}
  <section class="chat-content">
    {{#if selectedChat}}
      <div class="chat-header">
        {{> Avatar src=selectedChat.avatar alt=selectedChat.name}}
        <div class="chat-header__name">{{selectedChat.name}}</div>
        <button class="chat-header__settings">⚙️</button>
      </div>
      <div class="chat-messages">
        {{#each messages}}
          {{> Message message=this}}
        {{/each}}
      </div>
      <div class="chat-input">
        <button class="chat-input__attach">📎</button>
        {{> SimpleInput type="text" id="message" name="message" placeholder="Type a message"}}
        {{> Button type="button" text="Send"}}
      </div>
    {{else}}
      <div class="no-chat-selected">
        Выберите чат, чтобы отправить сообщение
      </div>
    {{/if}}
  </section>
</main>
`;

export class ChatsPage extends BasePage {
  constructor() {
    super(template);
  }

  render(context: Record<string, unknown> = {}): string {
    const data = {
      chats: [
        {
          id: 1,
          avatar: '',
          name: 'Иван Иванов',
          lastMessage: 'Привет! Как дела?',
          time: '12:34',
          unreadCount: 2,
        },
        {
          id: 2,
          avatar: '',
          name: 'Петр Петров',
          lastMessage: 'Пока! Пока пока!',
          time: '21:34',
          unreadCount: 99,
        },
      ],
      selectedChat: null,
      messages: [
        { text: 'Привет!', time: '12:35', isOwn: false },
        { text: 'Как дела?', time: '12:36', isOwn: true },
      ],
      ...context,
    };
    return super.render(data);
  }
}
