'use strict';

(function () {
  var backend = {
    load: function (onSuccess, onError) {
      var URL = 'https://js.dump.academy/kekstagram/data';
      createRequest('GET', URL, onSuccess, onError);
    },

    save: function (data, onSuccess, onError) {
      var URL = 'https://js.dump.academy/kekstagram';
      createRequest('POST', URL, onSuccess, onError, data);
    },
  };

  var createRequest = function (method, url, onSuccess, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = 10000;
    xhr.open(method, url);
    xhr.send(data);
  };


  window.backend = backend;
})();
