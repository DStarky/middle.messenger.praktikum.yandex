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

export class ProfilePersonalData extends Block<Props> {
  constructor(props: Props) {
    super({
      ...props,
      email: new ProfileStaticField({
        label: 'Почта',
        value: 'pochta@yandex.ru',
      }),
      login: new ProfileStaticField({
        label: 'Логин',
        value: 'ivanivanov',
      }),
      firstName: new ProfileStaticField({
        label: 'Имя',
        value: 'Иван',
      }),
      secondName: new ProfileStaticField({
        label: 'Фамилия',
        value: 'Иванов',
      }),
      displayName: new ProfileStaticField({
        label: 'Имя в чате',
        value: 'Иван',
      }),
      phone: new ProfileStaticField({
        label: 'Телефон',
        value: '+79099673030',
      }),
    });
  }

  override render(): string {
    return profilePersonalDataTemplate;
  }
}
