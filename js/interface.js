/// <reference path="jQuery-1.3.2-vsdoc.js" />
/* ==============================================
* @description: State objects that are most often
  used in conditional checks. Be careful when
  renaming or removing these.
* @namespaces: App.state
* @authors: Stefan Liden (SLI)
* =============================================== */
App.state = {
  deferredPostbacks: [],
  disabledRows: false, //Set to true when a deleteRow checkbox is checked
  displayedError: '',
  lastClickedEle: false,
  scrollToTop: false,
  /* === Lightbox specific states === */
  openLightboxes: [],
  prognoseShown: false, //set to true from backend when a prognoseresultat is shown and must be cleared on change.
  kapOgRateOpen: false
};

/* ==============================================
* @description: Interface used by App.bus to send
  and receive messages and set and get app data.
* @namespaces: App.interface
* @authors: Stefan Liden (SLI)
* =============================================== */
App.interface = {
  data: {
    'dateFormat':           'string',
    'displayedError':       'string',
    'lastClickedEle':       'string',
    'scrollToTop':          'bool'
  },
  messages: {
    /* === User events, Notified from handleEvent in App.events === */
    'focus':                'object',
    'blur':                 'object',
    'change':               'object',
    'click':                'object',
    'keypress':             'object',
    
    /* === Error events === */
    'globalError':          'object'
  }
};