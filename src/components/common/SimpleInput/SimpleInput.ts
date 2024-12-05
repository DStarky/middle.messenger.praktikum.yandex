import SearchIcon from '../../../assets/icons/search.svg';

export const SimpleInput = `
<div class="simple-input-container">
  <input 
    type="{{type}}" 
    id="{{id}}" 
    name="{{name}}" 
    class="simple-input {{className}}" 
    placeholder="{{placeholder}}" 
    value="{{value}}" 
  />
  {{#if search}}
      <img src="${SearchIcon}" alt="search" class="simple-input_icon" />
  {{/if}}
</div>`;
