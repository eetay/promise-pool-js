# Tiny Promise Pool
A tiny library to execute multiple promises in parallel,
keeping not to execute more than N promises at any one time,
using a promise.

- Tiny Promise Pool is reviewed by [![Codacy Badge](https://api.codacy.com/project/badge/Grade/6ba3a2ddf94b42a1b28de6020117b33d)](https://www.codacy.com/app/eetay/promise-pool-js?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=eetay/promise-pool-js&amp;utm_campaign=Badge_Grade)
- Tiny promise Pool is unit tested with <img src="./spec/jest.png" alt="Jest" width="32px"/>

## Install:

```bash
npm i tiny-promise-pool
```


## Use with creator function:

```javascript
var promisePool = require('promise-pool')

function nextPromise({index, data}) {
  if (index>=20) return null // no more
  return new Promise(function(res, rej) {
    res(index*2 + data)
  })
}

var all = promisePool({
  threads: 3,                 // maximum parallel promises
  promises: nextPromise,  // function to get/generate next promise
  context_data: 17       // user data for the next_promise function
})

all.then(function(result) {
  console.dir(result)         // after all promises are resolved
})
```

### Result:

```javascript
[
  { context: { index: 0, thread: 0, data: 17, ended: 10 }, promise: Promise { 17 }, result: 17 },
  { context: { index: 1, thread: 1, data: 17, ended: 1 }, promise: Promise { 19 }, result: 19 },
  { context: { index: 2, thread: 2, data: 17, ended: 7 }, promise: Promise { 21 }, result: 21 },
  { context: { index: 3, thread: 0, data: 17, ended: 6 }, promise: Promise { 23 }, result: 23 },
  { context: { index: 4, thread: 1, data: 17, ended: 2 }, promise: Promise { 25 }, result: 25 },
  { context: { index: 5, thread: 2, data: 17, ended: 3 }, promise: Promise { 27 }, result: 27 },
  { context: { index: 6, thread: 0, data: 17, ended: 4 }, promise: Promise { 29 }, result: 29 },
  { context: { index: 7, thread: 1, data: 17, ended: 5 }, promise: Promise { 31 }, result: 31 },
  ...
  { context: { index: 19, thread: 1, data: 17, ended: 19 }, promise: Promise { 55 }, result: 55 }
]
```

## Use with array of promises:

```javascript
function makePromise(i) {
  return new Promise(function (resolve, _reject) {
    resolve(i)
  })
}

const promiseList = [
  makePromise(0),
  makePromise(1)
]

promisePool({
  threads: 3,
  promises: promiseList,              // List of promises
  context_data: 'data for context'
}).then(function(result) {
  ...
})
```

## Using generator to generate promises:

```javascript
function *createPromiseMaker() {
  for (var i=0; i<10; i+=1) {
    yield new Promise(...)
  }
}

const pool = promisePool({
  threads: 3,
  promises: createPromiseMaker()
})
```

## Nested promise pools:

```javascript
const innerPool = promisePool({
  threads: 2,
  promises: [
    makePromise(2),
    makePromise(3),
    makePromise(4),
    makePromise(5)
  ],
  context_data: 'secondary promise pool'
})
const pool = promisePool({
  threads: 3,
  promises: [
    makePromise(0),
    makePromise(1),
    innerPool
  ],
  context_data: 'primary promise pool'
})
pool.then(function(result) {
  ...
}
```

## Debugging tool:

```javascript
var promisePool = require('promise-pool')
var visualize = require('promise-pool-visualize')
const pool = promisePool({
  ...
})
pool.then(visualize).then(result => {
   ...
})
```

## TODO list:
- API similar to Promise.all(): "Promise.pool([promise, ...], threads)"
- options for behavior on reject:
  - reject as soon as one is rejected (same as Promise.all)
  - wait for all to resolve even if some are rejected (same as Promise.when)
- support listeners for individual promise completions/rejections

## migration from previous versions:
the following option keys are renamed:
1. next_promise_data -> context_data
2. next_promise -> promises
2. max_parallel -> threads

you can still use the older option keys, but they are deprecated

