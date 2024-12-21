import type { ValidationRule } from './../../../helpers/validationRules';
import { validationRules } from './../../../helpers/validationRules';
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

interface Chat {
  id: string;
  name: string;
  avatar: string;
}

interface InnerChatProps extends Props {
  selectedChat?: Chat | null;
  messages: MessageData[];
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
        <div class="chat-header__name">{{selectedChat.name}}</div>
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
    super({
      ...props,
      messages: props.messages || [],
    });
  }

  override init() {
    this.createChildren(this.props);
  }

  override componentDidUpdate(
    oldProps: InnerChatProps,
    newProps: InnerChatProps,
  ): boolean {
    if (
      oldProps.selectedChat !== newProps.selectedChat ||
      oldProps.messages !== newProps.messages ||
      oldProps.isLoading !== newProps.isLoading ||
      oldProps.errorMessage !== newProps.errorMessage
    ) {
      this.createChildren(newProps);
      return true;
    }

    return false;
  }

  private createChildren(props: InnerChatProps): void {
    this.children = {};

    if (props.selectedChat) {
      const avatar = new Avatar({
        src: props.selectedChat.avatar,
        alt: props.selectedChat.name,
        className: 'avatar_size-small',
      });

      const messageBlocks = (props.messages || []).map(
        msgData => new Message({ message: msgData }),
      );

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
      this.children.messages = messageBlocks;
      this.children.input = input;
      this.children.sendButton = sendButton;
    }
  }

  private handleSendClick(): void {
    const input = this.children.input as SimpleInput;
    const message = input.getValue();

    const validations = (validationRules.required as ValidationRule[]) || [];
    let errorMessage = '';

    for (const rule of validations) {
      if (!rule.validator(message)) {
        errorMessage = rule.message;
        break;
      }
    }

    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    if (this.props.onSendMessage && message.trim() !== '') {
      this.props.onSendMessage(message);
      input.setValue('');
    }
  }

  protected override render(): string {
    return template;
  }
}
