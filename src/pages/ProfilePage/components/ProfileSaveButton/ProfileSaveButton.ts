import type { Props } from '../../../../app/Block';
import Block from '../../../../app/Block';
import { Button } from '../../../../components/common/Button/Button';

const profileSaveButtonTemplate = `
  <div class="profile-page__save-button">
    {{{button}}}
  </div>
`;

interface ProfileSaveButtonProps extends Props {
  onClick?: (e: Event) => void;
}

export class ProfileSaveButton extends Block<ProfileSaveButtonProps> {
  constructor(props: ProfileSaveButtonProps) {
    super({
      ...props,
      button: new Button({
        type: 'submit',
        className: 'w-full',
        text: 'Сохранить',
        events: props.onClick ? { click: props.onClick } : undefined,
      }),
    });
  }

  override render(): string {
    return profileSaveButtonTemplate;
  }
}
