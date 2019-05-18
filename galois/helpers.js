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

// radios
const controlbox_width = 600,
     controlbox_height = 100,
     n_grid_x = 7,
     n_grid_y = 9

var controls =
  d3.selectAll(".group-controls").append("svg")
    .attr("class", "group_widgets")

var g = widget.grid(controlbox_width,
                    controlbox_height,
                    n_grid_x,
                    n_grid_y);

var radioblock1 = g.block({x0:10,y0:8,width:6,height:0});

var choices = [5,7,8,11,12,13,16,17,29,23,31,32,61,101]
var c1 = {id:"ns", name:"n", choices: choices, value:1};

var radios1 = [
  widget.radio(c1).size(radioblock1.w()).label("bottom")
  .shape("rect").fontSize(16).orientation("horizontal")
  .update(resetsystem)
]

var rad1 = controls.selectAll(".radio .r1")
  .data(radios1).enter().append(widget.radioElement)
  .attr("transform",function(d,i){ return "translate(620,11)" });  

function resetsystem(){
  gSize = choices[c1.value]
  d3.select('.grid-container').selectAll("*").remove();
  render()
}

render()