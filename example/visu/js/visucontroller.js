/**
 * @package Avanto.in Visu
 * @author Akseli Palén
 * 
 * @brief Controls five modules: VisuStatus, VisuTitle, VisuMenu,
 * VisuMap and VisuTable. Builds the modules, loads JSON data for them
 * and calls module view-methods. 
 */

function VisuController() {
	
	// JavaScript works, change notice message
	var status = new VisuStatus('.visu-status');
	status.view('Ladataan alueita...');
	
	// Visu elements require hardcoded html markup
	var menu_slot = jQuery("#visu-menu-slot");
	var title_slot_selector = "#visu-title-slot";
	var map_slot_selector = "#visu-map-slot";
	var table_slot = jQuery("#visu-table-slot");
	
	// This tells what data set is displayed right now.
	// This makes possible to prevent reloading current data set
	// for example when user clicks same data set link multiple times.
	this.current_data_path = ''; 
	
	var title, table, map, menu;
	var that = this;
	
	// Menu calls this function when user wants to change data set
	function change_data_set(path) {
		// Change statistics only if not same as current
		if (that.current_data_path != path) {
			that.current_data_path = path;
			
			jQuery.getJSON('visu/data/datasets/' + path, function (json) {
				title.view(json);
				map.view(json);
				table.view(json);
			});
		}
	}
	
	// Load areas and construct map and table visualisation
	jQuery.getJSON('visu/data/map.json', function (json) {
		title = new VisuTitle(title_slot_selector);
		map = new VisuMap(json['areas'], json['shapes'], map_slot_selector);
		table = new VisuTable(json['area_list'], json['special_area_list'], json['areas'], table_slot);
		
		// Areas and shapes are loaded successfully. Menu is next.
		status.view('Ladataan tilastoja...');
		
		// Construct menu and select default stat.
		// Do this after map.json is loaded to avoid undefined values on views.
		jQuery.getJSON('visu/data/menu.json', function (jsondata) {
			
			// Use change_data_set as callback. Callback is executed
			// when user wants to browse other statistics.
			menu = new VisuMenu(jsondata, menu_slot, change_data_set);
			
			// Change to default stat. This calls change_data_set function.
			menu.select_stat('vaestonmuutos'); // Default stat
			
			// When everything is loaded, hide loading status.
			status.hide();
		});
		
	});
	
	
}
