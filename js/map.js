'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPinsArea = map.querySelector('.map__pins');
  var mapFilters = map.querySelector('.map__filters-container');

  var onPopupEscPress = function (evt) {
    window.util.isEscEvent(evt, removePopup);
  };

  var removePopup = function () {
    var mapCard = map.querySelector('.map__card');
    var activePin = mapPinsArea.querySelector('.map__pin--active');
    if (mapCard !== null) {
      mapCard.remove();
      activePin.classList.remove('map__pin--active');
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
    mapPinsArea.querySelector('[data-number="' + number + '"]').classList.add('map__pin--active');
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

  mapPinsArea.addEventListener('click', onMapPinClick);
  mapPinsArea.addEventListener('keydown', onMapPinEnterPress);

  window.map = {
    showRenderedPins: function () {
      mapPinsArea.appendChild(window.renderedPins);
    },
    removeRenderedPins: function () {
      var renderedPins = mapPinsArea.querySelectorAll('.map__pin:not(.map__pin--main)');

      renderedPins.forEach(function (item) {
        item.remove();
      });
    },
    removePopup: removePopup,
    addMapCardElement: addMapCardElement
  };
})();
