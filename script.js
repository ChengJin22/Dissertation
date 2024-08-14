document.addEventListener("DOMContentLoaded", function() {
    d3.json('data.json').then(function(data) {
        var width = 928, // Adjust width based on your needs
            cellSize = 17, // Cell size
            weekday = "monday", // Start the week on Monday
            height = cellSize * 7 + 20; // Height calculated based on 7 days in a week

        var svg = d3.select("#calendar")
            .selectAll("svg")
            .data(d3.range(2021, 2023)) // Adjust the year range based on your data
            .enter().append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "year")
            .append("g")
            .attr("transform", "translate(40,20)");

        var formatDate = d3.utcFormat("%B %-d, %Y");
        var color = d3.scaleQuantize()
            .domain([0, d3.max(data, d => d.TotalQuantity)])
            .range(d3.schemeBlues[9]);

        var rect = svg.append("g")
            .selectAll("rect")
            .data(function(d) { return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
            .enter().append("rect")
            .attr("width", cellSize - 1)
            .attr("height", cellSize - 1)
            .attr("x", function(d) { return d3.timeWeek.count(d3.utcYear(d), d) * cellSize; })
            .attr("y", function(d) { return (d.getUTCDay() + 6) % 7 * cellSize; })
            .datum(d3.utcFormat("%Y-%m-%d"))
            .attr("fill", function(d) {
                var dayData = data.find(day => day.OrderDate === d);
                return dayData ? color(dayData.TotalQuantity) : "#ccc";
            });

        rect.append("title")
            .text(function(d) {
                var dayData = data.find(day => day.OrderDate === d);
                return dayData
                    ? `${formatDate(new Date(d))}
Total Orders: ${dayData.TotalOrders}
Total Quantity: ${dayData.TotalQuantity}
Product Types: ${dayData.ProductTypes.join(", ")}`
                    : `${formatDate(new Date(d))}
No data`;
            });

        svg.append("text")
            .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
            .attr("text-anchor", "middle")
            .attr("font-weight", "bold")
            .text(function(d) { return d; });
    });
});
