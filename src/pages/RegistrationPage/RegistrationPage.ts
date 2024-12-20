import type { Props } from '../../app/Block';
import Block from '../../app/Block';
import type { Router } from '../../app/Router';
import { ROUTES } from '../../app/routes';
import { Button } from '../../components/common/Button/Button';
import { CardTitle } from '../../components/common/CardTitle/CardTitle';
import { FloatingLabelInput } from '../../components/common/FloatingLabelInput/FloatingLabelInput';
import { Link } from '../../components/common/Link/Link';

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
      <div class="form-container__links">
        {{{ submitButton }}}
        {{{ loginLink }}}
      </div>
    </form>
  </main>
`;

interface RegistrationPageProps extends Props {
  cardTitle: CardTitle;
  emailInput: FloatingLabelInput;
  loginInput: FloatingLabelInput;
  firstNameInput: FloatingLabelInput;
  secondNameInput: FloatingLabelInput;
  phoneInput: FloatingLabelInput;
  passwordInput: FloatingLabelInput;
  repeatPasswordInput: FloatingLabelInput;
  submitButton: Button;
  loginLink: Link;
  events?: Record<string, (e: Event) => void>;
}

export class RegistrationPage extends Block<RegistrationPageProps> {
  private router: Router;

  constructor(router: Router) {
    const cardTitle = new CardTitle({ text: 'Регистрация' });

    const emailInput = new FloatingLabelInput({
      type: 'email',
      id: 'email',
      name: 'email',
      label: 'Почта',
      value: '',
      required: true,
      validationRules: [
        {
          validator: (value: string) =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
          message: 'Некорректный формат email',
        },
      ],
    });

    const loginInput = new FloatingLabelInput({
      type: 'text',
      id: 'login',
      name: 'login',
      label: 'Логин',
      value: '',
      required: true,
      validationRules: [
        {
          validator: (value: string) => /^[a-zA-Z0-9_]{3,10}$/.test(value),
          message: 'Логин должен содержать от 3 до 10 символов',
        },
      ],
    });

    const firstNameInput = new FloatingLabelInput({
      type: 'text',
      id: 'first_name',
      name: 'first_name',
      label: 'Имя',
      value: '',
      required: true,
      validationRules: [
        {
          validator: (value: string) => /^[A-Za-zА-Яа-яЁё]{2,10}$/.test(value),
          message:
            'Имя должно содержать только буквы и быть длиной от 2 до 10 символов',
        },
      ],
    });

    const secondNameInput = new FloatingLabelInput({
      type: 'text',
      id: 'second_name',
      name: 'second_name',
      label: 'Фамилия',
      value: '',
      required: true,
      validationRules: [
        {
          validator: (value: string) => /^[A-Za-zА-Яа-яЁё]{2,10}$/.test(value),
          message:
            'Фамилия должна содержать только буквы и быть длиной от 2 до 10 символов',
        },
      ],
    });

    const phoneInput = new FloatingLabelInput({
      type: 'tel',
      id: 'phone',
      name: 'phone',
      label: 'Телефон',
      value: '',
      required: true,
      validationRules: [
        {
          validator: (value: string) =>
            /^\+7\s\(\d{3}\)\s\d{3}\s\d{2}\s\d{2}$/.test(value),
          message: 'Номер телефона должен быть +7 (XXX) XXX XX XX',
        },
      ],
    });

    const passwordInput = new FloatingLabelInput({
      type: 'password',
      id: 'password',
      name: 'password',
      label: 'Пароль',
      value: '',
      required: true,
      validationRules: [
        {
          validator: (value: string) => value.length >= 6,
          message: 'Пароль должен содержать не менее 6 символов',
        },
      ],
    });

    const repeatPasswordInput = new FloatingLabelInput({
      type: 'password',
      id: 'repeatPassword',
      name: 'repeatPassword',
      label: 'Пароль (ещё раз)',
      value: '',
      required: true,
      validationRules: [
        {
          validator: (value: string) => value.length >= 6,
          message: 'Пароль должен содержать не менее 6 символов',
        },
      ],
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

    super({
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
    if (form.id !== 'registration-form') {
      return;
    }

    // Сначала валидируем все поля
    const isValid = this.validateAllFields();
    if (!isValid) {
      // Ошибки уже отображены в соответствующих полях
      return;
    }

    // Затем проверяем, совпадают ли пароли
    const password = (
      this.children.passwordInput as FloatingLabelInput
    ).getValue();
    const repeatPassword = (
      this.children.repeatPasswordInput as FloatingLabelInput
    ).getValue();

    if (password !== repeatPassword) {
      // Устанавливаем ошибку на поле повторного ввода пароля
      (this.children.repeatPasswordInput as FloatingLabelInput).setProps({
        error: 'Пароли не совпадают.',
      });
      return;
    } else {
      // Если пароли совпадают, очищаем ошибку (на случай, если она была установлена ранее)
      (this.children.repeatPasswordInput as FloatingLabelInput).setProps({
        error: '',
      });
    }

    // Собираем данные формы
    const formData = new FormData(form);
    const email = formData.get('email') as string;
    const login = formData.get('login') as string;
    const firstName = formData.get('first_name') as string;
    const secondName = formData.get('second_name') as string;
    const phone = formData.get('phone') as string;
    const passwordValue = formData.get('password') as string;
    const repeatPasswordValue = formData.get('repeatPassword') as string;

    if (
      !email ||
      !login ||
      !firstName ||
      !secondName ||
      !phone ||
      !passwordValue ||
      !repeatPasswordValue
    ) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }

    console.log('Регистрация:', {
      email,
      login,
      firstName,
      secondName,
      phone,
      password: passwordValue,
    });

    // Здесь можно добавить логику авторизации
    // После успешной авторизации навигация на страницу чатов
    // this.router.navigate(ROUTES.CHATS);
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
