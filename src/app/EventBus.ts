export class EventBus<E extends Record<string, (...args: unknown[]) => void>> {
  private listeners: Map<keyof E, Set<E[keyof E]>>;

  constructor() {
    this.listeners = new Map();
  }

  on<K extends keyof E>(event: K, callback: E[K]): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.add(callback);
    } else {
      this.listeners.set(event, new Set([callback]));
    }
  }

  off<K extends keyof E>(event: K, callback: E[K]): void {
    if (!this.listeners.has(event)) {
      return;
    }

    const eventListeners = this.listeners.get(event)!;
    eventListeners.delete(callback);

    if (eventListeners.size === 0) {
      this.listeners.delete(event);
    }
  }

  emit<K extends keyof E>(event: K, ...args: Parameters<E[K]>): void {
    if (!this.listeners.has(event)) {
      throw new Error(`Error: Нет события: ${String(event)}`);
    }

    const setOfFunctions = this.listeners.get(event)!;

    for (const fn of setOfFunctions) {
      fn(...args);
    }
  }
}

// ====== ПРИМЕР ИСПОЛЬЗОВАЕНИЯ ======

// type MyEvents = {
//   click: (x: number, y: number) => void;
//   hover: (element: HTMLElement) => void;
// };

// const bus = new EventBus<MyEvents>();

// bus.on('click', (x, y) => {
//   console.log(`Clicked at (${x}, ${y})`);
// });

// bus.emit('click', 10, 20);

// bus.emit('hover', document.body);
