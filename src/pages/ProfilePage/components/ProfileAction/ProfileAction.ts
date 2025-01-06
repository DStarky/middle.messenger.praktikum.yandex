import type { Props } from '../../../../app/Block';
import Block from '../../../../app/Block';

const template = `
  <p id="{{id}}" class="{{className}}">{{text}}</p>
`;

interface ProfileActionProps extends Props {
  id: string;
  className?: string;
  text: string;
  events?: Record<string, (e: Event) => void>;
}

export class ProfileAction extends Block<ProfileActionProps> {
  constructor(props: ProfileActionProps) {
    super(props);
  }

  override render(): string {
    return template;
  }
}
