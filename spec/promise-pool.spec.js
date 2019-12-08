jest.setTimeout(30000)
var promisePool = require('../promise-pool.js')
var visualize = require('../promise-pool-visualize.js')

function randomTimeout() {
  return Math.floor((Math.random() * 100) + 1)
}

function makePromise(i, timeout = 0, rejectValue = undefined) {
  var context = {}
  var promise = new Promise(function (resolve, reject) {
    setTimeout(() => {
      context.promise.done = true
      rejectValue === undefined ? resolve(i) : reject(rejectValue) 
    }, timeout)
  })
  context.promise = promise
  promise.done = false
  return promise
}

test('Nested promise pools', (done) => {
  expect.assertions(3)
  const secondaryPromiseList = [
    makePromise(2, 20),
    makePromise(3),
    makePromise(4),
    makePromise(5)
  ]
  const secondaryData = 'secondary promise pool'
  const primaryPromiseList = [
    makePromise(0, 100),
    makePromise(1, 10),
    promisePool({
      threads: 2,
      next_promise: secondaryPromiseList,
      next_promise_data: secondaryData
    })
  ]
  const pool = promisePool({
    threads: 3,
    next_promise: primaryPromiseList,
    next_promise_data: 'primary promise pool'
  })
  pool.then(function(result) {
    expect(result.length).toBe(primaryPromiseList.length)
    const secondaryResult = result[2].result
    expect(secondaryResult.length).toBe(secondaryPromiseList.length)
    var secondaryDataResults=[]
    secondaryResult.forEach(function () {
      secondaryDataResults.push(secondaryData)
    })
    expect(secondaryResult.map(x => x.context.data)).toEqual(secondaryDataResults)
    done()
  })
})

test('Generator functions', (done) => {
  expect.assertions(2)
  var total = 10
  function *createPromiseMaker() {
    for (var i=0; i<total; i+=1) {
      yield makePromise(i, randomTimeout())
    }
  }
  const pool = promisePool({
    threads: 3,
    promises: createPromiseMaker()
  })
  pool.then(function(result) {
    expect(result.length).toBe(total)
    expect(result[2].result).toEqual(2)
    done()
  })
})


test('Array of promises, some rejected', (done) => {
  expect.assertions(3)
  const rejectValue = 'REJECTED!!!'
  const promiseList = [
    makePromise(0, 20),
    makePromise(1, 10, rejectValue)
  ]
  const pool = promisePool({
    threads: 3,
    next_promise: promiseList,
  })
  pool.then(function(result) {
    expect(result.length).toBe(promiseList.length)
    expect(result[1].error).toBe(rejectValue)
    expect(result[1].context.ended).toBe(0) // first to finish
    done()
  })
})

test('Array of promises, rejected more than allowed', (done) => {
  expect.assertions(2)
  const rejectValue = 'REJECTED'
  const promiseList = [
    makePromise(0, 1000),
    makePromise(1, 10, rejectValue),
    makePromise(2, 200, rejectValue),
    makePromise(3, 2000),
  ]
  const pool = promisePool({
    threads: 2,
    promises: promiseList,
    max_rejected: 0,
  })
  pool.catch(function(result) {
    console.log('RESULT', result)
    expect(result.length).toBe(2)
    expect(result[1].error).toBe(rejectValue)
  console.log('END #22')
    done()
  })
})

test('Array of promises & order of execution', (done) => {
  expect.assertions(3)
  const promiseList = [
    makePromise(0, 20),
    makePromise(1, 10)
  ]
  const pool = promisePool({
    threads: 3,
    next_promise: promiseList,
    next_promise_data: 'Array of promises & order of execution',
  })
  pool.then(function(result) {
    expect(result.length).toBe(promiseList.length)
    expect(result[1].result).toBe(1)
    expect(result[1].context.ended).toBe(0) // first to finish
    done()
  })
})

test('Array of promises; one is not done yet', (done) => {
  console.log('START #20')
  expect.assertions(6)
  var resolved=false
  const promiseList = [
    makePromise(0, 100),
    makePromise(1, 5000).then(x=>console.log('RESOLVED%%%%%%%%%')),
    makePromise(2, 10),
    makePromise(3, 10)
  ]
  const pool = promisePool({
    threads: 2,
    promises: promiseList,
    context_data: 'Array of promises; one is not done yet'
  })
  setTimeout(()=>{
    expect(promiseList[0].done).toBe(true)
    expect(promiseList[1].done).toBe(false)
    expect(promiseList[2].done).toBe(true)
    expect(promiseList[3].done).toBe(true)
  }, 1000)
  setTimeout(()=>{
    expect(resolved).toBe(false)
  }, 4900)
  pool.then(function(result) {
    console.log('RESOLVED######', result)
    resolved=true
    expect(result.length).toBe(promiseList.length)
    done()
  }).catch( result => {
    console.log('CATCH######', result)
    done()
  })
})

test('20 promises; threads parallel 3', (done) => {
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
  pool.then(visualize).then(function(result) {
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

test('many threads, 0 promises', (done) => {
  expect.assertions(1)
  const pool = promisePool({
    max_parallel: 10,
    promises: []
  })
  pool.then(function(result) {
    expect(result.length).toBe(0)
    done()
  })
})
