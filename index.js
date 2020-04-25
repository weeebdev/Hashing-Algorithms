var TESTER = document.getElementById('tester1');
var Plotly = require('plotly.js-dist');

Plotly.newPlot(TESTER, [{
    x: [1, 2, 3, 4, 5],
    y: [1, 2, 4, 8, 16]
}], {
    margin: { t: 0 }
});