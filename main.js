var nodes = [
  { id: "p", group: 0, label: "Pop", level: 1 },
  { id: "p1"   , group: 0, label: "I Like It"   , level: 2 },
  { id: "p2"   , group: 0, label: "Boo'd Up"   , level: 2 },
  { id: "p3"   , group: 0, label: "No Tears Left To Cry"  , level: 2 },

  { id: "c", group: 1, label: "Country", level: 1 },
  { id: "c1"   , group: 1, label: "Meant To Be"   , level: 2 },
  { id: "c2"   , group: 1, label: "Mercy"   , level: 2 },

  { id: "hh"  , group: 2, label: "Hip-hop"   , level: 1 },
  { id: "hh1"  , group: 2, label: "In My Feelings"   , level: 2 },
  { id: "hh2"  , group: 2, label: "Sicko Mode"  , level: 2 },

  { id: "r"  , group: 3, label: "Rock"   , level: 1 },
  { id: "r1"  , group: 3, label: "Thunder"   , level: 2 },
  { id: "r2"  , group: 3, label: "Beleiver"  , level: 2 },

  { id: "e"  , group: 4, label: "Electronic"   , level: 1 },
  { id: "e1"  , group: 4, label: "The Middle"   , level: 2 },
  { id: "e2"  , group: 4, label: "One Kiss"  , level: 2 }
];

var links = [
  { target: "p", source: "c", strength: 0.1 },
  { target: "c", source: "hh", strength: 0.1 },
  { target: "hh", source: "r", strength: 0.1 },
  { target: "r", source: "e", strength: 0.1 },
  { target: "e", source: "p", strength: 0.1 },

  { target: "p", source: "p1", strength: 0.5 },
  { target: "p", source: "p2", strength: 0.5 },
  { target: "p", source: "p3", strength: 0.5 },

  { target: "c", source: "c1", strength: 0.5 },
  { target: "c", source: "c2", strength: 0.5 },

  { target: "hh", source: "hh1", strength: 0.5 },
  { target: "hh", source: "hh2", strength: 0.5 },
  
  { target: "r", source: "r1", strength: 0.5 },
  { target: "r", source: "r2", strength: 0.5 },
  
  { target: "e", source: "e1", strength: 0.5 },
  { target: "e", source: "e2", strength: 0.5 },

];

function getNeighbors(node) {
  return links.reduce(function (neighbors, link) {
      if (link.target.id === node.id) {
        neighbors.push(link.source.id)
      } else if (link.source.id === node.id) {
        neighbors.push(link.target.id)
      }
      return neighbors;
    },
    [node.id]
  );
}



var width = window.innerWidth;
var height = window.innerHeight;

var svg = d3.select('svg');
svg.attr('width', width).attr('height', height);

var linkForce = d3
  .forceLink()
  .id(function (link) { return link.id })
  .strength(function (link) { return link.strength })

// simulation setup with all forces
var simulation = d3
  .forceSimulation()
  .force('charge', d3.forceManyBody().strength(-200))
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('link', linkForce)

var dragDrop = d3.drag().on('start', function (node) {
    node.fx = node.x
    node.fy = node.y
  }).on('drag', function (node) {
    simulation.alphaTarget(0.7).restart()
    node.fx = d3.event.x
    node.fy = d3.event.y
  }).on('end', function (node) {
    if (!d3.event.active) {
      simulation.alphaTarget(0)
    }
    node.fx = null
    node.fy = null
  })


function getNodeColor(node) {
  if (node.level === 1 && node.label === "Pop") {
    return 'red';
  } else if (node.group === 0) {
    return '#ff8080';
  } else if (node.level === 1 && node.label === "Country") {
    return 'green';
  } else if (node.group === 1) {
    return '#99ff99';
  } else if (node.level === 1 && node.label === "Hip-hop") {
    return 'purple';
  } else if (node.group === 2) {
    return '#d98cb3';
  } else if (node.level === 1 && node.label === "Rock") {
    return 'blue';
  } else if (node.group === 3) {
    return '#66a3ff';
  } else if (node.level === 1 && node.label === "Electronic") {
    return 'orange';
  } else if (node.group === 4) {
    return '#ffd699';
  } else {
    return 'grey';
  }
}

function circleSize(node) {
  if (node.level === 1) {
    return 50;
  } else {
    return 10;
  }
}

var linkElements = svg.append('g')
    .selectAll('line')
    .data(links)
    .enter().append('line')
    .attr('stroke-width', 1)
    .attr('stroke', '#E5E5E5')

var nodeElements = svg.append("g")
  .attr("class", "nodes") 
  .selectAll("circle")
  .data(nodes)
  .enter().append("circle")
    .attr("r", circleSize)
    .call(dragDrop)
    .attr("fill", getNodeColor);

var textElements = svg.append("g")
  .attr("class", "texts")
  .selectAll("text")
  .data(nodes)
  .enter().append("text")
    .text(function (node) { return  node.label })
	  .attr("font-size", 15)
	  .attr("dx", 15)
    .attr("dy", 6);



simulation.nodes(nodes).on('tick', () => {
    nodeElements
      .attr('cx', function (node) { return node.x })
      .attr('cy', function (node) { return node.y })
    textElements
      .attr('x', function (node) { return node.x })
      .attr('y', function (node) { return node.y })
    linkElements
      .attr('x1', link => link.source.x)
      .attr('y1', link => link.source.y)
      .attr('x2', link => link.target.x)
      .attr('y2', link => link.target.y)
  });

simulation.force("link").links(links);



