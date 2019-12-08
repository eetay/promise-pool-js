const promisePool = require('tiny-promise-pool')
const visualize = require('tiny-promise-pool/promise-pool-visualize')
const pool = promisePool({
    threads: 2,
    promises: [ Promise.resolve(2), Promise.resolve(1), Promise.resolve(0) ],
})
pool.then(visualize).then(result => console.log('OK'))
