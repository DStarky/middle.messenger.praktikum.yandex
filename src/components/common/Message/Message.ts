export const Message = `
<div class="message {{#if message.isOwn}}message_own{{else}}message_other{{/if}}">
  <div class="message__content">{{message.text}}</div>
  <div class="message__time">{{message.time}}</div>
</div>
`;
