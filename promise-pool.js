function promisePool({max_parallel, next_promise, next_promise_data, threads, promises, context_data}) {
  var promises_generator = promises || next_promise
  var self = {
    threads: max_parallel || threads,
    started: 0,
    ended: 0,
    promises_generator: Array.isArray(promises_generator) ? [...promises_generator] : promises_generator,
    next_promise_data: next_promise_data || context_data,
    results: []
  }
  self.live = self.threads
  var promise = new Promise(function(resolve, _reject) {
    function startNext(self, thread) {
      const context = {
        index: self.started,
        thread,
        data: self.next_promise_data,
        ended: false
      }
      let next = null
      if (promises_generator.next) next = promises_generator.next().value
      else if (Array.isArray(self.promises_generator)) next = self.promises_generator.shift()
      else next = self.promises_generator({ index: self.started, data: self.next_promise_data })
      if (next && next.then) {
        self.started += 1
        //console.log('promise ' + JSON.stringify(context))
        next.then(function(result) {
          context.ended = self.ended
          self.ended += 1
          //console.log(`promise ${context.index} resolved`)
          self.results[context.index] = { context, promise: next, result: result }
          startNext(self, thread)
        }).catch(function(err) {
          context.ended = self.ended
          self.ended += 1
          //console.log(`promise ${context.index} rejected`)
          self.results[context.index] = { context, promise: next, error: err }
          startNext(self, thread)
        })
      } else {
        self.live -= 1
        if (self.live <= 0) {
          resolve(self.results)
        }
      }
    }
    for (var i=0; i<self.threads; i+=1) {
      startNext(self, i)
    }
  })
  promise.poolState = self
  return promise
}

module.exports = promisePool
