var width_map = 800,
  height_map = 700;

// var districts = [
//   "松山區",
//   "信義區",
//   "大安區",
//   "中山區",
//   "中正區",
//   "大同區",
//   "萬華區",
//   "文山區",
//   "南港區",
//   "內湖區",
//   "士林區",
//   "北投區",
// ];
var colorScale;
// Set bins for all categories
const bins = [
  [850, 1000, 1150, 1300, 1450, 1600, 1750],
  [5, 7, 9, 11, 13, 15, 17],
  [60, 80, 100, 120, 140, 160, 180],
  [10, 16, 22, 28, 34, 40, 46],
  [50, 100, 150, 200, 250, 300, 350],
  [80, 110, 140, 170, 200, 230, 260],
  [120000, 145000, 170000, 195000, 220000, 245000, 270000],
];
// Set ranges for the display
var ranges = [[], [], [], [], [], [], []];
for (var i = 0; i < bins.length; i++) {
  for (var j = 0; j < bins[i].length; j++) {
    if (j == 0) {
      ranges[i][j] = "<" + bins[i][j].toString();
    } else if (j == bins[i].length - 1) {
      ranges[i][j] = ">" + bins[i][j].toString();
    } else {
      ranges[i][j] = bins[i][j - 1].toString() + "-" + bins[i][j].toString();
    }
  }
}
//console.log(ranges);
const avg = [1285, 9, 132, 21, 160, 133, 209535];

// Select dropdown
bur_cat = [
  "CCTV Camera",
  "Police Station",
  "Burglary",
  "Car Theft",
  "Motorcycle Theft",
  "Bike Theft",
  "Population",
];
d3.select("#select_cat_map")
  .selectAll("myOptions")
  .data(bur_cat)
  .enter()
  .append("option")
  .text(function (d) {
    return d;
  })
  .attr("value", function (d) {
    return d;
  });

// Set colors for the bins
d3.csv("csv/all_cnt.csv").then(function (data) {
  console.log(d3.schemeBlues[8]);
  colorScale = d3.scaleThreshold().domain(bins[0]).range(d3.schemeBlues[8]);
});

var projection = d3
  .geoMercator()
  .center([107, 31])
  .scale(111000)
  .translate([width_map / 1000 - 27830, height_map / 100 - 12650]);

var path = d3.geoPath().projection(projection);

// Draw the map
d3.json("csv/taipei2.json").then(function (geojson) {
  var svg = d3
    .select("#map")
    .append("svg")
    .attr("width", width_map)
    .attr("height", height_map);

  var groups = svg.append("g");

  // Load data to create the heatmap
  d3.csv("csv/all_cnt.csv").then(function (data) {
    groups
      .selectAll("path")
      .data(geojson.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("stroke", "black")
      .attr("stroke-width", "1")
      .attr("fill", function (d) {
        console.log(data[0][d.properties.T_Name]);
        return colorScale(data[0][d.properties.T_Name]);
      });
      // .append("title");
      svg.selectAll("path").on('mouseover', function (d) {
        d3.select(this).append('title')
        .text(function (d) { return 'District : ' + d.properties.T_Name + '\nQuantity : ' + data[0][d.properties.T_Name]});
      })
      .on('mouseout', function (d) {
            d3.selectAll('title').remove();
      });
    //.on("click", showCharts(d, data));

                // .on("mouseover", function(d) {
                //     d3.select(this).attr("fill", color1);
                // })
                // .on("mouseleave", function(d) {
                //     d3.select(this).attr("fill", color2);
                // });


    // Handmade legend for the heatmap
    var legend_rect = [],
      legend_text = [];
    for (var i = 0; i < bins[0].length; i++) {
      legend_rect[i] = svg
        .append("rect")
        .attr("x", 690)
        .attr("y", 57 + 20 * i)
        .attr("width", 15)
        .attr("height", 15)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .style("fill", d3.schemeBlues[8][i]);
      legend_text[i] = svg
        .append("text")
        .attr("x", 710)
        .attr("y", 65 + 20 * i)
        .text(ranges[0][i])
        .style("font-size", "20px")
        .attr("alignment-baseline", "middle");
    }

    // Update Function
    function updateMap(selectedCat) {
      var idx = bur_cat.indexOf(selectedCat);
      colorScale = d3
        .scaleThreshold()
        .domain(bins[idx])
        .range(d3.schemeBlues[8]);
      //console.log(idx);
      groups
        .selectAll("path")
        .data(geojson.features)
        .transition()
        .duration(800)
        .attr("fill", function (d) {
          return colorScale(data[idx][d.properties.T_Name]);
        });
        svg.selectAll("path").on('mouseover', function (d) {
          d3.select(this).append('title')
          .text(function (d) { return 'District : ' + d.properties.T_Name + '\nQuantity : ' + data[idx][d.properties.T_Name]});
        })
        .on('mouseout', function (d) {
              d3.selectAll('title').remove();
        });
      // Update the legend texts
      for (var i = 0; i < legend_text.length; i++) {
        legend_text[i].transition().duration(800).text(ranges[idx][i]);
      }
    }

    // When the button is changed, run the updateMap function
    d3.select("#select_cat_map").on("change", function (event, d) {
      // recover the option that has been chosen
      const selectedOption = d3.select(this).property("value");
      // run the updateChart function with this selected option
      updateMap(selectedOption);
    });
  });
});
