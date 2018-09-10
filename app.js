var Emitter = require('pattern-emitter');

var emitter = new Emitter();
var result;

emitter.on(/^example/, function(arg1, arg2) {
  result = arg1 + ' ' + arg2;
});

emitter.emit('exampleEvent', "It's", 'that simple');
console.log(result); // "It's that simple"
