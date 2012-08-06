var Patterns = (function () {

	"use strict";

	// These are the only input types that support the pattern attribute. See https://developer.mozilla.org/en-US/docs/HTML/Element/Input#Attributes
	var validTypes = [
		"text",
		"search",
		"tel",
		"url",
		"email"
	];
	
	/* The submitHandler function is executed when the containing form, if any, of a given input element is submitted. If necessary, patterns on any
	 * input element descendants of the form are executed and the form submission is prevented if any fail to match the value of that input */
	function submitHandler(form) {
		var inputs = form.getElementsByTagName("input"),
			numInputs = inputs.length,
			element,
			pattern,
			rPattern,
			i;

		//Iterate over all descendant input elements and attempt to match pattern with value
		for (i = 0; i < numInputs; i++) {
			element = inputs[i];
			
			//Get the pattern attribute of the current input element
			pattern = element.getAttribute("pattern");
			
			//Ensure the input element is of the correct type and has a pattern attribute
			if (validTypes.indexOf(element.type) > -1 && pattern) {
			
				try {
					//Attempt to compile the pattern attribute value into a regex
					rPattern = new RegExp(pattern);
				} catch (e) {
					//Invalid regex, skip this input
					continue;
				}
				
				//Test the value of the input element against the pattern
				if (!rPattern.test(element.value)) {
				
					//The pattern didn't match, so prevent the form from being submitted
					return false;
				}
				
				//If we reach this point then the input has passed the test
			}
		}
	}

	/* The setupPatterns function checks all input elements currently in the DOM for the pattern attribute. If the attribute
	 * is present, and the element is of a type (e.g. text) that allows the pattern attribute, it attaches the appropriate event listeners
	 * to the ancestor form element */
	function setupPatterns() {

		//Declare variables and get references to all input elements
		var forms = document.getElementsByTagName("form"),
			numForms = forms.length,
			i,
			form;

		//Iterate over all input elements and apply placeholder polyfill if necessary
		for (i = 0; i < numForms; i++) {
		
			form = forms[i];
			
			//Bind a submit event handler to the form (cross-browser)
			if (form.addEventListener) {
				form.addEventListener("submit", function () {
					return submitHandler(form);
				}, false);
			} else if (form.attachEvent) {
				form.attachEvent("onsubmit", function () {
					return submitHandler(form);
				});
			}
		}
	}
	
	function init(opts) {

		//Create an input element to test for the presence of the pattern property. If the pattern property exists, stop.
		var test = document.createElement("input");

		//Test input element for presence of pattern property. If it doesn't exist, the browser does not support the HTML5 pattern attribute
		if (!test.pattern) {
		
			//We use Array.prototype.indexOf later, so make sure it exists
			if (!Array.prototype.indexOf) {
				Array.prototype.indexOf = function (obj, start) {
					for (i = (start || 0), j = this.length; i < j; i += 1) {
						if (this[i] === obj) { return i; }
					}
					return -1;
				};
			}
			
			setupPatterns();
		}

		//Pattern attribute already supported by browser :)
		return false;
	}

	//Expose public methods
	return {
		init: init
	};

}());