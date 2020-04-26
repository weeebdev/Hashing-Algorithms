import * as Plotly from 'plotly.js-dist'
import { HashTableC } from './closedAddressing'
import { HashTableO } from './openAddressing'
import { CuckooHashing } from './cuckooHashing'
import { StopWatch } from './StopWatch';


let defaultDiv: HTMLDivElement = document.getElementById('default') as HTMLDivElement;
let openAddressingDiv: HTMLDivElement = document.getElementById('openAddressing') as HTMLDivElement;
let closedAddressingDiv: HTMLDivElement = document.getElementById('closedAddressing') as HTMLDivElement;
let cuckooHashingDiv: HTMLDivElement = document.getElementById('cuckooHashing') as HTMLDivElement;
let slider: HTMLInputElement = document.getElementById("myRange") as HTMLInputElement;
let output: HTMLDivElement = document.getElementById("demo") as HTMLDivElement;
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)

slider.oninput = function () {
    output.innerHTML = slider.value;
    test(parseInt(slider.value));
}

function generate(n: number): number[] {
    return Array.from({ length: n }, () => Math.floor(Math.random() * n));;
}



function test(n: number) {
    let arr = generate(n);

    let defaultHash = new Map();
    let openHash = new HashTableO(n);
    let closedHash = new HashTableC(n);
    let cuckooHash = new CuckooHashing(n);

    let defaultRes = [];
    let openRes = [];
    let closedRes = [];
    let cuckooRes = [];

    var timer = new StopWatch();



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
        }
        let trace2 = {
            z: openRes,
            type: 'surface'
        }
        let trace3 = {
            z: closedRes,
            type: 'surface'
        }
        let trace4 = {
            z: cuckooRes,
            type: 'surface'
        }

        // let data = [trace1, trace2, trace3, trace4];

        Plotly.newPlot(defaultDiv, [trace1]);
        Plotly.newPlot(openAddressingDiv, [trace2]);
        Plotly.newPlot(closedAddressingDiv, [trace3]);
        Plotly.newPlot(cuckooHashingDiv, [trace4]);
    }

}

test(50);