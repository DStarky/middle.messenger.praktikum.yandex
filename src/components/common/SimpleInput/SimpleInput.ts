import { Block } from '../../../app/Block';
import SearchIcon from '../../../assets/icons/search.svg';

export const template = `
<div class="simple-input-container">
  <input 
    type="{{type}}" 
    id="{{id}}" 
    name="{{name}}" 
    class="simple-input {{className}}" 
    placeholder="{{placeholder}}" 
    value="{{value}}" 
  />
  {{#if search}}
      <img src="${SearchIcon}" alt="search" class="simple-input_icon" />
  {{/if}}
</div>`;

type SimpleInputProps = {
  type: string;
  id: string;
  name: string;
  placeholder: string;
  value?: string;
  className?: string;
  search?: boolean;
  events?: Record<string, (e: Event) => void>;
};

export class SimpleInput extends Block {
  constructor(props: SimpleInputProps) {
    super('div', props);
  }

  override render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
