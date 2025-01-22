import type { Props } from '../../../app/Block';
import Block from '../../../app/Block';
import MenuIcon from '../../../assets/icons/menu.svg';
import ArrowRightIcon from '../../../assets/icons/arrow-right.svg';
import type { MessageData } from '../../../components/common/Message/Message';
import { Message } from '../../../components/common/Message/Message';
import { SimpleInput } from '../../../components/common/SimpleInput/SimpleInput';
import { Button } from '../../../components/common/Button/Button';
import type { Events } from '../../../types/Events';
import { validationRules } from '../../../helpers/validationRules';
import { UsersPopup } from './UsersPopup/UsersPopup';
import { Toaster } from '../../../components/common/Toaster/Toaster';
import ChatController from '../../../controllers/ChatController';
import { ChatAvatar } from './ChatAvatar/ChatAvatar';
import { RESOURCE_URL } from '../../../consts/URLs';

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
  usersPopup?: UsersPopup;
  onFocusChat?: () => void;
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
      {{{usersPopup}}}
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
  private toaster: Toaster | null = null;
  constructor(props: InnerChatProps) {
    super(props);
  }

  override init(): void {
    this.createChildren(this.props);

    this.setProps({
      events: {
        click: (e: Event) => {
          const target = e.target as HTMLElement;
          if (target.closest('.chat-header__settings')) {
            this.toggleUsersPopup();
          }

          this.props.onFocusChat?.();
        },
      },
    });

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

  private initToaster(): void {
    this.toaster = new Toaster({
      type: 'success',
      message: '',
      show: false,
      timeout: 3000,
    });
    document.body.appendChild(this.toaster.getContent()!);
  }

  private showSuccessToast(message: string): void {
    this.toaster?.setProps({
      type: 'success',
      message: message,
      show: true,
    });
    this.toaster?.show();
  }

  private showErrorToast(message: string): void {
    this.toaster?.setProps({
      type: 'error',
      message: message,
      show: true,
    });
    this.toaster?.show();
  }

  private createChildren(props: InnerChatProps): void {
    this.children = {};

    if (props.selectedChat) {
      this.children.usersPopup = new UsersPopup({
        chatId: props.selectedChat.id,
      });
      this.children.usersPopup.hide();

      const avatar = new ChatAvatar({
        src: props.selectedChat.avatar
          ? `${RESOURCE_URL}${props.selectedChat.avatar}`
          : '',
        alt: props.selectedChat.title,
        size: 'small',
        events: {
          click: () => this.handleChangeAvatar(),
        },
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
          focus: () => {
            this.props.onFocusChat?.();
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

  private handleChangeAvatar(): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.onchange = async () => {
      if (!fileInput.files?.[0]) {
        return;
      }

      const file = fileInput.files[0];
      const chatId = this.props.selectedChat?.id;

      if (!chatId) {
        this.showErrorToast('Чат не выбран');
        return;
      }

      try {
        await ChatController.updateChatAvatar(
          chatId,
          file,
          loading => this.setProps({ isLoading: loading }),
          error => {
            this.showErrorToast(error || 'Ошибка загрузки аватара');
          },
          updatedChat => {
            this.showSuccessToast('Аватар чата обновлен!');
            if (this.children.avatar) {
              (this.children.avatar as ChatAvatar)
                .getChildren()
                .avatar.setProps({
                  src: `${RESOURCE_URL}${updatedChat.avatar}`,
                });
            }
          },
        );
      } catch (error: unknown) {
        console.error(error);
        this.showErrorToast('Неизвестная ошибка при загрузке аватара');
      }
    };

    fileInput.click();
  }

  private toggleUsersPopup(): void {
    const popup = this.children.usersPopup as UsersPopup;
    if (!popup) {
      return;
    }

    const popupEl = popup.getContent();
    if (!popupEl) {
      return;
    }

    const isHidden = popupEl.style.display === 'none' || !popupEl.style.display;

    if (isHidden) {
      popup.show();
    } else {
      popup.hide();
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
