import { isEqual } from '../utils/isEqual';
import type Block from './Block';
import type { Indexed } from './Store';
import store, { StoreEvents } from './Store';

export function connect(mapStateToProps: (state: Indexed) => Indexed) {
  return function wrap(Component: typeof Block) {
    return class extends Component {
      private stateProps: Indexed;

      constructor(props: Indexed = {}) {
        const initialStateProps = mapStateToProps(store.getState());

        super({ ...props, ...initialStateProps });

        this.stateProps = initialStateProps;

        store.on(StoreEvents.Updated, () => {
          const newStateProps = mapStateToProps(store.getState());

          if (!isEqual(this.stateProps, newStateProps)) {
            this.setProps({ ...newStateProps });
            this.stateProps = newStateProps;
          }
        });
      }

      override render(): string {
        return this.render();
      }
    };
  };
}
