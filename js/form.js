'use strict';

(function () {
  var MIN_TITLE_LENGTH = 30;
  var MAX_TITLE_LENGTH = 100;
  var INVALID_FIELD_BORDER = '2px solid red';
  var MinPrice = {
    BUNGALO: 0,
    FLAT: 1000,
    HOUSE: 5000,
    PALACE: 10000
  };
  var RoomsCapacity = {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    100: [0]
  };

  var adForm = document.querySelector('.ad-form');
  var formInputsAndSelects = adForm.querySelectorAll('input, select');
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
  var adResetBtn = adForm.querySelector('.ad-form__reset');
  var successMessageTemplate = document.querySelector('#success').content.querySelector('.success');
  var errorMessageTemplate = document.querySelector('#error').content.querySelector('.error');

  var getMinAdCost = function () {
    var minCost = 0;

    switch (adType.value) {
      case 'bungalo':
        minCost = MinPrice.BUNGALO;
        break;
      case 'flat':
        minCost = MinPrice.FLAT;
        break;
      case 'house':
        minCost = MinPrice.HOUSE;
        break;
      case 'palace':
        minCost = MinPrice.PALACE;
        break;
    }

    return minCost;
  };

  var setMinAdCost = function () {
    adPrice.min = getMinAdCost();
    adPrice.placeholder = getMinAdCost();
  };

  var disableImpossibeCapacityOptions = function () {
    adGuests.innerHTML = '';
    for (var j = 0; j < adGuestsOptions.length; j++) {
      if (RoomsCapacity[adRooms.value].indexOf(+adGuestsOptions[j].value) >= 0) {
        adGuests.appendChild(adGuestsOptions[j]);
      }
    }
    adGuests.value = RoomsCapacity[adRooms.value][0];
  };

  var setAdCheckinTime = function () {
    adCheckin.value = adCheckout.value;
  };

  var setAdCheckoutTime = function () {
    adCheckout.value = adCheckin.value;
  };

  var toggleInvalidFieldBorder = function (element) {
    if (element.validity.valid) {
      element.style.border = null;
    } else {
      element.style.border = INVALID_FIELD_BORDER;
    }
  };

  var resetInvalidFieldsBorder = function () {
    formInputsAndSelects.forEach(function (it) {
      it.style.border = null;
    });
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
    toggleInvalidFieldBorder(adTitle);
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
    toggleInvalidFieldBorder(adPrice);
  };

  var validateAdGuest = function () {
    if (RoomsCapacity[adRooms.value].indexOf(+adGuests.value) === -1) {
      adGuests.setCustomValidity('Гостей слишком много для выбранного количества комнат');
    } else {
      adGuests.setCustomValidity('');
    }
    toggleInvalidFieldBorder(adGuests);
  };

  var validateCheckTime = function () {
    if (adCheckin.value !== adCheckout.value) {
      adCheckout.setCustomValidity('Время заезда и выезда должно совпадать');
    } else {
      adCheckout.setCustomValidity('');
    }
    toggleInvalidFieldBorder(adCheckin);
    toggleInvalidFieldBorder(adCheckout);
  };

  var validateForm = function () {
    validateAdGuest();
    validateCheckTime();
    validateAdTitle();
    validateAdPrice();
  };

  var onMessageEscPress = function (evt) {
    window.util.isEscEvent(evt, removeMessage);
  };

  var onMessageLeftClick = function (evt) {
    window.util.isLeftMouseBtnEvent(evt, removeMessage);
  };

  var removeMessage = function () {
    var message = document.querySelector('.submit-message');

    message.remove();
    document.removeEventListener('click', onMessageLeftClick);
    document.removeEventListener('keydown', onMessageEscPress);
  };

  var addMessageCloseHandlers = function () {
    var messageClose = document.querySelector('.error__button');

    document.addEventListener('click', onMessageLeftClick);
    document.addEventListener('keydown', onMessageEscPress);

    if (messageClose) {
      messageClose.addEventListener('keydown', function (evt) {
        window.util.isEnterEvent(evt, removeMessage);
      });
    }
  };

  var onSuccess = function () {
    var successMessageElement = successMessageTemplate.cloneNode(true);

    successMessageElement.classList.add('submit-message');
    addMessageCloseHandlers(successMessageElement);

    document.body.insertAdjacentElement('afterbegin', successMessageElement);

    adForm.reset();
    window.map.togglePageState(true);
  };

  var onError = function () {
    var errorMessageElement = errorMessageTemplate.cloneNode(true);

    errorMessageElement.classList.add('submit-message');
    addMessageCloseHandlers(errorMessageElement);

    document.body.insertAdjacentElement('afterbegin', errorMessageElement);
  };

  var toggleFormState = function (disable) {
    if (disable) {
      adForm.classList.add('ad-form--disabled');
      resetInvalidFieldsBorder();
      window.util.toggleElementsDisabledProperty(formInputsAndSelects, true);
      window.toggleImageLoadState(true);
      setMinAdCost();
      disableImpossibeCapacityOptions();
      adDescription.disabled = true;
    } else {
      adForm.classList.remove('ad-form--disabled');
      window.util.toggleElementsDisabledProperty(formInputsAndSelects);
      window.toggleImageLoadState();
      adAddress.readOnly = true;
      adDescription.disabled = false;
    }
  };

  adTitle.addEventListener('change', function () {
    validateAdTitle();
  });

  adPrice.addEventListener('change', function () {
    validateAdPrice();
  });

  adType.addEventListener('change', function () {
    setMinAdCost();
  });

  adRooms.addEventListener('change', function () {
    disableImpossibeCapacityOptions();
    validateAdGuest();
  });

  adGuests.addEventListener('change', function () {
    validateAdGuest();
  });

  adCheckin.addEventListener('change', function () {
    setAdCheckoutTime();
    validateCheckTime();
  });

  adCheckout.addEventListener('change', function () {
    setAdCheckinTime();
    validateCheckTime();
  });

  adSubmitBtn.addEventListener('click', function () {
    validateForm();
  });

  adSubmitBtn.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, validateForm);
  });

  adResetBtn.addEventListener('click', function (evt) {
    evt.preventDefault();

    if (!adForm.classList.contains('ad-form--disabled')) {
      adForm.reset();
      window.map.togglePageState(true);
    }
  });

  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();

    if (!adForm.classList.contains('ad-form--disabled')) {
      window.backend.save(new FormData(adForm), onSuccess, onError);
    }
  });

  window.toggleFormState = toggleFormState;
})();
