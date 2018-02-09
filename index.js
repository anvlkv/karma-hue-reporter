var colors = require('colors');

var HueReporter = function (baseReporterDecorator, formatError, config) {
  baseReporterDecorator(this);
  this.HTTPRequest = require('HTTPRequest');

  if(!config){
    this.writeCommonMsg(('please configure your hue report in karma.conf.js hueReporter').red);
  }

  this.onRunComplete = function (browsers, results) {
    var url = `http://${config.hueReporter.ip}/api/${config.hueReporter.user}/${config.hueReporter.applyTo}/${config.hueReporter.applyToId}/state`
    //0 - red 25500 - green
    var totalTests = results.failed + results.success;
    var hue = Math.round((25500 / totalTests) * results.success);

    this.HTTPRequest.put(url, `{"on":true, "hue":${hue}}`, (status, headers, response) => {
        if (status != 200 || response.error){
          this.writeCommonMsg(('Can not set hue... check your config').red);
          delete this.onRunComplete;
        }
    });
  };
};

HueReporter.$inject = ['baseReporterDecorator', 'formatError', 'config'];

module.exports = {
  'reporter:hue': ['type', HueReporter]
};
