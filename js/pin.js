'use strict';

(function () {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var renderPin = function (pinInfo) {
    var pinElement = pinTemplate.cloneNode(true);

    pinElement.style.left = pinInfo.location.x + 'px';
    pinElement.style.top = pinInfo.location.y + 'px';
    pinElement.querySelector('img').src = pinInfo.author.avatar;
    pinElement.querySelector('img').alt = pinInfo.offer.title;
    pinElement.dataset.number = pinInfo.pin.pinNumber;

    return pinElement;
  };

  var renderPins = function (pinsInfo) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < window.offersArr.length; i++) {
      fragment.appendChild(renderPin(pinsInfo[i]));
    }

    return fragment;
  };

  window.renderedPins = renderPins(window.offersArr);
})();
