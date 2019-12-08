function promisePool({max_parallel, next_promise, next_promise_data, threads, promises, max_rejected, context_data}) {
  var promises_generator = promises || next_promise
  var self = {
    threads: max_parallel || threads,
    max_rejected,
    started: 0,
    rejected: 0,
    ended: 0,
    last_started: false,
    promises_generator: Array.isArray(promises_generator) ? [...promises_generator] : promises_generator,
    next_promise_data: next_promise_data || context_data,
    results: []
  }
  self.live = self.threads
  var promise = new Promise(function(resolve, reject) {
    function startNext(self, thread) {
      console.log(`${self.next_promise_data} => try next`)
      const context = {
        index: self.started,
        thread,
        data: self.next_promise_data,
        ended: false
      }
      let next
      if (self.last_started) next = null
      else if (promises_generator.next) next = promises_generator.next({ index: self.started, data: self.next_promise_data }).value
      else if (Array.isArray(self.promises_generator)) next = self.promises_generator.shift()
      else next = self.promises_generator({ index: self.started, data: self.next_promise_data })
      if (next && next.then) {
        self.started += 1
        //console.log('promise ' + JSON.stringify(context))
        next.then(function(result) {
          context.ended = self.ended
          self.ended += 1
          console.log(`${self.next_promise_data}: promise ${context.index} resolved`)
          self.results[context.index] = { context, promise: next, result: result }
          startNext(self, thread)
        }).catch(function(err) {
          context.ended = self.ended
          self.rejected += 1
          self.ended += 1
          //console.log(`promise ${context.index} rejected; rejected ${self.rejected}/${self.max_rejected} so far; `)
          self.results[context.index] = { context, promise: next, error: err }
          if (self.max_rejected >= 0 && (self.rejected > self.max_rejected)) {
            //console.log('TOO MANY REJECTED')
            self.last_started = true
            self.live -= 1
	    reject(self.results)
          } else {
            startNext(self, thread)
          }
        })
      } else {
        console.log(`LAST STARTED; remain: ${self.live} ${self.next_promise_data}`)
        self.last_started = true
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
