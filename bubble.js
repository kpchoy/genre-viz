$(document).ready(function() {
  
  $.getJSON("https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=f21088bf9097b49ad4e7f487abab981e&limit=100&format=json", function(json) {
     
    $.each(json.tracks.track, function(i, item) { 
      
      let trackRequest = $.getJSON(`https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=f21088bf9097b49ad4e7f487abab981e&artist=${item.artist.name}&track=${item.name}&format=json`, function(json) {
        $.each(json, function(i, item) {
          
          if (typeof item.toptags === "undefined" || item.toptags.tag.length == 0) {
            return songs ; 
            
          } else if (item.toptags.tag[0].name.toLowerCase() === "pop") {
            popSongs.push({cluster: 0, label: `${item.name}`, artist: getArtist(item), img: getImg(item)});

            
          } else if (item.toptags.tag[0].name.toLowerCase().includes("hip") || item.toptags.tag[0].name.toLowerCase().includes("rap")) {
          
            hhSongs.push({cluster: 1, label: `${item.name}`, artist: getArtist(item), img: getImg(item)});

            
          } else if (item.toptags.tag[0].name.toLowerCase().includes("alt")) {
            aSongs.push({cluster: 2, label: `${item.name}`, artist: getArtist(item), img: getImg(item)});

            
          } else if (item.toptags.tag[0].name.toLowerCase().includes("rock")) {
            rSongs.push({cluster: 3, label: `${item.name}`, artist: getArtist(item), img: getImg(item)});

            
          } else {
            popSongs.push({cluster: 0, label: `${item.name}`, artist: getArtist(item), img: getImg(item)});
          }
        });
        
      });
      trackRequestArr.push(trackRequest);
    });
    
    Promise.all(trackRequestArr).then(() => {
      let allSongs = popSongs.concat(hhSongs, aSongs, rSongs);
      var width = 960,
          height = 500,
          padding = 1.5, 
          clusterPadding = 6, 
          maxRadius = 2;

        var n = allSongs.length, 
            m = 20;

        var color = d3.scale.category10()
            .domain(d3.range(m));

        var clusters = new Array(m);

        var idx = 0;

        var nodes = d3.range(n).map(function() {
          var songClusterId = allSongs[idx].cluster;
          var i = Math.floor(Math.random() * m) + 10,
              r = i * maxRadius,
              d = {
                cluster: songClusterId,
                radius: r,
                x: Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random(),
                y: Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random(),
                text: allSongs[idx].label,
                artist: allSongs[idx].artist,
                img: allSongs[idx].img, 
              };
          if (!clusters[songClusterId] || (r > clusters[songClusterId].radius)) clusters[songClusterId] = d;
          idx++;
          return d;
        });

        var force = d3.layout.force()
            .nodes(nodes)
            .size([width, height])
            .gravity(.02)
            .charge(0)
            .on("tick", tick)
            .start();

        var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height);

        var node = svg.selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .style("fill", function(d) { return color(d.cluster); })
            .on("mouseover", handleMouseOver)
            .call(force.drag)
      
        node.transition()
            .duration(750)
            .delay(function(d, i) { return i * 5; })
            .attrTween("r", function(d) {
              var i = d3.interpolate(0, d.radius);
              return function(t) { return d.radius = i(t); };
            });

        function tick(e) {
          node
              .each(cluster(10 * e.alpha * e.alpha))
              .each(collide(.5))
              .attr("cx", function(d) { return d.x; })
              .attr("cy", function(d) { return d.y; });
        }

        // Move d to be adjacent to the cluster node.
        function cluster(alpha) {
          return function(d) {
            var cluster = clusters[d.cluster];
            if (cluster === d) return;
            var x = d.x - cluster.x,
                y = d.y - cluster.y,
                l = Math.sqrt(x * x + y * y),
                r = d.radius + cluster.radius;
            if (l != r) {
              l = (l - r) / l * alpha;
              d.x -= x *= l;
              d.y -= y *= l;
              cluster.x += x;
              cluster.y += y;
            }
          };
        }

        function collide(alpha) {
          var quadtree = d3.geom.quadtree(nodes);
          return function(d) {
            var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
                nx1 = d.x - r,
                nx2 = d.x + r,
                ny1 = d.y - r,
                ny2 = d.y + r;
            quadtree.visit(function(quad, x1, y1, x2, y2) {
              if (quad.point && (quad.point !== d)) {
                var x = d.x - quad.point.x,
                    y = d.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
                if (l < r) {
                  l = (l - r) / l * alpha;
                  d.x -= x *= l;
                  d.y -= y *= l;
                  quad.point.x += x;
                  quad.point.y += y;
                }
              }
              return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
          };
        }

    


        
    });
  });
});
var songs = [];

var popSongs = [];


var hhSongs = [];


var aSongs = [];


var rSongs = [];

let trackRequestArr = [];


function handleMouseOver(d, i) {  // Add interactivity
  // Use D3 to select element, change color and size
  // debugger;
  $('#song-info').text(`${d.text}`);
  $('#song-artist').text(`${d.artist}`);
  
  $("#song-img").attr("src",`${d.img}`);
}


function getArtist(item) {
  // debugger;
  if (typeof item.artist !== 'undefined') {
    return `${item.artist.name}`
  } else { 
    return "no info at this time";

  }
}

function getImg(item) {
  // debugger; 
  return typeof item.album !== 'undefined' ? `${Object.values(item.album.image[3])[0]}` : "https://www.free-stock-music.com/thumbnails/free-music-thumbnail.jpg";
}







