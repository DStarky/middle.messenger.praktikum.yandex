export class Router {
  private routes: Record<string, () => void> = {};
  private rootElement: HTMLElement;

  constructor(rootSelector: string) {
    const root = document.querySelector(rootSelector);

    if (!(root instanceof HTMLElement)) {
      throw new Error(
        `Root element ${rootSelector} не найден или не является типом HTMLElement`,
      );
    }

    this.rootElement = root;
  }

  addRoute(path: string, renderFunction: () => void): void {
    this.routes[path] = renderFunction;
  }

  navigate(path: string): void {
    if (this.routes[path]) {
      window.history.pushState({}, '', path);
      this.routes[path]();
    } else {
      this.handle404();
    }
  }

  public init(): void {
    window.addEventListener('popstate', () => {
      const path = window.location.pathname;
      if (this.routes[path]) {
        this.routes[path]();
      } else {
        this.handle404();
      }
    });

    const path = window.location.pathname;
    if (this.routes[path]) {
      this.routes[path]();
    } else {
      this.handle404();
    }

    document.addEventListener('click', event => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')) {
        const href = target.getAttribute('href')!;
        if (href.startsWith('/')) {
          event.preventDefault();
          this.navigate(href);
        }
      }
    });
  }

  private handle404(): void {
    if (window.location.pathname !== '/404') {
      window.history.replaceState({}, '', '/404');
      if (this.routes['/404']) {
        this.routes['/404']();
      } else {
        this.render(`<h1>404 - Страница не найдена</h1>`);
      }
    } else {
      this.render(`<h1>404 - Страница не найдена</h1>`);
    }
  }

  render(content: string): void {
    this.rootElement.innerHTML = content;
  }
}
