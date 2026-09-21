const DATA_URL = "lrg_dynamics.json";

const TRANSITION_MS = 1800;
const SETTLE_MS = 450;
const INITIAL_LAYOUT_TICKS = 360;
const DEFAULT_PLAY_INTERVAL_MS = 3200;

const colors = [
  "#78b7ff", "#8ce0b5", "#f7c86e", "#df9cff", "#ff9f9f",
  "#7fe1dc", "#b2bfef", "#e7a8d7", "#a9dd76", "#ffc5a4",
];

const ui = {
  graph: d3.select("#graph"),
  tooltip: d3.select("#tooltip"),
  timeline: d3.select("#timeline"),
  dateLabel: d3.select("#date-label"),
  subtitle: d3.select("#subtitle"),
  play: d3.select("#play"),
  previous: d3.select("#previous"),
  next: d3.select("#next"),
  speed: d3.select("#speed"),
  resetView: d3.select("#reset-view"),
  frameStats: d3.select("#frame-stats"),
  selectedSecurity: d3.select("#selected-security"),
  showSingletons: d3.select("#show-singletons"),
  showLabels: d3.select("#show-labels"),
  showHulls: d3.select("#show-hulls"),
  freezeLayout: d3.select("#freeze-layout"),
  errorPanel: d3.select("#error-panel"),
  runParameters: d3.select("#run-parameters"),
};

let payload;
let frameIndex = 0;
let timer = null;
let selectedIndex = null;
let graphState;

boot().catch(showError);

async function boot() {
  payload = await d3.json(DATA_URL);
  validatePayload(payload);
  initializeGraph();
  initializeControls();
  renderFrame(0, null, { initial: true });
}

function validatePayload(data) {
  if (!Array.isArray(data.securities) || !Array.isArray(data.frames)) {
    throw new Error("Expected payload.securities and payload.frames arrays.");
  }

  if (!data.frames.length) {
    throw new Error("The JSON payload contains no LRG frames.");
  }
}

function initializeGraph() {
  const GRAPH_HEIGHT = 720;
  const bounds = ui.graph.node().getBoundingClientRect();
  const width = Math.max(760, Math.floor(bounds.width));
  const height = GRAPH_HEIGHT;

  ui.graph
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("width", width)
    .attr("height", height)
    .attr("preserveAspectRatio", "xMidYMid meet");

  const viewport = ui.graph.append("g").attr("class", "viewport");
  const hullLayer = viewport.append("g").attr("class", "hulls");
  const linkLayer = viewport.append("g").attr("class", "links");
  const nodeLayer = viewport.append("g").attr("class", "nodes");

  const nodes = payload.securities.map((ticker, index) => ({
    index,
    ticker,
    x: width / 2 + seededOffset(index, 220),
    y: height / 2 + seededOffset(index + 137, 220),
    vx: 0,
    vy: 0,
    fx: null,
    fy: null,
    degree: 0,
    component: -1,
    componentSize: 1,
    visible: true,
    entered: false,
    exited: false,
    targetX: width / 2,
    targetY: height / 2,
    targetStrength: 0.01,
  }));

  const linkForce = d3.forceLink()
    .id(node => node.index)
    .distance(link => link.currentDistance)
    .strength(link => link.currentStrength);

  const simulation = d3.forceSimulation(nodes)
    .force("link", linkForce)
    .force(
      "charge",
      d3.forceManyBody().strength(node => (
        node.componentSize > 1 ? -36 : -10
      )),
    )
    .force(
      "collide",
      d3.forceCollide()
        .radius(node => nodeRadius(node) + 3)
        .iterations(2),
    )
    .force(
      "x",
      d3.forceX(node => node.targetX)
        .strength(node => node.targetStrength),
    )
    .force(
      "y",
      d3.forceY(node => node.targetY)
        .strength(node => node.targetStrength),
    )
    .velocityDecay(0.31)
    .alphaDecay(0.018)
    .on("tick", ticked);

  graphState = {
    width,
    height,
    viewport,
    hullLayer,
    linkLayer,
    nodeLayer,
    nodes,
    currentLinks: [],
    renderedLinks: [],
    componentRecords: [],
    componentTargets: new Map(),
    simulation,
    linkForce,
    transitionStartedAt: null,
    transitionTimer: null,
    zoom: d3.zoom()
      .scaleExtent([0.35, 4])
      .on("zoom", event => viewport.attr("transform", event.transform)),
  };

  ui.graph.call(graphState.zoom);

  ui.graph.on("click", () => {
    selectedIndex = null;
    updateSelection();
  });
}

