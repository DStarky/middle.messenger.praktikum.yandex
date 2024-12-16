import { Block } from '../../../app/Block';

export const template = `
<div class="message {{#if message.isOwn}}message_own{{else}}message_other{{/if}}">
  <div class="message__content">{{message.text}}</div>
  <div class="message__time">{{message.time}}</div>
</div>
`;

type MessageData = {
  id: string;
  text: string;
  time: string;
  isOwn?: boolean;
};

type MessageProps = {
  message: MessageData;
  className?: string;
  events?: Record<string, (e: Event) => void>;
};

export class Message extends Block {
  constructor(props: MessageProps) {
    super('div', props);
  }

  override render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
