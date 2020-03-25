function network_join() {
  const degree = 2

  var svg = d3.select('#network-join'),
      width = +svg.attr("width"),
      height = +svg.attr("height");

  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.source }))
      .force("charge", d3.forceManyBody().strength(degree * -6))
      .force("center", d3.forceCenter(width / 2, height / 2));

  d3.csv("./data/m_m_a_dyn.csv")
    .row(function(d) {
      return {
        source: d.source,
        target: d.target,
        joinNode: d.joinNode,
        fixedPoint: d.fixedPoint,
        dNode: d.dNode
      }
    })

    .get(function(data) {

      function uniq(ary) { return [...new Set(ary)] }

      // prepare graph
      var graph = { 'nodes': uniq(data), 'links': data }
      var numNodes = graph.nodes.length

      var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr('id', function(d) {return d.source + d.target});

      // prepare folded subgraph nodes
      var folded_nodes = uniq(data.map(d => d.joinNode))
      var numFolded = folded_nodes.length

      // prepare unit of folded subgraph nodes
      var diagonal_nodes = []
      data.forEach(function(d) {
        if (d.dNode != 'false') { diagonal_nodes.push(d.joinNode) }
      })
      var numIncl = diagonal_nodes.length

      // color and place nodes
      var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(data)
        .enter().append("circle")
          .attr('id', function(d) { return d.source })
          .attr("r", degree * 3) // size of nodes
          .attr('fill', function(d, i) { // color nodes

            let ii = folded_nodes.indexOf(d.joinNode)
            let diag_index = diagonal_nodes.indexOf(d.joinNode)

            if (diag_index < 0) {
              return d3.interpolatePurples((ii+1)/numFolded)
            } else {
              return d3.interpolateOrRd((numIncl - 1 - diag_index)/numIncl)
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

// export { network }
network_join()