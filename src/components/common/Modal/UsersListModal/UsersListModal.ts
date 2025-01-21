import type { Props } from '../../../../app/Block';
import Block from '../../../../app/Block';
import ChatController from '../../../../controllers/ChatController';
import type { Events } from '../../../../types/Events';
import { Loader } from '../../Loader/Loader';

const template = `
  <div class="users-list-modal">
    <div class="users-list-modal__header">
      <h3>Пользователи чата:</h3>
    </div>
    <div class="users-list-modal__body">
      {{#if loading}}
        <div class="users-list-modal__loader">{{{ loader }}}</div>
      {{else if errorMessage}}
        <div class="users-list-modal__error">{{errorMessage}}</div>
      {{else if users}}
        <ul class="users-list">
          {{#each users}}
            <li class="users-list__item"><strong>{{this.login}} </strong>(id: {{this.id}})</li>
          {{/each}}
        </ul>
      {{else}}
        <div class="users-list-modal__empty">Нет пользователей</div>
      {{/if}}
    </div>
  </div>
`;

interface UsersListModalProps extends Props {
  chatId: number;
  events?: Events;
}

export class UsersListModal extends Block<UsersListModalProps> {
  constructor(props: UsersListModalProps) {
    const loader = new Loader({});

    super({
      ...props,
      loader,
      users: null,
      errorMessage: null,
      loading: true,
    });

    this.loadUsers();
  }

  private async loadUsers(): Promise<void> {
    try {
      await ChatController.getChatUsers(
        this.props.chatId,
        loading => this.setProps({ loading }),
        error => this.setProps({ errorMessage: error }),
        users => {
          this.setProps({
            users,
          });
        },
      );
    } catch (error) {
      console.error('Failed to load users:', error);
      this.setProps({ errorMessage: 'Ошибка загрузки пользователей' });
    }
  }

  override render(): string {
    return template;
  }
}
