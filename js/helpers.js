if (typeof App.helper === 'undefined' || !App.helper) {
	App.helper = {
    /* === DRAG & DROP === 
    * Script adapted from http://www.quirksmode.org/js/dragdrop.html
    */
    dragDrop: {
	    initialMouseX: undefined,
	    initialMouseY: undefined,
	    startX: undefined,
	    startY: undefined,
	    draggedObject: undefined,
	    initElement: function(element) {
		    var ele = $(element);
		    var self = this;
		    $(ele).mousedown(function(e) {
		      self.startDragMouse(e, ele)
		    });
	    },
	    startDragMouse: function(e, ele) {
		    this.startDrag(ele);
		    var evt = e || window.event;
		    var self = this;
		    this.initialMouseX = evt.clientX;
		    this.initialMouseY = evt.clientY;
		    $(document).bind('mousemove', function(e) {self.dragMouse(e)});
		    $(document).bind('mouseup', function() {self.releaseElement()});
		    return false;
	    },
	    startDrag: function(obj) {
		    if (this.draggedObject) {
			    this.releaseElement();
		    }
		    this.startX = obj.offsetLeft;
		    this.startY = obj.offsetTop;
		    this.draggedObject = obj;
		    obj.className += ' dragged';
	    },
	    dragMouse: function(e) {
		    var evt = e || window.event;
		    var dX = evt.clientX - this.initialMouseX;
		    var dY = evt.clientY - this.initialMouseY;
		    this.setPosition(dX, dY);
		    return false;
	    },
	    setPosition: function(dx, dy) {
		    this.draggedObject.style.left = this.startX + dx + 'px';
		    this.draggedObject.style.top = this.startY + dy + 'px';
	    },
	    releaseElement: function() {
		    var self = this;
		    $(document).unbind('mousemove', this.dragMouse);
		    $(document).unbind('mouseup', this.releaseElement);
		    this.draggedObject.className = this.draggedObject.className.replace(/dragged/, '');
		    this.draggedObject = null;
	    }
    },
    /* === PREVENT TAB KEY ===
    * Prevent tabbing out of a lightbox to the page below.
    * @authors		Stefan Liden (sli)
    * @usage		Call App.util.preventTab(lightboxId)
    * @param {string} lightboxId - The id of the active lightbox
    **/
    preventTab: function(lightboxId) {
        var lb = $('#' + lightboxId);
        var body = lb.find('.bd');
        var lastButton = lb.find('input:enabled:last');
        var closeImg = lb.find('input[type=image]:first');
        // If clicking on anything but an input or link, set focus on lastButton
        var setFocus = function(e) {
            var ele = e.target;
            if (lb.hasClass('level10') || lb.hasClass('level8')) {
                lastButton.focus();
            }
            else if ($(ele).hasClass('shadow') || ele.nodeName === "H2") {
                lb.find('input:visible:first').focus();
            }
            else {
                $(ele).find('input:visible:first').focus();
            }
        };

        lb.click(setFocus);

        // Check if tab is pressed when on the last button on the form,
        // and if so, stop from continuing tabbing (to prevent ending up on page below)
        if (typeof lastButton !== "undefined") {
            lastButton.keydown(function(e) {
                if (!e.shiftKey && e.keyCode === 9) {
                    return false;
                }
                else if (e.shiftKey && e.keyCode === 9) {
                    var headerInput = lastButton.closest('.lightbox').eq(0).find('.cancelX:visible');
                    if (headerInput.length < 1) {
                        return false;
                    }
                }
            });
        }
        // Check if shift + tab is pressed when on the 'close image' on the form,
        // and if so, stop from continuing tabbing (to prevent ending up on page below)
        if (typeof closeImg !== "undefined") {
            closeImg.keydown(function(e) {
                if (e.shiftKey && e.keyCode === 9) {
                    return false;
                }
            });
        }
    },
	}; // END App.helper
}