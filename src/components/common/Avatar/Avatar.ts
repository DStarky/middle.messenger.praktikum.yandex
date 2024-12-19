import type { Props } from '../../../app/Block';
import Block from '../../../app/Block';
import type { Events } from '../../../types/Events';

const template = `
  <div class="avatar">
    <img src="{{src}}" alt="{{alt}}" class="avatar-img {{className}}" />
  </div>
`;

interface AvatarProps extends Props {
  src?: string;
  alt: string;
  className?: string;
  events?: Events;
}

export class Avatar extends Block<AvatarProps> {
  constructor(props: AvatarProps) {
    super({
      ...props,
      src: props.src || '/defaultSrc.png',
    });
  }

  override render(): string {
    return template;
  }
}
