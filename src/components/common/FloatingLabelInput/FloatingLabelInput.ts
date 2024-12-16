import type { Props } from '../../../app/Block';
import Block from '../../../app/Block';

const template = `
  <div class="floating-input-container {{className}}">
    <input 
      type="{{type}}" 
      id="{{id}}" 
      name="{{name}}" 
      class="floating-input" 
      placeholder=" " 
      value="{{value}}" 
      {{#if events}} 
        {{events}} 
      {{/if}} 
    />
    <label for="{{id}}" class="floating-label">{{label}}</label>
  </div>
`;

interface FloatingLabelInputProps extends Props {
  type: string;
  id: string;
  name: string;
  label: string;
  className?: string;
  value?: string;
  events?: Record<string, (e: Event) => void>;
}

export class FloatingLabelInput extends Block<FloatingLabelInputProps> {
  constructor(props: FloatingLabelInputProps) {
    super(props);
  }

  override render(): string {
    return template;
  }
}
