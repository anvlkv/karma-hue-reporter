var colors = require('colors');

var HueReporter = function (baseReporterDecorator, formatError, config) {
  baseReporterDecorator(this);
  this.HTTPRequest = require('HTTPRequest');

  if(!config){
    this.writeCommonMsg(('Please configure your hue report in karma.conf.js hueReporter').red);
  }

  var failCount = 0;


  this.onRunComplete = function (browsers, results) {
    if(failCount >= 3){
      return;
    }

    var url = `http://${config.hueReporter.ip}/api/${config.hueReporter.user}/${config.hueReporter.applyTo}/${config.hueReporter.applyToId}/${config.hueReporter.applyTo == 'lights' ? 'state' : 'action'}`
    //0 - red 25500 - green
    var totalTests = results.failed + results.success;
    var successRatio = (results.success / totalTests) * 100;

    var hue = Math.round((25500 / totalTests) * results.success
      + (results.failed ? -(90 * successRatio) : 0));

    hue < 0 ? hue = 0 : hue = hue;

    try{
      this.HTTPRequest.put(url, `{"on":true, "hue":${hue}}`, (status, headers, response) => {
          if (status != 200 || response.error){
            this.writeCommonMsg(('Can not set hue... check your config').red);
          }
      });
    }
    catch (e){
      failCount ++;
    }
    
  };
};

HueReporter.$inject = ['baseReporterDecorator', 'formatError', 'config'];

module.exports = {
  'reporter:hue': ['type', HueReporter]
};
