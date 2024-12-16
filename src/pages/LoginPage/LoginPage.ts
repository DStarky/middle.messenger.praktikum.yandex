import type { Props } from '../../app/Block';
import Block from '../../app/Block';
import type { Router } from '../../app/Router';
import { ROUTES } from '../../app/routes';
import { Button } from '../../components/common/Button/Button';
import { CardTitle } from '../../components/common/CardTitle/CardTitle';
import { FloatingLabelInput } from '../../components/common/FloatingLabelInput/FloatingLabelInput';
import { Link } from '../../components/common/Link/Link';

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
      <div class="form-container__links">
        {{{ submitButton }}}
        {{{ registrationLink }}}
      </div>
    </form>
  </main>
`;

interface LoginPageProps extends Props {
  cardTitle: CardTitle;
  loginInput: FloatingLabelInput;
  passwordInput: FloatingLabelInput;
  submitButton: Button;
  registrationLink: Link;
  events?: Record<string, (e: Event) => void>;
}

export class LoginPage extends Block<LoginPageProps> {
  private router: Router;

  constructor(router: Router) {
    const cardTitle = new CardTitle({ text: 'Вход' });

    const loginInput = new FloatingLabelInput({
      type: 'text',
      id: 'login',
      name: 'login',
      label: 'Логин',
      value: '',
    });

    const passwordInput = new FloatingLabelInput({
      type: 'password',
      id: 'password',
      name: 'password',
      label: 'Пароль',
      value: '',
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

    super({
      cardTitle,
      loginInput,
      passwordInput,
      submitButton,
      registrationLink,
      events: {
        submit: (e: Event) => this.handleSubmit(e),
      },
    });

    this.router = router;
  }

  override render(): string {
    return template;
  }

  private handleSubmit(event: Event) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    if (form.id !== 'login-form') {
      return;
    }

    const formData = new FormData(form);
    const login = formData.get('login') as string;
    const password = formData.get('password') as string;

    if (!login || !password) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }

    console.log('Login:', login);
    console.log('Password:', password);

    // Здесь можно добавить логику авторизации
    // После успешной авторизации навигация на страницу чатов
    // this.router.navigate(ROUTES.CHATS);
  }
}
