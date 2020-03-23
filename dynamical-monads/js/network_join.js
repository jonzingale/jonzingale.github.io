function network_join() {
  var svg = d3.select('#network-join'),
      width = +svg.attr("width"),
      height = +svg.attr("height");

  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody().strength(
        function(d){ return -d.degree * 0.8 } )
      )
      .force("center", d3.forceCenter(width / 2, height / 2));

  d3.csv("m_m_a.csv")
    .row(function(d) { return { source: d.src, target: d.tgt } })
    .get(function(data) {

      function uniq(ary) { return [...new Set(ary)] }

      function get_nodes(data) {
        let nodes = []
        data.forEach(d => nodes = nodes.concat([d.source, d.target]))
        nodes = uniq(nodes).map(n => ({ 'id': n, 'degree': 1 }))
        return nodes
      }

      // prepare graph
      var graph = { 'nodes': get_nodes(data), 'links': data }
      var numNodes = graph.nodes.length

      // prepare folded subgraph
      var folded = uniq(graph.nodes.map(d => d.id[0]+d.id[3]))
      var numIncl = folded.length

      var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr('id', function(d) {return d.source+d.target});

      // color and place nodes
      var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
          .attr('id', function(d) { return d.id })
          .attr("r", function(d) { return d.degree * 3 }) // size of nodes
          .attr('fill', function(d, i) { // color nodes
            let ii = folded.indexOf(d.id[0] + d.id[3])
            return d3.interpolatePurples((numIncl - ii)/numIncl)
            // return d3.interpolateOrRd((numIncl - ii)/numIncl)
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