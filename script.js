document.addEventListener("DOMContentLoaded", function() {
    fetch('data.json')
    .then(response => response.json())
    .then(jsonData => {
        var calendar = d3.select('#calendar')
            .selectAll('.day')
            .data(jsonData)
            .enter()
            .append('div')
            .attr('class', 'day')
            .style('background-color', function(d) {
                return d3.scaleLinear().domain([0, 500]).range(['white', 'red'])(d.TotalAmount);
            })
            .text(d => d.OrderDate)
            .on('click', function(event, d) {
                showDetails(d);
            });

        function showDetails(d) {
            d3.select('#details').html(`
                <h3>${d.OrderDate}</h3>
                <p>Total Orders: ${d.OrderID}</p>
                <p>Total Sales: $${d.TotalAmount}</p>
                <p>Product Types: ${d.ProductType}</p>
            `);
        }
    });
});
