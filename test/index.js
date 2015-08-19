'use strict';

var test = require('prova');
var VirtualScroll = require('../src/index.js');

test('test', function(assert) {
    var v = new VirtualScroll();

    v.on(function(event) {
        console.log('scrooooll');
    });
});