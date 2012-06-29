/**
 * @package Avanto.in Visu
 * @author Akseli Palén
 * 
 * @brief main.js starts visualisation by calling VisuController after the page
 * has loaded.
 * 
 * Requirements:
 *   jQuery 1.4.4 (not tested with later)
 *   Modernizr.js 2.5.3 (only for inline svg check)
 *   d3.js v2 (SVG visualisation)
 *   Handlebars.js 1.0.0 (for compiling HTML templates)
 * 
 * Module depedency/call tree:
 *   main
 *     VisuController
 *       VisuStatus
 *       VisuTitle
 *       VisuMap
 *         VisuTooltip
 *         VisuLegend
 *         VisuAreaModal
 *           VisuModal
 *       VisuTable
 *       VisuMenu
 *     VisuHelpers (required by multiple modules)
 * 
 * Notes for developers:
 *   Use jQuery instead of $ to avoid name problems in target environment. 
 */

jQuery(document).ready(function() {
	var v = new VisuController();
});