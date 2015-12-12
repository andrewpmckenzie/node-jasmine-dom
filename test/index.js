var _ = require('lodash');
var assert = require('chai').assert;
var path = require('path');
var util = require('util');

var toJson = function (o) {
  var asString = JSON.stringify(o);
  return JSON.parse(asString);
};

describe('node-jasmine-dom', function () {

  describe('JasmineRunner', function () {

    var jasmineDom = require('../lib/jasmine-dom');

    it('runs a passing spec from an html file', function (done) {
      var filePath = path.normalize(path.join(__dirname, '..', 'examples', 'runner-pass.html'));

      jasmineDom.run({
        runners: [ filePath ],
        onDone: function (report) {
          assert.deepEqual(report.simple, {
            details: [
              {
                name: filePath,
                passed: 2, failed: 0, total: 2
              }
            ],
            passed: 2, failed: 0, total: 2, suites: 1, failureDetails: [ ], status: 'Passed'
          });

          assert.deepEqual(report.detailed, {
            details: [
              {
                name: filePath,
                failureDetails: { },
                passes: [
                  'Should add two numbers',
                  'Should divide two numbers'
                ],
                failures: [ ],
                suites: [
                  'Example functions that update the DOM',
                  'Example functions (should pass)'
                ],
                passed: 2,
                failed: 0,
                total: 2
              }
            ],
            passDetails: [
              'Should add two numbers',
              'Should divide two numbers'
            ],
            passed: 2, failed: 0, total: 2, suites: 1, failureDetails: [ ], status: 'Passed'
          });

          assert.equal(
              report.junit,
              util.format(
                '<testsuite>' +
                  '<testcase classname="%s.Example_functions_that_update_the_DOM.Should_add_two_numbers" name="expect toEqual 7" time="undefined"/>' +
                  '<testcase classname="%s.Example_functions_(should_pass).Should_divide_two_numbers" name="expect toEqual 4" time="undefined"/>' +
                '</testsuite>',
                  filePath,
                  filePath
              )
          );

          done();
        }
      });
    });

    it('runs a failing spec from an html file', function (done) {
      var fileDir = path.normalize(path.join(__dirname, '..', 'examples'));
      var filePath = path.join(fileDir, 'runner-fail.html');
      jasmineDom.run({
        runners: [ filePath ],
        onDone: function (report) {

          assert.deepEqual(toJson(report.simple), {
            details: [
              {
                name: filePath,
                failures: [
                  {
                    type: 'expect',
                    matcherName: 'toEqual',
                    passed_: false,
                    expected: 8,
                    actual: 3,
                    message: 'Expected 3 to equal 8.',
                    trace: { },
                    suite: 'Example functions (should fail)',
                    spec: 'Should fail!!',
                    group: filePath
                  }
                ],
                passed: 1, failed: 1, total: 2
              }
            ],
            failureDetails: [
              {
                type: 'expect',
                matcherName: 'toEqual',
                passed_: false,
                expected: 8,
                actual: 3,
                message: 'Expected 3 to equal 8.',
                trace: { },
                suite: 'Example functions (should fail)',
                spec: 'Should fail!!',
                group: filePath
              }
            ],
            passed: 1, failed: 1, total: 2, suites: 1,
            status: 'Failed'
          });

          assert.deepEqual(toJson(report.detailed), {
            details: [
              {
                name: filePath,
                failureDetails: {
                  'Should fail!!': [
                    {
                      type: 'expect',
                      matcherName: 'toEqual',
                      passed_: false,
                      expected: 8,
                      actual: 3,
                      message: 'Expected 3 to equal 8.',
                      trace: { },
                      suite: 'Example functions (should fail)',
                      spec: 'Should fail!!',
                      group: filePath
                    }
                  ]
                },
                passes: [ 'Should multiply two numbers' ],
                failures: [ 'Should fail!!' ],
                suites: [ 'Example functions (should fail)' ],
                passed: 1,
                failed: 1,
                total: 2
              }
            ],
            passed: 1,
            failed: 1,
            total: 2,
            suites: 1,
            failureDetails: [ 'Should fail!!' ],
            passDetails: [ 'Should multiply two numbers' ],
            status: 'Failed'
          });

          assert.equal(
              report.junit,
              '<testsuite>' +
                util.format('<testcase classname="%s.Example_functions_(should_fail).Should_multiply_two_numbers" name="expect toEqual 40" time="undefined"/>', filePath) +
                util.format('<testcase classname="%s.Example_functions_(should_fail).Should_fail!!" name="expect toEqual 8">', filePath) +
                  '<failure>' +
                    (
                      '<![CDATA[FAILURE in spec \"Should fail!!\": Expected 3 to equal 8.\n\n\n\n' +
                        'Error: Expected 3 to equal 8.\n' +
                        '    at new jasmine.ExpectationResult (FILE_DIR/lib/jasmine/jasmine.js:94:50)\n' +
                        '    at null.toEqual (FILE_DIR/lib/jasmine/jasmine.js:1138:29)\n' +
                        '    at null.<anonymous> (FILE_DIR/spec/example-fail_spec.js:11:13)\n' +
                        '    at jasmine.Block.execute (FILE_DIR/lib/jasmine/jasmine.js:968:15)\n' +
                        '    at jasmine.Queue.next_ (FILE_DIR/lib/jasmine/jasmine.js:1739:31)\n' +
                        '    at jasmine.Queue.start (FILE_DIR/lib/jasmine/jasmine.js:1692:8)\n' +
                        '    at jasmine.Spec.execute (FILE_DIR/lib/jasmine/jasmine.js:2018:14)\n' +
                        '    at jasmine.Queue.next_ (FILE_DIR/lib/jasmine/jasmine.js:1739:31)\n' +
                        '    at onComplete (FILE_DIR/lib/jasmine/jasmine.js:1735:18)\n' +
                        '    at jasmine.Spec.finish (FILE_DIR/lib/jasmine/jasmine.js:1992:5)' +
                      ']]>'
                    ).replace(/FILE_DIR/g, util.format('file://%s', fileDir)) +
                  '</failure>' +
                '</testcase>' +
              '</testsuite>'
          );

          done();
        }
      });
    });

  });

  describe('args2options', function () {

    var args2options = require('../lib/args2options');

    it.only('interprets a config.yml file provided with the --config flag', function () {
      var configDir = path.normalize(path.join(__dirname, '..', 'examples'));
      var configPath = path.join(configDir, 'config.yaml');

      var options = args2options([ '--config', configPath ]);
      assert.deepEqual(options.runners, [
        {
          name: 'A suite that passes',
          runner: util.format('%s/runner-pass.html', configDir)
        },
        {
          name: 'A suite that fails',
          runner: util.format('%s/runner-fail.html', configDir)
        }
      ]);
    });
  });

});
