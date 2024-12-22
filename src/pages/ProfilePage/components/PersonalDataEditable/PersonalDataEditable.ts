import type { Props } from '../../../../app/Block';
import Block from '../../../../app/Block';
import { validationRules } from '../../../../helpers/validationRules';
import { ProfileEditableField } from '../ProfileEditableField/ProfileEditableField';

const personalDataEditableTemplate = `
  <form id="profile-data">
    {{{email}}}
    {{{login}}}
    {{{firstName}}}
    {{{secondName}}}
    {{{displayName}}}
    {{{phone}}}
  </form>
`;

export class PersonalDataEditable extends Block<Props> {
  constructor(props: Props) {
    super({
      ...props,
      email: new ProfileEditableField({
        label: 'Почта',
        name: 'email',
        value: 'pochta@yandex.ru',
        id: 'email-input',
        placeholder: 'Введите почту',
        type: 'email',
        events: props.events?.emailChange
          ? { change: props.events.emailChange }
          : undefined,
        validationRules: validationRules.email,
      }),
      login: new ProfileEditableField({
        label: 'Логин',
        name: 'login',
        value: 'ivanivanov',
        id: 'login-input',
        placeholder: 'Введите логин',
        type: 'text',
        events: props.events?.loginChange
          ? { change: props.events.loginChange }
          : undefined,
        validationRules: validationRules.login,
      }),
      firstName: new ProfileEditableField({
        label: 'Имя',
        name: 'first_name',
        value: 'Иван',
        id: 'first-name-input',
        placeholder: 'Введите имя',
        type: 'text',
        events: props.events?.firstNameChange
          ? { change: props.events.firstNameChange }
          : undefined,
        validationRules: validationRules.name,
      }),
      secondName: new ProfileEditableField({
        label: 'Фамилия',
        name: 'second_name',
        value: 'Иванов',
        id: 'second-name-input',
        placeholder: 'Введите фамилию',
        type: 'text',
        events: props.events?.secondNameChange
          ? { change: props.events.secondNameChange }
          : undefined,
        validationRules: validationRules.name,
      }),
      displayName: new ProfileEditableField({
        label: 'Имя в чате',
        name: 'display_name',
        value: 'Ivan',
        id: 'display-name-input',
        placeholder: 'Введите имя в чате',
        type: 'text',
        events: props.events?.displayNameChange
          ? { change: props.events.displayNameChange }
          : undefined,
        validationRules: validationRules.login,
      }),
      phone: new ProfileEditableField({
        label: 'Телефон',
        name: 'phone',
        value: '+79099673030',
        id: 'phone-input',
        placeholder: 'Введите телефон',
        type: 'tel',
        events: props.events?.phoneChange
          ? { change: props.events.phoneChange }
          : undefined,
        validationRules: validationRules.phone,
      }),
    });
  }

  public validateAllFields(): boolean {
    const fields = [
      this.children.email,
      this.children.login,
      this.children.firstName,
      this.children.secondName,
      this.children.displayName,
      this.children.phone,
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
    return personalDataEditableTemplate;
  }
}
