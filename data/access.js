var sqlite3 = require('sqlite3');
var db = new sqlite3.cached.Database('privately.db');

function logError(err) {
	if (err) console.error(err.stack);
}

db.serialize(function(){
	db.run(`CREATE TABLE IF NOT EXISTS settings (
		key TEXT PRIMARY KEY,
		name TEXT,
		value NULL,
		defaultValue NULL)`, logError);

	upsertSetting("companion1_name", "Companion 1 Name", "")
	upsertSetting("companion2_name", "Companion 1 Name", "")
	upsertSetting("companion_password", "Shared Password", "")
});

function DataAccess(){
	
}

// creates a setting or updates the default value
function upsertSetting(key, name, defaultValue) {
	db.run(`INSERT OR REPLACE INTO settings (key, name, value, defaultValue)
			VALUES ( 
				$key, 
				$name, 
				(SELECT value FROM settings WHERE key = $key), 
				$defaultValue )`, { 
					$key: key, 
					$name: name,
					$defaultValue: defaultValue }, 
			logError);

}

DataAccess.prototype = {
	db: db,
	setting: {
		get: function(key, callback) {
			db.get("SELECT coalesce(value, defaultValue) value FROM settings WHERE key = $key", 
				{ $key: key }, 
				function(err, row) { 
					callback(err, row.value);
				});
		},
		set: function(key, value, callback) {
			db.run("UPDATE settings SET value = $value WHERE key = $key", 
				{ $key: key, $value: value }, 
				function(err, result){
					if (callback) callback(err, result);
				});
		}
	}
};

function dataAccess() {
	return new DataAccess();
}

module.exports = dataAccess;
