import { ROUTES } from '../../../app/routes';
import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';

export const Sidebar = `
<aside class="sidebar {{#if compact}}sidebar_small{{/if}}">
  {{#if compact}}
    <a href="${ROUTES.CHATS}" class="sidebar__center-button">
      {{> Button 
        type="button" 
        className="button_round" 
        icon="${ArrowLeftIcon}" 
        alt="Open Chats"
      }}
    </a>
  {{else}}
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
  {{/if}}
</aside>
`;
