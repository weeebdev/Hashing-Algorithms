export var StopWatch = function (performance?) {
    this.startTime = 0;
    this.stopTime = 0;
    this.running = false;
    this.performance = performance === false ? false : !!window.performance;
};
StopWatch.prototype.currentTime = function () {
    return this.performance ? window.performance.now() : new Date().getTime();
};
StopWatch.prototype.start = function () {
    this.startTime = this.currentTime();
    this.running = true;
};
StopWatch.prototype.stop = function () {
    this.stopTime = this.currentTime();
    this.running = false;
};
StopWatch.prototype.getElapsedMilliseconds = function () {
    if (this.running) {
        this.stopTime = this.currentTime();
    }
    return this.stopTime - this.startTime;
};
StopWatch.prototype.getElapsedSeconds = function () {
    return this.getElapsedMilliseconds() / 1000;
};
StopWatch.prototype.printElapsed = function (name) {
    var currentName = name || 'Elapsed:';
    console.log(currentName, '[' + this.getElapsedMilliseconds() + 'ms]', '[' + this.getElapsedSeconds() + 's]');
};
