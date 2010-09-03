/* -------------------------------------------------
* @description: Internal App data to be used by 
*	widgets and other parts of the app. 
* @return: object
* -------------------------------------------------- */
App.data = {
	DATE: function() {
		var today = new Date();
		return {
			year: today.getFullYear(),
			month: today.getMonth(),
			day: today.getDay(),
			date: today.getDate()
		}
	},
	LANG: function() {
		var lang = App.settings.language;
		if(lang === 'DK') {
			return {
				date_format: 'dd.mm.YYYY',
				months: ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'],
				strings: {
				  today: 'i dag'
				},
				weekdays: ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'],
				weekdays_short: ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn']
			}
		}
		else if(lang === 'SE') {
			return {
				date_format: 'dd-mm-YYYY',
				months: ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'],
				strings: {
				  today: 'idag'
				},
				weekdays: ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'],
				weekdays_short: ['Mån', 'Tir', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön']
			}
		}
		else {
			return {
				date_format: 'mm/dd/YYYY',
				months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
				strings: {
				  today: 'today'
				},
				weekdays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
				weekdays_short: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
			}
		}
		
	}
};