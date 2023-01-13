const margin_barplot_hour = { top: 30, right: 30, bottom: 100, left: 60 },
  width_barplot_hour =
    1000 - margin_barplot_hour.left - margin_barplot_hour.right,
  height_barplot_hour =
    600 - margin_barplot_hour.top - margin_barplot_hour.bottom;

// Append the svg_barplot_hour object to the body of the page
const svg_barplot_hour = d3
  .select("#my_dataviz_barplot_hour")
  .append("svg")
  .attr("width", width_barplot_hour + margin_barplot_hour.left + margin_barplot_hour.right)
  .attr("height", height_barplot_hour + margin_barplot_hour.top + margin_barplot_hour.bottom)
  .append("g")
  .attr("transform", `translate(${margin_barplot_hour.left},${margin_barplot_hour.top})`);

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
const t_table = [
  "00~02",
  "02~04",
  "04~06",
  "06~08",
  "08~10",
  "10~12",
  "12~14",
  "14~16",
  "16~18",
  "18~20",
  "20~22",
  "22~24",
];
// District's select dropdown
d3.select("#select_district")
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

const categories = ["Burglary", "Car Theft", "Motorcycle Theft", "Bike Theft"];
const csv_cat = [
  "csv/bur_house3.csv",
  "csv/bur_car3.csv",
  "csv/bur_motor3.csv",
  "csv/bur_bike3.csv",
];
// Category's select dropdown
d3.select("#select_cat_barplot_hour")
  .selectAll("myOptions")
  .data(categories)
  .enter()
  .append("option")
  .text(function (d) {
    return d;
  }) // text showed in the menu
  .attr("value", function (d) {
    return d;
  }); // corresponding value returned by the button

// Initialize the x_barplot_hour axis
const x_barplot_hour = d3.scaleBand().range([0, width_barplot_hour]).padding(0.2);
const xAxis_barplot_hour = svg_barplot_hour.append("g").style("font", "20px times").attr("transform", `translate(0,${height_barplot_hour})`);

// Initialize the y_barplot_hour axis
const y_barplot_hour = d3.scaleLinear().range([height_barplot_hour, 0]);
const yAxis_barplot_hour = svg_barplot_hour.append("g").style("font", "20px times").attr("class", "myYaxis");

// Add x_barplot_hour axis label:
svg_barplot_hour
  .append("text")
  .attr("text-anchor", "end")
  .attr("x", width_barplot_hour / 2 + margin_barplot_hour.left)
  .attr("y", height_barplot_hour + margin_barplot_hour.top + 40)
  .text("Time Period (hour)")
  .style("font-size", "30px");

// A function that create / update_barplot_hour the plot for a given constiable:path
function update_barplot_hour(sel_dis, sel_cat) {
  // Parse the Data
  d3.csv(csv_cat[categories.indexOf(sel_cat)]).then(function (data) {
    console.log(data);
    // Add x_barplot_hour axis
    x_barplot_hour.domain(t_table); //data.map(d => d.group)
    xAxis_barplot_hour.transition().duration(1000).call(d3.axisBottom(x_barplot_hour));

    // Add y_barplot_hour axis
    y_barplot_hour.domain([0, 60]);
    yAxis_barplot_hour.transition().duration(1000).call(d3.axisLeft(y_barplot_hour));

    const idx = districts.indexOf(sel_dis);
    // constiable u: map data to existing bars
    const u = svg_barplot_hour.selectAll("rect").data(data.slice(12 * idx, 12 * (idx + 1)));

    // update_barplot_hour bars
    u.join("rect")
      .transition()
      .duration(1000)
      .attr("x", (d) => x_barplot_hour(d.time))
      .attr("y", (d) => y_barplot_hour(d.cnt))
      .attr("width", x_barplot_hour.bandwidth())
      .attr("height", (d) => height_barplot_hour - y_barplot_hour(d.cnt))
      .attr("fill", "#69b3a2");
      svg_barplot_hour.selectAll("rect").on('mouseover', function (d) {
        d3.select(this).attr('opacity', 0.3).append('title')
        .text(function (d) { return 'Time : ' + d.time + '\nQuantity : ' + d.cnt});
      })
      .on('mouseout', function (d) {
            d3.selectAll('title').remove()
            d3.select(this).attr('opacity', 1);
      });
  });
}

// Initiallize the graph with (松山區, Burglary)
var sel_dis = "松山區", sel_cat = "Burglary";
update_barplot_hour(sel_dis, sel_cat);

// District's select dropdown onchange event
d3.select("#select_district").on("change", function (event, d) {
  // selected district
  sel_dis = d3.select(this).property("value");
  update_barplot_hour(sel_dis, sel_cat);
});
// Category's select dropdown onchange event
d3.select("#select_cat_barplot_hour").on("change", function (event, d) {
  // Selected category
  sel_cat = d3.select(this).property("value");
  update_barplot_hour(sel_dis, sel_cat);
});
