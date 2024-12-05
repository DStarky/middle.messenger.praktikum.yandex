export const Button = `
<button 
  type="{{type}}" 
  class="button {{className}}">
  {{#if icon}}
    <img src="{{icon}}" alt="{{alt}}" class="button__icon" />
  {{else}}
    {{text}}
  {{/if}}
</button>`;
