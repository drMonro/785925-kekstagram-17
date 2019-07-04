'use strict';

var ESC_KEY_CODE = 27;
var SPACE_BAR_KEY_CODE = 32;
var MIN_SCALE = 25;
var MAX_SCALE = 100;
var SCALE_STEP = 25;
var FILTER_EFFECTS = {
  none: '',
  chrome: 'effects__preview--chrome',
  sepia: 'effects__preview--sepia',
  marvin: 'effects__preview--marvin',
  phobos: 'effects__preview--phobos',
  heat: 'effects__preview--heat',
};
var FILTER_STYLES = {
  none: '',
  chrome: {
    name: 'grayscale',
    max: 1,
    type: '',
  },
  sepia: {
    name: 'sepia',
    max: 1,
    type: '',
  },
  marvin: {
    name: 'invert',
    max: 100,
    type: '%',
  },
  phobos: {
    name: 'blur',
    max: 3,
    type: 'px',
  },
  heat: {
    name: 'brightness',
    max: 3,
    type: '',
  },
};

var uploadFileArea = document.getElementById('upload-file');
var imageEditorForm = document.querySelector('.img-upload__overlay');
var imageBlock = document.querySelector('.img-upload__preview');
var imagePreview = imageBlock.children[0];
var elementPopupClose = document.getElementById('upload-cancel');
var scaleDownButton = document.querySelector('.scale__control--smaller');
var scaleUpButton = document.querySelector('.scale__control--bigger');
var effectLevelLine = document.querySelector('.effect-level__line');
var pinElement = document.querySelector('.effect-level__pin');
var depthEffectLine = document.querySelector('.effect-level__depth');
var effectLevelValue = document.querySelector('.effect-level__value');

var DEFAULT_VALUE = 100;
var currentScaleValue = DEFAULT_VALUE;
var currentEffectLevel = DEFAULT_VALUE;
var selectedFilter = null;
var levelLineWidth = 0;
var levelPinCoordinates = null;
var levelLineCoordinates = null;
var startPosition = null;


var openImageEditorPopup = function (imageEditor, closingKeyCode) {
  imageEditor.classList.remove('hidden');
  document.addEventListener('keydown', function (evt) {
    closeOnPressKey(evt, imageEditor, closingKeyCode);
  });
};

var closeOnPressKey = function (evt, imageEditor, closingKeyCode) {
  if (evt.keyCode === closingKeyCode) {
    closeImageEditorPopup(imageEditor, closingKeyCode);
  }
};

var closeImageEditorPopup = function (imageEditor, closingKeyCode) {
  imageEditor.classList.add('hidden');
  document.removeEventListener('keydown', function (evt) {
    closeOnPressKey(evt, imageEditor, closingKeyCode);
  });
  resetFilters();
  clearForm();
};

var setFilterVisible = function (isVisible) {
  var effectLevelBlock = document.querySelector('.effect-level');
  if (isVisible) {
    effectLevelBlock.classList.remove('hidden');
    resetFilterDuration();
  } else {
    effectLevelBlock.classList.add('hidden');
  }
};

var resetFilters = function () {
  selectedFilter = null;
  imagePreview.className = '';
  currentScaleValue = DEFAULT_VALUE;
  currentEffectLevel = DEFAULT_VALUE;
  renderScaledImage(currentScaleValue);
  resetFilterDuration();
  renderFilteredImage(selectedFilter);
  setFilterVisible(false);
};

var resetFilterDuration = function () {
  levelLineWidth = effectLevelLine.offsetWidth;
  currentEffectLevel = DEFAULT_VALUE;
  pinElement.style.left = levelLineWidth + 'px';
  depthEffectLine.style.width = currentEffectLevel + '%';
  effectLevelValue.value = currentEffectLevel;
};

var renderFilteredImage = function (chosenFilter) {
  if (FILTER_STYLES[chosenFilter]) {
    var name = FILTER_STYLES[chosenFilter].name;
    var value = FILTER_STYLES[chosenFilter].max / 100 * currentEffectLevel;
    var type = FILTER_STYLES[chosenFilter].type;
    imagePreview.style.filter = name + '(' + value + type + ')';
  } else {
    imagePreview.style.filter = '';
  }
};

var clearForm = function () {
  uploadFileArea.value = '';
};

var imageZoomOut = function (value, scaleStep) {
  value -= scaleStep;
  renderScaledImage(value);
};

var imageZoomIn = function (value, scaleStep) {
  value += scaleStep;
  renderScaledImage(value);
};

