/**
 * @package Avanto.in Visu
 * @author Akseli Palén
 * 
 * @brief VisuStatus is used to display a message during loading and to
 * hide the message and loading animation when completed. Called from
 * VisuController.
 */

function VisuStatus(root_selector) {
	// Requires prefilled html elements with message about missing js support.
	
	this.jroot = jQuery(root_selector);
	this.root_hidden = false;
	
	this.loading_element = this.jroot.find('.visu-loading');
	this.notice_element = this.jroot.find('.visu-notice');
}

VisuStatus.prototype.view = function (message) {
	
	// Update title
	this.notice_element.text(message);
	
	// Show the title if hidden
	if (this.root_hidden) {
		this.jroot.show();
		this.root_hidden = false;
	}
}

VisuStatus.prototype.hide = function () {
	this.jroot.hide();
	this.root_hidden = true;
}
