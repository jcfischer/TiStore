Date.prototype.format_str = function() {
  var str = this.getDay() + "." + this.getMonth() + "." + this.getFullYear();
  return str;
}

function moreRow()
{
  var row = Ti.UI.createTableViewRow({height:40});
  var top_offset = 11;
  var label = Titanium.UI.createLabel({
    color:'#000',
    text: 'see all...',
    top:top_offset,
    left: 10,
    width: 250,
    height: 19,
    hasChild: true,
    font:{
      fontFamily:'Helvetica Neue',
      fontSize:15,
      fontWeight: 'bold'
    }
  });
  row.add(label);
  row.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
  row.className = 'more_activities';
  return row;
}

function activityRow(activity)
{

  var row = Ti.UI.createTableViewRow({height:40});
  var top_offset = 11;
  var label = Titanium.UI.createLabel({
    color:'#000',
    text: activity.name,
    top:top_offset,
    left: 10,
    width: 250,
    height: 19,
    font:{
      fontFamily:'Helvetica Neue',
      fontSize:15,
      fontWeight: 'bold'
    }
  });
  row.add(label);
  var cost_label = Ti.UI.createLabel({
    color:'#000',
    text: activity.cost.toString(),
    top:top_offset,
    right: 10,
    height: 19,
    textAlign: 'right',
    font:{
      fontFamily:'Helvetica Neue',
      fontSize:15
    }
  })
  var d = activity.created_at;
  row.add(cost_label);
  var date_label = Ti.UI.createLabel({
    color:'#000',
    text: d.toLocaleDateString(),
    top:top_offset,
    left: 80,
    height: 19,
    textAlign: 'center',
    font:{
      fontFamily:'Helvetica Neue',
      fontSize:15
    }
  });
  row.add(date_label);
  row.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
  row.activity = activity;
  row.className = 'activity';
  return row;
}

function addActivityRow(title)
{
  var row = Ti.UI.createTableViewRow();

  row.title = title;
  row.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
  row.hasChild = true;
  row.className = 'add_activity';
  return row;
}


function event_activity_dummy(e) {
  Ti.API.debug("dummy event handler executed");

  e.focus();

}

var labels = ["Name", "Cost"];
var hints = ['Name of activity', '10'];
var event_handlers = [ event_activity_dummy, event_activity_dummy ];

var fields = [Ti.UI.createTextField({

  left: 90,
  top: 11,
  width: 200,
  height: 20,
  borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
  hintText: hints[0]
}),
  Ti.UI.createTextField({
    left: 90,
    top: 11,
    width: 200,
    height: 20,
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
    keyboardType: Titanium.UI.KEYBOARD_NUMBER_PAD,
    hintText: hints[1]
  })
];