function TreeLayout(){
	/*************** initial settings *****************/
	var root,
		treeLayout, //initial tree layout
		treedata,	//tree layout with the data associated
		nodes,		//the nodes of the tree layout
		links,		//the links of the tree layout
		distanceNode = 180,//we fix the horizontal distance between nodes
		distanceLabelX = 13,//distance from label to node
		distanceLabelY = -7,//distance from label to node
		margin = {top:10,right:20,bottom:10,left:20},
		width,
		height,
		zScale = d3.scaleOrdinal(d3.schemeCategory20);
		
		
	/*************** end initial settings ****************/

	
	function my(selection) {
		
	
		selection.each(function(data) {
			
		if(!width) throw new Error("Tree layout width must be defined.");
		if(!height) throw new Error("Tree layout height must be defined.");
		

		/*************** containers and graph groups ***************/
		var svg = d3.select(this)
			.attr("width",width)
			.attr("height",height)
			
		var g = svg.selectAll("g")
			.data([1]);
		
		g = g.enter() //this will only be created once, not at update
		   .append('g')
		   .attr("id","tree")
		   .attr('transform','translate('+margin.left+','+margin.top+')');
		
		var innerWidth = width - margin.left - margin.right;
		var innerHeight = height - margin.top - margin.bottom;
		
		g			//this will only be created once, not at update
			.append('g')
			.attr("class","links");

		g			//this will only be created once, not at update
			.append('g')
			.attr("class","nodes"); //the nodes must be drawn after the lines

			
		
		/*********** end containers and graph groups ***************/

		
		/*********** scales ****************************************/
		
		zScale
			.domain(["leaf","internal"])

		
		/*********** end of scales *********************************/
				
		/********** preparing the data ****************************/
		
		//we create the tree layout	
		treeLayout = d3.tree()
			.size([innerHeight,innerWidth]);

		root = d3.hierarchy(data,function(d) {return d.children;});


		//we create a new variable joining the tree layout and the data
		treeData=treeLayout(root);
		
		// Compute the new tree layout.
		nodes = treeData.descendants();
		links = treeData.descendants().slice(1);

		// We fix the distance of every node
		nodes.forEach(function(d){ d.y = d.depth * distanceNode});
		
		/********** end preparing the data ************************/
	   
			

		/***************** nodes **************************/
			
		//datajoin with only nodes
		
		var nodeGroup =d3.select('svg g.nodes')
		   .attr("transform", "translate(70,0)")
		  .selectAll('g.node')
		  .data(nodes, function(d) {return d.data.name;}); 
				//we put an id to ensure object constancy

		//Circles enter
		var nodeEnter=
			nodeGroup.enter()
			.append("g")
				.classed('node', true)
				.attr("transform", function(d) {return "translate(" + d.y + "," + d.x + ")"; })
				.on('click',function(d) {click(d);}); //we add an event listener
		
		nodeEnter
			.append('circle')
				.attr("id",function(d) {return d.data.name;})
				.classed(function(d) {return d.children ? "internal" : "leaf";},true)
				.attr('r', 10)
				.attr("fill",function(d) {return d.children ? 
									zScale("internal") : zScale("leaf");});

				
		//Labels enter
		nodeEnter
			.append('text')
				.attr('x', function(d) { return d.children ? -distanceLabelX : distanceLabelX; })
				.attr('y', distanceLabelY)
				.attr('dy', '.35em')
				.style('text-anchor',function(d) { return d.children ? "end" : "start";}) //for internal end, for leaves start
				.text(function(d) {return d.data.name;})
				
		// UPDATE
		var nodeUpdate = nodeEnter.merge(nodeGroup);
		
		nodeUpdate.select('g.node circle text')
			.text(function(d) {return d.data.name;})
		
		//Nodes and node labels exit
		nodeGroup.exit()
			.remove();		

		/******************** end nodes *****************************/


		
		/********************* edges ********************************/
		//datajoin with only links
		
		var linkGroup =svg.select('g.links')
		   .attr("transform", "translate(70,0)")
		   .selectAll('path.link')
		   .data(links,function(d) { return d.data.name; });
			//we put an id to ensure object constancy
		

		var linkEnter = linkGroup.enter()
			.append('path', 'g')
				.classed('link', true)
			.attr('d', function(d){return diagonal(d,d.parent)});

		// UPDATE
		var linkUpdate = linkEnter.merge(linkGroup);

		linkGroup.exit()
			.remove();
		/********************* edges ********************************/

		/* color legend */
	
		var colorLegendSVG = d3.select("#colorLegend")
			.attr("style","padding:30")
			.attr("width",300)
			.attr("height",100)

		
		var legendOrdinal = d3.legendColor()
			.shapePadding(5)
			.scale(zScale)
			.title(zLegend)
			.labelWrap(20)
			.on("cellclick",legendColorsCellClick())
			.on("cellover",legendColorsCellOver())
			.on("cellout",legendColorsCellOut()); 
	
		colorLegendSVG
		  .call(legendOrdinal);		
					
		/* end color legend */		
	
		}); //end selection each
	}; //end function my
	
	/*************** SETTERS AND GETTERS ON GRAPH SETTINGS ************
	
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
	my.width = function (value){
        return arguments.length ? (width = value, my) : width;
    };
        
    my.height = function (value){
		return arguments.length ? (height = value, my) : height;
    };
        

	my.zLegend = function (value){
		return arguments.length ? (zLegend = value, my) : zLegend;
    };

	my.colorLegendWidth= function (value){
        return arguments.length ? (colorLegendWidth = value, my) : colorLegendWidth;
    };
		
	my.colorLegendHeight= function (value){
        return arguments.length ? (colorLegendHeight = value, my) : colorLegendHeight;
    };

	/*********** end SETTERS AND GETTERS ON GRAPH SETTINGS ***********/

    return my;
};

/***************************** INTERACTION *****************************/

	function click(){
	}

	function legendColorsCellClick() {
	};

	function legendColorsCellOver() {
	};

	function legendColorsCellOut() {
	};

/***************************** INTERACTION *****************************/

/*********************** AUXILIAR FUNCTIONS *****************************/


// Auxiliar function that creates a curved (diagonal) path from parent to the child nodes
function diagonal(source,target) {
	return "M" + source.y + "," + source.x
			+ "C" + ((source.y + target.y) / 2) + "," + source.x
			+ " " + ((source.y + target.y) / 2) + "," + source.x
			+ " " + target.y + "," + target.x;
}

/******************** end AUXILIAR FUNCTIONS ****************************/
	