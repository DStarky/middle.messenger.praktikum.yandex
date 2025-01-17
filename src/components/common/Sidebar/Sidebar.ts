import type { Props } from '../../../app/Block';
import Block from '../../../app/Block';
import { ROUTES } from '../../../app/routes';
import store from '../../../app/Store';
import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';
import type { Chat } from '../../../types/Chat';
import type { Events } from '../../../types/Events';
import { Avatar } from '../Avatar/Avatar';
import { Button } from '../Button/Button';
import { ChatItem } from '../ChatItem/ChatItem';
import { Link } from '../Link/Link';
import { SearchInput } from '../SearchInput/SearchInput';

const sidebarCompactTemplate = `
  <aside class="sidebar sidebar_small {{className}}">
    {{{button}}}
    {{{link}}}
  </aside>
`;

const sidebarTemplate = `
  <aside class="sidebar {{className}}">
    <div class="sidebar__profile-link">
      {{{profileLink}}}
    </div>
    <div class="sidebar__search">
      {{{searchInput}}}
    </div>
    {{#if isLoading}}
      <div class="sidebar__loading">Загрузка чатов...</div>
    {{else if errorMessage}}
      <div class="sidebar__error">{{errorMessage}}</div>
    {{else}}
      <ul class="sidebar__chat-list" data-id="chatList">
        {{{chatList}}}
      </ul>
    {{/if}}
  </aside>
`;

interface SidebarEvents extends Events {
  buttonClick?: (e: Event) => void;
  searchInput?: (e: Event) => void;
}

interface SidebarProps extends Props {
  compact: boolean;
  chats: Chat[];
  selectedChat: { id: number | null };
  searchValue?: string;
  className?: string;
  isLoading?: boolean;
  errorMessage?: string | null;
  events?: SidebarEvents;
}

export class Sidebar extends Block<SidebarProps> {
  constructor(props: SidebarProps) {
    super({
      ...props,
      arrowIcon: ArrowLeftIcon,
      routes: ROUTES,
      searchInput: new SearchInput({
        type: 'text',
        id: 'search',
        name: 'search',
        placeholder: 'Поиск',
        value: props.searchValue || '',
        className: 'simple-input',
      }),
      profileLink: new Link({
        href: ROUTES.PROFILE,
        text: 'Профиль >',
        className: 'sidebar-link',
      }),
      button: new Button({
        type: 'button',
        className: 'button_round',
        icon: ArrowLeftIcon,
        alt: 'Open Chats',
      }),
      link: new Link({
        href: ROUTES.CHATS,
      }),
    });
  }

  protected init(): void {
    this.updateChatList();
  }

  public getChats(): Chat[] {
    return this.props.chats;
  }

  protected componentDidUpdate(
    oldProps: SidebarProps,
    newProps: SidebarProps,
  ): boolean {
    if (
      oldProps.selectedChat?.id !== newProps.selectedChat?.id ||
      oldProps.chats !== newProps.chats ||
      oldProps.isLoading !== newProps.isLoading ||
      oldProps.errorMessage !== newProps.errorMessage
    ) {
      this.updateChatList();
    }

    return true;
  }

  private updateChatList(): void {
    if (this.props.isLoading || this.props.errorMessage) {
      this.children.chatList = [];
      return;
    }

    const chatData = this.props.chats || [];
    const currentUserLogin = store.getState().user?.login;

    const chatItems = chatData.map(chat => {
      const isOwn = chat.last_message?.user?.login === currentUserLogin;
      return new ChatItem({
        ...chat,
        isOwn,
        className: chat.id === this.props.selectedChat.id ? 'active' : '',
        avatar: new Avatar({
          src: chat.avatar,
          alt: chat.title,
          className: 'avatar_size-medium',
        }),
      });
    });

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
