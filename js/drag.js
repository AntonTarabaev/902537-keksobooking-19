'use strict';

(function () {
  var MAIN_PIN_SIZE = {
    WIDTH: 62,
    HEIGHT: 62,
    LEG: 22
  };

  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
  var adAddress = document.querySelector('#address');
  var startPosition = {
    x: mainPin.style.left,
    y: mainPin.style.top
  };
  var DragLimits = {
    MIN_X: 0 - MAIN_PIN_SIZE.WIDTH / 2,
    MAX_X: 1200 - MAIN_PIN_SIZE.WIDTH / 2,
    MIN_Y: 130 - (MAIN_PIN_SIZE.HEIGHT + MAIN_PIN_SIZE.LEG),
    MAX_Y: 630 - (MAIN_PIN_SIZE.HEIGHT + MAIN_PIN_SIZE.LEG)
  };

  var getPinCoords = function (pin, xOffset, yOffset) {
    return (parseInt(pin.style.left, 10) + xOffset) + ', ' + (parseInt(pin.style.top, 10) + yOffset);
  };

  var getAddress = function () {
    return map.classList.contains('map--faded')
      ? getPinCoords(mainPin, MAIN_PIN_SIZE.WIDTH / 2, MAIN_PIN_SIZE.HEIGHT / 2)
      : getPinCoords(mainPin, MAIN_PIN_SIZE.WIDTH / 2, MAIN_PIN_SIZE.HEIGHT + MAIN_PIN_SIZE.LEG);
  };

  var resetPinCoords = function () {
    mainPin.style.top = startPosition.y;
    mainPin.style.left = startPosition.x;
    adAddress.value = getAddress();
  };

  var onMainPinLeftClick = function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var isDragged = false;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      isDragged = true;

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      if (parseInt(mainPin.style.top, 10) > DragLimits.MAX_Y) {
        mainPin.style.top = DragLimits.MAX_Y + 'px';
      } else if (parseInt(mainPin.style.top, 10) < DragLimits.MIN_Y) {
        mainPin.style.top = DragLimits.MIN_Y + 'px';
      } else {
        mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
      }
      if (parseInt(mainPin.style.left, 10) > DragLimits.MAX_X) {
        mainPin.style.left = DragLimits.MAX_X + 'px';
      } else if (parseInt(mainPin.style.left, 10) < DragLimits.MIN_X) {
        mainPin.style.left = DragLimits.MIN_X + 'px';
      } else {
        mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
      }
      adAddress.value = getAddress();
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      adAddress.value = getAddress();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (isDragged) {
        var onClickPreventDefault = function (clickEvt) {
          clickEvt.preventDefault();
          mainPin.removeEventListener('click', onClickPreventDefault);
        };
        mainPin.addEventListener('click', onClickPreventDefault);
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  mainPin.addEventListener('mousedown', function (evt) {
    window.util.isLeftMouseBtnEvent(evt, onMainPinLeftClick, evt);
  });

  window.drag = {
    getAddress: getAddress,
    resetPinCoords: resetPinCoords
  };
})();
