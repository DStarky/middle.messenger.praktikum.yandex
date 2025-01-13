import type { Props } from '../../../app/Block';
import Block from '../../../app/Block';
import type { Events } from '../../../types/Events';

const template = `
  <div class="loader-container {{className}}">
    <div class="loader-spinner"></div>
  </div>
`;

interface LoaderProps extends Props {
  className?: string;
  events?: Events;
}

export class Loader extends Block<LoaderProps> {
  constructor(props: LoaderProps = {}) {
    super(props);
  }

  override render(): string {
    return template;
  }
}
