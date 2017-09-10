#!/usr/bin/env node
'use strict';

var version = process.version.replace('v', '').split('.');
if (version[0] < 8) {
  console.log('Unsupported nodejs version ' + process.version + '. Please upgrade.');
} else {
  require('./run');
}