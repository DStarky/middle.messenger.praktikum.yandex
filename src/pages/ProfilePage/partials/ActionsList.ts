import { ROUTES } from '../../../app/routes';

export const ActionsList = `
          <div class="profile-page__item">
            <p id="edit-data" class="profile-page__edit-link">Изменить данные</p>
          </div>
          <div class="profile-page__item">
            <p class="profile-page__edit-link">Изменить пароль</p>
          </div>
          <div class="profile-page__item">
            {{> Link href="${ROUTES.LOGIN}" text="Выйти" className="profile-page__logout-link"}}
          </div>
        `;
