
var svg = d3.selectAll('#tree1')
var svg_height = svg.style('height').replace('px','')

var yScale = d3.scaleLinear()
  .domain([0, 1]).range([0, svg_height])

var cScale = d3.scaleLinear()
  .domain([0, 1200]).range([0, 1]) // fix domain to circles

// background box
svg.append('rect')
  .attr('class', 'background-box')
  .attr('x', 1).attr('y', 0)
  .attr('stroke','#777')
  .attr('stroke-width','0.3em')
  .attr('fill','#f5f2e3')
  .attr('width','100%')

var points = [
  [0  , 80],
  [100, 300],
  [300, 200],
  [500, 250],
  [700, 240],
  [900, 280]
];

var lineGenerator = d3.line();
var pathData = lineGenerator(points);
svg.append('path').attr('d', pathData)
.attr('stroke', 'black')
.attr('fill', 'none')

points = [[0, 0],[600, 180],[600, 250],[0, 400]];
pathData = lineGenerator(points);
svg.append('path').attr('d', pathData)
.attr('stroke', 'black')
.attr('stroke-width', '2px')
.attr('fill', 'none')

var dataLines = []
for (let i=0; i < 6; i++) { dataLines.push([i*80 + 80, i*25]) }

svg.selectAll('vertical-lines')
   .data(dataLines).enter()
   .append("path")
   .attr('stroke', 'black')
   .attr('stroke-width', 20)
   .attr('fill', 'none')
   .attr('d', function(d, i) {
      let pathData = lineGenerator([d, [i*80 + 80, svg_height - i*20]])
      return(pathData)
    })

svg.selectAll('vertical-lines')
   .data(dataLines).enter()
   .append("path")
   .attr('stroke', '#ddd')
   .attr('stroke-width', 10)
   .attr('fill', 'none')
   .attr('d', function(d, i) {
      let pathData = lineGenerator([d, [i*80 + 75, svg_height - i*20]])
      return(pathData)
    })

svg.selectAll('vertical-lines')
   .data(dataLines).enter()
   .append("path")
   .attr('stroke', '#86b3b9')
   .attr('stroke-width', 4)
   .attr('fill', 'none')
   .attr('d', function(d, i) {
      let pathData = lineGenerator([d, [i*80 + 80, svg_height - i*20]])
      return(pathData)
    })


// circles
dataCircles = []
for (let i=0; i < 400; i++) { dataCircles.push(i)}

svg.append("g")
  .attr("class", "tree-circles")
  .selectAll("circle")
  .data(dataCircles).enter().append("circle")
    .attr("r", function(d) { return Math.random()*25 })
    .attr('cy', function(d) { return yScale(Math.random())/2.2})
    .attr('cx', function(d) { return Math.random()*550 }) //end of trees
    .attr('fill', function(d) { return d3.interpolateGreens(cScale(d)) })
    .attr("opacity", function(d) { return Math.random() + 0.65 })
    .attr('stroke', 'black')
    .attr('stroke-width', '1.5px')

