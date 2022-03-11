//Grouped bar chart
	var svgGBar = d3.select("#groupedBar"),
	    margin = {top: 43, right: 20, bottom: 30, left: 40},
	    width = +svgGBar.attr("width") - margin.left - margin.right,
	    height = +svgGBar.attr("height") - margin.top - margin.bottom,
	    groupedBar = svgGBar.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var x0bar = d3.scaleBand()
	    .rangeRound([0, width])
	    .paddingInner(0.1);

	var x1bar = d3.scaleBand()
	    .padding(0.05);

	var ybar = d3.scaleLinear()
	    .rangeRound([height, 0]);

	var zbar = d3.scaleOrdinal()
	    .range(["#d80021", "#ff6262"]);

    var defaultSelection = "Serious-(2015)";

	d3.csv("SeverityvsLighting - Sheet1.csv", function(d, i, columns) {
	for (var i = 1, n = columns.length; i < n; ++i) 
	    d[columns[i]] = +d[columns[i]];
		return d;
	}, function(error, data) {
	if (error) throw error;

  	x0bar.domain(data.map(function(d) { return d.type; }));

	groupedBar.append("g")
		.attr("class", "axis-x-bar")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x0bar))
		.append("text")
			.attr("x", svgGBar.attr("width")/2 - 50)
			.attr("y", 25)
			.attr("font-size", 16)
			.attr("font-weight","bold")
			.attr("fill", "#000")
			.text("Lighting");

	var headerBar = ["type"];
	var ori_states = data.columns.slice(1);

	var dropdown1 = d3.select("#dropdown")
		.insert("select", "g")
		.on("change", dropDownChange);

	dropdown1.selectAll("option")
		.data(ori_states)
    	.enter()
    	.append("option")
			.attr("value", function (d) { return d; })
			.property("selected", function(d){return d == defaultSelection;})
			.text(function (d) {return d;});

	d3.select('#dropdown')
		.append("text")
		.text(" versus ");

	var dropdown2 = d3.select("#dropdown")
		.insert("select", "g")
		.on("change", dropDownChange);

    dropdown2.selectAll("option")
        .data(ori_states)
 		.enter()
 		.append("option")
	        .attr("value", function (d) { return d; })
	        .text(function (d) {return d;});

    function dropDownChange() {

		var headerBar = ["type"];
        var stateSelected = d3.select(this).property('value');
        var dropdownDetector = d3.select(this).property('previousElementSibling');

        if(dropdownDetector != null){select2 = stateSelected;}
        else{select1 = stateSelected;}

		headerBar.push(select1,select2);
  		var newStateData = data.map(function(dat){
			return {
				type:dat.type,
				[select1]: dat[select1],
				[select2]: dat[select2]
			}
		});
  		newStateData["columns"] = headerBar;

        updateBar(newStateData);
    };

	var dropdownVal = d3.select("#dropdown").selectAll("option")
	    .filter(function (d, i) { return this.selected;});

	var select1 = dropdownVal._groups[0][0].value;
	var select2 = dropdownVal._groups[0][1].value;

	var keys = [];

	for (var i = 0, n = data.length; i < n; ++i){
		keys.push(data[i].type);
	}


    headerBar.push(select1,select2);
	var newStateData = data.map(function(dat){
		return {
			type:dat.type,
			[select1]: dat[select1],
			[select2]: dat[select2]
		}
	});

	newStateData["columns"] = headerBar;

  	var states = newStateData.columns.slice(1);
    ybar.domain([0, d3.max(newStateData, function(d) { return d3.max(states, function(state) { return d[state]; }); })]).nice();

    groupedBar.append("g")
		.attr("class", "axis-y-bar")
		.call(d3.axisLeft(ybar).ticks(null, "s"))
		.append("text")
			.attr("x", 2)
			.attr("y", ybar(ybar.ticks().pop()) + 0.5)
			.attr("dy", "-1em")
			.attr("fill", "#000")
			.attr("font-size", 16)
			.attr("font-weight", "bold")
			.attr("text-anchor", "start")
      		.text("Accidents");

	updateBar(newStateData);

	function updateBar(newStateData){

	  	var states = newStateData.columns.slice(1);

  		x1bar.domain(states).rangeRound([0, x0bar.bandwidth()]);
		ybar.domain([0, d3.max(newStateData, function(d) { return d3.max(states, function(state) { return d[state]; }); })]).nice();
		zbar.domain(states);

		groupedBar.select(".axis-y-bar")
			.transition()
			.duration(1000)
			.call(d3.axisLeft(ybar).ticks(null, "s"));

		var barState =  groupedBar.selectAll(".bars").data(newStateData);

	    var barStateEnter = barState
	   		.enter()
	   		.append("g")
	    	.attr("class","bars")
	      	.attr("transform", function(d ) { return "translate(" + x0bar(d.type) + ",0)"; })
	    	.selectAll("rect")
	    	.data(function(d) {return states.map(function(state) { return {state: state, value: d[state]}; }); });

	    rectEnter = barStateEnter.enter().append("rect")
	    	.attr("x", function(d) { return x1bar(d.state); })
	    	.attr("y", function(d) { return ybar(d.value); })
	    	.attr("width", x1bar.bandwidth())
	    	.attr("height", function(d,i) { return height - ybar(d.value); })
	    	.attr("fill", function(d) { return zbar(d.state); });

	    barState.selectAll("rect")
	      	.data(newStateData)
	      	.data(function(d) {return states.map(function(state) { return {state: state, value: d[state]}; }); })
	      	.transition()
	      	.duration(1000)
		        .attr("x", function(d) { return x1bar(d.state); })
		        .attr("y", function(d) { return ybar(d.value); })
		        .attr("width", x1bar.bandwidth())
		        .attr("height", function(d) { return height - ybar(d.value); })
		        .attr("fill", function(d) { return zbar(d.state); });

	    barState.selectAll(".label").remove();

		var groupedBarText = barState.selectAll(".label")
			.data(newStateData)
      		.data(function(d) {return states.map(function(state) { return {state: state, value: d[state]}; }); });

		groupedBarText.enter()
			.append("text")
			.attr("class","label")
	     	.attr("x", function(d) { return x1bar(d.state); })
	        .attr("y", function(d) { return ybar(d.value)-5; })
			.attr("opacity", 0)
			.transition()
			.duration(1000)
	        .attr("y", function(d) { return ybar(d.value)-5; })
			.attr("dx", "-0.1em")
			.text(function(d) { return d.value; })
			.attr("opacity", 1);

	    var legend = groupedBar
	    	.append("g")
	    	.attr("font-family", "sans-serif")
	     	.attr("font-size", 14)
	    	.attr("text-anchor", "end")
	    	.selectAll("g")
	    	.data(states.slice().reverse())
	    	.enter()
	    	.append("g")
	      	.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		legend.append("rect")
			.attr("x", width - 5)
			.attr("y", - 39)
			.attr("width", 19)
		 	.attr("height", 19)
		 	.attr("fill", zbar);

	   	groupedBar.selectAll(".legendState").remove();

		legend.append("text")
			.attr("class","legendState")
		    .attr("x", width - 10)
		    .attr("y", -30)
		    .attr("dy", "0.32em")
		    .text(function(d) { return d; });

		}

	});
