'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 300;
  var Keycode = {
    ESC: 27,
    ENTER: 13,
    LEFT_MOUSE_BTN: 0
  };

  window.util = {
    isEnterEvent: function (evt, action, argument) {
      if (evt.keyCode === Keycode.ENTER) {
        action(argument);
      }
    },
    isEscEvent: function (evt, action) {
      if (evt.keyCode === Keycode.ESC) {
        action();
      }
    },
    isLeftMouseBtnEvent: function (evt, action, argument) {
      if (evt.button === Keycode.LEFT_MOUSE_BTN) {
        action(argument);
      }
    },
    getRandomInt: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    shuffleArr: function (arr) {
      return arr.sort(function () {
        return Math.random() - 0.5;
      });
    },
    cutArrRandomly: function (arr) {
      return arr.slice(0, this.getRandomInt(1, arr.length));
    },
    toggleElementsDisabledProperty: function (elements, disabled) {
      elements.forEach(function (item) {
        if (disabled) {
          item.disabled = true;
        } else {
          item.disabled = false;
        }
      });
    },
    debounce: function (cb) {
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
    }
  };
})();
