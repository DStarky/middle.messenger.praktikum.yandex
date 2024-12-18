import type { Props } from '../../../app/Block';
import Block from '../../../app/Block';
import { ROUTES } from '../../../app/routes';
import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';
import type { Chat } from '../../../types/Chat';
import type { Events } from '../../../types/Events';

const template = `
  {{#if compact}}
    <aside class="sidebar sidebar_small {{className}}">
      <button 
        type="button" 
        class="button_round" 
        style="background-image: url('${ArrowLeftIcon}');" 
        aria-label="Open Chats"
        {{#if events.buttonClick}}
          onclick="{{events.buttonClick}}"
        {{/if}}
      ></button>
      <a href="${ROUTES.CHATS}" class="default-link">{{linkText}}</a>
    </aside>
  {{else}}
    <aside class="sidebar {{className}}">
      <div class="sidebar__profile-link">
        <a href="${ROUTES.PROFILE}" class="default-link sidebar-link">Профиль ></a>
      </div>
      <div class="sidebar__search">
        <input 
          type="text" 
          id="search" 
          name="search" 
          class="simple-input simple-input_placeholder-center" 
          placeholder="Поиск" 
          value="{{searchValue}}" 
          {{#if events.searchInput}}
            oninput="{{events.searchInput}}
          {{/if}}
        />
      </div>
      <ul class="sidebar__chat-list">
        {{{chatsHtml}}}
      </ul>
    </aside>
  {{/if}}
`;

interface SidebarEvents extends Events {
  buttonClick?: (e: Event) => void;
  searchInput?: (e: Event) => void;
}

interface SidebarProps extends Props {
  compact: boolean;
  chats: (Chat & { isActive?: boolean })[];
  selectedChat: { id: string | null };
  searchValue?: string;
  className?: string;
  events?: SidebarEvents;
}

export class Sidebar extends Block<SidebarProps> {
  constructor(props: SidebarProps) {
    const processedChats = props.chats.map(chat => ({
      ...chat,
      isActive: chat.id === props.selectedChat.id,
    }));

    const chatsHtml = processedChats
      .map(
        chat => `
      <li class="chat-item ${chat.isActive ? 'active' : ''}" data-chat-id="${chat.id}">
        <div class="chat-item-container">
          <div class="chat-item__avatar">
            <img src="${chat.avatar}" alt="${chat.name}" class="avatar-img" />
          </div>
          <div class="chat-item__content">
            <div class="chat-item__name">${chat.name}</div>
            <div class="chat-item__last-message">
              ${chat.isOwn ? '<span class="chat-item__is-own">Вы: </span>' : ''}
              ${chat.lastMessage}
            </div>
          </div>
          <div class="chat-item__meta">
            <div class="chat-item__time">${chat.time}</div>
            ${chat.unreadCount ? `<div class="chat-item__unread-count">${chat.unreadCount}</div>` : ''}
          </div>
        </div>
      </li>
    `,
      )
      .join('');

    super({
      ...props,
      chatsHtml,
    });
  }

  protected override render(): string {
    return template;
  }
}
