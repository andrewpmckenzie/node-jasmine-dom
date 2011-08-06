node-jasmine-dom
================

Run your browser-based [jasmine][1] specs headless with node.js. Then 
output in one of many formats such as JSON or JUnit XML (perfect
for integration with CI servers like [Jenkins][2]).

usage
-----
Construct your SpecRunner.html as shown in the jasmine examples,
then run:

    bin/jasmine-dom --runner path/to/SpecRunner.html

You can optionally provide the following arguments:

 * <code>--help</code>, provides usage information
 * <code>--format simple|nice|json|html|junit</code>, displays the result in the specified format
 * <code>--output path</code>, writes the output to the specified file

example 1
---------
    bin/jasmine-dom --runner examples/runner.html --format nice

will output:

    Failed: 
     - In Example functions, Should fail!!: Expected 3 to equal 8.

example 2
---------

    bin/jasmine-dom --runner examples/runner.html --format junit --output javascript_results.xml

will write to javascript_results.xml:

    <testsuite>
        <testcase classname="/Users/andrew/development/node-jasmine-dom/examples/runner.html.Example_functions_that_update_the_DOM.Should_add_two_numbers" name="expect toEqual 7" time="undefined"/>
        <testcase classname="/Users/andrew/development/node-jasmine-dom/examples/runner.html.Example_functions.Should_multiply_two_numbers" name="expect toEqual 40" time="undefined"/>
        <testcase classname="/Users/andrew/development/node-jasmine-dom/examples/runner.html.Example_functions.Should_fail!!" name="expect toEqual 8">
            <failure>
                <![CDATA[
                    FAILURE in spec "Should fail!!": Expected 3 to equal 8.
                    Error: Expected 3 to equal 8.
                        at new <anonymous> (/Users/andrew/development/node-jasmine-dom/examples/tests/lib/jasmine.js:94:50)
                        at [object Object].toEqual (/Users/andrew/development/node-jasmine-dom/examples/tests/lib/jasmine.js:1138:29)
                        at [object Object].<anonymous> (/Users/andrew/development/node-jasmine-dom/examples/tests/spec/example-functions_spec.js:10:13)
                        at [object Object].execute (/Users/andrew/development/node-jasmine-dom/examples/tests/lib/jasmine.js:968:15)
                        at [object Object].next_ (/Users/andrew/development/node-jasmine-dom/examples/tests/lib/jasmine.js:1739:31)
                        at [object Object].start (/Users/andrew/development/node-jasmine-dom/examples/tests/lib/jasmine.js:1692:8)
                        at [object Object].execute (/Users/andrew/development/node-jasmine-dom/examples/tests/lib/jasmine.js:2018:14)
                        at [object Object].next_ (/Users/andrew/development/node-jasmine-dom/examples/tests/lib/jasmine.js:1739:31)
                        at [object Object].start (/Users/andrew/development/node-jasmine-dom/examples/tests/lib/jasmine.js:1692:8)
                        at [object Object].execute (/Users/andrew/development/node-jasmine-dom/examples/tests/lib/jasmine.js:2163:14)
                ]]>
            </failure>
        </testcase>
    </testsuite>

have you seen **[jasmine-node][3]**?
------------------------------------
It's provided a lot of inspiration for this project, and may be just what
you're looking for. If you're not reliant on a DOM, then it's worth checking
out.

[1]: http://pivotal.github.com/jasmine/
[2]: http://jenkins-ci.org/
[3]: https://github.com/mhevery/jasmine-node
