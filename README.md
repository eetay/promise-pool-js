# Tiny Promise Pool
A tiny library to execute multiple promises in parallel,
keeping not to execute more than N promises at any one time,
using a promise.

Tiny promise pool's code is reviewed by [![Codacy Badge](https://api.codacy.com/project/badge/Grade/6ba3a2ddf94b42a1b28de6020117b33d)](https://www.codacy.com/app/eetay/promise-pool-js?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=eetay/promise-pool-js&amp;utm_campaign=Badge_Grade)

### Install:

  ```bash
  npm i tiny-promise-pool
  ```

### Use:

```javascript
  var promisePool = require('promise-pool')

  function nextPromise({index, data}) {
    if (index>=20) return null // no more
    return new Promise(function(res, rej) {
      res(index*2 + data)
    })
  }

  var all = promisePool({
    max_parallel: 3,            // maximum parallel promises to execute at one time
    next_promise: nextPromise,  // function to get/generate next promise
    next_promise_data: 17       // user data for the next_promise function
  })

  all.then(function(result) {
    console.dir(result)         // after all promises are resolves/rejected
  })
```

### Result:

```javascript
    [ { context: { index: 0, thread: 0, data: 17 }, promise: Promise { 17 }, result: 17 },
      { context: { index: 1, thread: 1, data: 17 }, promise: Promise { 19 }, result: 19 },
      { context: { index: 2, thread: 2, data: 17 }, promise: Promise { 21 }, result: 21 },
      { context: { index: 3, thread: 0, data: 17 }, promise: Promise { 23 }, result: 23 },
      { context: { index: 4, thread: 1, data: 17 }, promise: Promise { 25 }, result: 25 },
      { context: { index: 5, thread: 2, data: 17 }, promise: Promise { 27 }, result: 27 },
      { context: { index: 6, thread: 0, data: 17 }, promise: Promise { 29 }, result: 29 },
      { context: { index: 7, thread: 1, data: 17 }, promise: Promise { 31 }, result: 31 },
      { context: { index: 8, thread: 2, data: 17 }, promise: Promise { 33 }, result: 33 },
      { context: { index: 9, thread: 0, data: 17 }, promise: Promise { 35 }, result: 35 },
      { context: { index: 10, thread: 1, data: 17 }, promise: Promise { 37 }, result: 37 },
      { context: { index: 11, thread: 2, data: 17 }, promise: Promise { 39 }, result: 39 },
      { context: { index: 12, thread: 0, data: 17 }, promise: Promise { 41 }, result: 41 },
      { context: { index: 13, thread: 1, data: 17 }, promise: Promise { 43 }, result: 43 },
      { context: { index: 14, thread: 2, data: 17 }, promise: Promise { 45 }, result: 45 },
      { context: { index: 15, thread: 0, data: 17 }, promise: Promise { 47 }, result: 47 },
      { context: { index: 16, thread: 1, data: 17 }, promise: Promise { 49 }, result: 49 },
      { context: { index: 17, thread: 2, data: 17 }, promise: Promise { 51 }, result: 51 },
      { context: { index: 18, thread: 0, data: 17 }, promise: Promise { 53 }, result: 53 },
      { context: { index: 19, thread: 1, data: 17 }, promise: Promise { 55 }, result: 55 } ]
```
