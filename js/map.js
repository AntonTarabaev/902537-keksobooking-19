'use strict';

(function () {
  var OFFERS_LIMIT = 5;

  var map = document.querySelector('.map');
  var mapPinsArea = map.querySelector('.map__pins');
  var mainPin = map.querySelector('.map__pin--main');
  var mapFilters = map.querySelector('.map__filters-container');
  var renderedPins;
  var offersCards;

  var updateOffers = function (offersData) {
    renderedPins = window.renderPins(offersData.slice(0, OFFERS_LIMIT));
    offersCards = window.renderOffers(offersData.slice(0, OFFERS_LIMIT));
  };

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
    mapFilters.insertAdjacentElement('beforebegin', offersCards[number]);
    addPopupCloseHandlers();
  };

  var showPins = function () {
    mapPinsArea.appendChild(renderedPins);
  };

  var removePins = function () {
    var pins = mapPinsArea.querySelectorAll('.map__pin:not(.map__pin--main)');

    pins.forEach(function (item) {
      item.remove();
    });
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

  var onSuccess = function (offers) {
    updateOffers(offers);
    window.filter.activateFilter(offers);
    showPins();
    addMapCardElement(0);
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

  var toggleMapState = function (disable) {
    if (disable) {
      map.classList.add('map--faded');
      removePopup();
      removePins();

      window.drag.resetPinCoords();
      window.filter.resetFilter();
    } else {
      map.classList.remove('map--faded');

      window.backend.load(onSuccess, onError);
    }
  };

  var togglePageState = function (disable) {
    if (disable) {
      toggleMapState(true);
      window.toggleFormState(true);
    } else if (map.classList.contains('map--faded')) {
      toggleMapState();
      window.toggleFormState();
    }
  };

  mapPinsArea.addEventListener('click', onMapPinClick);
  mapPinsArea.addEventListener('keydown', onMapPinEnterPress);

  mainPin.addEventListener('mousedown', function (evt) {
    window.util.isLeftMouseBtnEvent(evt, togglePageState);
  });
  mainPin.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, togglePageState);
  });

  togglePageState(true);

  window.map = {
    showPins: showPins,
    removePins: removePins,
    removePopup: removePopup,
    updateOffers: updateOffers,
    togglePageState: togglePageState
  };
})();
