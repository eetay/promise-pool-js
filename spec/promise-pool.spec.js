var promisePool = require('../promise-pool.js')

test('Array of promises', () => {
  function makePromise(i) {
    return new Promise(function (resolve, _reject) {
      resolve(i)
    })
  }
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
  })
})

test('20 promises; max parallel 3', () => {
  const numPromises = 20
  const pool = promisePool({
    max_parallel: 3,
    next_promise: function ({index, data}) {
      if (index>=numPromises) return null
      return new Promise(function(resolve, _reject) {
        resolve((index * 2) + data)
      })
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
  })
})
