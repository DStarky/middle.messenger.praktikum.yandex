import { Block } from '../../../app/Block';
import Handlebars from 'handlebars';

Handlebars.registerHelper('defaultSrc', function (src: string) {
  return src || 'https://default-avatar.com/default.jpg';
});

const AvatarTemplate = `
  <div class="avatar">
    <img src="{{defaultSrc src}}" alt="{{alt}}" class="avatar-img {{className}}" />
  </div>
`;

type AvatarProps = {
  src: string;
  alt: string;
  className?: string;
  events?: Record<string, (e: Event) => void>;
};

export class Avatar extends Block {
  constructor(props: AvatarProps) {
    super('div', props);
  }

  override render(): DocumentFragment {
    return this.compile(AvatarTemplate, this.props);
  }
}
