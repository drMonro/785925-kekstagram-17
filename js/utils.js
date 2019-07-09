'use strict';

(function () {
  var ESC_KEY_CODE = 27;
  var SPACE_BAR_KEY_CODE = 32;
  var commentInputFocusStatus = false;
  var tagInputFocusStatus = false;


  var openPopup = function (popup) {
    popup.classList.remove('hidden');
    var closeButton = document.querySelector('.cancel');
    document.addEventListener('keydown', function (evt) {
      closeOnPressKey(evt, popup);
    });
    closeButton.addEventListener('keydown', function (evt) {
      closeOnPressKey(evt, popup);
    });

    closeButton.addEventListener('click', function () {
      closePopup(popup);
    });
  };

  var closeOnPressKey = function (evt, popup) {
    var closingKeyCode = ESC_KEY_CODE;
    if (evt.keyCode === closingKeyCode && !commentInputFocusStatus && !tagInputFocusStatus) {
      closePopup(popup);
    }
  };

  var closePopup = function (popup) {

    popup.classList.add('hidden');
    window.form.imageEditorForm.reset();

    document.removeEventListener('keydown', function (evt) {
      closeOnPressKey(evt, popup);
    });

  };

  window.form.commentInput.addEventListener('focus', function () {
    commentInputFocusStatus = true;
  });

  window.form.commentInput.addEventListener('focusout', function () {
    commentInputFocusStatus = false;
  });

  window.form.hashTagsInput.addEventListener('focus', function () {
    tagInputFocusStatus = true;
  });

  window.form.hashTagsInput.addEventListener('focusout', function () {
    tagInputFocusStatus = false;
  });


  window.utils = {
    SPACE_BAR_KEY_CODE: SPACE_BAR_KEY_CODE,
    ESC_KEY_CODE: ESC_KEY_CODE,
    openPopup: openPopup,
    closePopup: closePopup,
  };
})();
