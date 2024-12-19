import type { Props } from '../../app/Block';
import Block from '../../app/Block';
import { Sidebar } from '../../components/common/Sidebar/Sidebar';
import { DEFAULT_CHATS } from '../../consts/data';
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

  private handleChangeAvatar(): void {
    console.log('Поменять аватар');
  }

  private toggleEditPersonalMode(): void {
    console.log('toggleEditPersonalMode called');
    this.setProps({
      isEditingPersonal: true,
      isEditingPassword: false,
    });
  }

  private toggleEditPasswordMode(): void {
    console.log('toggleEditPasswordMode called');
    this.setProps({
      isEditingPersonal: false,
      isEditingPassword: true,
    });
  }

  private resetToDefaultMode(): void {
    console.log('resetToDefaultMode called');
    this.setProps({
      isEditingPersonal: false,
      isEditingPassword: false,
    });
  }

  private handleLogout(): void {
    console.log('handleLogout called');
  }

  private handlePersonalDataChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    console.log(`Изменено поле ${input.name}: ${input.value}`);
  }

  private handlePasswordDataChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    console.log(`Изменено поле ${input.name}: ${input.value}`);
  }

  private handleSavePersonalData(): void {
    const form = document.getElementById('profile-data') as HTMLFormElement;
    const formData = new FormData(form);

    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    this.resetToDefaultMode();
  }
  private handleSavePasswordData(): void {
    const form = document.getElementById('password-data') as HTMLFormElement;
    const formData = new FormData(form);

    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    this.resetToDefaultMode();
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
