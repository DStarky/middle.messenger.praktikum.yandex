import type { Props } from '../../../../app/Block';
import Block from '../../../../app/Block';
import { Avatar } from '../../../../components/common/Avatar/Avatar';

const profileAvatarTemplate = `
  <div class="profile-page__avatar">
    <div class="avatar-wrapper">
      {{{avatar}}}
      <span class="avatar-text">{{text}}</span>
    </div>
  </div>
`;

interface ProfileAvatarProps extends Props {
  src: string;
  alt: string;
  text?: string;
  onClick?: (e: Event) => void;
}
export class ProfileAvatar extends Block<ProfileAvatarProps> {
  constructor(props: ProfileAvatarProps) {
    const avatar = new Avatar({
      src: props.src,
      alt: props.alt,
      className: 'avatar_size-large',
    });

    super({
      ...props,
      avatar,
      text: props.text || 'Поменять аватар',
      events: props.onClick ? { click: props.onClick } : undefined,
    });
  }

  public getChildren(): Record<string, Block> {
    return { avatar: this.children.avatar as Avatar };
  }

  override render(): string {
    return profileAvatarTemplate;
  }
}
