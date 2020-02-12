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

  window.renderPins = function (pinsInfo) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < pinsInfo.length; i++) {
      if (pinsInfo[i].offer) {
        fragment.appendChild(renderPin(pinsInfo[i], i));
      }
    }

    return fragment;
  };
})();
