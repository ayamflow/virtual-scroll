'use strict';

var test = require('tape');
var VirtualScroll = require('../src/index.js');
var trigger = require('tiny-trigger');

var KEY_CODE = {
  DOWN: 40,
  SPACE: 32
}
var el = document.createElement('div');
el.style.position = 'absolute';
el.style.width = '400px';
el.style.height = '400px';
el.style.backgroundColor = 'red';
document.body.appendChild(el);

test('Scroll with target test', function(assert) {
    var v = new VirtualScroll({
        el: el
    });

    v.on(function(event) {
        if (event.originalEvent.type == 'wheel') {
            if (event.originalEvent.currentTarget == el) {
                assert.pass('Wheel events should only fire when hovering the target element.');
            } else {
                assert.fail('A wheel event fired on a different element.');
            }
            v.destroy();
            assert.end();
        }
    });

    trigger(el, 'wheel');
});

test('Arrow scroll test', function(assert) {
    var v = new VirtualScroll();

    v.on(function(event) {
        if (event.originalEvent.type == 'keydown') {
            assert.pass('Event triggered by keydown.');
            v.destroy();
            assert.end();
        }
    });

    triggerKeyboard(KEY_CODE.DOWN);
});

test('Space keypress', function(assert) {
    var v = new VirtualScroll();

    v.on(function(event) {
        if (!event.originalEvent.shiftKey && event.originalEvent.keyCode == KEY_CODE.SPACE) {
            assert.pass('Event triggered by space key.');
            v.destroy();
            assert.end();
        }
    });

    triggerKeyboard(KEY_CODE.SPACE);
});

test('Shift and space keypress', function(assert) {
    var v = new VirtualScroll();

    v.on(function(event) {
        if (event.originalEvent.shiftKey && event.originalEvent.keyCode == KEY_CODE.SPACE) {
            assert.pass('Event triggered by space and shift key.');
            v.destroy();
            assert.end();
        }
    });
    triggerKeyboardWithShift(KEY_CODE.SPACE);
});

test('Passive listener test', function(assert) {
    var vNone = new VirtualScroll();
    var vPassive = new VirtualScroll({
        passive: true
    });
    var vActive = new VirtualScroll({
        passive: false
    });

    assert.ok(vNone.listenerOptions === undefined, 'No passive option');
    assert.ok(vPassive.listenerOptions.passive, 'Passive event listener');
    assert.notOk(vActive.listenerOptions.passive, 'Active event listener');
    vPassive.destroy();
    vActive.destroy();
    vNone.destroy();
    assert.end();
});

test('Off test', function(assert) {
    var v = new VirtualScroll();
    var scrollCount = 0;

    var onScroll = function(event) {
        scrollCount++;
        v.off(onScroll);
    };

    v.on(onScroll);
    trigger(el, 'wheel');
    trigger(el, 'wheel');

    assert.ok(scrollCount === 1, 'Scroll handler should have fired only once.');
    v.destroy();
    assert.end();
});

test('Destroy test', function(assert) {
    var v = new VirtualScroll();
    var scrollCount = 0;

    var onScroll = function(event) {
        scrollCount++;
        v.destroy();
    };

    v.on(onScroll);
    trigger(el, 'wheel');
    trigger(el, 'wheel');

    assert.ok(scrollCount === 1, 'Scroll handler should have fired only once.');
    assert.end();
});

function triggerKeyboard(keyCode, shiftKeyPressed) {
    var event = document.createEvent('KeyboardEvent');
    Object.defineProperty(event, 'keyCode', {
        get: function() {
            return keyCode;
        }
    });
    Object.defineProperty(event, 'which', {
        get: function() {
            return keyCode;
        }
    });
    if (event.initKeyboardEvent) {
        event.initKeyboardEvent("keydown", true, true, document.defaultView, keyCode, keyCode, "", "", shiftKeyPressed ? "shift" : "", "");
    } else {
        event.initKeyEvent("keydown", true, true, document.defaultView, false, false, shiftKeyPressed, false, keyCode, 0);
    }
    document.dispatchEvent(event);
}

function triggerKeyboardWithShift(keyCode) {
  return triggerKeyboard(keyCode, true)
}
