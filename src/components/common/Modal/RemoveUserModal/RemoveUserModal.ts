import type { Props } from '../../../../app/Block';
import Block from '../../../../app/Block';
import ChatController from '../../../../controllers/ChatController';
import type { Events } from '../../../../types/Events';
import { Button } from '../../Button/Button';
import { SimpleInput } from '../../SimpleInput/SimpleInput';
import { Loader } from '../../Loader/Loader';
import { Toaster } from '../../Toaster/Toaster';

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
  private toaster: Toaster | null = null;

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

    this.initToaster();
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

  private showSuccessToast(): void {
    if (this.toaster) {
      this.toaster.setProps({
        type: 'success',
        message: 'Пользователи успешно удалены!',
        show: true,
      });
      this.toaster.show();
    }
  }

  private showErrorToast(message: string): void {
    if (this.toaster) {
      this.toaster.setProps({
        type: 'error',
        message: message || 'Ошибка при удалении пользователей',
        show: true,
      });
      this.toaster.show();
    }
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

            this.showErrorToast(error);
            this.setProps({ errorMessage: error });
          }
        },
        () => {
          this.showSuccessToast();
          if (this.props.events?.close) {
            this.props.events.close(new Event('close'));
          }
        },
      );
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
      this.showErrorToast(
        error instanceof Error ? error.message : String(error),
      );
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
