var TooltipManager = (function () {
    'use strict';
    var self = {
        fragment: undefined,
        /*
@name TooltipManager
@info The main method, adds an onmouseover event on the selected nodes, based on a class name
@param Node container (e.g. : document.body)
@param string className
@param boolean onMouseOutMode [optional]
@return void
*/
        TooltipManager: function TooltipManager(container, className, onMouseOutMode) {
            var nodes, length, key;
            nodes = container.getElementsByClassName(className);
            length = nodes.length;
            if(length !== 0) {
                if(self.fragment === undefined) {
                    self.createFragment(!!onMouseOutMode);
                }
                for(key = 0; key < length; key++) {
                    self.createTooltip(nodes[key]);
                }
            }
        },
        /*
@name createFragment
@info creates a generic fragment
@param boolean onMouseOutMode
@return void
*/
        createFragment: function createFragment(onMouseOutMode) {
            var fragment, tooltip, closer;
            fragment = document.createDocumentFragment();
            // uses a span (preferable to a div, semantically)
            tooltip = document.createElement('span');
            fragment.appendChild(tooltip);
            tooltip.appendChild(document.createTextNode());
            if(!onMouseOutMode) {
                // uses a button (preferable to an anchor, semantically)
                closer = document.createElement('button');
                closer.appendChild(document.createTextNode('x'));
                tooltip.appendChild(closer);
            }
            self.fragment = fragment;
        },
        /*
@name createTooltip
@info creates an onmouseover tooltip on an element
@param Node node
@return void
*/
        createTooltip: function createTooltip(node) {
            var fragment, tooltip, closer, close;
            // the closer function (triggered on an onmouseout event or an onclick event on the x button)
            close = function close() {
                // the tooltip returns in its documentFragment
                fragment.appendChild(tooltip);
            };
            // adds the onmouseover event on the node
            node.addEventListener('mouseover', function(event) {
                var parentNode, nextNode;
                event.preventDefault();
                parentNode = this.parentNode;
                nextNode = this.nextSibling;
                // creates a clone of the generic documentFragment, during the first onmouseover
                if(typeof fragment !== 'object') {
                    fragment = self.fragment.cloneNode(true);
                    tooltip = fragment.firstChild;
                    // adds the text content of the tooltip (based on the node title attribute)
                    tooltip.firstChild.nodeValue = this.title;
                    closer = tooltip.getElementsByTagName('button')[0];
                    // adds the onmouseout event on the node or the click event on the x button (if exists)
                    if(typeof closer === 'object') {
                        closer.addEventListener('click', close);
                    }
                    else{
                        this.addEventListener('mouseout', close);
                    }
                }
                tooltip.style.left = event.pageX + 'px';
                tooltip.style.top = event.pageY + 'px';
                // appends the node to the document
                if(typeof nextNode === 'object') {
                    parentNode.insertBefore(tooltip, nextNode);
                }
                else{
                    parentNode.appendChild(tooltip);
                }
            });
        }
    };
    return self.TooltipManager;
})();
