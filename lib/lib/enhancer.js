'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.suspendResumeEnhancer = suspendResumeEnhancer;

var _actions = require('./actions');

function suspendResumeEnhancer(next) {
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isSuspended = false;

  var ensureCanMutateNextListeners = function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  };

  /**
   * see `subscribe` function in https://github.com/reactjs/redux/blob/master/src/createStore.js
   *
   * @param {Function} listener A callback to be invoked on dispatch unless the notification
   *                            is currently suspended
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    var isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  return function () {
    var store = next.apply(undefined, arguments);

    var dispatch = function dispatch(action) {
      var isTriggerAction = false;
      store.dispatch(action);
      if (action['type']) {
        switch (action.type) {
          case _actions.SUSPEND:
            isSuspended = true;
            break;
          case _actions.RESUME:
            isSuspended = false;
            break;
          case _actions.TRIGGER_NOTIFICATION:
            isTriggerAction = true;
            break;
          default:
            break;
        }
      }

      if (!isSuspended || isTriggerAction) {
        // notify
        var listeners = currentListeners = nextListeners;
        for (var i = 0; i < listeners.length; i++) {
          var listener = listeners[i];
          listener();
        }
      }

      return action;
    };

    return _extends({}, store, {
      dispatch: dispatch,
      subscribe: subscribe
    });
  };
}