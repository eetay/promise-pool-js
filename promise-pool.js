function promisePool({max_parallel, next_promise, next_promise_data}) {
  var grand_promise = new Promise(function(resolve, reject) {
    var self = this
    self.max = max_parallel
    self.so_far = 0
    self.incomplete = 0
    self.next_promise_data = next_promise_data
    self.results = []
    function startNext(self) {
      var init = {index: self.so_far, data: self.next_promise_data}
      var next = next_promise({index: self.so_far, data: self.next_promise_data})
      self.so_far++
      if (next != null) {
        //console.log('promise ' + JSON.stringify(init))
        next.then(function(result) {
          //console.log('promise resolved')
          self.results.push({init: init, promise: next, result: result})
          startNext(self)
        }).catch(function(err) {
          //console.log('promise rejected')
          self.results.push({init: init, promise: next, error: err})
          startNext(self)
        })
      } else {
        resolve(self.results)
      }
    }
    for (i=0; i<max_parallel; i++) {
      startNext(self)
    }
  })

  return grand_promise
}

module.exports = promisePool
