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
          {{> Avatar src='' alt='' class="avatar_size-large"}}
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

      <div class="profile-page__block">
        <div class="profile-page__item">
          {{> Link href="#" text="Изменить данные" className="profile-page__edit-link"}}
        </div>
        <div class="profile-page__item">
          {{> Link href="#" text="Изменить пароль" className="profile-page__edit-link"}}
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
  constructor() {
    super(template);
  }
}
