var Placeholders = (function () {

	"use strict";

	// These are the only input types that support the pattern attribute. See https://developer.mozilla.org/en-US/docs/HTML/Element/Input#Attributes
	var validTypes = [
		"text",
		"search",
		"tel",
		"url",
		"email"
	];

	function init(opts) {

		//Create an input element to test for the presence of the pattern property. If the pattern property exists, stop.
		var test = document.createElement("input");

		//Test input element for presence of pattern property. If it doesn't exist, the browser does not support the HTML5 pattern attribute
		if (!test.pattern) {

		}

		//Pattern attribute already supported by browser :)
		return false;
	}

	//Expose public methods
	return {
		init: init
	};

}());