var sqlite3 = require('sqlite3');

function logError(err) {
	if (err) console.error(err.stack);
}

function DataAccess(){
	var da = this;

	this.db = new sqlite3.cached.Database('privately.db');

	this.db.serialize(function(){
		da.tableSchema('settings', {
			key: "TEXT PRIMARY KEY",
			name: "TEXT",
			value: "NULL",
			defaultValue: "NULL"
		});

		da.upsertSetting("companion1_name", "Companion 1 Name", "")
		da.upsertSetting("companion2_name", "Companion 1 Name", "")
		da.upsertSetting("companion_password", "Shared Password", "")
	});
}

DataAccess.prototype = {
	getSetting: function(key, callback) {
		this.db.get("SELECT coalesce(value, defaultValue) value FROM settings WHERE key = $key", 
			{ $key: key }, 
			function(err, row) { 
				callback(err, row.value);
			});
	},
	setSetting: function(key, value, callback) {
		this.db.run("UPDATE settings SET value = $value WHERE key = $key", 
			{ $key: key, $value: value }, 
			function(err, result){
				if (callback) callback(err, result);
			});
	},
	upsertSetting: function(key, name, defaultValue) {
		this.db.run(`INSERT OR REPLACE INTO settings (key, name, value, defaultValue)
				VALUES ( 
					$key, 
					$name, 
					(SELECT value FROM settings WHERE key = $key), 
					$defaultValue )`, { 
						$key: key, 
						$name: name,
						$defaultValue: defaultValue }, 
				logError);

	},
	tableSchema: function(tableName, schema){
		// CREATE TABLE IF NOT EXISTS settings (
		// 	key TEXT PRIMARY KEY,
		// 	name TEXT,
		// 	value NULL,
		// 	defaultValue NULL)

		var sql = "CREATE TABLE IF NOT EXISTS " + tableName + "( " + 
			Object.keys(schema).map(function(key){
				return key + " " + schema[key];
			}).join(", ") + ")";

		this.db.run(sql);
	},
	insert: function(tableName, values, callback){
		var sql = "INSERT INTO " + tableName + " (" + 
			Object.keys(values).map(function(key){
				return key;
			}).join(", ") + ") VALUES ( " + 
			Object.keys(values).map(function(key){
				return "$" + key;
			}).join(", ") + ")";
			
		var params = Object.keys(values).reduce(function(prev, curr) {
			prev["$" + curr] = values[curr];
			return prev;
		}, {});

		console.log(sql);
		console.log(params);

		this.db.run(sql, params, function(err){
			if (err) console.error(err);
			if (callback) callback.call(this, err);
		});
	},
	all: function(sql, params, callback) {
		return this.db.all.apply(this.db, arguments);
	}
};

function dataAccess() {
	return new DataAccess();
}

module.exports = dataAccess;
