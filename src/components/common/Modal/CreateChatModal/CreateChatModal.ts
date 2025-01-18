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
    </div>
    <div class="create-chat-form__footer">
      {{{ createButton }}}
    </div>
  </form>
`;

interface CreateChatModalProps extends Props {
  events?: Events;
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
      events: {
        ...props.events,
        submit: (e: Event) => this.handleSubmit(e),
      },
    });
  }

  override render(): string {
    return template;
  }

  private handleSubmit(event: Event): void {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    if (form.id !== 'create-chat-form') {
      return;
    }

    const formData = new FormData(form);
    const chatName = formData.get('chatName') as string;

    if (!chatName) {
      return;
    }

    console.log('Chat name:', chatName);
  }
}
