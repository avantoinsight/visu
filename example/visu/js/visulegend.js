/**
 * @package Avanto.in Visu
 * @author Akseli Palén
 * 
 * @brief VisuLegend is the bar with value and color range on VisuMap.
 * Called from VisuMap. Uses d3.js.
 */

function VisuLegend(root, x, y) {
	/**
	 * Parameters:
	 *   root: d3 svg element
	 */
	
	// Legend settigns
	this.squarewidth = 10; // Range square width and height
	this.squareheight = 18;
	this.squaregap = 0;
	this.squareinterval = this.squaregap + this.squareheight;
	this.titleheight = this.squareheight;
	
	// Draw legend
	this.legend = root.append("g")
		.attr("class", "RdYlBu")
		.attr('transform', 'translate('+ x +','+ y +')');
	this.legendTitle = this.legend.append("g");
	this.legendRanges = this.legend.append("g");
	this.legendTicks = this.legend.append("g");
	this.legendEnds = this.legend.append("g")
		.attr("class", "visu-legend-ends");
	
	// Legend title
	this.legendTitle.insert('text')
		.attr("class", "visu-legend-title")
		.attr('text-anchor', 'end')
		.attr('x', this.squarewidth)
		.attr('y', 12)
		.text('testiiii');
	
	// Legend range squares
	var that = this;
	this.legendRanges.selectAll('rect')
		.data(d3.range(0, 9))
		.enter()
		.insert('svg:rect')
		.attr('x', 1)
		.attr('y', function (d, i) {
			return i * that.squareinterval + that.titleheight;
		})
		.attr('width', this.squarewidth)
		.attr('height', this.squareheight)
		.attr('class', function (d, i) {
			return 'q' + (8-i) + '-9';
		});
	
	// Draw legend range end marks to make easier to notice squares similar
	// to background color.
	this.legendEnds.selectAll('rect')
		.data([0, 9])
		.enter().insert('rect')
		.attr('x', 1)
		.attr('y', function (d, i) {
			return d * that.squareinterval + that.titleheight;
		})
		.attr('width', this.squarewidth)
		.attr('height', 1);
}

VisuLegend.prototype.view = function (data) {
	
	var selected_range = visu.selectSubMap(data['display-range'], 0);
	var minvalue = selected_range['min'];
	var maxvalue = selected_range['max'];
	var average = (maxvalue + minvalue) / 2;
	
	// Select symbol and description
	var symbol = visu.selectElement(data['data-unit-symbol'], 0);
	var description = visu.selectElement(data['data-description'], 0);
	
	// Select color set
	var color = visu.selectElement(data['display-color'], 0);
	this.legend.attr('class', color);
	
	// Default color inversion to false
	var invert_value = visu.get(data, 'invert-colors', false);
	var invert = visu.selectElement(invert_value, 0); // Might be array
	
	// Update title
	this.legendTitle.selectAll('.visu-legend-title')
		.text(description)
	
	// Redraw legend
	var that = this;
	this.legendTicks.selectAll('text')
		.remove();
	this.legendTicks.selectAll('text')
		.data([maxvalue, average, minvalue])
		.enter()
		.insert('svg:text')
		.attr('class', 'visu-legend-tick')
		.attr('text-anchor', 'end')
		.attr('x', -5)
		.attr('y', function (d, i) {
			return 14 + i * (4*that.squareinterval) + that.titleheight;
		})
		.text(function(d, i) {
			var prepend = '';
			if (i == 0) {
				prepend = '> ';
			}
			return prepend + d + ' ' + symbol;
		});
	
	// Recolor range squares
	this.legendRanges.selectAll('rect')
		.attr('class', function (d, i) {
			// i ~ [0,8]
			if (invert) {
				return 'q' + i + '-9';
			} else {
				return 'q' + (8-i) + '-9';
			}
		});
	
}
