function normalize(array) {
  var total = array.reduce((a, item) => a += item.percent, 0)

  array.forEach(function(item, i) {
    item['percent'] = item.percent/total * 100
  })
}
