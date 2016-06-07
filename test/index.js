'use strict';

var test = require('tape');
var VirtualScroll = require('../src/index.js');
var trigger = require('tiny-trigger');

var KEY_CODE = 40;
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

    triggerKeyboard();
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

function triggerKeyboard() {
    var event = document.createEvent('KeyboardEvent');
    Object.defineProperty(event, 'keyCode', {
        get: function() {
            return KEY_CODE;
        }
    });
    Object.defineProperty(event, 'which', {
        get: function() {
            return KEY_CODE;
        }
    });
    if (event.initKeyboardEvent) {
        event.initKeyboardEvent("keydown", true, true, document.defaultView, KEY_CODE, KEY_CODE, "", "", false, "");
    } else {
        event.initKeyEvent("keydown", true, true, document.defaultView, false, false, false, false, KEY_CODE, 0);
    }
    document.dispatchEvent(event);
}