import { RESUME, SUSPEND, TRIGGER_NOTIFICATION } from './actions'

export function suspendResumeEnhancer(next) {
  let currentListeners = []
  let nextListeners = currentListeners
  let isSuspended = false

  const ensureCanMutateNextListeners = () => {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice()
    }
  }

  /**
   * see `subscribe` function in https://github.com/reactjs/redux/blob/master/src/createStore.js
   *
   * @param {Function} listener A callback to be invoked on dispatch unless the notification
   *                            is currently suspended
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.')
    }

    let isSubscribed = true

    ensureCanMutateNextListeners()
    nextListeners.push(listener)

    return function unsubscribe() {
      if (!isSubscribed) {
        return
      }

      isSubscribed = false

      ensureCanMutateNextListeners()
      const index = nextListeners.indexOf(listener)
      nextListeners.splice(index, 1)
    }
  }

  return (...args) => {
    const store = next(...args);

    const dispatch = (action) => {
      let isTriggerAction = false
      store.dispatch(action)
      if (action['type']) {
        switch (action.type) {
          case SUSPEND:
            isSuspended = true
            break
          case RESUME:
            isSuspended = false
            break
          case TRIGGER_NOTIFICATION:
            isTriggerAction = true
            break
          default:
            break
        }
      }

      if (!isSuspended || isTriggerAction) {
        // notify
        const listeners = currentListeners = nextListeners
        for (let i = 0; i < listeners.length; i++) {
          const listener = listeners[i]
          listener()
        }
      }

      return action
    }


    return {
      ...store,
      dispatch,
      subscribe,
    };
  };
}
