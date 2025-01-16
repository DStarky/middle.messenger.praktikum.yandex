import type { Props } from '../../../app/Block';
import Block from '../../../app/Block';
import type { User } from '../../../types/Chat';
import type { Avatar } from '../Avatar/Avatar';

const chatItemTemplate = `
 <li class="chat-item {{{className}}}" data-chat-id="{{id}}">
  <div class="chat-item-container">
    <div class="chat-item__avatar">
      {{{avatar}}}
    </div>
    <div class="chat-item__content">
      <div class="chat-item__name">{{title}}</div>
      <div class="chat-item__last-message">
        {{#if isOwn}}
          <span class="chat-item__is-own">Вы: </span>
        {{/if}}
        {{#if last_message}}
          {{last_message.content}}
        {{/if}}
      </div>
    </div>
    <div class="chat-item__meta">
      {{#if last_message}}
        <div class="chat-item__time">{{last_message.time}}</div>
      {{/if}}
      {{#if unread_count}}
        <div class="chat-item__unread-count">{{unread_count}}</div>
      {{/if}}
    </div>
  </div>
</li>
`;

interface ChatItemProps extends Props {
  id: number;
  avatar: Avatar;
  title: string;
  last_message?: {
    user: User;
    time: string;
    content: string;
  };
  unread_count?: number;
  isOwn?: boolean;
  created_by?: number;
  className?: string;
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
