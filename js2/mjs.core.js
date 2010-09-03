var Module = {};
Module.mixin = {};

if(typeof App === "undefined" || !App) {
    // NAMESPACE: App
    var App = {
        // Adapted from presentation "Scalable JavaScript Application Architecture" by Nicholas Zakas
        core: {
            moduleData: {},
            /* Register API
            ** App.core.register('moduleId', moduleObject);
            */
            register: function(moduleId) {
                this.moduleData[moduleId] = {
                    instance: null
                };
            },
            start: function(moduleId) {
                this.moduleData[moduleId].instance = true;
                App[moduleId] = new Module[moduleId](moduleId);
            },
            startAll: function() {
                for (var moduleId in this.moduleData){
                    if (this.moduleData.hasOwnProperty(moduleId)){
                        this.start(moduleId);
                    }
                }
            },
            stop: function(moduleId) {
                var data = this.moduleData[moduleId];
                if (data.instance){
                    data.instance.destroy();
                    data.instance = null;
                }
            },
            stopAll: function() {
                for (var moduleId in this.moduleData){
                    if (this.moduleData.hasOwnProperty(moduleId)){
                        this.stop(moduleId);
                    }
                }
            }
        },
        // Temporary functions
        log: function(msg) {
        	 if(this.settings.debug) {
            if(window.console && window.console.log) {
              console.log(msg);
            }
            else {
              alert(msg);
            }
          }
        },
        settings: {
          debug: true,
          dateFormat: 'dd-mm-YYYY',
          language: 'DK',
          libraries: ['jQuery 1.4.2']
        }
    };
}