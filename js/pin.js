'use strict';

(function () {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var renderPin = function (pinInfo, number) {
    var pinElement = pinTemplate.cloneNode(true);

    pinElement.style.left = pinInfo.location.x + 'px';
    pinElement.style.top = pinInfo.location.y + 'px';
    pinElement.querySelector('img').src = pinInfo.author.avatar;
    pinElement.querySelector('img').alt = pinInfo.offer.title;
    pinElement.dataset.number = number;

    return pinElement;
  };

  var renderPins = function (pinsInfo) {
    var fragment = document.createDocumentFragment();

    pinsInfo.forEach(function (item, index) {
      if (item.offer) {
        fragment.appendChild(renderPin(item, index));
      }
    });

    return fragment;
  };

  window.renderPins = renderPins;
})();
