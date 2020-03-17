'use strict';

(function () {
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

  var filterByType = function (item) {
    return typeFilter.value === 'any' ? true : typeFilter.value === item.offer['type'];
  };

  var filterByPrice = function (item) {
    var price = PriceRange[priceFilter.value.toUpperCase()];
    return price ? item.offer.price >= price.MIN && item.offer.price <= price.MAX : true;
  };

  var filterByRooms = function (item) {
    return roomsFilter.value === 'any' ? true : roomsFilter.value === item.offer['rooms'].toString();
  };

  var filterByGuests = function (item) {
    return guestsFilter.value === 'any' ? true : guestsFilter.value === item.offer['guests'].toString();
  };

  var filterByFeatures = function (item) {
    var selectedFeatures = Array.from(featuresFilter.querySelectorAll('input:checked'));

    return selectedFeatures.every(function (element) {
      return item.offer.features.includes(element.value);
    });
  };

  var onFilterChange = window.util.debounce(function () {
    var filteredData = [];

    for (var i = 0; i < data.length; i++) {
      if (filteredData.length === 5) {
        break;
      } else if (filterByPrice(data[i]) && filterByType(data[i]) && filterByRooms(data[i]) && filterByGuests(data[i]) && filterByFeatures(data[i])) {
        filteredData.push(data[i]);
      }
    }
    window.map.removePopup();
    window.map.removePins();
    window.map.updateOffers(filteredData);
    if (filteredData.length > 0) {
      window.map.showPins();
    }
  });

  var filtrate = function () {
    window.util.toggleElementsDisabledProperty(filterFields);
    filter.addEventListener('change', onFilterChange);
  };

  var activateFilter = function (offers) {
    data = offers;
    filtrate();
  };

  var resetFilter = function () {
    window.util.toggleElementsDisabledProperty(filterFields, true);
    filterSelects.forEach(function (select) {
      select.value = 'any';
    });
    filterInputs.forEach(function (input) {
      input.checked = false;
    });
  };

  window.filter = {
    activate: activateFilter,
    reset: resetFilter
  };
})();
