import { Block } from '../../../app/Block';

export const template = `
<div class="chat-item-container">
  <div class="chat-item__avatar">
    {{> Avatar src=chat.avatar alt=chat.name}}
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

type Chat = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isOwn?: boolean;
};

type ChatItemProps = {
  chat: Chat;
  className?: string;
  events?: Record<string, (e: Event) => void>;
};

export class ChatItem extends Block {
  constructor(props: ChatItemProps) {
    super('div', props);
  }

  override render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
