var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background", "#000")
    .style("color", "white")
    .style("padding", "5px")
    .text("a simple tooltip");

function accidentTime(datasetGroup) {

    d3.csv("accidenttime.csv").then(function(data) {

        thisDataGroup = data.filter(function(d) { return d.Year == datasetGroup })

        var margin = {top: 10, right: 30, bottom: 50, left: 30},
        width = 400 - margin.left - margin.right,
        height = 240 - margin.top - margin.bottom;

        var svg = d3.select("#accident-time-graph").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        g = svg.append("g").attr("transform", "translate(" + 10 + "," + margin.top + ")");

        var y = d3.scaleLinear()
            .range([180, 0]);

        var x = d3.scaleBand()
            .range([0, width])
            .padding(0.1);

        var updated = d3.nest()
            .key(function(d) { return +d.time; })
            .sortKeys((a, b) => a - b)
            .rollup(function(v) { return v.length })
            .entries(thisDataGroup);

        console.log(updated);

        var max = d3.max(updated, function(d) {
            return d.value;
        });

        var min = d3.min(updated, function(d) {
            return d.value;
        });

        x.domain(updated.map(function(d) { return d.key; }));
        y.domain([0, max]);

        g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))

        g.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end");

        var myColor = d3.scaleSequential().domain([max,min])
            .interpolator(d3.interpolateRdYlBu);

        var bar = g.selectAll(".bar")
            .data(updated)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {
                return x(d.key);
            })
            .attr("y", function (d) {
                return y(Number(d.value));
            })
            .attr("width", x.bandwidth())
            .attr("height", function (d) {
                return height - y(Number(d.value));
            })
            .style("fill", function(d){return myColor(d.value) });

        bar.on("mouseover", function(d){
            tooltip.text(d.value); 
            {return tooltip.style("visibility", "visible");}})
        .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
        .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
    });

    
}

function updateAccidentTime(datasetGroup){

    var margin = {top: 10, right: 30, bottom: 50, left: 30},
        width = 400 - margin.left - margin.right,
        height = 240 - margin.top - margin.bottom;

    d3.csv("accidenttime.csv").then(function(data) {
        thisDataGroup = data.filter(function(d) { return d.Year == datasetGroup })

        var y = d3.scaleLinear()
            .range([180, 0]);

        var x = d3.scaleBand()
            .range([0, width])
            .padding(0.1);

        var updated = d3.nest()
            .key(function(d) { return +d.time; })
            .sortKeys((a, b) => a - b)
            .rollup(function(v) { return v.length })
            .entries(thisDataGroup);

        console.log(updated);

        var max = d3.max(updated, function(d) {
            return d.value;
        });

        var min = d3.min(updated, function(d) {
            return d.value;
        });

        var myColor = d3.scaleSequential().domain([max,min])
            .interpolator(d3.interpolateRdYlBu);


        x.domain(updated.map(function(d) { return d.key; }));
        y.domain([0, max]);

        var svg = d3.select("#accident-time-graph");

        svg.selectAll("rect")
            .data(updated)
            .transition()
            .delay(function(d, i) {
                return i * 100;
            })
            .duration(1000)
            .ease(d3.easeBounceOut)
            .attr("x", function (d) {
                return x(d.key);
            })
            .attr("y", function (d) {
                return y(Number(d.value));
            })
            .attr("width", x.bandwidth())
            .attr("height", function (d) {
                return height - y(Number(d.value));
            })
            .style("fill", function(d){return myColor(d.value) });

        svg.select(".y.axis")
            .transition()
            .delay(function(d, i) {
                return i * 100;
            })
            .duration(1000)
            .call(d3.axisLeft(y))

        svg.select(".x.axis")
            .call(d3.axisBottom(x))
            
    });

}


d3.csv("accidenttime.csv").then(function(data) {

    var groups = d3.set(data.map(function(d) { return d.Year })).values();

    function changeText(d){
        if (d == "2015"){
            name = "2015"
        } else if (d == "2016"){
            name = "2016"
        } else if (d == "2017"){
            name = "2017"
        } else if (d == "2018"){
            name = "2018"
        }
        d3.selectAll("h5").text("Year Name: "+name);
    }
    
    d3.select(".buttons")
	    .selectAll("button")
        .data(groups)
        .enter().append("button")
        .attr("class", "filter")
		.text(function(d) { return d; })
		.on("click", function(d) {
            updateAccidentTime(d);
            updateDay(d);
        })

    
});

accidentTime("2015");



    

    