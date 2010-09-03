/// <reference path="jQuery-1.3.2-vsdoc.js" />

/* ===================================================
* @description: Communicator between the App's
  core and loosly connected functionality, ie widgets.
* @authors: Stefan Liden (SLI)
* ==================================================== */

if (typeof App.bus === "undefined" || !App.bus) {
  App.bus = {
    cache: {},
    /* -----------------------------------------
    * Get and set data and state of app.
    -------------------------------------------- */
    // @param obj: [string] Name of object you are getting
    // @param location [string] DEFAULT='state' Where data is located, i.e 'settings'
    get: function(obj, location) {
      var data,
          interface;
      location = location || 'state';
      if(obj in this.cache) {
        return this.cache[obj];
      }
      else {
        try {
          interface = App.interface.data;
          if(obj in interface) {
            data = App[location][obj];
          }
          // If it's not declared in interface, it should be backendData
          else {
            data = backendData[obj];
          }
          // We can store functions, so to get a return value we need to make sure functions are called
          if(typeof data === "function") {
					  data = data();
				  }
				
				  this.cache[obj] = data;
				  return data;
        }
        catch(err) {
          App.log('App.bus.get failed with message: ' + err.message);
        }
      }
    },
    // @param obj [string]
    // @param location [string] DEFAULT='state'
    pop: function(obj, location) {
      location = location || 'state';
      try {
        return App[location][obj].pop();
      }
      catch(err) {
        App.log('App.bus.remove failed with message: ' + err.message);
      }
      if(obj in this.cache) {
        this.cache[obj].pop();
      }
    },
    // @param obj [string]
    // @param location [string] DEFAULT='state'
    reset: function(obj, location) {
      location = location || 'state';
      try {
        App[location][obj] = null;
      }
      catch(err) {
        App.log('App.bus.reset failed with message: ' + err.message);
      }
      if(obj in this.cache) {
        this.cache[obj] = null;
      }
    },
    // @param obj [string]
    // @param data [string/array/object/function]
    // @param location [string] DEFAULT='state' Where data is located, i.e 'settings'
    // NOTE: you should use 'setData' function to add data to 'backendData'
    set: function(obj, data, location) {
      var interface = App.interface.data,
          dataType;
      location = location || 'state';
      try {
        if(obj in interface) {
          dataType = interface[obj];
          if(dataType === 'array') {
            App[location][obj].push(data);
          }
          else {
            App[location][obj] = data;
          }
        }
      }
      catch(err) {
        App.log('App.' + category + '.' + obj + ' could not be set to ' + data + '. Error msg: ' + err.message);
      }
      if(obj in this.cache) {
        if(dataType === 'array') {
          this.cache[obj].push(data);
        }
        else {
          this.cache[obj] = data;
        }
      }
    },
    /* -----------------------------------------
    * Observer pattern. Listen to and notify custom events.
    -------------------------------------------- */
    // @param event: {name [string], sender [string], callback [function]}
    listen: function(event) {
		  var sender = event.sender,
			  name = event.name,
			  callback = event.callback;
		  // TODO: remove duplication in conditional
		  if(sender in this.listeners) {
			  this.listeners[sender][name] = callback;
		  }
		  else {
			  this.listeners[sender] = {};
			  this.listeners[sender][name] = callback;
		  }
	  },
	  stopListening: function(event) {
	    var sender = event.sender,
	        name = event.name;
	    if(sender in this.listeners) {
			  delete this.listeners[sender][name];
		  }
	  },
	  listeners: {},
	  // @param name [string]
	  // @param msg [string/object/function]
	  notify: function(name, msg) {
		  if(name in this.listeners) {
		    if(name in App.interface.messages && typeof msg === App.interface.messages[name].toLowerCase()) {
				  for(callback in this.listeners[name]) {
					  this.listeners[name][callback](msg);
				  };
			  }
			  else {
		      App.log('From App.bus: Notification "' + name + '" is not found in App.interface.messages or is not set to return a(n) ' + (typeof(msg)));
		    }
		  }
	  },  
    // Async requests
    request: {
    
    }
  };
}

// Wrappers (or Facades) for easier use
App.get =    function(obj, location) { return App.bus.get(obj, location); };
App.set =    function(obj, data, location) { App.bus.set(obj, data, location); };
App.pop =    function(obj, location) { return App.bus.pop(obj, location); };
App.reset =  function(obj, location) { App.bus.reset(obj, location); };
App.notify = function(name, msg) { App.bus.notify(name, msg); };
App.listen = function(evt) { App.bus.listen(evt) };
App.stopListening = function(evt) { App.bus.stopListening(evt) };