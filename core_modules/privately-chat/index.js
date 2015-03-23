function logError(err) {
	if (err) console.error(err.stack);
}

function Chat(options){
	// implement chat module here
	var moduleApiRouter = this.moduleApiRouter = options.moduleApiRouter;
	var moduleIo = this.moduleIo = options.moduleIo;

	var db = this.db = options.dataAccess.db;

	db.run(`CREATE TABLE IF NOT EXISTS chat (
		id INTEGER PRIMARY KEY,
		sender INTEGER,
		text TEXT,
		attachment NULL)`, logError);

	this.moduleApiRouter
		.post("/send", function(req, res){
			var sender = 0, // todo: sender id
				text = req.body.text;

			db.run("INSERT INTO chat (sender, text) VALUES ($sender, $text)", {
				$sender: sender,
				$text: text
			}, function(err) {
				if (err) {
					console.error(err);
					res.status(500).send('Error');
				}
				var id = this.lastID;
				moduleIo.emit('received', {
					id: id,
					sender: sender,
					text: text
				});
				res.end();
			});
		});

	
}

Chat.prototype = {

}

module.exports = function(options){
	return new Chat(options);
}
