import { ROUTES } from '../../app/routes';
import { BasePage } from '../basePage';

const template = `
  <main class="screen-center">
  <div class="error-page">
    <h1 class="error-page__title">500</h1>
    <p class="error-page__text">Мы уже фиксим</p>
    <div class="error-page__link">
      {{> Link href="${ROUTES.CHATS}" text="Назад к чатам"}}
    </div>
  </div>
  </main>
`;

export class Page500 extends BasePage {
  constructor() {
    super(template);
  }
}
