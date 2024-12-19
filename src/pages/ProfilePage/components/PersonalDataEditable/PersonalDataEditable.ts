import type { Props } from '../../../../app/Block';
import Block from '../../../../app/Block';
import { ProfileEditableField } from '../ProfileEditableField/ProfileEditableField';

const personalDataEditableTemplate = `
  <div class="fragment">
    {{{email}}}
    {{{login}}}
    {{{firstName}}}
    {{{secondName}}}
    {{{displayName}}}
    {{{phone}}}
  </div>
`;

interface PersonalDataEditableProps extends Props {
  email: ProfileEditableField;
  login: ProfileEditableField;
  firstName: ProfileEditableField;
  secondName: ProfileEditableField;
  displayName: ProfileEditableField;
  phone: ProfileEditableField;
  events?: {
    emailChange?: (e: Event) => void;
    loginChange?: (e: Event) => void;
    firstNameChange?: (e: Event) => void;
    secondNameChange?: (e: Event) => void;
    displayNameChange?: (e: Event) => void;
    phoneChange?: (e: Event) => void;
  };
}

export class PersonalDataEditable extends Block<PersonalDataEditableProps> {
  constructor(props: PersonalDataEditableProps) {
    super({
      ...props,
      email: new ProfileEditableField({
        label: 'Почта',
        name: 'email',
        value: '',
        id: '',
        placeholder: '',
        type: 'email',
        events: props.events?.emailChange
          ? { change: props.events.emailChange }
          : undefined,
      }),
      login: new ProfileEditableField({
        label: 'Логин',
        name: 'login',
        value: '',
        id: '',
        placeholder: '',
        type: 'text',
        events: props.events?.loginChange
          ? { change: props.events.loginChange }
          : undefined,
      }),
      firstName: new ProfileEditableField({
        label: 'Имя',
        name: 'first_name',
        value: '',
        id: '',
        placeholder: '',
        type: 'text',
        events: props.events?.firstNameChange
          ? { change: props.events.firstNameChange }
          : undefined,
      }),
      secondName: new ProfileEditableField({
        label: 'Фамилия',
        name: 'second_name',
        value: '',
        id: '',
        placeholder: '',
        type: 'text',
        events: props.events?.secondNameChange
          ? { change: props.events.secondNameChange }
          : undefined,
      }),
      displayName: new ProfileEditableField({
        label: 'Имя в чате',
        name: 'display_name',
        value: '',
        id: '',
        placeholder: '',
        type: 'text',
        events: props.events?.displayNameChange
          ? { change: props.events.displayNameChange }
          : undefined,
      }),
      phone: new ProfileEditableField({
        label: 'Телефон',
        name: 'phone',
        value: '',
        id: '',
        placeholder: '',
        type: 'tel',
        events: props.events?.phoneChange
          ? { change: props.events.phoneChange }
          : undefined,
      }),
    });
  }

  override render(): string {
    return personalDataEditableTemplate;
  }
}
