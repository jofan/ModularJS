if(typeof debug === "undefined" || !debug) {
  // NAMESPACE: debug
  var debug = {
    initialized: false,
    inspected: {},
    // Set up the inspected item, and add modules if supplied.
    // Send 'all' as param to prepare all modules for debugging
    init: function(modules) {
      var moduleData = App.core.moduleData;
      
      for (moduleId in moduleData) {
        if (moduleData.hasOwnProperty(moduleId)){
          this.inspected[moduleId] = false;
        }
      }
      this.initialized = true;
      
      if (modules) {
        if (modules == 'all') {
          this.addAll();
        }
        else {
          App.log(typeof modules);
          if (typeof modules === 'object') {
            for(var i=0;i<modules.length;i++) {
              this.add(modules[i]);
            }
          }
          else {
            this.add(modules);
          }
        }
      }
    },
    addAll: function() {
      for (module in this.inspected) {
        this.inspected[module] = true;
      }
    },
    add: function(module) {
      if (module in this.inspected) {
        this.inspected[module] = true;
      }
    },
    remove: function(module) {
      if (module in this.inspected) {
        this.inspected[module] = false;
      }
    },
    showOutlines: function(module) {
      var moduleId,
          domEle,
          moduleData = App.core.moduleData;
          
      var show = function(mod) {
        $(mod).addClass('debug');
      };
      
      if (module) {
        mod = App[module].domEle;
        show(mod);
      }
      else {
        for (moduleId in moduleData) {
    	    if (moduleData.hasOwnProperty(moduleId)){
            mod = App[moduleId].domEle;
            show(mod);
          }
    	  }
      }  
    },
    hideOutlines: function(module) {
      var moduleId, domEle,
          moduleData = App.core.moduleData;
      for (moduleId in moduleData) {
        if (moduleData.hasOwnProperty(moduleId)){
          domEle = document.getElementById(moduleId);
          $(domEle).removeClass('debug');
        }
      }
    },
    // Visually hide modules not currently being inspected
    hideOthers: function() {
      
    },
    showEvents: function(module) {
      
    }
  }
}