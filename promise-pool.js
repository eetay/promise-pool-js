function promisePool(options) {
  function PromisePoolResolver({max_parallel, next_promise, next_promise_data, threads}) {
    const self = this
    this.resolver = function(resolve, _reject) {
      self.max = max_parallel || threads
      self.started = 0
      self.ended = 0
      self.next_promise = Array.isArray(next_promise) ? [...next_promise] : next_promise
      self.next_promise_data = next_promise_data
      self.results = []
      function startNext(self, thread) {
        const context = {
          index: self.started,
          thread,
          data: self.next_promise_data,
          ended: false
        }
        const next = Array.isArray(self.next_promise) ? self.next_promise.shift() : self.next_promise({ index: self.started, data: self.next_promise_data })
        self.started += 1
        if (next && next.then) {
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
      self.live = self.max
      for (var i=0; i<self.max; i+=1) {
        startNext(self, i)
      }
    }
  }
  return new Promise(new PromisePoolResolver(options).resolver)
}

module.exports = promisePool
