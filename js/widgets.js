if (typeof App.widget === 'undefined' || !App.widget) {
	App.widget = {};
}
	
App.widget.Calendar = function(module, inputClass) {
	this.module = module;
    this.today = new Date();
	this.today.year = this.today.getFullYear();
	this.today.month = this.today.getMonth();
	this.today.day = this.today.getDay();
	this.today.date = this.today.getDate();
	this.inputClass = inputClass || 'wgtCalendar';
	this.dateFormat = App.get('dateFormat', 'settings');
	this.isBuilt = false;
	this.isVisible = false;
	this.dateInserted = false,
	this.allowShow = true,
	this.allowHide = true,
	this.input = '';
	this.attachInputEvent();
};

App.widget.Calendar.prototype = {
	// Properties
  constructor: App.widget.Calendar,
	MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	MONTHS_DK: ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'],
	daysPerMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
	
	// Model
	isLeapYear: function(year) {
		if(parseInt(year)%4 === 0 || parseInt(year)%100 === 0 || parseInt(year)%400 === 0) {
			return true;
		}
		else {
			return false;
		}
	},
	setDateInfo: function(year, month, selectedDay) {
		var calendarSize = 35;
		this.prevOverlap, this.nextOverlap = 0;
		this.day = selectedDay || null;
		this.month = month;
		this.year = year;
		this.firstDayInMonth = new Date(year, month, 1).getDay();
		this.isLeapYear(year) ? this.daysPerMonth[1] = 29 :	this.daysPerMonth[1] = 28;
		this.daysInMonth = this.daysPerMonth[month];
		
		if((this.firstDayInMonth === 6 && this.daysInMonth === 31) || (this.firstDayInMonth === 0 && this.daysInMonth > 29)) {
				calendarSize = 42;
		}
		
		(this.month === 0) ? (this.daysInPreviousMonth = this.daysPerMonth[11]) : (this.daysInPreviousMonth = this.daysPerMonth[month - 1]);
		
		if(this.firstDayInMonth === 0) {
			this.prevOverlap = this.daysInPreviousMonth - 5;
			this.nextOverlap = calendarSize - (this.daysInMonth + 6);
		}
		else {
		  if(this.firstDayInMonth !== 1) {
			  this.prevOverlap = this.daysInPreviousMonth - (this.firstDayInMonth - 2);
			}
			this.nextOverlap = calendarSize - (this.daysInMonth + (this.firstDayInMonth - 1));
		}
	},
	attachCalendarEvents: function() {
	  var self = this;
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
	},
	attachInputEvent: function() {
		//this.module.getDomId();
	  var self = this;
		this.module.events.focus[self.inputClass] = function(data) { self.show(data.ele); };
		//App.events.keypress[self.inputClass] = function(data) { self.show(data.ele); };
		this.module.events.click.datePickerIcon = function(data) {
		  var ele = $(data.ele).prevAll('.' + self.inputClass);
		  ele.focus();
		};
		App.listen({
		  name: 'closeCalendar',
		  sender: 'click',
		  callback: function(data) {
		    if(self.isVisible) {
			    var calendar = $(data.ele).closest('.calendar');
			    if(calendar[0] === undefined && !($(data.ele).hasClass('navLink')) && !($(data.ele).hasClass(self.inputClass))) {
			      self.allowHide = true;
			      //self.hide();
			    }
			  }
		  }
		});
		App.listen({
		  name: 'closeCalendar',
		  sender: 'blur',
		  callback: function(data) {
		    if(self.isVisible) {
			      self.hideTimer = setTimeout(function() {self.hide();}, 200);
			  }
		  }
		});
	},
	
	// Controller
	/*  Creates the outer div.calendar which is the element we will hide and show.
	*   Only called once.
	*/
	build: function() {
		var outerDiv = $('<div class="calendar"></div>');
		this.calendar = outerDiv;
		this.hide();
		$(document.body).append(this.calendar);
	},
	/* Navigates between months, one at a time */
	navNext: function() {
		if(this.month === 11) {
			this.setDateInfo((this.year + 1), 0);
		}
		else {
			this.setDateInfo(this.year, (this.month + 1));
		}
		this.update();
	},
	navPrev: function () {
		if(this.month === 0) {
			this.setDateInfo((this.year - 1), 11);
		}
		else {
			this.setDateInfo(this.year, (this.month - 1));
		}
		this.update();
	},
	/*  Reset internal date (to todays date) and updates markup */
	reset: function() {
		this.setDateInfo(this.today.year, this.today.month);
		this.update();
	},
	/* Replaces current markup so that it reflects current internal date */
	update: function() {
		this.calendar.html('');
		var table = $('<table cellpadding="2"></table>');
		var captionStr = '<caption><a href="#" class="prevMonth navLink">&larr;</a>' + this.MONTHS_DK[this.month] + ' ' + this.year + '<a href="#" class="nextMonth navLink">&rarr;</a></caption>';
		var caption = $(captionStr);
		var head = $('<thead></thead>');
		var headRow = $('<tr><th>man</th><th>tir</th><th>ons</th><th>tor</th><th>fre</th><th>lør</th><th>søn</th></tr>');
		var body = $('<tbody></tbody>');
		var cells = "<tr>";
		var i = 1; // Keep count of total number of days
		// Loop through array that contains days from previous month
		// Add class "extraDay" to these
		var d = ((this.firstDayInMonth - 1) < 0 ? 6 : (this.firstDayInMonth - 1)); 
		for(var p=0; p < d; p++) {
			cells += "<td class='extraDay'>" + this.prevOverlap + "</td>";
			this.prevOverlap++;
			i++;
		}
		
		// Loop through the actual days in this month
		for(var c=1; c <= this.daysInMonth; c++) {
			if(c === this.today.date && this.month === this.today.month && this.year === this.today.year) {
				cells += "<td class='today'>" + c + "</td>";
			}
			else if(!!this.day && c === this.day) {
				cells += "<td class='selected'>" + c + "</td>";
			}
			else {
				cells += "<td>" + c + "</td>";
			}
			if(i%7 === 0 && c < 31) {
				cells += "</tr><tr>";
			}
			i++;
		}
			
		// Loop through array that contains days from next month
		// Add class "extraDay" to these
		for(var n=1; n <= this.nextOverlap; n++) {
			cells += "<td class='extraDay'>" + n + "</td>";
			i++;
		}
		
		cells += "</tr>";
		body.append($(cells));
		head.append(headRow);
		table.append(caption);
		table.append(head);
		table.append(body);
		this.calendar.append(table);
	},

	// View
	/*  Hides div.calendar and call reset */
	hide:function() {		
		if (!this.allowHide) {
		  this.allowHide = true;
		}
		else {
		  this.calendar.hide();
		  this.reset();
		  this.isVisible = false;
		}
	},
	/*  Inserts chosen date into input field, and calls hide() */
	insertDate: function(day) {
		var self = this,
		    insertDay = (day.length < 2 ? ("0" + day) : day),
		    insertMonth = (((this.month + 1) + '').length < 2 ? "0" + (this.month + 1) : (this.month + 1)),
		    chosenDate = insertDay + '-' + insertMonth + '-' + this.year;
		this.input.val(chosenDate);
		App.notify('change', {});
		this.input.focus();
	},
	isValidDate: function(date) {
	  //TODO: should get date seperator from dateFormat
	  return (/^[0-9]{2}\-[0-9]{2}\-[0-9]{4}$/).test('' + date);
	},
	/*  Displays div.calendar, position based on related input element
	    @param {string} ctrl The related input field as an jQuery object
	*/
	show: function(ctrl) {
		var pos = $(ctrl).offset(),
			  date = $(ctrl).val(),
			  format;
		clearTimeout(this.hideTimer);
		if (!this.allowShow) {
	    this.allowShow = true;
	  }
	  else {
		  this.input = $(ctrl);
		  if(!this.isBuilt) {
		    this.build();
		    this.reset();
		    this.attachCalendarEvents();
		    this.isBuilt = true;
		  }
		  if (!!this.input.attr('readonly')) { return; }
		  if(date !== '' && this.isValidDate(date)){
			  try {
  		    format = this.dateFormat;
  			  var matchDay = (/dd/).exec(format);
  		        matchMonth = (/mm/).exec(format),
  			      matchYear = (/YYYY/).exec(format),
  			      day = date.substring(matchDay.index, matchDay.index + 2),
  			      month = date.substring(matchMonth.index, matchMonth.index + 2),
  			      year = date.substring(matchYear.index, matchYear.index + 4);
  			  this.setDateInfo(parseInt(year), parseInt(month - 1), parseInt(day));
  			  this.update();
  		  }
  		  catch(err) {}
		  }
		  this.calendar.css({left: pos.left, top: pos.top + 25});
		  this.calendar.show();
		  this.isVisible = true;
		}
	}
};

