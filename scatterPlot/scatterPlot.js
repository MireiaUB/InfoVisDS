/*
   Inspired by
   Michele Weigle's 2017 D3 Scatterplot Example 
   http://bl.ocks.org/weiglemc/6185069
   
   Inspired by
   Max Friedrich Hartmann's D3 Circular Legend
   https://bl.ocks.org/mxfh/6285470954cf4d207fd0 [2015]
   
   MIT License
   (c) 2017, Mireia Ribera
*/

/* This file has not been thoroughly tested,
   if you find something wrong, please write to:
   ribera@ub.edu  
   Thanks in advance */

function ScatterPlot(){
	
	
	/* Initial settings */
    var width,
        height,
        xScale = d3.scalePoint(), //scalePoint map from a discrete set of values to equally spaced points along the specified range	    
        yScale = d3.scaleLinear(),
		sScale = d3.scaleSqrt(),
		zScale = d3.scaleOrdinal(d3.schemeCategory20),
        x,
        y,
		z,
		s,
        margin = { top: 20, bottom: 100, left: 50, right: 20 }, 
        xAxis = d3.axisBottom(xScale),
        yAxis = d3.axisLeft(yScale),
		yticks = 10,
		xticksSize = 10,
		yticksSize = 5,
		yticksFormatNumber=d3.format(".1f"),
		yLegend="value",
		xLegend="name",
		zLegend="type",
		sLegend="quantity",
		colorLegendWidth =70,
		colorLegendHeight =300,
		sizeLegendWidth =70,
		sizeLegendHeight = 300;
	/* end initial settings */
            
    function my(selection){
		
          
        if(!x) throw new Error("Scatterplot x column must be defined.");
        if(!y) throw new Error("Scatterplot y column must be defined.");
        if(!width) throw new Error("Scatterplot width must be defined.");
        if(!height) throw new Error("Scatterplot height must be defined.");
          
        selection.each(function(data) {


			/* container and graph group */
		
            var svg = d3.select(this)
                .attr("width", width)
                .attr("height", height)
			            
            var g = svg.selectAll("g")
              .data([1]); 
			  
            g = g.enter()
				.append("g")
				.attr('id','scatter')
                .attr("transform",
                      "translate(" + margin.left + "," + margin.top +")");
			
            var innerWidth = width - margin.left - margin.right;
            var innerHeight = height - margin.top - margin.bottom;

			/* end of container and graph group (#scatter) */
			
			/* scales */
            xScale
              .domain(data.map(function (d){ return d[x]; })) //returns all the values for names */
			  .range([0, innerWidth])
           
            yScale
              .domain([0, d3.max(data, function (d){return +d[y]})])
              .range([innerHeight,0]);


            sScale
              .domain(d3.extent(data, function (d){return +d[s]}))
              .range([3,13]);

			  
			
			var domainZ = data.map(function (d){ return d[z]; }); //all d values
			var uniqueZ = domainZ.filter((v,i,a)=>a.indexOf(v) === i); //we eliminate duplicates [https://stackoverflow.com/questions/1960473/get-all-unique-values-in-an-array-remove-duplicates]
		
			zScale
				.domain(uniqueZ)

			
			/* end of scales */
			  
			/* x-axis */
			  
			d3.select('.x-axis').remove(); //delete old axis

			xAxis.tickSize(xticksSize);
			
            xAxisG=d3.select("#scatter")	//create new axis
			    .append("g")
					.attr("class", "x-axis")
					.attr("transform", "translate(0," + innerHeight +")") 
					.call(xAxis)
				.selectAll("text")
					.attr("y",xticksSize)
					.attr("x",-xticksSize)
					.attr("transform","rotate(-45)")
					.style("text-anchor","end");  

			d3.select("#scatter .x-axis") //x-axis Legend
				.append("text")
					.attr("class","label")
					.attr("x",innerWidth)
					.attr("y",-xLegend.length)
					.style("text-anchor","end")
					.text(xLegend)

			/* x-axis end */

			/* y-axis */
			
			d3.select('.y-axis').remove(); //delete old axis

			yAxis.tickSize(yticksSize)
				.tickFormat(yticksFormatNumber);

            yAxisG=d3.select("#scatter") //create new axis
				.append("g")
					.attr("class", "y-axis")
					.call(yAxis)
				.append("text") //y-axis legend
					.attr("class","label")
					.attr("transform", "rotate(-90)")
					.attr("y", yLegend.length)
					.attr("dy", ".71em")
					.style("text-anchor", "end")
					.text(yLegend);		

			/* end y-axis */
			
			/* draw dots */
			
			d3.select("#scatter")
				.append("clipPath")
					.attr("id", "chart-area")
					.append("rect")
					.attr("width", innerWidth )
					.attr("height", innerHeight )
					.attr("x", 0) 
					.attr("y", 0);	
		
			var dots=d3.select("#scatter")
				.append("g")
				.attr("id","dots")
				.attr("clip-path","url(#chart-area)")
				.selectAll(".dot")
				.data(data, function(d){return d[x]})

/*			dots 
				.attr("class", "update");  //put anything specific for updating
*/			
            dots.exit() //exit
				.remove();
			
            dots.enter() //enter
					.append("circle")
						.attr("class", function(d) {return "dot" 
									  + " " + d[x] 
									  + " " +yLegend+d[y] 
									  + " " +zLegend+d[z]
									  + " " +sLegend+d[s]})
						.merge(dots)
						.attr("r", function(d) {return sScale(+d[s])})
						.attr("cx", function(d) {return xScale(d[x]);}) 
						.attr("cy", function(d) {return yScale(d[y])})
						.style("fill", function(d) {return zScale(d[z])})
						.style("opacity",0.5)
						.on("mouseover", function(d) {dotsFocus(d)})
						.on("focus", function(d) {dotsFocus(d)})
						.on("mouseout", function(d) {dotsBlur(d)})
						.on("blur", function(d) {dotsBlur(d)})
						.on("click",function(d) {dotsSelect(d)})
						.on("keypress",function(d) {dotsSelect(d)});
			/* end draw dots */

			/* color legend */
		
			var colorLegendSVG = d3.select("#colorLegend")
			  .attr("transform", "translate("+width+","+(-height+margin.top)+")")
			  .attr("width",colorLegendWidth)
			  .attr("height",colorLegendHeight);

			var legendOrdinal = d3.legendColor()
				.shape("path",d3.symbol().type(d3.symbolCircle).size(50)())
				.shapePadding(10)
				.scale(zScale)
				.title(zLegend)
				.labelWrap(20)
				.on("cellclick",legendColorsCellClick())
				.on("cellover",legendColorsCellOver())
				.on("cellout",legendColorsCellOut()); 

			colorLegendSVG
			  .call(legendOrdinal);		
			
			
			/* end color legend */


			/* size legend*/
	
			var sizeLegendSVG = d3.select("#sizeLegend")
			  .attr("transform", "translate("+width+","+(-height)+")")
			  .attr("width",sizeLegendWidth)
			  .attr("height",sizeLegendHeight);
			
			var legendSize = d3.legendSize()
				.scale(sScale)
				.shape('circle')
				.shapePadding(5)
				.labelOffset(20)
				.labelFormat(d3.format("1.0f"))
				.orient('vertical')
				.title(sLegend)
				.on("cellclick",legendSizeCellClick())
				.on("cellover",legendSizeCellOver())
				.on("cellout",legendSizeCellOut()); 

			sizeLegendSVG
			  .call(legendSize);		
			
			/* end size legend*/

			
			
		});
    };

			
	/* INTERACTION */
	
	var tooltip = d3.select("body").append("div")
		.attr("class","tooltip")
		.style("opacity",0);

	function dotsFocus(d) {
					  tooltip.style("position","absolute")
					  tooltip.transition()
						   .duration(200)
						   .style("opacity", .9);
					  tooltip.html(xLegend+" "+d[x]+" : "+zLegend+" "+d[z] + 							 "<br/> (" + d[y] + " " +yLegend 
															 + ","
															 + d[s] + " "+ sLegend 
															 + ")")
						   .style("left", (d3.event.pageX + 5) + "px")
						   .style("top", (d3.event.pageY - 28) + "px");
	};
				  
				  
	function dotsBlur(d) {
					  tooltip.transition()
						   .duration(500)
						   .style("opacity", 0);
	};	
	
	function dotsSelect(d) {
	};


	function legendColorsCellClick() {
	};
	function legendColorsCellOver() {
	};
	function legendColorsCellOut() {
	};

	function legendSizeCellClick() {
	};
	function legendSizeCellOver() {
	};
	function legendSizeCellOut() {
	};
	
	/* END INTERACTION */
	
	
	/* SETTERS AND GETTERS ON GRAPH SETTINGS
	
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
        

    my.z = function (value){
        return arguments.length ? (z = value, my) : z;
    };

    my.s = function (value){
        return arguments.length ? (s = value, my) : s;
    };


	my.width = function (value){
        return arguments.length ? (width = value, my) : width;
    };
        
    my.height = function (value){
		return arguments.length ? (height = value, my) : height;
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

	my.zLegend = function (value){
		return arguments.length ? (zLegend = value, my) : zLegend;
    };

	my.sLegend = function (value){
		return arguments.length ? (sLegend = value, my) : sLegend;
    };
	
    my.xticksSize = function (value){
		return arguments.length ? (xticksSize = value, my) : xticksSize;
    };

    my.yticksSize = function (value){
        return arguments.length ? (yticksSize = value, my) : yticksSize;
    };

    my.yticksFormatNumber = function (value){
        return arguments.length ? (yticksFormatNumber = value, my) : yticksFormatNumber;
    };
	
	
	my.xScale= function (value){
        return arguments.length ? (xScale = value, my) : xScale;
    };
	
	
	my.yScale= function (value){
        return arguments.length ? (yScale = value, my) : yScale;
    };
		

	my.colorLegendWidth= function (value){
        return arguments.length ? (colorLegendWidth = value, my) : colorLegendWidth;
    };
		
	my.colorLegendHeight= function (value){
        return arguments.length ? (colorLegendHeight = value, my) : colorLegendHeight;
    };

	my.sizeLegendWidth= function (value){
        return arguments.length ? (sizeLegendWidth = value, my) : sizeLegendWidth;
    };
		
	my.sizeLegendHeight= function (value){
        return arguments.length ? (sizeLegendHeight = value, my) : sizeLegendHeight;
    };
	/* end SETTERS AND GETTERS */

    return my;
};


	/* AUXILIAR FUNCTIONS */
	
function updateFunction(f){ 
	/* this function receives a new file 
	   and updates the chart accordingly */

	  
	d3.csv(f, parseRow, function (mydata){
		content='';
		mydata.forEach(function(d){
			content='<p>'+d[x]+' '+d[y]+'<p>'+content;
		});
		document.getElementById("csv").innerHTML = content;

		d3.select("#scatterplot")
			.datum(mydata)
			.call(scatterplot);          			
		});		
};
	  
function resizeFunction(w,h){
	/* this function receives a new width and height
	   and updates the chart accordingly */
			
	scatterplot.width(w);
	scatterplot.height(h);
			
	d3.select("#scatterplot")
		.call(scatterplot);          					
};	  			 
	  
function parseRow(d){
	/* helper function, parses string to number */
    d.value = +d.value; 
    return d;
};
      
	/* end AUXILIAR FUNCTIONS */
