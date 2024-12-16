import { Block } from '../../../app/Block';

const ButtonTemplate = `
  <button 
    type="{{type}}" 
    class="button {{className}}">
    {{#if icon}}
      <img src="{{icon}}" alt="{{alt}}" class="button__icon" />
    {{else}}
      {{text}}
    {{/if}}
  </button>
`;

type ButtonProps = {
  type: string;
  className?: string;
  icon?: string;
  alt?: string;
  text?: string;
  events?: Record<string, (e: Event) => void>;
};

export class Button extends Block {
  constructor(props: ButtonProps) {
    super('button', props);
  }

  override render(): DocumentFragment {
    return this.compile(ButtonTemplate, this.props);
  }
}
