'use strict';

(function () {
  var renderImages = function (arr) {
    var picturesList = document.querySelector('.pictures');
    var fragment = document.createDocumentFragment();

    document.querySelectorAll('.picture').forEach(function (item) {
      item.remove();
    });
    arr.forEach(function (item) {
      fragment.appendChild(window.picture.renderPicture(item));
    });
    picturesList.appendChild(fragment);
  };

  var setSortingButtonsBehavior = function () {
    var sortingButtons = document.querySelectorAll('.img-filters__button');
    var sortingActiveAttribute = 'img-filters__button--active';

    var sortTypes = {
      'filter-popular': window.data.pictures,
      'filter-new': window.data.getImagesForSortingNew(),
      'filter-discussed': window.data.getImagesForSortingDiscussed(),
    };

    sortingButtons.forEach(function (button) {
      button.addEventListener('click', function (evt) {
        sortingButtons.forEach(function (btn) {
          btn.classList.remove(sortingActiveAttribute);
        });
        evt.target.classList.add(sortingActiveAttribute);

        window.data.sortAndRenderImages(sortTypes[evt.target.id]);
      });
    });
  };

  window.gallery = {
    renderImages: renderImages,
    setSortingButtonsBehavior: setSortingButtonsBehavior,
  };

})();
