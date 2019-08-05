'use strict';

(function () {
  var TIMEOUT = 10000;
  var SUCCESS_STATUS = 200;
  var DATA_URL = 'https://js.dump.academy/kekstagram/data';
  var SAVE_URL = 'https://js.dump.academy/kekstagram';
  var DEBOUNCE_INTERVAL = 500;
  var GET_METHOD = 'GET';
  var POST_METHOD = 'POST';


  var load = function (onSuccess, onError) {
    sendRequest(GET_METHOD, DATA_URL, onSuccess, onError);
  };

  var save = function (data, onSuccess, onError) {
    sendRequest(POST_METHOD, SAVE_URL, onSuccess, onError, data);
  };

  var sendRequest = function (method, url, onSuccess, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    if (method === 'GET') {
      window.utils.showLoadingPopup();
    }

    xhr.addEventListener('load', function () {
      if (method === 'GET') {
        window.utils.hideLoadingPopup();
      }
      if (xhr.status === SUCCESS_STATUS) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Попытка возобновить соединениe');
      if (method === 'GET') {
        load(onSuccess, onError, url);
      }
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;
    xhr.open(method, url);
    xhr.send(data);
  };

  var debounce = function (cb) {
    var lastTimeout = null;
    var interval = DEBOUNCE_INTERVAL;
    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb.apply(null, parameters);
      }, interval);
    };
  };


  window.backend = {
    load: load,
    save: save,
    debounce: debounce
  };
})();
