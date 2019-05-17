var myScale = d3.scaleLinear()
  .domain([0, 10])
  .range([0, 600]);

function pp(data) {
  console.log(JSON.stringify(data))
}

function mod(a,b){ return(((a % b) + b) % b) }
function div(a,b){ return Math.floor(a/b) }

function range(n, ary=[]) {
  for (i=0; i < n; i++) { ary.push(i) }
  return ary
}