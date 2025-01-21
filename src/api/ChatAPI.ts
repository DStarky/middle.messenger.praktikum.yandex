import { BaseAPI } from './BaseAPI';
import type {
  Chat,
  CreateChatResponse,
  DeleteChatResponse,
  AddRemoveUsersRequest,
  GetChatUsersResponse,
  NewMessagesCountResponse,
} from '../types/Chat';
import type { ErrorResponse } from '../types/common';
import { API_URL } from '../consts/URLs';
import { HTTPTransport } from '../app/HTTPTransport';

function convertToQuery(data: Record<string, string>): string {
  const keys = Object.keys(data);
  if (keys.length === 0) {
    return '';
  }

  return keys.reduce((acc, key, idx) => {
    return `${acc}${key}=${encodeURIComponent(data[key])}${
      idx < keys.length - 1 ? '&' : ''
    }`;
  }, '?');
}

export class ChatAPI extends BaseAPI {
  private host = API_URL;
  private http = new HTTPTransport();
  public fetchChats(
    offset?: number,
    limit?: number,
    title?: string,
  ): Promise<Chat[] | ErrorResponse> {
    const params: Record<string, string> = {};
    if (offset !== undefined) {
      params.offset = offset.toString();
    }

    if (limit !== undefined) {
      params.limit = limit.toString();
    }

    if (title) {
      params.title = title;
    }

    return this.http.get(`${this.host}chats${convertToQuery(params)}`);
  }
  public createChat(
    title: string,
  ): Promise<CreateChatResponse | ErrorResponse> {
    return this.http.post(`${this.host}chats`, {
      data: { title },
    });
  }
  public deleteChat(
    chatId: number,
  ): Promise<DeleteChatResponse | ErrorResponse> {
    return this.http.delete(`${this.host}chats`, {
      data: { chatId },
    });
  }
  public getChatUsers(
    chatId: number,
    offset?: number,
    limit?: number,
    name?: string,
    email?: string,
  ): Promise<GetChatUsersResponse | ErrorResponse> {
    const params: Record<string, string> = {};
    if (offset !== undefined) {
      params.offset = offset.toString();
    }

    if (limit !== undefined) {
      params.limit = limit.toString();
    }

    if (name) {
      params.name = name;
    }

    if (email) {
      params.email = email;
    }

    return this.http.get(
      `${this.host}chats/${chatId}/users${convertToQuery(params)}`,
    );
  }
  public getNewMessagesCount(
    chatId: number,
  ): Promise<NewMessagesCountResponse | ErrorResponse> {
    return this.http.get(`${this.host}chats/new/${chatId}`);
  }
  public addUsersToChat(
    data: AddRemoveUsersRequest,
  ): Promise<string | ErrorResponse> {
    return this.http.put(`${this.host}chats/users`, {
      data,
    });
  }
  public removeUsersFromChat(
    data: AddRemoveUsersRequest,
  ): Promise<string | ErrorResponse> {
    return this.http.delete(`${this.host}chats/users`, {
      data,
    });
  }

  public updateChatAvatar(
    chatId: number,
    file: File,
  ): Promise<Chat | ErrorResponse> {
    const formData = new FormData();
    formData.append('chatId', chatId.toString());
    formData.append('avatar', file);

    return this.http.put(`${this.host}chats/avatar`, {
      data: formData,
      headers: {},
    });
  }
}
