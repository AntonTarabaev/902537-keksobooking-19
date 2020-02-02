'use strict';

var TOTAL_OFFERS = 8;
var OFFERS_TITLES = [
  'Квартира в глуши',
  'Дворец',
  'Большой дом',
  'Замок на холме',
  'Бунгало у моря',
  'Пристройка',
  'Маленький домик',
  'Бункер'
];
var OFFERS_PRICES = [
  500,
  1000000,
  7000,
  2000000,
  1000,
  50,
  1000,
  500000
];
var OFFERS_TYPES = [
  'palace',
  'flat',
  'house',
  'bungalo'
];
var ROOMS_COUNT = [
  3,
  100,
  10,
  250,
  1,
  2,
  5,
  73
];
var GUESTS_COUNT = [
  3,
  100,
  10,
  200,
  1,
  2,
  5,
  50
];
var OFFERS_CHECKS = [
  '12:00',
  '13:00',
  '14:00'
];
var OFFERS_FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];
var OFFERS_DESCRIPTIONS = [
  'Плохая квартира',
  'Маленький дворец',
  'Хороший дом',
  'Высокий замок',
  'Уютное бунгало',
  'Великолепная пристройка',
  'Красивый домик',
  'Безопасный бункер'
];
var OFFERS_PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var OFFERS_LOCATIONS = {
  X: {
    MIN: 70,
    MAX: 1070,
  },
  Y: {
    MIN: 130,
    MAX: 630
  }
};
var PIN_SIZE = {
  WIDTH: 40,
  HEIGHT: 40
};
var MAIN_PIN_PIZE = {
  WIDTH: 62,
  HEIGHT: 62,
  LEG: 22
};
var MIN_TITLE_LENGTH = 30;
var MAX_TITLE_LENGTH = 100;

var map = document.querySelector('.map');
var mapPinsArea = map.querySelector('.map__pins');
var mainPin = mapPinsArea.querySelector('.map__pin--main');
// var mapFilters = map.querySelector('.map__filters-container');
var adForm = document.querySelector('.ad-form');
var adTitle = adForm.querySelector('#title');
var adAddress = adForm.querySelector('#address');
var adType = adForm.querySelector('#type');
var adPrice = adForm.querySelector('#price');
var adRooms = adForm.querySelector('#room_number');
var adGuests = adForm.querySelector('#capacity');
var adGuestsOptions = adGuests.querySelectorAll('option');
var adCheckin = adForm.querySelector('#timein');
var adCheckout = adForm.querySelector('#timeout');
var adDescription = adForm.querySelector('#description');
var adSubmitBtn = adForm.querySelector('.ad-form__submit');
var pageInputs = document.querySelectorAll('input');
var pageSelects = document.querySelectorAll('select');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var RoomsCapacity = {
  1: [1],
  2: [1, 2],
  3: [1, 2, 3],
  100: [0]
};
// var offerCardTemplate = document.querySelector('#card').content.querySelector('.map__card');
// var photoTemplate = offerCardTemplate.querySelector('.popup__photo');
// var TypesMap = {
//   PALACE: 'Дворец',
//   FLAT: 'Квартира',
//   HOUSE: 'Дом',
//   BUNGALO: 'Бунгало'
// };

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var shuffleArr = function (arr) {
  return arr.sort(function () {
    return Math.random() - 0.5;
  });
};

var cutArrRandomly = function (arr) {
  return arr.slice(0, getRandomInt(1, arr.length));
};

var createOffer = function (number) {
  var address = {
    x: getRandomInt(OFFERS_LOCATIONS.X.MIN, OFFERS_LOCATIONS.X.MAX),
    y: getRandomInt(OFFERS_LOCATIONS.Y.MIN, OFFERS_LOCATIONS.Y.MAX)
  };
  var createdOffer = {
    author: {
      avatar: 'img/avatars/user' + (number < 10 ? '0' : '') + (number + 1) + '.png'
    },
    offer: {
      title: OFFERS_TITLES[number],
      address: address.x + ', ' + address.y,
      price: OFFERS_PRICES[number],
      type: OFFERS_TYPES[getRandomInt(0, OFFERS_TYPES.length - 1)],
      rooms: ROOMS_COUNT[number],
      guests: GUESTS_COUNT[number],
      checkin: OFFERS_CHECKS[getRandomInt(0, OFFERS_CHECKS.length - 1)],
      checkout: OFFERS_CHECKS[getRandomInt(0, OFFERS_CHECKS.length - 1)],
      features: cutArrRandomly(shuffleArr(OFFERS_FEATURES)),
      description: OFFERS_DESCRIPTIONS[number],
      photos: shuffleArr(OFFERS_PHOTOS)
    },
    location: {
      x: address.x - PIN_SIZE.WIDTH / 2,
      y: address.y - PIN_SIZE.HEIGHT
    }
  };

  return createdOffer;
};

