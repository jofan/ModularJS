/* =====================================================
*
* Namespaces: App.test.config
*
* This file handles code registration and runs the app.
* It should be included last among your javascript files
*
* ====================================================== */

App.test.config = {
	defaults: {
		init: function() {
			/* =======================================
      * Initialize global functionality
      * ======================================== */
      App.events.addGlobalListeners(); // Attaches all global event listeneres used for event delegation (see events.js)
		}
	},
	// Spec tests (../spec/)
	jspec: {
	  init: function() {
			var self = this;
	    /* ======================================
      * Register event handlers
      * ======================================= */
      // Click events
      App.events.click.fnDom = function(data) {
        self.clearTest();
        App.test.config.dom.runSuites();
      };
      App.events.click.fnCore = function(data) { 
        self.clearTest();
        App.test.runJSpec('../spec/unit/spec.core.js');
      };
		},
		clearTest: function() {
		  $("#jspec").html("");
		  JSPEC();
		  /*JSpec.stats = { specs: 0, assertions: 0, failures: 0, passes: 0, specsFinished: 0, suitesFinished: 0 };
      JSpec.allSuites = [];
      JSpec.suites = [];*/
		}
	},
	dom: {
		init: function() {
			this.runSuites();			
		},
		runSuites: function() {
			JSpec
        .exec('unit/spec.grammar.js')
        .exec('unit/spec.js')
        .exec('unit/spec.matchers.js')
        .exec('unit/spec.utils.js')
        .exec('unit/spec.fixtures.js')
        .exec('unit/spec.shared-behaviors.js')
        .exec('unit/spec.jquery.js')
        .exec('unit/spec.modules.js')
        .exec('unit/spec.xhr.js')
        .exec('unit/spec.jquery.xhr.js')
				.run({ failuresOnly: true, fixturePath: 'fixtures' })
				.report();
    }
	},
	core: {
	  init: function() {
	    App.test.runJSpec('../spec/unit/spec.core.js');
	    /*JSpec
        .exec('unit/spec.core.js')
				.run({ failuresOnly: true, fixturePath: 'fixtures' })
				.report();*/
	  }
	}
};

//Last function defined... run the app!
App.test.config.run = function() {
  
  var page = document.getElementById('pageName');
	// Set cookie to test
	// TODO: remove
	//App.cookie.set('lang', 'SE');
	App.test.config.defaults.init();
	if(!!page) {
		var val = page.value;
		App.test.config[val].init();
	}
}();