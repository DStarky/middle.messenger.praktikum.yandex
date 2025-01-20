import type { ErrorResponse } from './common';

export interface User {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  avatar: string;
  email: string;
  phone: string;
}

export interface LastMessage {
  user: User;
  time: string;
  content: string;
}

export interface Chat {
  id: number;
  title: string;
  avatar: string;
  unread_count: number;
  created_by: number;
  last_message: LastMessage;
}

export interface CreateChatResponse {
  id: number;
}

export interface DeleteChatResponse {
  userId: number;
  result: {
    id: number;
    title: string;
    avatar: string;
    created_by: number;
  };
}

export interface AddRemoveUsersRequest {
  users: number[];
  chatId: number;
}

export type GetChatUsersResponse = User[] | ErrorResponse;

export interface NewMessagesCountResponse {
  unread_count: number;
}
