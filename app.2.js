/*
1. async test
*/
var Emitter = require("pattern-emitter");

var emitter = new Emitter();
var result;

function sleep(miliseconds = 1000) {
  if (miliseconds == 0) return Promise.resolve();
  return new Promise(resolve => setTimeout(() => resolve(), miliseconds));
}

async function example1() {
  emitter.on(/^example/, function(arg1, arg2) {
    console.log("listener", this.event);
    result = arg1 + " " + arg2;
  });
  await sleep();
  console.log("emit", "exampleEvent");
  emitter.emit("exampleEvent", "It's", "that simple");
  console.log(result); // "It's that simple"
}

function example2() {
  emitter.addListener(/^namespace:entry:1\d{4}$/, function() {
    // Handler for entries within the given range: 10000-19999
    console.log("listener", this.event);
  });

  console.log("emit", "namespace:entry:12345");
  emitter.emit("namespace:entry:12345"); // true
  console.log("emit", "namespace:entry:20000");
  emitter.emit("namespace:entry:20000"); // false
}

async function run() {
  console.log("example1");
  example1();
  console.log("example2");
  example2();
  console.log("done");
}

run();