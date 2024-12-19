import type { Props } from '../../../app/Block';
import Block from '../../../app/Block';
import { ROUTES } from '../../../app/routes';
import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';
import type { Chat } from '../../../types/Chat';
import type { Events } from '../../../types/Events';
import { Avatar } from '../Avatar/Avatar';
import { ChatItem } from '../ChatItem/ChatItem';
import { SimpleInput } from '../SimpleInput/SimpleInput';

const sidebarCompactTemplate = `
  <aside class="sidebar sidebar_small {{className}}">
    <button 
      type="button" 
      class="button_round" 
      style="background-image: url('{{arrowIcon}}');" 
      aria-label="Open Chats"
      data-id="button"
    ></button>
    <a href="{{routes.CHATS}}" class="default-link">{{linkText}}</a>
  </aside>
`;

const sidebarTemplate = `
  <aside class="sidebar {{className}}">
    <div class="sidebar__profile-link">
      <a href="{{routes.PROFILE}}" class="default-link sidebar-link">Профиль ></a>
    </div>
    <div class="sidebar__search">
      {{{SimpleInput}}}
    </div>
    <ul class="sidebar__chat-list" data-id="chatList">
      {{{chatList}}}
    </ul>
  </aside>
`;

interface SidebarEvents extends Events {
  buttonClick?: (e: Event) => void;
  searchInput?: (e: Event) => void;
}

interface SidebarProps extends Props {
  compact: boolean;
  chats: Chat[];
  selectedChat: { id: string | null };
  searchValue?: string;
  className?: string;
  events?: SidebarEvents;
}

export class Sidebar extends Block<SidebarProps> {
  constructor(props: SidebarProps) {
    super({
      ...props,
      arrowIcon: ArrowLeftIcon,
      routes: ROUTES,
      SimpleInput: new SimpleInput({
        type: 'text',
        id: 'search',
        name: 'search',
        placeholder: 'Поиск',
        search: true,
      }),
    });
  }

  protected init(): void {
    this.updateChatList();
  }

  protected componentDidUpdate(
    oldProps: SidebarProps,
    newProps: SidebarProps,
  ): boolean {
    if (
      oldProps.selectedChat?.id !== newProps.selectedChat?.id ||
      oldProps.chats !== newProps.chats
    ) {
      this.updateChatList();
    }

    return true;
  }

  private updateChatList(): void {
    const chatData = (this.lists.chats as Chat[]) || [];
    const chatItems = chatData.map(
      chat =>
        new ChatItem({
          ...chat,
          className: chat.id === this.props.selectedChat?.id ? 'active' : '',
          avatar: new Avatar({ src: chat.avatar, alt: chat.name }),
        }),
    );

    this.children.chatList = chatItems;

    this.setProps({});
  }

  protected override render(): string {
    if (this.props.compact) {
      return sidebarCompactTemplate;
    }

    return sidebarTemplate;
  }
}
