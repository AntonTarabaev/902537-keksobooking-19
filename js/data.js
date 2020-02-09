'use strict';

(function () {
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
  var PIN_SIZE = {
    WIDTH: 50,
    HEIGHT: 70
  };
  var OFFERS_LOCATIONS = {
    X: {
      MIN: 0 - PIN_SIZE.WIDTH / 2,
      MAX: 1200 - PIN_SIZE.WIDTH / 2,
    },
    Y: {
      MIN: 130 - PIN_SIZE.HEIGHT,
      MAX: 630 - PIN_SIZE.HEIGHT
    }
  };

  var createOffer = function (number) {
    var checksTime = OFFERS_CHECKS[window.util.getRandomInt(0, OFFERS_CHECKS.length - 1)];
    var address = {
      x: window.util.getRandomInt(OFFERS_LOCATIONS.X.MIN, OFFERS_LOCATIONS.X.MAX),
      y: window.util.getRandomInt(OFFERS_LOCATIONS.Y.MIN, OFFERS_LOCATIONS.Y.MAX)
    };
    var createdOffer = {
      author: {
        avatar: 'img/avatars/user' + (number < 10 ? '0' : '') + (number + 1) + '.png'
      },
      offer: {
        title: OFFERS_TITLES[number],
        address: address.x - PIN_SIZE.WIDTH / 2 + ', ' + (address.y - PIN_SIZE.HEIGHT),
        price: OFFERS_PRICES[number],
        type: OFFERS_TYPES[window.util.getRandomInt(0, OFFERS_TYPES.length - 1)],
        rooms: ROOMS_COUNT[number],
        guests: GUESTS_COUNT[number],
        checkin: checksTime,
        checkout: checksTime,
        features: window.util.cutArrRandomly(window.util.shuffleArr(OFFERS_FEATURES)),
        description: OFFERS_DESCRIPTIONS[number],
        photos: window.util.shuffleArr(OFFERS_PHOTOS)
      },
      location: {
        x: address.x,
        y: address.y
      },
      pin: {
        pinNumber: number
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

  window.offersArr = generateOffers(TOTAL_OFFERS);
})();
