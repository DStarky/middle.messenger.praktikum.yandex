import type { Props } from '../../../../app/Block';
import Block from '../../../../app/Block';
import type { SimpleInput } from '../../../../components/common/SimpleInput/SimpleInput';
import { validationRules } from '../../../../helpers/validationRules';
import type { ProfileData } from '../../../../types/Profile';
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

interface PersonalDataEditableProps extends Props {
  initialData?: Partial<ProfileData>;
}

export class PersonalDataEditable extends Block<PersonalDataEditableProps> {
  constructor(props: PersonalDataEditableProps) {
    super({
      ...props,
      email: new ProfileEditableField({
        label: 'Почта',
        name: 'email',
        value: props.initialData?.email || '',
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
        value: props.initialData?.login || '',
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
        value: props.initialData?.first_name || '',
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
        value: props.initialData?.second_name || '',
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
        value: props.initialData?.display_name || '',
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
        value: props.initialData?.phone || '',
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

  protected componentDidUpdate(
    oldProps: PersonalDataEditableProps,
    newProps: PersonalDataEditableProps,
  ): boolean {
    if (oldProps.initialData !== newProps.initialData) {
      if (newProps.initialData?.email) {
        (this.children.email as SimpleInput).setProps({
          value: newProps.initialData.email,
        });
      }

      if (newProps.initialData?.login) {
        (this.children.login as ProfileEditableField).setProps({
          value: newProps.initialData.login,
        });
      }

      if (newProps.initialData?.first_name) {
        (this.children.firstName as ProfileEditableField).setProps({
          value: newProps.initialData.first_name,
        });
      }

      if (newProps.initialData?.second_name) {
        (this.children.secondName as ProfileEditableField).setProps({
          value: newProps.initialData.second_name,
        });
      }

      if (newProps.initialData?.display_name) {
        (this.children.displayName as ProfileEditableField).setProps({
          value: newProps.initialData.display_name,
        });
      }

      if (newProps.initialData?.phone) {
        (this.children.phone as ProfileEditableField).setProps({
          value: newProps.initialData.phone,
        });
      }

      return true;
    }

    return false;
  }

  override render(): string {
    return personalDataEditableTemplate;
  }
}
