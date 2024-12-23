import type { Props } from '../../../app/Block';
import Block from '../../../app/Block';

const template = `
  <div class="message {{#if message.isOwn}}message_own{{else}}message_other{{/if}} {{className}}">
    <div class="message__content">{{message.text}}</div>
    <div class="message__time">{{message.time}}</div>
  </div>
`;

export interface MessageData {
  id: string;
  text: string;
  time: string;
  isOwn?: boolean;
}

interface MessageProps extends Props {
  message: MessageData;
  className?: string;
  events?: Record<string, (e: Event) => void>;
}

export class Message extends Block<MessageProps> {
  constructor(props: MessageProps) {
    super(props);
  }

  override render(): string {
    return template;
  }
}
