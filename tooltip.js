'use strict';

var Tooltip = function (){
    var bodyNode = document.getElementsByTagName("body")[0],
        that = this,
        elements = this.elements,
        config = undefined;

    this.defaults = {
        opacity: '1',
        width: '300px',
        height: '200px',
        bgColor: '#fff',
        txtColor: '#000',
        customCSS: '',
        containerClassName: 'tooltip-container'
    };

    this.init = function(options) {
        var i = 0, cur;
        config = merge(options);
        elements = polyGetByClassName('tooltip');

        for ( ; i < elements.length; ++i) {
            cur = elements[i];
            cur.addEventListener('mouseover', showTooltip);
            cur.addEventListener('mouseout', hideTooltip);
        }
    };

    function merge(options) {
        var source = that.defaults;

        if (!isUndefined(options)) {
            for (var prop in source) {
                if (!isUndefined(options[prop])) source[prop] = options[prop];
            }
        }
        return source;
    }

    function showTooltip(event) {
        var triggerElement = event.target,
            tooltipType = triggerElement.getAttribute('data-tt-type'),
            tooltipContainer = document.createElement('div'),
            tooltipPosX = event.pageX,
            tooltipPosY = event.pageY,
            tooltipContent;

            tooltipContainer.className = config.containerClassName;
            tooltipContainer.style.cssText = 'opacity:'+config.opacity+';background-color:'+config.bgColor+';width:'+config.width+';height:'+config.height+';color:'+config.txtColor+';left:'+tooltipPosX+'px;top:'+tooltipPosY+'px;'+config.customCSS+'';

        if (tooltipType === "element") {
            /*
                If tooltip type is set to element, tooltip's content can have html elements and is expected
                to be placed right after the parent element of the tooltip instance.
             */
            tooltipContent = triggerElement.parentNode.nextElementSibling.innerHTML;
            tooltipContainer.innerHTML = tooltipContent;
        } else {
            /*
                If tooltip type is set to attr or anything else, tooltip's content is retrieved from title
                attribute of the tooltip instance.
             */
            tooltipContent = triggerElement.getAttribute('title');
            tooltipContainer.innerHTML = tooltipContent;
        }

        bodyNode.appendChild(tooltipContainer);
    }

    function hideTooltip() {
        var elementsToRemove = polyGetByClassName('tooltip-container'),
            i = 0;

        for ( ; i < elementsToRemove.length; ++i) {
            bodyNode.removeChild(elementsToRemove[i]);
        }
    }

    /*
        Helper functions
    */
    function polyGetByClassName(classname) {
        if (typeof document.getElementsByClassName === 'function') {
            return document.getElementsByClassName(classname);
        } else {
            return getElementsByClassName(classname);
        }
    }

    function getElementsByClassName(className){
        var allNodes = bodyNode.getElementsByTagName('*'),
            nodesLen = allNodes.length,
            classes = undefined,
            nodes = [],
            i = 0,
            cur;

        for ( ; i < nodesLen; i++) {
            cur = allNodes[i];
            if (isUndefined(cur)) break;
            classes = cur.getAttribute('class');
            if (classes !== null && classes.indexOf(className) !== -1) {
                nodes.push(cur);
            }
        }
        return nodes;
    }

    function isUndefined(element) {
        return !!((typeof element === 'undefined'));
    }

    return {
        init: this.init
    }
};