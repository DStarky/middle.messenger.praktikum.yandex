import type { Props } from '../../../../app/Block';
import Block from '../../../../app/Block';
import { ProfileStaticField } from '../ProfileStaticField/ProfileStaticField';

const profilePersonalDataTemplate = `
  <div class="fragment">
    {{{email}}}
    {{{login}}}
    {{{firstName}}}
    {{{secondName}}}
    {{{displayName}}}
    {{{phone}}}
  </div>
`;

interface ProfilePersonalDataProps extends Props {
  email: ProfileStaticField;
  login: ProfileStaticField;
  firstName: ProfileStaticField;
  secondName: ProfileStaticField;
  displayName: ProfileStaticField;
  phone: ProfileStaticField;
}

export class ProfilePersonalData extends Block<ProfilePersonalDataProps> {
  constructor(props: ProfilePersonalDataProps) {
    super({
      ...props,
      email: new ProfileStaticField({
        label: 'Почта',
        value: '',
      }),
      login: new ProfileStaticField({
        label: 'Логин',
        value: '',
      }),
      firstName: new ProfileStaticField({
        label: 'Имя',
        value: '',
      }),
      secondName: new ProfileStaticField({
        label: 'Фамилия',
        value: '',
      }),
      displayName: new ProfileStaticField({
        label: 'Имя в чате',
        value: '',
      }),
      phone: new ProfileStaticField({
        label: 'Телефон',
        value: '',
      }),
    });
  }

  override render(): string {
    return profilePersonalDataTemplate;
  }
}
