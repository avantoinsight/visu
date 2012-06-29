/**
 * @package Avanto.in Visu
 * @author Akseli Palén
 * 
 * @brief VisuMenu lists available statistics and some info about them.
 * At the same time it works as menu to navigate between statistics.
 * Called from VisuController.
 */

function VisuMenu(stats_data, root_element, clicked_callback) {
	
	this.data = stats_data;
	this.root = root_element;
	this.callback = clicked_callback;
	var that = this;
	
	// Keep key->element record of stat elements and data set elements.
	// This makes possible to activate(open) and deactivate(close) stats
	// and data sets by keys.
	this.stat_elements = {};
	this.data_set_elements = {};
	
	// Handlebars templates
	var source;
	
	// Menu template
	source = '<ul class="visu-menu visu-categories"></ul>';
	this.menu_template = Handlebars.compile(source);
	
	// Category template
	source = '<li class="visu-category"><h2>{{ title }}</h2><ul class="visu-stats"></ul></li>';
	this.category_template = Handlebars.compile(source);
	
	// Stat template
	source = jQuery('#visu-stat-template').html();
	this.stat_template = Handlebars.compile(source);
	
	// Data set template
	source = '<li class="visu-data-set"><a href="#{{key}}">{{title}}</a></li>';
	this.data_set_template = Handlebars.compile(source);
	
	// Data source template
	source = '<li class="visu-data-source"><a href="{{ url }}" class="visu-external-link">{{ title }}</a></li>';
	this.source_template = Handlebars.compile(source);

	function append_menu(root) {
		var menu = that.data['category_list'];
		var html = that.menu_template();
		
		// Append to root
		var menu_elem = jQuery(root).append(html).children().last();
		
		// Append categories
		menu_elem.each(function (index, element) {
			var i, cat_key;
			for (i = 0; i < menu.length; i++) {
				cat_key = menu[i];
				append_category(element, cat_key);
			}
		});
	}
	
	function append_category(root, key) {
		var cat = that.data['categories'][key];
		var html = that.category_template(cat);
		
		// Append to root
		var cat_elem = jQuery(root).append(html).children().last();
		
		// Append stats
		cat_elem.find('.visu-stats').each(function (index, element) {
			var i, stat_key;
			for (i = 0; i < cat.stat_list.length; i++) {
				stat_key = cat.stat_list[i];
				append_stat(element, stat_key);
			}
		});
	}
	
	function append_stat(root, key) {
		var stat = that.data['stats'][key];
		var html = that.stat_template(stat);
		
		// Append stat to the root
		var stat_elem = jQuery(root).append(html).children().last();
		var stat_content = stat_elem.find('.visu-stat-content');
		
		// Keep record
		that.stat_elements[key] = stat_elem;
		
		// Bind click event to hide others and display default data set.
		stat_elem.find('h3').click(function () {
			that.select_stat(key);
		});
		
		// Hide content by default
		stat_content.hide();
		
		// Append data sets
		stat_elem.find('.visu-data-sets').each(function (index, element) {
			var i, set_key;
			for (i = 0; i < stat.data_set_list.length; i++) {
				set_key = stat.data_set_list[i];
				append_data_set(element, set_key);
			}
		});
		
		// Append sources
		stat_elem.find('.visu-sources').each(function (index, element) {
			var i, source_key;
			for (i = 0; i < stat.source_list.length; i++) {
				source_key = stat.source_list[i];
				append_source(element, source_key);
			}
		});
	}
	
	function append_data_set(root, key) {
		
		// Check if key exists
		if (key in that.data['data_sets']) {
			var set = that.data['data_sets'][key];
			var html = that.data_set_template({key: key, title: set.title});
			
			// Append to the root
			var set_elem = jQuery(root).append(html).children().last();
			
			// Keep record
			that.data_set_elements[key] = set_elem;
			
			// Bind click event
			set_elem.click({key: key}, function (event) {
				// Inform that element was clicked to change statistic
				that.select_data_set(event.data.key);
			});
			
		} else { // No data set
			
			// Append notify instead
			var html = that.data_set_template({key: '', title: '\'' + key + '\' ei löytynyt'});
			var set_elem = jQuery(root).append(html).children().last();
		}
		
	}
	
	function append_source(root, key) {
		var data_source = that.data['sources'][key];
		var html = that.source_template(data_source);
		
		// Append to the root
		jQuery(root).append(html);
	}
	
	// Generate menu
	append_menu(this.root);
	
}

VisuMenu.prototype.select_stat = function (key) {
	// Find stat from data
	var stat = this.data['stats'][key];
	var stat_elem = this.stat_elements[key];
	var stat_content = stat_elem.find('.visu-stat-content');
	
	// Activate selected stat element
	stat_elem.toggleClass('visu-active', true);
	stat_content.slideToggle();
	
	// Deactivate other stats elements
	jQuery('.visu-stat').not(stat_elem)
		.removeClass('visu-active');
	jQuery('.visu-stat-content').not(stat_content)
		.slideUp();
	
	// Select default data set
	if (stat.data_set_list.length >= 1) {
		// Default data set is the first item in the data_set_list
		var data_set_key = stat.data_set_list[0];
		this.select_data_set(data_set_key);
	}
}

VisuMenu.prototype.select_data_set = function (key) {
	// Find data set from data
	var set = this.data['data_sets'][key];
	var set_elem = this.data_set_elements[key];
	
	// Activate selected data set
	set_elem.toggleClass('visu-active', true);
	
	// Deactivate other data sets
	set_elem.siblings().removeClass('visu-active');
	
	// Inform that data set was selected
	this.callback(set.path);
}