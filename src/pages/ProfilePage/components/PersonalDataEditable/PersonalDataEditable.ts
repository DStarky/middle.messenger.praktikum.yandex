import type { Props } from '../../../../app/Block';
import Block from '../../../../app/Block';
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
        validationRules: [
          {
            validator: (value: string) =>
              /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: 'Некорректный формат email',
          },
        ],
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
        validationRules: [
          {
            validator: (value: string) => /^[a-zA-Z0-9_]{3,10}$/.test(value),
            message:
              'Логин должен содержать от 3 до 10 символов и может включать буквы, цифры и символ подчеркивания',
          },
        ],
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
        validationRules: [
          {
            validator: (value: string) =>
              /^[A-Za-zА-Яа-яЁё]{2,10}$/.test(value),
            message:
              'Имя должно содержать только буквы и быть длиной от 2 до 10 символов',
          },
        ],
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
        validationRules: [
          {
            validator: (value: string) =>
              /^[A-Za-zА-Яа-яЁё]{2,10}$/.test(value),
            message:
              'Фамилия должна содержать только буквы и быть длиной от 2 до 10 символов',
          },
        ],
      }),
      displayName: new ProfileEditableField({
        label: 'Имя в чате',
        name: 'display_name',
        value: 'Иван',
        id: 'display-name-input',
        placeholder: 'Введите имя в чате',
        type: 'text',
        events: props.events?.displayNameChange
          ? { change: props.events.displayNameChange }
          : undefined,
        validationRules: [
          {
            validator: (value: string) =>
              /^[A-Za-zА-Яа-яЁё0-9_]{2,10}$/.test(value),
            message:
              'Имя в чате должно содержать от 2 до 10 символов и может включать буквы, цифры и символ подчеркивания',
          },
        ],
      }),
      phone: new ProfileEditableField({
        label: 'Телефон',
        name: 'phone',
        value: '+7 (909) 967 30 30',
        id: 'phone-input',
        placeholder: 'Введите телефон',
        type: 'tel',
        events: props.events?.phoneChange
          ? { change: props.events.phoneChange }
          : undefined,
        validationRules: [
          {
            validator: (value: string) =>
              /^\+7\s\(\d{3}\)\s\d{3}\s\d{2}\s\d{2}$/.test(value),
            message:
              'Номер телефона должен соответствовать формату +7 (XXX) XXX XX XX',
          },
        ],
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
