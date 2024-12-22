import type { Chat } from '../types/Chat';
import type { MessageData } from '../components/common/Message/Message';
import { DEFAULT_CHATS, MESSAGES_BY_CHAT_ID } from '../consts/ChatsData';

export class ChatAPI {
  public static fetchChats(): Promise<Chat[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(DEFAULT_CHATS);
      }, 500);
    });
  }

  public static fetchMessages(chatId: string): Promise<MessageData[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        const messages = MESSAGES_BY_CHAT_ID[chatId];
        if (messages) {
          resolve(messages);
        } else {
          resolve([]);
        }
      }, 500);
    });
  }

  public static sendMessage(
    chatId: string,
    message: MessageData,
  ): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        if (!MESSAGES_BY_CHAT_ID[chatId]) {
          MESSAGES_BY_CHAT_ID[chatId] = [];
        }

        MESSAGES_BY_CHAT_ID[chatId].push(message);
        resolve();
      }, 500);
    });
  }
}
