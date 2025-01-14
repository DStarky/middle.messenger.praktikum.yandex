import type { Props, PropsWithChildren } from '../../app/Block';
import Block from '../../app/Block';
import { ROUTES } from '../../app/routes';
import { Button } from '../../components/common/Button/Button';
import { CardTitle } from '../../components/common/CardTitle/CardTitle';
import { FloatingLabelInput } from '../../components/common/FloatingLabelInput/FloatingLabelInput';
import { Link } from '../../components/common/Link/Link';
import { Loader } from '../../components/common/Loader/Loader';
import { validationRules } from '../../helpers/validationRules';
import AuthController from '../../controllers/AuthController';
import { connect } from '../../app/HOC';
import type { Indexed } from '../../app/Store';
import type { Events } from '../../types/Events';

const template = `
  <main class="screen-center registration-page">
    <form class="form-container" id="registration-form">
      <div class="form-container__title">
        {{{ cardTitle }}}
      </div>

      <div class="form-container__inputs">
        {{{ emailInput }}}
        {{{ loginInput }}}
        {{{ firstNameInput }}}
        {{{ secondNameInput }}}
        {{{ phoneInput }}}
        {{{ passwordInput }}}
        {{{ repeatPasswordInput }}}
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
        {{{ loginLink }}}
      </div>
    </form>
  </main>
`;

interface RegistrationPageProps extends Props {
  cardTitle?: CardTitle;
  emailInput?: FloatingLabelInput;
  loginInput?: FloatingLabelInput;
  firstNameInput?: FloatingLabelInput;
  secondNameInput?: FloatingLabelInput;
  phoneInput?: FloatingLabelInput;
  passwordInput?: FloatingLabelInput;
  repeatPasswordInput?: FloatingLabelInput;
  submitButton?: Button;
  loginLink?: Link;
  loader?: Loader;
  events?: Events;

  // Пропы, приходящие из Store:
  isLoading?: boolean;
  error?: string | null;
}

class _RegistrationPage extends Block<RegistrationPageProps> {
  private loader: Loader;

  constructor(props: PropsWithChildren<RegistrationPageProps> = {}) {
    const cardTitle = new CardTitle({ text: 'Регистрация' });

    const emailInput = new FloatingLabelInput({
      type: 'email',
      id: 'email',
      name: 'email',
      label: 'Почта',
      value: '',
      required: true,
      validationRules: validationRules.email,
    });

    const loginInput = new FloatingLabelInput({
      type: 'text',
      id: 'login',
      name: 'login',
      label: 'Логин',
      value: '',
      required: true,
      validationRules: validationRules.login,
    });

    const firstNameInput = new FloatingLabelInput({
      type: 'text',
      id: 'first_name',
      name: 'first_name',
      label: 'Имя',
      value: '',
      required: true,
      validationRules: validationRules.name,
    });

    const secondNameInput = new FloatingLabelInput({
      type: 'text',
      id: 'second_name',
      name: 'second_name',
      label: 'Фамилия',
      value: '',
      required: true,
      validationRules: validationRules.name,
    });

    const phoneInput = new FloatingLabelInput({
      type: 'tel',
      id: 'phone',
      name: 'phone',
      label: 'Телефон',
      value: '',
      required: true,
      validationRules: validationRules.phone,
    });

    const passwordInput = new FloatingLabelInput({
      type: 'password',
      id: 'password',
      name: 'password',
      label: 'Пароль',
      value: '',
      required: true,
      validationRules: validationRules.password,
    });

    const repeatPasswordInput = new FloatingLabelInput({
      type: 'password',
      id: 'repeatPassword',
      name: 'repeatPassword',
      label: 'Пароль (ещё раз)',
      value: '',
      required: true,
      validationRules: validationRules.password,
    });

    const submitButton = new Button({
      type: 'submit',
      text: 'Зарегистрироваться',
      className: 'w-full',
    });

    const loginLink = new Link({
      href: ROUTES.LOGIN,
      text: 'Войти',
      className: 'form-container__login-link',
    });

    // Создаём Loader
    const loader = new Loader();

    super({
      ...props,
      cardTitle,
      emailInput,
      loginInput,
      firstNameInput,
      secondNameInput,
      phoneInput,
      passwordInput,
      repeatPasswordInput,
      submitButton,
      loginLink,
      loader,
      events: {
        submit: (e: Event) => this.handleSubmit(e),
      },
    });

    this.loader = loader;
  }

  override render(): string {
    return template;
  }

  private async handleSubmit(event: Event) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    if (form.id !== 'registration-form') {
      return;
    }

    const isValid = this.validateAllFields();
    if (!isValid) {
      return;
    }

    // Проверяем пароли
    const password = (
      this.children.passwordInput as FloatingLabelInput
    ).getValue();
    const repeatPassword = (
      this.children.repeatPasswordInput as FloatingLabelInput
    ).getValue();

    if (password !== repeatPassword) {
      (this.children.repeatPasswordInput as FloatingLabelInput).setProps({
        error: 'Пароли не совпадают.',
      });
      return;
    } else {
      (this.children.repeatPasswordInput as FloatingLabelInput).setProps({
        error: '',
      });
    }

    const formData = new FormData(form);
    const email = formData.get('email') as string;
    const login = formData.get('login') as string;
    const firstName = formData.get('first_name') as string;
    const secondName = formData.get('second_name') as string;
    const phone = formData.get('phone') as string;
    const passwordValue = formData.get('password') as string;

    if (
      !email ||
      !login ||
      !firstName ||
      !secondName ||
      !phone ||
      !passwordValue
    ) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }

    // Вызываем метод контроллера
    await AuthController.signUp(
      firstName,
      secondName,
      login,
      email,
      passwordValue,
      phone,
    );
  }

  public validateAllFields(): boolean {
    const fields = [
      this.children.emailInput,
      this.children.loginInput,
      this.children.firstNameInput,
      this.children.secondNameInput,
      this.children.phoneInput,
      this.children.passwordInput,
      this.children.repeatPasswordInput,
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

// Подключаемся к Store
function mapStateToProps(state: Indexed) {
  return {
    isLoading: state.isLoading,
    error: state.error,
  };
}

export const RegistrationPage = connect(mapStateToProps)(_RegistrationPage);
