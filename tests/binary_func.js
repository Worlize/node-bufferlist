#!/usr/bin/env node
// Functional binary interface
var assert = require('assert');
var sys = require('sys');

var Buffer = require('buffer').Buffer;
var BufferList = require('bufferlist').BufferList;
var Binary = require('bufferlist/binary').Binary;

// test repeat
var tapped = 0;
var trickyList = [];
var bList = new BufferList;

Binary(bList)
    .repeat(5, function(n, vars) {
        tapped++;
    })
    .tap(function (vars) {
        assert.equal(tapped, 5, 'tapped != 5 (in repeat test)');
    })
    .repeat(3, function(i, vars) {
        this
            .repeat(4, function (j, vars) {
                trickyList.push([i,j]);
            })
        ;
    })
    .tap(function (vars) {
        expectedTrickyList = [
            [1,1],[1,2],[1,3],[1,4],
            [2,1],[2,2],[2,3],[2,4],
            [3,1],[3,2],[3,3],[3,4]
        ];
        for (var i = 0; i < trickyList.length; i++) {
            assert.equal(
                trickyList[i][0],
                expectedTrickyList[i][0],
                'trickly list is not what it should be. it should be: ' +
                    sys.inspect(expectedTrickyList) + '. it is: ' +
                    sys.inspect(trickyList)
            );
            assert.equal(
                trickyList[i][1],
                expectedTrickyList[i][1],
                'trickly list is not what it should be. it should be: ' +
                    sys.inspect(expectedTrickyList) + '. it is: ' +
                    sys.inspect(trickyList)
            );
        }
    })
;

// test until
var tapped = 0, tapped2 = 0;
var bList = new BufferList;

Binary(bList)
    .until('byte', 0, function(vars) {
        this.getWord8('byte')
        tapped++;
    })
    .tap(function (vars) {
        assert.equal(tapped, 4, 'tapped != 4 (in until test)');
    })
    .until('byte', 'f', function (vars) {
        this.getWord8('byte');
        tapped2++;
    })
    .tap(function (vars) {
        assert.equal(tapped2, 3, 'tapped2 != 3 (in until test)');
    })
;

var buf = new Buffer(7);
buf.write("abc\x00def", 'binary');
bList.push(buf);
