import { ROUTES } from '../../../app/routes';

export const Sidebar = `
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
`;
