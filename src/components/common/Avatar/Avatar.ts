import type { Props } from '../../../app/Block';
import Block from '../../../app/Block';

const template = `
  <div class="avatar">
    <img src="{{src}}" alt="{{alt}}" class="avatar-img {{className}}" />
  </div>
`;

interface AvatarProps extends Props {
  src?: string;
  alt: string;
  className?: string;
  events?: Record<string, (e: Event) => void>;
}

export class Avatar extends Block<AvatarProps> {
  constructor(props: AvatarProps) {
    super({
      src: props.src || 'https://default-avatar.com/default.jpg',
      ...props,
    });
  }

  override render(): string {
    return template;
  }
}
