export interface Chat {
  id: string;
  avatar: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isOwn: boolean;
  isActive?: boolean;
}