function initializeControls() {
  ui.timeline
    .attr("max", payload.frames.length - 1)
    .on("input", event => {
      stopPlayback();
      renderFrame(Number(event.target.value), frameIndex);
    });

  ui.previous.on("click", () => {
    stopPlayback();
    renderFrame(Math.max(0, frameIndex - 1), frameIndex);
  });

  ui.next.on("click", () => {
    stopPlayback();
    renderFrame(
      Math.min(payload.frames.length - 1, frameIndex + 1),
      frameIndex,
    );
  });

  ui.play.on("click", () => {
    if (timer) {
      stopPlayback();
    } else {
      startPlayback();
    }
  });

  ui.resetView.on("click", resetLayout);
  ui.showSingletons.on("change", () => renderFrame(frameIndex, frameIndex));
  ui.showLabels.on("change", updateLabels);
  ui.showHulls.on("change", updateHulls);
  ui.freezeLayout.on("change", updateFreezeState);

  const lrg = payload.run?.lrg || {};
  const windowConfig = payload.run?.window || [];

  ui.subtitle.text(
    `${payload.securities.length} securities · `
    + `${payload.frames.length} frames · `
    + "continuous candidate-collapse dynamics",
  );

  ui.runParameters.text(
    `tol=${lrg.tol ?? "?"} · `
    + `delta=${lrg.delta ?? "?"} · `
    + `lookback=${windowConfig[0] ?? "?"}y · `
    + `stride=${windowConfig[2] ?? "?"} sessions`,
  );

  ui.speed
    .selectAll("option")
    .remove();

  ui.speed
    .selectAll("option")
    .data([
      { label: "Slow", value: 5200 },
      { label: "Normal", value: DEFAULT_PLAY_INTERVAL_MS },
      { label: "Fast", value: 2200 },
    ])
    .join("option")
    .attr("value", option => option.value)
    .property(
      "selected",
      option => option.value === DEFAULT_PLAY_INTERVAL_MS,
    )
    .text(option => option.label);
}

function renderFrame(nextIndex, previousIndex, options = {}) {
  const previousFrame = previousIndex === null
    ? null
    : payload.frames[previousIndex];
  const currentFrame = payload.frames[nextIndex];
  const previous = previousFrame ? decodeFrame(previousFrame) : null;
  const current = decodeFrame(currentFrame);

  frameIndex = nextIndex;

  applyNodeState(current, previous);
  graphState.currentLinks = current.links;
  graphState.componentRecords = current.componentRecords;

  updateComponentTargets(current);
  updateNodeTargets(current);

  graphState.renderedLinks = buildTransitionLinks(
    current,
    previous,
    options.initial === true,
  );
  graphState.linkForce.links(graphState.renderedLinks);

  graphState.transitionStartedAt = options.initial ? null : performance.now();

  ui.timeline.property("value", frameIndex);
  ui.dateLabel.text(currentFrame.d);

  renderStatistics(currentFrame, current);
  renderLinks();
  renderNodes();
  updateSelection();

  if (options.initial) {
    settleInitialLayout();
    return;
  }

  graphState.simulation
    .alpha(1)
    .alphaTarget(0.13)
    .restart();

  scheduleCooling();
  updateFreezeState();
}

function settleInitialLayout() {
  const { simulation } = graphState;

  simulation.stop();
  simulation.alpha(1);

  for (let tick = 0; tick < INITIAL_LAYOUT_TICKS; tick += 1) {
    simulation.tick();
  }

  simulation.alpha(0);
  graphState.transitionStartedAt = null;
  ticked();
}

