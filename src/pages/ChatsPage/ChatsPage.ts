import { BasePage } from '../basePage';
import MenuIcon from '../../assets/icons/menu.svg';
import type { Chat } from '../../types/Chat';

const template = `
<main class="chats-page">
  {{> Sidebar chats=chats}}
  <section class="chat-content">
    {{#if selectedChat}}
      <div class="chat-header">
        {{> Avatar src=selectedChat.avatar alt=selectedChat.name className="avatar_size-small"}}
        <div class="chat-header__name">{{selectedChat.name}}</div>
        <button class="chat-header__settings">
          <img src="${MenuIcon}" alt="menu" />
        </button>
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
  private selectedChatId: number | null = null;
  constructor() {
    super(template);
    this.addEventListeners();
  }

  private addEventListeners(): void {
    document.addEventListener('click', event => {
      const chatItem = (event.target as HTMLElement).closest('.chat-item');

      if (chatItem) {
        const chatId = Number(chatItem.getAttribute('data-chat-id'));
        this.handleChatSelect(chatId);
      }
    });
  }

  private handleChatSelect(chatId: number): void {
    if (this.selectedChatId === chatId) {
      this.selectedChatId = null;
    } else {
      this.selectedChatId = chatId;
    }

    this.updatePage();
  }

  private updatePage(): void {
    const selectedChat = this.selectedChatId
      ? this.getChatById(this.selectedChatId)
      : null;

    const context = {
      chats: this.getChats(),
      selectedChat,
      messages: selectedChat ? this.getMessages(selectedChat.id) : [],
    };

    document.body.innerHTML = this.render(context);
  }

  private getChats(): Chat[] {
    return [
      {
        id: 1,
        avatar: '',
        name: 'Иван Иванов',
        lastMessage: 'Как дела?',
        time: '12:34',
        unreadCount: 2,
      },
      {
        id: 2,
        avatar: '',
        name: 'Петр Петров',
        lastMessage: 'Не хочу с тобой разговаривать',
        time: '21:34',
        unreadCount: 99,
      },
    ];
  }

  private getChatById(chatId: number): Chat | null {
    return this.getChats().find(chat => chat.id === chatId) || null;
  }

  private getMessages(chatId: number): Record<string, unknown>[] {
    // потом сюда нужно будет добавить получение сообщений с бека

    if (chatId === 1) {
      return [
        { text: 'Привет!', time: '12:35', isOwn: false },
        { text: 'Как дела?', time: '12:36', isOwn: true },
      ];
    } else if (chatId === 2) {
      return [
        { text: 'Здарова!', time: '18:12', isOwn: true },
        { text: 'Не хочу с тобой разговаривать', time: '19:55', isOwn: false },
      ];
    } else {
      return [];
    }
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
