import { v4 as makeUUID } from 'uuid';
import type { Props } from '../../app/Block';
import Block from '../../app/Block';
import ChatController from '../../controllers/ChatController';
import store from '../../app/Store';
import type { MessageData } from '../../components/common/Message/Message';
import { Sidebar } from '../../components/common/Sidebar/Sidebar';
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

const WS_HOST = 'wss://ya-praktikum.tech/ws/chats';

interface ParsedMessage {
  id: number;
  user_id: number;
  content: string;
  time: string;
  type: string;
}

interface ChatsPageProps extends Props {
  sidebar: Sidebar;
  innerChat: InnerChat;
  isLoading?: boolean;
  error?: string | null;
}

export class ChatsPage extends Block<ChatsPageProps> {
  private selectedChatId: number | null = null;
  private socket: WebSocket | null = null;
  private messages: MessageData[] = [];

  constructor() {
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
      isLoading: false,
      error: null,
    });
  }

  protected override init(): void {
    super.init();
    this.fetchChats();
  }

  protected override render(): string {
    return template;
  }

  private fetchChats(): void {
    ChatController.fetchChats(
      (loading: boolean) => {
        this.setProps({ isLoading: loading });
        (this.children.sidebar as Sidebar).setProps({ isLoading: loading });
      },
      (error: string | null) => {
        this.setProps({ error });
        (this.children.sidebar as Sidebar).setProps({
          errorMessage: error || 'Ошибка при загрузке чатов',
          isLoading: false,
        });
      },
      (chats: Chat[]) => {
        const sidebar = this.children.sidebar as Sidebar;
        sidebar.setProps({
          chats,
          isLoading: false,
          errorMessage: null,
        });
      },
    );
  }

  private handleChatClick(event: Event): void {
    const target = event.target as HTMLElement;
    const chatItem = target.closest('.chat-item') as HTMLElement | null;
    if (!chatItem) {
      return;
    }

    const chatIdStr = chatItem.getAttribute('data-chat-id');
    if (!chatIdStr) {
      return;
    }

    const chatId = Number(chatIdStr);
    this.handleChatSelect(chatId);
  }

  private handleChatSelect(chatId: number): void {
    if (this.selectedChatId === chatId) {
      this.selectedChatId = null;
      this.closeCurrentSocket();
      this.updatePage();
    } else {
      this.closeCurrentSocket();
      this.selectedChatId = chatId;
      this.updatePage();
      this.initChatSocket(chatId);
    }
  }

  private getChatById(chatId: number): Chat | null {
    const sidebar = this.children.sidebar as Sidebar;
    const chats = sidebar.getChats();
    return chats.find(c => c.id === chatId) || null;
  }

  private async initChatSocket(chatId: number): Promise<void> {
    try {
      const userId = store.getState().user?.id;
      if (!userId) {
        console.error('Нет userId!');
        return;
      }

      const token = await ChatController.getChatToken(chatId);
      const wsUrl = `${WS_HOST}/${userId}/${chatId}/${token}`;
      this.socket = new WebSocket(wsUrl);

      this.socket.addEventListener('open', () => {
        console.log(`WS connected to chatId=${chatId}`);
        this.requestOldMessages('0');

        const intervalId = setInterval(() => {
          if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ type: 'ping' }));
          } else {
            clearInterval(intervalId);
          }
        }, 30000);
      });

      this.socket.addEventListener('message', event => {
        this.handleSocketMessage(event.data);
      });

      this.socket.addEventListener('close', ev => {
        console.log(`WS closed code=${ev.code} reason=${ev.reason}`);
      });

      this.socket.addEventListener('error', err => {
        console.error('WS error:', err);
      });
    } catch (error) {
      console.error('initChatSocket error:', error);
    }
  }

  private closeCurrentSocket(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    this.messages = [];
    this.updateInnerChat();
  }

  private handleSocketMessage(rawData: string): void {
    try {
      const parsed = JSON.parse(rawData);

      if (Array.isArray(parsed)) {
        const loaded: MessageData[] = parsed.map(msg =>
          this.convertWSMessage(msg),
        );
        loaded.reverse();
        this.messages = [...loaded, ...this.messages];
        this.updateInnerChat();
      } else if (parsed.type === 'pong') {
        console.log('pong received');
      } else if (
        parsed.type === 'message' ||
        parsed.type === 'file' ||
        parsed.type === 'sticker'
      ) {
        const newMsg = this.convertWSMessage(parsed);

        if (!newMsg.isOwn) {
          this.messages = [...this.messages, newMsg];
          this.updateInnerChat();
        } else {
          const index = this.messages.findIndex(
            msg =>
              msg.text === newMsg.text &&
              msg.time === newMsg.time &&
              msg.isOwn === true,
          );
          if (index !== -1) {
            this.messages[index] = {
              ...this.messages[index],
              id: newMsg.id,
              time: newMsg.time,
            };
            this.updateInnerChat();
          }
        }
      } else if (parsed.type === 'user connected') {
        console.log(`User connected: ${parsed.content}`);
      }
    } catch (err) {
      console.error('Ошибка при парсинге WS-сообщения:', err);
    }
  }

  private convertWSMessage(parsedMsg: ParsedMessage): MessageData {
    const currentUserId = store.getState().user?.id;
    const userId = parsedMsg.user_id;

    const isMine = userId && currentUserId && userId === currentUserId;

    const msgId = parsedMsg.id ? String(parsedMsg.id) : makeUUID();

    let msgTime = parsedMsg.time || new Date().toISOString();
    try {
      msgTime = new Date(parsedMsg.time).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (err) {
      console.error('Ошибка при преобразовании времени сообщения:', err);
      msgTime = new Date().toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    return {
      id: msgId,
      text: parsedMsg.content || '',
      time: msgTime,
      isOwn: !!isMine,
    };
  }

  private requestOldMessages(offset: string): void {
    if (!this.socket) {
      return;
    }

    this.socket.send(
      JSON.stringify({
        content: offset,
        type: 'get old',
      }),
    );
  }

  private async handleSendMessage(message: string): Promise<void> {
    if (!this.selectedChatId || !this.socket) {
      return;
    }

    const newMessage: MessageData = {
      id: makeUUID(),
      text: message,
      time: new Date().toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isOwn: true,
    };
    this.messages = [...this.messages, newMessage];
    this.updateInnerChat();

    if (this.socket.readyState === WebSocket.OPEN) {
      const payload = {
        content: message,
        type: 'message',
      };
      this.socket.send(JSON.stringify(payload));
    } else {
      console.error('WS не открыт, сообщение не отправлено');
    }
  }

  private updateInnerChat(): void {
    const innerChat = this.children.innerChat as InnerChat;
    innerChat.setProps({
      selectedChat: this.selectedChatId
        ? this.getChatById(this.selectedChatId)
        : null,
      messages: [...this.messages],
      isLoading: false,
      errorMessage: null,
    });
  }

  private updatePage(): void {
    const selectedChat = this.selectedChatId
      ? this.getChatById(this.selectedChatId)
      : null;

    (this.children.sidebar as Sidebar).setProps({
      selectedChat: selectedChat ? { id: selectedChat.id } : { id: null },
    });

    this.messages = [];
    this.updateInnerChat();
  }
}
