import type { Props } from '../../../app/Block';
import Block from '../../../app/Block';
import SearchIcon from '../../../assets/icons/search.svg';
import type { Events } from '../../../types/Events';
import { SimpleInput } from '../SimpleInput/SimpleInput';

const template = `
  <div class="simple-input-container">
    {{{Input}}}
    <img src="${SearchIcon}" alt="search" class="simple-input_icon" />
  </div>
  `;

interface SearchInputProps extends Props {
  type: string;
  id: string;
  name: string;
  placeholder: string;
  value: string;
  className?: string;
  events?: Events;
}

export class SearchInput extends Block<SearchInputProps> {
  constructor(props: SearchInputProps) {
    const input = new SimpleInput({
      type: props.type,
      id: props.id,
      name: props.name,
      placeholder: props.placeholder,
      value: props.value,
      className: `${props.className} simple-input_placeholder-center`,
    });
    super({ ...props, Input: input });
  }

  protected override render(): string {
    return template;
  }
}
