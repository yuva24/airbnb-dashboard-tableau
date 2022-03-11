function Day_of_WeekTrend(group){
    var margin = {top: 10, right: 30, bottom: 100, left: 30},
    width = 400 - margin.left - margin.right,
    height = 240 - margin.top - margin.bottom;

    var svg = d3.select("#day-of-week").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range ([height, 0]);

    var g = svg.append("g").attr("transform", "translate(" + 10 + "," + margin.top + ")");

    d3.csv("countdayofweek.csv").then(function(data){
                // Converting strings(count) to numbers

        
        //Filter Year?
        var data = data.filter(function(d){return d.Year == group;});
        xScale.domain(data.map(function(d){return d.Day_of_Week;}));
        yScale.domain([0, d3.max(data, function(d) { return +d.count; })]);

        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale))
            .attr("class", "x axis")
            .selectAll("text")
            .attr("transform", "rotate(-65)")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em");
        
        

        g.append("g")
            .call(d3.axisLeft(yScale).tickFormat(function(d){
                return d;
            }).ticks(10))
            .attr("class", "y axis")
            .append("text")
            .attr("y", -30)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Count")
            .attr("stroke", "black");


        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar risan")
            .attr("x", function(d) { return xScale(d.Day_of_Week); })
            .attr("y", function(d) { return yScale(+d.count); })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) { return height - yScale(+d.count); })
            .on("mouseover", function(d){
                tooltip.text(d.count); 
                {return tooltip.style("visibility", "visible");}})
            .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
            .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

    })
}

function updateDay(group){
    var margin = {top: 10, right: 30, bottom: 100, left: 30},
        width = 400 - margin.left - margin.right,
        height = 240 - margin.top - margin.bottom;

    d3.csv("countdayofweek.csv").then(function(data){
        data = data.filter(function(d) { return d.Year == group })

        var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range ([height, 0]);

        xScale.domain(data.map(function(d){return d.Day_of_Week;}));
        yScale.domain([0, d3.max(data, function(d) { return +d.count; })]);

        var svg = d3.select("#day-of-week");

        svg.selectAll("rect")
            .data(data)
            .transition()
            .delay(function(d, i) {
                return i * 100;
            })
            .duration(1000)
            .ease(d3.easeBounceOut)
            .attr("x", function(d) { return xScale(d.Day_of_Week); })
            .attr("y", function(d) { return yScale(+d.count); })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) { return height - yScale(+d.count); });


        svg.select(".y.axis")
            .transition()
            .delay(function(d, i) {
                return i * 100;
            })
            .duration(1000)
            .call(d3.axisLeft(yScale).tickFormat(function(d){
                return d;
            }).ticks(10));

        svg.select(".x.axis")
            .transition()
            .delay(function(d, i) {
                return i * 100;
            })
            .duration(1000)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("transform", "rotate(-65)")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em");
            
    });
}

Day_of_WeekTrend("2015");


