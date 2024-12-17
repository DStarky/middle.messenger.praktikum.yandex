import type { Props } from '../../../app/Block';
import Block from '../../../app/Block';
import { ROUTES } from '../../../app/routes';
import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';
import type { Chat } from '../../../types/Chat';

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
            oninput="{{events.searchInput}}"
          {{/if}}
        />
      </div>
      <ul class="sidebar__chat-list">
        {{#each chats}}
          <li class="chat-item {{#if isActive}}active{{/if}}" data-chat-id="{{id}}">
            <div class="chat-item-container">
              <div class="chat-item__avatar">
                <img src="{{avatar}}" alt="{{name}}" class="avatar-img" />
              </div>
              <div class="chat-item__content">
                <div class="chat-item__name">{{name}}</div>
                <div class="chat-item__last-message">
                  {{#if isOwn}}
                    <span class="chat-item__is-own">Вы: </span>
                  {{/if}}
                  {{lastMessage}}
                </div>
              </div>
              <div class="chat-item__meta">
                <div class="chat-item__time">{{time}}</div>
                {{#if unreadCount}}
                  <div class="chat-item__unread-count">{{unreadCount}}</div>
                {{/if}}
              </div>
            </div>
          </li>
        {{/each}}
      </ul>
    </aside>
  {{/if}}
`;

interface SidebarProps extends Props {
  compact: boolean;
  chats: Chat[];
  selectedChat: { id: string | null };
  searchValue?: string;
  className?: string;
  events?: Record<string, (e: Event) => void>;
}

export class Sidebar extends Block<SidebarProps> {
  constructor(props: SidebarProps) {
    const processedChats = props.chats.map(chat => ({
      ...chat,
      isActive: chat.id === props.selectedChat.id,
    }));

    super({
      ...props,
      chats: processedChats,
    });
  }

  override render(): string {
    return template;
  }
}
