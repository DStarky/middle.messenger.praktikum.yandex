import Handlebars from 'handlebars';
import { BasePage } from '../basePage';
import MenuIcon from '../../assets/icons/menu.svg';
import AttachmentIcon from '../../assets/icons/attachment.svg';
import ArrowRightIcon from '../../assets/icons/arrow-right.svg';
import type { Chat } from '../../types/Chat';
import { DEFAULT_CHATS, MESSAGES_BY_CHAT_ID } from '../../consts/data';

const template = `
<main class="chats-page">
  <div class="chats-page__sidebar">
    {{> Sidebar chats=chats}}
   </div>
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
        <button class="chat-input__attach">
          <img src="${AttachmentIcon}" alt="attach" />
        </button>
        <div class="chat-input__message">
          {{> SimpleInput type="text" id="message" name="message" placeholder="Сообщение" className="simple-input_message"}}
         </div>
        {{> Button 
          type="button" 
          className="button_round" 
          icon="${ArrowRightIcon}" 
          alt="Send"
        }}
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
        <button class="chat-input__attach">
          <img src="${AttachmentIcon}" alt="attach" />
        </button>
        <div class="chat-input__message">
          {{> SimpleInput type="text" id="message" name="message" placeholder="Сообщение" className="simple-input_message"}}
        </div>
        {{> Button 
          type="button" 
          className="button_round" 
          icon="${ArrowRightIcon}" 
          alt="Send"
        }}
      </div>
    {{else}}
      <div class="no-chat-selected">
        Выберите чат, чтобы отправить сообщение
      </div>
    {{/if}}
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
