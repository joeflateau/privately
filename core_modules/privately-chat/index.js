function logError(err) {
	if (err) console.error(err.stack);
}

function Chat(options){
	var moduleApiRouter = this.moduleApiRouter = options.moduleApiRouter;
	var moduleIo = this.moduleIo = options.moduleIo;

	var da = this.da = options.dataAccess;

	da.tableSchema('chat', {
		id: "INTEGER PRIMARY KEY",
		sender: "INTEGER",
		text: "TEXT",
		attachment: "NULL"
	});

	moduleIo.on('connection', function(socket){
		da.all("SELECT * FROM chat", function(err, rows){
			if (err) console.error(err);
			console.log(rows.length);
			socket.emit('messages', rows);
		});
		socket.on('send', function(message){
			var sender = 0,
				text = message.text;
			console.log(text);
			da.insert("chat", message, function(err){
				if (err) console.error(err);
				var id = this.lastID;
				moduleIo.emit('received', {
					id: id,
					sender: sender,
					text: text
				});
			});
		})
	});
}

Chat.prototype = { 
}

module.exports = function(options){
	return new Chat(options);
}
