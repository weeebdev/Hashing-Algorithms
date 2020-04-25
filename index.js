var TESTER = document.getElementById('tester1');
var Plotly = require('plotly.js-dist');
var closedAddressing = require('./closedAddressing');
var openAddressing = require('./openAddressing');
var cuckooHashing = require('./cuckooHashing')

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
    output.innerHTML = this.value;
    test(this.value);
}

function generate(n) {
    var res = new Array(n);
    for (i = 0; i < n; i++) {
        res.push(Math.floor(Math.random() * n))
    }
    return res;
}

function parabola(x) {
    return x * x;
}

function test(n) {
    arr = generate(n);
    Plotly.newPlot(TESTER, [{
        x: arr,
        y: arr.map(parabola)
    }], {
        margin: { t: 0 }
    });
}

