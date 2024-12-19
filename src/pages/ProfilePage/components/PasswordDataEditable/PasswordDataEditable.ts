import type { Props } from '../../../../app/Block';
import Block from '../../../../app/Block';
import { ProfileEditableField } from '../ProfileEditableField/ProfileEditableField';

const passwordDataEditableTemplate = `
  <div class="fragment">
    {{{oldPassword}}}
    {{{newPassword}}}
    {{{confirmPassword}}}
  </div>
`;

interface PasswordDataEditableProps extends Props {
  oldPassword: ProfileEditableField;
  newPassword: ProfileEditableField;
  confirmPassword: ProfileEditableField;
  events?: {
    oldPasswordChange?: (e: Event) => void;
    newPasswordChange?: (e: Event) => void;
    confirmPasswordChange?: (e: Event) => void;
  };
}

export class PasswordDataEditable extends Block<PasswordDataEditableProps> {
  constructor(props: PasswordDataEditableProps) {
    super({
      ...props,
      oldPassword: new ProfileEditableField({
        id: '',
        placeholder: '',
        label: 'Старый пароль',
        name: 'oldPassword',
        value: '',
        type: 'password',
        events: props.events?.oldPasswordChange
          ? { change: props.events.oldPasswordChange }
          : undefined,
      }),
      newPassword: new ProfileEditableField({
        id: '',
        placeholder: '',
        label: 'Новый пароль',
        name: 'newPassword',
        value: '',
        type: 'password',
        events: props.events?.newPasswordChange
          ? { change: props.events.newPasswordChange }
          : undefined,
      }),
      confirmPassword: new ProfileEditableField({
        id: '',
        placeholder: '',
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
