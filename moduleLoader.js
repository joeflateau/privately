var fs = require('fs');
var express = require('express');

function loadModules(options){
	var loaded = [];	

	['core_modules', 'node_modules'].forEach(function(dir){
		loaded = fs.readdirSync(dir).map(function(moduleName){
			if (moduleName.indexOf('privately-')===0) {
				return { name: moduleName.substring(10), 
					 module: require('./' + dir + '/' + moduleName),
					 path: './' + dir + '/' + moduleName };
			}
		}).concat(loaded);
	});

	loaded = loaded.filter(function(module){ return !!module; });
	
	// initialize
	return loaded.map(function(module){
		var moduleApiRouter = express.Router();
		var moduleIo = options.io.of("/" + module.name);
		options.apiRouter.use('/' + module.name, moduleApiRouter);

		moduleApiRouter
			.get('/viewmodel.js', function(req, res){
				res.sendFile(module.path + '/viewmodel.js', { root: __dirname });
			})
			.get('/template.html', function(req, res){
				res.sendFile(module.path + '/template.html', { root: __dirname });
			});
		
		return {
			name: module.name,
			path: module.path,
			instance:  module.module({
				dataAccess: options.dataAccess,
				moduleApiRouter: moduleApiRouter,
				moduleIo: moduleIo
			})
		};
	});
}

module.exports = loadModules;