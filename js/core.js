
if (typeof App === "undefined" || !App) {
  var App = {
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
    // From Professional JavaScript for Web Developers
    // Move to utility scripts
    cookie: {
  	  get: function(name) {
  		  var cookieName = encodeURIComponent(name) + "=",
  			  cookieStart = document.cookie.indexOf(cookieName),
  			  cookieValue = null;
  		  if(cookieStart > -1) {
  			  var cookieEnd = document.cookie.indexOf(";", cookieStart);
  			  if(cookieEnd == -1) {
  				  cookieEnd = document.cookie.length;
  			  }
  			  cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
  		  }
  		  return cookieValue;
  	  },
  	  set: function(name, value, expires, path, domain, secure) {
  		  var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);
  		  if(expires instanceof Date) {
  			  cookieText += "; expires=" + expires.toGMTString();
  		  }
  		  if(path) { cookieText += "; path=" + path; }
  		  if(domain) { cookieText += "; domain=" + domain; }
  		  if(secure) { cookieText += "; secure"; }
  		  document.cookie = cookieText;
  	  },
  	  unset: function(name, path, domain, secure) {
  		  this.set(name, "", new Date(0), path, domain, secure);
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