var onError;

function Runner( options ){
    console.njddebug("Constructing runner for "+options.runner+".");
    onError = options.onError || function(e){ console.error(e); };

    var name, path,
        runner = options.runner;
    if(typeof runner == 'object'){
        name = runner.name;
        path = runner.runner;
    } else {
        name = runner;
        path = runner;
    }

    this._options = {
        reporter: options.jasmineReporter || {},
        path: require('path').normalize(path),
        name: name,
        routeConsole: options.routeConsole
    };
};

Runner.prototype._getScriptPaths = function(pathToHtml, callback){
    var path = require('path');
    require('jsdom').env({
        html: pathToHtml,
        scripts: [],
        done: function(errors,window){
            if(errors){
                console.njddebug(errors);
                onError('Error when constructing DOM to get script paths for runner.');
                return;
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
    console.njddebug("Constructing runner with following scripts: ");
    for(var i = 0; i < scripts.length; i++) console.njddebug(" - " + scripts[i]);

    var displayedHeader = false;
    var displayLog = this._options.routeConsole;
    var log = function(type, msg){
        if(! displayLog ) return;
        if(! displayedHeader){
            console.log('=== console messages for ' + pathToHtml + ' ===')
            displayedHeader = true;
        }
        console.log(type + ' - ' + msg);
    };

    require('jsdom').env({
        html: pathToHtml,
        scripts: scripts,
        done: function(errors,window){

            window.console.log = function(msg){ log(   'LOG  ', msg); };
            window.console.error = function(msg){ log( 'ERROR', msg); };
            window.console.warn = function(msg){ log(  'WARN ', msg); };
            window.console.info = function(msg){ log(  'INFO ', msg); };            

            if(errors){
                console.njddebug(errors);
                onError('Error when constructing DOM for runner.');
                return;
            }

            // Executed when the DOM has finished construction
            if(errors) console.error('Error construction DOM for tests: ',errors);
            window.jasmine.getEnv().addReporter(reporter);
            window.jasmine.getEnv().addReporter({
                reportRunnerResults : function(){
                    if(callback) callback();
                }
            });

            console.njddebug("Running runner in Jasmine.");
            window.jasmine.getEnv().execute();

        }
    });
};

Runner.prototype.run = function(callback){
    var path = this._options.path,
        name = this._options.name,
        reporter = this._options.reporter,
        that=this;

    console.njddebug("Running runner " + name);
    if(reporter.reportStartingGroup) reporter.reportStartingGroup(name);

    this._getScriptPaths(path, function(scripts){
        that._executeRunner(path,scripts,reporter,function(){
            callback();
        });
    });

};

exports.create = function(options){
    return new Runner(options);
}