App.widget.Tabs = function(id, tab) {
  this.tabControl = $("#" + id);
  this.tabs = this.tabControl.find(".fnTab");
  this.activeTab = tab || 0;
  this.activeContent = ""; //Holds the id of the displayed tab content. Includes the "#" sign.
  this.contentPanels = [];
  this.init();
};

App.widget.Tabs.prototype = {
  constructor: App.widget.Tabs,
  
  //Methods
  clickTab: function(ele) {
    var contentId,
        content;
    ele = $(ele);
    if(ele.hasClass('active')) {
      return;
    }
    else {
      ele.addClass('active');
      contentId = ele.attr('href');
      $(contentId).show();
      $(this.tabs[this.activeTab]).removeClass('active');
      $(this.activeContent).hide();
      this.activeTab = jQuery.inArray(contentId, this.contentPanels);
      this.activeContent = contentId;
    }
  },
  events: function() {
    var self = this;
    App.events.click.fnTab = function(data) { self.clickTab(data.ele); return false; };
  },
  init: function() {
    var contentId,
        content;
    for(var i=0,len=this.tabs.length;i<len;i++) {
      contentId = $(this.tabs[i]).attr('href');
      if(this.activeTab === i) {
        $(this.tabs[i]).addClass('active');
        this.activeContent = contentId;
      }
      else {
        content = $(contentId);
        content.hide();
      }
      this.contentPanels[i] = contentId;
    }
    
    this.events();
    
  }
};