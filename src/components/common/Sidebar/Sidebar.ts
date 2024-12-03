import { ROUTES } from '../../../app/routes';

export const Sidebar = `
<aside class="sidebar">
  <!-- Profile link -->
  <div class="sidebar__profile-link">
    {{> Link href="${ROUTES.PROFILE}" text="Профиль >" className="sidebar-link"}}
  </div>
  <!-- Search input -->
  <div class="sidebar__search">
    {{> SimpleInput type="text" id="search" name="search" placeholder="Поиск" className="simple-input_placeholder-center" search=true}}
  </div>
  <!-- Chat list -->
  <ul class="sidebar__chat-list">
    {{#each chats}}
      <li class="chat-item" data-chat-id="{{id}}">
        {{> ChatItem chat=this}}
      </li>
    {{/each}}
  </ul>
</aside>
`;
