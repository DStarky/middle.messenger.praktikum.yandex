import { Block } from '../../../app/Block';
import { ROUTES } from '../../../app/routes';
import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';

export const template = `
{{#if compact}}
  <aside class="sidebar sidebar_small">
    {{> Button 
      type="button" 
      className="button_round" 
      icon="${ArrowLeftIcon}" 
      alt="Open Chats"
    }}
    {{> Link href="${ROUTES.CHATS}"}}
  </aside>
  {{else}}
  <aside class="sidebar">
    <div class="sidebar__profile-link">
      {{> Link href="${ROUTES.PROFILE}" text="Профиль >" className="sidebar-link"}}
    </div>
    <div class="sidebar__search">
      {{> SimpleInput type="text" id="search" name="search" placeholder="Поиск" className="simple-input_placeholder-center" search=true}}
    </div>
    <ul class="sidebar__chat-list">
      {{#each chats}}
        <li class="chat-item {{#if (eq ../selectedChat.id id)}}active{{/if}}" data-chat-id="{{id}}">
          {{> ChatItem chat=this}}
        </li>
      {{/each}}
    </ul>
  </aside>
{{/if}}
`;

type Chat = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isOwn?: boolean;
};

type SidebarProps = {
  compact: boolean;
  chats: Chat[];
  selectedChat: { id: string };
  className?: string;
  events?: Record<string, (e: Event) => void>;
};

export class Sidebar extends Block {
  constructor(props: SidebarProps) {
    super('div', props);
  }

  override render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
