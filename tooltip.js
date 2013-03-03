var TooltipManager = (function () {
    'use strict';
    var self = {
        /*
            @param Node container
            @param string className
            @param boolean onMouseOutMode
        */
        TooltipManager: function TooltipManager(container, className, onMouseOutMode) {
            var nodes, length, key, fragment;
            nodes = container.getElementsByClassName(className);
            length = nodes.length;
            if(length !== 0){
                fragment = self.createFragment(onMouseOutMode);
                for(key = 0; key < length; key++) {
                    self.createTooltip(nodes[key], fragment);
                }
            }
        },
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
            return fragment;
        },
        createTooltip: function createTooltip(node, defaultFragment) {
            var fragment, tooltip, closer, close;
            close = function close(){
                fragment.appendChild(tooltip);
            };
            node.addEventListener('mouseover', function(event) {
                var parentNode, nextNode;
                this.preventDefault();
                parentNode = this.parentNode;
                nextNode = this.nextSibling;
                if(typeof fragment !== 'object') {
                    fragment = defaultFragment.cloneNode(true);
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
