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

  public getChildren(): Record<string, Block> {
    return {
      email: this.children.email as ProfileStaticField,
      login: this.children.login as ProfileStaticField,
      firstName: this.children.firstName as ProfileStaticField,
      secondName: this.children.secondName as ProfileStaticField,
      displayName: this.children.displayName as ProfileStaticField,
      phone: this.children.phone as ProfileStaticField,
    };
  }

  override render(): string {
    return profilePersonalDataTemplate;
  }
}
