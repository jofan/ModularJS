Module.PhotoGallery = new Class({
   Extends: Module.Base,
   initialize: function(domId) {
       this.parent(domId);
   }
});

Module.ContactForm = new Class({
	Extends: Module.Base,
	initialize: function(domId) {
	    this.parent(domId);
	    this.log('Initialized: App.' + domId);
	    this._setEvents();
	    /*this.Calendar = new App.widget.Calendar(this, 'datepicker');*/
	    //this.addClick('datepicker', function(data) {console.log('Event in contactform clicked')}, this);
  },
  _setEvents: function() {
    // For Module.mixin.Events
    //App.events.click.datepicker = function(data) {App.log(data.ele)};
    this.click('datepicker', function(data) {App.log('Clicked: ' + data.ele)});
    this.focus('datepicker', function(data) {App.log('Focused: ' + data.ele)});

    // For Module.mixin.Events2
    /*this.addEvent(this.domEle, 'click', function() {console.log('Event fired!')});
    this.addEvent(this.domEle, 'keypress', function() {console.log('Second event fired!')});
    this.addEvent(document.getElementById('dob'), 'focus', function() {console.log('Focus event fired!')});*/
    
    // For Mootools Events
    /*this.domEle.set({
      events: {
        'change:relay(input)': function(e) {alert('ContactForm event fired!')}
      }
    });*/
  }	
});

Module.BookingForm = new Class({
   Extends: Module.Base,
   initialize: function(domId) {
       this.parent(domId);
       this.log('Initialized: App.' + domId);
       //this.Calendar = new App.widget.Calendar(this, 'datepicker2');
       //this.Calendar = this.run('widget', 'Calendar', 'datepicker');
       //this.addClick('datepicker', function(data) {console.log('Event in bookingform clicked')}, this);
   },
   _setEvents: function() {
       //this.addEvent('click', 'datepicker', this.Calendar.show(data.ele));
   }
});