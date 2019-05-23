var skillsRect = skills
  .append('rect').attr('class','skills-rect')
  .attr('x', 2).attr('y','10em')
  .attr("width", '28em')
  .attr("height", '30em')
  .attr('fill', 'none')
  .attr('stroke', '#888')
  .attr('stroke-width', '2px')

const skillsHeaderData = [
  { text: 'Skills', size: '18px', x: 18, y: '12em'},
  { text: 'Technical:', size: '18px', x: 18, y: '14em'},
  { text: 'Soft:', size: '18px', x: 18, y: '17em'},
]

var skillsHeader = skills.selectAll('.skills-header')
  .data(skillsHeaderData).enter()
  .append('text')
  .attr('x', function(d) { return d.x })
  .attr('y', function(d) { return d.y })
  .attr("font-size", function(d) { return d.size })
  .attr('font-family', 'arial')
  .text(function(d) { return d.text})

const skillsData = [
  { header: 'Technical:', size: '18px', x: 18, y: '14em',
    text: 'Haskell, Python ML (Scikit/TensorFlow), Django, React, Ruby on Rails, Linux, Git, SQL, Jupyter Notebook, LaTeX, REST, PureData/Max MSP, Processing, Rspec, QuickCheck and Unit testing. Familiarity with server maintenance, parallel processing, continuous delivery, and the Amazon AWS cloud platform. Talent for writing and editing accurate, robust and efficient code.'
  },
  { header: 'Soft:', size: '18px', x: 18, y: '17em',
    text: 'Focused, organized, and highly productive work habits. Strong resource management and project coordination aptitude. Deadline driven. Clear, patient, and concise communication habits. Strong interests in machine learning, formal verification, cryptography, and mathematical modeling. Autodidact with a strong will for personal, professional, and intellectual development. Proven adaptability and breadth.'
  },
]

var skillsHeader = skills.selectAll('.skills')
  .data(skillsData).enter()
  .append('text')
  .attr('x', function(d) { return d.x})
  .attr('y', function(d) { return d.y})
  .attr("font-size", function(d) { return d.size })
  .attr('font-family', 'arial')
  .text(function(d) { return d.text})