import type { Props } from '../../../../app/Block';
import Block from '../../../../app/Block';
import { Avatar } from '../../../../components/common/Avatar/Avatar';

const chatAvatarTemplate = `
  <div class="chat-avatar">
    <div class="chat-avatar__wrapper">
      {{{avatar}}}
      <span class="chat-avatar__text">{{text}}</span>
    </div>
  </div>
`;

interface ChatAvatarProps extends Props {
  src: string;
  alt: string;
  text?: string;
  onClick?: (e: Event) => void;
}

export class ChatAvatar extends Block<ChatAvatarProps> {
  constructor(props: ChatAvatarProps) {
    const avatar = new Avatar({
      src: props.src,
      alt: props.alt,
      className: 'avatar_size-small',
    });

    super({
      ...props,
      avatar,
      text: props.text || 'Изменить аватар',
      events: props.onClick ? { click: props.onClick } : undefined,
    });
  }

  public getChildren(): Record<string, Block> {
    return { avatar: this.children.avatar as Avatar };
  }

  override render(): string {
    return chatAvatarTemplate;
  }
}