function decodeFrame(frame) {
  const nodeCount = payload.securities.length;

  const nodeState = Array.from(
    { length: nodeCount },
    () => ({
      degree: 0,
      component: -1,
      componentSize: 1,
    }),
  );

  const componentRecords = frame.c.map(
    ([members, edgeCount, density], index) => ({
      index,
      members,
      edgeCount,
      density,
    }),
  );

  componentRecords.forEach(component => {
    component.members.forEach(index => {
      nodeState[index].component = component.index;
      nodeState[index].componentSize = component.members.length;
    });
  });

  const links = frame.e.map(
    ([sourceIndex, targetIndex, reducedAdjacency, witnessSimilarity]) => {
      nodeState[sourceIndex].degree += 1;
      nodeState[targetIndex].degree += 1;

      return {
        sourceIndex,
        targetIndex,
        reducedAdjacency,
        witnessSimilarity,
      };
    },
  );

  return {
    nodeState,
    componentRecords,
    links,
  };
}

function applyNodeState(current, previous) {
  graphState.nodes.forEach(node => {
    const nextState = current.nodeState[node.index];
    const priorState = previous?.nodeState[node.index];

    node.degree = nextState.degree;
    node.component = nextState.component;
    node.componentSize = nextState.componentSize;

    node.visible = ui.showSingletons.property("checked")
      || node.componentSize > 1;

    node.entered = Boolean(
      priorState
      && priorState.componentSize === 1
      && nextState.componentSize > 1,
    );

    node.exited = Boolean(
      priorState
      && priorState.componentSize > 1
      && nextState.componentSize === 1,
    );
  });
}

function updateComponentTargets(current) {
  const activeComponents = current.componentRecords.filter(
    component => component.members.length > 1,
  );

  const targets = activeComponents.map(component => {
    const memberNodes = component.members.map(
      index => graphState.nodes[index],
    );

    const centroid = meanPosition(memberNodes) || {
      x: graphState.width / 2,
      y: graphState.height / 2,
    };

    return {
      id: component.index,
      members: component.members,
      size: component.members.length,
      x: centroid.x,
      y: centroid.y,
      homeX: centroid.x,
      homeY: centroid.y,
      vx: 0,
      vy: 0,
    };
  });

  if (targets.length) {
    const componentSimulation = d3.forceSimulation(targets)
      .force(
        "charge",
        d3.forceManyBody()
          .strength(target => -160 - target.size * 18),
      )
      .force(
        "collide",
        d3.forceCollide()
          .radius(target => componentRadius(target.size) + 22)
          .iterations(2),
      )
      .force(
        "x",
        d3.forceX(target => target.homeX).strength(0.025),
      )
      .force(
        "y",
        d3.forceY(target => target.homeY).strength(0.025),
      )
      .stop();

    for (let step = 0; step < 90; step += 1) {
      componentSimulation.tick();
    }
  }

  graphState.componentTargets = new Map(
    targets.map(target => [target.id, target]),
  );
}

function updateNodeTargets(current) {
  const singletonTargetMap = singletonTargets(current.nodeState);

  graphState.nodes.forEach(node => {
    const componentTarget = graphState.componentTargets.get(node.component);

    if (componentTarget) {
      node.targetX = componentTarget.x;
      node.targetY = componentTarget.y;

      node.targetStrength = node.entered
        ? 0.055
        : node.componentSize <= 8
          ? 0.030
          : 0.015;

      return;
    }

    const singletonTarget = singletonTargetMap.get(node.index);

    node.targetX = singletonTarget.x;
    node.targetY = singletonTarget.y;
    node.targetStrength = node.exited ? 0.010 : 0.004;
  });
}

