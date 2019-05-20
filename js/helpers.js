function normalize(array, total=0) {
  var biggest = array[0].percent

  array.forEach(function(item, i){
    array[i]['percent'] = item.percent / biggest
  })
}

function pp(data) {
  console.log(JSON.stringify(data))
}
