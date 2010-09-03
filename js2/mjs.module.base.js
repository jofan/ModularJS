Module.Base = new Class({
   Implements: [Module.mixin.Events],
   initialize: function(domId) {
       this.moduleId = domId;
       this.domEle = document.getElementById(domId);
       this.addEventObj();
       //this.addDefaultEvents();
   },
   addDefaultEvents: function() {
   		
   },
   addEventObj: function() {
   		this.domEle.events = {};
   		/*
   			click: {
   				'datepicker': callback,
   				'magicInput': callback
   			},
   			keypress: {
   				'datepicker': callback
   			}
   		*/
   },
   getDomEle: function() {
        if(this.domEle) {
            return this.domEle;
        }
        else {
            this.log('#'+this.moduleId+' is not a DOM element');   
        }
   },
   getDomId: function() {
   		this.log(this.moduleId);
   },
   run: function(type, name, params) {
     var obj = new App[type][name](params);
     return obj;  
   },
   log: function(message) {
   	//Replace this with a better log functionality	
     App.log(message);
   }
});