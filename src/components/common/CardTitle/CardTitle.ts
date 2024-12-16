import { Block } from '../../../app/Block';

export const template = `
  <h2 class="card-title">{{text}}</h2>
`;

type CardTitleProps = {
  text: string;
  className?: string;
  events?: Record<string, (e: Event) => void>;
};

export class CardTitle extends Block {
  constructor(props: CardTitleProps) {
    super('h2', props);
  }

  override render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
