'use strict';

(function () {
  var OFFERS_LIMIT = 5;
  var PriceRange = {
    LOW: {
      MIN: 0,
      MAX: 9999
    },
    MIDDLE: {
      MIN: 10000,
      MAX: 50000
    },
    HIGH: {
      MIN: 50001,
      MAX: Infinity
    }
  };

  var filter = document.querySelector('.map__filters');
  var filterFields = filter.querySelectorAll('select, input');
  var filterSelects = filter.querySelectorAll('select');
  var filterInputs = filter.querySelectorAll('input');
  var typeFilter = filter.querySelector('#housing-type');
  var priceFilter = filter.querySelector('#housing-price');
  var roomsFilter = filter.querySelector('#housing-rooms');
  var guestsFilter = filter.querySelector('#housing-guests');
  var featuresFilter = filter.querySelector('#housing-features');
  var data = [];
  var filteredData = [];

  var filterByProperty = function (it, item, key) {
    return it.value === 'any' ? true : it.value === item[key].toString();
  };

  var filterByType = function (item) {
    return filterByProperty(typeFilter, item.offer, 'type');
  };

  var filterByPrice = function (item) {
    var price = PriceRange[priceFilter.value.toUpperCase()];
    return price ? item.offer.price >= price.MIN && item.offer.price <= price.MAX : true;
  };

  var filterByRooms = function (item) {
    return filterByProperty(roomsFilter, item.offer, 'rooms');
  };

  var filterByGuests = function (item) {
    return filterByProperty(guestsFilter, item.offer, 'guests');
  };

  var filterByFeatures = function (item) {
    var selectedFeatures = Array.from(featuresFilter.querySelectorAll('input:checked'));

    return selectedFeatures.every(function (element) {
      return item.offer.features.includes(element.value);
    });
  };

  var updateOffers = function (offersData) {
    window.renderedPins = window.renderPins(offersData.slice(0, OFFERS_LIMIT));
    window.offersCards = window.renderOffers(offersData.slice(0, OFFERS_LIMIT));
  };

  var onFilterChange = window.util.debounce(function () {
    filteredData = data
      .filter(filterByType)
      .filter(filterByPrice)
      .filter(filterByRooms)
      .filter(filterByGuests)
      .filter(filterByFeatures);
    window.map.removePopup();
    window.map.removeRenderedPins();
    updateOffers(filteredData);
    if (filteredData.length > 0) {
      window.map.showRenderedPins();
      window.map.addMapCardElement(0);
    }
  });

  var filtrate = function () {
    window.util.toggleElementsDisabledProperty(filterFields);
    updateOffers(data);
    filter.addEventListener('change', onFilterChange);
  };

  window.filter = {
    activateFilter: function (offers) {
      data = offers;
      filtrate();
    },
    resetFilter: function () {
      window.util.toggleElementsDisabledProperty(filterFields, true);
      filterSelects.forEach(function (select) {
        select.value = 'any';
      });
      filterInputs.forEach(function (input) {
        input.checked = false;
      });
      updateOffers(data);
    }
  };
})();
