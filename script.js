document.addEventListener("DOMContentLoaded", function() {
    d3.json('data.json').then(function(data) {
        var width = 960, height = 136, cellSize = 17;
        var svg = d3.select("#calendar")
            .selectAll("svg")
            .data(d3.range(2024, 2025))
            .enter().append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

        svg.append("g")
            .attr("text-anchor", "end")
            .selectAll("text")
            .data(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"])
            .enter().append("text")
            .attr("x", -5)
            .attr("y", function(d, i) { return (i + 1) * cellSize; })
            .attr("dy", "-.25em")
            .text(function(d) { return d; });

        var rect = svg.append("g")
            .selectAll("rect")
            .data(d3.timeDays(new Date(2024, 0, 1), new Date(2025, 0, 1)))
            .enter().append("rect")
            .attr("width", cellSize)
            .attr("height", cellSize)
            .attr("x", function(d) { return d3.timeWeek.count(d3.timeYear(d), d) * cellSize; })
            .attr("y", function(d) { return d.getDay() * cellSize; })
            .datum(d3.timeFormat("%Y-%m-%d"));

        var color = d3.scaleQuantize()
            .domain([0, d3.max(data, function(d) { return d.value; })])
            .range(d3.schemeBlues[9]);

        rect.filter(function(d) { return d in data; })
            .attr("fill", function(d) { return color(data[d]); })
            .append("title")
            .text(function(d) { return d + ": " + data[d]; });
    });
});