function singletonTargets(nodeState) {
  const singletonIndices = nodeState
    .map((state, index) => ({ state, index }))
    .filter(item => item.state.componentSize === 1)
    .map(item => item.index);

  const targets = new Map();
  const radiusX = graphState.width * 0.44;
  const radiusY = graphState.height * 0.41;

  singletonIndices.forEach((index, position) => {
    const angle = (
      position / Math.max(1, singletonIndices.length)
    ) * Math.PI * 2;

    targets.set(index, {
      x: graphState.width / 2 + Math.cos(angle) * radiusX,
      y: graphState.height / 2 + Math.sin(angle) * radiusY,
    });
  });

  return targets;
}

function buildTransitionLinks(current, previous, initial) {
  const previousByKey = new Map(
    (previous?.links || []).map(link => [linkKey(link), link]),
  );

  const currentByKey = new Map(
    current.links.map(link => [linkKey(link), link]),
  );

  const transitionLinks = [];

  currentByKey.forEach((nextLink, key) => {
    const previousLink = previousByKey.get(key);
    const strength = fullLinkStrength(nextLink);
    const distance = fullLinkDistance(nextLink);

    transitionLinks.push({
      ...nextLink,
      key,
      source: nextLink.sourceIndex,
      target: nextLink.targetIndex,
      status: previousLink ? "persistent" : "added",
      removed: false,
      startStrength: initial || previousLink
        ? (previousLink ? fullLinkStrength(previousLink) : strength)
        : 0.001,
      endStrength: strength,
      startDistance: initial || previousLink
        ? (previousLink ? fullLinkDistance(previousLink) : distance)
        : distance * 1.45,
      endDistance: distance,
      currentStrength: initial || previousLink
        ? (previousLink ? fullLinkStrength(previousLink) : strength)
        : 0.001,
      currentDistance: initial || previousLink
        ? (previousLink ? fullLinkDistance(previousLink) : distance)
        : distance * 1.45,
    });
  });

  if (initial) {
    return transitionLinks;
  }

  previousByKey.forEach((previousLink, key) => {
    if (currentByKey.has(key)) {
      return;
    }

    const strength = fullLinkStrength(previousLink);
    const distance = fullLinkDistance(previousLink);

    transitionLinks.push({
      ...previousLink,
      key,
      source: previousLink.sourceIndex,
      target: previousLink.targetIndex,
      status: "removed",
      removed: true,
      startStrength: strength,
      endStrength: 0.001,
      startDistance: distance,
      endDistance: distance * 1.60,
      currentStrength: strength,
      currentDistance: distance,
    });
  });

  return transitionLinks;
}

function updateTransitionForces() {
  if (graphState.transitionStartedAt === null) {
    return;
  }

  const elapsed = performance.now() - graphState.transitionStartedAt;
  const progress = Math.min(1, elapsed / TRANSITION_MS);
  const eased = d3.easeCubicInOut(progress);

  graphState.renderedLinks.forEach(link => {
    link.currentStrength = interpolate(
      link.startStrength,
      link.endStrength,
      eased,
    );

    link.currentDistance = interpolate(
      link.startDistance,
      link.endDistance,
      eased,
    );
  });

  graphState.linkForce
    .distance(link => link.currentDistance)
    .strength(link => link.currentStrength);

  if (progress < 1) {
    return;
  }

  graphState.renderedLinks = graphState.renderedLinks.filter(
    link => !link.removed,
  );

  graphState.linkForce.links(graphState.renderedLinks);
  graphState.transitionStartedAt = null;
  renderLinks();
}

function scheduleCooling() {
  if (graphState.transitionTimer) {
    window.clearTimeout(graphState.transitionTimer);
  }

  graphState.transitionTimer = window.setTimeout(() => {
    graphState.simulation.alphaTarget(0);
  }, TRANSITION_MS + SETTLE_MS);
}

