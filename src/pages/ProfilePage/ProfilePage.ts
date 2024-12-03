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
    this.renderPage();
  }

  private renderPage(): void {
    const context = {
      compact: true,
    };

    document.body.innerHTML = this.render(context);
  }

  render(context: Record<string, unknown> = {}): string {
    return super.render(context);
  }
}
