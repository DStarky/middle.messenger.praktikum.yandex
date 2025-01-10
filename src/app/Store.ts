import { EventBus } from './EventBus';

export enum StoreEvents {
  Updated = 'store:updated',
}

export interface Indexed {
  [key: string]: unknown;
}

interface State extends Indexed {
  user?: {
    name?: string;
    avatar?: string;
    [key: string]: unknown;
  };
  chats?: unknown[];
}

/**
 * set(state, 'user.name', 'John') => state = { user: { name: 'John' } }
 */
function set(object: Indexed, path: string, value: unknown): void {
  if (typeof path !== 'string') {
    throw new Error('path must be string');
  }

  const keys = path.split('.');
  let current: Indexed = object;

  for (let i = 0; i < keys.length - 1; i += 1) {
    const key = keys[i];
    if (!Object.prototype.hasOwnProperty.call(current, key)) {
      current[key] = {};
    }

    current = current[key] as Indexed;
  }

  current[keys[keys.length - 1]] = value;
}

class Store extends EventBus {
  private state: State = {};

  public getState(): State {
    return { ...this.state };
  }

  public set(path: string, value: unknown): void {
    set(this.state, path, value);
    this.emit(StoreEvents.Updated);
  }
}

const store = new Store();
export default store;
