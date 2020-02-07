'use strict';

(function () {
  var MAIN_PIN_SIZE = {
    WIDTH: 62,
    HEIGHT: 62,
    LEG: 22
  };

  var map = document.querySelector('.map');
  var mapPinsArea = map.querySelector('.map__pins');
  var mainPin = mapPinsArea.querySelector('.map__pin--main');
  var mapFilters = map.querySelector('.map__filters-container');
  var adForm = document.querySelector('.ad-form');
  var adAddress = adForm.querySelector('#address');
  var adDescription = adForm.querySelector('#description');
  var adResetBtn = adForm.querySelector('.ad-form__reset');
  var pageInputs = document.querySelectorAll('input');
  var pageSelects = document.querySelectorAll('select');

  var toggleElementsDisabledProperty = function (elements, disabled) {
    for (var i = 0; i < elements.length; i++) {
      if (disabled) {
        elements[i].disabled = true;
      } else {
        elements[i].disabled = false;
      }
    }
  };

  var getPinCoords = function (pin, xOffset, yOffset) {
    return (parseInt(pin.style.left, 10) + xOffset) + ', ' + (parseInt(pin.style.top, 10) + yOffset);
  };

  var getAddress = function () {
    return map.classList.contains('map--faded')
      ? getPinCoords(mainPin, MAIN_PIN_SIZE.WIDTH / 2, MAIN_PIN_SIZE.HEIGHT / 2)
      : getPinCoords(mainPin, MAIN_PIN_SIZE.WIDTH / 2, MAIN_PIN_SIZE.HEIGHT + MAIN_PIN_SIZE.LEG);
  };

  var showRenderedPins = function () {
    var renderedPins = window.renderedPins.cloneNode(true);
    mapPinsArea.appendChild(renderedPins);
  };

  var removeRenderedPins = function () {
    var renderedPins = mapPinsArea.querySelectorAll('.map__pin:not(.map__pin--main)');

    for (var i = 0; i < renderedPins.length; i++) {
      renderedPins[i].remove();
    }
  };

  var onPopupEscPress = function (evt) {
    window.util.isEscEvent(evt, removePopup);
  };

  var removePopup = function () {
    var mapCard = map.querySelector('.map__card');
    if (mapCard !== null) {
      mapCard.remove();
      document.removeEventListener('keydown', onPopupEscPress);
    }
  };

  var addPopupCloseHandlers = function () {
    var popupClose = map.querySelector('.popup__close');
    document.addEventListener('keydown', onPopupEscPress);
    popupClose.addEventListener('click', function () {
      removePopup();
    });
    popupClose.addEventListener('keydown', function (evt) {
      window.util.isEnterEvent(evt, removePopup);
    });
  };

  var addMapCardElement = function (number) {
    mapFilters.insertAdjacentElement('beforebegin', window.offersCards[number]);
    addPopupCloseHandlers();
  };

  var onMapPinClick = function (evt) {
    if (evt.target && evt.target.matches('.map__pin:not(.map__pin--main)')) {
      removePopup();
      addMapCardElement(evt.target.dataset.number);
    } else if (evt.target && evt.target.parentNode.matches('.map__pin:not(.map__pin--main)')) {
      removePopup();
      addMapCardElement(evt.target.parentNode.dataset.number);
    }
  };

  var onMapPinEnterPress = function (evt) {
    window.util.isEnterEvent(evt, onMapPinClick, evt);
  };

  var togglePageState = function (disable) {
    if (disable) {
      map.classList.add('map--faded');
      adForm.classList.add('ad-form--disabled');
      toggleElementsDisabledProperty(pageSelects, true);
      toggleElementsDisabledProperty(pageInputs, true);
      adDescription.disabled = true;

      adAddress.value = getAddress();
      removeRenderedPins();
      removePopup();
    } else if (map.classList.contains('map--faded')) {
      map.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');
      toggleElementsDisabledProperty(pageSelects);
      toggleElementsDisabledProperty(pageInputs);
      adAddress.readOnly = true;
      adDescription.disabled = false;

      adAddress.value = getAddress();
      showRenderedPins();
      addMapCardElement(0);
    }
  };

  mainPin.addEventListener('mousedown', function (evt) {
    window.util.isLeftMouseBtnEvent(evt, togglePageState);
  });
  mainPin.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, togglePageState);
  });

  mapPinsArea.addEventListener('click', onMapPinClick);
  mapPinsArea.addEventListener('keydown', onMapPinEnterPress);

  adResetBtn.addEventListener('click', function (evt) {
    evt.preventDefault();
    adForm.reset();
    togglePageState(true);
  });

  togglePageState(true);
})();