var renderScaledImage = function (value) {
  var scaleValueElement = document.querySelector('.scale__control--value');
  var image = document.querySelector('.img-upload__preview');
  scaleValueElement.value = value + '%';
  image.style.transform = 'scale(' + value / 100 + ')';
};

var setFilterPanelBehavior = function () {
  var filtersRadioElements = document.querySelectorAll('.effects__radio');
  filtersRadioElements.forEach(function (filter) {
    filter.addEventListener('change', function () {
      chooseFilter(filter);
    });
  });
};

var chooseFilter = function (filter) {
  selectedFilter = filter.value;

  if (selectedFilter === 'none') {
    resetFilters();
    setFilterVisible(false);
  } else {
    setFilterVisible(true);
    renderFilteredImage(selectedFilter);
  }

  imagePreview.className = FILTER_EFFECTS[selectedFilter];
  currentEffectLevel = DEFAULT_VALUE;
};

var getElementCoordinates = function (elem) {
  var box = elem.getBoundingClientRect();

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset,
  };
};

var getPercentsByCoordinates = function (total, current) {
  return Math.round(100 / total * current);
};

var onSliderMouseDown = function (evt) {
  levelPinCoordinates = getElementCoordinates(pinElement);
  levelLineCoordinates = getElementCoordinates(effectLevelLine);
  startPosition = evt.pageX - levelPinCoordinates.left;

  document.addEventListener('mousemove', onSliderMouseMove);
  document.addEventListener('mouseup', onSliderMouseUp);
  return false;
};

var onSliderMouseUp = function () {
  document.removeEventListener('mousemove', onSliderMouseMove);
  document.removeEventListener('mouseup', onSliderMouseUp);
};

var onSliderMouseMove = function (evt) {
  var newPosition = evt.pageX - startPosition - levelLineCoordinates.left;

  if (newPosition < 0) {
    newPosition = 0;
  } else if (newPosition > levelLineWidth) {
    newPosition = levelLineWidth;
  }

  pinElement.style.left = newPosition + 'px';
  currentEffectLevel = getPercentsByCoordinates(levelLineWidth, newPosition);
  depthEffectLine.style.width = currentEffectLevel + '%';
  effectLevelValue.value = currentEffectLevel;
  renderFilteredImage(selectedFilter);
};


uploadFileArea.addEventListener('change', function () {
  openImageEditorPopup(imageEditorForm, ESC_KEY_CODE);
});

elementPopupClose.addEventListener('click', function () {
  closeImageEditorPopup(imageEditorForm, ESC_KEY_CODE);
});

elementPopupClose.addEventListener('keydown', function (evt) {
  if (evt.keyCode === SPACE_BAR_KEY_CODE) {
    closeImageEditorPopup(imageEditorForm, ESC_KEY_CODE);
  }
});

scaleDownButton.addEventListener('click', function () {
  if (currentScaleValue > MIN_SCALE) {
    imageZoomOut(currentScaleValue, SCALE_STEP);
    currentScaleValue -= SCALE_STEP;
  }
});

scaleDownButton.addEventListener('keydown', function (evt) {
  if (evt.keyCode === SPACE_BAR_KEY_CODE && currentScaleValue > MIN_SCALE) {
    imageZoomOut(currentScaleValue, SCALE_STEP);
    currentScaleValue -= SCALE_STEP;
  }
});

scaleUpButton.addEventListener('click', function () {
  if (currentScaleValue < MAX_SCALE) {
    imageZoomIn(currentScaleValue, SCALE_STEP);
    currentScaleValue += SCALE_STEP;
  }
});

scaleUpButton.addEventListener('keydown', function (evt) {
  if (evt.keyCode === SPACE_BAR_KEY_CODE && currentScaleValue < MAX_SCALE) {
    imageZoomIn(currentScaleValue, SCALE_STEP);
    currentScaleValue += SCALE_STEP;
  }
});

pinElement.addEventListener('mousedown', onSliderMouseDown);

// Блокирует нативный браузерный dragDrop
pinElement.addEventListener('dragstart', function () {
  return false;
});

scaleUpButton.addEventListener('keydown', function (evt) {
  if (evt.keyCode === SPACE_BAR_KEY_CODE && currentScaleValue < MAX_SCALE) {
    imageZoomIn(currentScaleValue, SCALE_STEP);
    currentScaleValue += SCALE_STEP;
  }
});

setFilterPanelBehavior();
