// Set the dimensions and margins of the graph
const margin = { top: 50, right: 0, bottom: 100, left: 30 },
  width = 900 - margin.left - margin.right,
  height = 250 - margin.top - margin.bottom,
  gridSize = Math.floor(width / 24),
  legendElementWidth = gridSize * 2.5,
  colors = ["#f7fbff", "#08306b"], // Color range for heatmap
  days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];

// Append the svg object to the body of the page
const svg = d3.select("#calendar")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Load the data
d3.json("data.json").then(data => {

  // Format the data
  data.forEach(d => {
    d.OrderDate = new Date(d.OrderDate);
    d.TotalOrders = +d.TotalOrders;
  });

  const colorScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.TotalOrders)])
    .range(colors);

  // Create the day labels
  svg.selectAll(".dayLabel")
    .data(days)
    .enter().append("text")
    .text(d => d)
    .attr("x", 0)
    .attr("y", (d, i) => i * gridSize)
    .style("text-anchor", "end")
    .attr("transform", `translate(-6,${gridSize / 1.5})`)
    .attr("class", "dayLabel mono axis");

  // Create the time labels
  svg.selectAll(".timeLabel")
    .data(times)
    .enter().append("text")
    .text(d => d)
    .attr("x", (d, i) => i * gridSize)
    .attr("y", 0)
    .style("text-anchor", "middle")
    .attr("transform", `translate(${gridSize / 2}, -6)`)
    .attr("class", "timeLabel mono axis");

  // Create the squares for the heatmap
  const heatMap = svg.selectAll(".hour")
    .data(data)
    .enter().append("rect")
    .attr("x", d => (d.OrderDate.getHours() - 1) * gridSize)
    .attr("y", d => (d.OrderDate.getDay() - 1) * gridSize)
    .attr("class", "hour bordered")
    .attr("width", gridSize)
    .attr("height", gridSize)
    .style("fill", colors[0]);

  heatMap.transition().duration(1000)
    .style("fill", d => colorScale(d.TotalOrders));

  heatMap.append("title").text(d => `Date: ${d.OrderDate.toDateString()}\nTotal Orders: ${d.TotalOrders}\nProduct Types: ${d.ProductTypes.join(", ")}`);

  // Add legend for the heatmap
  const legend = svg.selectAll(".legend")
    .data([0].concat(colorScale.ticks(6)))
    .enter().append("g")
    .attr("class", "legend");

  legend.append("rect")
    .attr("x", (d, i) => legendElementWidth * i)
    .attr("y", height)
    .attr("width", legendElementWidth)
    .attr("height", gridSize / 2)
    .style("fill", d => colorScale(d));

  legend.append("text")
    .attr("class", "mono")
    .text(d => Math.round(d))
    .attr("x", (d, i) => legendElementWidth * i)
    .attr("y", height + gridSize);
}).catch(error => {
  console.error("Error loading or parsing data:", error);
});
