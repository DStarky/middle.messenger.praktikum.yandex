import { Block } from '../../../app/Block';

export class Link extends Block {
  constructor(props: {
    href: string;
    text: string;
    className?: string;
    events?: Record<string, (e: Event) => void>;
  }) {
    super('a', props);
  }

  override render() {
    const template = `<a href="{{href}}" class="default-link {{className}}">{{text}}</a>`;
    return this.compile(template, this.props);
  }
}
