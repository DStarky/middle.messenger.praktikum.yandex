export const validationRules = {
  name: [
    {
      validator: (value: string) => value.trim().length > 0,
      message: 'Обязательно для заполнения',
    },
    {
      validator: (value: string) => /^[A-ZА-Я]/.test(value),
      message: 'Первая буква должна быть заглавной',
    },
    {
      validator: (value: string) =>
        /^[A-ZА-Я][a-zA-ZА-Яа-я\-]{1,9}$/.test(value),
      message:
        'Должно содержать только латинские или кириллические буквы и дефис, и быть длиной от 2 до 10 символов',
    },
    {
      validator: (value: string) => !/\s/.test(value),
      message: 'Не должно быть пробелов',
    },
    {
      validator: (value: string) => !/\d/.test(value),
      message: 'Не должно содержать цифр',
    },
    {
      validator: (value: string) =>
        /^[A-ZА-Я][a-zA-ZА-Яа-я\-]{1,9}$/.test(value),
      message: 'Не должно содержать специальных символов кроме дефиса',
    },
  ],

  login: [
    {
      validator: (value: string) => value.trim().length > 0,
      message: 'Обязателен для заполнения',
    },
    {
      validator: (value: string) => /^.{3,20}$/.test(value),
      message: 'Должен содержать от 3 до 20 символов',
    },
    {
      validator: (value: string) => /^(?!\d+$)/.test(value),
      message: 'Не должен состоять только из цифр',
    },
    {
      validator: (value: string) => /^[a-zA-Z0-9_-]+$/.test(value),
      message:
        'Может содержать только латинские буквы, цифры, дефис и подчёркивание без пробелов и специальных символов',
    },
  ],

  email: [
    {
      validator: (value: string) => value.trim().length > 0,
      message: 'Email обязателен для заполнения',
    },
    {
      validator: (value: string) =>
        /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.[a-zA-Z]+$/.test(value),
      message:
        'Email должен содержать латинские буквы, цифры, дефис или подчёркивание, обязательно символ "@" и точку после "@" с буквами перед точкой',
    },
  ],

  password: [
    {
      validator: (value: string) => value.trim().length > 0,
      message: 'Пароль обязателен для заполнения',
    },
    {
      validator: (value: string) => /^.{8,40}$/.test(value),
      message: 'Пароль должен содержать от 8 до 40 символов',
    },
    {
      validator: (value: string) => /[A-Z]/.test(value),
      message: 'Пароль должен содержать хотя бы одну заглавную букву',
    },
    {
      validator: (value: string) => /\d/.test(value),
      message: 'Пароль должен содержать хотя бы одну цифру',
    },
  ],

  phone: [
    {
      validator: (value: string) => value.trim().length > 0,
      message: 'Номер телефона обязателен для заполнения',
    },
    {
      validator: (value: string) => /^\+?\d{10,15}$/.test(value),
      message:
        'Номер телефона должен состоять из 10 до 15 цифр и может начинаться с плюса',
    },
  ],

  required: [
    {
      validator: (value: string) => value.trim().length > 0,
      message: 'Это поле обязательно для заполнения',
    },
  ],
};

export interface ValidationRule {
  validator: (value: string) => boolean;
  message: string;
}
