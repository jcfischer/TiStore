var Item = Model.extend({

  // the SQL table name
  table_name: "items",
  // the fields with their types

  _fields: {name: String, cost: Number, created_at: Date},

  // the next two functions need to be implemented for each class in order for the
  // generated object to be of the correct class

  find: function(id) {
    var item = new Item(this.db, this._find(id));
    return item;
  },
  item_from: function(row) {
    var item = new Item(this.db, this._item_from(row));
    return item;
  },

  // return all activities
  activities: function(options) {
    var activity = new Activity(this.db);

    var sql_options = {conditions: 'item_id = ' + this.id, order: 'created_at DESC' };
    if (options !== undefined && options['limit'] !== undefined) {
      sql_options['limit'] = options['limit'];
    }
    var activities = activity.find_all(sql_options);
    return activities;
  },

  last_activity: function() {
    var activity = new Activity(this.db);
    var activities = activity.find_all({conditions: 'item_id = ' + this.id,
      order: 'created_at DESC',
      limit: 1  });
    return activities[0];
  }

});

var Activity = Model.extend({
  table_name: "activities",
  _fields: {name: String, item_id: Number, cost: Number, created_at: Date},
  find: function(id) {
    var activity = new Activity(this.db, this._find(id));
    return activity;
  },
  item_from: function(row) {
    var activity = new Activity(this.db, this._item_from(row));
    return activity;
  }
});

