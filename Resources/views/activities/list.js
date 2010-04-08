Ti.include('../../javascript/underscore.js', '../../javascript/active_db.js', '../../javascript/models.js');

Titanium.include('../../javascript/activity.js');

var win = Titanium.UI.currentWindow;
var db = Ti.UI.currentWindow.db;

win.barColor = '#000';

var templates = win.template;


var item = new Item(db);
item = item.find(win.item_id);

var item_id = win.item_id;
var activity;

activity = new Activity(db);


var selected_activity = null;

function deleteActivity(e)
{
  activity.destroy(e.rowData.activity.id);
}


var data = [];

var activities = item.activities();
Ti.API.debug("found activities:" + activities.length);
var count = 0;
_(activities).each(function(activity) {
  Ti.API.debug(activity.toString());
  var row = activityRow(activity);

  data[count] = row;
  count++;

}, this);


var table_view = Ti.UI.createTableView({
  data:data,
  editable: true,
  style: Titanium.UI.iPhone.TableViewStyle.GROUPED

});


win.add(table_view);

table_view.addEventListener('delete', deleteActivity);


var add_button = Titanium.UI.createButton({
  systemButton:Titanium.UI.iPhone.SystemButton.ADD
});
win.rightNavButton = add_button;

add_button.addEventListener('click', function(e) {
  Ti.API.debug("adding activity");
  var win = Titanium.UI.createWindow({
    url:'edit.js',
    title:"Add Actitity",
    backgroundColor:'#fff'
  });
  win.db = db;
  win.item_id = item_id;
  win.activity = false;
  Titanium.UI.currentTab.open(win, {animated:true});


});

