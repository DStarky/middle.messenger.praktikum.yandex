import { BaseAPI } from './BaseAPI';
import type {
  Chat,
  CreateChatResponse,
  DeleteChatResponse,
  AddRemoveUsersRequest,
  GetChatUsersResponse,
  NewMessagesCountResponse,
} from '../types/Chat';
import type { ErrorResponse } from '../types/Common';

export class ChatAPI extends BaseAPI {
  private host = 'https://ya-praktikum.tech/api/v2';

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      if (!response.ok) {
        throw new Error((data as ErrorResponse).reason || 'Unknown error');
      }

      return data as T;
    } else {
      const text = await response.text();
      if (!response.ok) {
        throw new Error(text || 'Unknown error');
      }

      return text as unknown as T;
    }
  }

  public async fetchChats(
    offset?: number,
    limit?: number,
    title?: string,
  ): Promise<Chat[] | ErrorResponse> {
    const url = new URL(`${this.host}/chats`);

    if (offset !== undefined) {
      url.searchParams.append('offset', offset.toString());
    }

    if (limit !== undefined) {
      url.searchParams.append('limit', limit.toString());
    }

    if (title) {
      url.searchParams.append('title', title);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      credentials: 'include',
    });

    return this.handleResponse<Chat[] | ErrorResponse>(response);
  }

  public async createChat(
    title: string,
  ): Promise<CreateChatResponse | ErrorResponse> {
    const response = await fetch(`${this.host}/chats`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });

    return this.handleResponse<CreateChatResponse | ErrorResponse>(response);
  }

  public async deleteChat(
    chatId: number,
  ): Promise<DeleteChatResponse | ErrorResponse> {
    const response = await fetch(`${this.host}/chats`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId }),
    });

    return this.handleResponse<DeleteChatResponse | ErrorResponse>(response);
  }

  public async getChatUsers(
    chatId: number,
    offset?: number,
    limit?: number,
    name?: string,
    email?: string,
  ): Promise<GetChatUsersResponse | ErrorResponse> {
    const url = new URL(`${this.host}/chats/${chatId}/users`);

    if (offset !== undefined) {
      url.searchParams.append('offset', offset.toString());
    }

    if (limit !== undefined) {
      url.searchParams.append('limit', limit.toString());
    }

    if (name) {
      url.searchParams.append('name', name);
    }

    if (email) {
      url.searchParams.append('email', email);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      credentials: 'include',
    });

    return this.handleResponse<GetChatUsersResponse | ErrorResponse>(response);
  }

  public async getNewMessagesCount(
    chatId: number,
  ): Promise<NewMessagesCountResponse | ErrorResponse> {
    const response = await fetch(`${this.host}/chats/new/${chatId}`, {
      method: 'GET',
      credentials: 'include',
    });

    return this.handleResponse<NewMessagesCountResponse | ErrorResponse>(
      response,
    );
  }

  public async addUsersToChat(
    data: AddRemoveUsersRequest,
  ): Promise<string | ErrorResponse> {
    const response = await fetch(`${this.host}/chats/users`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    return this.handleResponse<string | ErrorResponse>(response);
  }

  public async removeUsersFromChat(
    data: AddRemoveUsersRequest,
  ): Promise<string | ErrorResponse> {
    const response = await fetch(`${this.host}/chats/users`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    return this.handleResponse<string | ErrorResponse>(response);
  }
}
