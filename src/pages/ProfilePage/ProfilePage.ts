import type { Props } from '../../app/Block';
import Block from '../../app/Block';
import { Sidebar } from '../../components/common/Sidebar/Sidebar';
import { DEFAULT_CHATS } from '../../consts/data';
import { ActionsList } from './components/ActionsList/ActionsList';
import { PasswordDataEditable } from './components/PasswordDataEditable/PasswordDataEditable';
import { PersonalDataEditable } from './components/PersonalDataEditable/PersonalDataEditable';
import { ProfileAvatar } from './components/ProfileAvatar/ProfileAvatar';
import { ProfileEditableField } from './components/ProfileEditableField/ProfileEditableField';
import { ProfilePasswordData } from './components/ProfilePasswordData/ProfilePasswordData';
import { ProfilePersonalData } from './components/ProfilePersonalData/ProfilePersonalData';
import { ProfileSaveButton } from './components/ProfileSaveButton/ProfileSaveButton';
import { ProfileStaticField } from './components/ProfileStaticField/ProfileStaticField';

const template = `
  <main class="profile-page">
    <div class="profile-page__sidebar">
      {{{sidebar}}}
    </div>
    <section class="profile-page__content">
      <div class="profile-page__data">
        <div class="profile-page__block">
          {{{profileAvatar}}}
          <h4 class="profile-page__name">Иван</h4>
        </div>

        <div class="profile-page__block" id="profile-data">
          {{#if isEditingPersonal}}
            {{{personalDataEditable}}}
          {{else}}
            {{{profilePersonalData}}}
          {{/if}}
          
          {{#if isEditingPassword}}
            {{{passwordDataEditable}}}
          {{else}}
            {{{profilePasswordData}}}
          {{/if}}
        </div>

        <div id="profile-actions" class="profile-page__block">
          {{#if isEditingPersonal}}
            {{{savePersonalDataButton}}}
          {{/if}}
          {{#if isEditingPassword}}
            {{{savePasswordDataButton}}}
          {{/if}}
          {{#unless isEditingPersonal}}
            {{{actionsList}}}
          {{/unless}}
        </div>
      </div>
    </section>
  </main>
`;

interface ProfilePageState {
  currentState: 'default' | 'editing-personal' | 'editing-password';
}

interface ProfilePageProps extends Props, Partial<ProfilePageState> {}

