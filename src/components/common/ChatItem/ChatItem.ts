import type { Props } from '../../../app/Block';
import Block from '../../../app/Block';

const template = `
  <div class="chat-item-container {{className}}">
    <div class="chat-item__avatar">
      <img src="{{chat.avatar}}" alt="{{chat.name}}" class="avatar-img" />
    </div>
    <div class="chat-item__content">
      <div class="chat-item__name">{{chat.name}}</div>
      <div class="chat-item__last-message">
        {{#if chat.isOwn}}
          <span class="chat-item__is-own">Вы: </span>
        {{/if}}
        {{chat.lastMessage}}
      </div>
    </div>
    <div class="chat-item__meta">
      <div class="chat-item__time">{{chat.time}}</div>
      {{#if chat.unreadCount}}
        <div class="chat-item__unread-count">{{chat.unreadCount}}</div>
      {{/if}}
    </div>
  </div>
`;

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isOwn?: boolean;
}

interface ChatItemProps extends Props {
  chat: Chat;
  className?: string;
  events?: Record<string, (e: Event) => void>;
}

export class ChatItem extends Block<ChatItemProps> {
  constructor(props: ChatItemProps) {
    super(props);
  }

  override render(): string {
    return template;
  }
}
