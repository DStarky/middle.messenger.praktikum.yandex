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
        <div class="chat-item__time">{{formattedTime}}</div>
      {{/if}}
      {{#if unread_count}}
        <div class="chat-item__unread-count">{{unread_count}}</div>
      {{/if}}
    </div>
  </div>
</li>
`;

interface LastMessage {
  user: User;
  time: string;
  content: string;
}

interface ChatItemProps extends Props {
  id: number;
  avatar: Avatar;
  title: string;
  last_message?: LastMessage;
  unread_count?: number;
  isOwn?: boolean;
  created_by?: number;
  className?: string;
  formattedTime?: string;
}

export class ChatItem extends Block<ChatItemProps> {
  constructor(props: ChatItemProps) {
    super({
      ...props,
      formattedTime: ChatItem.formatTime(props.last_message?.time || ''),
    });
  }

  private static formatTime(time: string): string {
    try {
      const messageDate = new Date(time);
      const now = new Date();
      const messageDay = messageDate.getDate();
      const messageMonth = messageDate.getMonth();
      const messageYear = messageDate.getFullYear();
      const nowDay = now.getDate();
      const nowMonth = now.getMonth();
      const nowYear = now.getFullYear();

      const isToday =
        messageDay === nowDay &&
        messageMonth === nowMonth &&
        messageYear === nowYear;

      if (isToday) {
        return messageDate.toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
        });
      }

      const daysOfWeek = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
      const messageWeekDay = messageDate.getDay();
      const nowWeekDay = now.getDay();

      const diff =
        now.getTime() - messageDate.getTime() >= 0
          ? nowWeekDay - messageWeekDay
          : messageWeekDay - nowWeekDay;

      if (diff < 7 && diff >= 0) {
        return daysOfWeek[messageWeekDay];
      }

      return `${messageDate.getDate().toString().padStart(2, '0')}.${(
        messageDate.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}.${messageDate.getFullYear().toString().slice(-2)}`;
    } catch (err) {
      console.error('Ошибка при форматировании времени:', err);
      return '';
    }
  }

  protected override render(): string {
    return chatItemTemplate;
  }
}
