import { Block } from '../../app/Block';
import { ROUTES } from '../../app/routes';
import { Link } from '../../components/common/Link/Link';

const template = `
<main class="screen-center">
  <div class="error-page">
    <h1 class="error-page__title">404</h1>
    <p class="error-page__text">Не туда попали</p>
    <div class="error-page__link">
      {{{ link }}}
    </div>
  </div>
</main>
`;

export class Page404 extends Block {
  constructor() {
    const link = new Link({
      href: ROUTES.CHATS,
      text: 'Назад к чатам',
      className: 'error-page__back-link',
    });

    super('div', { link });
  }

  override render() {
    return this.compile(template, this.props);
  }
}
