import Handlebars from 'handlebars';

import { BasePage } from '../basePage';
import { ActionsList } from './partials/ActionsList';
import { ProfileSaveButton } from './partials/ProfileSaveButton';
import { ProfilePersonalData } from './partials/ProfilePersonalData';
import { ProfileAvatar } from './partials/ProfileAvatar';
import { ProfilePasswordData } from './partials/ProfilePasswordData';
import { PersonalDataEditable } from './partials/PersonalDataEditable';
import { PasswordDataEditable } from './partials/PasswordDataEditable';

Handlebars.registerPartial('ActionsList', ActionsList);
Handlebars.registerPartial('ProfileSaveButton', ProfileSaveButton);
Handlebars.registerPartial('ProfilePersonalData', ProfilePersonalData);
Handlebars.registerPartial('PersonalDataEditable', PersonalDataEditable);
Handlebars.registerPartial('ProfileAvatar', ProfileAvatar);
Handlebars.registerPartial('ProfilePasswordData', ProfilePasswordData);
Handlebars.registerPartial('PasswordDataEditable', PasswordDataEditable);

const template = `
<main class="profile-page">
  <div class="profile-page__sidebar">
    {{> Sidebar compact=true}}
  </div>
  <section class="profile-page__content">
    <div class="profile-page__data">
      <div class="profile-page__block">
        {{> ProfileAvatar}}
        <h4 class="profile-page__name">Иван</h4>
      </div>

      <div class="profile-page__block" id="profile-data">
        {{> ProfilePersonalData}}
      </div>

      <div id="profile-actions" class="profile-page__block">
        {{> ActionsList}}
      </div>
  
    </div>
  </section>
</main>
`;

export class ProfilePage extends BasePage {
  private currentState: 'default' | 'editing-personal' | 'editing-password' =
    'default';

  constructor() {
    super(template);
    this.addEventListeners();
  }

  private addEventListeners(): void {
    document.addEventListener('click', event => {
      const editPersonalButton = (event.target as HTMLElement).closest(
        '#edit-personal-data',
      );
      const editPasswordButton = (event.target as HTMLElement).closest(
        '#edit-password-data',
      );
      const saveButton = (event.target as HTMLElement).closest(
        '.profile-page__button button',
      );

      if (editPersonalButton) {
        this.toggleEditPersonalMode();
      } else if (editPasswordButton) {
        this.toggleEditPasswordMode();
      } else if (saveButton) {
        this.handleSave();
      }
    });
  }

  private toggleEditPersonalMode(): void {
    const actionsContainer = document.getElementById('profile-actions');
    const personalDataContainer = document.getElementById('profile-data');

    if (actionsContainer && personalDataContainer) {
      if (this.currentState === 'default') {
        actionsContainer.innerHTML = this.renderSaveButton({});
        personalDataContainer.innerHTML = this.renderPersonalDataEditable({});
        this.currentState = 'editing-personal';
      } else {
        this.resetToDefaultMode();
      }
    }
  }

  private toggleEditPasswordMode(): void {
    const actionsContainer = document.getElementById('profile-actions');
    const personalDataContainer = document.getElementById('profile-data');

    if (actionsContainer && personalDataContainer) {
      if (this.currentState === 'default') {
        actionsContainer.innerHTML = this.renderSaveButton({});
        personalDataContainer.innerHTML = this.renderPasswordDataEditable({});
        this.currentState = 'editing-password';
      } else {
        this.resetToDefaultMode();
      }
    }
  }

  private resetToDefaultMode(): void {
    const actionsContainer = document.getElementById('profile-actions');
    const personalDataContainer = document.getElementById('profile-data');

    if (actionsContainer && personalDataContainer) {
      actionsContainer.innerHTML = this.renderActions({});
      personalDataContainer.innerHTML = this.renderPersonalData({});
      this.currentState = 'default';
    }
  }

  private handleSave(): void {
    const personalDataContainer = document.getElementById('profile-data');

    if (personalDataContainer) {
      if (this.currentState === 'editing-personal') {
        const inputs = personalDataContainer.querySelectorAll(
          'input.profile-page__right',
        );
        const formData: Record<string, string> = {};

        inputs.forEach(input => {
          const name = (input as HTMLInputElement).name;
          const value = (input as HTMLInputElement).value;
          formData[name] = value;
        });
      } else if (this.currentState === 'editing-password') {
        const inputs = personalDataContainer.querySelectorAll(
          'input.profile-page__right',
        );
        const passwordData: Record<string, string> = {};

        inputs.forEach(input => {
          const name = (input as HTMLInputElement).name;
          const value = (input as HTMLInputElement).value;
          passwordData[name] = value;
        });
      }

      this.resetToDefaultMode();
    }
  }

  private renderPersonalDataEditable(context: Record<string, unknown>): string {
    return Handlebars.compile(`
      {{> PersonalDataEditable}}
    `)(context);
  }

  private renderPasswordDataEditable(context: Record<string, unknown>): string {
    return Handlebars.compile(`
    {{> PasswordDataEditable}}
  `)(context);
  }

  private renderSaveButton(context: Record<string, unknown>): string {
    return Handlebars.compile(`
      {{> ProfileSaveButton}}
    `)(context);
  }

  private renderActions(context: Record<string, unknown>): string {
    return Handlebars.compile(`
      {{> ActionsList}}
    `)(context);
  }

  private renderPersonalData(context: Record<string, unknown>): string {
    return Handlebars.compile(`
      {{> ProfilePersonalData}}
    `)(context);
  }

  render(context: Record<string, unknown> = {}): string {
    return super.render(context);
  }
}