export class ProfilePage extends Block<ProfilePageProps> {
  constructor(props: ProfilePageProps = {}) {
    super({
      ...props,
      currentState: 'default',
      sidebar: new Sidebar({
        compact: true,
        chats: DEFAULT_CHATS,
        selectedChat: { id: null },
      }),
      profileAvatar: new ProfileAvatar({
        src: '',
        alt: 'User Avatar',
        onClick: () => this.handleChangeAvatar(),
      }),
      personalDataEditable: new PersonalDataEditable({
        email: new ProfileEditableField({
          label: 'Почта',
          name: 'email',
          value: 'pochta@yandex.ru',
          id: 'email-input',
          placeholder: 'Введите почту',
          type: 'email',
          events: {
            change: (e: Event) => this.handlePersonalDataChange(e),
          },
        }),
        login: new ProfileEditableField({
          label: 'Логин',
          name: 'login',
          value: 'ivanivanov',
          id: 'login-input',
          placeholder: 'Введите логин',
          type: 'text',
          events: {
            change: (e: Event) => this.handlePersonalDataChange(e),
          },
        }),
        firstName: new ProfileEditableField({
          label: 'Имя',
          name: 'first_name',
          value: 'Иван',
          id: 'first-name-input',
          placeholder: 'Введите имя',
          type: 'text',
          events: {
            change: (e: Event) => this.handlePersonalDataChange(e),
          },
        }),
        secondName: new ProfileEditableField({
          label: 'Фамилия',
          name: 'second_name',
          value: 'Иванов',
          id: 'second-name-input',
          placeholder: 'Введите фамилию',
          type: 'text',
          events: {
            change: (e: Event) => this.handlePersonalDataChange(e),
          },
        }),
        displayName: new ProfileEditableField({
          label: 'Имя в чате',
          name: 'display_name',
          value: 'Иван',
          id: 'display-name-input',
          placeholder: 'Введите имя в чате',
          type: 'text',
          events: {
            change: (e: Event) => this.handlePersonalDataChange(e),
          },
        }),
        phone: new ProfileEditableField({
          label: 'Телефон',
          name: 'phone',
          value: '+7 (909) 967 30 30',
          id: 'phone-input',
          placeholder: 'Введите телефон',
          type: 'tel',
          events: {
            change: (e: Event) => this.handlePersonalDataChange(e),
          },
        }),
      }),
      profilePersonalData: new ProfilePersonalData({
        email: new ProfileStaticField({
          label: 'Почта',
          value: 'pochta@yandex.ru',
        }),
        login: new ProfileStaticField({
          label: 'Логин',
          value: 'ivanivanov',
        }),
        firstName: new ProfileStaticField({
          label: 'Имя',
          value: 'Иван',
        }),
        secondName: new ProfileStaticField({
          label: 'Фамилия',
          value: 'Иванов',
        }),
        displayName: new ProfileStaticField({
          label: 'Имя в чате',
          value: 'Иван',
        }),
        phone: new ProfileStaticField({
          label: 'Телефон',
          value: '+7 (909) 967 30 30',
        }),
      }),
      passwordDataEditable: new PasswordDataEditable({
        oldPassword: new ProfileEditableField({
          label: 'Старый пароль',
          name: 'oldPassword',
          value: '',
          id: 'old-password-input',
          placeholder: 'Введите старый пароль',
          type: 'password',
          events: {
            change: (e: Event) => this.handlePasswordDataChange(e),
          },
        }),
        newPassword: new ProfileEditableField({
          label: 'Новый пароль',
          name: 'newPassword',
          value: '',
          id: 'new-password-input',
          placeholder: 'Введите новый пароль',
          type: 'password',
          events: {
            change: (e: Event) => this.handlePasswordDataChange(e),
          },
        }),
        confirmPassword: new ProfileEditableField({
          label: 'Повторите новый пароль',
          name: 'confirmPassword',
          value: '',
          id: 'confirm-password-input',
          placeholder: 'Повторите новый пароль',
          type: 'password',
          events: {
            change: (e: Event) => this.handlePasswordDataChange(e),
          },
        }),
      }),
      profilePasswordData: new ProfilePasswordData({}),
      savePersonalDataButton: new ProfileSaveButton({
        onClick: () => this.handleSavePersonalData(),
      }),
      savePasswordDataButton: new ProfileSaveButton({
        onClick: () => this.handleSavePasswordData(),
      }),
      actionsList: new ActionsList({
        events: {
          onEditPersonalDataClick: () => this.toggleEditPersonalMode(),
          onEditPasswordDataClick: () => this.toggleEditPasswordMode(),
          onLogoutClick: () => this.handleLogout(),
        },
      }),
    });
  }

  private handleChangeAvatar(): void {
    // Логика смены аватара (например, открыть модальное окно для загрузки нового аватара)
    console.log('Поменять аватар');
  }

  // Обработчики переключения режимов редактирования
  private toggleEditPersonalMode(): void {
    this.setProps({ currentState: 'editing-personal' });
  }

  private toggleEditPasswordMode(): void {
    this.setProps({ currentState: 'editing-password' });
  }

  private resetToDefaultMode(): void {
    this.setProps({ currentState: 'default' });
  }

  // Обработчик выхода из профиля
  private handleLogout(): void {
    // Логика выхода из профиля (например, очистить сессию и перенаправить на страницу входа)
    console.log('Выйти из профиля');
  }

  // Обработчики изменений личных данных
  private handlePersonalDataChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    console.log(`Изменено поле ${input.name}: ${input.value}`);
    // Логика обработки изменений (например, обновление локального состояния или валидация)
  }

  // Обработчики изменений пароля
  private handlePasswordDataChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    console.log(`Изменено поле ${input.name}: ${input.value}`);
    // Логика обработки изменений (например, обновление локального состояния или валидация)
  }

  // Обработчики сохранения данных
  private handleSavePersonalData(): void {
    // Логика сохранения личных данных (например, отправка на сервер)
    console.log('Сохранение личных данных');
    // После сохранения сбрасываем режим редактирования
    this.resetToDefaultMode();
  }

  private handleSavePasswordData(): void {
    // Логика сохранения пароля (например, отправка на сервер)
    console.log('Сохранение пароля');
    // После сохранения сбрасываем режим редактирования
    this.resetToDefaultMode();
  }

  // Обновление дочерних компонентов при изменении состояния
  protected componentDidUpdate(
    oldProps: ProfilePageProps,
    newProps: ProfilePageProps,
  ): boolean {
    // Если состояние изменилось, обновляем компоненты
    if (oldProps.currentState !== newProps.currentState) {
      this.updateChildComponents();
      return true;
    }

    return false;
  }

  private updateChildComponents(): void {
    this.setProps({});
  }

  protected override render(): string {
    return template;
  }
}
