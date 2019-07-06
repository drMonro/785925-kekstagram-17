'use strict';

(function () {
  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

  var loadPhotoArray = function (data) {
    var picturesSection = document.querySelector('.pictures');
    picturesSection.appendChild(window.gallery.addPictures(data));
  };

  var createAndShowErrorMessage = function (errorMessage) {
    var errorBlock = document.createElement('div');
    errorBlock.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    errorBlock.style.position = 'absolute';
    errorBlock.style.left = 0;
    errorBlock.style.right = 0;
    errorBlock.style.fontSize = '30px';
    errorBlock.style.height = '30px';
    errorBlock.style.borderBottom = '4px solid yellow';
    errorBlock.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', errorBlock);
  };


  window.backend.load(loadPhotoArray, createAndShowErrorMessage);


  window.data = {
    pictureTemplate: pictureTemplate,
  };

})();
