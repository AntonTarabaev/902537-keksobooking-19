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

  mapPinsArea.addEventListener('click', onMapPinClick);
  mapPinsArea.addEventListener('keydown', onMapPinEnterPress);

  window.map = {
    showRenderedPins: function () {
      var renderedPins = window.renderedPins.cloneNode(true);
      mapPinsArea.appendChild(renderedPins);
    },
    removeRenderedPins: function () {
      var renderedPins = mapPinsArea.querySelectorAll('.map__pin:not(.map__pin--main)');

      for (var i = 0; i < renderedPins.length; i++) {
        renderedPins[i].remove();
      }
    },
    removePopup: removePopup,
    addMapCardElement: addMapCardElement
  };
})();
