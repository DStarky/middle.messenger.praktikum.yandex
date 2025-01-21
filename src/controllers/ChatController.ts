import store from '../app/Store';
import { ChatAPI } from '../api/ChatAPI';
import type { Chat, User } from '../types/Chat';
import type { AddRemoveUsersRequest } from '../types/Chat';

class ChatController {
  private api: ChatAPI;

  constructor() {
    this.api = new ChatAPI();
  }

  public async fetchChats(
    onLoading: (loading: boolean) => void,
    onError: (error: string | null) => void,
    onSuccess: (data: Chat[]) => void,
    offset?: number,
    limit?: number,
    title?: string,
  ): Promise<void> {
    try {
      onLoading(true);
      onError(null);

      const chatsOrError = await this.api.fetchChats(offset, limit, title);

      if ('reason' in chatsOrError) {
        onError(chatsOrError.reason);
        return;
      }

      store.set('chats', chatsOrError);
      onSuccess(chatsOrError);
    } catch (error) {
      console.error('fetchChats error:', error);
      onError((error as Error).message);
    } finally {
      onLoading(false);
    }
  }

  public async getChatToken(chatId: number): Promise<string> {
    try {
      const response = await fetch(
        `https://ya-praktikum.tech/api/v2/chats/token/${chatId}`,
        {
          method: 'POST',
          credentials: 'include',
        },
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Ошибка при получении токена');
      }

      const data = await response.json();
      if (!data.token) {
        throw new Error('В ответе не найден token');
      }

      return data.token;
    } catch (error) {
      console.error('getChatToken error:', error);
      throw error;
    }
  }

  public async createChat(
    title: string,
    onLoading: (loading: boolean) => void,
    onError: (error: string | null) => void,
    onSuccess: () => void,
  ): Promise<void> {
    try {
      onLoading(true);
      onError(null);

      const response = await this.api.createChat(title);

      if ('reason' in response) {
        onError(response.reason);
        return;
      }

      onSuccess();

      this.fetchChats(
        () => {},
        () => {},
        () => {},
      );
    } catch (error) {
      console.error('createChat error:', error);
      onError((error as Error).message);
    } finally {
      onLoading(false);
    }
  }

  public async deleteChat(
    chatId: number,
    onLoading: (loading: boolean) => void,
    onError: (error: string | null) => void,
    onSuccess: () => void,
  ): Promise<void> {
    try {
      onLoading(true);
      onError(null);

      const response = await this.api.deleteChat(chatId);

      if ('reason' in response) {
        onError(response.reason);
        return;
      }

      store.set('selectedChat', null);
      onSuccess();
    } catch (error) {
      console.error('deleteChat error:', error);
      onError((error as Error).message);
    } finally {
      onLoading(false);
    }
  }

  public async getChatUsers(
    chatId: number,
    onLoading: (loading: boolean) => void,
    onError: (error: string | null) => void,
    onSuccess: (data: User[]) => void,
  ): Promise<void> {
    try {
      onLoading(true);
      onError(null);

      const usersOrError = await this.api.getChatUsers(chatId);

      if ('reason' in usersOrError) {
        onError(usersOrError.reason);
        return;
      }

      onSuccess(usersOrError as User[]);
    } catch (error) {
      console.error('getChatUsers error:', error);
      onError((error as Error).message);
    } finally {
      onLoading(false);
    }
  }

  public async getNewMessagesCount(
    chatId: number,
    onLoading: (loading: boolean) => void,
    onError: (error: string | null) => void,
    onSuccess: (data: number) => void,
  ): Promise<void> {
    try {
      onLoading(true);
      onError(null);

      const countOrError = await this.api.getNewMessagesCount(chatId);

      if ('reason' in countOrError) {
        onError(countOrError.reason);
        return;
      }

      onSuccess(countOrError.unread_count);
    } catch (error) {
      console.error('getNewMessagesCount error:', error);
      onError((error as Error).message);
    } finally {
      onLoading(false);
    }
  }

  public async addUsersToChat(
    chatId: number,
    userIds: number[],
    onLoading: (loading: boolean) => void,
    onError: (error: string | null) => void,
    onSuccess: () => void,
  ): Promise<void> {
    try {
      onLoading(true);
      onError(null);

      const data: AddRemoveUsersRequest = {
        chatId,
        users: userIds,
      };

      const response = await this.api.addUsersToChat(data);

      if (typeof response === 'string') {
        if (response.toUpperCase() === 'OK') {
          onSuccess();
        } else {
          onError(response);
        }
      } else {
        if ('reason' in response) {
          onError(response.reason);
        } else {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('addUsersToChat error:', error);
      onError((error as Error).message);
    } finally {
      onLoading(false);
    }
  }

  public async removeUsersFromChat(
    chatId: number,
    userIds: number[],
    onLoading: (loading: boolean) => void,
    onError: (error: string | null) => void,
    onSuccess: () => void,
  ): Promise<void> {
    try {
      onLoading(true);
      onError(null);

      const data: AddRemoveUsersRequest = {
        chatId,
        users: userIds,
      };

      const response = await this.api.removeUsersFromChat(data);

      if (typeof response === 'string') {
        if (response.toUpperCase() === 'OK') {
          onSuccess();
        } else {
          onError(response);
        }
      } else {
        if ('reason' in response) {
          onError(response.reason);
        } else {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('removeUsersFromChat error:', error);
      onError((error as Error).message);
    } finally {
      onLoading(false);
    }
  }
}

export default new ChatController();
