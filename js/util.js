'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var LEFT_MOUSE_BTN_CODE = 0;

  window.util = {
    isEnterEvent: function (evt, action, argument) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action(argument);
      }
    },
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    isLeftMouseBtnEvent: function (evt, action) {
      if (evt.button === LEFT_MOUSE_BTN_CODE) {
        action();
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
    }
  };
})();
