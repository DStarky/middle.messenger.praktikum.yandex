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
        validationRules: [
          {
            validator: (value: string) => value.trim().length > 0,
            message: 'Старый пароль обязателен для заполнения',
          },
          {
            validator: (value: string) => value.length >= 6,
            message: 'Пароль должен содержать не менее 6 символов',
          },
        ],
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
        validationRules: [
          {
            validator: (value: string) => value.trim().length > 0,
            message: 'Новый пароль обязателен для заполнения',
          },
          {
            validator: (value: string) => value.length >= 6,
            message: 'Пароль должен содержать не менее 6 символов',
          },
        ],
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
        validationRules: [
          {
            validator: (value: string) => value.trim().length > 0,
            message: 'Подтверждение пароля обязательно для заполнения',
          },
          {
            validator: (value: string) => {
              const newPasswordField = this.children
                .newPassword as ProfileEditableField;
              return value === newPasswordField.getValue();
            },
            message: 'Пароли не совпадают',
          },
        ],
      }),
    });
  }

  public validateAllFields(): boolean {
    const fields = [
      this.children.oldPassword,
      this.children.newPassword,
      this.children.confirmPassword,
    ] as ProfileEditableField[];

    let isValid = true;

    fields.forEach(field => {
      const fieldValid = field.validate();
      if (!fieldValid) {
        isValid = false;
      }
    });

    return isValid;
  }

  override render(): string {
    return passwordDataEditableTemplate;
  }
}
