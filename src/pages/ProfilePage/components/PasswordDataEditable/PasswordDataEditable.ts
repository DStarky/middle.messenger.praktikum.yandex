import type { Props } from '../../../../app/Block';
import Block from '../../../../app/Block';
import { ProfileEditableField } from '../ProfileEditableField/ProfileEditableField';

const passwordDataEditableTemplate = `
  <form id="password-data">
    {{{oldPassword}}}
    {{{newPassword}}}
    {{{confirmPassword}}}
  </form>
`;

export class PasswordDataEditable extends Block<Props> {
  constructor(props: Props) {
    super({
      ...props,
      oldPassword: new ProfileEditableField({
        id: 'old-password-input',
        placeholder: 'Введите старый пароль',
        label: 'Старый пароль',
        name: 'oldPassword',
        value: '',
        type: 'password',
        events: props.events?.oldPasswordChange
          ? { change: props.events.oldPasswordChange }
          : undefined,
      }),
      newPassword: new ProfileEditableField({
        id: 'new-password-input',
        placeholder: 'Введите новый пароль',
        label: 'Новый пароль',
        name: 'newPassword',
        value: '',
        type: 'password',
        events: props.events?.newPasswordChange
          ? { change: props.events.newPasswordChange }
          : undefined,
      }),
      confirmPassword: new ProfileEditableField({
        id: 'confirm-password-input',
        placeholder: 'Повторите новый пароль',
        label: 'Повторите новый пароль',
        name: 'confirmPassword',
        value: '',
        type: 'password',
        events: props.events?.confirmPasswordChange
          ? { change: props.events.confirmPasswordChange }
          : undefined,
      }),
    });
  }

  override render(): string {
    return passwordDataEditableTemplate;
  }
}