function renderStatistics(frame, current) {
  const [
    edgeCount,
    componentCount,
    singletonCount,
    largestSize,
    delta,
    cutoff,
    gaps,
  ] = frame.s;

  const nonSingletons = current.componentRecords.filter(
    component => component.members.length > 1,
  );

  const meanDensity = nonSingletons.length
    ? d3.mean(nonSingletons, component => component.density)
    : 0;

  const rows = [
    ["Window end", frame.d],
    ["Frame", `${frameIndex + 1} / ${payload.frames.length}`],
    ["Edges", formatNumber(edgeCount)],
    ["Components", formatNumber(componentCount)],
    ["Singletons", formatNumber(singletonCount)],
    ["Largest bubble", formatNumber(largestSize)],
    ["Mean bubble density", d3.format(".3f")(meanDensity)],
    ["Delta", formatNumber(delta)],
    ["Cutoff eigenvalue", d3.format(".4f")(cutoff)],
    ["Low-mode gaps", gaps.length ? gaps.join(", ") : "—"],
  ];

  const rowSelection = ui.frameStats
    .selectAll(".stat-row")
    .data(rows, row => row[0])
    .join(enter => {
      const row = enter.append("div").attr("class", "stat-row");
      row.append("dt");
      row.append("dd");
      return row;
    });

  rowSelection.select("dt").text(row => row[0]);
  rowSelection.select("dd").text(row => row[1]);
}

function renderLinks() {
  const visibleLinks = graphState.renderedLinks.filter(link => {
    const source = graphState.nodes[link.sourceIndex];
    const target = graphState.nodes[link.targetIndex];

    return source.visible && target.visible;
  });

  graphState.linkSelection = graphState.linkLayer
    .selectAll("line.link")
    .data(visibleLinks, link => `${link.key}-${link.status}`)
    .join(
      enter => enter
        .append("line")
        .attr("class", "link")
        .style("opacity", 0),
      update => update,
      exit => exit
        .transition()
        .duration(180)
        .style("opacity", 0)
        .remove(),
    )
    .attr("stroke", linkColor)
    .attr("stroke-width", linkWidth)
    .attr("stroke-opacity", linkOpacity)
    .attr(
      "stroke-dasharray",
      link => link.status === "removed" ? "5,3" : null,
    )
    .on("mouseenter", showLinkTooltip)
    .on("mousemove", moveTooltip)
    .on("mouseleave", hideTooltip);

  graphState.linkSelection
    .transition()
    .duration(180)
    .style(
      "opacity",
      link => link.status === "added" ? 0.95 : 1,
    );
}

function renderNodes() {
  const visibleNodes = graphState.nodes.filter(node => node.visible);

  graphState.nodeSelection = graphState.nodeLayer
    .selectAll("g.node")
    .data(visibleNodes, node => node.index)
    .join(
      enter => {
        const group = enter
          .append("g")
          .attr("class", "node")
          .style("opacity", 0);

        group.append("circle");
        group.append("text");

        return group;
      },
      update => update,
      exit => exit
        .transition()
        .duration(180)
        .style("opacity", 0)
        .remove(),
    )
    .classed("connected", node => node.degree > 0)
    .classed("entered", node => node.entered)
    .classed("exited", node => node.exited)
    .on("click", (event, node) => {
      event.stopPropagation();

      selectedIndex = selectedIndex === node.index
        ? null
        : node.index;

      updateSelection();
    })
    .on("mouseenter", showNodeTooltip)
    .on("mousemove", moveTooltip)
    .on("mouseleave", hideTooltip)
    .call(
      d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded),
    );

  graphState.nodeSelection
    .transition()
    .duration(180)
    .style("opacity", 1);

  graphState.nodeSelection
    .select("circle")
    .attr("r", nodeRadius)
    .attr("fill", nodeColor);

  graphState.nodeSelection
    .select("text")
    .text(node => node.ticker)
    .attr("dy", node => -(nodeRadius(node) + 5));

  updateLabels();
  updateHulls();
}

function updateHulls() {
  if (!graphState) {
    return;
  }

  const components = graphState.componentRecords
    .filter(component => component.members.length > 1)
    .filter(component => component.members.some(
      index => graphState.nodes[index].visible,
    ));

  graphState.hullSelection = graphState.hullLayer
    .selectAll("path.hull")
    .data(
      ui.showHulls.property("checked") ? components : [],
      component => component.index,
    )
    .join(
      enter => enter.append("path").attr("class", "hull"),
      update => update,
      exit => exit.remove(),
    )
    .attr("fill", component => componentColor(component.index))
    .attr("stroke", component => componentColor(component.index));

  positionHulls();
}

