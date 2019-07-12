'use strict';

(function () {
  var ESC_KEY_CODE = 27;
  var SPACE_BAR_KEY_CODE = 32;


  var showHiddenBlock = function (block) {
    block.classList.remove('hidden');
  };

  var isEscEvent = function (evt, action) {
    if (evt.keyCode === ESC_KEY_CODE) {
      action();
    }
  };


  window.utils = {
    SPACE_BAR_KEY_CODE: SPACE_BAR_KEY_CODE,
    ESC_KEY_CODE: ESC_KEY_CODE,
    showHiddenBlock: showHiddenBlock,
    isEscEvent: isEscEvent
  };
})();
