Ti.include('../../javascript/underscore.js', '../../javascript/active_db.js', '../../javascript/models.js');

Titanium.include('../../javascript/activity.js');

var win = Titanium.UI.currentWindow;
var db = Ti.UI.currentWindow.db;

win.barColor = '#000';


var item = new Item(db);
item = item.find(win.item_id);
var item_id = win.item_id;

var is_view_loaded = false;

function deleteActivity(e)
{
  activity_template = new Activity(db);
  activity_template.destroy(e.rowData.activity.id);

}

function show_name(item)
{
  return(item.name);
}


function show_date(item)
{
  return(item.created_at.toString());
}

fields = [show_name, show_date]

function addRow(i)
{
  var row = Ti.UI.createTableViewRow({height:32});
  var label = Titanium.UI.createLabel({
    color:'#000',
    text: fields[i](item),
    top:2,
    left: 10,
    width: 250,
    font:{
      fontFamily:'Helvetica Neue',
      fontSize:17,
      fontWeight: 'bold'
    }
  });
  row.add(label);
  row.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
  row.className = 'data';
  return row;
}


function openActivityList()
{
  var win = Titanium.UI.createWindow({
    url:'../activities/list.js',
    title:"Select Activity",
    backgroundColor:'#fff'
  });
  win.db = db;
  win.item_id = item.id;
  win.template = true;
  Titanium.UI.currentTab.open(win, {animated:true});

}

function showActivityList()
{
  var win = Titanium.UI.createWindow({
    url:'../activities/list.js',
    title:"List Activities",
    backgroundColor:'#fff'
  });
  win.db = db;
  win.item_id = item.id;
  win.template = false;
  Titanium.UI.currentTab.open(win, {animated:true});
}


var data = [];


function reload()
{

  if (!is_view_loaded) {
    Ti.API.debug("reloading");
    data = [];
    data[0] = Ti.UI.createTableViewSection();
    for (var i = 0; i < 2; i++) {
      data[0].add(addRow(i));
    }

    data[1] = Ti.UI.createTableViewSection();

    var add_activity = addActivityRow("Add activity");
    add_activity.addEventListener('click', openActivityList);

    data[1].add(add_activity);

    data[2] = Ti.UI.createTableViewSection();

    var activities = item.activities({limit: 5}); // activity.find_all({conditions: 'item_id = ' + item_id });
    Ti.API.debug("found activities:" + activities.length);
    _(activities).each(function(activity) {
      var row = activityRow(activity);
      data[2].add(row);

    }, this);
    if (activities.length > 4) {
      var row = moreRow();
      row.addEventListener('click', showActivityList);
      data[2].add(row);
    }
    table_view.setData(data);
    is_view_loaded = true;
  }

}


var table_view = Ti.UI.createTableView({
  data:[],
  style: Titanium.UI.iPhone.TableViewStyle.GROUPED

});

table_view.addEventListener('delete', deleteActivity);

function update_item_rows() {
  Ti.API.debug("updating rows");
  //for (var i = 0; i < 3; i++) {
  var row = addRow(1);
  table_view.updateRow(1, row);
  //}
}


win.add(table_view);

var edit_button = Titanium.UI.createButton({
  systemButton:Titanium.UI.iPhone.SystemButton.EDIT
});
win.rightNavButton = edit_button;

edit_button.addEventListener('click', function(e) {
  Ti.API.debug("editing item");
  var win = Titanium.UI.createWindow({
    url:'edit.js',
    title:"Edit Item",
    backgroundColor:'#fff'
  });
  win.db = db;
  win.item_id = item.id;
  Titanium.UI.currentTab.open(win, {animated:true});

});

win.addEventListener('focus', function()
{
  Ti.API.debug("list win got focus");
  reload();

}
    );

Titanium.App.addEventListener('added_activity', function(e)
{
  Ti.API.debug("received event: added_activity");
  var activity = new Activity(db);
  activity = activity.find(e.activity_id);
  var row = activityRow(activity);
  table_view.insertRowAfter(2, row, {animationStyle:Titanium.UI.iPhone.RowAnimationStyle.DOWN});

});

Titanium.App.addEventListener('item_saved', function(e)
{
  Ti.API.debug("received event: item_saved");

  var item = new Item(db);
  item = item.find(e.item_id);
  for (var i = 0; i < 3; i++) {
    var row = addRow(i);
    // FIXME: 29.3: This crashes with 1.1.2
    // table_view.updateRow(i, {title: "row " + i});
  }


});