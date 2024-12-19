import type { Props } from '../../../app/Block';
import Block from '../../../app/Block';
import SearchIcon from '../../../assets/icons/search.svg';

const template = `
  <div class="simple-input-container">
    <input 
      type="{{type}}" 
      id="{{id}}" 
      name="{{name}}" 
      class="simple-input {{#if search}}simple-input_placeholder-center{{/if}}  {{className}}" 
      placeholder="{{placeholder}} " 
      value="{{value}}" 
    />
    {{#if search}}
      <img src="${SearchIcon}" alt="search" class="simple-input_icon" />
    {{/if}}
  </div>
`;

interface SimpleInputProps extends Props {
  type: string;
  id: string;
  name: string;
  placeholder: string;
  value?: string;
  className?: string;
  search?: boolean;
  events?: Record<string, (e: Event) => void>;
}

export class SimpleInput extends Block<SimpleInputProps> {
  constructor(props: SimpleInputProps) {
    super(props);
  }

  override render(): string {
    return template;
  }
}
