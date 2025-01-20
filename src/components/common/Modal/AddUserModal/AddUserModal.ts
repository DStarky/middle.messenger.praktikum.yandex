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
      <h3>Добавить пользоваетля</h3>
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

interface AddUserModalProps extends Props {
  chatId: number;
  events?: Events;
  errorMessage?: string | null;
  loading?: boolean;
}

export class AddUserModal extends Block<AddUserModalProps> {
  constructor(props: AddUserModalProps) {
    const userIdsInput = new SimpleInput({
      type: 'text',
      id: 'user-ids',
      name: 'userIds',
      placeholder: 'Введите ID пользователей через запятую',
      className: 'modal-input',
      value: '',
      events: {
        input: () => this.clearError(),
      },
    });

    const addButton = new Button({
      type: 'submit',
      text: 'Добавить',
      className: 'add-user-button w-full',
      disabled: false,
    });

    const loader = new Loader({
      className: 'add-user-loader',
    });

    super({
      ...props,
      userIdsInput,
      addButton,
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
    if (form.id !== 'add-user-form') {
      return;
    }

    const formData = new FormData(form);
    const userIdsRaw = (formData.get('userIds') as string).trim();

    if (!userIdsRaw) {
      this.setProps({
        errorMessage: 'ID пользователей не могут быть пустыми.',
      });
      return;
    }

    // Разделение ID по запятой и преобразование в числа
    const userIds = userIdsRaw
      .split(',')
      .map(id => parseInt(id.trim(), 10))
      .filter(id => !isNaN(id));

    if (userIds.length === 0) {
      this.setProps({ errorMessage: 'Введите корректные ID пользователей.' });
      return;
    }

    this.setProps({ errorMessage: null, loading: true });
    const addButton = this.children.addButton as Button;
    if (addButton) {
      addButton.setProps({ disabled: true });
    }

    try {
      await ChatController.addUsersToChat(
        this.props.chatId,
        userIds,
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
          // TODO добавить сообщение об успешном добавлении пользователя
        },
      );
    } catch (error) {
      console.error('Ошибка при добавлении пользователя:', error);
      this.setProps({
        errorMessage: 'Произошла ошибка при добавлении пользователя.',
      });
    } finally {
      this.setProps({ loading: false });
      if (addButton) {
        addButton.setProps({ disabled: false });
      }
    }
  }

  private clearError(): void {
    if (this.props.errorMessage) {
      this.setProps({ errorMessage: null });
    }
  }
}
