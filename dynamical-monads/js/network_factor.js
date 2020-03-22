function network_factor() {
  var svg = d3.select('#network-factor'),
      width = +svg.attr("width"),
      height = +svg.attr("height");

  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody().strength(
        function(d){ return -d.degree * 10 } )
      )
      .force("center", d3.forceCenter(width / 2, height / 2));

  d3.csv("graph_factor.csv")
    .row(function(d) { return { source: d.src, target: d.tgt } })
    .get(function(data) {

      function uniq(ary) { return [...new Set(ary)] }

      function get_nodes(data) {
        let nodes = []
        data.forEach(d => nodes.push(d.source))
        data.forEach(d => nodes.push(d.target))
        nodes = uniq(nodes).map(function(n) {
          return ({ 'id': n, 'degree': 4 })
        })

        return nodes
      }

      var graph = { 'nodes': get_nodes(data), 'links': data }

      var numNodes = graph.nodes.length

      var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr('id', function(d) {return d.source+d.target});

      var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
          .attr('id', function(d) { return d.id })
          .attr("r", function(d) { return d.degree * 3 }) // size of nodes
          .attr('fill', function(d, i) { // color nodes
            // return d3.interpolateYlGnBu((numNodes-i)/numNodes)
            return d3.interpolateOrRd((numNodes-i)/numNodes)
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
network_factor()