

var win = Titanium.UI.currentWindow;
var db = Ti.UI.currentWindow.db;

win.barColor = '#000';


var show_view =  Titanium.UI.createView({
  top:0,
  width:320,
  height:420,
  opacity:1
});

var edit_button = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.EDIT
});
win.rightNavButton = edit_button;

edit_button.addEventListener('click', function(e) {
  Ti.API.debug("editing activity");
  var win = Titanium.UI.createWindow({
    url:'edit.js',
    title:"Edit Activity",
    backgroundColor:'#fff'
  });
  win.db = db;
  Titanium.UI.currentTab.open(win, {animated:true});

});

win.add(show_view);