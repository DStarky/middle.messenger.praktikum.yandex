import Handlebars from 'handlebars';
import { BasePage } from '../basePage';
import type { Chat } from '../../types/Chat';
import { DEFAULT_CHATS, MESSAGES_BY_CHAT_ID } from '../../consts/data';

const template = `
<main class="chats-page">
  <div class="chats-page__sidebar">
    {{> Sidebar chats=chats}}
   </div>
  <section class="chat-content">
    {{> InnerChat selectedChat=selectedChat messages=messages}}
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

    const sidebarElement = document.querySelector('.chats-page__sidebar');
    const chatContentElement = document.querySelector('.chat-content');

    if (sidebarElement && chatContentElement) {
      sidebarElement.innerHTML = this.renderSidebar(context);
      chatContentElement.innerHTML = this.renderChatContent(context);
    }
  }

  private renderSidebar(context: Record<string, unknown>): string {
    return Handlebars.compile(`
    {{> Sidebar chats=chats}}
  `)(context);
  }

  private renderChatContent(context: Record<string, unknown>): string {
    return Handlebars.compile(`
   {{> InnerChat selectedChat=selectedChat messages=messages}}
  `)(context);
  }

  private getChats(): Chat[] {
    return DEFAULT_CHATS;
  }

  private getChatById(chatId: number): Chat | null {
    return this.getChats().find(chat => chat.id === chatId) || null;
  }

  private getMessages(chatId: number): Record<string, unknown>[] {
    return MESSAGES_BY_CHAT_ID[chatId] || [];
  }

  render(context: Record<string, unknown> = {}): string {
    const data = {
      chats: DEFAULT_CHATS,
      selectedChat: null,
      messages: [],
      ...context,
    };
    return super.render(data);
  }
}
