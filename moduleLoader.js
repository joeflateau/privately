var fs = require('fs');
var express = require('express');

function loadModules(options){
	var loaded = [];	

	['core_modules', 'node_modules'].forEach(function(dir){
		loaded = fs.readdirSync(dir).map(function(moduleName){
			if (moduleName.indexOf('privately-')===0) {
				return { name: moduleName.substring(10), 
					 module: require('./' + dir + '/' + moduleName),
					 component: fs.readFileSync('./' + dir + '/' + moduleName + "/component.js", "utf8") };
			}
		}).concat(loaded);
	});

	loaded = loaded.filter(function(module){ return !!module; });
	
	// initialize
	return loaded.map(function(module){
		var moduleApiRouter = express.Router();
		var moduleIo = options.io.of("/" + module.name);
		options.apiRouter.use('/' + module.name, moduleApiRouter);
		return {
			name: module.name,
			component: module.component,
			instance:  module.module({
				dataAccess: options.dataAccess,
				moduleApiRouter: moduleApiRouter,
				moduleIo: moduleIo
			})
		};
	});
}

module.exports = loadModules;