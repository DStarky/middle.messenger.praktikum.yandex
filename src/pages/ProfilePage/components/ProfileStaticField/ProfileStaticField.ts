import type { Props } from '../../../../app/Block';
import Block from '../../../../app/Block';

const profileStaticFieldTemplate = `
  <div class="profile-page__item profile-page__border-bottom">
    <p class="profile-page__left">{{label}}</p>
    <p class="profile-page__right">{{value}}</p>
  </div>
`;

interface ProfileStaticFieldProps extends Props {
  label: string;
  value: string;
}

export class ProfileStaticField extends Block<ProfileStaticFieldProps> {
  constructor(props: ProfileStaticFieldProps) {
    super(props);
  }

  override render(): string {
    return profileStaticFieldTemplate;
  }
}
