import { Block } from '../../../app/Block';

export const template = `
<div class="floating-input-container">
  <input 
    type="{{type}}" 
    id="{{id}}" 
    name="{{name}}" 
    class="floating-input {{className}}" 
    placeholder=" " 
    value="{{value}}" 
  />
  <label for="{{id}}" class="floating-label">{{label}}</label>
</div>`;

type FloatingLabelInputProps = {
  type: string;
  id: string;
  name: string;
  label: string;
  className?: string;
  value?: string;
  events?: Record<string, (e: Event) => void>;
};

export class FloatingLabelInput extends Block {
  constructor(props: FloatingLabelInputProps) {
    super('div', props);
  }

  override render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
