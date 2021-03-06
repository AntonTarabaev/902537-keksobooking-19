'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking';
  var TIMEOUT_IN_MS = 10000;
  var ErrorMessage = {
    CONNECTION_ERROR: 'Произошла ошибка соединения. Попробуйте обновить страницу.',
    TIMEOUT_ERROR: 'Превышено время ожидания. Попробуйте обновить страницу.',
    UNKNOWN_ERROR: 'Произошла неизвестная ошибка. Попробуйте обновить страницу.',
    NOT_FOUND: 'Страница не найдена. Проверьте запрос.',
    SERVICE_UNAVAILABLE: 'Сервер недоступен. Попробуйте позже.'
  };
  var StatusCode = {
    OK: 200,
    NOT_FOUND: 404,
    SERVICE_UNAVAILABLE: 503
  };

  var onXhrLoad = function (xhr, onLoad, onError) {
    if (xhr.status === StatusCode.OK) {
      onLoad(xhr.response);
    } else if (xhr.status === StatusCode.NOT_FOUND) {
      onError(ErrorMessage.NOT_FOUND);
    } else if (xhr.status === StatusCode.SERVICE_UNAVAILABLE) {
      onError(ErrorMessage.SERVICE_UNAVAILABLE);
    } else {
      onError(ErrorMessage.UNKNOWN_ERROR + ' Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
    }
  };

  var addXhrListeners = function (xhr, onLoad, onError) {
    xhr.addEventListener('load', function () {
      onXhrLoad(xhr, onLoad, onError);
    });
    xhr.addEventListener('error', function () {
      onError(ErrorMessage.CONNECTION_ERROR);
    });
    xhr.addEventListener('timeout', function () {
      onError(ErrorMessage.TIMEOUT_ERROR);
    });
  };

  var load = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    addXhrListeners(xhr, onLoad, onError);

    xhr.timeout = TIMEOUT_IN_MS;

    xhr.open('GET', URL + '/data');
    xhr.send();
  };

  var save = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    addXhrListeners(xhr, onLoad, onError);

    xhr.timeout = TIMEOUT_IN_MS;

    xhr.open('POST', URL);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    save: save
  };
})();
