import type { Props } from '../../app/Block';
import Block from '../../app/Block';
import type { Router } from '../../app/Router';
import type { MessageData } from '../../components/common/Message/Message';
import { Sidebar } from '../../components/common/Sidebar/Sidebar';
import { DEFAULT_CHATS, MESSAGES_BY_CHAT_ID } from '../../consts/data';
import type { Chat } from '../../types/Chat';
import { InnerChat } from './partials/InnerChat';

const template = `
  <main class="chats-page">
    <div class="chats-page__sidebar">
      {{{ sidebar }}}
    </div>
    <section class="chat-content">
      {{{ innerChat }}}
    </section>
  </main>
`;

interface ChatsPageProps extends Props {
  sidebar: Sidebar;
  innerChat: InnerChat;
}

export class ChatsPage extends Block<ChatsPageProps> {
  private selectedChatId: string | null = null;
  private router: Router;

  constructor(router: Router) {
    const sidebar = new Sidebar({
      compact: false,
      chats: DEFAULT_CHATS,
      selectedChat: { id: null },
      events: {
        click: (e: Event) => this.handleChatClick(e),
      },
    });

    const innerChat = new InnerChat({
      selectedChat: null,
      messages: [],
    });

    super({
      sidebar,
      innerChat,
    });

    this.router = router;
  }

  override render(): string {
    return template;
  }

  private handleChatClick(event: Event): void {
    const target = event.target as HTMLElement;
    const chatItem = target.closest('.chat-item') as HTMLElement;

    if (chatItem) {
      const chatId = String(chatItem.getAttribute('data-chat-id'));
      this.handleChatSelect(chatId);
    }
  }

  private handleChatSelect(chatId: string): void {
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

    const messages = selectedChat ? this.getMessages(selectedChat.id) : [];

    const sidebar = this.children.sidebar as Sidebar;
    sidebar.setProps({
      selectedChat: selectedChat ? { id: selectedChat.id } : { id: null },
      chats: this.getChats(),
    });

    const innerChat = this.children.innerChat as InnerChat;
    innerChat.setProps({
      selectedChat,
      messages,
    });
  }

  private getChats(): Chat[] {
    return DEFAULT_CHATS;
  }

  private getChatById(chatId: string): Chat | null {
    return this.getChats().find(chat => chat.id === chatId) || null;
  }

  private getMessages(chatId: string): MessageData[] {
    return MESSAGES_BY_CHAT_ID[chatId] || [];
  }
}
