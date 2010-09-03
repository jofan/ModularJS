Module.mixin.Events2 = new Class({
  // addEvent/removeEvent written by Dean Edwards, 2005
  // with input from Tino Zijdel
  // http://dean.edwards.name/weblog/2005/10/add-event/
  
  addEvent: function(element, type, handler) {
    // assign each event handler a unique ID
    if (!handler.$$guid) handler.$$guid = this.guid++;
    // create a hash table of event types for the element
    if (!element.events) element.events = {};
    // create a hash table of event handlers for each element/event pair
    var handlers = element.events[type];
    if (!handlers) {
      handlers = element.events[type] = {};
      // store the existing event handler (if there is one)
      if (element["on" + type]) {
        handlers[0] = element["on" + type];
      }
    }
    // store the event handler in the hash table
    handlers[handler.$$guid] = handler;
    // assign a global event handler to do all the work
    element["on" + type] = this.handleEvent;
    element.atr = {
      'click': {
        'datepicker': function(data) {App.log(data.ele)}
      },
      'focus': {
        'magicInput': function(data) {App.log(data.ele)}
      }
    }
  },
  delegate: function(attr, type, handler) {
    var element = this.domEle;
    // assign each event handler a unique ID
    if (!handler.$$guid) handler.$$guid = attr;
    // create a hash table of event types for the element
    if (!element.events) element.events = {};
    // create a hash table of event handlers for each element/event pair
    var handlers = element.events[type];
    if (!handlers) {
      handlers = element.events[type] = {};
      // store the existing event handler (if there is one)
      if (element["on" + type]) {
        handlers[attr] = element["on" + type];
      }
    }
    // store the event handler in the hash table
    handlers[handler.$$guid] = handler;
    // assign a global event handler to do all the work
    element["on" + type] = this.handleEvent;
  },
  // a counter used to create unique IDs
  guid: 1,
  removeEvent: function(element, type, handler) {
    // delete the event handler from the hash table
    if (element.events && element.events[type]) {
      delete element.events[type][handler.$$guid];
    }
  },
  handleEvent: function(event) {
    var returnValue = true;
    // grab the event object (IE uses a global event object)
    event = event || App.events.fixEvent(window.event);
    // get a reference to the hash table of event handlers
    var handlers = this.events[event.type];
    
    //var ele = event.target || event.srcElement;
    App.log(this.atr);
    App.log(event.target);
    // execute each event handler
    for (var i in handlers) {
      this.$$handleEvent = handlers[i];
      if (this.$$handleEvent(event) === false) {
        returnValue = false;
      }
    }
    return returnValue;
  },
  // Add some "missing" methods to IE's event object
  /*fixEvent: function(event) {
    // add W3C standard event methods
    event.preventDefault = this.preventDefault;
    event.stopPropagation = this.stopPropagation;
    return event;
  },
  preventDefault: function() {
    this.returnValue = false;
  },
  stopPropagation: function() {
    this.cancelBubble = true;
  }*/
});

Module.mixin.Events = new Class({
    /*
    this.domEle.events: {
 			click: {
 				'datepicker': callback,
 				'magicInput': callback
 			},
 			keypress: {
 				'datepicker': callback
 			}
 		}
 		*/
    addEvent: function(eType, dataObj, callback) {
      var evtObj,
			    module = this.domEle;
			// If this is the first click event assigned, create the object to hold the callbacks
			if (!module.events[eType]) {
			  evtObj = module.events[eType] = {};
			  this.addListener(module, eType, this.handleEvent);
			}
      // Assign data object and callback to click object
			evtObj[dataObj] = callback;
    },
    click: function(dataObj, callback) {
			this.addEvent.call(this, 'click', dataObj, callback);
		},
		focus: function(dataObj, callback) {
			this.addEvent.call(this, 'focus', dataObj, callback);
		},
    addListener: function(ele, eType, handler) {
        // Focus and blur events should be captured on capture, not bubble
        var onCapture = (eType === 'focus' || eType === 'blur') ? true : false;
        if(window.addEventListener) {
            ele.addEventListener(eType, handler, onCapture);
        }
        else if(window.attachEvent) {
            if(onCapture) {
                if(eType === 'focus') {
                    ele.attachEvent('onfocusin', function(e){
        				      e.currentTarget = ele;
        				      handler(e);
        				    });
                }
                else {
                    ele.attachEvent('onfocusout', function(e){
            				  e.currentTarget = ele;
            				  handler(e);
            				});
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
    addModuleListeners: function(module) {
        // 'change' should not be included as it does not work in IE
        var events = ['blur','click','focus','keydown','keypress','keyup','submit','load'],
        ele = document.getElementById(module),
        i,
        len;
        for(i = 0, len = events.length; i < len; i++) {
            this.addListener(ele, events[i], this.handleEvent);
        }
    },
    fieldValue: '',
    // Change does not bubble in IE, this is the fix.
    fixChange: function(data) {
        var ele = data.ele,
            eType = data.type,
            blurValue;
        try {
          if(ele.tagName === "INPUT" || ele.tagName === "SELECT") {
            if(eType === 'focus') {
              this.fieldValue = $(ele).val();
            }
            else if (eType === 'blur') {
              blurValue = $(ele).val();
              if(blurValue !== this.fieldValue) {
                data.type = 'change';
                this.handleEvent('', data);
              }
              this.fieldValue = '';
            }
          }
        }
        catch(err) {
          
        }
    },
    lastFocus: '',

    handleEvent: function(event) {
        event = event || window.event;
        var ele = event.target || event.srcElement,
            mod = event.currentTarget,
            eType = event.type,
            eObj,
            evts,
            // Object to hold event data to pass onto handlers
            data = {
                'ele': ele  
            };
       
       // Convert focusin and focusout type to focus and blur respectively
       if (eType === 'focusin') {
         eType = 'focus';
       }
       else if (eType === 'focusout') {
         eType = 'blur';
       }
    	
    	// Broadcast that an event has happened,
    	// this can be used as a hook for adding default actions.
    	App.bus.notify(eType, data);
    	
    	eObj = mod.events[eType];
      evts = ele.getAttribute('data-events');
    	
    	if(!!evts) {
    		evts = evts.split(' ');
    		var i = evts.length;
    	
    		while (i--) {
    			if (evts[i] in eObj) {
    				eObj[evts[i]](data);
    			}
    		}
    	}
    	
    },
    /*preventDefault: function(e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
    },
    stopPropagation: function(e) {
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
    }*/
    fixEvent: function(event, ele) {
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
});