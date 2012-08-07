#Patterns.js - An HTML5 `pattern` attribute polyfill

Patterns.js is a polyfill (or shim, or whatever you like to call it) for the HTML5 `pattern` attribute, as defined in the <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/common-input-element-attributes.html#attr-input-pattern">HTML living standard</a>. Pattern attributes are valid on `input` elements of the `text`, `search`, `tel`, `url` and `email` types.

##Features

 - Works by finding `pattern` attributes on `input` elements, so there's no need to call it repeatedly for every element. Just add the `pattern` attribute to your markup as if it were supported natively.
 - Allows you to style the error tooltip as you please (since all browsers that support the attribute natively currently style the tooltip differently)
 - Works for elements that are added to the DOM after the page has loaded, and also for elements whose `pattern` attribute value changes after the page has loaded
 - Wide range of browsers supported, including IE6
 - No dependencies (so there's no need to include jQuery)
 - All of the above in under 2kB when minified, and under 1kB when gzipped!

##How do I use it?

Patterns.js is designed to replicate native `pattern` attribute functionality as best as it can. To get it working, simply define `pattern` attributes on your `input` elements as usual:

    <label>
      Part number:
      <input pattern="[0-9][A-Z]{3}" name="part" title="A part number is a digit followed by three uppercase letters.">
    </label>
    
Then just include the script and call the `init` method on DOM ready, or at the end of the `body` element:

    Patterns.init();
    
That's all there is to it! Browsers that alreay support the `pattern` attribute natively will be unaffected. They continue to use their built-in method.

##The `init` method

The `init` method is all that you need to call to get the polyfill working. It accepts one argument, `settings`. The `settings` argument should be an object. It currently supports three properties:

 - `defaultMessage` - This option allows you to change the default message that is displayed when no `title` attribute is present on the `input` element, and optionally prepended to the value of the `title` attribute when it is present. **Default: `"Please match the requested format."`**.

 - `prependDefaultMessage` - If `true`, this option will cause the default message to be prepended to the value of the `title` attribute when displaying the tooltip for an input whose value doesn't match its `pattern` attribute. This is what most current browsers seem to do. **Default: `true`**.

 - `tooltipClassName` - This option allows you to specify a custom class name for the tooltip element created by the polyfill. The tooltip is displayed underneath the first input whose value fails to match its pattern. **Default: `"patternsjs-tooltip"`**.

Here's an example call to the `init` method:

    Patterns.init({
    	defaultMessage: "The value you entered is invalid.", //Displayed when no `title` attribute is present
    	prependDefaultMessage: false, //Don't prepend the default message if no `title` attribute is present
    	tooltipClassName: "myCustomClassName" //Don't use the default class name on the tooltip element
    });
    
##Known Issues

 - Browsers currently vary wildly in how they display messages resulting from `pattern` mismatches. For that reason it's been left up to you to style the tooltip as you please. If and when standards emerge, they will be incorporated into the polyfill.

 - Since the polyfill uses a normal `div` element to display the message when an `input` value doesn't match its `pattern`, you have to be careful to style the tooltip correctly. It will pick up any of your existing styles that apply to selectors that would match it. The native version doesn't have this problem, since the tooltip isn't a DOM element in that case.
    
##Supported Browsers

Patterns.js aims to support the widest range of browsers possible. The idea is that you will be able to use the native `pattern` attribute along with Patterns.js and your users on any platform will get the same experience. This table will be updated as and when further browsers are tested. Mobile browser testing is a big one that's high on the list. Currently tested and working in the following browsers on (where applicable) both Windows 7 and Ubuntu 12:

 - Internet Explorer 6 - 9 (with Patterns.js)
 - Safari 3.2 - 5.1 (with Patterns.js)
 - Chrome 1 - 9 (with Patterns.js), 10+ (native)
 - Firefox 3 (with Patterns.js), 4+ (native)
 - Opera 8 - 11 (with Patterns.js), 12 (native)

Do you use some obscure browser that doesn't have native `pattern` attribute support? If so, please let me know so I can make sure Patterns.js works with it.