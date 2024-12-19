import type { Props } from '../../../../app/Block';
import Block from '../../../../app/Block';
import { SimpleInput } from '../../../../components/common/SimpleInput/SimpleInput';

const profileEditableFieldTemplate = `
  <div class="profile-page__item">
    <p class="profile-page__left">{{label}}</p>
    <input class="profile-page__right" type="text" name="{{name}}" value="{{value}}" />
  </div>
`;

interface ProfileEditableFieldProps extends Props {
  label: string;
  name: string;
  value: string;
  id: string;
  placeholder: string;
  type?: string;
  className?: string;
  events?: Record<string, (e: Event) => void>;
}

export class ProfileEditableField extends Block<ProfileEditableFieldProps> {
  constructor(props: ProfileEditableFieldProps) {
    const input = new SimpleInput({
      type: props.type || 'text',
      name: props.name,
      value: props.value,
      className: 'profile-page__right',
      events: props.events,
      id: props.id,
      placeholder: props.placeholder,
    });

    super({
      ...props,
      input,
    });
  }

  override render(): string {
    return profileEditableFieldTemplate;
  }
}
