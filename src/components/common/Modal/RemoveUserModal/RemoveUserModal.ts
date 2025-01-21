import type { Props } from '../../../../app/Block';
import Block from '../../../../app/Block';
import ChatController from '../../../../controllers/ChatController';
import type { Events } from '../../../../types/Events';
import { Button } from '../../Button/Button';
import { SimpleInput } from '../../SimpleInput/SimpleInput';
import { Loader } from '../../Loader/Loader';

const template = `
  <form class="create-chat-form" id="remove-user-form">
    <div class="create-chat-form__header">
      <h3>Удалить пользователя</h3>
    </div>
    <div class="create-chat-form__body">
      {{{ userIdsInput }}}
      {{#if errorMessage}}
        <div class="create-chat__error-message">{{errorMessage}}</div>
      {{/if}}
      {{#if loading}}
        <div class="create-chat__loader">{{{ loader }}}</div>
      {{/if}}
    </div>
    <div class="create-chat-form__footer">
      {{{ removeButton }}}
    </div>
  </form>
`;

interface RemoveUserModalProps extends Props {
  chatId: number;
  events?: Events;
  errorMessage?: string | null;
  loading?: boolean;
}

export class RemoveUserModal extends Block<RemoveUserModalProps> {
  constructor(props: RemoveUserModalProps) {
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

    const removeButton = new Button({
      type: 'submit',
      text: 'Удалить',
      className: 'w-full',
      disabled: false,
    });

    const loader = new Loader({});

    super({
      ...props,
      userIdsInput,
      removeButton,
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
    if (form.id !== 'remove-user-form') {
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

    const userIds = userIdsRaw
      .split(',')
      .map(id => parseInt(id.trim(), 10))
      .filter(id => !isNaN(id));

    if (userIds.length === 0) {
      this.setProps({ errorMessage: 'Введите корректные ID пользователей.' });
      return;
    }

    this.setProps({ errorMessage: null, loading: true });
    const removeButton = this.children.removeButton as Button;
    if (removeButton) {
      removeButton.setProps({ disabled: true });
    }

    try {
      await ChatController.removeUsersFromChat(
        this.props.chatId,
        userIds,
        () => {},
        (error: string | null) => {
          if (error) {
            if (error === 'Internal Server Error') {
              error = 'Ошибка сервера';
            }

            this.setProps({ errorMessage: error });
          }
        },
        () => {
          if (this.props.events?.close) {
            this.props.events.close(new Event('close'));
          }
          // TODO добавить сообщение об успешном удалении пользователя
        },
      );
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
      this.setProps({
        errorMessage: 'Произошла ошибка при удалении пользователя.',
      });
    } finally {
      this.setProps({ loading: false });
      if (removeButton) {
        removeButton.setProps({ disabled: false });
      }
    }
  }

  private clearError(): void {
    if (this.props.errorMessage) {
      this.setProps({ errorMessage: null });
    }
  }
}
