var backButton = d3.selectAll('.back-button')
  .append('svg').attr('width', 70).attr('height', 53)
  .append('a').attr('href', function(d) { return '/' })

backButton
  .append('circle').style('fill','#fff')
  .attr("cx", 21).attr("cy", 31).attr("r", 20)
  .style('stroke','black').attr("stroke-width", 2)

backButton
  .append('line')
  .style('stroke','black').attr("stroke-width", 2)
  .attr('x1', 31).attr('y1', 14)
  .attr('x2', 31).attr('y2', 47)

backButton
  .append('line')
  .style('stroke','black').attr("stroke-width", 2)
  .attr('x1', 31).attr('y1', 14)
  .attr('x2', 2).attr('y2', 30)

backButton
  .append('line')
  .style('stroke','black').attr("stroke-width", 2)
  .attr('x1', 2).attr('y1', 30)
  .attr('x2', 31).attr('y2', 47)