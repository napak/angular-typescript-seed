/* tslint:disable no-reference */
/// <reference path="../../typings/browser.d.ts" />


var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

interface Window {
    __karma__: any;
}

// Get a list of all the test files to include
var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (TEST_REGEXP.test(file)) {
      allTestFiles.push(file);
    }
  }
}

// base url for website/virtual directory/platform (Ended with'/')
// NOTE: Karma defaults use 'base'
const BASE_URL: string = "/base";
// application name
const APP_NAME: string = "angular.ts.sample";
// flag for configure app for running tests execution
const IS_RUNNING_TESTS: boolean = true;

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: BASE_URL,

  paths: {
        "angular": "lib/angular.min",
        "angular-animate": "lib/angular-animate.min",
        "angular-cookies": "lib/angular-cookies.min",
        "angular-mocks": "lib/angular-mocks",
        "angular-route": "lib/angular-route.min",
        "angular-sanitize": "lib/angular-sanitize.min",
        "angular-translate": "lib/angular-translate.min",

        "bootstrap": "lib/bootstrap.min",
        "jquery": "lib/jquery.min",
        "modernizr": "lib/modernizr"
    },
    shim: {

        "angular": {
            deps: ["jquery"],
            exports: "angular"
        },
        "angular-animate": ["angular"],
        "angular-cookies": ["angular"],
        "angular-mocks": ["angular"],
        "angular-route": ["angular"],
        "angular-sanitize": ["angular"],
        "angular-translate": ["angular"],

        "bootstrap": {
            deps: ["jquery"]
        }
    },

    // we have to kickoff jasmine, as it is asynchronous
    callback: lazyStart
});


function lazyStart() {

    requirejs(["angular",
            "angular-animate",
            "angular-cookies",
            "angular-mocks",
            "angular-route",
            "angular-sanitize",
            "angular-translate",
            "bootstrap"], () => {

                // start app and init karma tests
                requirejs(["app/main"].concat(allTestFiles), () => {
	                window.__karma__.start();
                });
            });
}
