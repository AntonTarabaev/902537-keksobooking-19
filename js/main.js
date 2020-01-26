'use strict';

var TOTAL_OFFERS = 8;
var OFFERS_OPTIONS = {
  TITLES: [
    'Квартира в глуши',
    'Дворец',
    'Большой дом',
    'Замок на холме',
    'Бунгало у моря',
    'Пристройка',
    'Маленький домик',
    'Бункер'
  ],
  PRICES: [
    500,
    1000000,
    7000,
    2000000,
    1000,
    50,
    1000,
    500000
  ],
  TYPES: [
    'palace',
    'flat',
    'house',
    'bungalo'
  ],
  ROOMS: [
    3,
    100,
    10,
    250,
    1,
    2,
    5,
    73
  ],
  GUESTS: [
    3,
    100,
    10,
    200,
    1,
    2,
    5,
    50
  ],
  CHECKS: [
    '12:00',
    '13:00',
    '14:00'
  ],
  FEATURES: [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ],
  DESCRIPTIONS: [
    'Плохая квартира',
    'Маленький дворец',
    'Хороший дом',
    'Высокий замок',
    'Уютное бунгало',
    'Великолепная пристройка',
    'Красивый домик',
    'Безопасный бункер'
  ],
  PHOTOS: [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ],
  LOCATION: {
    X: {
      MIN: 70,
      MAX: 1070,
    },
    Y: {
      MIN: 130,
      MAX: 630
    }
  }
};
var PIN_SIZE = {
  WIDTH: 40,
  HEIGHT: 40
};

var map = document.querySelector('.map');
var mapPinsArea = map.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var offersArr = [];

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var shuffleArr = function (arr) {
  var arrCopy = arr.slice();
  var rand;
  var temp;

  for (var i = arrCopy.length - 1; i > 0; i--) {
    rand = getRandomInt(0, i);
    temp = arrCopy[rand];
    arrCopy[rand] = arrCopy[i];
    arrCopy[i] = temp;
  }

  return arrCopy;
};

var cutArrRandomly = function (arr) {
  var arrCopy = arr.slice();
  var randomLength = getRandomInt(1, arrCopy.length);

  return arrCopy.slice(0, randomLength);
};

var createOffer = function (number) {
  var address = {
    x: getRandomInt(OFFERS_OPTIONS.LOCATION.X.MIN, OFFERS_OPTIONS.LOCATION.X.MAX),
    y: getRandomInt(OFFERS_OPTIONS.LOCATION.Y.MIN, OFFERS_OPTIONS.LOCATION.Y.MAX)
  };
  var createdOffer = {
    author: {
      avatar: 'img/avatars/user' + (number < 10 ? '0' : '') + (number + 1) + '.png'
    },
    offer: {
      title: OFFERS_OPTIONS.TITLES[number],
      address: address.x + ', ' + address.y,
      price: OFFERS_OPTIONS.PRICES[number],
      type: OFFERS_OPTIONS.TYPES[getRandomInt(0, OFFERS_OPTIONS.TYPES.length - 1)],
      rooms: OFFERS_OPTIONS.ROOMS[number],
      guests: OFFERS_OPTIONS.GUESTS[number],
      checkin: OFFERS_OPTIONS.CHECKS[getRandomInt(0, OFFERS_OPTIONS.CHECKS.length - 1)],
      checkout: OFFERS_OPTIONS.CHECKS[getRandomInt(0, OFFERS_OPTIONS.CHECKS.length - 1)],
      features: cutArrRandomly(shuffleArr(OFFERS_OPTIONS.FEATURES)),
      description: OFFERS_OPTIONS.DESCRIPTIONS[number],
      photos: shuffleArr(OFFERS_OPTIONS.PHOTOS)
    },
    location: {
      x: address.x - PIN_SIZE.WIDTH / 2,
      y: address.y - PIN_SIZE.HEIGHT
    }
  };

  return createdOffer;
};

for (var i = 0; i < TOTAL_OFFERS; i++) {
  offersArr[i] = createOffer(i);
}

map.classList.remove('map--faded');

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

  for (var j = 0; j < TOTAL_OFFERS; j++) {
    fragment.appendChild(renderPin(pinsInfo[j]));
  }

  return fragment;
};

mapPinsArea.appendChild(renderPins(offersArr));
