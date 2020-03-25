function network() {
  var svg = d3.select('#network'),
      width = +svg.attr("width"),
      height = +svg.attr("height");

  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.source; }))
      .force("charge", d3.forceManyBody().strength(-50))
      .force("center", d3.forceCenter(width / 2, height / 2));

  d3.csv("./data/m_a_dyn.csv")
    .row(function(d) {
      return {
        source: d.source,
        target: d.target,
        dNode: d.dNode,
        fixedPoint: d.fixedPoint
      }
    })
    .get(function(data) {

      function uniq(ary) { return [...new Set(ary)] }

      // prepare graph
      var graph = { 'nodes': uniq(data), 'links': data }
      var numNodes = graph.nodes.length

      // prepare unit subgraph
      var diagonals = graph.nodes.filter(d => d.dNode != 'false')
      var numIncl = diagonals.length

      var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr('id', function(d) {return d.source + d.target});

      // color and place nodes
      var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
          .attr('id', function(d) { return d.source})
          .attr("r", 8) // size of nodes
          .attr('fill', function(d, i) { // color nodes
            let ii = diagonals.indexOf(d)
            if (ii < 0) {
              return d3.interpolatePurples((i+1)/numNodes)
            } else {
              return d3.interpolateOrRd((numIncl - 1 - ii)/numIncl)
            }
          })
          .attr('stroke-width', function(d) {
            return (d.fixedPoint == 'False' ? '0.5px' : '3px')
          })
          .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

      simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

      simulation.force("link")
        .links(graph.links);

      function ticked() {
        link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

        node
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
      }
    });

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}

network()