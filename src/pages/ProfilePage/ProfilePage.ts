import { BasePage } from '../basePage';

const template = `
<main class="profile-page">
  <div class="profile-page__sidebar">
    {{> Sidebar compact=true}}
  </div>
  <section class="profile-content">
    <div class="profile-placeholder">
      Тут будет профиль
    </div>
  </section>
</main>
`;

export class ProfilePage extends BasePage {
  constructor() {
    super(template);
  }
}
