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
var DEFAULT_VALUE = 100;

var uploadFileArea = document.getElementById('upload-file');
var imageEditorForm = document.querySelector('.img-upload__overlay');
var imageBlock = document.querySelector('.img-upload__preview');
var imagePreview = imageBlock.children[0];
var elementPopupClose = document.getElementById('upload-cancel');

var scaleDownButton = document.querySelector('.scale__control--smaller');
var scaleUpButton = document.querySelector('.scale__control--bigger');
var currentScaleValue = DEFAULT_VALUE;

var filtersRadioElements = document.querySelectorAll('.effects__radio');

var currentEffectLevel = DEFAULT_VALUE;
var effectLevelBlock = document.querySelector('.effect-level');
var effectLevelLine = document.querySelector('.effect-level__line');
var pinElement = document.querySelector('.effect-level__pin');
var depthEffectLine = document.querySelector('.effect-level__depth');
var effectLevelValue = document.querySelector('.effect-level__value');


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

var setFilterVisible = function (isVisible, effectBlock) {
  if (isVisible) {
    effectBlock.classList.remove('hidden');
    resetFilterDuration();
  } else {
    effectBlock.classList.add('hidden');
  }
};

var resetFilters = function (chosenFilter, effectBlock) {
  chosenFilter = null;
  imagePreview.className = '';
  currentScaleValue = DEFAULT_VALUE;
  currentEffectLevel = DEFAULT_VALUE;
  renderScaledImage(currentScaleValue);
  resetFilterDuration();
  applyFilterLevelOnPreview(chosenFilter);
  setFilterVisible(false, effectBlock);
};

var resetFilterDuration = function () {
  var lineWidth = effectLevelLine.offsetWidth;
  currentEffectLevel = DEFAULT_VALUE;
  pinElement.style.left = lineWidth + 'px';
  depthEffectLine.style.width = currentEffectLevel + '%';
  effectLevelValue.value = currentEffectLevel;
};

var applyFilterLevelOnPreview = function (chosenFilter) {
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


var onZoomOut = function (value, scaleStep) {
  value -= scaleStep;
  renderScaledImage(value);
};

var onZoomIn = function (value, scaleStep) {
  value += scaleStep;
  renderScaledImage(value);
};

var renderScaledImage = function (value) {
  var scaleValueElement = document.querySelector('.scale__control--value');
  var image = document.querySelector('.img-upload__preview');
  scaleValueElement.value = value + '%';
  image.style.transform = 'scale(' + value / 100 + ')';
};

var onFilterChange = function (filter, effectBlock) {
  filter.addEventListener('change', function () {
    var selectedFilter = filter.value;

    if (selectedFilter === 'none') {
      resetFilters(selectedFilter, effectBlock);
      setFilterVisible(false, effectBlock);
    } else {
      setFilterVisible(true, effectBlock);
      applyFilterLevelOnPreview(selectedFilter);
    }

    imagePreview.className = FILTER_EFFECTS[selectedFilter];
    currentEffectLevel = DEFAULT_VALUE;
  });
};

var setFilterPanelBehavior = function (filterElements, effectBlock) {
  for (var i = 0; i < filterElements.length; i++) {
    onFilterChange(filterElements[i], effectBlock);
  }
};

var getElementCoordinates = function (elem) {
  var box = elem.getBoundingClientRect();

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset,
  };
};

var getPercentsByCoords = function (total, current) {
  return Math.round(100 / total * current);
};

var onSliderMouseDown = function (evt, pin, levelLine) {
  var pinCoordinates = getElementCoordinates(pin);
  var lineCoordinates = getElementCoordinates(levelLine);
  var startPosition = evt.pageX - pinCoordinates.left;

  document.addEventListener('mousemove', function (event) {
    onSliderMouseMove(event, startPosition, lineCoordinates, levelLine, pin);
  });
  document.addEventListener('mouseup', onSliderMouseUp);
  return false;
};

var onSliderMouseUp = function () {
  document.removeEventListener('mousemove', onSliderMouseMove);
  document.removeEventListener('mouseup', onSliderMouseUp);
};

var findChosenFilter = function () {
  var filtersRadio = document.querySelectorAll('.effects__radio');
  for (var i = 0; i < filtersRadio.length; i++) {
    if (filtersRadio[i].checked) {
      var selectedFilter = filtersRadio[i].value;
    }
  }
  return selectedFilter;
};

var onSliderMouseMove = function (evt, startPosition, lineCoords, levelLine, pin) {
  var newPosition = evt.pageX - startPosition - lineCoords.left;

  var selectedFilter = findChosenFilter();
  var lineWidth = levelLine.offsetWidth;

  if (newPosition < 0) {
    newPosition = 0;
  } else if (newPosition > lineWidth) {
    newPosition = lineWidth;
  }

  pin.style.left = newPosition + 'px';
  currentEffectLevel = getPercentsByCoords(lineWidth, newPosition);
  depthEffectLine.style.width = currentEffectLevel + '%';
  effectLevelValue.value = currentEffectLevel;
  applyFilterLevelOnPreview(selectedFilter);
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
    onZoomOut(currentScaleValue, SCALE_STEP);
    currentScaleValue -= SCALE_STEP;
  }
});

scaleDownButton.addEventListener('keydown', function (evt) {
  if (evt.keyCode === SPACE_BAR_KEY_CODE && currentScaleValue > MIN_SCALE) {
    onZoomOut(currentScaleValue, SCALE_STEP);
    currentScaleValue -= SCALE_STEP;
  }
});

scaleUpButton.addEventListener('click', function () {
  if (currentScaleValue < MAX_SCALE) {
    onZoomIn(currentScaleValue, SCALE_STEP);
    currentScaleValue += SCALE_STEP;
  }
});

scaleUpButton.addEventListener('keydown', function (evt) {
  if (evt.keyCode === SPACE_BAR_KEY_CODE && currentScaleValue < MAX_SCALE) {
    onZoomIn(currentScaleValue, SCALE_STEP);
    currentScaleValue += SCALE_STEP;
  }
});

pinElement.addEventListener('mousedown', function (evt) {
  onSliderMouseDown(evt, pinElement, effectLevelLine);
});

// Блокирует нативный браузерный dragDrop
pinElement.addEventListener('dragstart', function () {
  return false;
});

setFilterPanelBehavior(filtersRadioElements, effectLevelBlock);


