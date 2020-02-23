'use strict';

(function () {
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var adAddress = adForm.querySelector('#address');
  var adDescription = adForm.querySelector('#description');
  var formInputsAndSelects = adForm.querySelectorAll('input, select');

  var onSuccess = function (offers) {
    window.filter.activateFilter(offers);
    window.map.showRenderedPins();
    window.map.addMapCardElement(0);
  };
  var onError = function (errorMessage) {
    var node = document.createElement('div');

    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  var togglePageState = function (disable) {
    if (disable) {
      map.classList.add('map--faded');
      adForm.classList.add('ad-form--disabled');
      window.util.toggleElementsDisabledProperty(formInputsAndSelects, true);
      adDescription.disabled = true;

      window.drag.resetPinCoords();
      window.map.removePopup();
      window.map.removeRenderedPins();
      window.filter.resetFilter();
    } else if (map.classList.contains('map--faded')) {
      map.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');
      window.util.toggleElementsDisabledProperty(formInputsAndSelects);
      adAddress.readOnly = true;
      adDescription.disabled = false;

      window.backend.load(onSuccess, onError);
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
