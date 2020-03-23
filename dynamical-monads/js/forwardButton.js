var forwardButton = d3.selectAll('.forward-button')
  .append('svg').attr('width', 70).attr('height', 50)

forwardButton
  .append('circle').style('fill','#fff')
  .attr("cx", 21).attr("cy", 21).attr("r", 20)
  .style('stroke','black').attr("stroke-width", 2)

forwardButton
  .append('line')
  .style('stroke','black').attr("stroke-width", 2)
  .attr('x1', 10).attr('y1', 4)
  .attr('x2', 10).attr('y2', 37)

forwardButton
  .append('line')
  .style('stroke','black').attr("stroke-width", 2)
  .attr('x1', 10).attr('y1', 4)
  .attr('x2', 40).attr('y2', 20)

forwardButton
  .append('line')
  .style('stroke','black').attr("stroke-width", 2)
  .attr('x1', 40).attr('y1', 20)
  .attr('x2', 10).attr('y2', 37)