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
            tooltip = document.createElement('span');
            fragment.appendChild(tooltip);
            tooltip.appendChild(document.createTextNode());
            if(onMouseOutMode) {
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
            close = function close() {
                fragment.appendChild(tooltip);
            };
            node.addEventListener('mouseover', function(event) {
                var parentNode, nextNode;
                event.preventDefault();
                parentNode = this.parentNode;
                nextNode = this.nextSibling;
                if(typeof fragment !== 'object') {
                    fragment = self.fragment.cloneNode(true);
                    tooltip = fragment.firstChild;
                    tooltip.firstChild.nodeValue = this.title;
                    closer = tooltip.getElementsByTagName('button')[0];
                    if(typeof closer === 'object') {
                        closer.addEventListener('click', close);
                    }
                    else{
                        this.addEventListener('mouseout', close);
                    }
                }
                tooltip.style.left = event.pageX + 'px';
                tooltip.style.top = event.pageY + 'px';
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
