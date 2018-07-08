# promise-pool-js
Library to execute promises in parallel, keeping not to execute more than N promises at any one time

```javascript
  function nextPromise({index, data}) {
    if (index>=20) return null // no more
    return new Promise(function(res, rej) {
      res(index*2 + data)
    })
  }

  var all = promisePool({
    next_promise_data: 17,
    max_parallel: 3,
    next_promise: nextPromise
  })

  all.then(function(result) {
    console.dir(result)
  })
```

```javascript
    [ { init: { index: 0, data: 17 }, promise: Promise { 17 }, result: 17 },
      { init: { index: 1, data: 17 }, promise: Promise { 19 }, result: 19 },
      { init: { index: 2, data: 17 }, promise: Promise { 21 }, result: 21 },
      { init: { index: 3, data: 17 }, promise: Promise { 23 }, result: 23 },
      { init: { index: 4, data: 17 }, promise: Promise { 25 }, result: 25 },
      { init: { index: 5, data: 17 }, promise: Promise { 27 }, result: 27 },
      { init: { index: 6, data: 17 }, promise: Promise { 29 }, result: 29 },
      { init: { index: 7, data: 17 }, promise: Promise { 31 }, result: 31 },
      { init: { index: 8, data: 17 }, promise: Promise { 33 }, result: 33 },
      { init: { index: 9, data: 17 }, promise: Promise { 35 }, result: 35 },
      { init: { index: 10, data: 17 }, promise: Promise { 37 }, result: 37 },
      { init: { index: 11, data: 17 }, promise: Promise { 39 }, result: 39 },
      { init: { index: 12, data: 17 }, promise: Promise { 41 }, result: 41 },
      { init: { index: 13, data: 17 }, promise: Promise { 43 }, result: 43 },
      { init: { index: 14, data: 17 }, promise: Promise { 45 }, result: 45 },
      { init: { index: 15, data: 17 }, promise: Promise { 47 }, result: 47 },
      { init: { index: 16, data: 17 }, promise: Promise { 49 }, result: 49 },
      { init: { index: 17, data: 17 }, promise: Promise { 51 }, result: 51 },
      { init: { index: 18, data: 17 }, promise: Promise { 53 }, result: 53 },
      { init: { index: 19, data: 17 }, promise: Promise { 55 }, result: 55 } ]
```
