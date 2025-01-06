import type { Props } from '../../../app/Block';
import Block from '../../../app/Block';
import type { Events } from '../../../types/Events';

const template = `
    <input 
      type="{{type}}" 
      id="{{id}}" 
      name="{{name}}" 
      class="{{className}}" 
      placeholder="{{placeholder}}" 
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
  events?: Events;
}

export class SimpleInput extends Block<SimpleInputProps> {
  private isInternalChange: boolean = false;

  constructor(props: SimpleInputProps) {
    super({
      ...props,
      events: {
        ...props.events,
        input: (e: Event) => this.handleInput(e),
      },
    });
  }

  private handleInput(e: Event): void {
    const target = e.target as HTMLInputElement;
    this.isInternalChange = true;
    this.setProps({ value: target.value });
    this.isInternalChange = false;
  }

  public getValue(): string {
    return this.props.value ?? '';
  }

  public setValue(value: string): void {
    this.setProps({ value });
  }

  public focus(): void {
    const input = this.getContent()?.querySelector('input') as HTMLInputElement;
    if (input) {
      input.focus();
    }
  }

  protected override componentDidUpdate(
    oldProps: SimpleInputProps,
    newProps: SimpleInputProps,
  ): boolean {
    if (oldProps.value !== newProps.value) {
      if (this.isInternalChange) {
        return false;
      }

      return true;
    }

    return false;
  }

  override render(): string {
    return template;
  }
}
