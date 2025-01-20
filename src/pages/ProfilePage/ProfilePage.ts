import type { Props } from '../../app/Block';
import Block from '../../app/Block';
import { Sidebar } from '../../components/common/Sidebar/Sidebar';
import type { ProfileData, UpdateProfileData } from '../../types/Profile';
import { ActionsList } from './components/ActionsList/ActionsList';
import { PasswordDataEditable } from './components/PasswordDataEditable/PasswordDataEditable';
import { PersonalDataEditable } from './components/PersonalDataEditable/PersonalDataEditable';
import { ProfileAvatar } from './components/ProfileAvatar/ProfileAvatar';
import { ProfilePasswordData } from './components/ProfilePasswordData/ProfilePasswordData';
import { ProfilePersonalData } from './components/ProfilePersonalData/ProfilePersonalData';
import { ProfileSaveButton } from './components/ProfileSaveButton/ProfileSaveButton';
import { connect } from '../../app/HOC';
import type { Indexed } from '../../app/Store';
import store from '../../app/Store';
import AuthController from '../../controllers/AuthController';
import ProfileController from '../../controllers/ProfileController';
import { RESOURCE_URL } from '../../consts/URLs';

const template = `
  <main class="profile-page">
    <div class="profile-page__sidebar">
      {{{sidebar}}}
    </div>
    <section class="profile-page__content">
      <div class="profile-page__data">
        <div class="profile-page__block">
          {{{profileAvatar}}}
          <h4 class="profile-page__name">{{displayName}}</h4>
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

interface ProfilePageProps extends Props, Partial<ProfilePageState> {
  displayName?: string;
  error?: string | null;
}

class _ProfilePage extends Block<ProfilePageProps> {
  constructor(props: ProfilePageProps = {}) {
    super({
      ...props,
      isEditingPersonal: false,
      isEditingPassword: false,
      sidebar: new Sidebar({
        compact: true,
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

  private fetchProfile(): void {
    ProfileController.fetchProfile(
      // onLoading
      (loading: boolean) => this.setProps({ isLoading: loading }),
      // onError
      (error: string | null) => {
        this.setProps({ error });
        if (error) {
          console.error('Ошибка при загрузке профиля:', error);
        }
      },
      // onSuccess
      (profile: ProfileData) => {
        this.setProfileData(profile);
      },
    );
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
      src: profile.avatar
        ? `${RESOURCE_URL}${profile.avatar}`
        : '/defaultSrc.png',
    });

    const personalDataEditable = this.children
      .personalDataEditable as PersonalDataEditable;

    personalDataEditable.setProps({
      initialData: {
        email: profile.email,
        login: profile.login,
        first_name: profile.first_name,
        second_name: profile.second_name,
        display_name: profile.display_name,
        phone: profile.phone,
      },
    });

    this.setProps({
      displayName:
        profile.display_name || `${profile.first_name} ${profile.second_name}`,
    });
  }

  private async handleChangeAvatar(): Promise<void> {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = () => {
      if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];

        ProfileController.updateAvatar(
          file,
          (loading: boolean) => this.setProps({ isLoading: loading }),
          (error: string | null) => {
            this.setProps({ error });
            if (error) {
              console.error('Ошибка при обновлении аватара:', error);
            }
          },
          (updatedProfile: ProfileData) => {
            this.setProfileData(updatedProfile);
          },
        );
      }
    };

    fileInput.click();
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
    console.log('Тут логика возвращения в дефолтный режим');
    this.setProps({
      isEditingPersonal: false,
      isEditingPassword: false,
    });
  }

  private async handleLogout(): Promise<void> {
    try {
      await AuthController.logout();
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      store.set('error', 'Не удалось выйти из системы');
    }
  }

  private handleSavePersonalData(): void {
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

    ProfileController.updateProfile(
      updatedData,
      (loading: boolean) => this.setProps({ isLoading: loading }),
      (error: string | null) => {
        this.setProps({ error });
      },
      (updatedProfile: ProfileData) => {
        this.setProfileData(updatedProfile);
        this.resetToDefaultMode();
      },
    );
  }

  private handleSavePasswordData(): void {
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

    ProfileController.updatePassword(
      { oldPassword, newPassword },
      (loading: boolean) => this.setProps({ isLoading: loading }),
      (error: string | null) => {
        if (error) {
          this.setProps({ error });
          alert('Не удалось обновить пароль.');
        }
      },
      () => {
        alert('Пароль успешно обновлен.');
        this.resetToDefaultMode();
      },
    );
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

function mapStateToProps(state: Indexed) {
  return {
    error: state.error,
  };
}

export const ProfilePage = connect(mapStateToProps)(_ProfilePage);
