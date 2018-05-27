Adapted to d3.v4 from

Tom Cardoso’s Block 1d44732cc7f3d97d6bf7
Updated October 11, 2017
Reusable waffle charts

http://bl.ocks.org/tomcardoso/1d44732cc7f3d97d6bf7

I've also changed the color scheme and the legend. Now, all the points are circles, but they can easily be changed by other icons.

Original explanation:

Reusable waffle charts
Basic waffle charts using Mike Bostock's [http://bost.ocks.org/mike/chart/](reusable charts) convention. Waffles are configurable, as you can see below:

var waffle = new WaffleChart()
  .selector(".chart")
  .data(data)
  .useWidth(false)
  .label("Value of producers' sales in 2013, in thousands of dollars")
  .size(12)
  .gap(2)
  .rows(20)
  .columns(60)
Each configuration parameter is as follows:

selector: The container in which to draw a waffle chart.
data: The data to use when drawing the waffle.
useWidth: Whether to constrain the waffle to the container's width.
label: A label to pass to the waffle. Optional.
size: Width and height of each waffle "block", in pixels. Optional. Default: 6.
gap: Gap between each block, in pixels. Optional. Default: 2.
rows: Number of rows of blocks. Optional. Default: 50.
columns: Number of columns of blocks. Optional. Default: 100.
