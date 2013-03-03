var Tooltip = (function (){
    'use strict';

    var bodyNode = document.getElementsByTagName("body")[0],
        elements = undefined,
        config = undefined,
        containerCssClass = 'tooltip-container',
        defaults = {
            opacity: '1',
            hideOnMouseOut: true
        };

    function merge(options) {
        if (!isUndefined(options)) {
            for (var prop in defaults) {
                if (!isUndefined(options[prop])) defaults[prop] = options[prop];
            }
        }
        return defaults;
    }

    /*
     Helper functions
     */
    function polyGetByClassName(classname) { //feature detection
        if (typeof document.getElementsByClassName === 'function') {
            return document.getElementsByClassName(classname);
        } else {
            return getElementsByClassName(classname);
        }
    }

    /*
    getElementsByClassName Polyfill for IE8 and below
    */
    function getElementsByClassName(className){
        var allNodes = bodyNode.getElementsByTagName('*'),
            nodesLen = allNodes.length,
            classes = undefined,
            nodes = [],
            i = 0,
            cur;

        for ( ; i < nodesLen; i++) {
            cur = allNodes[i];
            if (!isUndefined(cur)) break;
            classes = cur.getAttribute('class');
            if (classes !== null && classes.indexOf(className) !== -1) {
                nodes.push(cur);
            }
        }
        return nodes;
    }

    function isUndefined(element) {
        return !!(typeof element === 'undefined');
    }

    return function Tooltip() {

        /*
        initialising all tooltips
            (attaching mouseover event to all elements that have class tooltip)
         */
        var init = function init(options) {
            var i = 0, cur, len;

            config = merge(options);
            elements = polyGetByClassName('tooltip');
            len = elements.length;

            for ( ; i < len; ++i) {
                cur = elements[i];
                cur.addEventListener('mouseover', showTooltip);
            }
        }

        /*
        triggered by mouseover event
            - If tooltip type is set to element, tooltip's content can have html elements and is expected
         to be placed right after the parent element of a given tooltip instance.
            - If tooltip type is set to attr or anything else, tooltip's content is retrieved from title
         attribute of a given tooltip instance.

        all visible tooltips will be removed, as only one tooltip is supposed to be visible by default;

        attaching mouseout/click events depending on the options specified:
            if hideOnMouse = false - click
            if hideOnMouse = true  - mouseout
         */
        function showTooltip(event) {
            if (polyGetByClassName(containerCssClass).length > 0) hideTooltip();

            var triggerElement = event.target,
                tooltipType = triggerElement.getAttribute('data-tt-type'),
                frag = document.createDocumentFragment(),
                tooltipContainer = document.createElement('div'),
                tooltipPosX = event.pageX,
                tooltipPosY = event.pageY,
                tooltipContent;

            frag.appendChild(tooltipContainer);
            tooltipContainer.className = containerCssClass;
            tooltipContainer.style.cssText = 'left:'+tooltipPosX+'px;top:'+tooltipPosY+'px;';

            if (tooltipType === "element") {
                tooltipContent = triggerElement.parentNode.nextElementSibling.innerHTML;
                tooltipContainer.innerHTML = tooltipContent;
            } else {
                tooltipContent = triggerElement.getAttribute('title');
                tooltipContainer.innerHTML = tooltipContent;
            }

            if (config.hideOnMouseOut) {
                this.addEventListener('mouseout', hideTooltip);
            } else {
                var hideAnchor = document.createElement('a');
                hideAnchor.innerText = 'x';
                hideAnchor.className = 'hideTooltip';
                hideAnchor.addEventListener('click', hideTooltip);
                tooltipContainer.appendChild(hideAnchor);
            }

            bodyNode.appendChild(frag);
            triggerElement.setAttribute('data-status', 'active');
        }

        /*
        triggered by mouseout/click event and/or mouseover on the element that has class tooltip
         */
        function hideTooltip(event) {
            if (!isUndefined(event) && event.type === 'click') event.preventDefault();

            var elementsToRemove = polyGetByClassName(containerCssClass),
                len = elementsToRemove.length, i = 0;

            for ( ; i < len; ++i) {
                bodyNode.removeChild(elementsToRemove[i]);
            }
        }

        /*
        public  method(s)
         */
        return {
            init: init
        }
    };
})();