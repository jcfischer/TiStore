// Inspired by base2 and Prototype
(function() {
  var initializing = false, fnTest = /xyz/.test(function() {
    xyz;
  }) ? /\b_super\b/ : /.*/;
  // The base Class implementation (does nothing)
  this.Class = function() {
  };

  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;

    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
          typeof _super[name] == "function" && fnTest.test(prop[name]) ?
          (function(name, fn) {
            return function() {
              var tmp = this._super;

              // Add a new ._super() method that is the same method
              // but on the super-class
              this._super = _super[name];

              // The method only need to be bound temporarily, so we
              // remove it when we're done executing
              var ret = fn.apply(this, arguments);
              this._super = tmp;

              return ret;
            };
          })(name, prop[name]) :
          prop[name];
    }

    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if (!initializing && this.init)
        this.init.apply(this, arguments);
    }

    // Populate our constructed prototype object
    Class.prototype = prototype;

    // Enforce the constructor to be what we expect
    Class.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;

    return Class;
  };
})();


// The Superclass for all models
// loosely basesd on ActiveRecord

var db_name = "tistore";


function initialize_db(db) {
  Titanium.API.log("debug", "initialize_db");

  db.execute('CREATE TABLE IF NOT EXISTS items (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
      'name STRING NOT NULL, ' +
      'cost INTEGER NOT NULL, ' +
      'created_at DATE NOT NULL); ');

  db.execute('CREATE TABLE IF NOT EXISTS activities (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
      'name STRING NOT NULL, ' +
      'cost INTEGER NOT NULL, ' +
      'item_id INTEGER NOT NULL, ' +
      'created_at DATE NOT NULL);');



  //db.close();
}

function seed_db(db) {
  Titanium.API.log("debug", "seed_db");
  // use this hook to initialize the database

}

var Model = Class.extend({
  _fields: {},
  attributes: {},
  new_record: true,
  db: null,

  // initialize the model. Needs to have the database passed
  // var item = new Item(db);
  //
  // the attributes hash can be used to pre-define attributes of the object:
  //
  // var item = new Item(db, {name: "Joe Doe"};
  //
  init: function(aDb, attributes) {
    this.db = aDb;
    if (attributes === undefined) {
      attributes = {};
    }
    _(this._fields).chain().each(function(value, key) {

      try {
        if (attributes[key] === undefined) {
          if (value === String) {
            this[key] = "";
          } else if (value === Date) {
            this[key] = new Date();
          } else {
            this[key] = 0;
          }
        } else
        {

          this[key] = attributes[key];
        }

      } catch(exception) {
        Ti.API.error(exception);
      }
    }, this);
    if (attributes.id === undefined) {
      this.new_record = true;
    }
    else
    {
      this.id = attributes.id;
      this.new_record = false;
    }
    //Ti.API.debug(this);

    this.attributes = attributes;
  },

  field_names: function() {
    _(this._fields).keys();
  },

  // find all objects
  // understands the following options:
  // {order: "name ASC"} -> use the parameter in the ORDER BY clause
  // {conditions: "bla = 123"} -> use the parameter to limit the query
  // {limit: 5} -> only return 5 elements
  //
  // item.find_all({order: "name ASC", conditions: "name like '%abc%'", limit: 10})
  find_all: function(options) {
    var order = options.order;
    delete(options['order']);
    var condition = options.conditions;
    delete(options['conditions']);
    var limit = options.limit;
    delete(options['limit']);
    var order_sql = "";
    if (order) {
      order_sql = " ORDER BY " + order + " ";
    }
    var conditions_sql = "";
    if (condition) {
      conditions_sql = " WHERE " + condition + " ";
    }
    var limit_sql = "";
    if (limit) {
      limit_sql = " LIMIT " + limit + " ";
    }

    var sql = 'SELECT * from ' + this.table_name + conditions_sql + order_sql + limit_sql + ";";
    Titanium.API.debug(sql);
    var rows = this.db.execute(sql);
    var data = [];
    while (rows.isValidRow())
    {
      data.push(this.item_from(rows));
      rows.next();
    }
    rows.close();
    return data;
  },


  // needs to be "ove
  _find: function(id) {
    try {
    var sql = 'SELECT * from ' + this.table_name + ' WHERE id = ?;';
    var rows = this.db.execute(sql, id);
    if (rows.getRowCount() > 0 && rows.isValidRow()) {
      var item = this.item_from(rows);

    }
    rows.close();
    }
    catch(exception) {
      Ti.API.error(exception);
      return null;
    }
    return item;

  },

  // store a new object in the db
  create: function() {
    var fields_sql = " (" + _(this._fields).keys().join(', ') + ") ";
    var placeholders = "(" + _(this._fields).chain().keys().map(function(field) {
      return this.to_sql(field);
    }, this).value().join(", ") + ") ";

    var rows = this.db.execute('INSERT INTO ' + this.table_name + fields_sql + ' VALUES ' + placeholders);
    this.id = db.lastInsertRowId;
  },


  // update an existing object
  update: function() {
    var placeholders = _(this._fields).chain().keys().map(function(field) {
      return field + " = " + this.to_sql(field);
    }, this).value().join(", ");

    var rows = this.db.execute('UPDATE ' + this.table_name + ' SET ' + placeholders + ' WHERE id = ' + this.id);
  },

  // saves the current object. Distinguishes between a new object (and then calls create)
  // or an existing object
  save: function() {
    if (this.new_record) {
      this.create();
    } else
    {
      this.update();
    }
    this.new_record = false;
    return true;
  },

  // delete the object from the database
  // usage:
  // item = item.find(123);
  // item.destroy();
  //
  // or
  //
  // item.destroy(123);
  //

  destroy: function(id) {
    var destroy_id;
    if (id === undefined) {
      destroy_id = this.id;
    } else
    {
      destroy_id = id;
    }
    this.db.execute('DELETE FROM ' + this.table_name + ' WHERE id = ?', destroy_id);
  },



  // this needs to be "redefined" in the actual class as "item_from"
  // to create the correct type of Class. See examples
  _item_from: function(row) {
    var item = {};
    _(this._fields).chain().keys().each(function(field) {
      switch (this._fields[field]) {
        case String:
          item[field] = row.fieldByName(field);
          break;

        case Number:
          item[field] = row.fieldByName(field);
          break;

        case Date:
          item[field] = new Date(row.fieldByName(field));
          break;
        
      }
    }, this).value();
    item.id = row.field(0);
    return item;
  },

  // turn the content of a field into an SQL representation
  to_sql: function(field) {
    switch (this._fields[field]) {
      case String:
        return "'" + this[field].toString() + "'";

      case Number:
        return parseInt(this[field])

      case Date:
        return "'" + this[field].toString() + "'";

    }
  }

});




