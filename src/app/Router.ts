import type { Route } from './routes';
import { isValidRoute, ROUTES } from './routes';

export class Router {
  private routes: Record<Route, () => void> = {} as Record<Route, () => void>;
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

  addRoute(path: Route, renderFunction: () => void): void {
    this.routes[path] = renderFunction;
  }

  navigate(path: Route): void {
    window.history.pushState({}, '', path);
    this.routes[path]();
  }

  public init(): void {
    window.addEventListener('popstate', () => {
      const path = window.location.pathname as Route;
      if (this.routes[path]) {
        this.routes[path]();
      } else {
        this.handle404();
      }
    });

    const path = window.location.pathname as Route;
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
          if (isValidRoute(href)) {
            this.navigate(href as Route);
          } else {
            this.handle404();
          }
        }
      }
    });
  }

  private handle404(): void {
    this.navigate(ROUTES.NOT_FOUND);
  }

  render(content: HTMLElement): void {
    this.rootElement.innerHTML = '';
    this.rootElement.appendChild(content);
  }
}
