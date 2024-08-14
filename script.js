document.addEventListener("DOMContentLoaded", function() {
    d3.json('data.json').then(function(data) {
        var width = 960,
            height = 136,
            cellSize = 17;

        var svg = d3.select("#calendar")
            .selectAll("svg")
            .data(d3.range(2020, 2022))  // Adjust year range according to your data
            .enter().append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "year")
            .append("g")
            .attr("transform", "translate(40,20)");

        svg.append("text")
            .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
            .style("text-anchor", "middle")
            .text(function(d) { return d; });

        var rect = svg.append("g")
            .attr("fill", "#fff")
            .selectAll("rect")
            .data(function(d) { return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
            .enter().append("rect")
            .attr("width", cellSize)
            .attr("height", cellSize)
            .attr("x", function(d) { return d3.timeWeek.count(d3.timeYear(d), d) * cellSize; })
            .attr("y", function(d) { return d.getDay() * cellSize; })
            .datum(d3.timeFormat("%Y-%m-%d"));

        var color = d3.scaleQuantize()
            .domain([0, d3.max(data, function(d) { return d.TotalQuantity; })])
            .range(d3.schemeBlues[9]);

        rect.filter(function(d) {
            return data.find(item => item.OrderDate === d);
        })
        .attr("fill", function(d) {
            var item = data.find(item => item.OrderDate === d);
            return color(item.TotalQuantity);
        })
        .append("title")
        .text(function(d) {
            var item = data.find(item => item.OrderDate === d);
            return d + "\nTotal Orders: " + item.TotalOrders +
                   "\nTotal Quantity: " + item.TotalQuantity +
                   "\nProduct Types: " + item.ProductTypes;
        });
    });
});
