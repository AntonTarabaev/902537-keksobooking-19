'use strict';

(function () {
  var offerCardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var photoTemplate = offerCardTemplate.querySelector('.popup__photo');
  var TypesMap = {
    PALACE: 'Дворец',
    FLAT: 'Квартира',
    HOUSE: 'Дом',
    BUNGALO: 'Бунгало'
  };

  var renderFeature = function (feature) {
    var featureElement = document.createElement('li');

    featureElement.className = 'popup__feature popup__feature--' + feature;

    return featureElement;
  };

  var renderFeatures = function (offerInfo) {
    var features = document.createDocumentFragment();

    for (var j = 0; j < offerInfo.offer.features.length; j++) {
      features.appendChild(renderFeature(offerInfo.offer.features[j]));
    }

    return features;
  };

  var renderPhoto = function (photoSrc) {
    var photoElement = photoTemplate.cloneNode(true);

    photoElement.src = photoSrc;

    return photoElement;
  };

  var renderPhotos = function (offerInfo) {
    var photos = document.createDocumentFragment();

    for (var j = 0; j < offerInfo.offer.photos.length; j++) {
      photos.appendChild(renderPhoto(offerInfo.offer.photos[j]));
    }

    return photos;
  };

  var renderOffer = function (offerInfo) {
    var offerElement = offerCardTemplate.cloneNode(true);

    offerElement.querySelector('.popup__title').textContent = offerInfo.offer.title;
    offerElement.querySelector('.popup__text--address').textContent = offerInfo.offer.address;
    offerElement.querySelector('.popup__text--price').textContent = offerInfo.offer.price + '₽/ночь';
    offerElement.querySelector('.popup__type').textContent = TypesMap[offerInfo.offer.type.toUpperCase()];
    offerElement.querySelector('.popup__text--capacity').textContent = offerInfo.offer.rooms + ' комнаты для ' + offerInfo.offer.guests + ' гостей';
    offerElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + offerInfo.offer.checkin + ' выезд до ' + offerInfo.offer.checkout;
    offerElement.querySelector('.popup__features').innerHTML = '';
    offerElement.querySelector('.popup__features').appendChild(renderFeatures(offerInfo));
    offerElement.querySelector('.popup__description').textContent = offerInfo.offer.description;
    offerElement.querySelector('.popup__photos').innerHTML = '';
    offerElement.querySelector('.popup__photos').appendChild(renderPhotos(offerInfo));
    offerElement.querySelector('.popup__avatar').src = offerInfo.author.avatar;

    return offerElement;
  };

  var renderOffers = function (offersInfo) {
    var renderedOffers = [];

    for (var i = 0; i < window.offersArr.length; i++) {
      renderedOffers[i] = renderOffer(offersInfo[i]);
    }

    return renderedOffers;
  };

  window.offersCards = renderOffers(window.offersArr);
})();
