/**
 * @package Avanto.in Visu
 * @author Akseli Palén
 * 
 * @brief VisuAreaModal is modal info window that opens when user clicks
 * on an area on VisuMap. Calls more basic VisuModal to display the window.
 * VisuAreaModal is called from VisuMap.
 * 
 * Precondition:
 *   root have to have 'position: relative' in css to VisuModal to work.
 */


function VisuAreaModal(root_selector) {
	// Extend from VisuModal
	this.modal = new VisuModal(root_selector);
	
	// Handlebars template
	source = jQuery('#visu-area-modal-template').html();
	this.template = Handlebars.compile(source);
}

VisuAreaModal.prototype.view = function (areas, dataset, areakey) {
	
	// Generate context
	var item_keys = visu.makeArray(dataset['data-description']);
	var item_units = visu.makeArray(dataset['data-unit-symbol']);
	var item_values = visu.makeArray(dataset['data'][areakey]);
	var items = jQuery.map(item_keys, function (element, index) {
		return {
			key: element,
			value: item_values[index] + ' ' + item_units[index]
		}
	});
	
	// Render to html
	var contenthtml = this.template({
		name: areas[areakey].name,
		url: areas[areakey].url,
		url_title: areas[areakey].url_title,
		items: items
	});
	
	// View as modal window
	this.modal.view(contenthtml);
}

VisuAreaModal.prototype.hide = function () {
	this.modal.hide();
}

/*
.on('click', function (d) {
				
				// Bring up modal window
				var context = {
					name: d.properties.name,
					url: d.properties.url,
					url_title: d.properties.url_title,
					value: T.data[d.id],
					value_unit: T.data_unit_symbol,
					change: '+12.3%',
					average: T.data['koko-suomi']
				}
				var rendered = T.modal_template(context);
				T.modal_content.html(rendered);
				T.modal_bg.fadeIn(400);
				T.modal_layer.fadeIn(400);
				
			});
			

<script id="visu-modal-template" type="text/x-handlebars-template">
	<h2>{{ name }}</h2>
	<div><a href="{{ url }}">{{ url_title }}</a></div>
	<p class="visu-value">{{ value }} {{ value_unit }}</p>
	
	{{#if change}}
	<p class="visu-change">{{ change }}</p>
	{{/if}}
	
	{{#if average}}
	<p class="visu-average">Koko maa: {{ average }} {{ value_unit }}</p>
	{{/if}}
</script>
*/