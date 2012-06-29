/**
 * @package Avanto.in Visu
 * @author Akseli Palén
 * 
 * @brief VisuModal is modal info window that opens on given
 * given root element. Called from VisuAreaModal.
 * 
 * Precondition:
 *   root have to have 'position: relative' in css to VisuModal to work.
 */

function VisuModal(root_selector) {
	var source;
	
	// Handlebars template for modal info window
	source = jQuery('#visu-modal-template').html();
	this.template = Handlebars.compile(source);
	
	// Select root.
	this.root = jQuery(root_selector);
	
	// Generate modal info window
	var html = this.template();
	this.root.append(html);
	// Hide immediately
	this.bg_element = this.root.find('.visu-modal-bg').hide();
	this.frame_element = this.root.find('.visu-modal-frame').hide();
	
	// Shortcut to content and close action
	this.content_element = this.frame_element.find('.visu-modal-content');
	this.close_element = this.frame_element.find('.visu-modal-close');
	
	// Close the window if frame is pressed
	var that = this;
	this.frame_element.click(function (event) {
		that.hide();
		event.stopPropagation(); // Good manners
	});
	
	// Close the window if close action is pressed
	this.frame_element.click(function (event) {
		that.hide();
		event.stopPropagation(); // Good manners
	});
}

VisuModal.prototype.view = function (content) {
	/**
	 * Parameters:
	 * 	content can be jQuery object, html string or DOM element.
	 */
	this.content_element.empty();
	
	this.content_element.append(content);
	
	// Show
	this.bg_element.fadeIn(400);
	this.frame_element.fadeIn(400);
}

VisuModal.prototype.hide = function () {
	this.bg_element.fadeOut(400);
	this.frame_element.fadeOut(400);
}
