var path = require('path');

function Runner( options ){
	console.debug("Constructing runner for "+options.runner+".");
	this._options = {
		reporter: options.jasmineReporter || {},
		runner: path.normalize(options.runner)
	};
};

Runner.prototype._getScriptPaths = function(pathToHtml, callback){
	require('jsdom').env({
		html: pathToHtml,
		scripts: [],
		done: function(errors,window){
			if(errors){
				console.error('Error when constructing DOM to get script paths for runner.');
				console.debug(errors);
				exit(1);
			}

			var basePath = path.dirname(pathToHtml);
			var scripts = window.document.getElementsByTagName('script');
			var scriptPaths = []

			for(var i = 0; i < scripts.length; i++){
				var script = scripts[i];
				var src = script.getAttribute('src');
				if(src) {
					var scriptPath = path.normalize(basePath + "/" + src);
					scriptPaths.push(scriptPath);
				}
			}
			callback(scriptPaths);
		}
	});
};

Runner.prototype._executeRunner = function(pathToHtml, scripts, reporter, callback){
	console.debug("Executing runner with following scripts: ");
	for(var i = 0; i < scripts.length; i++) console.debug(" - " + scripts[i]);

	require('jsdom').env({
		html: pathToHtml,
		scripts: scripts,
		done: function(errors,window){
			if(errors){
				console.error('Error when constructing DOM for runner.');
				console.debug(errors);
				exit(1);
			}

			// Executed when the DOM has finished construction
			if(errors) console.error('Error construction DOM for tests: ',errors);
			window.jasmine.getEnv().addReporter(reporter);
			window.jasmine.getEnv().addReporter({
				reportRunnerResults : function(){
					if(callback) callback();
				}
			});

			window.jasmine.getEnv().execute();

		}
	});
};

Runner.prototype.run = function(callback){
	var runner = this._options.runner,
		reporter = this._options.reporter,
		that=this;

	console.debug("Running runner " + runner);
	if(reporter.reportStartingGroup) reporter.reportStartingGroup(runner);

	this._getScriptPaths(runner, function(scripts){
		that._executeRunner(runner,scripts,reporter,function(){
			callback();
		});
	});

};

exports.create = function(options){
	return new Runner(options);
}