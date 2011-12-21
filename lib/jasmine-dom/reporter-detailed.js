var cp = function(o){ if(typeof o != 'object') return o; var n = {}; for(var k in o) n[k] = o[k]; return n; };

function DetailedReporter(opt){
    console.njddebug('Creating DetailedReporter');

    var that = this;

    this.format = 'detailed';
    this._report = {};

    this.results = [];
    this.currentSet = 0;

};

DetailedReporter.prototype.getReport = function(){
    return cp(this._report);
};

DetailedReporter.prototype.reportStartingGroup = function(name){
    this.results[this.currentSet] = this.results[this.currentSet] || {};
    this.results[this.currentSet].name = name;
};

DetailedReporter.prototype.reportSpecResults = function(spec){

    var items = spec.results().getItems();
    this.results[this.currentSet] = this.results[this.currentSet] || {};
    this.results[this.currentSet].failureDetails = this.results[this.currentSet].failureDetails || [];

    for (var i = 0; i < items.length; i++){
        if( ! items[i].passed_){
            var failureReport = items[i];
            var specName = failureReport.spec;
            this.results[this.currentSet].failureDetails[specName] = this.results[this.currentSet].failureDetails[specName] || [];
            this.results[this.currentSet].failureDetails[specName].push( failureReport );
        }
    }
};

DetailedReporter.prototype.reportRunnerResults = function(runner){
    var results = runner.results();
    var specs = runner.specs();
    var suites = runner.suites();

    var passes = [];
    var failures = [];
    var suiteNames = [];

    for(var i = 0; i < suites.length; i++ ){
        suiteNames.push( suites[i].description )
    };

    for(var i = 0; i < specs.length; i++){
        var result = specs[i].results();
        if(result.failedCount > 0){
            failures.push( result.description );
        } else {
            passes.push( result.description );
        }
    }

    this.results[this.currentSet] = this.results[this.currentSet] || {};
    this.results[this.currentSet].passes = cp(passes);
    this.results[this.currentSet].failures = cp(failures);
    this.results[this.currentSet].suites = cp(suiteNames);
    this.results[this.currentSet].passed = results.passedCount;
    this.results[this.currentSet].failed = results.failedCount;
    this.results[this.currentSet].total = results.totalCount;
    this.currentSet++;
};

DetailedReporter.prototype.updateReport = function(){
    var totalPassed = 0,
        totalFailed = 0,
        totalTests = 0,
        totalSuites = 0,
        failureDetails = [],
        passDetails = [];

    for(var k in this.results){
        var result = this.results[k];
        totalPassed += result.passed;
        totalFailed += result.failed;
        totalTests += result.total;
        totalSuites++;
        if(result.failures){
            for(var j = 0; j < result.failures.length; j++){
                failureDetails.push(result.failures[j]);
            }
        }
        if(result.passes){
            for(var j = 0; j < result.passes.length; j++){
                passDetails.push(result.passes[j]);
            }
        }
    }

    this._report = {
        details: cp(this.results),
        passed: totalPassed,
        failed: totalFailed,
        total: totalTests,
        suites: totalSuites,
        failureDetails: cp(failureDetails),
        passDetails: cp(passDetails),
        status: (totalFailed == 0) ? "Passed" : "Failed"
    };
};

DetailedReporter.prototype.reset = function(){
    this.results = [];
};



exports.create = function(opt){
    return new DetailedReporter(opt);
};