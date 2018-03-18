/*
   Adapted from
   MIT License (c) 2017 Curran Kelleher
   "Reusable bar chart" 
   https://bl.ocks.org/curran/af72fd9c1fb61d2133d273cd8a3ca557

   Inspired by
   Mike Bostock "Axis styling", sept. 2017
   https://bl.ocks.org/mbostock/3371592

   Inspired by
   Mike Bostock "Rotated Axis Labels", feb. 2016
   https://bl.ocks.org/mbostock/4403522
   
   Inspired by Edward Tufte data-ink and graphical redesign recommendations
	
   MIT License
   (c) 2017, Mireia Ribera
*/
	
/* This file has not been thoroughly tested,
   if you find something wrong, please write to:
   ribera@ub.edu  
   Thanks in advance */

function BarChart(){
	
	
	/* Initial settings */
    var width,
        height,
        xScale = d3.scaleBand(),
        yScale = d3.scaleLinear(),
        x,
        y,
        margin = { top: 50, bottom: 100, left: 60, right: 10 }, //leave space for legends
        xAxis = d3.axisBottom(xScale),
        yAxis = d3.axisLeft(yScale),
		yticks = 10,
		xticksSize = 0,
		yticksSize = 5,
		yticksFormatNumber=d3.format(".1f")
		distanceLabel=20
		yLegend="value",
		xLegend="name";
	/* end initial settings */
            
    function my(selection){
          
        if(!x) throw new Error("Bar Chart x column must be defined.");
        if(!y) throw new Error("Bar Chart y column must be defined.");
        if(!width) throw new Error("Bar Chart width must be defined.");
        if(!height) throw new Error("Bar Chart height must be defined.");
          
        selection.each(function(data) {
			/* container and graph group (.bars) */
		
            var svg = d3.select(this)
                .attr("width", width)
                .attr("height", height)
			            
            var g = svg.selectAll("g")
              .data([1]); 
			  
            g = g.enter()
				.append("g")
				.attr('id','bars')
                .attr("transform",
                      "translate(" + margin.left + "," + margin.top +")");
			
            var innerWidth = width - margin.left - margin.right;
            var innerHeight = height - margin.top - margin.bottom;

			/* end of container and graph group (.bars) */
			
			/* scales */
            xScale
              .domain(data.map(function (d){ return d['name']; })) //returns all the values for names*/
			  .range([0, innerWidth])
			  .paddingOuter(0);
            
            yScale
              .domain([0, d3.max(data, function (d){ return d['value'] })])
              .range([innerHeight, 0]);
			/* end of scales */
			  
			/* x-axis */
			  
			d3.select('.x-axis').remove(); //delete old axis

			xAxis.tickSize(xticksSize);
			
            xAxisG=d3.select("#bars")	//create new axis
			    .append("g")
					.attr("class", "x-axis")
					.attr("transform", "translate(0," + innerHeight +")")
					.call(xAxis)
				.selectAll("text")
					.attr("y",0)
					.attr("x",-5)
					.attr("transform","rotate(-45)")
					.style("text-anchor","end");

			d3.select("path.domain").remove();

			/* x-axis */
					
			/* bars */
					
            var rects = d3.select("#bars").selectAll("rect")
              .data(data, function(d){return d.name})
					
/*			rects 
				.attr("class", "update");  //put anything specific for updating
*/
			
            rects.exit() //exit
				.attr('height', height-0.005*height)
				.remove();
				
            rects.enter() //enter
			  .append("rect")
				.attr('class','bar')
				.merge(rects)
			    .attr("x", function (d){ return xScale(d['name']); })
                .attr("y", function (d){ return yScale(d['value']); })
                .attr("width", xScale.bandwidth())
                .attr("height", function (d){
                  return innerHeight - yScale(d['value']);
                });

			
			var texts = d3.select("#bars").selectAll('.label')
				.data(data, function(d){return d.name});
				
			texts.exit()	//exit
				.remove();
			texts.enter()  //enter
				.append('text')
				.merge(texts)
				.text(function(d) {
						return d[y];
				})
				.attr("x", function (d){ return xScale.bandwidth()/2+xScale(d['name'])-5; })
                .attr("y", function (d){ return yScale(d['value'])+ distanceLabel; })
				.attr('class','label');

			/* end of bars */

			
			/* y-axis */
			
			d3.select('.y-axis').remove(); //delete old axis

			yAxis.tickSize(yticksSize)
				.tickFormat(yticksFormatNumber);

			
            yAxisG=d3.select("#bars") //create new axis
				.append("g")
					.attr("class", "y-axis")
					.call(yAxis)
				.select(".domain").remove();

			
			lines=d3.select("#bars").selectAll('.y-axis .tick:not(:first-of-type) line')
					.attr('stroke','#fff')
					.attr('stroke-dasharray','2,2')
					.attr('x2',innerWidth)
					.attr('x1',5);				

			/* y-axis */

			/* axis legends */	
			d3.select('.yLegend').remove(); //delete old legend
			
			legendAxisY = svg	//create new legend
				.append("text")
				.attr("class","yLegend")
				.attr("dy","1em")
				.attr("y",10)
				.attr("x",margin.left)
				.style("text-anchor","end")
				.text(yLegend);

			d3.select('.xLegend').remove(); //delete old legend
	
			legendAxisX = svg  //create new legend
				.append("text")
				.attr("class","xLegend")
				.attr("dy","1em")
				.attr("y",innerHeight+80)
				.attr("x",innerWidth/2)
				.style("text-anchor","middle")
				.text(xLegend);
			/* axis legends */	
					
        });
    };
		
	/* SETTERS AND GETTERS ON BARGRAPH SETTINGS
	
	They follow the pattern
	
	some_function.x = function(value) {
		if (!arguments.length) {
			return x;
		} else {
			x = value;
			return my;
		}
	};
		
	in a compressed form
		
	*/
    
	my.x = function (value){
        return arguments.length ? (x = value, my) : x;
    };
        
    my.y = function (value){
        return arguments.length ? (y = value, my) : y;
    };
        
    my.width = function (value){
        return arguments.length ? (width = value, my) : width;
    };
        
    my.height = function (value){
		return arguments.length ? (height = value, my) : height;
    };
        
    my.padding = function (value){
		return arguments.length ? (xScale.padding(value), my) : xScale.padding();
    };

    my.yticks = function (value){
        return arguments.length ? (yticks = value, my) : yticks;
    };

    my.xLegend = function (value){
        return arguments.length ? (xLegend = value, my) : xLegend;
    };

	my.yLegend = function (value){
		return arguments.length ? (yLegend = value, my) : yLegend;
    };
		
    my.xticksSize = function (value){
		return arguments.length ? (xticksSize = value, my) : xticksSize;
    };

    my.yticksSize = function (value){
        return arguments.length ? (yticksSize = value, my) : yticksSize;
    };

    my.distanceLabel = function (value){
        return arguments.length ? (distanceLabel = value, my) : distanceLabel;
    };

    my.yticksFormatNumber = function (value){
        return arguments.length ? (yticksFormatNumber = value, my) : yticksFormatNumber;
    };
		
	/* end SETTERS AND GETTERS */
			
    return my;
};
	  
function updateFunction(f){ 
	/* this function receives a new file 
	   and updates the chart accordingly */

	  
	d3.csv(f, parseRow, function (mydata){
		content='';
		mydata.forEach(function(d){
			content='<p>'+d['name']+' '+d['value']+'<p>'+content;
		});
		document.getElementById("csv").innerHTML = content;

		d3.select("#bar-chart")
			.datum(mydata)
			.call(barChart);          			
		});		
};
	  
function resizeFunction(w,h){
	/* this function receives a new width and height
	   and updates the chart accordingly */
			
	barChart.width(w);
	barChart.height(h);
			
	d3.select("#bar-chart")
		.call(barChart);          					
};	  			 
	  
function parseRow(d){
	/* helper function, parses string to number */
    d.value = +d.value; 
    return d;
};
      
