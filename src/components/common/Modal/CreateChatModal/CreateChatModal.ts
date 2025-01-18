import type { Props } from '../../../../app/Block';
import Block from '../../../../app/Block';
import ChatController from '../../../../controllers/ChatController';
import type { Events } from '../../../../types/Events';
import { Button } from '../../Button/Button';
import { SimpleInput } from '../../SimpleInput/SimpleInput';
import { Loader } from '../../Loader/Loader';

const template = `
  <form class="create-chat-form" id="create-chat-form">
    <div class="create-chat-form__header">
      <h3>Создать новый чат</h3>
    </div>
    <div class="create-chat-form__body">
      {{{ chatNameInput }}}
      {{#if errorMessage}}
        <div class="create-chat__error-message">{{errorMessage}}</div>
      {{/if}}
      {{#if loading}}
        <div class="create-chat__loader">{{{ loader }}}</div>
      {{/if}}
    </div>
    <div class="create-chat-form__footer">
      {{{ createButton }}}
    </div>
  </form>
`;

interface CreateChatModalProps extends Props {
  events?: Events;
  errorMessage?: string | null;
  loading?: boolean;
}

export class CreateChatModal extends Block<CreateChatModalProps> {
  constructor(props: CreateChatModalProps) {
    const chatNameInput = new SimpleInput({
      type: 'text',
      id: 'chat-name',
      name: 'chatName',
      placeholder: 'Введите название чата',
      className: 'modal-input',
      value: '',
      events: {
        input: () => this.clearError(),
      },
    });

    const createButton = new Button({
      type: 'submit',
      text: 'Создать чат',
      className: 'create-chat-button w-full',
      disabled: false,
    });

    const loader = new Loader({
      className: 'create-chat-loader',
    });

    super({
      ...props,
      chatNameInput,
      createButton,
      loader,
      errorMessage: null,
      loading: false,
      events: {
        ...props.events,
        submit: (e: Event) => this.handleSubmit(e),
      },
    });
  }

  override render(): string {
    return template;
  }

  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    if (form.id !== 'create-chat-form') {
      return;
    }

    const formData = new FormData(form);
    const chatName = (formData.get('chatName') as string).trim();

    if (!chatName) {
      this.setProps({ errorMessage: 'Название чата не может быть пустым.' });
      return;
    }

    this.setProps({ errorMessage: null, loading: true });
    const createButton = this.children.createButton as Button;
    if (createButton) {
      createButton.setProps({ disabled: true });
    }

    try {
      await ChatController.createChat(
        chatName,
        () => {},
        (error: string | null) => {
          if (error) {
            this.setProps({ errorMessage: error });
          }
        },
        () => {
          if (this.props.events?.close) {
            this.props.events.close(new Event('close'));
          }
          // TODO добавить сообщение об успешном создании чата
        },
      );
    } catch (error) {
      console.error('Ошибка при создании чата:', error);
      this.setProps({ errorMessage: 'Произошла ошибка при создании чата.' });
    } finally {
      this.setProps({ loading: false });
      if (createButton) {
        createButton.setProps({ disabled: false });
      }
    }
  }

  private clearError(): void {
    if (this.props.errorMessage) {
      this.setProps({ errorMessage: null });
    }
  }
}
