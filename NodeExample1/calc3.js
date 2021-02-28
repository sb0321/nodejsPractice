var util = require('util');
var eventEmitter = require('events').EventEmitter;

var Calc = function() {
    var self = this;

    this.on('stop', function() {
        console.log('Calc에 stop event 전달됨');
    });
    
};

// EventEmitter 상속 받음
util.inherits(Calc, eventEmitter);

Calc.prototype.add = function(a, b) {
    return a + b;
}

// 외부에서 쓸 수 있게 만들었음
module.exports = Calc;
module.exports.title = 'calculator';