var generateOffers = function (totalOffers) {
  var offersArr = [];

  for (var i = 0; i < totalOffers; i++) {
    offersArr[i] = createOffer(i);
  }

  return offersArr;
};

var renderPin = function (pinInfo) {
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.style.left = pinInfo.location.x + 'px';
  pinElement.style.top = pinInfo.location.y + 'px';
  pinElement.querySelector('img').src = pinInfo.author.avatar;
  pinElement.querySelector('img').alt = pinInfo.offer.title;

  return pinElement;
};

var renderPins = function (pinsInfo) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < TOTAL_OFFERS; i++) {
    fragment.appendChild(renderPin(pinsInfo[i]));
  }

  return fragment;
};

var disableAllArrElements = function (arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i].disabled = true;
  }
};

var enableAllArrElements = function (arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i].disabled = false;
  }
};

var getAddress = function (pin, xOffset, yOffset) {
  return (parseInt(pin.style.left, 10) + xOffset) + ', ' + (parseInt(pin.style.top, 10) + yOffset);
};

var removeRenderedPins = function () {
  var renderedPins = mapPinsArea.querySelectorAll('.map__pin:not(.map__pin--main)');

  for (var i = 0; i < renderedPins.length; i++) {
    renderedPins[i].remove();
  }
};

var disablePage = function () {
  map.classList.add('map--faded');
  adForm.classList.add('ad-form--disabled');
  disableAllArrElements(pageSelects);
  disableAllArrElements(pageInputs);
  adDescription.disabled = true;
  adAddress.value = getAddress(mainPin, MAIN_PIN_PIZE.WIDTH / 2, MAIN_PIN_PIZE.HEIGHT / 2);

  removeRenderedPins();
};

var activatePage = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  enableAllArrElements(pageSelects);
  enableAllArrElements(pageInputs);
  adDescription.disabled = false;

  mapPinsArea.appendChild(renderPins(offersArr));
};

var updateAddress = function () {
  adAddress.value = getAddress(mainPin, MAIN_PIN_PIZE.WIDTH / 2, MAIN_PIN_PIZE.HEIGHT + MAIN_PIN_PIZE.LEG);
};

var getMinAdCost = function () {
  switch (adType.value) {
    case 'bungalo':
      adPrice.min = 0;
      adPrice.placeholder = '0';
      break;
    case 'flat':
      adPrice.min = 1000;
      adPrice.placeholder = '1000';
      break;
    case 'house':
      adPrice.min = 5000;
      adPrice.placeholder = '5000';
      break;
    case 'palace':
      adPrice.min = 10000;
      adPrice.placeholder = '10000';
      break;
  }
};

var disableImpossibeCapacityOptions = function () {
  while (adGuests.firstChild) {
    adGuests.removeChild(adGuests.firstChild);
  }
  for (var j = 0; j < adGuestsOptions.length; j++) {
    if (RoomsCapacity[adRooms.value].indexOf(+adGuestsOptions[j].value) >= 0) {
      adGuests.appendChild(adGuestsOptions[j]);
    }
  }
  adGuests.value = RoomsCapacity[adRooms.value][0];
};

var getAdCheckinTime = function () {
  adCheckin.value = adCheckout.value;
};

var getAdCheckoutTime = function () {
  adCheckout.value = adCheckin.value;
};

var validateAdTitle = function () {
  if (adTitle.validity.tooShort) {
    adTitle.setCustomValidity('Заголовок объявления должен состоять минимум из ' + MIN_TITLE_LENGTH + ' символов');
  } else if (adTitle.validity.tooLong) {
    adTitle.setCustomValidity('Заголовок объявления не должен превышать ' + MAX_TITLE_LENGTH + ' символов');
  } else if (adTitle.validity.valueMissing) {
    adTitle.setCustomValidity('Обязательное поле');
  } else {
    adTitle.setCustomValidity('');
  }
};