function updateLabels() {
  if (!graphState?.nodeSelection) {
    return;
  }

  const showAll = ui.showLabels.property("checked");

  graphState.nodeSelection
    .select("text")
    .style(
      "display",
      node => (
        showAll
        || node.degree > 0
        || node.index === selectedIndex
      ) ? null : "none",
    );
}

function updateSelection() {
  if (!graphState?.nodeSelection) {
    return;
  }

  const selected = selectedIndex === null
    ? null
    : graphState.nodes[selectedIndex];

  const neighborIndices = new Set();

  if (selected) {
    graphState.currentLinks.forEach(link => {
      if (link.sourceIndex === selected.index) {
        neighborIndices.add(link.targetIndex);
      }

      if (link.targetIndex === selected.index) {
        neighborIndices.add(link.sourceIndex);
      }
    });
  }

  graphState.nodeSelection
    .classed("selected", node => node.index === selectedIndex)
    .classed("neighbor", node => neighborIndices.has(node.index))
    .classed(
      "dimmed",
      node => (
        selected
        && node.index !== selectedIndex
        && !neighborIndices.has(node.index)
      ),
    );

  graphState.linkSelection
    ?.classed(
      "incident",
      link => selected && (
        link.sourceIndex === selectedIndex
        || link.targetIndex === selectedIndex
      ),
    )
    .classed(
      "dimmed",
      link => selected && (
        link.sourceIndex !== selectedIndex
        && link.targetIndex !== selectedIndex
      ),
    );

  if (!selected) {
    ui.selectedSecurity
      .attr("class", "selection empty")
      .text("Click a security to inspect its actual candidate-collapse links.");

    return;
  }

  const incidentLinks = graphState.currentLinks
    .filter(
      link => (
        link.sourceIndex === selected.index
        || link.targetIndex === selected.index
      ),
    )
    .sort(
      (left, right) => right.witnessSimilarity - left.witnessSimilarity,
    );

  const component = graphState.componentRecords[selected.component];

  const panel = ui.selectedSecurity.attr("class", "selection");
  panel.html("");

  panel
    .append("div")
    .attr("class", "ticker")
    .text(selected.ticker);

  panel.append("div").text(
    `Degree ${selected.degree} · bubble size ${selected.componentSize}`,
  );

  panel.append("div").text(
    component && component.members.length > 1
      ? `Members: ${component.members
        .map(index => payload.securities[index])
        .join(", ")}`
      : "Isolated in this frame.",
  );

  if (incidentLinks.length) {
    panel.append("div").text("Actual links:");

    const list = panel.append("ul");

    list
      .selectAll("li")
      .data(incidentLinks)
      .join("li")
      .text(link => {
        const otherIndex = link.sourceIndex === selected.index
          ? link.targetIndex
          : link.sourceIndex;

        return (
          `${payload.securities[otherIndex]} · `
          + `J=${d3.format(".3f")(link.witnessSimilarity)} · `
          + `R=${d3.format(".4f")(link.reducedAdjacency)}`
        );
      });
  }
}

function ticked() {
  updateTransitionForces();

  if (!graphState?.nodeSelection || !graphState?.linkSelection) {
    return;
  }

  graphState.linkSelection
    .attr("x1", link => graphState.nodes[link.sourceIndex].x)
    .attr("y1", link => graphState.nodes[link.sourceIndex].y)
    .attr("x2", link => graphState.nodes[link.targetIndex].x)
    .attr("y2", link => graphState.nodes[link.targetIndex].y);

  graphState.nodeSelection
    .attr(
      "transform",
      node => `translate(${node.x},${node.y})`,
    );

  positionHulls();
}

