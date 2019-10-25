var homeSquare = d3.selectAll('.home-square')
  .append('svg').attr('width', 70).attr('height', 63)
  // .attr("transform", "translate(30)")
  // .append('a').attr('href', function(d) { return '/' })

homeSquare
  .append('circle').style('fill','#fff')
  .attr("cx", 31).attr("cy", 31).attr("r", 28)
  .style('stroke','black').attr("stroke-width", 2)

homeSquare
  .append('line')
  .style('stroke','black').attr("stroke-width", 2)
  .attr('x1', 50).attr('y1', 10)
  .attr('x2', 50).attr('y2', 50)

homeSquare
  .append('line')
  .style('stroke','black').attr("stroke-width", 2)
  .attr('x1', 11).attr('y1', 10)
  .attr('x2', 11).attr('y2', 50)

homeSquare
  .append('line')
  .style('stroke','black').attr("stroke-width", 2)
  .attr('x1', 11).attr('y1', 10)
  .attr('x2', 50).attr('y2', 10)

homeSquare
  .append('line')
  .style('stroke','black').attr("stroke-width", 2)
  .attr('x1', 11).attr('y1', 50)
  .attr('x2', 50).attr('y2', 50)