var validateAdPrice = function () {
  if (adPrice.validity.rangeUnderflow) {
    adPrice.setCustomValidity('Цена за ночь должна быть больше ' + adPrice.min);
  } else if (adPrice.validity.rangeOverflow) {
    adPrice.setCustomValidity('Цена за ночь должна быть меньше ' + adPrice.max);
  } else if (adPrice.validity.stepMismatch) {
    adPrice.setCustomValidity('Введите целое значение');
  } else if (adPrice.validity.valueMissing) {
    adPrice.setCustomValidity('Обязательное поле');
  } else {
    adPrice.setCustomValidity('');
  }
};

var validateAdGuest = function () {
  if (RoomsCapacity[adRooms.value].indexOf(+adGuests.value) === -1) {
    adGuests.setCustomValidity('Гостей слишком много для выбранного количества комнат');
  } else {
    adGuests.setCustomValidity('');
  }
};

var validateCheckTime = function () {
  if (adCheckin.value !== adCheckout.value) {
    adCheckout.setCustomValidity('Время заезда и выезда должно совпадать');
  } else {
    adCheckout.setCustomValidity('');
  }
};

mainPin.addEventListener('mousedown', function (evt) {
  if (evt.button === 0) {
    activatePage();
    updateAddress();
  }
});

mainPin.addEventListener('keydown', function (evt) {
  if (evt.key === 'Enter') {
    activatePage();
    updateAddress();
  }
});

adType.addEventListener('change', function () {
  getMinAdCost();
});

adRooms.addEventListener('change', function () {
  disableImpossibeCapacityOptions();
});

adCheckin.addEventListener('change', function () {
  getAdCheckoutTime();
});

adCheckout.addEventListener('change', function () {
  getAdCheckinTime();
});

adTitle.addEventListener('invalid', function () {
  validateAdTitle();
});

adPrice.addEventListener('invalid', function () {
  validateAdPrice();
});

adSubmitBtn.addEventListener('click', function () {
  validateAdGuest();
  validateCheckTime();
});

disablePage();
getMinAdCost();
disableImpossibeCapacityOptions();

adAddress.readOnly = true;
var offersArr = generateOffers(TOTAL_OFFERS);

// var renderFeature = function (feature) {
//   var featureElement = document.createElement('li');

//   featureElement.className = 'popup__feature popup__feature--' + feature;

//   return featureElement;
// };

// var renderFeatures = function (offerInfo) {
//   var features = document.createDocumentFragment();

//   for (var j = 0; j < offerInfo.offer.features.length; j++) {
//     features.appendChild(renderFeature(offerInfo.offer.features[j]));
//   }

//   return features;
// };

// var renderPhoto = function (photoSrc) {
//   var photoElement = photoTemplate.cloneNode(true);

//   photoElement.src = photoSrc;

//   return photoElement;
// };

// var renderPhotos = function (offerInfo) {
//   var photos = document.createDocumentFragment();

//   for (var j = 0; j < offerInfo.offer.photos.length; j++) {
//     photos.appendChild(renderPhoto(offerInfo.offer.photos[j]));
//   }

//   return photos;
// };

// var renderOffer = function (offerInfo) {
//   var offerElement = offerCardTemplate.cloneNode(true);

//   offerElement.querySelector('.popup__title').textContent = offerInfo.offer.title;
//   offerElement.querySelector('.popup__text--address').textContent = offerInfo.offer.address;
//   offerElement.querySelector('.popup__text--price').textContent = offerInfo.offer.price + '₽/ночь';
//   offerElement.querySelector('.popup__type').textContent = TypesMap[offerInfo.offer.type.toUpperCase()];
//   offerElement.querySelector('.popup__text--capacity').textContent = offerInfo.offer.rooms + ' комнаты для ' + offerInfo.offer.guests + ' гостей';
//   offerElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + offerInfo.offer.checkin + ' выезд до ' + offerInfo.offer.checkout;
//   offerElement.querySelector('.popup__features').innerHTML = '';
//   offerElement.querySelector('.popup__features').appendChild(renderFeatures(offerInfo));
//   offerElement.querySelector('.popup__description').textContent = offerInfo.offer.description;
//   offerElement.querySelector('.popup__photos').innerHTML = '';
//   offerElement.querySelector('.popup__photos').appendChild(renderPhotos(offerInfo));
//   offerElement.querySelector('.popup__avatar').src = offerInfo.author.avatar;

//   return offerElement;
// };
// mapFilters.insertAdjacentElement('beforebegin', renderOffer(offersArr[0]));
