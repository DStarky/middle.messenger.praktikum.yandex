import { ProfileAPI } from '../../api/ProfileAPI';
import type { Props } from '../../app/Block';
import Block from '../../app/Block';
import { Sidebar } from '../../components/common/Sidebar/Sidebar';
import { DEFAULT_CHATS } from '../../consts/ChatsData';
import type { ProfileData, UpdateProfileData } from '../../types/Profile';
import { ActionsList } from './components/ActionsList/ActionsList';
import { PasswordDataEditable } from './components/PasswordDataEditable/PasswordDataEditable';
import { PersonalDataEditable } from './components/PersonalDataEditable/PersonalDataEditable';
import { ProfileAvatar } from './components/ProfileAvatar/ProfileAvatar';
import { ProfilePasswordData } from './components/ProfilePasswordData/ProfilePasswordData';
import { ProfilePersonalData } from './components/ProfilePersonalData/ProfilePersonalData';
import { ProfileSaveButton } from './components/ProfileSaveButton/ProfileSaveButton';

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

        <div class="profile-page__block">
          {{#if isEditingPersonal}}
            {{{personalDataEditable}}}
          {{else if isEditingPassword}}
            {{{passwordDataEditable}}}
          {{else}}
            {{{profilePersonalData}}}
          {{/if}}
        </div>

        <div id="profile-actions" class="profile-page__block">
          {{#if isEditingPersonal}}
            {{{savePersonalDataButton}}}
          {{else if isEditingPassword}}
            {{{savePasswordDataButton}}}
          {{else}}
            {{{actionsList}}}
          {{/if}}
        </div>
      </div>
    </section>
  </main>
`;

interface ProfilePageState {
  isEditingPersonal: boolean;
  isEditingPassword: boolean;
}

interface ProfilePageProps extends Props, Partial<ProfilePageState> {}

export class ProfilePage extends Block<ProfilePageProps> {
  constructor(props: ProfilePageProps = {}) {
    super({
      ...props,
      isEditingPersonal: false,
      isEditingPassword: false,
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
      personalDataEditable: new PersonalDataEditable({}),
      profilePersonalData: new ProfilePersonalData({}),
      passwordDataEditable: new PasswordDataEditable({}),
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

  protected override init(): void {
    super.init();
    this.fetchProfile();
  }

  private async fetchProfile(): Promise<void> {
    try {
      const profile = await ProfileAPI.fetchProfile();
      this.setProfileData(profile);
    } catch (error) {
      console.error('Ошибка при загрузке профиля:', error);
      // Можно добавить обработку ошибок в UI
    }
  }

  private setProfileData(profile: ProfileData): void {
    const profilePersonalData = this.children
      .profilePersonalData as ProfilePersonalData;

    const profilePersonalDataChildren = profilePersonalData.getChildren();

    profilePersonalDataChildren.email.setProps({
      value: profile.email,
    });
    profilePersonalDataChildren.login.setProps({
      value: profile.login,
    });
    profilePersonalDataChildren.firstName.setProps({
      value: profile.first_name,
    });
    profilePersonalDataChildren.secondName.setProps({
      value: profile.second_name,
    });
    profilePersonalDataChildren.displayName.setProps({
      value: profile.display_name,
    });
    profilePersonalDataChildren.phone.setProps({
      value: profile.phone,
    });

    const profileAvatar = this.children.profileAvatar as ProfileAvatar;
    profileAvatar.getChildren().avatar.setProps({
      src: profile.avatar,
    });
  }

  private async handleChangeAvatar(): Promise<void> {
    // Логика изменения аватара (например, открытие модального окна для загрузки)
    console.log('Тут будет логика изменения аватара');
  }

  private toggleEditPersonalMode(): void {
    this.setProps({
      isEditingPersonal: true,
      isEditingPassword: false,
    });
  }

  private toggleEditPasswordMode(): void {
    this.setProps({
      isEditingPersonal: false,
      isEditingPassword: true,
    });
  }

  private resetToDefaultMode(): void {
    console.log('Тут логика возвращения в дефолтный режим');
    this.setProps({
      isEditingPersonal: false,
      isEditingPassword: false,
    });
  }

  private handleLogout(): void {
    console.log('Тут будет логика выхода');
  }

  private async handleSavePersonalData(): Promise<void> {
    const personalDataEditable = this.children
      .personalDataEditable as PersonalDataEditable;
    const isValid = personalDataEditable.validateAllFields();

    if (!isValid) {
      return;
    }

    const form = document.getElementById('profile-data') as HTMLFormElement;
    const formData = new FormData(form);
    const updatedData: UpdateProfileData = {};

    formData.forEach((value, key) => {
      updatedData[key as keyof UpdateProfileData] = value.toString();
    });

    try {
      const updatedProfile = await ProfileAPI.updateProfile(updatedData);
      this.setProfileData(updatedProfile);
      this.resetToDefaultMode();
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      // Можно добавить отображение ошибки в UI
    }
  }
  private async handleSavePasswordData(): Promise<void> {
    const passwordDataEditable = this.children
      .passwordDataEditable as PasswordDataEditable;
    const isValid = passwordDataEditable.validateAllFields();

    if (!isValid) {
      return;
    }

    const form = document.getElementById('password-data') as HTMLFormElement;
    const formData = new FormData(form);
    const oldPassword = formData.get('oldPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
      alert('Новый пароль и подтверждение не совпадают.');
      return;
    }

    // Здесь можно добавить вызов API для обновления пароля
    // Например:
    // try {
    //   await ProfileAPI.updatePassword({ oldPassword, newPassword });
    //   alert('Пароль успешно обновлен.');
    //   this.resetToDefaultMode();
    // } catch (error) {
    //   console.error('Ошибка при обновлении пароля:', error);
    //   alert('Не удалось обновить пароль.');
    // }

    try {
      const updatedProfile = await ProfileAPI.updateProfile({
        oldPassword,
        password: newPassword,
      });
      // Предполагается, что `password` не отображается, но обновляем данные
      this.setProfileData(updatedProfile);
      alert('Пароль успешно обновлен.');
      this.resetToDefaultMode();
    } catch (error) {
      console.error('Ошибка при обновлении пароля:', error);
      alert('Не удалось обновить пароль.');
    }
  }

  protected componentDidUpdate(
    oldProps: ProfilePageProps,
    newProps: ProfilePageProps,
  ): boolean {
    if (
      oldProps.isEditingPersonal !== newProps.isEditingPersonal ||
      oldProps.isEditingPassword !== newProps.isEditingPassword
    ) {
      console.log(
        `State changed: isEditingPersonal from ${oldProps.isEditingPersonal} to ${newProps.isEditingPersonal}, isEditingPassword from ${oldProps.isEditingPassword} to ${newProps.isEditingPassword}`,
      );
      return true;
    }

    return false;
  }

  protected override render(): string {
    return template;
  }
}
