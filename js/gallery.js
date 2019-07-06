'use strict';

(function () {
  var addPictures = function (photos) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < photos.length; i++) {
      fragment.appendChild(window.picture.renderPicture(photos, i));
    }

    return fragment;
  };

  window.gallery = {
    addPictures: addPictures
  };

})();
