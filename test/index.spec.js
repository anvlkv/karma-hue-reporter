/* global beforeEach, it, describe */

'use strict';

var rewire = require('rewire');
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var should = chai.should();
var expect = chai.expect;
var os = require('os');
var reporterRewire = rewire('../index.js');
var HueReporter = require('../index.js')['reporter:hue'];
var HTTPRequest = require('HTTPRequest');

var formatError = function (a, b) {
  return a + b;
};
function noop() { }
var baseReporterDecorator = function (context) {
  context.renderBrowser = sinon.spy();
  context.writeCommonMsg = sinon.spy();
  context.write = sinon.spy();
};

var config = {
  hueReporter: {
    ip: '123.234.234.2',
    user:'user',
    applyTo: 'lights',
    applyToId: '1'
  }
}

describe('HueReporter', function () {
  describe('functionality', function () {
    describe('onRunComplete', function () {
      var newHueReporter;
      beforeEach(function () {
        newHueReporter = new HueReporter[1](baseReporterDecorator, formatError, config);
        newHueReporter.HTTPRequest = {put:sinon.spy()};
      });

      it('shoul call api', function () {
        newHueReporter.onRunComplete([], []);
        newHueReporter.HTTPRequest.put.should.have.been.called;
      });

      it('shoul set greeen when all passing', function () {
        newHueReporter.onRunComplete([], {failed: 0, success: 1});
        newHueReporter.HTTPRequest.put.should.have.been.calledWith(`http://${config.hueReporter.ip}/api/${config.hueReporter.user}/${config.hueReporter.applyTo}/${config.hueReporter.applyToId}/state`, '{"on":true, "hue":25500}');
      });

      it('shoul set red when all failing', function () {
        newHueReporter.onRunComplete([], {failed: 1, success: 0});
        newHueReporter.HTTPRequest.put.should.have.been.calledWith(`http://${config.hueReporter.ip}/api/${config.hueReporter.user}/${config.hueReporter.applyTo}/${config.hueReporter.applyToId}/state`, '{"on":true, "hue":0}');
      });

      it('shoul reduce hue considerably when at least some are failing', function () {
        newHueReporter.onRunComplete([], {failed: 1, success: 10});
        newHueReporter.HTTPRequest.put.should.have.been.calledWith(`http://${config.hueReporter.ip}/api/${config.hueReporter.user}/${config.hueReporter.applyTo}/${config.hueReporter.applyToId}/state`, '{"on":true, "hue":15000}');
      });

      it('should stop trying after 3rd failure', function () {
        newHueReporter.HTTPRequest = {put:sinon.spy(()=>{throw 'dkjfs'})};

        newHueReporter.onRunComplete([], {failed: 1, success: 10});
        newHueReporter.onRunComplete([], {failed: 1, success: 10});
        newHueReporter.onRunComplete([], {failed: 1, success: 10});
        newHueReporter.onRunComplete([], {failed: 1, success: 10});
        newHueReporter.onRunComplete([], {failed: 1, success: 10});
        newHueReporter.onRunComplete([], {failed: 1, success: 10});
        newHueReporter.onRunComplete([], {failed: 1, success: 10});
        

        newHueReporter.HTTPRequest.put.callCount.should.be.equal(3);
      });
    });
  });
});
