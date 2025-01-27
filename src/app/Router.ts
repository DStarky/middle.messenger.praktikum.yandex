import AuthController from '../controllers/AuthController';
import type { Route } from './routes';
import { isValidRoute, protectedRoutes, ROUTES } from './routes';
import store from './Store';

export class Router {
  private routes: Record<Route, () => void> = {} as Record<Route, () => void>;
  private rootElement: HTMLElement;
  private handlePopStateBound: () => void;

  constructor(rootSelector: string) {
    const root = document.querySelector(rootSelector);
    if (!(root instanceof HTMLElement)) {
      throw new Error(`Root element ${rootSelector} не найден`);
    }

    this.rootElement = root;
    this.handlePopStateBound = this.handlePopState.bind(this);
  }

  addRoute(path: Route, renderFunction: () => void): void {
    this.routes[path] = renderFunction;
  }

  public async navigate(path: Route): Promise<void> {
    if (path === window.location.pathname) {
      return;
    }

    if (protectedRoutes.includes(path)) {
      try {
        const user = await AuthController.getUserInfo();
        console.log(user);
        if (!user) {
          this.handleUnauthorized();
          return;
        }
      } catch (error) {
        console.error(error);
        this.handleUnauthorized();
        return;
      }
    }

    window.history.pushState({}, '', path);
    this.executeRoute(path);
  }

  private handleUnauthorized(): void {
    store.set('user', null);
    if (window.location.pathname !== ROUTES.MAIN) {
      this.navigate(ROUTES.MAIN);
    }
  }

  private executeRoute(path: Route): void {
    const routeFunc = this.routes[path];
    if (routeFunc) {
      routeFunc();
    } else {
      this.handle404();
    }
  }

  public init(): void {
    window.addEventListener('popstate', this.handlePopStateBound);

    const currentPath = window.location.pathname as Route;
    const routeFunc = this.routes[currentPath];
    if (routeFunc) {
      routeFunc();
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

  private handlePopState(): void {
    const path = window.location.pathname as Route;
    const routeFunc = this.routes[path];
    if (routeFunc) {
      routeFunc();
    } else {
      this.handle404();
    }
  }

  private handle404(): void {
    if (window.location.pathname !== ROUTES.NOT_FOUND) {
      this.navigate(ROUTES.NOT_FOUND);
    }
  }

  public render(content: HTMLElement): void {
    this.rootElement.innerHTML = '';
    this.rootElement.appendChild(content);
  }

  back(): void {
    window.history.back();
  }

  forward(): void {
    window.history.forward();
  }

  public _resetRoutesForTesting(): void {
    this.routes = {} as Record<Route, () => void>;
  }

  public removeListeners(): void {
    window.removeEventListener('popstate', this.handlePopStateBound);
  }
}

export const router = new Router('#app');
