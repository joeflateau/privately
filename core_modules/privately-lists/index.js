function logError(err) {
	if (err) console.error(err.stack);
}

function Lists(options){
	var moduleApiRouter = this.moduleApiRouter = options.moduleApiRouter;
	var moduleIo = this.moduleIo = options.moduleIo;

	var da = this.da = options.dataAccess;

	da.tableSchema('lists', {
		id: "INTEGER PRIMARY KEY",
		name: "INTEGER"
	});

	da.tableSchema('listsItems', {
		id: "INTEGER PRIMARY KEY",
		listId: "INTEGER",
		text: "INTEGER"
	});

	moduleIo.on('connection', function(socket){
		function emitAllLists(){
			da.all("SELECT * FROM lists", function(err, rows){
				if (err) console.error(err);
				console.log(rows.length);
				socket.emit('lists', rows);
			});
		}

		emitAllLists();

		function emitListItems(listId){
			da.all("SELECT * FROM listsItems WHERE listId = ?", listId, function(err, rows){
				if (err) console.error(err);
				socket.emit("listitems", {
					listId: listId,
					items: rows
				});
			});
		}

		socket.on('showlistitems', function(listId){
			emitListItems(listId);	
		});

		socket.on('addlist', function(name){
			da.insert("lists", {
				name: name
			}, function(err){
				if (err) console.error(err);
				emitAllLists();
			});
		});
		
		socket.on('addlistitem', function(item){
			da.insert("listsItems", {
				listId: item.listId,
				text: item.text
			}, function(err){
				if (err) console.error(err);
				emitListItems(item.listId);
			});
		});
	});
}

Lists.prototype = { 
}

module.exports = function(options){
	return new Lists(options);
}
