'use strict';

(function () {

  var renderAllPhotos = function (pictures) {
    var fragment = document.createDocumentFragment();
    var pictureBlock = document.querySelector('.pictures');
    pictures.forEach(function (picture) {
      fragment.appendChild(window.picture.renderPhotoBlock(picture));
    });

    pictureBlock.appendChild(fragment);
  };


  renderAllPhotos(window.data.picturesData);

})();
