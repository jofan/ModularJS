/* =====================================================
*
* Namespaces: App.events
*
* This handles event related things. Implements class-based
* event delegation.
*
* ====================================================== */

App.events = {
  // Browser compatible function for adding listeners
	addListener: function(ele, eType, handler) {
		// Focus and blur events should be captured on capture, not bubble
	  var onCapture = (eType === 'focus' || eType === 'blur') ? true : false;
		if(window.addEventListener) {
			ele.addEventListener(eType, handler, onCapture);
		}
		else if(window.attachEvent) {
			if(onCapture) {
				if(eType === 'focus') {
					ele.attachEvent('onfocusin', handler);
				}
				else {
					ele.attachEvent('onfocusout', handler);
				}
			}
			else {
				//ele.attachEvent('on' + eType, handler);
				ele.attachEvent("on" + eType, function(e){
				  e.currentTarget = ele;
				  handler(e);
				});
			}
		}
		else {
			ele['on' + eType] = handler;
		}
	},
	// Browser compatible function to add all global listeners
  addGlobalListeners: function() {
		// 'change' should not be included as it does not work in IE
		var events = [
			'blur',	
			'click',
			'focus',
			'keydown',
			'keypress',
			'keyup',
			'submit',
			'load'
		];
		for(var i = 0, len = events.length; i < len; i++) {
			this.addListener(document.body, events[i], this.handleEvent);
		}
	},
  // It is possible to register events to the following event objects
  // Add global event defaults here, or in config?
  click: {},
  dblClick: {},
  keypress: {},
  keydown: {},
  keyup: {},
  mouseOver: {},
  mouseOut: {},
  mouseDown: {},
  mouseUp: {},
  focus: {},
  blur: {},
  change: {},
  submit: {},
  defaults: {},
  
  fieldValue: '',
  // Change does not bubble in IE, this is the fix.
  fixChange: function(data) {
    var ele = data.ele,
        eType = data.type,
        blurValue;
    try {
      if(ele.tagName === "INPUT" || ele.tagName === "SELECT") {
        if(eType === 'focus') {
          App.events.fieldValue = $(ele).val();
        }
        else if (eType === 'blur') {
          blurValue = $(ele).val();
          if(blurValue !== App.events.fieldValue) {
            data.type = 'change';
            App.events.handleEvent('', data);
          }
          App.events.fieldValue = '';
        }
      }
    }
    catch(err) {
      
    }
  },
  lastFocus: '',
  
  handleEvent: function(e) {
    e = e || window.event;
		var ele = e.target || e.srcElement,
		    eType = e.type,
		    eObj,
		    data = {
		      'ele': ele  
		    }, // Object to hold event data to pass onto handlers
		    evts = ele.getAttribute('data-events');
		    //classes = ele.className;
		// Get classes, return if no classes
		// TODO: to better check if has one of the event classes see following code:
		// http://demos.hacks.mozilla.org/openweb/classList/classList.js
		
		
		switch(eType) {
			case 'click':
				eObj = App.events.click;
				break;
			case 'change':
				eObj = App.events.change;
				break;
			case 'mouseover':
				eObj = App.events.hover;
				break;
			case 'mouseout':
				eObj = App.events.hover;
				break;
			case 'keydown':
				eObj = App.events.keydown;
				break;
			case 'keypress':
				eObj = App.events.keypress;
				break;
			case 'keyup':
				eObj = App.events.keyup;
				break;
			case 'focusin':
				eType = 'focus';
			case 'focus':
				eObj = App.events.focus;
				App.events.lastFocus = ele;
				break;
			case 'focusout':
				eType = 'blur';
			case 'blur':
				eObj = App.events.blur;
				break;
			case 'submit':
				eObj = App.events.submit;
				break;
			default:
				return;
		}
		
		// Broadcast that an event has happened,
		// this can be used as a hook for adding default actions.
		App.bus.notify(eType, data);
		
		if(!!evts) {
			evts = evts.split(' ');
			var i = evts.length;
		
    		while (i--) {
    			if (evts[i] in eObj) {
    				eObj[evts[i]](data);
    			}
    			else if(evts[i] in App.events.defaults) {
    				App.events.defaults[evts[i]](data);
    			}
    		}
		}
		
  },
  fixEvent: function(event) {
    // add W3C standard event methods
    event.target = event.srcElement;
    event.preventDefault = this.preventDefault;
    event.stopPropagation = this.stopPropagation;
    return event;
  },
  preventDefault: function() {
    this.returnValue = false;
  },
  stopPropagation: function() {
    this.cancelBubble = true;
  }
  /*preventDefault: function(e) {
    if (e.preventDefault){
      e.preventDefault();
    }
    else {
      e.returnValue = false;
    }
  },
  stopPropagation: function(e) {
    if (e.stopPropagation){
      e.stopPropagation();
    }
    else {
      e.cancelBubble = true;
    }
  }*/
  
};