function HtmlReporter(options, callback){
	console.njddebug('Creating HtmlReporter');

	this.format = 'html';
	this._report = '';
	this._window = {};

	var jasmine = options.jasminePath,
		jasmineHtml = options.jasmineHtmlPath,
		skeleton = options.skeletonPath,
		that = this;

	console.njddebug('Constructing HtmlReporter DOM');
	require('jsdom').env({
		html: skeleton,
		scripts: [ jasmine, jasmineHtml ],
		done: function(errors,window){
			if(errors) console.error('Error construction DOM for html reporter: ',errors);

			console.njddebug('Creating TrivialReporter instance.');
			var trivialReporter = new window.jasmine.TrivialReporter();

			console.njddebug('Transferring TrivialReporter methods to HtmlReporter object');
			for(var k in trivialReporter) that[k] = trivialReporter[k];

			that._window = window;

			console.njddebug('Done creating HtmlReporter');
			callback(that);
		}
	});
};
HtmlReporter.prototype.updateReport = function(){
	this._report = this._window.document.outerHTML;
};
HtmlReporter.prototype.getReport = function(){
	return this._report;
};
HtmlReporter.prototype.reset = function(){
	this._window.document.body.innerHTML = ''; // clear for next report
};

exports.create = function(options,callback){
	return new HtmlReporter(options,callback);
};