(function(){
  d3.csv("./data/data.csv", function(data) {
    var svg = d3.select('#covid19-totals'),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    var win_width = window.innerWidth
    var svg_width = svg.style('width').replace('px','')

    var column_data = {} // make data useable
    data.columns.forEach(function(col_name) {
      let vals = data.map( rec => rec[col_name] )
      column_data[col_name] = vals
    })

    var numNodes = data.length
    var lineGenerator = d3.line().curve(d3.curveCardinal)

    var xScale = d3.scaleLinear()
      .domain([0, numNodes])
      .range([0, svg_width])

    const headers = ['total cases','deaths','recoveries']

    function max_val(header) {
      return Math.max(...column_data[header])
    }

    headers.forEach(function(header, ci) {
      let timeSeries = column_data[header]

      let yScale = d3.scaleLinear()
        .domain([0, max_val('total cases')])
        .range([120, 0])

      let pathData = lineGenerator(
        timeSeries.map( (y, i) => [xScale(i), 50+yScale(y)] )
      )

      // line data
      var line = svg.append('g')
        .attr("class", "lines")
        .selectAll('line')
        .data(timeSeries)
        .enter().append('path')
        .attr("d", pathData)
        .attr("stroke-width", function() {
          switch(header) {
            case 'total cases':
              return 2
            case 'deaths':
              return 4
            case 'recoveries':
              return 1
          }
        })
        .style('stroke', d3.schemeSet2[ci+1])
        .attr("fill", "none")

      svg.append('text')
        .attr('class', 'label')
        .text(header + `: ${max_val(header)}`)
        .attr("font-size", "25px")
        .attr('stroke', d3.schemeSet2[ci+1])
        .attr("x", 10 + ci*180 )
        .attr("y", 70)
    })

    // date labels
    var dates = column_data['date']
    var thin_dates = []
    var delta = Math.floor(dates.length/8)
    let i = 0 ; for (i = 0; i < dates.length; i=i+delta) {
      thin_dates.push(dates[i])
    }

    var lScale = d3.scaleLinear()
      .domain([0, thin_dates.length + 2])
      .range([0, 900])

    d3.select('#covid19-totals').append('g')
      .attr('class', 'date-label')
      .selectAll('date-labels')
      .data(thin_dates).enter()
      .append('text')
      .text(function(d) { return d })
      .attr("font-size", "10px")
      .attr("x", function(d, i) { return lScale(i) })
      .attr("y", 200)
  });
})()