jest.setTimeout(20000)
var promisePool = require('../promise-pool.js')

function randomTimeout() {
  return Math.floor((Math.random() * 100) + 1)
}

function makePromise(i, timeout = 0) {
  closure = function () {
    var context = {}
    var promise = new Promise(function (resolve, _reject) {
      setTimeout(() => {
        context.promise.done = true
        resolve(i)
      }, timeout)
    })
    context.promise = promise
    context.promise.done = false
    return promise
  }
  return closure()
}

test('Array of promises', (done) => {
  expect.assertions(1)
  const promiseList = [
    makePromise(0),
    makePromise(1)
  ]
  const pool = promisePool({
    threads: 3,
    next_promise: promiseList,
    next_promise_data: 'data for context'
  })
  pool.then(function(result) {
    expect(result.length).toBe(promiseList.length)
    done()
  })
})

test('Array of promises; one is not resolved', (done) => {
  expect.assertions(6)
  var resolved=false
  const promiseList = [
    makePromise(0, 100),
    makePromise(1, 10000),
    makePromise(2, 10),
    makePromise(3, 10)
  ]
  const pool = promisePool({
    threads: 2,
    next_promise: promiseList,
    next_promise_data: 'data for context'
  })
  setTimeout(()=>{
    expect(promiseList[0].done).toBe(true)
    expect(promiseList[1].done).toBe(false)
    expect(promiseList[2].done).toBe(true)
    expect(promiseList[3].done).toBe(true)
  }, 1000)
  setTimeout(()=>{
    expect(resolved).toBe(false)
  }, 9900)
  pool.then(function(result) {
    resolved=true
    expect(result.length).toBe(promiseList.length)
    done()
  })
})

test('20 promises; max parallel 3', (done) => {
  expect.assertions(2)
  const numPromises = 20
  const pool = promisePool({
    max_parallel: 3,
    next_promise: function ({index, data}) {
      if (index>=numPromises) return null
      return makePromise((index * 2) + data, randomTimeout())
    },
    next_promise_data: 17
  })
  pool.then(function(result) {
    expect(result.length).toBe(numPromises)
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ context: expect.objectContaining({ index: 0, data: 17 }), result: 17 }),
        expect.objectContaining({ context: expect.objectContaining({ index: 1, data: 17 }), result: 19 }),
        expect.objectContaining({ context: expect.objectContaining({ index: 2, data: 17 }), result: 21 }),
        expect.objectContaining({ context: expect.objectContaining({ index: 3, data: 17 }), result: 23 }),
        expect.objectContaining({ context: expect.objectContaining({ index: 4, data: 17 }), result: 25 }),
        expect.objectContaining({ context: expect.objectContaining({ index: 5, data: 17 }), result: 27 }),
        expect.objectContaining({ context: expect.objectContaining({ index: 6, data: 17 }), result: 29 }),
        expect.objectContaining({ context: expect.objectContaining({ index: 7, data: 17 }), result: 31 }),
        expect.objectContaining({ context: expect.objectContaining({ index: 8, data: 17 }), result: 33 }),
        expect.objectContaining({ context: expect.objectContaining({ index: 9, data: 17 }), result: 35 })
      ])
    )
    done()
  })
})
