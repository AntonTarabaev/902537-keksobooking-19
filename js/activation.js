'use strict';

(function () {
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var adAddress = adForm.querySelector('#address');
  var adDescription = adForm.querySelector('#description');
  var pageInputs = document.querySelectorAll('input');
  var pageSelects = document.querySelectorAll('select');

  var togglePageState = function (disable) {
    if (disable) {
      map.classList.add('map--faded');
      adForm.classList.add('ad-form--disabled');
      window.util.toggleElementsDisabledProperty(pageSelects, true);
      window.util.toggleElementsDisabledProperty(pageInputs, true);
      adDescription.disabled = true;

      adAddress.value = window.map.getAddress();
      window.map.removeRenderedPins();
      window.map.removePopup();
    } else if (map.classList.contains('map--faded')) {
      map.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');
      window.util.toggleElementsDisabledProperty(pageSelects);
      window.util.toggleElementsDisabledProperty(pageInputs);
      adAddress.readOnly = true;
      adDescription.disabled = false;

      adAddress.value = window.map.getAddress();
      window.map.showRenderedPins();
      window.map.addMapCardElement(0);
    }
  };

  mainPin.addEventListener('mousedown', function (evt) {
    window.util.isLeftMouseBtnEvent(evt, togglePageState);
  });
  mainPin.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, togglePageState);
  });

  togglePageState(true);

  window.togglePageState = togglePageState;
})();
