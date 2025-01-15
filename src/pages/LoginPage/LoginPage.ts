import type { Props, PropsWithChildren } from '../../app/Block';
import Block from '../../app/Block';
import { ROUTES } from '../../app/routes';
import { Button } from '../../components/common/Button/Button';
import { CardTitle } from '../../components/common/CardTitle/CardTitle';
import { FloatingLabelInput } from '../../components/common/FloatingLabelInput/FloatingLabelInput';
import { Link } from '../../components/common/Link/Link';
import { validationRules } from '../../helpers/validationRules';
import AuthController from '../../controllers/AuthController';

import type { Events } from '../../types/Events';
import { Loader } from '../../components/common/Loader/Loader';
import { router } from '../../app/Router';

const template = `
  <main class="screen-center login-page">
    <form class="form-container" id="login-form">
      <div class="form-container__title">
        {{{ cardTitle }}}
      </div>

      <div class="form-container__inputs">
        {{{ loginInput }}}
        {{{ passwordInput }}}
      </div>

      {{#if isLoading}}
        <div class="loader__wrapper">
          {{{ loader }}}
        </div>
      {{/if}}

      {{#if error}}
        <div class="error-message-red text-center">{{error}}</div>
      {{/if}}

      <div class="form-container__links">
        {{{ submitButton }}}
        {{{ registrationLink }}}
      </div>
    </form>
  </main>
`;

interface LoginPageProps extends Props {
  cardTitle?: CardTitle;
  loginInput?: FloatingLabelInput;
  passwordInput?: FloatingLabelInput;
  submitButton?: Button;
  registrationLink?: Link;
  loader?: Loader;
  events?: Events;

  isLoading?: boolean;
  error?: string | null;
}

export class LoginPage extends Block<LoginPageProps> {
  constructor(props: PropsWithChildren<LoginPageProps> = {}) {
    const cardTitle = new CardTitle({ text: 'Вход' });

    const loginInput = new FloatingLabelInput({
      type: 'text',
      id: 'login',
      name: 'login',
      label: 'Логин',
      value: '',
      validationRules: validationRules.login,
    });

    const passwordInput = new FloatingLabelInput({
      type: 'password',
      id: 'password',
      name: 'password',
      label: 'Пароль',
      value: '',
      validationRules: validationRules.password,
    });

    const submitButton = new Button({
      type: 'submit',
      text: 'Войти',
      className: 'w-full',
    });

    const registrationLink = new Link({
      href: ROUTES.REGISTRATION,
      text: 'Нет аккаунта?',
      className: 'form-container__registration-link',
    });

    const loader = new Loader();

    super({
      ...props,
      cardTitle,
      loginInput,
      passwordInput,
      submitButton,
      registrationLink,
      loader,
      isLoading: false,
      error: null,
      events: {
        submit: (e: Event) => this.handleSubmit(e),
      },
    });
  }

  override render(): string {
    return template;
  }

  private async handleSubmit(event: Event) {
    event.preventDefault();

    const isValid = this.validateAllFields();
    if (!isValid) {
      // Можем выставить локальную ошибку: this.setProps({ error: 'Исправьте ошибки' });
      return;
    }

    const form = event.target as HTMLFormElement;
    if (form.id !== 'login-form') {
      return;
    }

    const formData = new FormData(form);
    const login = formData.get('login') as string;
    const password = formData.get('password') as string;

    if (!login || !password) {
      this.setProps({ error: 'Введите логин и пароль' });
      return;
    }

    // Вызываем AuthController и передаём колбэки
    await AuthController.signIn(
      login,
      password,
      // onLoading
      (loading: boolean) => {
        this.setProps({ isLoading: loading });
      },
      // onError
      (error: string | null) => {
        this.setProps({ error });
      },
      // onSuccess
      user => {
        console.log('Успешный вход, пользователь:', user);
        router.navigate(ROUTES.CHATS);
      },
    );
  }

  public validateAllFields(): boolean {
    const fields = [
      this.children.loginInput,
      this.children.passwordInput,
    ] as FloatingLabelInput[];

    let isValid = true;

    fields.forEach(field => {
      const fieldValid = field.validate();
      if (!fieldValid) {
        isValid = false;
      }
    });

    return isValid;
  }
}
