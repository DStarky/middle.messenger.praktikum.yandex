import type { Props } from '../../../../app/Block';
import Block from '../../../../app/Block';
import { SimpleInput } from '../../../../components/common/SimpleInput/SimpleInput';
import type { ValidationRule } from '../../../../helpers/validationRules';
import type { Events } from '../../../../types/Events';

const template = `
  <div class="profile-page__border-bottom {{#if error}}profile-page__border-bottom-error{{/if}}">
    {{#if error}}
      <p class="profile-page__error-message">{{error}}</p>
    {{/if}}
    <div class="profile-page__item">
      <p class="profile-page__left {{#if error}}profile-page__error{{/if}}">{{label}}</p>
      {{{input}}}
    </div>
  </div>
`;

interface ProfileEditableFieldProps extends Props {
  label: string;
  name: string;
  value: string;
  id: string;
  placeholder: string;
  type?: string;
  className?: string;
  events?: Events;
  validationRules?: ValidationRule[];
  error?: string;
}

export class ProfileEditableField extends Block<ProfileEditableFieldProps> {
  constructor(props: ProfileEditableFieldProps) {
    const input = new SimpleInput({
      type: props.type || 'text',
      name: props.name,
      value: props.value,
      className: 'profile-page__right',
      events: {
        ...props.events,
        blur: (e: Event) => {
          this.validate();
          if (props.events?.blur) {
            props.events.blur(e);
          }
        },
      },
      id: props.id,
      placeholder: props.placeholder,
    });

    super({
      ...props,
      input,
      error: '',
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

  protected componentDidUpdate(
    oldProps: ProfileEditableFieldProps,
    newProps: ProfileEditableFieldProps,
  ): boolean {
    if (oldProps.value !== newProps.value) {
      const inputComponent = this.children.input as SimpleInput;
      inputComponent.setProps({ value: newProps.value });
    }

    return true;
  }

  getValue(): string {
    const inputComponent = this.children.input as SimpleInput;
    return inputComponent.getValue();
  }

  override render(): string {
    return template;
  }
}
