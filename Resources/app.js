Ti.include('javascript/underscore.js', 'javascript/active_db.js', 'javascript/models.js');


Titanium.API.info("Initializing DB");
var db =  Titanium.Database.open("ti_store");
initialize_db(db);
seed_db(db);

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');


var tabGroup = Titanium.UI.createTabGroup();


//
// create goals tab and root window
//
var items_win = Titanium.UI.createWindow({
    url:'views/main.js',
    title:'Items',
    tabBarHidden: true
});
items_win.db = db;



var items_tab = Titanium.UI.createTab({
    icon:'icons/Inv_Target.png',
    title:'Items',
    window:items_win
});



//
//  add tabs
//
tabGroup.addTab(items_tab);


// open tab group
tabGroup.open();
