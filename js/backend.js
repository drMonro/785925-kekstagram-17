'use strict';

(function () {
  var TIMEOUT = 10000;
  var STATUS = 200;
  var DATA_URL = 'https://js.dump.academy/kekstagram/data';
  var SAVE_URL = 'https://js.dump.academy/kekstagram';

  var popup = document.querySelector('#messages').content.querySelector('.img-upload__message').cloneNode(true);


  function load(onLoad, onError, timeout, status, url) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    window.utils.mainContainer.appendChild(popup);
    xhr.addEventListener('load', function () {
      window.utils.mainContainer.removeChild(popup);
      if (xhr.status === status) {
        onLoad(xhr.response);
      } else {
        onError('Данные не загрузились. Причина: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Попытка возобновить соеденениe');
      load(onLoad, onError, timeout, status, url);
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = timeout;

    xhr.open('GET', url);
    xhr.send();
  }

  function save(data, onLoad, onError, timeout, status, url) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = timeout;

    xhr.addEventListener('load', function () {
      if (xhr.status === status) {
        onLoad();
      } else {
        onError('Данные не сохранились. Причина: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.open('POST', url);
    xhr.send(data);
  }

  window.backend = {
    load: load,
    save: save,
    TIMEOUT: TIMEOUT,
    STATUS: STATUS,
    DATA_URL: DATA_URL,
    SAVE_URL: SAVE_URL,
  };
})();
