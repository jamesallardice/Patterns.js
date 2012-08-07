var Patterns = (function () {

	"use strict";

	// These are the only input types that support the pattern attribute. See https://developer.mozilla.org/en-US/docs/HTML/Element/Input#Attributes
	var validTypes = [
			"text",
			"search",
			"tel",
			"url",
			"email"
		],
		defaultMessage,
		tooltip;

	//The getTooltipPosition function returns the position a tooltip should be placed in, relative to the document, depending on the input it applies to
	function getTooltipPosition(elem) {

		var boundingClientRect;

		if (elem.getBoundingClientRect) {

			//Get the position of the element using the native method as defined in the CSSOM spec
			boundingClientRect = elem.getBoundingClientRect();
			
			//Only return the properties we need (for consistency with polyfill below), adjusting the top so the tooltip appears under the input
			return {
				left: boundingClientRect.left,
				top: boundingClientRect.top + elem.offsetHeight
			};

		} else {

			//The native getBoundingClientRect method isn't supported, so semi-polyfill it (only the bits we really need)
			var x = 0,
				y = 0;

			//Loop through the elements offset parents, maintaining a running offset total
			do {
				x += elem.offsetLeft - elem.scrollLeft;
				y += elem.offsetTop - elem.scrollTop;
			} 
			while (elem = elem.offsetParent);

			//Return the offset values, adjusting the top so the tooltip appears under the input
			return { 
				left: x,
				top: y + elem.offsetHeight
			};
		}
	}

	/* The submitHandler function is executed when the containing form, if any, of a given input element is submitted. If necessary, patterns on any
	 * input element descendants of the form are executed and the form submission is prevented if any fail to match the value of that input */
	function submitHandler(form) {
		var inputs = form.getElementsByTagName("input"),
			numInputs = inputs.length,
			element,
			pattern,
			rPattern,
			tooltipOffset,
			i;

		//Iterate over all descendant input elements and attempt to match pattern with value
		for (i = 0; i < numInputs; i++) {
			element = inputs[i];

			//Get the pattern attribute of the current input element
			pattern = element.getAttribute("pattern");

			//Ensure the input element has a value, is of the correct type and has a pattern attribute
			if (element.value && validTypes.indexOf(element.type) > -1 && pattern) {

				//Ensure the pattern is anchored to both the start and end of the string, since the entire input value must match
				if (pattern.charAt(0) !== "^") {
					pattern = "^" + pattern;
				}
				if (pattern.charAt(pattern.length - 1) !== "$") {
					pattern += "$";
				}

				try {
					//Attempt to compile the pattern attribute value into a regex
					rPattern = new RegExp(pattern);
				} catch (e) {
					//Invalid regex, skip this input
					continue;
				}

				//Test the value of the input element against the pattern
				if (!rPattern.test(element.value)) {

					//The pattern didn't match. Get the position of the input so we can display a tooltip
					tooltipOffset = getTooltipPosition(element);

					//Set the content of the tooltip to the value of the title attribute (as per spec)
					tooltip.innerHTML = element.getAttribute("title") || defaultMessage;

					//Set the position of the tooltip and display it
					tooltip.style.left = tooltipOffset.left;
					tooltip.style.top = tooltipOffset.top;
					tooltip.style.display = "block";

					//Prevent the form from being submitted
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

		/* Iterate over all input elements and apply placeholder polyfill if necessary. We can't delegate the event higher up the tree 
		 * because the submit event doesn't bubble in IE < 8 */
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
		var test = document.createElement("input"),
			i,
			j;

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

			//This is the default message currently displayed by all browsers when no title attribute is present on the input element
			defaultMessage = "Please match the requested format.";

			//Create the element that will be used as the tooltip (displayed when an input value doesn't match its pattern)
			tooltip = document.createElement("div");
			tooltip.style.position = "absolute";
			tooltip.style.display = "none";

			//Append the tooltip element to the DOM (it's hidden at this point)
			document.body.appendChild(tooltip);

			setupPatterns();

			//Pattern attribute was successfully polyfilled :)
			return true;
		}

		//Pattern attribute already supported by browser :)
		return false;
	}

	//Expose public methods
	return {
		init: init
	};

}());