import type { Props } from '../../../app/Block';
import Block from '../../../app/Block';

const template = `
  <button 
    type="{{type}}" 
    class="button {{className}}" 
    {{#if icon}} 
      style="background-image: url('{{icon}}');" 
      aria-label="{{alt}}"
    {{/if}}>
    {{#unless icon}}
      {{text}}
    {{/unless}}
  </button>
`;

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
