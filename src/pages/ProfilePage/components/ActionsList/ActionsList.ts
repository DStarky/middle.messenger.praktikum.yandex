import type { Props } from '../../../../app/Block';
import Block from '../../../../app/Block';
import { ROUTES } from '../../../../app/routes';
import { Link } from '../../../../components/common/Link/Link';
import type { Events } from '../../../../types/Events';
import { ProfileAction } from '../ProfileAction/ProfileAction';

const template = `
<div class="fragment">
    <div class="profile-page__item profile-page__border-bottom">
      {{{editPersonalData}}}
    </div>
    <div class="profile-page__item profile-page__border-bottom">
      {{{editPasswordData}}}
    </div>
    <div class="profile-page__item profile-page__border-bottom">
      {{{logoutLink}}}
    </div>
</div>
`;

interface ActionsListEvents extends Events {
  onEditPersonalDataClick?: (e: Event) => void;
  onEditPasswordDataClick?: (e: Event) => void;
}

interface ActionsListProps extends Props {
  events?: ActionsListEvents;
}

export class ActionsList extends Block<ActionsListProps> {
  constructor(props: ActionsListProps) {
    super({
      ...props,
      editPersonalData: new ProfileAction({
        id: 'edit-personal-data',
        className: 'profile-page__edit-link',
        text: 'Изменить данные',
        events: props.events?.onEditPersonalDataClick
          ? { click: props.events.onEditPersonalDataClick }
          : undefined,
      }),
      editPasswordData: new ProfileAction({
        id: 'edit-password-data',
        className: 'profile-page__edit-link',
        text: 'Изменить пароль',
        events: props.events?.onEditPasswordDataClick
          ? { click: props.events.onEditPasswordDataClick }
          : undefined,
      }),
      logoutLink: new Link({
        href: ROUTES.LOGIN,
        text: 'Выйти',
        className: 'profile-page__logout-link',
      }),
    });
  }

  protected override render(): string {
    return template;
  }
}
