import type { Props } from '../../../app/Block';
import Block from '../../../app/Block';
import type { Avatar } from '../Avatar/Avatar';

const chatItemTemplate = `
  <li class="chat-item {{{className}}}" data-chat-id="{{id}}">
    <div class="chat-item-container">
      <div class="chat-item__avatar">
        {{{avatar}}}
      </div>
      <div class="chat-item__content">
        <div class="chat-item__name">{{name}}</div>
        <div class="chat-item__last-message">
          {{#if isOwn}}
            <span class="chat-item__is-own">Вы: </span>
          {{/if}}
          {{lastMessage}}
        </div>
      </div>
      <div class="chat-item__meta">
        <div class="chat-item__time">{{time}}</div>
        {{#if unreadCount}}
          <div class="chat-item__unread-count">{{unreadCount}}</div>
        {{/if}}
      </div>
    </div>
  </li>
`;

interface ChatItemProps extends Props {
  id: string;
  avatar: Avatar;
  name: string;
  lastMessage: string;
  time: string;
  className?: string;
  isOwn?: boolean;
  unreadCount?: number;
}

export class ChatItem extends Block<ChatItemProps> {
  constructor(props: ChatItemProps) {
    super({
      ...props,
    });
  }

  protected override render(): string {
    return chatItemTemplate;
  }
}
