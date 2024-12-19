import type { Props } from '../../../app/Block';
import Block from '../../../app/Block';

const template = `
    <input 
      type="{{type}}" 
      id="{{id}}" 
      name="{{name}}" 
      class="{{className}}" 
      placeholder="{{placeholder}} " 
      value="{{value}}" 
    />
`;

interface SimpleInputProps extends Props {
  type: string;
  id: string;
  name: string;
  placeholder: string;
  value?: string;
  className?: string;
  events?: Record<string, (e: Event) => void>;
}

export class SimpleInput extends Block<SimpleInputProps> {
  constructor(props: SimpleInputProps) {
    super(props);
  }

  public getValue(): string {
    return this.props.value as string;
  }

  override render(): string {
    return template;
  }
}
