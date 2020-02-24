'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 300;
  var LEFT_MOUSE_BTN_KEYCODE = 0;
  var Key = {
    ESC: 'Escape',
    ENTER: 'Enter'
  };

  var isEnterEvent = function (evt, action, argument) {
    if (evt.key === Key.ENTER) {
      action(argument);
    }
  };

  var isEscEvent = function (evt, action) {
    if (evt.key === Key.ESC) {
      action();
    }
  };

  var isLeftMouseBtnEvent = function (evt, action, argument) {
    if (evt.button === LEFT_MOUSE_BTN_KEYCODE) {
      action(argument);
    }
  };

  var toggleElementsDisabledProperty = function (elements, disabled) {
    elements.forEach(function (item) {
      item.disabled = disabled;
    });
  };

  var debounce = function (cb) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };

  window.util = {
    isEnterEvent: isEnterEvent,
    isEscEvent: isEscEvent,
    isLeftMouseBtnEvent: isLeftMouseBtnEvent,
    toggleElementsDisabledProperty: toggleElementsDisabledProperty,
    debounce: debounce
  };
})();
