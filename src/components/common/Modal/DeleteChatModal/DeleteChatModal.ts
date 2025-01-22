import type { Props } from '../../../../app/Block';
import Block from '../../../../app/Block';
import ChatController from '../../../../controllers/ChatController';
import type { Events } from '../../../../types/Events';
import { Button } from '../../Button/Button';
import { Loader } from '../../Loader/Loader';
import { Toaster } from '../../Toaster/Toaster';

const template = `
  <form class="delete-chat-form" id="delete-chat-form"> <!-- Добавляем форму -->
    <div class="delete-chat-modal">
      <div class="delete-chat-modal__header">
        <h3>Удаление чата</h3>
      </div>
      <div class="delete-chat-modal__body">
        <p>Вы уверены, что хотите удалить этот чат? Это действие нельзя отменить.</p>
        {{#if errorMessage}}
          <div class="delete-chat__error-message">{{errorMessage}}</div>
        {{/if}}
        {{#if loading}}
          <div class="delete-chat__loader">{{{ loader }}}</div>
        {{/if}}
      </div>
      <div class="delete-chat-modal__footer">
        {{{ cancelButton }}}
        {{{ deleteButton }}}
      </div>
    </div>
  </form>
`;

interface DeleteChatModalProps extends Props {
  chatId: number;
  events?: Events;
}

export class DeleteChatModal extends Block<DeleteChatModalProps> {
  private toaster: Toaster | null = null;

  constructor(props: DeleteChatModalProps) {
    const cancelButton = new Button({
      type: 'button',
      text: 'Отмена',
      className: 'button_secondary w-full',
      events: {
        click: () => this.props.events?.close?.(new Event('close')),
      },
    });

    const deleteButton = new Button({
      type: 'submit',
      text: 'Удалить',
      className: 'button_danger w-full',
      disabled: false,
    });

    const loader = new Loader({});

    super({
      ...props,
      cancelButton,
      deleteButton,
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
    this.toaster?.setProps({
      type: 'success',
      message: 'Чат успешно удален!',
      show: true,
    });
    this.toaster?.show();
  }

  private showErrorToast(message: string): void {
    this.toaster?.setProps({
      type: 'error',
      message: message || 'Ошибка при удалении чата',
      show: true,
    });
    this.toaster?.show();
  }

  override render(): string {
    return template;
  }

  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    if (form.id !== 'delete-chat-form') {
      return;
    }

    this.setProps({ errorMessage: null, loading: true });
    const deleteButton = this.children.deleteButton as Button;
    deleteButton.setProps({ disabled: true });

    try {
      await ChatController.deleteChat(
        this.props.chatId,
        loading => this.setProps({ loading }),
        error => {
          this.showErrorToast(error || 'Неизвестная ошибка');
          this.setProps({ errorMessage: error });
        },
        () => {
          this.showSuccessToast();
          this.props.events?.close?.(new Event('close'));
          ChatController.fetchChats(
            () => {},
            () => {},
            () => {},
          );
        },
      );
    } catch (error) {
      console.error('Ошибка при удалении чата:', error);
      this.showErrorToast('Произошла ошибка при удалении чата');
    } finally {
      this.setProps({ loading: false });
      deleteButton.setProps({ disabled: false });
    }
  }
}
