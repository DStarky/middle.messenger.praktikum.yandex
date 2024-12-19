import type { Props } from '../../../app/Block';
import Block from '../../../app/Block';

const template = `<a href="{{href}}" class="default-link {{className}}">{{text}}</a>`;

interface LinkProps extends Props {
  href: string;
  text?: string;
  className?: string;
  events?: Record<string, (e: Event) => void>;
}

export class Link extends Block<LinkProps> {
  constructor(props: LinkProps) {
    super(props);
  }

  override render(): string {
    return template;
  }
}
