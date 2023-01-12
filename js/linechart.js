const margin_linechart = { top: 10, right: 10, bottom: 30, left: 30 },
  width_linechart = 1000 - margin_linechart.left - margin_linechart.right,
  height_linechart = 600 - margin_linechart.top - margin_linechart.bottom;

// const margin = { top: 30, right: 30, bottom: 70, left: 60 },
//   width_linechart = 800 - margin.left - margin.right,
//   height = 500 - margin.top - margin.bottom;

// Append the svg_linechart object to the body of the page
const svg_linechart = d3
  .select("#my_dataviz_linechart")
  .append("svg")
  .attr("width", width_linechart + margin_linechart.left + margin_linechart.right)
  .attr("height", height_linechart + margin_linechart.top + margin_linechart.bottom)
  .append("g")
  .attr("transform", `translate(${margin_linechart.left},${margin_linechart.top})`);

//Read the data
d3.csv("csv/year_cnt.csv").then(function (data) {
  console.log(data);
  cat_col = data.map((d) => d["category"]);
  console.log(cat_col);
  // List of groups (here I have one group per column)
  const districts = [
    "松山區",
    "信義區",
    "大安區",
    "中山區",
    "中正區",
    "大同區",
    "萬華區",
    "文山區",
    "南港區",
    "內湖區",
    "士林區",
    "北投區",
  ];

  // District's select dropdown
  d3.select("#select_district_linechart")
    .selectAll("myOptions")
    .data(districts)
    .enter()
    .append("option")
    .text(function (d) {
      return d;
    }) // text showed in the menu
    .attr("value", function (d) {
      return d;
    }); // corresponding value returned by the button

  const categories = [
    "Burglary",
    "Car Theft",
    "Motorcycle Theft",
    "Bike Theft",
  ];
  // Color for each group
  const myColor = d3.scaleOrdinal().domain(categories).range(d3.schemeSet2);

  // Add X axis
  const x = d3.scaleLinear().domain([107, 111]).range([0, width_linechart]);
  svg_linechart
    .append("g")
    .style("font", "20px times")
    .attr("transform", `translate(0, ${height_linechart - 100})`)
    .call(d3.axisBottom(x).ticks(5));

  var cur_col = data.map((d) => d["松山區"]);
  console.log(cur_col.slice(0, 5));

  // Add Y axis
  const y = d3
    .scaleLinear()
    .domain([0, Math.max(...cur_col)]).nice()
    .range([height_linechart - 100, 0]);
  var yAxis = svg_linechart.append("g").style("font", "20px times").call(d3.axisLeft(y));

  // Add X axis label:
  svg_linechart
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", width_linechart / 2 + margin_linechart.left - 10)
    .attr("y", height_linechart + margin_linechart.top - 30)
    .text("Year")
    .style("font-size", "40px");

  // Initialize line with 松山區
  var line = [];
  for (var i = 0; i < 4; i++) {
    line[i] = svg_linechart
      .append("g")
      .append("path")
      .datum(cur_col.slice(0 + i * 5, 5 + i * 5))
      .attr(
        "d",
        d3
          .line()
          .x(function (d, j) {
            return x(j + 107);
          })
          .y(function (d) {
            return y(+d);
          })
      )
      .attr("stroke", myColor(categories[i]))
      .style("stroke-width", 3)
      .style("fill", "none");

    // Handmade legend
    svg_linechart
      .append("rect")
      .attr("x", 780)
      .attr("y", 10 + 30 * i)
      .attr("width", 15)
      .attr("height", 10)
      .style("fill", myColor(categories[i]))
    svg_linechart
      .append("text")
      .attr("x", 800)
      .attr("y", 15 + 30 * i)
      .text(categories[i])
      .style("font-size", "20px")
      .attr("alignment-baseline", "middle");
  }

  // A function that update_linechart the chart
  function update_linechart(selectedDistrict) {
    // Create new data with the selection
    var new_col = data.map((d) => d[selectedDistrict]);
    console.log(cur_col.slice(0, 5));

    // Update Y Axis
    y.domain([0, Math.max(...new_col)]).nice();
    yAxis.transition().duration(800).call(d3.axisLeft(y));

    for (var i = 0; i < 4; i++) {
      // Give these new data to update_linechart line
      line[i]
        .datum(new_col.slice(0 + i * 5, 5 + i * 5))
        .transition()
        .duration(800)
        .attr(
          "d",
          d3
            .line()
            .x(function (d, j) {
              return x(j + 107);
            })
            .y(function (d) {
              return y(+d);
            })
        )
        .attr("stroke", myColor(categories[i]));
    }
  }

  // When the button is changed, run the updateChart function
  d3.select("#select_district_linechart").on("change", function (event, d) {
    // recover the option that has been chosen
    const selectedOption = d3.select(this).property("value");
    // run the update_linechart function with this selected option
    update_linechart(selectedOption);
  });
});
