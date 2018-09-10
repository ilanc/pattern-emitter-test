/*
1. remove emitter test

Notes:
(1) remove listener event occurs before emitted event when emitter.once() is used
(2) and inside emitter.once(, listener) this.event === removeListener - rather than emitted event

  2: emit example2.1
  listener removed: /^example2.\d$/ function example2Listener									(1)
  2: listener removeListener example2.1arg																		(2)

(3) event.emit() seems to create names in emitter.eventNames()

countAllListeners
  newListener 1
  removeListener 1
  /^example1/ 0
  example2.1 0									(3)
  /^example2.\d$/ 0
  example2.2 0									(3)

*/
var Emitter = require("pattern-emitter");

var emitter = new Emitter();
var result;

var example1pattern = /^example1/;
var example2pattern = /^example2.\d$/;

function sleep(miliseconds = 1000) {
  //;
  if (miliseconds == 0) return Promise.resolve();
  return new Promise(resolve => setTimeout(() => resolve(), miliseconds));
}

function init() {
  /*
  emitter.on(/Listener/, function(pattern, listener) {
    console.log("new listener added:", pattern, listener.name);
  });
  */
  emitter.on("newListener", function(event, listener) {
    console.log(
      "new listener added:",
      event,
      "function",
      listener.name || "anonymous"
    );
  });
  emitter.on("removeListener", function(event, listener) {
    console.log(
      "listener removed:",
      event,
      "function",
      listener.name || "anonymous"
    );
  });
}

function example1Listener(arg1, arg2) {
  console.log("1:", "listener", this.event, arg1, arg2);
  result = arg1 + " " + arg2;
}

async function example1() {
  console.log("1: start");
  emitter.once(example1pattern, example1Listener);
  await sleep();
  console.log("1:", "emit", "example1");
  emitter.emit("exampleEvent", "It's", "that simple");
  console.log("1. result: ", result); // "It's that simple"
  console.log("1: end");
}

function example2() {
  console.log("2: start");
  emitter.once(example2pattern, function example2Listener(arg1) {
    // Handler for entries within the given range: 10000-19999
    // Notes:
    // (1) remove listener event occurs before emitted event when emitter.once() is used
    // (2) and inside emitter.once(, listener) this.event === removeListener - rather than emitted event
    console.log("2:", "listener", this.event, arg1);
  });

  console.log("2:", "num listeners:", countAllListeners());
  console.log("2:", "emit", "example2.1");
  // Notes:
  // (1) remove listener event occurs before emitted event when emitter.once() is used
  // (2) and inside emitter.once(, listener) this.event === removeListener - rather than emitted event
  emitter.emit("example2.1", "example2.1arg"); // true
  console.log("2:", "num listeners:", countAllListeners());

  console.log("2:", "emit", "example2.2");
  emitter.emit("example2.2", "example2.2arg"); // false - because emitter.once(..) above has removed example2Listener above example2.1 emit
  console.log("2:", "num listeners:", countAllListeners());

  console.log("2: end");
}

function countAllListeners() {
  console.log("countAllListeners");
  let names = emitter.eventNames();
  let total = 0;
  for (let n of names) {
    var listeners = emitter.matchingListeners(n);
    total += listeners.length;
    console.log(" ", n, listeners.length);
  }
  return total;
}

async function run() {
  console.log("run: start");
  console.log("run:", "num listeners:", countAllListeners());
  init();
  console.log("run:", "num listeners:", countAllListeners());

  let prom1 = example1(); // NOTE: not awaited till later
  console.log("run:", "num listeners:", countAllListeners());
  example2();
  console.log("run:", "num listeners:", countAllListeners());

  console.log("run:", "remove ", example1pattern);
  emitter.removeListener(example1pattern, example1Listener);
  console.log("run:", "num listeners:", countAllListeners());

  await prom1;

  emitter.removeAllListeners(/.*/);
  console.log("run:", "num listeners:", countAllListeners());

  console.log("run: end");
}

run();
