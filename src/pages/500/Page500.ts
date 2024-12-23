import type { Props } from '../../app/Block';
import Block from '../../app/Block';
import { ROUTES } from '../../app/routes';
import { Link } from '../../components/common/Link/Link';

const template = `
<main class="screen-center">
  <div class="error-page">
    <h1 class="error-page__title">500</h1>
    <p class="error-page__text">Мы уже фиксим</p>
    <div class="error-page__link">
      {{{ link }}}
    </div>
  </div>
</main>
`;

interface Page500Props extends Props {
  link: Link;
}

export class Page500 extends Block<Page500Props> {
  constructor() {
    const link = new Link({
      href: ROUTES.CHATS,
      text: 'Назад к чатам',
      className: 'error-page__back-link',
      events: {
        click: (event: Event) => {
          event.preventDefault();
        },
      },
    });

    super({ link });
  }

  override render() {
    return template;
  }
}
