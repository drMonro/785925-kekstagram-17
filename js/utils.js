'use strict';

(function () {
  var ESC_KEY_CODE = 27;
  var SPACE_BAR_KEY_CODE = 32;
  var commentInputFocusStatus = false;
  var tagInputFocusStatus = false;
  var hashTagsInput = document.querySelector('.text__hashtags');
  var commentsInput = document.querySelector('.text__description');


  var showHiddenBlock = function (block) {
    block.classList.remove('hidden');
  };

  var invokeIfEscEvent = function (evt, action) {
    if (evt.keyCode === ESC_KEY_CODE && !commentInputFocusStatus && !tagInputFocusStatus) {
      action();
    }
  };

  hashTagsInput.addEventListener('focus', function () {
    tagInputFocusStatus = true;
  });

  hashTagsInput.addEventListener('focusout', function () {
    tagInputFocusStatus = false;
  });

  commentsInput.addEventListener('focus', function () {
    commentInputFocusStatus = true;
  });

  commentsInput.addEventListener('focusout', function () {
    commentInputFocusStatus = false;
  });

  window.utils = {
    SPACE_BAR_KEY_CODE: SPACE_BAR_KEY_CODE,
    ESC_KEY_CODE: ESC_KEY_CODE,
    showHiddenBlock: showHiddenBlock,
    invokeIfEscEvent: invokeIfEscEvent,
    hashTagsInput: hashTagsInput,
    commentsInput: commentsInput
  };
})();
