import type { Props } from '../../../../app/Block';
import Block from '../../../../app/Block';
import type { Events } from '../../../../types/Events';
import { Button } from '../../Button/Button';
import { SimpleInput } from '../../SimpleInput/SimpleInput';

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
    </div>
    <div class="create-chat-form__footer">
      {{{ createButton }}}
    </div>
  </form>
`;

interface CreateChatModalProps extends Props {
  events?: Events;
  errorMessage?: string | null;
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
    });

    super({
      ...props,
      chatNameInput,
      createButton,
      errorMessage: null,
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

    this.setProps({ errorMessage: null });

    console.log('Chat name:', chatName);
  }

  private clearError(): void {
    if (this.props.errorMessage) {
      this.setProps({ errorMessage: null });
    }
  }
}
