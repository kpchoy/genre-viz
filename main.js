var songs = [];

var popSongs = [];
var popCount = 0;

var hhSongs = [];
var hhCount = 0;

var aSongs = [];
var aCount = 0;

var rSongs = [];
var rCount = 0;

let pArr = [];


$(document).ready(function() {
  
  $.getJSON("http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=f21088bf9097b49ad4e7f487abab981e&limit=100&format=json", function(json) {
     
    $.each(json.tracks.track, function(i, item) { 
      
      let thisPromise = $.getJSON(`http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=f21088bf9097b49ad4e7f487abab981e&artist=${item.artist.name}&track=${item.name}&format=json`, function(json) {
        $.each(json, function(i, item) {
          if (typeof item.toptags === "undefined" || item.toptags.tag.length == 0) {
            return songs ; 
            
          } else if (item.toptags.tag[0].name.toLowerCase() === "pop") {
            popSongs.push({ id: `p${popCount}`  , group: 0, label: `${item.name}`, level: 2 });
            popCount += 1; 
            
          } else if (item.toptags.tag[0].name.toLowerCase().includes("hip") || item.toptags.tag[0].name.toLowerCase().includes("rap")) {
            hhSongs.push({ id: `hh${hhCount}`  , group: 1, label: `${item.name}`, level: 2 });
            hhCount += 1;
            
          } else if (item.toptags.tag[0].name.toLowerCase().includes("alt")) {
            aSongs.push({ id: `a${aCount}`  , group: 2, label: `${item.name}`, level: 2 });
            aCount += 1;
            
          } else if (item.toptags.tag[0].name.toLowerCase().includes("rock")) {
            rSongs.push({ id: `r${rCount}`  , group: 3, label: `${item.name}`, level: 2 });
            rCount += 1;
            
          } else {
            popSongs.push({ id: `p${popCount}`  , group: 0, label: `${item.name}`, level: 2 });
            popCount += 1; 
          }
        });
        
      });
      pArr.push(thisPromise);
    });
    
    Promise.all(pArr).then(() => {
      // all are resolved

      console.log(popSongs);
      console.log(hhSongs);
      console.log(aSongs);
      console.log(rSongs);
    });
  });
});



var nodes = [
  { id: "p", group: 0, label: "Pop", level: 1 },
  { id: "p1"   , group: 0, label: "I Like It"   , level: 2 },
  { id: "p2"   , group: 0, label: "Boo'd Up"   , level: 2 },
  { id: "p3"   , group: 0, label: "No Tears Left To Cry"  , level: 2 },

  { id: "hh"  , group: 2, label: "Hip-hop"   , level: 1 },
  { id: "hh1"  , group: 2, label: "In My Feelings"   , level: 2 },
  { id: "hh2"  , group: 2, label: "Sicko Mode"  , level: 2 },

  { id: "r"  , group: 3, label: "Rock"   , level: 1 },
  { id: "r1"  , group: 3, label: "Thunder"   , level: 2 },
  { id: "r2"  , group: 3, label: "Beleiver"  , level: 2 },

  { id: "a"  , group: 4, label: "Alternative"   , level: 1 },
  { id: "a1"  , group: 4, label: "The Middle"   , level: 2 },
  { id: "a2"  , group: 4, label: "One Kiss"  , level: 2 }
];


var links = [
  { target: "p", source: "hh", strength: 0.1 },
  { target: "hh", source: "r", strength: 0.1 },
  { target: "r", source: "a", strength: 0.1 },
  { target: "a", source: "p", strength: 0.1 },

];

// function linkGenerator(nodez) {
//   nodez.map(node => {
//     if (node.id.includes("p")) {
//       return ({target: "p", source: node.id, strength: 0.4});
//     }
//   });
// }

// var linksGen = nodes.map(node => {
//   if (node.id.includes("p")) {
//     return ({target: "p", source: node.id, strength: 0.4});
//   } else {
//     return node;
//   }
// });

// var allLinks = links.concat(linksGen);


// var width = window.innerWidth;
// var height = window.innerHeight;

// var svg = d3.select('svg');
// svg.attr('width', width).attr('height', height);

// var linkForce = d3
//   .forceLink()
//   .id(function (link) { return link.id })
//   .strength(function (link) { return link.strength })

// // simulation setup with all forces
// var simulation = d3
//   .forceSimulation()
//   .force('charge', d3.forceManyBody().strength(-200))
//   .force('center', d3.forceCenter(width / 2, height / 2))
//   .force('link', linkForce)

// var dragDrop = d3.drag().on('start', function (node) {
//     node.fx = node.x
//     node.fy = node.y
//   }).on('drag', function (node) {
//     simulation.alphaTarget(0.7).restart()
//     node.fx = d3.event.x
//     node.fy = d3.event.y
//   }).on('end', function (node) {
//     if (!d3.event.active) {
//       simulation.alphaTarget(0)
//     }
//     node.fx = null
//     node.fy = null
//   })


// function getNodeColor(node) {
//   if (node.level === 1 && node.label === "Pop") {
//     return 'red';
//   } else if (node.group === 0) {
//     return '#ff8080';
//   } else if (node.level === 1 && node.label === "Country") {
//     return 'green';
//   } else if (node.group === 1) {
//     return '#99ff99';
//   } else if (node.level === 1 && node.label === "Hip-hop") {
//     return 'purple';
//   } else if (node.group === 2) {
//     return '#d98cb3';
//   } else if (node.level === 1 && node.label === "Rock") {
//     return 'blue';
//   } else if (node.group === 3) {
//     return '#66a3ff';
//   } else if (node.level === 1 && node.label === "Electronic") {
//     return 'orange';
//   } else if (node.group === 4) {
//     return '#ffd699';
//   } else {
//     return 'grey';
//   }
// }

// function circleSize(node) {
//   if (node.level === 1) {
//     return 50;
//   } else {
//     return 10;
//   }
// }

// var linkElements = svg.append('g')
//     .selectAll('line')
//     .data(links)
//     .enter().append('line')
//     .attr('stroke-width', 1)
//     .attr('stroke', '#E5E5E5')

// var nodeElements = svg.append("g")
//   .attr("class", "nodes") 
//   .selectAll("circle")
//   .data(nodes)
//   .enter().append("circle")
//     .attr("r", circleSize)
//     .call(dragDrop)
//     .attr("fill", getNodeColor);

// var textElements = svg.append("g")
//   .attr("class", "texts")
//   .selectAll("text")
//   .data(nodes)
//   .enter().append("text")
//     .text(function (node) { return  node.label })
// 	  .attr("font-size", 15)
// 	  .attr("dx", 15)
//     .attr("dy", 6);



// simulation.nodes(nodes).on('tick', () => {
//     nodeElements
//       .attr('cx', function (node) { return node.x })
//       .attr('cy', function (node) { return node.y })
//     textElements
//       .attr('x', function (node) { return node.x })
//       .attr('y', function (node) { return node.y })
//     linkElements
//       .attr('x1', link => link.source.x)
//       .attr('y1', link => link.source.y)
//       .attr('x2', link => link.target.x)
//       .attr('y2', link => link.target.y)
//   });

// simulation.force("link").links(links);



