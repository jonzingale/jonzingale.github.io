function pp(data) {
  console.log(JSON.stringify(data))
}

function mod(a,b){ return(((a % b) + b) % b) }
function div(a,b){ return Math.floor(a/b) }

var gcd = function(a, b) {
  if ( ! b) { return a }
  return gcd(b, a % b)
};

function range(n, ary=[]) {
  for (i=0; i < n; i++) { ary.push(i) }
  return ary
}

function primitives(p, tot=[]) {
  var phi = range(p).filter(y => gcd(y,p) == 1)

  phi.forEach(function(i) {
    phi.forEach(function(j){
      tot.push(mod(i*j, p)) 
    })
  })

  return tot
}