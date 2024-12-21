import type { Props } from '../../../app/Block';
import Block from '../../../app/Block';
import { SimpleInput } from '../../../components/common/SimpleInput/SimpleInput';
import type { ValidationRule } from '../../../helpers/validationRules';
import type { Events } from '../../../types/Events';

const template = `
  <div>
    <div class="floating-input__container {{className}} {{#if error}}floating-input__container-error{{/if}}">
      {{{input}}}
      <label for="{{id}}" class="floating-label">{{label}}</label>
    </div>
    {{#if error}}
      <p class="floating-input__error">{{error}}</p>
    {{/if}}
  </div>
`;

interface FloatingLabelInputProps extends Props {
  type: string;
  id: string;
  name: string;
  label: string;
  className?: string;
  value?: string;
  events?: Events;
  validationRules?: ValidationRule[];
  error?: string;
}

export class FloatingLabelInput extends Block<FloatingLabelInputProps> {
  constructor(props: FloatingLabelInputProps) {
    const input = new SimpleInput({
      type: props.type,
      id: props.id,
      name: props.name,
      value: props.value || '',
      className: 'floating-input',
      events: {
        ...props.events,
        blur: (e: Event) => {
          this.validate();
          if (props.events?.blur) {
            props.events.blur(e);
          }
        },
        input: (e: Event) => {
          if (props.events?.input) {
            props.events.input(e);
          }
        },
      },
      placeholder: ' ',
    });

    super({
      ...props,
      input,
      error: props.error || '',
    });
  }

  validate(): boolean {
    const inputComponent = this.children.input as SimpleInput;
    const value = inputComponent.getValue();

    const validationRules =
      (this.lists.validationRules as ValidationRule[]) || [];
    let errorMessage = '';

    for (const rule of validationRules) {
      if (!rule.validator(value)) {
        errorMessage = rule.message;
        break;
      }
    }

    if (errorMessage) {
      this.setProps({ error: errorMessage });
      return false;
    } else {
      this.setProps({ error: '' });
      return true;
    }
  }

  getValue(): string {
    const inputComponent = this.children.input as SimpleInput;
    return inputComponent.getValue();
  }

  override render(): string {
    return template;
  }
}
