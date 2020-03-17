'use strict';

(function () {
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
  var adAddress = document.querySelector('#address');
  var MainPinSize = {
    WIDTH: 62,
    HEIGHT: 62,
    LEG: 22
  };
  var DragLimits = {
    MIN_X: 0 - MainPinSize.WIDTH / 2,
    MAX_X: 1200 - MainPinSize.WIDTH / 2,
    MIN_Y: 130 - (MainPinSize.HEIGHT + MainPinSize.LEG),
    MAX_Y: 630 - (MainPinSize.HEIGHT + MainPinSize.LEG)
  };

  var Rect = function (left, top, right, bottom) {
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
  };

  var Coordinate = function (x, y, constraints) {
    this.x = x;
    this.y = y;
    this._constraints = constraints;
  };

  Coordinate.prototype.setX = function (x) {
    if (x >= this._constraints.left && x <= this._constraints.right) {
      this.x = x;
    }
  };

  Coordinate.prototype.setY = function (y) {
    if (y >= this._constraints.top && y <= this._constraints.bottom) {
      this.y = y;
    }
  };

  var startPosition = new Coordinate(mainPin.style.left, mainPin.style.top);

  var getPinCoords = function (pin, xOffset, yOffset) {
    return (parseInt(pin.style.left, 10) + xOffset) + ', ' + (parseInt(pin.style.top, 10) + yOffset);
  };

  var getAddress = function () {
    return map.classList.contains('map--faded')
      ? getPinCoords(mainPin, MainPinSize.WIDTH / 2, MainPinSize.HEIGHT / 2)
      : getPinCoords(mainPin, MainPinSize.WIDTH / 2, MainPinSize.HEIGHT + MainPinSize.LEG);
  };

  var resetPinCoords = function () {
    mainPin.style.top = startPosition.y;
    mainPin.style.left = startPosition.x;
    adAddress.value = getAddress();
  };

  var onMainPinLeftMousedown = function (evt) {
    evt.preventDefault();

    var startCoords = new Coordinate(evt.clientX, evt.clientY);

    var isDragged = false;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      isDragged = true;

      var shift = new Coordinate(startCoords.x - moveEvt.clientX, startCoords.y - moveEvt.clientY);

      startCoords = new Coordinate(moveEvt.clientX, moveEvt.clientY);

      var position = new Coordinate(mainPin.offsetLeft, mainPin.offsetTop, new Rect(DragLimits.MIN_X, DragLimits.MIN_Y, DragLimits.MAX_X, DragLimits.MAX_Y));
      position.setX(mainPin.offsetLeft - shift.x);
      position.setY(mainPin.offsetTop - shift.y);

      mainPin.style.left = position.x + 'px';
      mainPin.style.top = position.y + 'px';

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
    window.util.isLeftMouseBtnEvent(evt, onMainPinLeftMousedown, evt);
  });

  window.drag = {
    getAddress: getAddress,
    resetPinCoords: resetPinCoords
  };
})();
