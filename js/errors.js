App.errorHandler = {
  clearErrorState: function() {
      var messageEle = $('#errorMessage'),
          errorBox = $('#globalError');
      messageEle.html('');
      errorBox.hide();
      if (App.state.openLightboxes.length === 0) {
          getGraph();
      }
  },
  display: function(data) {
    var newline = new RegExp("\\n", "gm"),
        messageEle = $('#errorMessage'),
        errorBox = $('#globalError'),
        msg = data.msg;
        
    App.Wip.endHandler();
    
    message = msg.replace(newline, "<br/>");
    messageEle.html(msg);

    errorBox.show();
    errorBox.find('input:visible').focus();
    App.util.preventTab('globalError');

    window.scrollTo(0, 0);
  }
};