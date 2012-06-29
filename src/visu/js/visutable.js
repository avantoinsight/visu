/**
 * @package Avanto.in Visu
 * @author Akseli Palén
 * 
 * @brief VisuTable displays statistics in table-like form.
 * Called from VisuController.
 */

function VisuTable(area_list, special_list, areas, root) {
	var source;
	
	this.area_list = area_list;
	this.specials = special_list; // E.g. whole country
	this.areas = areas;
	
	this.root = root;
	
	// Table template
	source = jQuery('#visu-table-template').html();
	this.table_template = Handlebars.compile(source);
	
	// Area template (a row)
	source = jQuery('#visu-area-template').html();
	this.area_template = Handlebars.compile(source);
}

VisuTable.prototype.view = function (data) {
	
	var that = this;
	
	function remove_table(root) {
		jQuery(root).empty();
	}
	
	function append_table(data, root) {
		
		// Get table headings. Convert to array form always.
		var headings = data['data-description'];
		var context_headings = [];
		if (jQuery.isArray(headings)) {
			context_headings = headings;
		} else {
			// Convert to array
			context_headings.push(headings);
		}
		
		// Append to root
		var context = {title: data['title'], headings: context_headings};
		var html = that.table_template(context); // Render
		var table_elem = jQuery(root).append(html).find('.visu-areas tbody');
		
		// Sort areas.
		// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/sort
			// Get map of values to sort with
			var sortwith = visu.selectSubMap(data['data'], 0);
			
			// Select areas to sort and to render. Exlude areas with no data
			// for them.
			// http://api.jquery.com/jQuery.map/
			var order = jQuery.map(that.area_list, function (val, i) {
				if (val in sortwith) {
					return val;
				} else {
					return null; // Exlude element
				}
			});
			
			// Comparison function
			function compareAreas(a, b) {
				var av = sortwith[a]; // Value from key
				var bv = sortwith[b];
				if (av < bv) {
					return 1;
				}
				if (av > bv) {
					return -1;
				}
				return 0;
			}
			
			// Do sorting
			order.sort(compareAreas);
		
		
		// Append areas in right order
		var i, area_key;
		for (i = 0; i < order.length; i++) {
			area_key = order[i];
			append_area(data, table_elem, area_key)
		}
	}
	
	function append_area(data, root, key) {
		var area = that.areas[key];
		var values = data['data'][key];
		var units = data['data-unit-symbol'];
		var context_values = [];
		
		// Is single value or array of values.
		if (jQuery.isArray(values)) {
			// Precondition: units is array with same length
			
			jQuery.each(values, function (index, value) {
				context_values.push(value + ' ' + units[index]);
			});
		} else {
			context_values.push(values + ' ' + units);
		}
		
		// Is area special, e.g. larger area, state, whole country etc.
		// Emphasize the special.
		// http://api.jquery.com/jQuery.inArray/
		var is_special = (-1 < jQuery.inArray(key,that.specials));
		
		var context = {
			special: is_special,
			name: area.name,
			values: context_values
		}
		var html = that.area_template(context);
		
		// Append to root
		var area_elem = jQuery(root).append(html).children().last();
	}
	
	remove_table(this.root);
	append_table(data, this.root);
}
