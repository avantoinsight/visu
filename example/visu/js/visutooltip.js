/**
 * @package Avanto.in Visu
 * @author Akseli Palén
 * 
 * @brief VisuTooltip is little hovering box nearby the cursor when it
 * moves over area on VisuMap. Called from VisuMap.
 * 
 * Precondition:
 *   root have to have 'position: relative' in css to VisuModal to work.
 */

function VisuTooltip() {
	// Root element
	jQuery('body').append("<div class='visu-tooltip' id='visu-tooltip'></div>");
	this.elem = jQuery('#visu-tooltip').css({opacity:0.8, display:"none"});
	
	// Tooltip template, render on show
	source = jQuery('#visu-tooltip-template').html();
	this.template = Handlebars.compile(source);
}

VisuTooltip.prototype.show = function (title, items) {
	// Update content
	var html = this.template({title: title, items: items});
	this.elem.html(html); // Update content
	
	// Stop other effects and show tooltip
	this.elem.stop(true, true);
	this.elem.fadeIn(400);
}

VisuTooltip.prototype.hide = function () {
	// Hide tooltip
	this.elem.stop(true, true);
	this.elem.fadeOut(400);
}

VisuTooltip.prototype.move = function (x, y) {
	// Move tooltip
	this.elem.css({left:x+15, top:y+15});
}