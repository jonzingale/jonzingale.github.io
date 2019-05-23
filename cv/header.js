var headerRect = header
  .append('rect').attr('class','header-rect')
  .attr('x', 2).attr('y',2)
  .attr("width", '28em')
  .attr("height", '10em')
  .attr('fill', 'none')
  // .attr('stroke', '#888')
  // .attr('stroke-width', '2px')

var headerData = [
  { text: 'Jonathan S. Zingale | Software Developer', size: '22px', x: 18, y: 45},
  { text: 'Santa Fe, New Mexico',  size: '18px', x: 18, y: 79},
  // { text: 'jonzingale@gmail.com', size: '18px', x: 240, y: 80},
  { text: 'jonzingale@gmail.com',  size: '18px', x: 18, y: 105},
  { text: '505.795.7792', size: '18px', x: 18, y: 134},
]

header.selectAll('.header-text')
  .data(headerData).enter()
  .append('text')
  .attr('x', function(d) { return d.x})
  .attr('y', function(d) { return d.y})
  .attr("font-size", function(d) { return d.size })
  .attr('font-family', 'arial')
  // .attr('font-family', 'Merriweather')
  .attr('fill', '#333')
  .text(function(d) { return d.text})
