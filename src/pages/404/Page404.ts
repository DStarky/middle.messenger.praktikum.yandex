import type { Props } from '../../app/Block';
import Block from '../../app/Block';
import { ROUTES } from '../../app/routes';
import { Link } from '../../components/common/Link/Link';
import { CreateChatModal } from '../../components/common/Modal/CreateChatModal/CreateChatModal';
import { Modal } from '../../components/common/Modal/Modal';

const template = `
<main class="screen-center">
  <div class="error-page">
    <h1 class="error-page__title">404</h1>
    <p class="error-page__text">Не туда попали</p>
    <div class="error-page__link">
      {{{ link }}}
    </div>
    <div>
      {{{modal}}}
    </div>
  </div>
</main>
`;

interface Page404Props extends Props {
  link: Link;
}

export class Page404 extends Block<Page404Props> {
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

    const createChatModalContent = new CreateChatModal({});

    const modal = new Modal({
      size: 'small',
      children: createChatModalContent,
      events: {
        close: () => {},
      },
    });

    super({ link, modal });
  }

  protected render(): string {
    return template;
  }
}
