// This is in sketching state, do not include

App.Module = new Class({
   Implements: [Events, Messages],
   initialize: function() {
       
   }
});

App.PhotoGallery = new Class({
   Extends: Module,
   initialize: function('domId') {
       
   } 
});
  
    attachCalendarEvents: function(instance) {
	  var Calendar = instance;
	  this.calendar.click(function(e) {
			e.preventDefault();
			var ele = $(e.target);
			self.allowHide = false;
			if(ele[0].tagName === "TD" && !$(ele).hasClass('extraDay')) {
				var day = ele.text();
				self.allowShow = false;
				self.allowHide = true;
				self.hideTimer = setTimeout(function() {self.hide();}, 100);
				self.insertDate(day);		
			}
			else if(ele.hasClass('nextMonth')) {
				//clearTimeout(self.hideTimer);
				self.navNext();
			}
			else if(ele.hasClass('prevMonth')) {
				//clearTimeout(self.hideTimer);
				self.navPrev();
			}
		});
	}
      
