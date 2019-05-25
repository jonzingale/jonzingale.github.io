// http://nifty.stanford.edu/2014/mccown-schelling-model-segregation/
(function(){
  const L = 130,
        population = L**2,
        world_width = 500,
        kk = Math.ceil(world_width/L), // agent size
        controlbox_width = 500,
        controlbox_height = 380,
        n_grid_x = 24,
        n_grid_y = 24

  var tolerance = 4, // dynamic for tol > 4
      satisfied = 0,
      occupiedBoard,
      freeBoard

  var vacantColor = '#330C00' // darkbrown
  const twoSpecies = ['#80cdc1', 'rgb(255, 214, 162)']
  const lightColors = ['#F56605', '#E53E02', '#365218', '#678459', '#F89115']
  // const darkColors = ['#4E6744','#30402C','#8DA583','#6348D5','#8C80EE',]

  // california poppy
  // const twoSpecies = ['#F9362B','#4F4027', '#F05D3E', '#939D4C', '#BFCB80']
  // ['#736A34','#998A72','#723F20','#DACDB5','#EA9162']

  var agentColors = twoSpecies

  // moore neighborhood
  var moore = [[ 1, -1],[ 1, 0],[ 1, 1],
               [ 0, -1],        [ 0, 1],
               [-1, -1],[-1, 0],[-1, 1]]

  // TODO: biased population distributions
  function createBoard(){
    freeBoard = {}
    occupiedBoard = {}
    
    for (let i = 0; i < L**2; i++) {
      let id = String(i),
          x = i % L,
          y = Math.floor(i/L),
          ptype = Math.floor(Math.random() * agentColors.length)

      if (i < 6) {
        freeBoard[id] = {x: x, y: y, c: vacantColor}
      }
      else {
        occupiedBoard[id] = {x: x, y: y, c: agentColors[ptype]}
      }
    }
  }

  var world = d3.selectAll("#schelling_display").append('canvas')
    .attr('width', world_width)
    .attr('height', world_width)
    .attr("class",'schelling_display')

  var context = world.node().getContext('2d')
  context.fillRect(0, 0, world_width, world_width);

  var happiness = d3.select('#percentHappy')

  var controls = d3.selectAll("#schelling_controls").append("svg")
    .attr("width",controlbox_width)
    .attr("height",controlbox_height-65)
    .attr("class","schelling_widgets")

  // Buttons and Blocks.
  var g = widget.grid(controlbox_width,controlbox_height, n_grid_x, n_grid_y);
  var playblock = g.block({x0:5,y0:16,width:0,height:0});
  var sliderBlock = g.block({x0:2,y0:5,width:10,height:3});
  var buttonblock = g.block({x0:11.5,y0:17,width:4,height:0}).Nx(2);
  var colorBlock = g.block({x0:11,y0:12,width:4,height:0}).Nx(2);

  var sliderwidth = sliderBlock.w();
  var handleSize = 12, trackSize = 8;

  var colorRule = {id:"t1", name: "Species: 5 or 2", value: true};

  var playpause = { id:"b4", name:"run simulation",
                    actions: ["play","pause"], value: 0};

  var tol = {id:"tol", name: "satisfied", nameR: "dissatisfied",
             range: [3,6], value: tolerance};

  var reset = { id:"schellingreset", name:"randomize",
                actions: ["rewind"], value: 0};

  var sliders = [
    widget.slider(tol).width(sliderwidth).trackSize(trackSize)
      .handleSize(handleSize),
  ]

  var toggles = [
    widget.toggle(colorRule).label("bottom").size(15).update(toggleColors)
  ]

  var buttons = [ widget.button(reset).update(resetpositions) ]

  var playbutton = [
    widget.button(playpause).size(g.x(7)).symbolSize(0.6*g.x(7)).update(runpause),
  ]

  controls.selectAll(".toggle").data(toggles).enter()
          .append(widget.toggleElement)
          .attr("transform",function(d,i){
      return "translate("+colorBlock.x(0)+","+colorBlock.y(i)+")"
  });

  controls.selectAll(".slider .block3").data(sliders).enter().append(widget.sliderElement)
    .attr("transform",function(d,i){
      return "translate("+sliderBlock.x(0)+","+sliderBlock.y(i)+")"
    }); 

  controls.selectAll(".button .others").data(buttons).enter().append(widget.buttonElement)
    .attr("transform",function(d,i){return "translate("+buttonblock.x(i)+","+buttonblock.y(0)+")"});  

  controls.selectAll(".button .playbutton").data(playbutton).enter()
          .append(widget.buttonElement)
          .attr("transform", function(d,i){
     return "translate("+playblock.x(0)+","+playblock.y(i)+")"
   });

  var t; // initialize timer
  function runpause(d){ d.value == 1 ? t = d3.timer(schelling,0) : t.stop(); }

  function resetpositions() {
    createBoard()
    schelling()
  }

  function toggleColors(d) {
    if (d.value) {
      agentColors = twoSpecies
      colorRule.value = true
    }
    else {
      agentColors = lightColors
      colorRule.value = false
    } ; resetpositions()
  }

  // Schelling Segregation Code
  var delx; var dely; var fa; var dist; var rental;
  function mod(a){return(((a % L) + L) % L)}

  function nearestAvail(a){
    Object.keys(freeBoard).reduce(function(e, k){
      fa = freeBoard[k]
      fa['id'] = k

      delx = mod(fa.x - a.x)
      dely = mod(fa.y - a.y)
      dist = Math.sqrt(delx**2 + dely**2)
      if (dist < e) { rental = fa ; return(dist) }
      else { return(e) }
    }, Infinity)

    return rental
  }

  function neigh(a) {
    return( // number of similar neighbors
      moore.reduce(function(acc, [i, j]) {
        var nkey = mod(a.x + i) + mod(a.y + j) * L
        var cond = !!(occupiedBoard[nkey]) && (occupiedBoard[nkey].c == a.c)

        if (cond) { return (acc += 1) } else { return acc }
      }, 0)
    )
  }

    function schelling() {
      satisfied = 0

      Object.keys(occupiedBoard).forEach(function(key){
        let agent = occupiedBoard[key]
        if (neigh(agent) < tol.value) {
          // calculate distance from agent to nearest available rental
          newRental = nearestAvail(agent)
          newRental['c'] = agent.c

          // remove occupants and make available as rental
          delete occupiedBoard[key]
          freeBoard[key] = agent

          // move into new rental and remove rental from market
          delete freeBoard[newRental.id]
          occupiedBoard[newRental.id] = newRental
        } else { satisfied += 1 }
      })

      // color occupied board positions
      Object.keys(occupiedBoard).forEach(function(key){
        agent = occupiedBoard[key]
        context.fillStyle = agent.c
        context.fillRect(agent.x * kk, agent.y * kk, kk, kk);
      })

      // color un-occupied board positions
      context.fillStyle = vacantColor
      Object.keys(freeBoard).forEach(function(key){
        let newRental = freeBoard[key]
        context.fillRect(newRental.x * kk, newRental.y * kk, kk, kk);
      })

      percentSatisfied = Math.floor(100 * satisfied / population)
      happiness.text("Percent Happy: "+percentSatisfied+" %")
    }

  // loads Initial conditions
  createBoard()
  schelling()
})()