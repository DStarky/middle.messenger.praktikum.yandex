import type { Props } from '../../../app/Block';
import Block from '../../../app/Block';
import MenuIcon from '../../../assets/icons/menu.svg';
import AttachmentIcon from '../../../assets/icons/attachment.svg';
import ArrowRightIcon from '../../../assets/icons/arrow-right.svg';
import type { MessageData } from '../../../components/common/Message/Message';
import { Avatar } from '../../../components/common/Avatar/Avatar';
import { Message } from '../../../components/common/Message/Message';
import { SimpleInput } from '../../../components/common/SimpleInput/SimpleInput';
import { Button } from '../../../components/common/Button/Button';
import type { Events } from '../../../types/Events';
import { validationRules } from '../../../helpers/validationRules';

interface ChatProps {
  id: number;
  title: string;
  avatar: string;
  unread_count?: number;
  created_by?: number;
}

interface InnerChatProps extends Props {
  selectedChat?: ChatProps | null;
  messages?: MessageData[];
  isLoading?: boolean;
  errorMessage?: string | null;
  onSendMessage?: (message: string) => void;
  className?: string;
  events?: Events;
}

const template = `
  {{#if selectedChat}}
    <div class="fragment">
      <div class="chat-header">
        {{{avatar}}}
        <div class="chat-header__name">{{selectedChat.title}}</div>
        <button class="chat-header__settings">
          <img src="${MenuIcon}" alt="menu" />
        </button>
      </div>
      <div class="chat-messages">
        {{#if isLoading}}
          <div class="chat-loading">Загрузка сообщений...</div>
        {{else if errorMessage}}
          <div class="chat-error">{{errorMessage}}</div>
        {{else}}
          {{{messages}}}
          <div id="scroll-anchor"></div>
        {{/if}}
      </div>
      <div class="chat-input">
        <button class="chat-input__attach">
          <img src="${AttachmentIcon}" alt="attach" />
        </button>
        <div class="chat-input__message">
          {{{input}}}
        </div>
        {{{sendButton}}}
      </div>
    </div>
  {{else}}
    <div class="no-chat-selected">
      Выберите чат, чтобы отправить сообщение
    </div>
  {{/if}}
`;

export class InnerChat extends Block<InnerChatProps> {
  constructor(props: InnerChatProps) {
    super(props);
  }

  override init(): void {
    this.createChildren(this.props);
    requestAnimationFrame(() => this.scrollToBottom());
  }

  override componentDidUpdate(
    oldProps: InnerChatProps,
    newProps: InnerChatProps,
  ): boolean {
    const chatChanged = oldProps.selectedChat !== newProps.selectedChat;
    const needFullRender =
      chatChanged ||
      oldProps.isLoading !== newProps.isLoading ||
      oldProps.errorMessage !== newProps.errorMessage;

    if (needFullRender) {
      this.createChildren(newProps);
      requestAnimationFrame(() => this.scrollToBottom());
      return true;
    }

    return false;
  }

  private createChildren(props: InnerChatProps): void {
    this.children = {};

    if (props.selectedChat) {
      const avatar = new Avatar({
        src: props.selectedChat.avatar,
        alt: props.selectedChat.title,
        className: 'avatar_size-small',
      });

      const input = new SimpleInput({
        type: 'text',
        id: 'message',
        name: 'message',
        placeholder: 'Сообщение',
        value: '',
        className: 'simple-input_message simple-input',
        events: {
          keydown: (e: Event) => {
            const keyboardEvent = e as KeyboardEvent;
            if (keyboardEvent.key === 'Enter') {
              this.handleSendClick();
            }
          },
        },
      });

      const sendButton = new Button({
        type: 'button',
        className: 'button_round',
        icon: ArrowRightIcon,
        alt: 'Send',
        events: {
          click: () => this.handleSendClick(),
        },
      });

      this.children.avatar = avatar;
      this.children.input = input;
      this.children.sendButton = sendButton;
    }
  }

  public appendMessage(message: MessageData): void {
    const container = this.getContent()?.querySelector('.chat-messages');
    if (!container) {
      return;
    }

    const msg = new Message({ message });
    const content = msg.getContent();
    if (content) {
      container.insertBefore(
        content,
        container.querySelector('#scroll-anchor'),
      );
      requestAnimationFrame(() => this.scrollToBottom());
    }
  }

  public prependMessages(oldMessages: MessageData[]): void {
    const container = this.getContent()?.querySelector('.chat-messages');
    if (!container) {
      return;
    }

    const anchor = container.querySelector('#scroll-anchor');
    for (let i = oldMessages.length - 1; i >= 0; i--) {
      const msg = new Message({ message: oldMessages[i] });
      const content = msg.getContent();
      if (content && anchor) {
        container.insertBefore(content, anchor);
      }
    }

    this.scrollToBottom();
  }

  private handleSendClick(): void {
    const input = this.children.input as SimpleInput;
    const message = input.getValue().trim();

    const requiredRules = validationRules.required || [];
    let errorMessage = '';

    for (const rule of requiredRules) {
      if (!rule.validator(message)) {
        errorMessage = rule.message;
        break;
      }
    }

    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    if (this.props.onSendMessage && message) {
      this.props.onSendMessage(message);
      input.setValue('');
    }
  }

  private scrollToBottom(): void {
    const content = this.getContent();
    if (!content) {
      return;
    }

    const anchor = content.querySelector(
      '#scroll-anchor',
    ) as HTMLElement | null;
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth' });
    }
  }

  protected override render(): string {
    return template;
  }
}
