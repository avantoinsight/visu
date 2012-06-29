/**
 * @package Avanto.in Visu
 * @author Akseli Palén
 * 
 * @brief VisuTitle is located above map and table. It is used to display
 * data set title. Called from VisuController.
 */

function VisuTitle(root_selector) {
	var source;
	
	// Hide title by default. Show when first time stat is shown.
	// This prevents flash of empty bar during loading
	this.jroot = jQuery(root_selector).hide();
	this.root_hidden = true;
	
	// Data set title. Update element content when stat changes.
	var source = '<div class="visu-title"><h2 class="visu-title-heading"></h2></div>';
	this.element = jQuery(root_selector).append(source).children().last();
	this.heading_element = this.element.find('.visu-title-heading');
}

VisuTitle.prototype.view = function (data) {
	// Update title
	this.heading_element.text(data['title']);
	
	// Show the title if hidden
	if (this.root_hidden) {
		this.jroot.fadeIn(500);
		this.root_hidden = false;
	}
}

