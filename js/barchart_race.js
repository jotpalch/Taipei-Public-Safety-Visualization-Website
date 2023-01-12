const margin_barchart_race = { top: 20, right: 30, bottom: 40, left: 90 },
  width_barchart_race = 800 - margin_barchart_race.left - margin_barchart_race.right,
  height_barchart_race = 650 - margin_barchart_race.top - margin_barchart_race.bottom;

// const districts = [
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
const color = [
  "#8dd3c7",
  "#ffffb3",
  "#bebada",
  "#fb8072",
  "#80b1d3",
  "#fdb462",
  "#b3de69",
  "#fccde5",
  "#d9d9d9",
  "#bc80bd",
  "#ccebc5",
  "#ffed6f",
];
const updateTimeInterval = 500;

const svg_barchart_race = d3
  .select("#barchart_race")
  .append("svg")
  .attr("width", width_barchart_race + margin_barchart_race.left + margin_barchart_race.right)
  .attr("height", height_barchart_race + margin_barchart_race.top + margin_barchart_race.bottom)
  .append("g")
  .attr("transform", `translate(${margin_barchart_race.left}, ${margin_barchart_race.top})`);

var cur_time;
var xScale, yScale, xAxis_barchart_race, yAxis_barchart_race, colorScale_barchart_race;
d3.csv("csv/race_data.csv").then(function (raw_data) {
  cur_time = 10701;
  var data = d3.map(raw_data, (d) => d[cur_time]);
  console.log(data);
  // Sort the initial data
  var data_map = [];
  for (var i = 0; i < data.length; i++) {
    data_map.push([data[i], i]);
  }
  data_map.sort(function (a, b) {
    return +a[0] < +b[0] ? 1 : -1;
  });
  var sorted_data = data_map.map(function (d, i) {
    return d[0];
  });
  var sorted_indices = data_map.map(function (d, i) {
    return d[1];
  });
  var sorted_dist = sorted_indices.map(function (d) {
    return districts[d];
  });

  // Add X axis
  xScale = d3
    .scaleLinear()
    .domain([0, Math.max(...data)])
    .range([0, width_barchart_race]);
  xAxis_barchart_race = svg_barchart_race
    .append("g")
    .call(d3.axisTop(xScale))
    .attr("transform", `translate(0, ${margin_barchart_race.top})`)
    .style("font-size", `20px`);

  // Add Y axis
  yScale = d3
    .scaleBand()
    .padding(0.1)
    .domain(sorted_dist) //data.map((d, i) => i)
    .range([0, height_barchart_race]);
  yAxis_barchart_race = svg_barchart_race
    .append("g")
    .call(d3.axisLeft(yScale))
    .attr("transform", `translate(-2, ${margin_barchart_race.top})`)
    .style("font-size", `20px`);

  // Color Scale
  colorScale_barchart_race = d3.scaleOrdinal(d3.schemeTableau10).domain(districts);

  // Add the bars
  svg_barchart_race
    .selectAll("rect")
    .data(sorted_data)
    .join("rect")
    .attr("transform", `translate(0, ${margin_barchart_race.top})`)
    .attr("x", xScale(0))
    .attr("y", (d, i) => yScale(districts[sorted_indices[i]]))
    .attr("width", (d) => xScale(d) - xScale(0))
    .attr("height", yScale.bandwidth())
    .attr("fill", (d, i) => colorScale_barchart_race(sorted_indices[i]))
    .attr("fill-opacity", 0.6);

  // Display value for each bar
  svg_barchart_race
    .selectAll("text.barValue")
    .data(sorted_data)
    .join("text")
    .attr("class", "barValue")
    .attr("dy", "20")
    .style("text-anchor", "end")
    .style("font-size", "25px")
    .style("dominant-baseline", "middle")
    .text((d) => +d)
    .attr("x", (d) => xScale(d) - 6)
    .attr(
      "y",
      (d, i) => yScale(districts[sorted_indices[i]]) + yScale.bandwidth() / 2
    );

  // Display year & month
  svg_barchart_race
    .append("text")
    .attr("class", "yearMonth")
    .attr("x", width_barchart_race)
    .attr("y", height_barchart_race)
    .style("text-anchor", "end")
    .style("font-size", `50px`)
    .text("107 / 01");
});

// Make the graph updates automatically
var inter = setInterval(function () {
  update_barchart_race();
}, updateTimeInterval);

function update_barchart_race() {
  var pre_time = cur_time;
  if (cur_time === 11112) {
    return;
  } else if (cur_time % 100 == 12) {
    cur_time += 100 - 11;
  } else {
    cur_time += 1;
  }

  d3.csv("csv/race_data.csv").then(function (raw_data) {
    var pre_data = d3.map(raw_data, (d) => d[pre_time]);
    var new_data = d3.map(raw_data, (d) => d[cur_time]);

    // Sort the data and return with indices
    var new_data_map = [];
    for (var i = 0; i < new_data.length; i++) {
      new_data_map.push([new_data[i], i]);
    }
    new_data_map.sort(function (a, b) {
      return +a[0] < +b[0] ? 1 : -1;
    });

    sorted_data = new_data_map.map(function (d, i) {
      return d[0];
    });
    sorted_indices = new_data_map.map(function (d, i) {
      return d[1];
    });
    sorted_dist = sorted_indices.map(function (d) {
      return districts[d];
    });

    // Change X axis
    xScale.domain([0, Math.max(...new_data)]);
    xAxis_barchart_race.call(d3.axisTop(xScale));

    // Change Y axis
    yScale.domain(sorted_dist);
    yAxis_barchart_race.call(d3.axisLeft(yScale));

    // Update the bars (with new ranking)
    svg_barchart_race
      .selectAll("rect")
      .data(new_data)
      .join("rect")
      .attr("fill", (d, i) => colorScale_barchart_race(i))
      .transition()
      .ease(d3.easeLinear)
      .duration(updateTimeInterval)
      .attr("y", (d, i) => yScale(districts[i]))
      //.attr("y", (d, i) => yScale(districts[sorted_indices[i]]))
      .attr("width", (d) => xScale(d) - xScale(0));

    console.log(new_data);
    // Change bar value display position
    d3.selectAll("text.barValue")
      .data(new_data)
      .join("text")
      .attr("class", "barValue")
      .attr("dy", "20")
      .style("text-anchor", "end")
      .style("dominant-baseline", "middle")
      .text((d) => +d)
      .transition()
      .ease(d3.easeLinear)
      .duration(updateTimeInterval)
      .attr("x", (d) => xScale(d) - 6)
      .attr("y", (d, i) => yScale(districts[i]) + yScale.bandwidth() / 2)
      // Add bar value 1 by 1
      .tween("text", function (d, i) {
        let ii = d3.interpolateRound(pre_data[i] || d, d);
        return function (t) {
          this.textContent = d3.format(",")(ii(t));
        };
      });

    // Change year & month
    var month = ("0" + (cur_time % 100).toString()).slice(-2);
    d3.selectAll("text.yearMonth").text(
      `${parseInt(cur_time / 100)} / ${month}`
    );
  });
}

// Restart barchart race
function restart() {
  cur_time = 10701;
  if (inter) {
    clearInterval(inter);
  }
  inter = setInterval(function () {
    update_barchart_race();
  }, updateTimeInterval);
}

// Stop barchart race
function stop() {
  if (inter) {
    clearInterval(inter);
  }
}
