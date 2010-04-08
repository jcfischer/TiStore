Ti.include('../../javascript/underscore.js', '../../javascript/active_db.js', '../../javascript/models.js');

Titanium.include('../../javascript/activity.js');



var win = Titanium.UI.currentWindow;
var db = Ti.UI.currentWindow.db;

win.barColor = '#000';




// remember which item this activity belongs to
var item_id = win.item_id;

var activity_id = win.activity_id;


var activity = new Activity(db);

var data = [];
data[0] = Ti.UI.createTableViewSection();
for (var x = 0; x < fields.length; x++)
{
  var row = Ti.UI.createTableViewRow({title: labels[x], height: 36});
  row.add(fields[x]);
  row.addEventListener('focus', event_handlers[x]);
  row.addEventListener('click', event_handlers[x]);
  data[0].add(row);

}

var table_view = Ti.UI.createTableView({
  data:data,
  style: Titanium.UI.iPhone.TableViewStyle.GROUPED

});

win.add(table_view);


win.addEventListener('focus', function()
{
  Ti.API.debug("edit win got focus");
 
}
    );

var save_button = Titanium.UI.createButton({
  systemButton:Titanium.UI.iPhone.SystemButton.SAVE
});
win.rightNavButton = save_button;

save_button.addEventListener('click', function(e) {
  Ti.API.debug("saving activity");
  activity.name = fields[0].value;
  activity.cost = parseInt(fields[1].value);
  activity.item_id = item_id;

  activity.save();
  Ti.API.debug("save activity:" + activity.name);
    Titanium.UI.currentWindow.close();


    Titanium.App.fireEvent('added_activity',{activity_id:activity.id});



});

function reload() {
  if (activity_id) {
    activity = activity.find(activity_id);
  }
  fields[0].value = activity.name;
  fields[1].value = activity.cost.toString();

}

reload();