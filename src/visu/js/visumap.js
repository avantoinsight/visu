/**
 * @package Avanto.in Visu
 * @author Akseli Palén
 * 
 * @brief VisuMap displays statistics on colorful map using SVG and
 * d3.js library. Calls VisuTooltip, VisuAreaModal and VisuLegend.
 * Called from VisuController. Uses d3.js
 * 
 * VisuMapTester is somewhat ugly tool to test if the browser can
 * display the visualisation right. If no compability, display nothing.
 */

function VisuMap(areas, shapes, root_selector) {
	// Check for browser SVG compability. Check this value in view-method.
	this.tester = new VisuMapTester();
	if (!this.tester.isCompatible()) {
		return this;
	}
	
	
	this.root = d3.select(root_selector); // jQuery object to d3 object
	this.areas = areas; // Area data stored here
	this.area_elements; // Shape paths are stored here
	
	this.legend; // Initialize later
	this.tooltip = new VisuTooltip(root_selector);
	this.modal = new VisuAreaModal(root_selector);
	
	this.data_set; // Stores data set. Updates on data set change.
	this.data_set_empty = true; // Flag is turned to false when data exists.
	
	// Hide map by default. Show when first time stat is shown.
	// This prevents flash of black map during loading
	this.jroot = jQuery(root_selector).hide();
	this.root_hidden = true;
	
	// Canvas size. On update, update also layout.css.
	// https://groups.google.com/forum/#!msg/d3-js/pvovPbU5tmo/7DliOxnBTtkJ
	var w = 360; // Width
	var h = 480; // Height
	
	// Geographical coordinates of the middle of the visualisation
	var default_lat = 61.7;
	var default_lon = 23.8;
	
	// Zoom level. Width and height of the world in pixels.
	// Greater the number, bigger the area.
	var scale = 50000;
	
	// _getMercatorProjectionTo
	function getMercatorProjectionTo(lat, lon, scale, width, height) {
		// Create projection that we will use to draw
		// visualisation from a specific geoposition.
		
		// This projection helps to determine how much we have to translate
		// to get given coordinates of the visualisation to the middle of the
		// canvas.
		var preprojection = d3.geo.mercator()
			.scale(scale)
			.translate([0,0]);
	
		// With preprojection we convert geocoordinates to pixel position on
		// the world map (world map width in pixels == scale)
		var pos = preprojection([lon, lat]);
		
		// Pan position to the middle of the screen
		var center = [-pos[0] + width/2, -pos[1] + height/2];
		
		return preprojection.translate(center);
	}
	var projection = getMercatorProjectionTo(default_lat, default_lon, scale, w, h);
	
	// Path is a tool to draw paths and areas
	var path = d3.geo.path()
		.projection(projection);
	
	// Generate SVG-element for visualisation
	var svg = this.root.append("svg")
		.attr("class", "visu-map-svg"); 
	this.area_elements = svg.append("g")
		.attr("id", "areas")
		.attr("class", "RdYlBu"); // Group for paths
		
	var that = this;
	this.area_elements.selectAll("path")
		.data(shapes.features)
		.enter().append("path") // Add missing paths
		.attr("d", path)
		.on('mouseover', function (d) {
			if (that.data_set_empty) {
				return;
			}
			d3.select(this).classed('active', true);
			
			// Generate tooltip context and show tooltip
			var title = that.areas[d.id].name;
			var item_keys = visu.makeArray(that.data_set['data-description']);
			var item_units = visu.makeArray(that.data_set['data-unit-symbol']);
			var item_values = visu.makeArray(that.data_set['data'][d.id]);
			var items = [
				{
					key: item_keys[0],
					value: item_values[0] + ' ' + item_units[0]
				}
			];
			that.tooltip.show(title, items); // Update content
		})
		.on('mousemove', function (d) {
			if (that.data_set_empty) {
				return;
			}
			// Move tooltip
			that.tooltip.move(d3.event.pageX, d3.event.pageY);
		})
		.on('mouseout', function (d) {
			if (that.data_set_empty) {
				return;
			}
			d3.select(this).classed('active', false);
			
			// Hide tooltip
			that.tooltip.hide();
		})
		.on('click', function (d) {
			// Bring up modal window
			that.modal.view(that.areas, that.data_set, d.id);
			
			// Hide tooltip
			that.tooltip.hide();
		});
	
	// Construct legend to upper right corner
	this.legend = new VisuLegend(svg, w-10, 0);
}

VisuMap.prototype.view = function (data) {
	// Do not run if map is disabled
	if (!this.tester.isCompatible()) {
		return;
	}
	
	
	// Close the modal info window if opened
	this.modal.hide();
	
	// Store to be used otherwhere
	this.data_set = data;
	this.data_set_empty = false;
	
	// Data might be in arrays. Select first items
	var selected = visu.selectSubMap(this.data_set['data'], 0);
	var selected_range = visu.selectSubMap(this.data_set['display-range'], 0);
	
	// Calculate ends and range for legend
	var minvalue = selected_range['min'];
	var maxvalue = selected_range['max'];
	var range = maxvalue - minvalue;
	
	// Select color set
	var color = visu.selectElement(this.data_set['display-color'], 0);
	this.area_elements.attr('class', color);
	
	// Default color inversion to false
	var invert_value = visu.get(this.data_set, 'invert-colors', false);
	var invert = visu.selectElement(invert_value, 0); // Might be array
	
	// Generates class name for specific data range. For example
	// higher value means class with brighter color.
	function quantize(d) {
		var dist;
		if (invert) {
			dist = maxvalue - selected[d.id];
		} else {
			// Distance from the minimum
			dist = selected[d.id] - minvalue;
		}
		return "q" + Math.max(0, Math.min(8, ~~(dist * 9 / range))) + "-9";
	}
	
	// Color the areas
	this.area_elements.selectAll("path")
		.attr("class", quantize);
	
	// View legend
	this.legend.view(data);
	
	// Show the map if hidden
	if (this.root_hidden) {
		this.jroot.fadeIn(500);
		this.root_hidden = false;
	}
}


function VisuMapTester() {
	this.tested = false;
	this.compatible = false;
}

VisuMapTester.prototype.isCompatible = function () {
	
	if (!this.tested) {
		this.runTests();
	}
	
	return this.compatible;
}

// Run compability tests.
VisuMapTester.prototype.runTests = function() {
	
	var c = true; // Compability test result. TRUE = compatible
	
	function test(testfunc) {
		if (c) { // Still true
			try {
				if (!testfunc()) { // If testfunc is not compatible
					c = false;
				}
			} catch(err) {
				c = false;
			}
		} else {
			return;
		}
	}
	
	// Compability check for d3.js.
	// If one test fails, everything fails.
	// Somewhat hacky but...
	
	// Test for d3 select method (there have been some problems)
	test(function () {
		d3.select('body');
		return true;
	});
	
	// Test inline svg support with modernizer
	test(function () {
		return Modernizr.inlinesvg;
	});
	
	// Test for not IE 7
	test(function () {
		// http://tanalin.com/en/articles/ie-version-js/
		if (document.all && !document.querySelector) {
			// IE7 or lower
			return false;
		}
		return true;
	});
	
	// Test for not IE 8
	test(function () {
		if (document.all && document.querySelector && !document.getElementsByClassName) {
			// IE8 only
			this.compatible = false;
		}
		return true;
	});
	
	
	
	this.compatible = c;
	this.tested = true;
}