import type { Props } from '../../../app/Block';
import Block from '../../../app/Block';

const template = `
  <h2 class="card-title {{className}}">{{text}}</h2>
`;

interface CardTitleProps extends Props {
  text: string;
  className?: string;
  events?: Record<string, (e: Event) => void>;
}

export class CardTitle extends Block<CardTitleProps> {
  constructor(props: CardTitleProps) {
    super(props);
  }

  override render(): string {
    return template;
  }
}
