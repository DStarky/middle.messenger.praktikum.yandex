import { Block } from '../../../app/Block';
type LinkProps = {
  href: string;
  text: string;
  className?: string;
  events?: Record<string, (e: Event) => void>;
};

export class Link extends Block {
  constructor(props: LinkProps) {
    super('a', props);
  }

  override render() {
    const template = `<a href="{{href}}" class="default-link {{className}}">{{text}}</a>`;
    return this.compile(template, this.props);
  }
}
