import type { Props } from '../../../../app/Block';
import Block from '../../../../app/Block';
import { ProfileStaticField } from '../ProfileStaticField/ProfileStaticField';

const profilePasswordDataTemplate = `
  <div class="fragment">
    {{{oldPassword}}}
    {{{newPassword}}}
    {{{confirmPassword}}}
  </div>
`;

export class ProfilePasswordData extends Block<Props> {
  constructor(props: Props) {
    super({
      ...props,
      oldPassword: new ProfileStaticField({
        label: 'Старый пароль',
        value: '•••••••••',
      }),
      newPassword: new ProfileStaticField({
        label: 'Новый пароль',
        value: '•••••••••••',
      }),
      confirmPassword: new ProfileStaticField({
        label: 'Повторите новый пароль',
        value: '•••••••••••',
      }),
    });
  }

  override render(): string {
    return profilePasswordDataTemplate;
  }
}
