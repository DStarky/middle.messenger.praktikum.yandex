import type { Props } from '../../../app/Block';
import Block from '../../../app/Block';

const template = `
<button 
  type="{{type}}" 
  class="button {{className}}">
  {{#if icon}}
    <img src="{{icon}}" alt="{{alt}}" class="button__icon" />
  {{else}}
    {{text}}
  {{/if}}
</button>`;

interface ButtonProps extends Props {
  type: string;
  className?: string;
  icon?: string;
  alt?: string;
  text?: string;
  events?: Record<string, (e: Event) => void>;
}

export class Button extends Block<ButtonProps> {
  constructor(props: ButtonProps) {
    super(props);
  }

  override render(): string {
    return template;
  }
}
