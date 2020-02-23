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

    offerInfo.offer.features.forEach(function (item) {
      features.appendChild(renderFeature(item));
    });

    return features;
  };

  var renderPhoto = function (photoSrc) {
    var photoElement = photoTemplate.cloneNode(true);

    photoElement.src = photoSrc;

    return photoElement;
  };

  var renderPhotos = function (offerInfo) {
    var photos = document.createDocumentFragment();

    offerInfo.offer.photos.forEach(function (item) {
      photos.appendChild(renderPhoto(item));
    });

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
    if (offerInfo.offer.features.length === 0) {
      offerElement.querySelector('.popup__features').remove();
    } else {
      offerElement.querySelector('.popup__features').innerHTML = '';
      offerElement.querySelector('.popup__features').appendChild(renderFeatures(offerInfo));
    }
    offerElement.querySelector('.popup__description').textContent = offerInfo.offer.description;
    if (offerInfo.offer.photos.length === 0) {
      offerElement.querySelector('.popup__photos').remove();
    } else {
      offerElement.querySelector('.popup__photos').innerHTML = '';
      offerElement.querySelector('.popup__photos').appendChild(renderPhotos(offerInfo));
    }
    offerElement.querySelector('.popup__avatar').src = offerInfo.author.avatar;

    return offerElement;
  };

  window.renderOffers = function (offersInfo) {
    var renderedOffers = [];

    offersInfo.forEach(function (item, index) {
      if (item.offer) {
        renderedOffers[index] = renderOffer(item);
      }
    });

    return renderedOffers;
  };
})();
