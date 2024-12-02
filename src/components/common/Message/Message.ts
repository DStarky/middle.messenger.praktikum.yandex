export const Message = `
<div class="message {{#if message.isOwn}}message--own{{/if}}">
  <div class="message__content">{{message.text}}</div>
  <div class="message__time">{{message.time}}</div>
</div>
`;
