import Handlebars from 'handlebars';

import { ROUTES } from '../../app/routes';
import { BasePage } from '../basePage';

const template = `
<main class="profile-page">
  <div class="profile-page__sidebar">
    {{> Sidebar compact=true}}
  </div>
  <section class="profile-page__content">
    <div class="profile-page__data">
      <div class="profile-page__block">
        <div class="profile-page__avatar">
          <div class="avatar-wrapper">
            {{> Avatar src='' alt='' class="avatar_size-large"}}
            <span class="avatar-text">Поменять аватар</span>
          </div>
        </div>
        <h4 class="profile-page__name">Иван</h4>
      </div>

      <div class="profile-page__block">
        <div class="profile-page__item">
          <p class="profile-page__left">Почта</p>
          <p class="profile-page__right">pochta@yandex.ru</p>
        </div>
        <div class="profile-page__item">
          <p class="profile-page__left">Логин</p>
          <p class="profile-page__right">ivanivanov</p>
        </div>
        <div class="profile-page__item">
          <p class="profile-page__left">Имя</p>
          <p class="profile-page__right">Иван</p>
        </div>
        <div class="profile-page__item">
          <p class="profile-page__left">Фамилия</p>
          <p class="profile-page__right">Иванов</p>
        </div>
        <div class="profile-page__item">
          <p class="profile-page__left">Имя в чате</p>
          <p class="profile-page__right">Иван</p>
        </div>
        <div class="profile-page__item">
          <p class="profile-page__left">Телефон</p>
          <p class="profile-page__right">+7 (909) 967 30 30</p>
        </div>
      </div>

      <div id="profile-actions" class="profile-page__block">
        <div class="profile-page__item">
          <p id="edit-data" class="profile-page__edit-link">Изменить данные</p>
        </div>
        <div class="profile-page__item">
          <p class="profile-page__edit-link">Изменить пароль</p>
        </div>
        <div class="profile-page__item">
          {{> Link href="${ROUTES.LOGIN}" text="Выйти" className="profile-page__logout-link"}}
        </div>
      </div>
  
    </div>
  </section>
</main>
`;

export class ProfilePage extends BasePage {
  private currentState: 'default' | 'editing' = 'default';

  constructor() {
    super(template);
    this.addEventListeners();
  }

  private addEventListeners(): void {
    document.addEventListener('click', event => {
      const editButton = (event.target as HTMLElement).closest('#edit-data');
      const saveButton = (event.target as HTMLElement).closest(
        '.profile-page__button button',
      );

      if (editButton) {
        this.toggleEditMode();
      } else if (saveButton) {
        this.toggleEditMode();
      }
    });
  }

  private toggleEditMode(): void {
    const actionsContainer = document.getElementById('profile-actions');

    if (actionsContainer) {
      if (this.currentState === 'default') {
        actionsContainer.innerHTML = this.renderSaveButton({});
        this.currentState = 'editing';
      } else {
        actionsContainer.innerHTML = this.renderActions({});
        this.currentState = 'default';
      }
    }
  }

  private renderSaveButton(context: Record<string, unknown>): string {
    return Handlebars.compile(`
          <div class="profile-page__button">
            {{> Button type="submit" className="w-full" text="Сохранить"}}
          </div>
        `)(context);
  }

  private renderActions(context: Record<string, unknown>): string {
    return Handlebars.compile(`
          <div class="profile-page__item">
            <p id="edit-data" class="profile-page__edit-link">Изменить данные</p>
          </div>
          <div class="profile-page__item">
            <p class="profile-page__edit-link">Изменить пароль</p>
          </div>
          <div class="profile-page__item">
            {{> Link href="${ROUTES.LOGIN}" text="Выйти" className="profile-page__logout-link"}}
          </div>
        `)(context);
  }

  render(context: Record<string, unknown> = {}): string {
    return super.render(context);
  }
}
