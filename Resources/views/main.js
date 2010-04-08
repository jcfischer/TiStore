Ti.include('../javascript/underscore.js', '../javascript/active_db.js', '../javascript/models.js');


var win = Titanium.UI.currentWindow;
var db = Ti.UI.currentWindow.db;

win.barColor = '#000';

var item = new Item(db);


var view = Titanium.UI.createView({
  top: 0,
  width:320,
  height:480,
  opacity:1
});

var data = [];
// create table view


var tableview = Titanium.UI.createTableView({
  data:data,
  style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
  rowHeight:42,
  minRowHeight:42
  //maxRowHeight:500,
});

// create table view event listener
tableview.addEventListener('click', function(e)
{

  var item = e.rowData.item;
  var win = Titanium.UI.createWindow({
    url:'items/show.js',
    title: item.name,

    backgroundColor:'#fff'
  });
  Ti.API.debug(item);
  Ti.API.debug("setting item id" + item.id);
  win.item_id = item.id;
  win.db = db;
  Titanium.UI.currentTab.open(win, {animated:true})
});

reload();
view.add(tableview);

win.add(view);

function create_row(count, nr_items, item) {
  var row = Ti.UI.createTableViewRow({height:48, hasChild: true});
  var label = Ti.UI.createLabel({
    text: item.name,
    textAlign:'left',
    top:-6,
    left:20,
    font:{fontWeight:'bold',fontSize:17}
  });
  row.add(label);

  var label2 = Ti.UI.createLabel({
    text: item.cost.toString(),
    color: '#420404',
    textAlign:'right',
    font:{fontSize:17},
    top:-6,
    right:10
  });
  row.add(label2);
  var bar_length = 270;
  var bg = Titanium.UI.createView({
    backgroundColor:'#ddd',
    height:5,
    width: bar_length,
    top: 35,
    left:20
  });
  row.add(bg);
  var bar_color = "#f00";

  var percent = Math.random();

  if (percent > 0.95) {
    bar_color = "#0f0";
  } else if (percent > 0.5) {
    bar_color = "#aa0";
  }
  var bar = Titanium.UI.createView({
    backgroundColor: bar_color,
    height:5,
    width: (bar_length * percent).toFixed(0),
    top: 35,
    left:20
  });
  row.add(bar);
  row.item = item;
  row.classname = "item";
  return row;
}

function reload() {
  data = [];
  Ti.API.debug("reloading view");
  var items = item.find_all({order: "name ASC"});
  Ti.API.debug("loaded items");
  Ti.API.debug(items.length);

  var count = 0;
  _(items).each(function(item) {
    var row = create_row(count, items.length, item);
    data.push(row);
    count += 1;
  }, this);

  tableview.setData(data);
}


var add_button = Titanium.UI.createButton({
  systemButton:Titanium.UI.iPhone.SystemButton.ADD
});
//  create edit/cancel buttons for nav bar
//
var edit_button = Titanium.UI.createButton({
  title:'Edit'
});

edit_button.addEventListener('click', function()
{
  win.setLeftNavButton(done_button);
  win.setRightNavButton(null);
  tableview.editing = true;
});

var done_button = Titanium.UI.createButton({
  title:'Done',
  style:Titanium.UI.iPhone.SystemButtonStyle.DONE
});
done_button.addEventListener('click', function()
{
  win.setRightNavButton(add_button);
  win.setLeftNavButton(edit_button);
  tableview.editing = false;
});

win.setLeftNavButton(edit_button);


win.rightNavButton = add_button;

add_button.addEventListener('click', function(e) {
  Ti.API.debug("Adding new");
  var b = Ti.UI.createButton({
    systemButton:Titanium.UI.iPhone.SystemButton.EDIT
  });
  var win = Titanium.UI.createWindow({
    url:'items/edit.js',
    rightNavButton: b,
    title:"Edit Item",
    backgroundColor:'#fff'
  });
  win.db = db;
  Titanium.UI.currentTab.open(win, {animated:true});

});

win.addEventListener('focus', function()
{
  Ti.API.debug("list win got focus");
  reload();

}
    );

// add delete event listener
tableview.addEventListener('delete', function(e)
{
  Ti.API.debug("destroying activities");
  item = item.find(e.rowData.item.id);
  var activities = item.activities();

  _(activities).each(function(activity) {
    activity.destroy();

  }, this);

  Ti.API.debug("destroying item");
  item.destroy();
});