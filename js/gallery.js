'use strict';

(function () {
  var COUNT_OF_NEW_PICTURES = 10;

  var pictures = [];
  var picturesSection = document.querySelector('.pictures');
  var sortingButtons = document.querySelectorAll('.img-filters__button');


  var renderImages = function (images) {
    var fragment = document.createDocumentFragment();
    var picturesList = picturesSection.querySelectorAll('.picture');

    picturesList.forEach(function (item) {
      item.remove();
    });
    images.forEach(function (picture) {
      fragment.appendChild(createPicture(picture));
    });
    picturesSection.appendChild(fragment);
  };

  var createPicture = function (picture) {
    var pictureTemplate = document.querySelector('#picture')
      .content
      .querySelector('.picture');
    var pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.addEventListener('click', function () {
      window.picture.showFormWithData(picture);
    });
    return pictureElement;
  };

  var onError = function (errorMessage) {
    var errorBlock = document.createElement('div');
    errorBlock.classList = 'errorMessage';
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

  var onSuccess = function (webData) {
    var filters = document.querySelector('.img-filters');
    var errorMessages = document.querySelectorAll('.errorMessage');

    errorMessages.forEach(function (item) {
      item.remove();
    });

    saveWebData(webData);
    renderImages(pictures);

    filters.classList.remove('img-filters--inactive');
    setSortingButtonsBehavior();
  };

  var saveWebData = function (webData) {
    webData.forEach(function (item, index) {
      pictures[index] = item;
    });
  };

  var setSortingButtonsBehavior = function () {
    sortingButtons.forEach(function (button) {
      button.addEventListener('click', onFilterButtonsClick);
    });
  };

  var onFilterButtonsClick = function (evt) {
    var sortingActiveAttribute = 'img-filters__button--active';
    sortingButtons.forEach(function (btn) {
      btn.classList.remove(sortingActiveAttribute);
    });
    evt.target.classList.add(sortingActiveAttribute);

    sortAndRenderImages(MapClassWithData[evt.target.id]());
  };

  var getDefaultImages = function () {
    return pictures.slice();
  };

  var getImagesForSortingNew = function () {
    return pictures.slice().sort(compareRandom).slice(0, COUNT_OF_NEW_PICTURES);
  };

  var compareRandom = function () {
    return Math.random() - 0.5;
  };

  var getImagesForSortingDiscussed = function () {
    return pictures.slice().sort(function (value1, value2) {
      return value2.comments.length - value1.comments.length;
    });
  };

  var sortAndRenderImages = window.backend.debounce(function (sortedArr) {
    renderImages(sortedArr);
  });


  window.backend.load(onSuccess, onError);

  var MapClassWithData = {
    'filter-popular': getDefaultImages,
    'filter-new': getImagesForSortingNew,
    'filter-discussed': getImagesForSortingDiscussed
  };

})();
