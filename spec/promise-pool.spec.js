jest.setTimeout(120000)
process.on('unhandledRejection', function(error, promise) {
    console.error('UNHANDLED REJECTION - Promise: ', promise, ', Error: ', error, ').');
})
var promisePool = require('../promise-pool.js')

test('20 promises; max parallel 3', () => {
  //expect.assertions(1)
  var p = promisePool({
    next_promise_data: 17,
    max_parallel: 3,
    next_promise: function ({index, data}) {
      if (index>=20) return null
      return new Promise(function(res, _rej) {
        res(index*2 + data)
      })
    }
  })
  p.then(function(res) {
    expect(res.length).toBe(20)
    expect(res).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ init: { index: 0, data: 17 }, result: 17 }),
        expect.objectContaining({ init: { index: 1, data: 17 }, result: 19 }),
        expect.objectContaining({ init: { index: 2, data: 17 }, result: 21 }),
        expect.objectContaining({ init: { index: 3, data: 17 }, result: 23 }),
        expect.objectContaining({ init: { index: 4, data: 17 }, result: 25 }),
        expect.objectContaining({ init: { index: 5, data: 17 }, result: 27 }),
        expect.objectContaining({ init: { index: 6, data: 17 }, result: 29 }),
        expect.objectContaining({ init: { index: 7, data: 17 }, result: 31 }),
        expect.objectContaining({ init: { index: 8, data: 17 }, result: 33 }),
        expect.objectContaining({ init: { index: 9, data: 17 }, result: 35 })
      ])
    )
  })
})
