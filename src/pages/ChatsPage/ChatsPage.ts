import type { Props } from '../../app/Block';
import Block from '../../app/Block';
import type { Router } from '../../app/Router';
import { Sidebar } from '../../components/common/Sidebar/Sidebar';
import { ChatAPI } from '../../api/ChatAPI';
import type { Chat } from '../../types/Chat';
import { InnerChat } from './partials/InnerChat';
import type { MessageData } from '../../components/common/Message/Message';
import { v4 as makeUUID } from 'uuid';

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
      chats: [],
      selectedChat: { id: null },
      isLoading: true,
      errorMessage: null,
      events: {
        click: (e: Event) => this.handleChatClick(e),
      },
    });

    const innerChat = new InnerChat({
      selectedChat: null,
      messages: [],
      isLoading: false,
      errorMessage: null,
      onSendMessage: (message: string) => this.handleSendMessage(message),
    });

    super({
      sidebar,
      innerChat,
    });

    this.router = router;
  }

  protected override init(): void {
    super.init();
    this.fetchChats();
  }

  protected override render(): string {
    return template;
  }

  private handleChatClick(event: Event): void {
    const target = event.target as HTMLElement;
    const chatItem = target.closest('.chat-item') as HTMLElement | null;

    if (chatItem) {
      const chatId = String(chatItem.getAttribute('data-chat-id'));
      this.handleChatSelect(chatId);
    }
  }

  private handleChatSelect(chatId: string): void {
    if (this.selectedChatId === chatId) {
      this.selectedChatId = null;
      this.updatePage();
    } else {
      this.selectedChatId = chatId;
      this.updatePage();
      this.fetchMessages(chatId);
    }
  }

  private updatePage(): void {
    const selectedChat = this.selectedChatId
      ? this.getChatById(this.selectedChatId)
      : null;

    const sidebar = this.children.sidebar as Sidebar;
    sidebar.setProps({
      selectedChat: selectedChat ? { id: selectedChat.id } : { id: null },
    });

    const innerChat = this.children.innerChat as InnerChat;
    innerChat.setProps({
      selectedChat,
      messages: selectedChat ? [] : [],
      isLoading: selectedChat ? true : false,
      errorMessage: null,
    });
  }

  private getChatById(chatId: string): Chat | null {
    const sidebar = this.children.sidebar as Sidebar;
    const chats = sidebar.getChats();
    return chats.find(chat => chat.id === chatId) || null;
  }
  private async fetchChats(): Promise<void> {
    try {
      const chats = await ChatAPI.fetchChats();
      this.setChats(chats);
    } catch (error) {
      if (error instanceof Error) {
        this.setError(error.message);
      } else {
        this.setError('Неизвестная ошибка при загрузке чатов.');
      }
    }
  }

  private setChats(chats: Chat[]): void {
    const sidebar = this.children.sidebar as Sidebar;
    sidebar.setProps({
      chats: chats,
      isLoading: false,
      errorMessage: null,
    });
  }

  private setError(message: string): void {
    const sidebar = this.children.sidebar as Sidebar;
    sidebar.setProps({
      errorMessage: message,
      isLoading: false,
    });
  }

  private async fetchMessages(chatId: string): Promise<void> {
    const innerChat = this.children.innerChat as InnerChat;
    innerChat.setProps({
      isLoading: true,
      errorMessage: null,
      messages: [],
    });

    try {
      const messages = await ChatAPI.fetchMessages(chatId);
      innerChat.setProps({
        selectedChat: this.getChatById(chatId),
        messages: messages,
        isLoading: false,
        errorMessage: null,
      });
    } catch (error) {
      if (error instanceof Error) {
        innerChat.setProps({
          errorMessage: error.message,
          isLoading: false,
        });
      } else {
        innerChat.setProps({
          errorMessage: 'Неизвестная ошибка при загрузке сообщений.',
          isLoading: false,
        });
      }
    }
  }

  private async handleSendMessage(message: string): Promise<void> {
    if (!this.selectedChatId) {
      return;
    }

    const innerChat = this.children.innerChat as InnerChat;

    const newMessage: MessageData = {
      id: makeUUID(),
      text: message,
      time: new Intl.DateTimeFormat('ru', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date()),
      isOwn: true,
    };

    try {
      await ChatAPI.sendMessage(this.selectedChatId, newMessage);

      const currentMessages = innerChat.getProps().messages || [];
      const updatedMessages = [...currentMessages, newMessage];

      innerChat.setProps({
        messages: updatedMessages,
      });
    } catch (error) {
      if (error instanceof Error) {
        innerChat.setProps({
          errorMessage: error.message,
        });
      } else {
        innerChat.setProps({
          errorMessage: 'Неизвестная ошибка при отправке сообщения.',
        });
      }
    }
  }
}
