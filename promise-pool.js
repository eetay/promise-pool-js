function promisePool({max_parallel, next_promise, next_promise_data}) {
  var grand_promise = new Promise(function(resolve, _reject) {
    var self = this
    self.max = max_parallel
    self.so_far = 0
    self.incomplete = 0
    self.next_promise_data = next_promise_data
    self.results = []
    function startNext(self, thread) {
      var context = {
        index: self.so_far,
        thread,
        data: self.next_promise_data
      }
      var next = next_promise({ index: self.so_far, data: self.next_promise_data })
      self.so_far += 1
      if (next === null) {
        resolve(self.results)
      } else {
        //console.log('promise ' + JSON.stringify(context))
        next.then(function(result) {
          //console.log('promise resolved')
          self.results.push({ context, promise: next, result: result })
          startNext(self, thread)
        }).catch(function(err) {
          //console.log('promise rejected')
          self.results.push({ context, promise: next, error: err })
          startNext(self, thread)
        })
      }
    }
    for (var i=0; i<self.max; i+=1) {
      startNext(self, i)
    }
  })

  return grand_promise
}

module.exports = promisePool