function positionHulls() {
  if (!graphState?.hullSelection) {
    return;
  }

  graphState.hullSelection.attr("d", component => {
    const points = component.members
      .map(index => graphState.nodes[index])
      .filter(node => node.visible)
      .map(node => [node.x, node.y]);

    if (points.length < 2) {
      return null;
    }

    if (points.length === 2) {
      return capsulePath(points[0], points[1], 25);
    }

    const hull = d3.polygonHull(points);

    return hull
      ? roundedHullPath(hull, 20)
      : null;
  });
}

function startPlayback() {
  if (payload.frames.length < 2) {
    return;
  }

  ui.play.text("Pause");

  timer = window.setInterval(() => {
    const nextIndex = frameIndex + 1 >= payload.frames.length
      ? 0
      : frameIndex + 1;

    renderFrame(nextIndex, frameIndex);
  }, Number(ui.speed.property("value")));
}

function stopPlayback() {
  if (timer) {
    window.clearInterval(timer);
    timer = null;
  }

  ui.play.text("Play");
}

function resetLayout() {
  graphState.nodes.forEach(node => {
    node.fx = null;
    node.fy = null;
    node.x = graphState.width / 2 + seededOffset(node.index, 220);
    node.y = graphState.height / 2 + seededOffset(node.index + 137, 220);
    node.vx = 0;
    node.vy = 0;
  });

  const current = decodeFrame(payload.frames[frameIndex]);
  updateComponentTargets(current);
  updateNodeTargets(current);

  graphState.simulation.stop();
  graphState.simulation.alpha(1);

  for (let tick = 0; tick < INITIAL_LAYOUT_TICKS; tick += 1) {
    graphState.simulation.tick();
  }

  graphState.simulation.alpha(0);
  ticked();
}

function updateFreezeState() {
  if (!graphState) {
    return;
  }

  if (ui.freezeLayout.property("checked")) {
    graphState.simulation.stop();
  } else if (graphState.transitionStartedAt !== null) {
    graphState.simulation.alpha(0.5).restart();
  }
}

function dragStarted(event, node) {
  if (!event.active && !ui.freezeLayout.property("checked")) {
    graphState.simulation.alphaTarget(0.22).restart();
  }

  node.fx = node.x;
  node.fy = node.y;
}

function dragged(event, node) {
  node.fx = event.x;
  node.fy = event.y;
}

function dragEnded(event, node) {
  if (!event.active && !ui.freezeLayout.property("checked")) {
    graphState.simulation.alphaTarget(0);
  }

  if (!ui.freezeLayout.property("checked")) {
    node.fx = null;
    node.fy = null;
  }
}

function showNodeTooltip(event, node) {
  const status = node.entered
    ? "entered a bubble"
    : node.exited
      ? "became isolated"
      : "persistent state";

  ui.tooltip
    .html(
      `<strong>${node.ticker}</strong><br>`
      + `degree: ${node.degree}<br>`
      + `bubble size: ${node.componentSize}<br>`
      + status,
    )
    .property("hidden", false);

  moveTooltip(event);
}

function showLinkTooltip(event, link) {
  const status = link.status === "added"
    ? "new edge"
    : link.status === "removed"
      ? "removed edge"
      : "persistent edge";

  ui.tooltip
    .html(
      `<strong>${payload.securities[link.sourceIndex]}`
      + ` — ${payload.securities[link.targetIndex]}</strong><br>`
      + `${status}<br>`
      + `witness Jaccard: ${d3.format(".4f")(link.witnessSimilarity)}<br>`
      + `reduced adjacency: ${d3.format(".6f")(link.reducedAdjacency)}`,
    )
    .property("hidden", false);

  moveTooltip(event);
}

function moveTooltip(event) {
  const panelBounds = ui.graph.node().parentElement.getBoundingClientRect();

  ui.tooltip
    .style("left", `${event.clientX - panelBounds.left + 14}px`)
    .style("top", `${event.clientY - panelBounds.top + 14}px`);
}

function hideTooltip() {
  ui.tooltip.property("hidden", true);
}

function nodeRadius(node) {
  if (node.componentSize === 1) {
    return 2.5;
  }

  return Math.min(
    10,
    3.5 + Math.sqrt(node.degree || 1) * 1.7,
  );
}

