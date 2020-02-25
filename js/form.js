'use strict';

(function () {
  var MIN_TITLE_LENGTH = 30;
  var MAX_TITLE_LENGTH = 100;
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
        minCost = 0;
        break;
      case 'flat':
        minCost = 1000;
        break;
      case 'house':
        minCost = 5000;
        break;
      case 'palace':
        minCost = 10000;
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
      window.util.toggleElementsDisabledProperty(formInputsAndSelects, true);
      adDescription.disabled = true;
    } else {
      adForm.classList.remove('ad-form--disabled');
      window.util.toggleElementsDisabledProperty(formInputsAndSelects);
      adAddress.readOnly = true;
      adDescription.disabled = false;
    }
  };

  adType.addEventListener('change', function () {
    setMinAdCost();
  });

  adRooms.addEventListener('change', function () {
    disableImpossibeCapacityOptions();
  });

  adCheckin.addEventListener('change', function () {
    setAdCheckoutTime();
  });

  adCheckout.addEventListener('change', function () {
    setAdCheckinTime();
  });

  adSubmitBtn.addEventListener('click', function () {
    validateForm();
  });

  adSubmitBtn.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, validateForm);
  });

  adResetBtn.addEventListener('click', function (evt) {
    evt.preventDefault();
    adForm.reset();
    window.map.togglePageState(true);
  });

  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(adForm), onSuccess, onError);
  });

  setMinAdCost();
  disableImpossibeCapacityOptions();

  window.toggleFormState = toggleFormState;
})();
