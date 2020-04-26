"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Plotly = __importStar(require("plotly.js-dist"));
const closedAddressing_1 = require("./closedAddressing");
const openAddressing_1 = require("./openAddressing");
const cuckooHashing_1 = require("./cuckooHashing");
const StopWatch_1 = require("./StopWatch");
let defaultDiv = document.getElementById('default');
let openAddressingDiv = document.getElementById('openAddressing');
let closedAddressingDiv = document.getElementById('closedAddressing');
let cuckooHashingDiv = document.getElementById('cuckooHashing');
let slider = document.getElementById("myRange");
let output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value
// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
    output.innerHTML = slider.value;
    test(parseInt(slider.value));
};
function generate(n) {
    return Array.from({ length: n }, () => Math.floor(Math.random() * n));
    ;
}
function test(n) {
    let arr = generate(n);
    let defaultHash = new Map();
    let openHash = new openAddressing_1.HashTableO(n);
    let closedHash = new closedAddressing_1.HashTableC(n);
    let cuckooHash = new cuckooHashing_1.CuckooHashing(n);
    let defaultRes = [];
    let openRes = [];
    let closedRes = [];
    let cuckooRes = [];
    var timer = new StopWatch_1.StopWatch();
    for (let i of arr) {
        timer.start();
        defaultHash.set(i, i);
        timer.stop();
        defaultRes.push([timer.getElapsedMilliseconds(), 0]);
        // Plotly.extendTraces(defaultDiv, { y: [[timer.getElapsedMilliseconds()]] }, [0])
        timer.start();
        openHash.add(i, i);
        timer.stop();
        openRes.push([timer.getElapsedSeconds(), openHash.getNumOfCollisions()]);
        // Plotly.extendTraces(openAddressingDiv, { y: [[timer.getElapsedMilliseconds()]] }, [0])
        timer.start();
        closedHash.add(i, i);
        timer.stop();
        closedRes.push([timer.getElapsedSeconds(), closedHash.getNumOfCollisions()]);
        // Plotly.extendTraces(closedAddressingDiv, { y: [[timer.getElapsedMilliseconds()]] }, [0])
        timer.start();
        cuckooHash.add(i, i);
        timer.stop();
        cuckooRes.push([timer.getElapsedSeconds(), cuckooHash.getNumOfCollisions()]);
        // Plotly.extendTraces(cuckooHashingDiv, { y: [[timer.getElapsedMilliseconds()]] }, [0])
        let trace1 = {
            z: defaultRes,
            type: 'surface'
        };
        let trace2 = {
            z: openRes,
            type: 'surface'
        };
        let trace3 = {
            z: closedRes,
            type: 'surface'
        };
        let trace4 = {
            z: cuckooRes,
            type: 'surface'
        };
        let data = [trace1,
            trace2,
            trace3,
            trace4];
        Plotly.newPlot(defaultDiv, data);
    }
}
test(50);
