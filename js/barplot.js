// set the dimensions and margins of the graph
const margin = { top: 30, right: 30, bottom: 100, left: 60 },
  width = 1000 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3
  .select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Initialize the X axis
const x = d3.scaleBand().range([0, width]).padding(0.2);
const xAxis = svg.append("g").style("font", "20px times").attr("transform", `translate(0,${height})`);

// Initialize the Y axis
const y = d3.scaleLinear().range([height, 0]);
const yAxis = svg.append("g").style("font", "20px times").attr("class", "myYaxis");

// Add X axis label:
svg
  .append("text")
  .attr("text-anchor", "end")
  .attr("x", width / 2 + margin.left)
  .attr("y", height + margin.top + 40)
  .text("臺北市行政區")
  .style("font-size", "30px");

const year = ["107", "108", "109", "110", "111"];
const cat = ["house", "car", "motor", "bike"];
const cat_text = ["Burglary", "Car Theft", "Motorcycle Theft", "Bike Theft"];
const district = [
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
// Select district
d3.select("#select_year")
  .selectAll("myOptions")
  .data(year)
  .enter()
  .append("option")
  .text(function (d) {
    return d;
  }) // text showed in the menu
  .attr("value", function (d) {
    return d;
  }); // corresponding value returned by the button

d3.select("#select_cat")
  .selectAll("myOptions")
  .data(cat_text)
  .enter()
  .append("option")
  .text(function (d) {
    return d;
  }) // text showed in the menu
  .attr("value", function (d) {
    return d;
  }); // corresponding value returned by the button
// A function that create / update the plot for a given constiable:
function update(selectedconst) {
  // Parse the Data
  d3.csv("csv/divbydis.csv").then(function (data) {
    // X axis
    x.domain(district);
    xAxis.transition().duration(1000).call(d3.axisBottom(x));
    // Add Y axis. Inital is House 107
    y.domain([0, d3.max(data, (d) => +d[selectedconst])]).nice();
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    // constiable u: map data to existing bars
    const u = svg.selectAll("rect").data(data);

    // update bars
    u.join("rect")
      .transition()
      .duration(1000)
      .attr("x", (d) => x(d.district))
      .attr("y", (d) => y(d[selectedconst]))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d[selectedconst]))
      .attr("fill", "#69b3a2");
    svg.selectAll("rect").on('mouseover', function (d) {
        d3.select(this).attr('opacity', 0.3).append('title')
        .text(function (d) { return 'District : ' + d.district + '\nQuantity : ' + d[selectedconst]});
      })
      .on('mouseout', function (d) {
            d3.selectAll('title').remove()
            d3.select(this).attr('opacity', 1);
      });
  });
}

// Initialize plot
d3.select("#select_year").on("change", function (event, d) {
  // recover the option that has been chosen
  const selectedOption1 = d3.select(this).property("value");
  const selectedOption2 =
    cat[cat_text.indexOf(d3.select("#select_cat").property("value"))];

  // run the updateChart function with this selected option
  update(selectedOption2 + "_" + selectedOption1);
});
d3.select("#select_cat").on("change", function (event, d) {
  // recover the option that has been chosen
  const selectedOption2 =
    cat[cat_text.indexOf(d3.select(this).property("value"))];
  const selectedOption1 = d3.select("#select_year").property("value");
  // console.log(selectedOption2)

  // console.log(selectedOption);
  // run the updateChart function with this selected option
  update(selectedOption2 + "_" + selectedOption1);
});
update("house_107");
