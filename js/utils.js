'use strict';

(function () {
  var ESC_KEY_CODE = 27;
  var SPACE_BAR_KEY_CODE = 32;


  window.utils = {
    SPACE_BAR_KEY_CODE: SPACE_BAR_KEY_CODE,
    ESC_KEY_CODE: ESC_KEY_CODE,

    showHiddenBlock: function (block) {
      block.classList.remove('hidden');
    },
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEY_CODE) {
        action();
      }
    }
  };
})();
