import PlusIcon from '../../../../assets/icons/plus.svg';
import DeleteIcon from '../../../../assets/icons/delete.svg';
import type { Props } from '../../../../app/Block';
import type { Events } from '../../../../types/Events';
import Block from '../../../../app/Block';

const template = `
  <div class="users-popup">
    <div class="users-popup__items">
      <div class="users-popup__item">
        <img src="${PlusIcon}" alt="plus icon" />
        <p>Добавить пользователя</p>
      </div>
      <div class="users-popup__item">
        <img src="${DeleteIcon}" alt="delete icon" />
        <p>Удалить пользователя</p>
      </div>
    </div>
  </div>
`;

interface UserPopupProps extends Props {
  events?: Events;
}

export class UsersPopup extends Block<UserPopupProps> {
  constructor(props: UserPopupProps) {
    super(props);
  }

  override render(): string {
    return template;
  }
}
