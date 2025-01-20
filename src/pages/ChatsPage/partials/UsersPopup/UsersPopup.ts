import type { Props } from '../../../../app/Block';
import type { Events } from '../../../../types/Events';
import Block from '../../../../app/Block';
import PlusIcon from '../../../../assets/icons/plus.svg';
import DeleteIcon from '../../../../assets/icons/delete.svg';
import { AddUserModal } from '../../../../components/common/Modal/AddUserModal/AddUserModal';
import { Modal } from '../../../../components/common/Modal/Modal';
import { RemoveUserModal } from '../../../../components/common/Modal/RemoveUserModal/RemoveUserModal';

const template = `
  <div class="users-popup">
    <div class="users-popup__items">
      <div class="users-popup__item" data-action="add">
        <img src="${PlusIcon}" alt="plus icon" />
        <p>Добавить пользователя</p>
      </div>
      <div class="users-popup__item" data-action="remove">
        <img src="${DeleteIcon}" alt="delete icon" />
        <p>Удалить пользователя</p>
      </div>
    </div>
  </div>
`;

interface UsersPopupProps extends Props {
  chatId: number;
  events?: Events;
}

export class UsersPopup extends Block<UsersPopupProps> {
  private modalInstance: Modal | null = null;

  constructor(props: UsersPopupProps) {
    super({
      ...props,
      events: {
        ...props.events,
        click: (e: Event) => this.handleItemClick(e),
      },
    });
  }

  override render(): string {
    return template;
  }

  private handleItemClick(e: Event): void {
    const target = e.target as HTMLElement;
    const actionElement = target.closest('.users-popup__item');

    if (!actionElement) {
      return;
    }

    const action = actionElement.getAttribute('data-action');
    if (!action) {
      return;
    }

    switch (action) {
      case 'add':
        this.openAddUserModal();
        break;
      case 'remove':
        this.openRemoveUserModal();
        break;
      default:
        break;
    }
  }

  private openAddUserModal(): void {
    if (this.modalInstance) {
      return;
    }

    const addUserModalContent = new AddUserModal({
      chatId: this.props.chatId,
      events: {
        close: () => {
          this.closeModal();
        },
      },
    });

    const modal = new Modal({
      size: 'small',
      children: addUserModalContent,
      events: {
        close: () => {
          this.closeModal();
        },
      },
    });

    this.modalInstance = modal;

    const appRoot = document.getElementById('app');
    if (appRoot) {
      appRoot.appendChild(modal.getContent()!);
    }
  }

  private openRemoveUserModal(): void {
    if (this.modalInstance) {
      return;
    }

    const removeUserModalContent = new RemoveUserModal({
      chatId: this.props.chatId,
      events: {
        close: () => {
          this.closeModal();
        },
      },
    });

    const modal = new Modal({
      size: 'small',
      children: removeUserModalContent,
      events: {
        close: () => {
          this.closeModal();
        },
      },
    });

    this.modalInstance = modal;

    const appRoot = document.getElementById('app');
    if (appRoot) {
      appRoot.appendChild(modal.getContent()!);
    }
  }

  private closeModal(): void {
    if (this.modalInstance) {
      this.modalInstance.destroy();
      this.modalInstance = null;
    }
  }
}
