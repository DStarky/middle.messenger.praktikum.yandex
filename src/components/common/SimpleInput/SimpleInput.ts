import type { Props } from '../../../app/Block';
import Block from '../../../app/Block';
import type { Events } from '../../../types/Events';

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
  events?: Events;
}

export class SimpleInput extends Block<SimpleInputProps> {
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
    this.setProps({ value: target.value });
  }

  public getValue(): string {
    return this.props.value as string;
  }

  public setValue(value: string): void {
    this.props.value = value;
  }

  protected override componentDidUpdate(
    oldProps: SimpleInputProps,
    newProps: SimpleInputProps,
  ): boolean {
    if (oldProps.value !== newProps.value) {
      const input = this.getContent()?.querySelector(
        'input',
      ) as HTMLInputElement;
      if (input) {
        input.value = newProps.value as string;
      }

      return false;
    }

    return true;
  }

  override render(): string {
    return template;
  }
}
