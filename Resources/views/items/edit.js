Ti.include('../../javascript/underscore.js', '../../javascript/active_db.js', '../../javascript/models.js');

Titanium.include('../../javascript/activity.js');

var win = Titanium.UI.currentWindow;
var db = Ti.UI.currentWindow.db;

win.barColor = '#000';


Ti.API.info("loaded items/edit.js");

var item_id = win.item_id;
var item = new Item(db);
if (item_id) {
  item = item.find(item_id);
}

function event_dummy() {
  Ti.API.debug("dummy event handler executed");
}

function blur_all() {
  fields[0].blur();
  fields[1].blur();

}

function newActivity()
{
  store_item();

  item.save();

  var win = Titanium.UI.createWindow({
    url:'../activities/edit.js',
    title:"Edit Activity",
    backgroundColor:'#fff'
  });
  win.activity = true;
  win.item_id = item.id;
  win.db = db;
  Titanium.UI.currentTab.open(win, {animated:true});

}

function store_item() {

  item.name = fields[0].value;
  item.cost = parseInt(fields[1].value);
  item.created_at = new Date();
  if (item.new_record) {
    item.spent = 0;
  }
  blur_all();
}

Ti.API.debug("opening edit window");

var labels = ["Name", "Cost"];
var hints = ['name of item', 'how much is the total cost'];
var type = ['text', 'number'];
var event_handlers = [ store_item, store_item];

var fields = [Ti.UI.createTextField({
  left: 90,
  top: 12,
  width: 200,
  height: 20,
  borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
  hintText: hints[0]
}),

  Ti.UI.createTextField({
    text: hints[1],
    left: 90,
    top: 12,
    width: 200,
    height: 20,
    hintText: hints[1],
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,

    keyboardType:Titanium.UI.KEYBOARD_NUMBER_PAD,
    returnKeyType:Titanium.UI.RETURNKEY_DEFAULT
  })
];

function addRow(i)
{
  var row = Ti.UI.createTableViewRow({title: labels[i], height:40});
  var tf1 = fields[i];
  row.add(tf1);
  row.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
  row.className = 'control';
  return row;
}

var data = [];
data[0] = Ti.UI.createTableViewSection();

for (var i = 0; i < fields.length; i++) {
  data[0].add(addRow(i));
}




var table_view = Ti.UI.createTableView({
  data:data,
  style: Titanium.UI.iPhone.TableViewStyle.GROUPED
});

win.add(table_view);



win.addEventListener('focus', function()
{
  Ti.API.debug("edit win got focus");
  // reload();

}
    );
win.addEventListener('click', blur_all);

var save_button = Titanium.UI.createButton({title:'Save'});
win.rightNavButton = save_button;

save_button.addEventListener('click', function(e) {
  Ti.API.debug("storing item");
  store_item();
  Ti.API.debug("saving item");

  item.save();
  Ti.API.debug("save item:" + item.name);
  Titanium.App.fireEvent('item_saved', {item_id:item.id});
  Titanium.UI.currentWindow.close();
});

function reload() {

  fields[0].value = item.name;
  fields[1].value = item.cost.toString();


}


reload();


