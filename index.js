'use strict';

var defaults = require('defaults');
var EventEmitter = require('tiny-emitter');

var emitter = new EventEmitter();

var keyCodes = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
};

var options;

var virtualScroll = module.exports = function(opts) {
  options = defaults(opts, {
    // General multiplier for all mousehweel including FF
    mouseMultiplier: 1,
    // Mutiply the touch action by two making the scroll a bit faster than finger movement
    touchMultiplier: 2,
    // Firefox on Windows needs a boost, since scrolling is very slow
    firefoxMultiplier: 15,
    // How many pixels to move with each key press
    keyStep: 120,
    // Automatically e.preventDefault on touchMove
    preventTouch: false
  });

  getSupport();
};

/* =======
  STATE
  ======= */

var scrollEvent = {
  y: 0,
  x: 0,
  deltaX: 0,
  deltaY: 0,
  originalEvent: null
};

var initialized = false;
var touchStartX, touchStartY;

/* =======
  SUPPORT
  ======= */

var hasWheelEvent, hasMouseWheelEvent, hasTouch, hasTouchWin, hasPointer, hasKeyDown, isFirefox, bodyTouchAction;

function getSupport() {
  hasWheelEvent = 'onwheel' in document;
  hasMouseWheelEvent = 'onmousewheel' in document;
  hasTouch = 'ontouchstart' in document;
  hasTouchWin = navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 1;
  hasPointer = !!window.navigator.msPointerEnabled;
  hasKeyDown = 'onkeydown' in document;
  isFirefox = navigator.userAgent.indexOf('Firefox') > -1;
}

/* =======
  EVENTS
  ======= */

function notify(e) {
   scrollEvent.x += scrollEvent.deltaX;
   scrollEvent.y += scrollEvent.deltaY;
   scrollEvent.originalEvent = e;

   emitter.emit('virtualScroll', scrollEvent);
}

function onWheel(e) {
  // In Chrome and in Firefox (at least the new one)
  scrollEvent.deltaX = e.wheelDeltaX || e.deltaX * -1;
  scrollEvent.deltaY = e.wheelDeltaY || e.deltaY * -1;

  // for our purpose deltamode = 1 means user is on a wheel mouse, not touch pad
  // real meaning: https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent#Delta_modes
  if(isFirefox && e.deltaMode == 1) {
    scrollEvent.deltaX *= options.firefoxMultiplier;
    scrollEvent.deltaY *= options.firefoxMultiplier;
  }

  scrollEvent.deltaX *= options.mouseMultiplier;
  scrollEvent.deltaY *= options.mouseMultiplier;

  notify(e);
}

function onMouseWheel(e) {
  // In Safari, IE and in Chrome if 'wheel' isn't defined
  scrollEvent.deltaX = (e.wheelDeltaX) ? e.wheelDeltaX : 0;
  scrollEvent.deltaY = (e.wheelDeltaY) ? e.wheelDeltaY : e.wheelDelta;

  notify(e);
}

function onTouchStart(e) {
  var t = (e.targetTouches) ? e.targetTouches[0] : e;
  touchStartX = t.pageX;
  touchStartY = t.pageY;
}

function onTouchMove(e) {
  if(options.preventTouch) e.preventDefault();

  var t = (e.targetTouches) ? e.targetTouches[0] : e;

  scrollEvent.deltaX = (t.pageX - touchStartX) * options.touchMultiplier;
  scrollEvent.deltaY = (t.pageY - touchStartY) * options.touchMultiplier;

  touchStartX = t.pageX;
  touchStartY = t.pageY;

  notify(e);
}

function onKeyDown(e) {
  scrollEvent.deltaX = scrollEvent.deltaY = 0;

  switch(e.keyCode) {
    case keyCodes.LEFT:
    case keyCodes.UP:
      scrollEvent.deltaY = options.keyStep;
      break;

    case keyCodes.RIGHT:
    case keyCodes.DOWN:
      scrollEvent.deltaY = - options.keyStep;
      break;

    default:
      return;
  }

  notify(e);
}

function bind() {
  if(hasWheelEvent) document.addEventListener("wheel", onWheel);
  if(hasMouseWheelEvent) document.addEventListener("mousewheel", onMouseWheel);

  if(hasTouch) {
    document.addEventListener("touchstart", onTouchStart);
    document.addEventListener("touchmove", onTouchMove);
  }

  if(hasPointer && hasTouchWin) {
    bodyTouchAction = document.body.style.msTouchAction;
    document.body.style.msTouchAction = "none";
    document.addEventListener("MSPointerDown", onTouchStart, true);
    document.addEventListener("MSPointerMove", onTouchMove, true);
  }

  if(hasKeyDown) document.addEventListener("keydown", onKeyDown);

  initialized = true;
}

function unbind() {
  if(hasWheelEvent) document.removeEventListener("wheel", onWheel);
  if(hasMouseWheelEvent) document.removeEventListener("mousewheel", onMouseWheel);

  if(hasTouch) {
    document.removeEventListener("touchstart", onTouchStart);
    document.removeEventListener("touchmove", onTouchMove);
  }

  if(hasPointer && hasTouchWin) {
    document.body.style.msTouchAction = bodyTouchAction;
    document.removeEventListener("MSPointerDown", onTouchStart, true);
    document.removeEventListener("MSPointerMove", onTouchMove, true);
  }

  if(hasKeyDown) document.removeEventListener("keydown", onKeyDown);

  initialized = false;
}

/* =======
  PUBLIC API
 ======= */

virtualScroll.addListener = virtualScroll.on = function(cb) {
  if(!initialized) bind();
  emitter.on('virtualScroll', cb);
};

virtualScroll.removeListener = virtualScroll.off = function(cb) {
  emitter.off('virtualScroll', cb);
  if(emitter.e.virtualScroll.length <= 0) unbind();
};