function nodeColor(node) {
  if (node.entered) {
    return "#f9c74f";
  }

  if (node.exited) {
    return "#f28482";
  }

  return node.componentSize > 1
    ? componentColor(node.component)
    : "#60708e";
}

function componentColor(componentIndex) {
  return colors[componentIndex % colors.length];
}

function linkColor(link) {
  if (link.status === "added") {
    return "#76e6a8";
  }

  if (link.status === "removed") {
    return "#ff8295";
  }

  return "#7c8caf";
}

function linkWidth(link) {
  return 0.6 + Math.min(2.8, link.witnessSimilarity * 2.1);
}

function linkOpacity(link) {
  if (link.status === "added") {
    return 0.9;
  }

  if (link.status === "removed") {
    return 0.8;
  }

  return 0.17 + Math.min(
    0.7,
    link.witnessSimilarity * 0.7,
  );
}

function fullLinkDistance(link) {
  const tolerance = payload.run?.lrg?.tol ?? 0.7;

  const normalized = Math.max(
    0,
    (link.witnessSimilarity - tolerance)
      / Math.max(0.001, 1 - tolerance),
  );

  return 110 - normalized * 65;
}

function fullLinkStrength(link) {
  const tolerance = payload.run?.lrg?.tol ?? 0.7;

  const normalized = Math.max(
    0,
    (link.witnessSimilarity - tolerance)
      / Math.max(0.001, 1 - tolerance),
  );

  return 0.12 + normalized * 0.50;
}

function componentRadius(size) {
  return 18 + Math.sqrt(size) * 13;
}

function meanPosition(nodes) {
  const x = d3.mean(nodes, node => node.x);
  const y = d3.mean(nodes, node => node.y);

  return Number.isFinite(x) && Number.isFinite(y)
    ? { x, y }
    : null;
}

function linkKey(link) {
  return (
    `${Math.min(link.sourceIndex, link.targetIndex)}`
    + `-${Math.max(link.sourceIndex, link.targetIndex)}`
  );
}

function interpolate(start, end, progress) {
  return start + (end - start) * progress;
}

function deterministicFraction(seed) {
  const value = Math.sin(seed * 999.91 + 17.3) * 10000;
  return value - Math.floor(value);
}

function seededOffset(seed, scale) {
  return (deterministicFraction(seed) - 0.5) * scale;
}

function capsulePath(a, b, padding) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const length = Math.hypot(dx, dy) || 1;
  const nx = (-dy / length) * padding;
  const ny = (dx / length) * padding;

  return [
    `M ${a[0] + nx} ${a[1] + ny}`,
    `L ${b[0] + nx} ${b[1] + ny}`,
    `Q ${b[0] + (dx / length) * padding} `
      + `${b[1] + (dy / length) * padding} `
      + `${b[0] - nx} ${b[1] - ny}`,
    `L ${a[0] - nx} ${a[1] - ny}`,
    `Q ${a[0] - (dx / length) * padding} `
      + `${a[1] - (dy / length) * padding} `
      + `${a[0] + nx} ${a[1] + ny}`,
    "Z",
  ].join(" ");
}

function roundedHullPath(points, padding) {
  const centroid = d3.polygonCentroid(points);

  const expanded = points.map(point => {
    const dx = point[0] - centroid[0];
    const dy = point[1] - centroid[1];
    const length = Math.hypot(dx, dy) || 1;

    return [
      point[0] + (dx / length) * padding,
      point[1] + (dy / length) * padding,
    ];
  });

  return d3.line()
    .curve(d3.curveCatmullRomClosed.alpha(0.65))(expanded);
}

function formatNumber(value) {
  return d3.format(",")(value);
}

function showError(error) {
  console.error(error);

  ui.errorPanel
    .property("hidden", false)
    .text(
      `Could not load ${DATA_URL}.\n\n`
      + `${error.message || error}\n\n`
      + "Serve this directory through a local HTTP server; "
      + "do not open index.html using file://.",
    );

  ui.subtitle.text("Unable to load LRG dynamics JSON.");
}
