var points = [
	[x1,y1]
    [x2,y2]
	];

var lineGenerator = d3.line()
	.curve(d3.curveLinear)

var pathData = lineGenerator(points);	
	
