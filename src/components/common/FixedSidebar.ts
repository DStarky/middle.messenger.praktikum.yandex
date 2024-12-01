export const FixedSidebar = `
<div class="sidebar">
  <ul class="chat-list">
    {{#each chats}}
      <li class="chat-item">
        <div class="chat-avatar">
          <img src="{{this.avatar}}" alt="{{this.name}}" />
        </div>
        <div class="chat-details">
          <p class="chat-name">{{this.name}}</p>
          <p class="chat-message">{{this.lastMessage}}</p>
        </div>
      </li>
    {{/each}}
  </ul>
</div>`;
