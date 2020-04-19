"use strict";
exports.__esModule = true;
var closedAddressing_1 = require("./closedAddressing");
var h = new closedAddressing_1.HashTableC(10);
for (var i = 0; i < 100; i++) {
    h.add(i, i);
}
console.log(h.toString());
