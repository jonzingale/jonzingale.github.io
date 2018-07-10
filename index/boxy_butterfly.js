function drawCircle(context, radius) {
  context.moveTo(radius, 0);
  context.arc(0, 0, radius, 0, 2 * Math.PI);
}

function rando(){
	return Math.floor(Math.random() * 150);
}

function incr(pos, sig) {
  return ((pos > 450) ? -1 : (pos < 0) ? 1 : sig)
}

function butterfly(){
  var data = [[rando(), rando()], [rando(), rando()],
              [rando(), rando()], [rando(), rando()]];

  var lineGenerator = d3.line();
  var pathString = lineGenerator(data);
  d3.select('path[id=butterfly]').attr('d', pathString)
}

function boxy() {

  var elem = d3.selectAll('div[id=animate]').text('HMS Boxy')

  var id = setInterval(frame, 20);
  let pos = 450;
  var sig = 1

  function frame() {
    butterfly()
    sig = incr(pos, sig)
    pos += sig
    d3.selectAll('div[id=animate]').attr('style', `left: ${pos}px; top: 430px`)
  }
}
