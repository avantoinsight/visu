/**
 * @package Avanto.in Visu
 * @author Akseli Palén
 * 
 * @brief VisuHelper offers some shortcut functions for other Visu modules.
 */

var visu = {
	makeArray: function (obj) {
		if (jQuery.isArray(obj)) {
			return obj;
		} else {
			return [obj];
		}
	},
	
	// Array map is associative key-value array with arrays as values.
	// This function selects n:th elements of these value arrays and 
	// returns same map with these elements as values.
	// Example:
	// var foomap = {
	//    foo: ["bar", "baz"],
	//    doo: ["dar", "daz"]
	// }
	// visu.selectSubMap(foomap, 1);
	// => {
	//       foo: "baz",
	//       doo: "daz"
	//    }
	selectSubMap: function (arraymap, index) {
		var result = {};
		for (key in arraymap) {
			var value = arraymap[key];
			if (jQuery.isArray(value)) {
				result[key] = value[index];
			} else {
				result[key] = value;
			}
		}
		return result;
	},
	
	/**
	 * Gets list of values and selects an element from it. If list is just
	 * single value, returns that value.
	 * 
 	 * @param {Array or basic data type} maybearray
 	 * @param {Integer} index
	 */
	selectElement: function (maybearray, index) {
		if (jQuery.isArray(maybearray)) {
			return maybearray[index];
		} else {
			return maybearray;
		}
	},
	
	// Get element associated to the key from map. If key is not found,
	// returns default_value. Default_value is optional. Returns undefined,
	// if default value is not set.
	get: function (map, key, default_value) {
		if (key in map) {
			return map[key];
		} else {
			return default_value;
		}
	}
}
