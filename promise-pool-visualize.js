function visualize(result) {
  function line(thread, id, threads) {
    var s=''
    const x='  |'
    for (let i=0; i<threads; i+=1) {
      s+= ((i == thread) ? ('   '+id).slice(-x.length) : x)
    }
    return s
  }
  const threads = Math.max(...result.map(x=>x.context.thread)) + 1
  const sorted = [...result].sort((x,y) => (x.context.index - y.context.index))
  const lines = sorted.map((x)=>line(x.context.thread, x.context.index, threads))
  console.log(lines.join('\n'))
  return result
}

module.exports = visualize
