/* ================================================================
* Override application settings
* App.settings is defined in core.js
* ================================================================= */
App.settings.debug = true;
App.settings.language = "SE";

/* ================================================================
* Application and Page Configuration
* Required modules:
   - App.errorHandler (errors.js)
   - App.bus (bus.js)
   - App.events (events.js)
* ================================================================= */

if (typeof App.config === 'undefined' || !App.config) {
	App.config = {
		
		// Page defaults: code that should be run on every page
		defaults: function() {
      /* =======================================
      * Initialize global functionality
      * ======================================== */
      App.events.addGlobalListeners(); // Attaches all global event listeneres used for event delegation (see events.js)
      
      /* ======================================
      * Register global event handlers
      * ======================================= */
      // Click events
      App.events.click.fnHelp = function(data) { App.widget.help.handleClick(data.ele); };
      
      /* ======================================
      * Listen to global application messages
      * ======================================= */
      App.listen({
        name: 'displayError',
        sender: 'globalError',
        callback: function(msgObj) { App.log(msgObj.msg); }
      });
		},
		
		/*----------------------------------------------------------------------------------
		* Application pages: code that should be run on a page-basis (when page is loaded).
		* Replaces ScriptManager calls from backend, and inline <script>-tags.
		*----------------------------------------------------------------------------------- */
		
		poc: {
			init: function(data) {
				/* =======================================
        * Initialize widgets, modules etc
        * ======================================== */
        var calendar = new App.widget.Calendar('datePicker');
        
				/* ======================================
        * Register event handlers
        * ======================================= */
				App.events.click.fnSendError = function(data) { App.notify('globalError', {msg:'This is a test, not a real error.'}); };
        
				/* ======================================
        * Listen to messages
        * ======================================= */
				App.listen({
				  name: 'globalClick',
				  sender: 'click',
				  callback: function(data) { App.log('Clicked something'); }
				});
			}
		}
		
	}
}

/*================================== *
* Initialize JavaScript
*=================================== */
$(document).ready(function() {
	
	/* ======================================
  * Run config.defaults and config[pageName]
  * ======================================= */
	var page = $('#pageName'),
	    pageName;
	App.config.defaults();
	if(!!page) {
		pageName = page.val();
		if(pageName in App.config) {
			App.config[pageName].init();
		}
	}
});