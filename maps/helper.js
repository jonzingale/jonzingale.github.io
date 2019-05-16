// Dots along the way
var roadCircles = mainRoad.selectAll('circle')
  .data(mainRoadData).enter().append('circle')
  .attr('cx', function(d){ return d.x})
  .attr('cy', function(d){ return d.y})
  .attr('r', 3).attr('fill', 'black')
