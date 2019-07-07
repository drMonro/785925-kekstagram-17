'use strict';

(function () {
  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var pictures = [];
  var filters = document.querySelector('.img-filters');


  var successHandler = function (data) {
    pictures = data;
    window.gallery.renderImages(pictures);
    filters.classList.remove('img-filters--inactive');
    window.gallery.setSortingButtonsBehavior();
  };

  var errorHandler = function (errorMessage) {
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

  var compareRandom = function () {
    return Math.random() - 0.5;
  };

  var getImagesForSortingNew = function () {
    return pictures.slice().sort(compareRandom).slice(0, 9);
  };

  var getImagesForSortingDiscussed = function () {
    return pictures.slice().sort(function (value1, value2) {
      return value2.comments.length - value1.comments.length;
    });
  };


  var sortAndRenderImages = window.backend.debounce(function (sortedArr) {
    window.gallery.renderImages(sortedArr);
  });

  window.backend.load(window.backend.DATA_URL, successHandler, errorHandler);


  window.data = {
    getImagesForSortingNew: getImagesForSortingNew,
    getImagesForSortingDiscussed: getImagesForSortingDiscussed,
    pictureTemplate: pictureTemplate,
    sortAndRenderImages: sortAndRenderImages,
    pictures: pictures
  };

})();
