/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/build";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(214);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var myApp = angular.module('myApp', ['ng-admin', 'ng-admin.jwt-auth', 'ngVis', 'pascalprecht.translate', 'ngCookies', 'dndLists']);

	myApp.controller('envVariablesCtrl', ['$scope', '$http', function ($scope, $http) {
	    $http.get('../api/env_settings').then(function (response) {
	        $scope.version_number = "Version: " + response.data.backoffice_version;
	        $scope.company_name = response.data.company_name;
	        $scope.company_logo = response.data.company_logo;
	    });
	}]);

	myApp.controller('main', function ($scope, $rootScope, $location, notification) {
	    $rootScope.$on('$stateChangeSuccess', function () {
	        $scope.displayBanner = $location.$$path === '/dashboard';
	    });
	});

	myApp.controller('checkboxController', function ($scope) {
	    $scope.checkboxModel = {
	        checkbox_value: $scope.entry.values.allow_guest_login //get value from read API, assign it to the checkbox
	    };
	    $scope.setValueForGuest = function (thevalue) {
	        $scope.entry.values.allow_guest_login = thevalue; //get checkbox value, assign it to the update API
	    };
	});

	//subscription export
	//Takes user details
	myApp.controller('InvoiceCtrl', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {
	    //takes id from url
	    var currentID = $stateParams.id;
	    $http.get('../api/invoice/?login_data_id=' + currentID).then(function (response) {
	        $scope.users = response.data;
	    });
	}]);
	//Footer Button
	myApp.controller('buttons', ['$scope', function ($scope) {
	    $scope.printInfo = function () {
	        window.print();
	    };

	    $scope.goBack = function () {
	        window.history.back();
	    };
	}]);

	myApp.config(function ($stateProvider) {
	    $stateProvider.state('invoice', {
	        url: '/invoice/:id',
	        templateUrl: 'subscription_export.html'
	    });
	});
	myApp.directive('showInvoice', ['$location', function ($location) {
	    return {
	        restrict: 'E',
	        scope: { post: '&' },
	        link: function link(scope) {
	            scope.send = function () {
	                $location.path('/invoice/' + scope.post().values.id);
	            };
	        },
	        template: '<a class="btn btn-default" ng-click="send()"><i class="fa fa-print fa-lg"></i>&nbsp;GENERATE INVOICE</a>'
	    };
	}]);
	//./subscription export

	//EPG LOGS
	myApp.directive('seeLogs', ['$location', '$http', function ($location, $http) {
	    return {
	        restrict: 'E',
	        scope: {
	            fromDirectiveFn: '=method',
	            post: '&'
	        },
	        link: function link(scope, elm, attrs) {

	            scope.see = function () {
	                var currentlog = scope.post().values.epg_file;
	                scope.filenames = currentlog;
	                scope.fromDirectiveFn(scope.filenames);
	            };
	        },
	        template: '<ma-submit-button class="pull-right" ng-click="see()" label="Submit"></ma-submit-button>'
	    };
	}]);

	myApp.controller("logsCtrl", ['$scope', '$http', function ($scope, $http) {
	    $scope.ctrlFn = function (arg) {
	        var Indata = { 'epg_file': arg };
	        $http.post("../api/epgimport", Indata).then(function (response, data, status, headers, config, file) {
	            // alert("success");
	            $scope.records = response.data;
	            $scope.records1 = ["File Name", "Saved Records", "Non Saved Records", "Error Log"];
	        }, function (data, status, headers, config) {
	            winston.error("error");
	        });
	    };
	}]);
	//./EPG LOGS

	//downloadInvoice

	myApp.directive('downloadInvoice', ['$location', '$http', function ($location, $http) {
	    return {
	        restrict: 'E',
	        scope: { post: '&' },
	        link: function link(scope) {
	            scope.sendsale = function () {
	                var currentIDD = scope.post().values.id;
	                $http.get('../api/invoice/download/' + currentIDD, { responseType: 'blob' }).then(function (response) {
	                    var data = response.data,
	                        blob = new Blob([data], { type: 'application/pdf' });
	                    var filename = response.headers('x-filename');
	                    FileSaver.saveAs(blob, filename);
	                });
	            };
	        },
	        template: '<a class="btn btn-default btn-xs" ng-click="sendsale()"><i class="fa fa-print fa-lg"></i>&nbsp;Download</a>'
	    };
	}]);
	//./downloadInvoice

	//Drag_and_drop_package

	myApp.directive('seeDrag', ['$location', '$http', function ($location, $http) {
	    return {
	        restrict: 'E',
	        scope: {
	            fromDirectiveFn: '=method',
	            post: '&'
	        },
	        link: function link(scope, elm, attrs) {

	            scope.see = function () {
	                var package_name = scope.post().values.id;
	                var package_type_id = scope.post().values.package_type_id;
	                scope.fromDirectiveFn([package_name, package_type_id]);
	            };
	        },
	        template: '<a type="buton" class="btn btn-default" ng-click="see()"><i class="fa fa-plus fa-lg"></i>&nbsp;&nbsp;ADD CHANNELS</a>'
	    };
	}]);

	myApp.controller('dragdropctrl', ['$scope', '$http', '$stateParams', 'notification', function ($scope, $http, $stateParams, notification) {
	    $scope.models = [{ listName: "Available", items: [], dragging: false }, { listName: "Selected", items: [], dragging: false }];

	    $scope.getSelectedItemsIncluding = function (list, item) {
	        item.selected = true;
	        return list.items.filter(function (item) {
	            return item.selected;
	        });
	    };

	    $scope.onDrop = function (list, items, index) {
	        angular.forEach(items, function (item) {
	            item.selected = false;
	        });
	        list.items = list.items.slice(0, index).concat(items).concat(list.items.slice(index));
	        return true;
	    };

	    $scope.onMoved = function (list) {
	        list.items = list.items.filter(function (item) {
	            return !item.selected;
	        });
	    };

	    $http.get('../api/channels').then(function (response) {

	        $scope.array = response.data;
	        var id_pakete = $stateParams.id;

	        for (var j = 0; j < $scope.array.length; j++) {
	            var index = $scope.array[j].packages_channels.findIndex(function (todo, index) {
	                return todo.package_id == id_pakete;
	            });

	            if (index > -1) {
	                var lista = $scope.models[1];
	                lista.items.push({ label: $scope.array[j].title, id: $scope.array[j].id, nr: $scope.array[j].channel_number });
	            } else if (index <= -1) {
	                var lista1 = $scope.models[0];
	                lista1.items.push({ label: $scope.array[j].title, id: $scope.array[j].id, nr: $scope.array[j].channel_number });
	            }
	        }
	    });

	    $scope.ctrlFn = function (arg) {
	        var name = arg[0];
	        var id = arg[1];
	        var selected = $scope.models[1].items;
	        var channels_list = [];

	        for (var k = 0; k < selected.length; k++) {
	            channels_list.push(selected[k].id);
	        }

	        var data = { 'package_id': name, 'channel_id': channels_list };
	        $http.post("../api/packagechannels", data).then(function (response, data, status, headers, config, file) {

	            notification.log('Channels successfully added', { addnCls: 'humane-flatty-success' });
	        }, function (data, status, headers, config) {
	            notification.log('Something Wrong', { addnCls: 'humane-flatty-error' });
	        });
	    };
	}]);

	//./Drag_and_drop_package

	// Pagination & Sort
	var apiFlavor = __webpack_require__(2);
	var FileSaver = __webpack_require__(3);
	myApp.config(['RestangularProvider', apiFlavor.requestInterceptor]);

	myApp.controller('username', ['$scope', '$window', function ($scope, $window) {
	    $scope.username = $window.localStorage.userName.toUpperCase();
	}]);

	var preferred_language = 'en';

	myApp.controller('main', function ($scope, $rootScope, $location, notification) {
	    $rootScope.$on('$stateChangeSuccess', function () {
	        $scope.displayBanner = $location.$$path === '/dashboard';
	    });
	});

	myApp.controller('languageCtrl', ['$translate', '$scope', '$cookies', function ($translate, $scope, $cookies) {
	    $scope.serve_language = function (langKey) {
	        $translate.use(langKey);
	        preferred_language = langKey;
	    };
	    $translate('HEADLINE').then(function (headline) {
	        $scope.headline = headline;
	    }, function (translationId) {
	        $scope.headline = translationId;
	    });

	    //show the selected language from dropdown list
	    $scope.button = $cookies.get('cookie');
	    $scope.change = function (name) {
	        // Find tomorrow's date.
	        var expireDate = new Date();
	        expireDate.setDate(expireDate.getDate() + 364);
	        $cookies.put('cookie', name, { 'expires': expireDate });
	        $scope.button = name;
	    };
	}]);

	myApp.config(['$translateProvider', function ($translateProvider) {
	    $translateProvider.useStaticFilesLoader({
	        files: [{
	            prefix: '../admin/languages/',
	            suffix: '.json'
	        }, {
	            prefix: '../admin/languages/',
	            suffix: '.json'
	        }]
	    });
	    $translateProvider.preferredLanguage(preferred_language);
	    $translateProvider.useCookieStorage(); //remember chosen language
	}]);

	// Forgot Password Controller

	myApp.controller('main', ['Restangular', '$scope', '$uibModal', 'notification', function (Restangular, $scope, $uibModal, notification) {

	    $scope.modal = function () {
	        var modalInstance = $uibModal.open({
	            template: '<div class="modal-header">' + '<h5 class="modal-title">Forgot Password</h5>' + '</div>' + '<div class="container modal-body">' + '<form>' + '<div class="form-group col-xs-9">' + '<label for="exampleInputEmail1">Email / Username</label>' + '<hr>' + '<input type="input" class="form-control" ng-model="forgot.username" value="forgot.username" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email or username">' + '</div>' + '</form>' + '</div>' + '<div class="modal-footer">' + '<button class="btn btn-primary" type="button" ng-click="ok()">Submit</button>' + '<button class="btn btn-warning" type="button" ng-click="cancel()">Cancel</button>' + '</div>',
	            controller: ('main', ['$scope', '$uibModalInstance', 'confirmClick', 'confirmMessge', function ($scope, $uibModalInstance, confirmClick, confirmMessge) {

	                $scope.confirmMessage = confirmMessge;

	                function closeModal() {

	                    $uibModalInstance.dismiss('cancel');
	                }

	                $scope.ok = function () {

	                    closeModal();
	                    Restangular.one('auth/forgot').customPOST($scope.forgot).then(function successCallback(response) {
	                        notification.log(response.message, { addnCls: 'humane-flatty-success' });
	                    }, function errorCallback(response) {});
	                };

	                $scope.cancel = function () {
	                    closeModal();
	                };
	            }]),
	            size: 'lg',
	            windowClass: 'confirm-window',
	            resolve: {
	                confirmClick: function confirmClick() {
	                    return $scope.ngConfirm;
	                },
	                confirmMessge: function confirmMessge() {
	                    return $scope.ngConfirmMessage;
	                }
	            }
	        });
	    };
	}]);

	// Login Controller

	myApp.config(['NgAdminConfigurationProvider', 'RestangularProvider', 'ngAdminJWTAuthConfiguratorProvider', function (NgAdminConfigurationProvider, RestangularProvider, ngAdminJWTAuthConfigurator) {

	    var nga = NgAdminConfigurationProvider;

	    if (location.protocol == 'http:') {

	        ngAdminJWTAuthConfigurator.setJWTAuthURL('http://' + location.host + '/api/auth/login');
	    } else {

	        ngAdminJWTAuthConfigurator.setJWTAuthURL('https://' + location.host + '/api/auth/login');
	    }

	    ngAdminJWTAuthConfigurator.setCustomLoginTemplate('customLoginTemplate.html');

	    ngAdminJWTAuthConfigurator.setCustomAuthHeader({
	        name: 'Authorization',
	        template: '{{token}}'
	    });
	}]);

	myApp.run(['Restangular', '$location', 'notification', function (Restangular, $location, notification) {
	    Restangular.setErrorInterceptor(function (response, deferred, responseHandler) {
	        if (response.status > 200) {

	            deferred.reject("Server not responding to [some address]. It could be down, or this could be the wrong url.");
	            notification.log('Error: ' + ' ( ' + response.data.message + ' )', { addnCls: 'humane-flatty-error' });

	            return false;
	        }
	    });
	}]);

	// Dashboard Directives
	myApp.directive('dashboardSummary', __webpack_require__(4));
	myApp.directive('resellersdashboardSummary', __webpack_require__(117));
	myApp.directive('graph', __webpack_require__(119));
	myApp.directive('sendpush', __webpack_require__(121));
	myApp.directive('sale', __webpack_require__(122));
	myApp.directive('vod', __webpack_require__(123));
	myApp.directive('move', __webpack_require__(124));
	myApp.directive('generate', __webpack_require__(125));
	myApp.directive('approveReview', __webpack_require__(126));

	//myApp.directive('roles', require('./grouprights/radioRoles'));

	// personal config
	myApp.config(['$stateProvider', __webpack_require__(127)]);
	myApp.config(['$stateProvider', __webpack_require__(129)]);
	myApp.config(['$stateProvider', __webpack_require__(131)]);
	myApp.config(['$stateProvider', __webpack_require__(133)]);

	myApp.config(['NgAdminConfigurationProvider', function (nga) {

	    // App Create

	    if (location.protocol == 'http:') {
	        var admin = nga.application('MAGOWARE').baseApiUrl('http://' + location.host + '/api/');
	    } else {
	        var admin = nga.application('MAGOWARE').baseApiUrl('https://' + location.host + '/api/');
	    }

	    // Table Configuration

	    admin.addEntity(nga.entity('Channels'));
	    admin.addEntity(nga.entity('ChannelStreams'));
	    admin.addEntity(nga.entity('ChannelStreamSources'));
	    admin.addEntity(nga.entity('Combos'));
	    admin.addEntity(nga.entity('comboPackages'));
	    admin.addEntity(nga.entity('CustomerData'));
	    admin.addEntity(nga.entity('CustomerGroups'));
	    admin.addEntity(nga.entity('DeviceMenus'));
	    admin.addEntity(nga.entity('SystemMenu'));
	    admin.addEntity(nga.entity('Devices'));
	    admin.addEntity(nga.entity('EpgData'));
	    admin.addEntity(nga.entity('epgimport'));
	    admin.addEntity(nga.entity('mychannels'));
	    admin.addEntity(nga.entity('Genres'));
	    admin.addEntity(nga.entity('LoginData'));
	    admin.addEntity(nga.entity('Packages'));
	    admin.addEntity(nga.entity('livepackages'));
	    admin.addEntity(nga.entity('packagechannels'));
	    admin.addEntity(nga.entity('vodPackages'));
	    admin.addEntity(nga.entity('package_vod'));
	    admin.addEntity(nga.entity('packagetypes'));
	    admin.addEntity(nga.entity('Salesreports'));
	    admin.addEntity(nga.entity('sales_by_product'));
	    admin.addEntity(nga.entity('sales_by_date'));
	    admin.addEntity(nga.entity('sales_by_month'));
	    admin.addEntity(nga.entity('sales_monthly_expiration'));
	    admin.addEntity(nga.entity('sales_by_expiration'));
	    admin.addEntity(nga.entity('Settings'));
	    admin.addEntity(nga.entity('EmailSettings'));
	    admin.addEntity(nga.entity('URL'));
	    admin.addEntity(nga.entity('ApiKeys'));
	    admin.addEntity(nga.entity('ImagesSettings'));
	    admin.addEntity(nga.entity('PlayerSettings'));
	    admin.addEntity(nga.entity('Subscriptions'));
	    admin.addEntity(nga.entity('Users'));
	    admin.addEntity(nga.entity('Groups'));
	    admin.addEntity(nga.entity('Grouprights'));
	    admin.addEntity(nga.entity('Vods'));
	    admin.addEntity(nga.entity('appmanagement'));
	    admin.addEntity(nga.entity('messages'));
	    admin.addEntity(nga.entity('commands'));
	    admin.addEntity(nga.entity('ads'));
	    admin.addEntity(nga.entity('logs'));
	    admin.addEntity(nga.entity('activity'));
	    admin.addEntity(nga.entity('appgroup'));
	    admin.addEntity(nga.entity('VodCategories'));
	    admin.addEntity(nga.entity('vodstreams'));
	    admin.addEntity(nga.entity('VodStreamSources'));
	    admin.addEntity(nga.entity('vodsubtitles'));
	    admin.addEntity(nga.entity('PaymentTransactions'));
	    admin.addEntity(nga.entity('EmailTemplate'));
	    admin.addEntity(nga.entity('NewCustomer'));
	    admin.addEntity(nga.entity('MySubscription'));
	    admin.addEntity(nga.entity('MySales'));
	    admin.addEntity(nga.entity('search_customer'));
	    admin.addEntity(nga.entity('AdvancedSettings'));
	    admin.addEntity(nga.entity('Submenu'));
	    admin.addEntity(nga.entity('VodEpisode'));
	    admin.addEntity(nga.entity('tv_episode_subtitles'));
	    admin.addEntity(nga.entity('tv_episode_stream'));
	    admin.addEntity(nga.entity('ResellersLoginData'));
	    admin.addEntity(nga.entity('ResellersUsers'));
	    admin.addEntity(nga.entity('Series'));
	    admin.addEntity(nga.entity('Season'));
	    admin.addEntity(nga.entity('vodMenu'));
	    admin.addEntity(nga.entity('vodMenuCarousel'));
	    admin.addEntity(nga.entity('htmlContent'));
	    admin.addEntity(nga.entity('tmdbvods'));

	    //Config

	    __webpack_require__(135)(nga, admin);
	    __webpack_require__(138)(nga, admin);
	    __webpack_require__(139)(nga, admin);
	    __webpack_require__(140)(nga, admin);
	    __webpack_require__(141)(nga, admin);
	    __webpack_require__(142)(nga, admin);
	    __webpack_require__(143)(nga, admin);
	    __webpack_require__(144)(nga, admin);
	    __webpack_require__(145)(nga, admin);
	    __webpack_require__(146)(nga, admin);
	    __webpack_require__(147)(nga, admin);
	    __webpack_require__(148)(nga, admin);
	    __webpack_require__(149)(nga, admin);
	    __webpack_require__(150)(nga, admin);
	    __webpack_require__(151)(nga, admin);
	    __webpack_require__(152)(nga, admin);
	    __webpack_require__(153)(nga, admin);
	    __webpack_require__(154)(nga, admin);
	    __webpack_require__(155)(nga, admin);
	    __webpack_require__(156)(nga, admin);
	    __webpack_require__(157)(nga, admin);
	    __webpack_require__(158)(nga, admin);
	    __webpack_require__(159)(nga, admin);
	    __webpack_require__(160)(nga, admin);
	    __webpack_require__(161)(nga, admin);
	    __webpack_require__(162)(nga, admin);
	    __webpack_require__(163)(nga, admin);
	    __webpack_require__(164)(nga, admin);
	    __webpack_require__(165)(nga, admin);
	    __webpack_require__(166)(nga, admin);
	    __webpack_require__(167)(nga, admin);
	    __webpack_require__(168)(nga, admin);
	    __webpack_require__(169)(nga, admin);
	    __webpack_require__(170)(nga, admin);
	    __webpack_require__(171)(nga, admin);
	    __webpack_require__(173)(nga, admin);
	    __webpack_require__(174)(nga, admin);
	    __webpack_require__(175)(nga, admin);
	    __webpack_require__(178)(nga, admin);
	    __webpack_require__(179)(nga, admin);
	    __webpack_require__(180)(nga, admin);
	    __webpack_require__(181)(nga, admin);
	    __webpack_require__(182)(nga, admin);
	    __webpack_require__(183)(nga, admin);
	    __webpack_require__(184)(nga, admin);
	    __webpack_require__(185)(nga, admin);
	    __webpack_require__(186)(nga, admin);
	    __webpack_require__(187)(nga, admin);
	    __webpack_require__(188)(nga, admin);
	    __webpack_require__(189)(nga, admin);
	    __webpack_require__(190)(nga, admin);
	    __webpack_require__(191)(nga, admin);
	    __webpack_require__(192)(nga, admin);
	    __webpack_require__(193)(nga, admin);
	    __webpack_require__(194)(nga, admin);
	    __webpack_require__(195)(nga, admin);
	    __webpack_require__(196)(nga, admin);
	    __webpack_require__(197)(nga, admin);
	    __webpack_require__(198)(nga, admin);
	    __webpack_require__(199)(nga, admin);
	    __webpack_require__(200)(nga, admin);
	    __webpack_require__(201)(nga, admin);
	    __webpack_require__(202)(nga, admin);
	    __webpack_require__(203)(nga, admin);
	    __webpack_require__(204)(nga, admin);
	    __webpack_require__(205)(nga, admin);
	    __webpack_require__(206)(nga, admin);

	    // Menu / Header / Dashboard / Layout

	    if (localStorage.userRole === 'resellers') {
	        admin.dashboard(__webpack_require__(207)(nga, admin));
	    } else {
	        admin.dashboard(__webpack_require__(209)(nga, admin));
	    }

	    admin.header(__webpack_require__(211));

	    var menujson = __webpack_require__(212);
	    // console.log("objekti menus",menujson);
	    admin.menu(__webpack_require__(213)(nga, admin, menujson));

	    // admin.menu(require('./menu')(nga, admin));

	    // App

	    nga.configure(admin);
	}]);

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	function requestInterceptor(RestangularProvider) {

	    RestangularProvider.addFullRequestInterceptor(function (element, operation, what, url, headers, params) {

	        if (operation == "getList") {

	            params._start = (params._page - 1) * params._perPage;
	            params._end = params._page * params._perPage;
	            delete params._page;
	            delete params._perPage;

	            // custom sort params
	            if (params._sortField) {
	                params._orderBy = params._sortField;
	                params._orderDir = params._sortDir;
	                delete params._sortField;
	                delete params._sortDir;
	            }

	            // custom filters
	            if (params._filters) {
	                for (var filter in params._filters) {
	                    params[filter] = params._filters[filter];
	                }
	                delete params._filters;
	            }

	            //defautl values parameters
	            var hash = location.hash;
	            if (hash.includes('defaultValues=')) {
	                var search = 'defaultValues=';
	                var defaultValuesStr = decodeURIComponent(hash.substring(hash.indexOf(search) + search.length));
	                var defaultValues = JSON.parse(defaultValuesStr);
	                var key0 = Object.keys(defaultValues)[0];
	                var key1 = Object.keys(defaultValues)[1];
	                params[key0] = defaultValues[key0];
	            }
	        } else {}

	        return { params: params };
	    });
	}

	exports['default'] = { requestInterceptor: requestInterceptor };
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * Created by user on 6/5/2018.
	 */

	/* FileSaver.js
	 * A saveAs() FileSaver implementation.
	 * 1.3.8
	 * 2018-03-22 14:03:47
	 *
	 * By Eli Grey, https://eligrey.com
	 * License: MIT
	 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
	 */

	/*global self */
	/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

	/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/src/FileSaver.js */

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var saveAs = saveAs || (function (view) {
	    "use strict";
	    // IE <10 is explicitly unsupported
	    if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
	        return;
	    }
	    var doc = view.document,

	    // only get URL when necessary in case Blob.js hasn't overridden it yet
	    get_URL = function get_URL() {
	        return view.URL || view.webkitURL || view;
	    },
	        save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a"),
	        can_use_save_link = ("download" in save_link),
	        click = function click(node) {
	        var event = new MouseEvent("click");
	        node.dispatchEvent(event);
	    },
	        is_safari = /constructor/i.test(view.HTMLElement) || view.safari,
	        is_chrome_ios = /CriOS\/[\d]+/.test(navigator.userAgent),
	        setImmediate = view.setImmediate || view.setTimeout,
	        throw_outside = function throw_outside(ex) {
	        setImmediate(function () {
	            throw ex;
	        }, 0);
	    },
	        force_saveable_type = "application/octet-stream",

	    // the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
	    arbitrary_revoke_timeout = 1000 * 40,
	        // in ms
	    revoke = function revoke(file) {
	        var revoker = function revoker() {
	            if (typeof file === "string") {
	                // file is an object URL
	                get_URL().revokeObjectURL(file);
	            } else {
	                // file is a File
	                file.remove();
	            }
	        };
	        setTimeout(revoker, arbitrary_revoke_timeout);
	    },
	        dispatch = function dispatch(filesaver, event_types, event) {
	        event_types = [].concat(event_types);
	        var i = event_types.length;
	        while (i--) {
	            var listener = filesaver["on" + event_types[i]];
	            if (typeof listener === "function") {
	                try {
	                    listener.call(filesaver, event || filesaver);
	                } catch (ex) {
	                    throw_outside(ex);
	                }
	            }
	        }
	    },
	        auto_bom = function auto_bom(blob) {
	        // prepend BOM for UTF-8 XML and text/* types (including HTML)
	        // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
	        if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
	            return new Blob([String.fromCharCode(0xFEFF), blob], { type: blob.type });
	        }
	        return blob;
	    },
	        FileSaver = function FileSaver(blob, name, no_auto_bom) {
	        if (!no_auto_bom) {
	            blob = auto_bom(blob);
	        }
	        // First try a.download, then web filesystem, then object URLs
	        var filesaver = this,
	            type = blob.type,
	            force = type === force_saveable_type,
	            object_url,
	            dispatch_all = function dispatch_all() {
	            dispatch(filesaver, "writestart progress write writeend".split(" "));
	        },

	        // on any filesys errors revert to saving with object URLs
	        fs_error = function fs_error() {
	            if ((is_chrome_ios || force && is_safari) && view.FileReader) {
	                // Safari doesn't allow downloading of blob urls
	                var reader = new FileReader();
	                reader.onloadend = function () {
	                    var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
	                    var popup = view.open(url, '_blank');
	                    if (!popup) view.location.href = url;
	                    url = undefined; // release reference before dispatching
	                    filesaver.readyState = filesaver.DONE;
	                    dispatch_all();
	                };
	                reader.readAsDataURL(blob);
	                filesaver.readyState = filesaver.INIT;
	                return;
	            }
	            // don't create more object URLs than needed
	            if (!object_url) {
	                object_url = get_URL().createObjectURL(blob);
	            }
	            if (force) {
	                view.location.href = object_url;
	            } else {
	                var opened = view.open(object_url, "_blank");
	                if (!opened) {
	                    // Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
	                    view.location.href = object_url;
	                }
	            }
	            filesaver.readyState = filesaver.DONE;
	            dispatch_all();
	            revoke(object_url);
	        };
	        filesaver.readyState = filesaver.INIT;

	        if (can_use_save_link) {
	            object_url = get_URL().createObjectURL(blob);
	            setImmediate(function () {
	                save_link.href = object_url;
	                save_link.download = name;
	                click(save_link);
	                dispatch_all();
	                revoke(object_url);
	                filesaver.readyState = filesaver.DONE;
	            }, 0);
	            return;
	        }

	        fs_error();
	    },
	        FS_proto = FileSaver.prototype,
	        saveAs = function saveAs(blob, name, no_auto_bom) {
	        return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
	    };

	    // IE 10+ (native saveAs)
	    if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
	        return function (blob, name, no_auto_bom) {
	            name = name || blob.name || "download";

	            if (!no_auto_bom) {
	                blob = auto_bom(blob);
	            }
	            return navigator.msSaveOrOpenBlob(blob, name);
	        };
	    }

	    // todo: detect chrome extensions & packaged apps
	    //save_link.target = "_blank";

	    FS_proto.abort = function () {};
	    FS_proto.readyState = FS_proto.INIT = 0;
	    FS_proto.WRITING = 1;
	    FS_proto.DONE = 2;

	    FS_proto.error = FS_proto.onwritestart = FS_proto.onprogress = FS_proto.onwrite = FS_proto.onabort = FS_proto.onerror = FS_proto.onwriteend = null;

	    return saveAs;
	})(typeof self !== "undefined" && self || typeof window !== "undefined" && window || undefined);
	exports.saveAs = saveAs;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _moment = __webpack_require__(5);

	var _moment2 = _interopRequireDefault(_moment);

	var _dashboardSummaryHtml = __webpack_require__(116);

	var _dashboardSummaryHtml2 = _interopRequireDefault(_dashboardSummaryHtml);

	var oneMonthAgo = (0, _moment2['default'])().subtract(1, 'months').toDate();

	var has_seen_alert = false;

	function dashboardSummary(Restangular) {
	    'use strict';

	    return {
	        restrict: 'E',
	        scope: {},
	        controller: function controller($scope) {
	            $scope.stats = {};
	            $scope.has_seen_alert = has_seen_alert;
	            $scope.dismissAlert = function () {
	                has_seen_alert = true;
	                $scope.has_seen_alert = true;
	            };
	            Restangular.all('loginData').getList({ _page: 1, _perPage: 10 }).then(function (logindata) {
	                $scope.stats.logindata = logindata.headers('x-total-count');
	            });

	            Restangular.all('channels').getList({ _page: 1, _perPage: 10 }).then(function (channels) {
	                $scope.stats.channels = channels.headers('x-total-count');
	            });
	            Restangular.all('vods').getList({ _page: 1, _perPage: 10 }).then(function (vods) {
	                $scope.stats.vods = vods.headers('x-total-count'); //reviews.data.999
	            });
	            Restangular.all('devices').getList({ _page: 1, _perPage: 10 }).then(function (devices) {
	                $scope.stats.devices = devices.headers('x-total-count'); //reviews.data.999
	            });
	        },
	        template: _dashboardSummaryHtml2['default']
	    };
	}

	dashboardSummary.$inject = ['Restangular'];

	exports['default'] = dashboardSummary;
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {//! moment.js
	//! version : 2.17.1
	//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
	//! license : MIT
	//! momentjs.com

	;(function (global, factory) {
	     true ? module.exports = factory() :
	    typeof define === 'function' && define.amd ? define(factory) :
	    global.moment = factory()
	}(this, (function () { 'use strict';

	var hookCallback;

	function hooks () {
	    return hookCallback.apply(null, arguments);
	}

	// This is done to register the method called with moment()
	// without creating circular dependencies.
	function setHookCallback (callback) {
	    hookCallback = callback;
	}

	function isArray(input) {
	    return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
	}

	function isObject(input) {
	    // IE8 will treat undefined and null as object if it wasn't for
	    // input != null
	    return input != null && Object.prototype.toString.call(input) === '[object Object]';
	}

	function isObjectEmpty(obj) {
	    var k;
	    for (k in obj) {
	        // even if its not own property I'd still call it non-empty
	        return false;
	    }
	    return true;
	}

	function isNumber(input) {
	    return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
	}

	function isDate(input) {
	    return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
	}

	function map(arr, fn) {
	    var res = [], i;
	    for (i = 0; i < arr.length; ++i) {
	        res.push(fn(arr[i], i));
	    }
	    return res;
	}

	function hasOwnProp(a, b) {
	    return Object.prototype.hasOwnProperty.call(a, b);
	}

	function extend(a, b) {
	    for (var i in b) {
	        if (hasOwnProp(b, i)) {
	            a[i] = b[i];
	        }
	    }

	    if (hasOwnProp(b, 'toString')) {
	        a.toString = b.toString;
	    }

	    if (hasOwnProp(b, 'valueOf')) {
	        a.valueOf = b.valueOf;
	    }

	    return a;
	}

	function createUTC (input, format, locale, strict) {
	    return createLocalOrUTC(input, format, locale, strict, true).utc();
	}

	function defaultParsingFlags() {
	    // We need to deep clone this object.
	    return {
	        empty           : false,
	        unusedTokens    : [],
	        unusedInput     : [],
	        overflow        : -2,
	        charsLeftOver   : 0,
	        nullInput       : false,
	        invalidMonth    : null,
	        invalidFormat   : false,
	        userInvalidated : false,
	        iso             : false,
	        parsedDateParts : [],
	        meridiem        : null
	    };
	}

	function getParsingFlags(m) {
	    if (m._pf == null) {
	        m._pf = defaultParsingFlags();
	    }
	    return m._pf;
	}

	var some;
	if (Array.prototype.some) {
	    some = Array.prototype.some;
	} else {
	    some = function (fun) {
	        var t = Object(this);
	        var len = t.length >>> 0;

	        for (var i = 0; i < len; i++) {
	            if (i in t && fun.call(this, t[i], i, t)) {
	                return true;
	            }
	        }

	        return false;
	    };
	}

	var some$1 = some;

	function isValid(m) {
	    if (m._isValid == null) {
	        var flags = getParsingFlags(m);
	        var parsedParts = some$1.call(flags.parsedDateParts, function (i) {
	            return i != null;
	        });
	        var isNowValid = !isNaN(m._d.getTime()) &&
	            flags.overflow < 0 &&
	            !flags.empty &&
	            !flags.invalidMonth &&
	            !flags.invalidWeekday &&
	            !flags.nullInput &&
	            !flags.invalidFormat &&
	            !flags.userInvalidated &&
	            (!flags.meridiem || (flags.meridiem && parsedParts));

	        if (m._strict) {
	            isNowValid = isNowValid &&
	                flags.charsLeftOver === 0 &&
	                flags.unusedTokens.length === 0 &&
	                flags.bigHour === undefined;
	        }

	        if (Object.isFrozen == null || !Object.isFrozen(m)) {
	            m._isValid = isNowValid;
	        }
	        else {
	            return isNowValid;
	        }
	    }
	    return m._isValid;
	}

	function createInvalid (flags) {
	    var m = createUTC(NaN);
	    if (flags != null) {
	        extend(getParsingFlags(m), flags);
	    }
	    else {
	        getParsingFlags(m).userInvalidated = true;
	    }

	    return m;
	}

	function isUndefined(input) {
	    return input === void 0;
	}

	// Plugins that add properties should also add the key here (null value),
	// so we can properly clone ourselves.
	var momentProperties = hooks.momentProperties = [];

	function copyConfig(to, from) {
	    var i, prop, val;

	    if (!isUndefined(from._isAMomentObject)) {
	        to._isAMomentObject = from._isAMomentObject;
	    }
	    if (!isUndefined(from._i)) {
	        to._i = from._i;
	    }
	    if (!isUndefined(from._f)) {
	        to._f = from._f;
	    }
	    if (!isUndefined(from._l)) {
	        to._l = from._l;
	    }
	    if (!isUndefined(from._strict)) {
	        to._strict = from._strict;
	    }
	    if (!isUndefined(from._tzm)) {
	        to._tzm = from._tzm;
	    }
	    if (!isUndefined(from._isUTC)) {
	        to._isUTC = from._isUTC;
	    }
	    if (!isUndefined(from._offset)) {
	        to._offset = from._offset;
	    }
	    if (!isUndefined(from._pf)) {
	        to._pf = getParsingFlags(from);
	    }
	    if (!isUndefined(from._locale)) {
	        to._locale = from._locale;
	    }

	    if (momentProperties.length > 0) {
	        for (i in momentProperties) {
	            prop = momentProperties[i];
	            val = from[prop];
	            if (!isUndefined(val)) {
	                to[prop] = val;
	            }
	        }
	    }

	    return to;
	}

	var updateInProgress = false;

	// Moment prototype object
	function Moment(config) {
	    copyConfig(this, config);
	    this._d = new Date(config._d != null ? config._d.getTime() : NaN);
	    if (!this.isValid()) {
	        this._d = new Date(NaN);
	    }
	    // Prevent infinite loop in case updateOffset creates new moment
	    // objects.
	    if (updateInProgress === false) {
	        updateInProgress = true;
	        hooks.updateOffset(this);
	        updateInProgress = false;
	    }
	}

	function isMoment (obj) {
	    return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
	}

	function absFloor (number) {
	    if (number < 0) {
	        // -0 -> 0
	        return Math.ceil(number) || 0;
	    } else {
	        return Math.floor(number);
	    }
	}

	function toInt(argumentForCoercion) {
	    var coercedNumber = +argumentForCoercion,
	        value = 0;

	    if (coercedNumber !== 0 && isFinite(coercedNumber)) {
	        value = absFloor(coercedNumber);
	    }

	    return value;
	}

	// compare two arrays, return the number of differences
	function compareArrays(array1, array2, dontConvert) {
	    var len = Math.min(array1.length, array2.length),
	        lengthDiff = Math.abs(array1.length - array2.length),
	        diffs = 0,
	        i;
	    for (i = 0; i < len; i++) {
	        if ((dontConvert && array1[i] !== array2[i]) ||
	            (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
	            diffs++;
	        }
	    }
	    return diffs + lengthDiff;
	}

	function warn(msg) {
	    if (hooks.suppressDeprecationWarnings === false &&
	            (typeof console !==  'undefined') && console.warn) {
	        console.warn('Deprecation warning: ' + msg);
	    }
	}

	function deprecate(msg, fn) {
	    var firstTime = true;

	    return extend(function () {
	        if (hooks.deprecationHandler != null) {
	            hooks.deprecationHandler(null, msg);
	        }
	        if (firstTime) {
	            var args = [];
	            var arg;
	            for (var i = 0; i < arguments.length; i++) {
	                arg = '';
	                if (typeof arguments[i] === 'object') {
	                    arg += '\n[' + i + '] ';
	                    for (var key in arguments[0]) {
	                        arg += key + ': ' + arguments[0][key] + ', ';
	                    }
	                    arg = arg.slice(0, -2); // Remove trailing comma and space
	                } else {
	                    arg = arguments[i];
	                }
	                args.push(arg);
	            }
	            warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
	            firstTime = false;
	        }
	        return fn.apply(this, arguments);
	    }, fn);
	}

	var deprecations = {};

	function deprecateSimple(name, msg) {
	    if (hooks.deprecationHandler != null) {
	        hooks.deprecationHandler(name, msg);
	    }
	    if (!deprecations[name]) {
	        warn(msg);
	        deprecations[name] = true;
	    }
	}

	hooks.suppressDeprecationWarnings = false;
	hooks.deprecationHandler = null;

	function isFunction(input) {
	    return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
	}

	function set (config) {
	    var prop, i;
	    for (i in config) {
	        prop = config[i];
	        if (isFunction(prop)) {
	            this[i] = prop;
	        } else {
	            this['_' + i] = prop;
	        }
	    }
	    this._config = config;
	    // Lenient ordinal parsing accepts just a number in addition to
	    // number + (possibly) stuff coming from _ordinalParseLenient.
	    this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);
	}

	function mergeConfigs(parentConfig, childConfig) {
	    var res = extend({}, parentConfig), prop;
	    for (prop in childConfig) {
	        if (hasOwnProp(childConfig, prop)) {
	            if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
	                res[prop] = {};
	                extend(res[prop], parentConfig[prop]);
	                extend(res[prop], childConfig[prop]);
	            } else if (childConfig[prop] != null) {
	                res[prop] = childConfig[prop];
	            } else {
	                delete res[prop];
	            }
	        }
	    }
	    for (prop in parentConfig) {
	        if (hasOwnProp(parentConfig, prop) &&
	                !hasOwnProp(childConfig, prop) &&
	                isObject(parentConfig[prop])) {
	            // make sure changes to properties don't modify parent config
	            res[prop] = extend({}, res[prop]);
	        }
	    }
	    return res;
	}

	function Locale(config) {
	    if (config != null) {
	        this.set(config);
	    }
	}

	var keys;

	if (Object.keys) {
	    keys = Object.keys;
	} else {
	    keys = function (obj) {
	        var i, res = [];
	        for (i in obj) {
	            if (hasOwnProp(obj, i)) {
	                res.push(i);
	            }
	        }
	        return res;
	    };
	}

	var keys$1 = keys;

	var defaultCalendar = {
	    sameDay : '[Today at] LT',
	    nextDay : '[Tomorrow at] LT',
	    nextWeek : 'dddd [at] LT',
	    lastDay : '[Yesterday at] LT',
	    lastWeek : '[Last] dddd [at] LT',
	    sameElse : 'L'
	};

	function calendar (key, mom, now) {
	    var output = this._calendar[key] || this._calendar['sameElse'];
	    return isFunction(output) ? output.call(mom, now) : output;
	}

	var defaultLongDateFormat = {
	    LTS  : 'h:mm:ss A',
	    LT   : 'h:mm A',
	    L    : 'MM/DD/YYYY',
	    LL   : 'MMMM D, YYYY',
	    LLL  : 'MMMM D, YYYY h:mm A',
	    LLLL : 'dddd, MMMM D, YYYY h:mm A'
	};

	function longDateFormat (key) {
	    var format = this._longDateFormat[key],
	        formatUpper = this._longDateFormat[key.toUpperCase()];

	    if (format || !formatUpper) {
	        return format;
	    }

	    this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
	        return val.slice(1);
	    });

	    return this._longDateFormat[key];
	}

	var defaultInvalidDate = 'Invalid date';

	function invalidDate () {
	    return this._invalidDate;
	}

	var defaultOrdinal = '%d';
	var defaultOrdinalParse = /\d{1,2}/;

	function ordinal (number) {
	    return this._ordinal.replace('%d', number);
	}

	var defaultRelativeTime = {
	    future : 'in %s',
	    past   : '%s ago',
	    s  : 'a few seconds',
	    m  : 'a minute',
	    mm : '%d minutes',
	    h  : 'an hour',
	    hh : '%d hours',
	    d  : 'a day',
	    dd : '%d days',
	    M  : 'a month',
	    MM : '%d months',
	    y  : 'a year',
	    yy : '%d years'
	};

	function relativeTime (number, withoutSuffix, string, isFuture) {
	    var output = this._relativeTime[string];
	    return (isFunction(output)) ?
	        output(number, withoutSuffix, string, isFuture) :
	        output.replace(/%d/i, number);
	}

	function pastFuture (diff, output) {
	    var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
	    return isFunction(format) ? format(output) : format.replace(/%s/i, output);
	}

	var aliases = {};

	function addUnitAlias (unit, shorthand) {
	    var lowerCase = unit.toLowerCase();
	    aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
	}

	function normalizeUnits(units) {
	    return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
	}

	function normalizeObjectUnits(inputObject) {
	    var normalizedInput = {},
	        normalizedProp,
	        prop;

	    for (prop in inputObject) {
	        if (hasOwnProp(inputObject, prop)) {
	            normalizedProp = normalizeUnits(prop);
	            if (normalizedProp) {
	                normalizedInput[normalizedProp] = inputObject[prop];
	            }
	        }
	    }

	    return normalizedInput;
	}

	var priorities = {};

	function addUnitPriority(unit, priority) {
	    priorities[unit] = priority;
	}

	function getPrioritizedUnits(unitsObj) {
	    var units = [];
	    for (var u in unitsObj) {
	        units.push({unit: u, priority: priorities[u]});
	    }
	    units.sort(function (a, b) {
	        return a.priority - b.priority;
	    });
	    return units;
	}

	function makeGetSet (unit, keepTime) {
	    return function (value) {
	        if (value != null) {
	            set$1(this, unit, value);
	            hooks.updateOffset(this, keepTime);
	            return this;
	        } else {
	            return get(this, unit);
	        }
	    };
	}

	function get (mom, unit) {
	    return mom.isValid() ?
	        mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
	}

	function set$1 (mom, unit, value) {
	    if (mom.isValid()) {
	        mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
	    }
	}

	// MOMENTS

	function stringGet (units) {
	    units = normalizeUnits(units);
	    if (isFunction(this[units])) {
	        return this[units]();
	    }
	    return this;
	}


	function stringSet (units, value) {
	    if (typeof units === 'object') {
	        units = normalizeObjectUnits(units);
	        var prioritized = getPrioritizedUnits(units);
	        for (var i = 0; i < prioritized.length; i++) {
	            this[prioritized[i].unit](units[prioritized[i].unit]);
	        }
	    } else {
	        units = normalizeUnits(units);
	        if (isFunction(this[units])) {
	            return this[units](value);
	        }
	    }
	    return this;
	}

	function zeroFill(number, targetLength, forceSign) {
	    var absNumber = '' + Math.abs(number),
	        zerosToFill = targetLength - absNumber.length,
	        sign = number >= 0;
	    return (sign ? (forceSign ? '+' : '') : '-') +
	        Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
	}

	var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

	var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

	var formatFunctions = {};

	var formatTokenFunctions = {};

	// token:    'M'
	// padded:   ['MM', 2]
	// ordinal:  'Mo'
	// callback: function () { this.month() + 1 }
	function addFormatToken (token, padded, ordinal, callback) {
	    var func = callback;
	    if (typeof callback === 'string') {
	        func = function () {
	            return this[callback]();
	        };
	    }
	    if (token) {
	        formatTokenFunctions[token] = func;
	    }
	    if (padded) {
	        formatTokenFunctions[padded[0]] = function () {
	            return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
	        };
	    }
	    if (ordinal) {
	        formatTokenFunctions[ordinal] = function () {
	            return this.localeData().ordinal(func.apply(this, arguments), token);
	        };
	    }
	}

	function removeFormattingTokens(input) {
	    if (input.match(/\[[\s\S]/)) {
	        return input.replace(/^\[|\]$/g, '');
	    }
	    return input.replace(/\\/g, '');
	}

	function makeFormatFunction(format) {
	    var array = format.match(formattingTokens), i, length;

	    for (i = 0, length = array.length; i < length; i++) {
	        if (formatTokenFunctions[array[i]]) {
	            array[i] = formatTokenFunctions[array[i]];
	        } else {
	            array[i] = removeFormattingTokens(array[i]);
	        }
	    }

	    return function (mom) {
	        var output = '', i;
	        for (i = 0; i < length; i++) {
	            output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
	        }
	        return output;
	    };
	}

	// format date using native date object
	function formatMoment(m, format) {
	    if (!m.isValid()) {
	        return m.localeData().invalidDate();
	    }

	    format = expandFormat(format, m.localeData());
	    formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

	    return formatFunctions[format](m);
	}

	function expandFormat(format, locale) {
	    var i = 5;

	    function replaceLongDateFormatTokens(input) {
	        return locale.longDateFormat(input) || input;
	    }

	    localFormattingTokens.lastIndex = 0;
	    while (i >= 0 && localFormattingTokens.test(format)) {
	        format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
	        localFormattingTokens.lastIndex = 0;
	        i -= 1;
	    }

	    return format;
	}

	var match1         = /\d/;            //       0 - 9
	var match2         = /\d\d/;          //      00 - 99
	var match3         = /\d{3}/;         //     000 - 999
	var match4         = /\d{4}/;         //    0000 - 9999
	var match6         = /[+-]?\d{6}/;    // -999999 - 999999
	var match1to2      = /\d\d?/;         //       0 - 99
	var match3to4      = /\d\d\d\d?/;     //     999 - 9999
	var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
	var match1to3      = /\d{1,3}/;       //       0 - 999
	var match1to4      = /\d{1,4}/;       //       0 - 9999
	var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

	var matchUnsigned  = /\d+/;           //       0 - inf
	var matchSigned    = /[+-]?\d+/;      //    -inf - inf

	var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
	var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

	var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

	// any word (or two) characters or numbers including two/three word month in arabic.
	// includes scottish gaelic two word and hyphenated months
	var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;


	var regexes = {};

	function addRegexToken (token, regex, strictRegex) {
	    regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
	        return (isStrict && strictRegex) ? strictRegex : regex;
	    };
	}

	function getParseRegexForToken (token, config) {
	    if (!hasOwnProp(regexes, token)) {
	        return new RegExp(unescapeFormat(token));
	    }

	    return regexes[token](config._strict, config._locale);
	}

	// Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
	function unescapeFormat(s) {
	    return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
	        return p1 || p2 || p3 || p4;
	    }));
	}

	function regexEscape(s) {
	    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	}

	var tokens = {};

	function addParseToken (token, callback) {
	    var i, func = callback;
	    if (typeof token === 'string') {
	        token = [token];
	    }
	    if (isNumber(callback)) {
	        func = function (input, array) {
	            array[callback] = toInt(input);
	        };
	    }
	    for (i = 0; i < token.length; i++) {
	        tokens[token[i]] = func;
	    }
	}

	function addWeekParseToken (token, callback) {
	    addParseToken(token, function (input, array, config, token) {
	        config._w = config._w || {};
	        callback(input, config._w, config, token);
	    });
	}

	function addTimeToArrayFromToken(token, input, config) {
	    if (input != null && hasOwnProp(tokens, token)) {
	        tokens[token](input, config._a, config, token);
	    }
	}

	var YEAR = 0;
	var MONTH = 1;
	var DATE = 2;
	var HOUR = 3;
	var MINUTE = 4;
	var SECOND = 5;
	var MILLISECOND = 6;
	var WEEK = 7;
	var WEEKDAY = 8;

	var indexOf;

	if (Array.prototype.indexOf) {
	    indexOf = Array.prototype.indexOf;
	} else {
	    indexOf = function (o) {
	        // I know
	        var i;
	        for (i = 0; i < this.length; ++i) {
	            if (this[i] === o) {
	                return i;
	            }
	        }
	        return -1;
	    };
	}

	var indexOf$1 = indexOf;

	function daysInMonth(year, month) {
	    return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
	}

	// FORMATTING

	addFormatToken('M', ['MM', 2], 'Mo', function () {
	    return this.month() + 1;
	});

	addFormatToken('MMM', 0, 0, function (format) {
	    return this.localeData().monthsShort(this, format);
	});

	addFormatToken('MMMM', 0, 0, function (format) {
	    return this.localeData().months(this, format);
	});

	// ALIASES

	addUnitAlias('month', 'M');

	// PRIORITY

	addUnitPriority('month', 8);

	// PARSING

	addRegexToken('M',    match1to2);
	addRegexToken('MM',   match1to2, match2);
	addRegexToken('MMM',  function (isStrict, locale) {
	    return locale.monthsShortRegex(isStrict);
	});
	addRegexToken('MMMM', function (isStrict, locale) {
	    return locale.monthsRegex(isStrict);
	});

	addParseToken(['M', 'MM'], function (input, array) {
	    array[MONTH] = toInt(input) - 1;
	});

	addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
	    var month = config._locale.monthsParse(input, token, config._strict);
	    // if we didn't find a month name, mark the date as invalid.
	    if (month != null) {
	        array[MONTH] = month;
	    } else {
	        getParsingFlags(config).invalidMonth = input;
	    }
	});

	// LOCALES

	var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
	var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
	function localeMonths (m, format) {
	    if (!m) {
	        return this._months;
	    }
	    return isArray(this._months) ? this._months[m.month()] :
	        this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
	}

	var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
	function localeMonthsShort (m, format) {
	    if (!m) {
	        return this._monthsShort;
	    }
	    return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
	        this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
	}

	function handleStrictParse(monthName, format, strict) {
	    var i, ii, mom, llc = monthName.toLocaleLowerCase();
	    if (!this._monthsParse) {
	        // this is not used
	        this._monthsParse = [];
	        this._longMonthsParse = [];
	        this._shortMonthsParse = [];
	        for (i = 0; i < 12; ++i) {
	            mom = createUTC([2000, i]);
	            this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
	            this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
	        }
	    }

	    if (strict) {
	        if (format === 'MMM') {
	            ii = indexOf$1.call(this._shortMonthsParse, llc);
	            return ii !== -1 ? ii : null;
	        } else {
	            ii = indexOf$1.call(this._longMonthsParse, llc);
	            return ii !== -1 ? ii : null;
	        }
	    } else {
	        if (format === 'MMM') {
	            ii = indexOf$1.call(this._shortMonthsParse, llc);
	            if (ii !== -1) {
	                return ii;
	            }
	            ii = indexOf$1.call(this._longMonthsParse, llc);
	            return ii !== -1 ? ii : null;
	        } else {
	            ii = indexOf$1.call(this._longMonthsParse, llc);
	            if (ii !== -1) {
	                return ii;
	            }
	            ii = indexOf$1.call(this._shortMonthsParse, llc);
	            return ii !== -1 ? ii : null;
	        }
	    }
	}

	function localeMonthsParse (monthName, format, strict) {
	    var i, mom, regex;

	    if (this._monthsParseExact) {
	        return handleStrictParse.call(this, monthName, format, strict);
	    }

	    if (!this._monthsParse) {
	        this._monthsParse = [];
	        this._longMonthsParse = [];
	        this._shortMonthsParse = [];
	    }

	    // TODO: add sorting
	    // Sorting makes sure if one month (or abbr) is a prefix of another
	    // see sorting in computeMonthsParse
	    for (i = 0; i < 12; i++) {
	        // make the regex if we don't have it already
	        mom = createUTC([2000, i]);
	        if (strict && !this._longMonthsParse[i]) {
	            this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
	            this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
	        }
	        if (!strict && !this._monthsParse[i]) {
	            regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
	            this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
	        }
	        // test the regex
	        if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
	            return i;
	        } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
	            return i;
	        } else if (!strict && this._monthsParse[i].test(monthName)) {
	            return i;
	        }
	    }
	}

	// MOMENTS

	function setMonth (mom, value) {
	    var dayOfMonth;

	    if (!mom.isValid()) {
	        // No op
	        return mom;
	    }

	    if (typeof value === 'string') {
	        if (/^\d+$/.test(value)) {
	            value = toInt(value);
	        } else {
	            value = mom.localeData().monthsParse(value);
	            // TODO: Another silent failure?
	            if (!isNumber(value)) {
	                return mom;
	            }
	        }
	    }

	    dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
	    mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
	    return mom;
	}

	function getSetMonth (value) {
	    if (value != null) {
	        setMonth(this, value);
	        hooks.updateOffset(this, true);
	        return this;
	    } else {
	        return get(this, 'Month');
	    }
	}

	function getDaysInMonth () {
	    return daysInMonth(this.year(), this.month());
	}

	var defaultMonthsShortRegex = matchWord;
	function monthsShortRegex (isStrict) {
	    if (this._monthsParseExact) {
	        if (!hasOwnProp(this, '_monthsRegex')) {
	            computeMonthsParse.call(this);
	        }
	        if (isStrict) {
	            return this._monthsShortStrictRegex;
	        } else {
	            return this._monthsShortRegex;
	        }
	    } else {
	        if (!hasOwnProp(this, '_monthsShortRegex')) {
	            this._monthsShortRegex = defaultMonthsShortRegex;
	        }
	        return this._monthsShortStrictRegex && isStrict ?
	            this._monthsShortStrictRegex : this._monthsShortRegex;
	    }
	}

	var defaultMonthsRegex = matchWord;
	function monthsRegex (isStrict) {
	    if (this._monthsParseExact) {
	        if (!hasOwnProp(this, '_monthsRegex')) {
	            computeMonthsParse.call(this);
	        }
	        if (isStrict) {
	            return this._monthsStrictRegex;
	        } else {
	            return this._monthsRegex;
	        }
	    } else {
	        if (!hasOwnProp(this, '_monthsRegex')) {
	            this._monthsRegex = defaultMonthsRegex;
	        }
	        return this._monthsStrictRegex && isStrict ?
	            this._monthsStrictRegex : this._monthsRegex;
	    }
	}

	function computeMonthsParse () {
	    function cmpLenRev(a, b) {
	        return b.length - a.length;
	    }

	    var shortPieces = [], longPieces = [], mixedPieces = [],
	        i, mom;
	    for (i = 0; i < 12; i++) {
	        // make the regex if we don't have it already
	        mom = createUTC([2000, i]);
	        shortPieces.push(this.monthsShort(mom, ''));
	        longPieces.push(this.months(mom, ''));
	        mixedPieces.push(this.months(mom, ''));
	        mixedPieces.push(this.monthsShort(mom, ''));
	    }
	    // Sorting makes sure if one month (or abbr) is a prefix of another it
	    // will match the longer piece.
	    shortPieces.sort(cmpLenRev);
	    longPieces.sort(cmpLenRev);
	    mixedPieces.sort(cmpLenRev);
	    for (i = 0; i < 12; i++) {
	        shortPieces[i] = regexEscape(shortPieces[i]);
	        longPieces[i] = regexEscape(longPieces[i]);
	    }
	    for (i = 0; i < 24; i++) {
	        mixedPieces[i] = regexEscape(mixedPieces[i]);
	    }

	    this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
	    this._monthsShortRegex = this._monthsRegex;
	    this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
	    this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
	}

	// FORMATTING

	addFormatToken('Y', 0, 0, function () {
	    var y = this.year();
	    return y <= 9999 ? '' + y : '+' + y;
	});

	addFormatToken(0, ['YY', 2], 0, function () {
	    return this.year() % 100;
	});

	addFormatToken(0, ['YYYY',   4],       0, 'year');
	addFormatToken(0, ['YYYYY',  5],       0, 'year');
	addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

	// ALIASES

	addUnitAlias('year', 'y');

	// PRIORITIES

	addUnitPriority('year', 1);

	// PARSING

	addRegexToken('Y',      matchSigned);
	addRegexToken('YY',     match1to2, match2);
	addRegexToken('YYYY',   match1to4, match4);
	addRegexToken('YYYYY',  match1to6, match6);
	addRegexToken('YYYYYY', match1to6, match6);

	addParseToken(['YYYYY', 'YYYYYY'], YEAR);
	addParseToken('YYYY', function (input, array) {
	    array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
	});
	addParseToken('YY', function (input, array) {
	    array[YEAR] = hooks.parseTwoDigitYear(input);
	});
	addParseToken('Y', function (input, array) {
	    array[YEAR] = parseInt(input, 10);
	});

	// HELPERS

	function daysInYear(year) {
	    return isLeapYear(year) ? 366 : 365;
	}

	function isLeapYear(year) {
	    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
	}

	// HOOKS

	hooks.parseTwoDigitYear = function (input) {
	    return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
	};

	// MOMENTS

	var getSetYear = makeGetSet('FullYear', true);

	function getIsLeapYear () {
	    return isLeapYear(this.year());
	}

	function createDate (y, m, d, h, M, s, ms) {
	    //can't just apply() to create a date:
	    //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
	    var date = new Date(y, m, d, h, M, s, ms);

	    //the date constructor remaps years 0-99 to 1900-1999
	    if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
	        date.setFullYear(y);
	    }
	    return date;
	}

	function createUTCDate (y) {
	    var date = new Date(Date.UTC.apply(null, arguments));

	    //the Date.UTC function remaps years 0-99 to 1900-1999
	    if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
	        date.setUTCFullYear(y);
	    }
	    return date;
	}

	// start-of-first-week - start-of-year
	function firstWeekOffset(year, dow, doy) {
	    var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
	        fwd = 7 + dow - doy,
	        // first-week day local weekday -- which local weekday is fwd
	        fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

	    return -fwdlw + fwd - 1;
	}

	//http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
	function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
	    var localWeekday = (7 + weekday - dow) % 7,
	        weekOffset = firstWeekOffset(year, dow, doy),
	        dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
	        resYear, resDayOfYear;

	    if (dayOfYear <= 0) {
	        resYear = year - 1;
	        resDayOfYear = daysInYear(resYear) + dayOfYear;
	    } else if (dayOfYear > daysInYear(year)) {
	        resYear = year + 1;
	        resDayOfYear = dayOfYear - daysInYear(year);
	    } else {
	        resYear = year;
	        resDayOfYear = dayOfYear;
	    }

	    return {
	        year: resYear,
	        dayOfYear: resDayOfYear
	    };
	}

	function weekOfYear(mom, dow, doy) {
	    var weekOffset = firstWeekOffset(mom.year(), dow, doy),
	        week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
	        resWeek, resYear;

	    if (week < 1) {
	        resYear = mom.year() - 1;
	        resWeek = week + weeksInYear(resYear, dow, doy);
	    } else if (week > weeksInYear(mom.year(), dow, doy)) {
	        resWeek = week - weeksInYear(mom.year(), dow, doy);
	        resYear = mom.year() + 1;
	    } else {
	        resYear = mom.year();
	        resWeek = week;
	    }

	    return {
	        week: resWeek,
	        year: resYear
	    };
	}

	function weeksInYear(year, dow, doy) {
	    var weekOffset = firstWeekOffset(year, dow, doy),
	        weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
	    return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
	}

	// FORMATTING

	addFormatToken('w', ['ww', 2], 'wo', 'week');
	addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

	// ALIASES

	addUnitAlias('week', 'w');
	addUnitAlias('isoWeek', 'W');

	// PRIORITIES

	addUnitPriority('week', 5);
	addUnitPriority('isoWeek', 5);

	// PARSING

	addRegexToken('w',  match1to2);
	addRegexToken('ww', match1to2, match2);
	addRegexToken('W',  match1to2);
	addRegexToken('WW', match1to2, match2);

	addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
	    week[token.substr(0, 1)] = toInt(input);
	});

	// HELPERS

	// LOCALES

	function localeWeek (mom) {
	    return weekOfYear(mom, this._week.dow, this._week.doy).week;
	}

	var defaultLocaleWeek = {
	    dow : 0, // Sunday is the first day of the week.
	    doy : 6  // The week that contains Jan 1st is the first week of the year.
	};

	function localeFirstDayOfWeek () {
	    return this._week.dow;
	}

	function localeFirstDayOfYear () {
	    return this._week.doy;
	}

	// MOMENTS

	function getSetWeek (input) {
	    var week = this.localeData().week(this);
	    return input == null ? week : this.add((input - week) * 7, 'd');
	}

	function getSetISOWeek (input) {
	    var week = weekOfYear(this, 1, 4).week;
	    return input == null ? week : this.add((input - week) * 7, 'd');
	}

	// FORMATTING

	addFormatToken('d', 0, 'do', 'day');

	addFormatToken('dd', 0, 0, function (format) {
	    return this.localeData().weekdaysMin(this, format);
	});

	addFormatToken('ddd', 0, 0, function (format) {
	    return this.localeData().weekdaysShort(this, format);
	});

	addFormatToken('dddd', 0, 0, function (format) {
	    return this.localeData().weekdays(this, format);
	});

	addFormatToken('e', 0, 0, 'weekday');
	addFormatToken('E', 0, 0, 'isoWeekday');

	// ALIASES

	addUnitAlias('day', 'd');
	addUnitAlias('weekday', 'e');
	addUnitAlias('isoWeekday', 'E');

	// PRIORITY
	addUnitPriority('day', 11);
	addUnitPriority('weekday', 11);
	addUnitPriority('isoWeekday', 11);

	// PARSING

	addRegexToken('d',    match1to2);
	addRegexToken('e',    match1to2);
	addRegexToken('E',    match1to2);
	addRegexToken('dd',   function (isStrict, locale) {
	    return locale.weekdaysMinRegex(isStrict);
	});
	addRegexToken('ddd',   function (isStrict, locale) {
	    return locale.weekdaysShortRegex(isStrict);
	});
	addRegexToken('dddd',   function (isStrict, locale) {
	    return locale.weekdaysRegex(isStrict);
	});

	addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
	    var weekday = config._locale.weekdaysParse(input, token, config._strict);
	    // if we didn't get a weekday name, mark the date as invalid
	    if (weekday != null) {
	        week.d = weekday;
	    } else {
	        getParsingFlags(config).invalidWeekday = input;
	    }
	});

	addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
	    week[token] = toInt(input);
	});

	// HELPERS

	function parseWeekday(input, locale) {
	    if (typeof input !== 'string') {
	        return input;
	    }

	    if (!isNaN(input)) {
	        return parseInt(input, 10);
	    }

	    input = locale.weekdaysParse(input);
	    if (typeof input === 'number') {
	        return input;
	    }

	    return null;
	}

	function parseIsoWeekday(input, locale) {
	    if (typeof input === 'string') {
	        return locale.weekdaysParse(input) % 7 || 7;
	    }
	    return isNaN(input) ? null : input;
	}

	// LOCALES

	var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
	function localeWeekdays (m, format) {
	    if (!m) {
	        return this._weekdays;
	    }
	    return isArray(this._weekdays) ? this._weekdays[m.day()] :
	        this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
	}

	var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
	function localeWeekdaysShort (m) {
	    return (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
	}

	var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
	function localeWeekdaysMin (m) {
	    return (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
	}

	function handleStrictParse$1(weekdayName, format, strict) {
	    var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
	    if (!this._weekdaysParse) {
	        this._weekdaysParse = [];
	        this._shortWeekdaysParse = [];
	        this._minWeekdaysParse = [];

	        for (i = 0; i < 7; ++i) {
	            mom = createUTC([2000, 1]).day(i);
	            this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
	            this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
	            this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
	        }
	    }

	    if (strict) {
	        if (format === 'dddd') {
	            ii = indexOf$1.call(this._weekdaysParse, llc);
	            return ii !== -1 ? ii : null;
	        } else if (format === 'ddd') {
	            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
	            return ii !== -1 ? ii : null;
	        } else {
	            ii = indexOf$1.call(this._minWeekdaysParse, llc);
	            return ii !== -1 ? ii : null;
	        }
	    } else {
	        if (format === 'dddd') {
	            ii = indexOf$1.call(this._weekdaysParse, llc);
	            if (ii !== -1) {
	                return ii;
	            }
	            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
	            if (ii !== -1) {
	                return ii;
	            }
	            ii = indexOf$1.call(this._minWeekdaysParse, llc);
	            return ii !== -1 ? ii : null;
	        } else if (format === 'ddd') {
	            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
	            if (ii !== -1) {
	                return ii;
	            }
	            ii = indexOf$1.call(this._weekdaysParse, llc);
	            if (ii !== -1) {
	                return ii;
	            }
	            ii = indexOf$1.call(this._minWeekdaysParse, llc);
	            return ii !== -1 ? ii : null;
	        } else {
	            ii = indexOf$1.call(this._minWeekdaysParse, llc);
	            if (ii !== -1) {
	                return ii;
	            }
	            ii = indexOf$1.call(this._weekdaysParse, llc);
	            if (ii !== -1) {
	                return ii;
	            }
	            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
	            return ii !== -1 ? ii : null;
	        }
	    }
	}

	function localeWeekdaysParse (weekdayName, format, strict) {
	    var i, mom, regex;

	    if (this._weekdaysParseExact) {
	        return handleStrictParse$1.call(this, weekdayName, format, strict);
	    }

	    if (!this._weekdaysParse) {
	        this._weekdaysParse = [];
	        this._minWeekdaysParse = [];
	        this._shortWeekdaysParse = [];
	        this._fullWeekdaysParse = [];
	    }

	    for (i = 0; i < 7; i++) {
	        // make the regex if we don't have it already

	        mom = createUTC([2000, 1]).day(i);
	        if (strict && !this._fullWeekdaysParse[i]) {
	            this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
	            this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
	            this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
	        }
	        if (!this._weekdaysParse[i]) {
	            regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
	            this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
	        }
	        // test the regex
	        if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
	            return i;
	        } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
	            return i;
	        } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
	            return i;
	        } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
	            return i;
	        }
	    }
	}

	// MOMENTS

	function getSetDayOfWeek (input) {
	    if (!this.isValid()) {
	        return input != null ? this : NaN;
	    }
	    var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
	    if (input != null) {
	        input = parseWeekday(input, this.localeData());
	        return this.add(input - day, 'd');
	    } else {
	        return day;
	    }
	}

	function getSetLocaleDayOfWeek (input) {
	    if (!this.isValid()) {
	        return input != null ? this : NaN;
	    }
	    var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
	    return input == null ? weekday : this.add(input - weekday, 'd');
	}

	function getSetISODayOfWeek (input) {
	    if (!this.isValid()) {
	        return input != null ? this : NaN;
	    }

	    // behaves the same as moment#day except
	    // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
	    // as a setter, sunday should belong to the previous week.

	    if (input != null) {
	        var weekday = parseIsoWeekday(input, this.localeData());
	        return this.day(this.day() % 7 ? weekday : weekday - 7);
	    } else {
	        return this.day() || 7;
	    }
	}

	var defaultWeekdaysRegex = matchWord;
	function weekdaysRegex (isStrict) {
	    if (this._weekdaysParseExact) {
	        if (!hasOwnProp(this, '_weekdaysRegex')) {
	            computeWeekdaysParse.call(this);
	        }
	        if (isStrict) {
	            return this._weekdaysStrictRegex;
	        } else {
	            return this._weekdaysRegex;
	        }
	    } else {
	        if (!hasOwnProp(this, '_weekdaysRegex')) {
	            this._weekdaysRegex = defaultWeekdaysRegex;
	        }
	        return this._weekdaysStrictRegex && isStrict ?
	            this._weekdaysStrictRegex : this._weekdaysRegex;
	    }
	}

	var defaultWeekdaysShortRegex = matchWord;
	function weekdaysShortRegex (isStrict) {
	    if (this._weekdaysParseExact) {
	        if (!hasOwnProp(this, '_weekdaysRegex')) {
	            computeWeekdaysParse.call(this);
	        }
	        if (isStrict) {
	            return this._weekdaysShortStrictRegex;
	        } else {
	            return this._weekdaysShortRegex;
	        }
	    } else {
	        if (!hasOwnProp(this, '_weekdaysShortRegex')) {
	            this._weekdaysShortRegex = defaultWeekdaysShortRegex;
	        }
	        return this._weekdaysShortStrictRegex && isStrict ?
	            this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
	    }
	}

	var defaultWeekdaysMinRegex = matchWord;
	function weekdaysMinRegex (isStrict) {
	    if (this._weekdaysParseExact) {
	        if (!hasOwnProp(this, '_weekdaysRegex')) {
	            computeWeekdaysParse.call(this);
	        }
	        if (isStrict) {
	            return this._weekdaysMinStrictRegex;
	        } else {
	            return this._weekdaysMinRegex;
	        }
	    } else {
	        if (!hasOwnProp(this, '_weekdaysMinRegex')) {
	            this._weekdaysMinRegex = defaultWeekdaysMinRegex;
	        }
	        return this._weekdaysMinStrictRegex && isStrict ?
	            this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
	    }
	}


	function computeWeekdaysParse () {
	    function cmpLenRev(a, b) {
	        return b.length - a.length;
	    }

	    var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
	        i, mom, minp, shortp, longp;
	    for (i = 0; i < 7; i++) {
	        // make the regex if we don't have it already
	        mom = createUTC([2000, 1]).day(i);
	        minp = this.weekdaysMin(mom, '');
	        shortp = this.weekdaysShort(mom, '');
	        longp = this.weekdays(mom, '');
	        minPieces.push(minp);
	        shortPieces.push(shortp);
	        longPieces.push(longp);
	        mixedPieces.push(minp);
	        mixedPieces.push(shortp);
	        mixedPieces.push(longp);
	    }
	    // Sorting makes sure if one weekday (or abbr) is a prefix of another it
	    // will match the longer piece.
	    minPieces.sort(cmpLenRev);
	    shortPieces.sort(cmpLenRev);
	    longPieces.sort(cmpLenRev);
	    mixedPieces.sort(cmpLenRev);
	    for (i = 0; i < 7; i++) {
	        shortPieces[i] = regexEscape(shortPieces[i]);
	        longPieces[i] = regexEscape(longPieces[i]);
	        mixedPieces[i] = regexEscape(mixedPieces[i]);
	    }

	    this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
	    this._weekdaysShortRegex = this._weekdaysRegex;
	    this._weekdaysMinRegex = this._weekdaysRegex;

	    this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
	    this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
	    this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
	}

	// FORMATTING

	function hFormat() {
	    return this.hours() % 12 || 12;
	}

	function kFormat() {
	    return this.hours() || 24;
	}

	addFormatToken('H', ['HH', 2], 0, 'hour');
	addFormatToken('h', ['hh', 2], 0, hFormat);
	addFormatToken('k', ['kk', 2], 0, kFormat);

	addFormatToken('hmm', 0, 0, function () {
	    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
	});

	addFormatToken('hmmss', 0, 0, function () {
	    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
	        zeroFill(this.seconds(), 2);
	});

	addFormatToken('Hmm', 0, 0, function () {
	    return '' + this.hours() + zeroFill(this.minutes(), 2);
	});

	addFormatToken('Hmmss', 0, 0, function () {
	    return '' + this.hours() + zeroFill(this.minutes(), 2) +
	        zeroFill(this.seconds(), 2);
	});

	function meridiem (token, lowercase) {
	    addFormatToken(token, 0, 0, function () {
	        return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
	    });
	}

	meridiem('a', true);
	meridiem('A', false);

	// ALIASES

	addUnitAlias('hour', 'h');

	// PRIORITY
	addUnitPriority('hour', 13);

	// PARSING

	function matchMeridiem (isStrict, locale) {
	    return locale._meridiemParse;
	}

	addRegexToken('a',  matchMeridiem);
	addRegexToken('A',  matchMeridiem);
	addRegexToken('H',  match1to2);
	addRegexToken('h',  match1to2);
	addRegexToken('HH', match1to2, match2);
	addRegexToken('hh', match1to2, match2);

	addRegexToken('hmm', match3to4);
	addRegexToken('hmmss', match5to6);
	addRegexToken('Hmm', match3to4);
	addRegexToken('Hmmss', match5to6);

	addParseToken(['H', 'HH'], HOUR);
	addParseToken(['a', 'A'], function (input, array, config) {
	    config._isPm = config._locale.isPM(input);
	    config._meridiem = input;
	});
	addParseToken(['h', 'hh'], function (input, array, config) {
	    array[HOUR] = toInt(input);
	    getParsingFlags(config).bigHour = true;
	});
	addParseToken('hmm', function (input, array, config) {
	    var pos = input.length - 2;
	    array[HOUR] = toInt(input.substr(0, pos));
	    array[MINUTE] = toInt(input.substr(pos));
	    getParsingFlags(config).bigHour = true;
	});
	addParseToken('hmmss', function (input, array, config) {
	    var pos1 = input.length - 4;
	    var pos2 = input.length - 2;
	    array[HOUR] = toInt(input.substr(0, pos1));
	    array[MINUTE] = toInt(input.substr(pos1, 2));
	    array[SECOND] = toInt(input.substr(pos2));
	    getParsingFlags(config).bigHour = true;
	});
	addParseToken('Hmm', function (input, array, config) {
	    var pos = input.length - 2;
	    array[HOUR] = toInt(input.substr(0, pos));
	    array[MINUTE] = toInt(input.substr(pos));
	});
	addParseToken('Hmmss', function (input, array, config) {
	    var pos1 = input.length - 4;
	    var pos2 = input.length - 2;
	    array[HOUR] = toInt(input.substr(0, pos1));
	    array[MINUTE] = toInt(input.substr(pos1, 2));
	    array[SECOND] = toInt(input.substr(pos2));
	});

	// LOCALES

	function localeIsPM (input) {
	    // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
	    // Using charAt should be more compatible.
	    return ((input + '').toLowerCase().charAt(0) === 'p');
	}

	var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
	function localeMeridiem (hours, minutes, isLower) {
	    if (hours > 11) {
	        return isLower ? 'pm' : 'PM';
	    } else {
	        return isLower ? 'am' : 'AM';
	    }
	}


	// MOMENTS

	// Setting the hour should keep the time, because the user explicitly
	// specified which hour he wants. So trying to maintain the same hour (in
	// a new timezone) makes sense. Adding/subtracting hours does not follow
	// this rule.
	var getSetHour = makeGetSet('Hours', true);

	// months
	// week
	// weekdays
	// meridiem
	var baseConfig = {
	    calendar: defaultCalendar,
	    longDateFormat: defaultLongDateFormat,
	    invalidDate: defaultInvalidDate,
	    ordinal: defaultOrdinal,
	    ordinalParse: defaultOrdinalParse,
	    relativeTime: defaultRelativeTime,

	    months: defaultLocaleMonths,
	    monthsShort: defaultLocaleMonthsShort,

	    week: defaultLocaleWeek,

	    weekdays: defaultLocaleWeekdays,
	    weekdaysMin: defaultLocaleWeekdaysMin,
	    weekdaysShort: defaultLocaleWeekdaysShort,

	    meridiemParse: defaultLocaleMeridiemParse
	};

	// internal storage for locale config files
	var locales = {};
	var localeFamilies = {};
	var globalLocale;

	function normalizeLocale(key) {
	    return key ? key.toLowerCase().replace('_', '-') : key;
	}

	// pick the locale from the array
	// try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
	// substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
	function chooseLocale(names) {
	    var i = 0, j, next, locale, split;

	    while (i < names.length) {
	        split = normalizeLocale(names[i]).split('-');
	        j = split.length;
	        next = normalizeLocale(names[i + 1]);
	        next = next ? next.split('-') : null;
	        while (j > 0) {
	            locale = loadLocale(split.slice(0, j).join('-'));
	            if (locale) {
	                return locale;
	            }
	            if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
	                //the next array item is better than a shallower substring of this one
	                break;
	            }
	            j--;
	        }
	        i++;
	    }
	    return null;
	}

	function loadLocale(name) {
	    var oldLocale = null;
	    // TODO: Find a better way to register and load all the locales in Node
	    if (!locales[name] && (typeof module !== 'undefined') &&
	            module && module.exports) {
	        try {
	            oldLocale = globalLocale._abbr;
	            __webpack_require__(7)("./" + name);
	            // because defineLocale currently also sets the global locale, we
	            // want to undo that for lazy loaded locales
	            getSetGlobalLocale(oldLocale);
	        } catch (e) { }
	    }
	    return locales[name];
	}

	// This function will load locale and then set the global locale.  If
	// no arguments are passed in, it will simply return the current global
	// locale key.
	function getSetGlobalLocale (key, values) {
	    var data;
	    if (key) {
	        if (isUndefined(values)) {
	            data = getLocale(key);
	        }
	        else {
	            data = defineLocale(key, values);
	        }

	        if (data) {
	            // moment.duration._locale = moment._locale = data;
	            globalLocale = data;
	        }
	    }

	    return globalLocale._abbr;
	}

	function defineLocale (name, config) {
	    if (config !== null) {
	        var parentConfig = baseConfig;
	        config.abbr = name;
	        if (locales[name] != null) {
	            deprecateSimple('defineLocaleOverride',
	                    'use moment.updateLocale(localeName, config) to change ' +
	                    'an existing locale. moment.defineLocale(localeName, ' +
	                    'config) should only be used for creating a new locale ' +
	                    'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
	            parentConfig = locales[name]._config;
	        } else if (config.parentLocale != null) {
	            if (locales[config.parentLocale] != null) {
	                parentConfig = locales[config.parentLocale]._config;
	            } else {
	                if (!localeFamilies[config.parentLocale]) {
	                    localeFamilies[config.parentLocale] = [];
	                }
	                localeFamilies[config.parentLocale].push({
	                    name: name,
	                    config: config
	                });
	                return null;
	            }
	        }
	        locales[name] = new Locale(mergeConfigs(parentConfig, config));

	        if (localeFamilies[name]) {
	            localeFamilies[name].forEach(function (x) {
	                defineLocale(x.name, x.config);
	            });
	        }

	        // backwards compat for now: also set the locale
	        // make sure we set the locale AFTER all child locales have been
	        // created, so we won't end up with the child locale set.
	        getSetGlobalLocale(name);


	        return locales[name];
	    } else {
	        // useful for testing
	        delete locales[name];
	        return null;
	    }
	}

	function updateLocale(name, config) {
	    if (config != null) {
	        var locale, parentConfig = baseConfig;
	        // MERGE
	        if (locales[name] != null) {
	            parentConfig = locales[name]._config;
	        }
	        config = mergeConfigs(parentConfig, config);
	        locale = new Locale(config);
	        locale.parentLocale = locales[name];
	        locales[name] = locale;

	        // backwards compat for now: also set the locale
	        getSetGlobalLocale(name);
	    } else {
	        // pass null for config to unupdate, useful for tests
	        if (locales[name] != null) {
	            if (locales[name].parentLocale != null) {
	                locales[name] = locales[name].parentLocale;
	            } else if (locales[name] != null) {
	                delete locales[name];
	            }
	        }
	    }
	    return locales[name];
	}

	// returns locale data
	function getLocale (key) {
	    var locale;

	    if (key && key._locale && key._locale._abbr) {
	        key = key._locale._abbr;
	    }

	    if (!key) {
	        return globalLocale;
	    }

	    if (!isArray(key)) {
	        //short-circuit everything else
	        locale = loadLocale(key);
	        if (locale) {
	            return locale;
	        }
	        key = [key];
	    }

	    return chooseLocale(key);
	}

	function listLocales() {
	    return keys$1(locales);
	}

	function checkOverflow (m) {
	    var overflow;
	    var a = m._a;

	    if (a && getParsingFlags(m).overflow === -2) {
	        overflow =
	            a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
	            a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
	            a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
	            a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
	            a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
	            a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
	            -1;

	        if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
	            overflow = DATE;
	        }
	        if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
	            overflow = WEEK;
	        }
	        if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
	            overflow = WEEKDAY;
	        }

	        getParsingFlags(m).overflow = overflow;
	    }

	    return m;
	}

	// iso 8601 regex
	// 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
	var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
	var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

	var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

	var isoDates = [
	    ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
	    ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
	    ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
	    ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
	    ['YYYY-DDD', /\d{4}-\d{3}/],
	    ['YYYY-MM', /\d{4}-\d\d/, false],
	    ['YYYYYYMMDD', /[+-]\d{10}/],
	    ['YYYYMMDD', /\d{8}/],
	    // YYYYMM is NOT allowed by the standard
	    ['GGGG[W]WWE', /\d{4}W\d{3}/],
	    ['GGGG[W]WW', /\d{4}W\d{2}/, false],
	    ['YYYYDDD', /\d{7}/]
	];

	// iso time formats and regexes
	var isoTimes = [
	    ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
	    ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
	    ['HH:mm:ss', /\d\d:\d\d:\d\d/],
	    ['HH:mm', /\d\d:\d\d/],
	    ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
	    ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
	    ['HHmmss', /\d\d\d\d\d\d/],
	    ['HHmm', /\d\d\d\d/],
	    ['HH', /\d\d/]
	];

	var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

	// date from iso format
	function configFromISO(config) {
	    var i, l,
	        string = config._i,
	        match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
	        allowTime, dateFormat, timeFormat, tzFormat;

	    if (match) {
	        getParsingFlags(config).iso = true;

	        for (i = 0, l = isoDates.length; i < l; i++) {
	            if (isoDates[i][1].exec(match[1])) {
	                dateFormat = isoDates[i][0];
	                allowTime = isoDates[i][2] !== false;
	                break;
	            }
	        }
	        if (dateFormat == null) {
	            config._isValid = false;
	            return;
	        }
	        if (match[3]) {
	            for (i = 0, l = isoTimes.length; i < l; i++) {
	                if (isoTimes[i][1].exec(match[3])) {
	                    // match[2] should be 'T' or space
	                    timeFormat = (match[2] || ' ') + isoTimes[i][0];
	                    break;
	                }
	            }
	            if (timeFormat == null) {
	                config._isValid = false;
	                return;
	            }
	        }
	        if (!allowTime && timeFormat != null) {
	            config._isValid = false;
	            return;
	        }
	        if (match[4]) {
	            if (tzRegex.exec(match[4])) {
	                tzFormat = 'Z';
	            } else {
	                config._isValid = false;
	                return;
	            }
	        }
	        config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
	        configFromStringAndFormat(config);
	    } else {
	        config._isValid = false;
	    }
	}

	// date from iso format or fallback
	function configFromString(config) {
	    var matched = aspNetJsonRegex.exec(config._i);

	    if (matched !== null) {
	        config._d = new Date(+matched[1]);
	        return;
	    }

	    configFromISO(config);
	    if (config._isValid === false) {
	        delete config._isValid;
	        hooks.createFromInputFallback(config);
	    }
	}

	hooks.createFromInputFallback = deprecate(
	    'value provided is not in a recognized ISO format. moment construction falls back to js Date(), ' +
	    'which is not reliable across all browsers and versions. Non ISO date formats are ' +
	    'discouraged and will be removed in an upcoming major release. Please refer to ' +
	    'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
	    function (config) {
	        config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
	    }
	);

	// Pick the first defined of two or three arguments.
	function defaults(a, b, c) {
	    if (a != null) {
	        return a;
	    }
	    if (b != null) {
	        return b;
	    }
	    return c;
	}

	function currentDateArray(config) {
	    // hooks is actually the exported moment object
	    var nowValue = new Date(hooks.now());
	    if (config._useUTC) {
	        return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
	    }
	    return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
	}

	// convert an array to a date.
	// the array should mirror the parameters below
	// note: all values past the year are optional and will default to the lowest possible value.
	// [year, month, day , hour, minute, second, millisecond]
	function configFromArray (config) {
	    var i, date, input = [], currentDate, yearToUse;

	    if (config._d) {
	        return;
	    }

	    currentDate = currentDateArray(config);

	    //compute day of the year from weeks and weekdays
	    if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
	        dayOfYearFromWeekInfo(config);
	    }

	    //if the day of the year is set, figure out what it is
	    if (config._dayOfYear) {
	        yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

	        if (config._dayOfYear > daysInYear(yearToUse)) {
	            getParsingFlags(config)._overflowDayOfYear = true;
	        }

	        date = createUTCDate(yearToUse, 0, config._dayOfYear);
	        config._a[MONTH] = date.getUTCMonth();
	        config._a[DATE] = date.getUTCDate();
	    }

	    // Default to current date.
	    // * if no year, month, day of month are given, default to today
	    // * if day of month is given, default month and year
	    // * if month is given, default only year
	    // * if year is given, don't default anything
	    for (i = 0; i < 3 && config._a[i] == null; ++i) {
	        config._a[i] = input[i] = currentDate[i];
	    }

	    // Zero out whatever was not defaulted, including time
	    for (; i < 7; i++) {
	        config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
	    }

	    // Check for 24:00:00.000
	    if (config._a[HOUR] === 24 &&
	            config._a[MINUTE] === 0 &&
	            config._a[SECOND] === 0 &&
	            config._a[MILLISECOND] === 0) {
	        config._nextDay = true;
	        config._a[HOUR] = 0;
	    }

	    config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
	    // Apply timezone offset from input. The actual utcOffset can be changed
	    // with parseZone.
	    if (config._tzm != null) {
	        config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
	    }

	    if (config._nextDay) {
	        config._a[HOUR] = 24;
	    }
	}

	function dayOfYearFromWeekInfo(config) {
	    var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

	    w = config._w;
	    if (w.GG != null || w.W != null || w.E != null) {
	        dow = 1;
	        doy = 4;

	        // TODO: We need to take the current isoWeekYear, but that depends on
	        // how we interpret now (local, utc, fixed offset). So create
	        // a now version of current config (take local/utc/offset flags, and
	        // create now).
	        weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
	        week = defaults(w.W, 1);
	        weekday = defaults(w.E, 1);
	        if (weekday < 1 || weekday > 7) {
	            weekdayOverflow = true;
	        }
	    } else {
	        dow = config._locale._week.dow;
	        doy = config._locale._week.doy;

	        var curWeek = weekOfYear(createLocal(), dow, doy);

	        weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

	        // Default to current week.
	        week = defaults(w.w, curWeek.week);

	        if (w.d != null) {
	            // weekday -- low day numbers are considered next week
	            weekday = w.d;
	            if (weekday < 0 || weekday > 6) {
	                weekdayOverflow = true;
	            }
	        } else if (w.e != null) {
	            // local weekday -- counting starts from begining of week
	            weekday = w.e + dow;
	            if (w.e < 0 || w.e > 6) {
	                weekdayOverflow = true;
	            }
	        } else {
	            // default to begining of week
	            weekday = dow;
	        }
	    }
	    if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
	        getParsingFlags(config)._overflowWeeks = true;
	    } else if (weekdayOverflow != null) {
	        getParsingFlags(config)._overflowWeekday = true;
	    } else {
	        temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
	        config._a[YEAR] = temp.year;
	        config._dayOfYear = temp.dayOfYear;
	    }
	}

	// constant that refers to the ISO standard
	hooks.ISO_8601 = function () {};

	// date from string and format string
	function configFromStringAndFormat(config) {
	    // TODO: Move this to another part of the creation flow to prevent circular deps
	    if (config._f === hooks.ISO_8601) {
	        configFromISO(config);
	        return;
	    }

	    config._a = [];
	    getParsingFlags(config).empty = true;

	    // This array is used to make a Date, either with `new Date` or `Date.UTC`
	    var string = '' + config._i,
	        i, parsedInput, tokens, token, skipped,
	        stringLength = string.length,
	        totalParsedInputLength = 0;

	    tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

	    for (i = 0; i < tokens.length; i++) {
	        token = tokens[i];
	        parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
	        // console.log('token', token, 'parsedInput', parsedInput,
	        //         'regex', getParseRegexForToken(token, config));
	        if (parsedInput) {
	            skipped = string.substr(0, string.indexOf(parsedInput));
	            if (skipped.length > 0) {
	                getParsingFlags(config).unusedInput.push(skipped);
	            }
	            string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
	            totalParsedInputLength += parsedInput.length;
	        }
	        // don't parse if it's not a known token
	        if (formatTokenFunctions[token]) {
	            if (parsedInput) {
	                getParsingFlags(config).empty = false;
	            }
	            else {
	                getParsingFlags(config).unusedTokens.push(token);
	            }
	            addTimeToArrayFromToken(token, parsedInput, config);
	        }
	        else if (config._strict && !parsedInput) {
	            getParsingFlags(config).unusedTokens.push(token);
	        }
	    }

	    // add remaining unparsed input length to the string
	    getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
	    if (string.length > 0) {
	        getParsingFlags(config).unusedInput.push(string);
	    }

	    // clear _12h flag if hour is <= 12
	    if (config._a[HOUR] <= 12 &&
	        getParsingFlags(config).bigHour === true &&
	        config._a[HOUR] > 0) {
	        getParsingFlags(config).bigHour = undefined;
	    }

	    getParsingFlags(config).parsedDateParts = config._a.slice(0);
	    getParsingFlags(config).meridiem = config._meridiem;
	    // handle meridiem
	    config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

	    configFromArray(config);
	    checkOverflow(config);
	}


	function meridiemFixWrap (locale, hour, meridiem) {
	    var isPm;

	    if (meridiem == null) {
	        // nothing to do
	        return hour;
	    }
	    if (locale.meridiemHour != null) {
	        return locale.meridiemHour(hour, meridiem);
	    } else if (locale.isPM != null) {
	        // Fallback
	        isPm = locale.isPM(meridiem);
	        if (isPm && hour < 12) {
	            hour += 12;
	        }
	        if (!isPm && hour === 12) {
	            hour = 0;
	        }
	        return hour;
	    } else {
	        // this is not supposed to happen
	        return hour;
	    }
	}

	// date from string and array of format strings
	function configFromStringAndArray(config) {
	    var tempConfig,
	        bestMoment,

	        scoreToBeat,
	        i,
	        currentScore;

	    if (config._f.length === 0) {
	        getParsingFlags(config).invalidFormat = true;
	        config._d = new Date(NaN);
	        return;
	    }

	    for (i = 0; i < config._f.length; i++) {
	        currentScore = 0;
	        tempConfig = copyConfig({}, config);
	        if (config._useUTC != null) {
	            tempConfig._useUTC = config._useUTC;
	        }
	        tempConfig._f = config._f[i];
	        configFromStringAndFormat(tempConfig);

	        if (!isValid(tempConfig)) {
	            continue;
	        }

	        // if there is any input that was not parsed add a penalty for that format
	        currentScore += getParsingFlags(tempConfig).charsLeftOver;

	        //or tokens
	        currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

	        getParsingFlags(tempConfig).score = currentScore;

	        if (scoreToBeat == null || currentScore < scoreToBeat) {
	            scoreToBeat = currentScore;
	            bestMoment = tempConfig;
	        }
	    }

	    extend(config, bestMoment || tempConfig);
	}

	function configFromObject(config) {
	    if (config._d) {
	        return;
	    }

	    var i = normalizeObjectUnits(config._i);
	    config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
	        return obj && parseInt(obj, 10);
	    });

	    configFromArray(config);
	}

	function createFromConfig (config) {
	    var res = new Moment(checkOverflow(prepareConfig(config)));
	    if (res._nextDay) {
	        // Adding is smart enough around DST
	        res.add(1, 'd');
	        res._nextDay = undefined;
	    }

	    return res;
	}

	function prepareConfig (config) {
	    var input = config._i,
	        format = config._f;

	    config._locale = config._locale || getLocale(config._l);

	    if (input === null || (format === undefined && input === '')) {
	        return createInvalid({nullInput: true});
	    }

	    if (typeof input === 'string') {
	        config._i = input = config._locale.preparse(input);
	    }

	    if (isMoment(input)) {
	        return new Moment(checkOverflow(input));
	    } else if (isDate(input)) {
	        config._d = input;
	    } else if (isArray(format)) {
	        configFromStringAndArray(config);
	    } else if (format) {
	        configFromStringAndFormat(config);
	    }  else {
	        configFromInput(config);
	    }

	    if (!isValid(config)) {
	        config._d = null;
	    }

	    return config;
	}

	function configFromInput(config) {
	    var input = config._i;
	    if (input === undefined) {
	        config._d = new Date(hooks.now());
	    } else if (isDate(input)) {
	        config._d = new Date(input.valueOf());
	    } else if (typeof input === 'string') {
	        configFromString(config);
	    } else if (isArray(input)) {
	        config._a = map(input.slice(0), function (obj) {
	            return parseInt(obj, 10);
	        });
	        configFromArray(config);
	    } else if (typeof(input) === 'object') {
	        configFromObject(config);
	    } else if (isNumber(input)) {
	        // from milliseconds
	        config._d = new Date(input);
	    } else {
	        hooks.createFromInputFallback(config);
	    }
	}

	function createLocalOrUTC (input, format, locale, strict, isUTC) {
	    var c = {};

	    if (locale === true || locale === false) {
	        strict = locale;
	        locale = undefined;
	    }

	    if ((isObject(input) && isObjectEmpty(input)) ||
	            (isArray(input) && input.length === 0)) {
	        input = undefined;
	    }
	    // object construction must be done this way.
	    // https://github.com/moment/moment/issues/1423
	    c._isAMomentObject = true;
	    c._useUTC = c._isUTC = isUTC;
	    c._l = locale;
	    c._i = input;
	    c._f = format;
	    c._strict = strict;

	    return createFromConfig(c);
	}

	function createLocal (input, format, locale, strict) {
	    return createLocalOrUTC(input, format, locale, strict, false);
	}

	var prototypeMin = deprecate(
	    'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
	    function () {
	        var other = createLocal.apply(null, arguments);
	        if (this.isValid() && other.isValid()) {
	            return other < this ? this : other;
	        } else {
	            return createInvalid();
	        }
	    }
	);

	var prototypeMax = deprecate(
	    'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
	    function () {
	        var other = createLocal.apply(null, arguments);
	        if (this.isValid() && other.isValid()) {
	            return other > this ? this : other;
	        } else {
	            return createInvalid();
	        }
	    }
	);

	// Pick a moment m from moments so that m[fn](other) is true for all
	// other. This relies on the function fn to be transitive.
	//
	// moments should either be an array of moment objects or an array, whose
	// first element is an array of moment objects.
	function pickBy(fn, moments) {
	    var res, i;
	    if (moments.length === 1 && isArray(moments[0])) {
	        moments = moments[0];
	    }
	    if (!moments.length) {
	        return createLocal();
	    }
	    res = moments[0];
	    for (i = 1; i < moments.length; ++i) {
	        if (!moments[i].isValid() || moments[i][fn](res)) {
	            res = moments[i];
	        }
	    }
	    return res;
	}

	// TODO: Use [].sort instead?
	function min () {
	    var args = [].slice.call(arguments, 0);

	    return pickBy('isBefore', args);
	}

	function max () {
	    var args = [].slice.call(arguments, 0);

	    return pickBy('isAfter', args);
	}

	var now = function () {
	    return Date.now ? Date.now() : +(new Date());
	};

	function Duration (duration) {
	    var normalizedInput = normalizeObjectUnits(duration),
	        years = normalizedInput.year || 0,
	        quarters = normalizedInput.quarter || 0,
	        months = normalizedInput.month || 0,
	        weeks = normalizedInput.week || 0,
	        days = normalizedInput.day || 0,
	        hours = normalizedInput.hour || 0,
	        minutes = normalizedInput.minute || 0,
	        seconds = normalizedInput.second || 0,
	        milliseconds = normalizedInput.millisecond || 0;

	    // representation for dateAddRemove
	    this._milliseconds = +milliseconds +
	        seconds * 1e3 + // 1000
	        minutes * 6e4 + // 1000 * 60
	        hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
	    // Because of dateAddRemove treats 24 hours as different from a
	    // day when working around DST, we need to store them separately
	    this._days = +days +
	        weeks * 7;
	    // It is impossible translate months into days without knowing
	    // which months you are are talking about, so we have to store
	    // it separately.
	    this._months = +months +
	        quarters * 3 +
	        years * 12;

	    this._data = {};

	    this._locale = getLocale();

	    this._bubble();
	}

	function isDuration (obj) {
	    return obj instanceof Duration;
	}

	function absRound (number) {
	    if (number < 0) {
	        return Math.round(-1 * number) * -1;
	    } else {
	        return Math.round(number);
	    }
	}

	// FORMATTING

	function offset (token, separator) {
	    addFormatToken(token, 0, 0, function () {
	        var offset = this.utcOffset();
	        var sign = '+';
	        if (offset < 0) {
	            offset = -offset;
	            sign = '-';
	        }
	        return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
	    });
	}

	offset('Z', ':');
	offset('ZZ', '');

	// PARSING

	addRegexToken('Z',  matchShortOffset);
	addRegexToken('ZZ', matchShortOffset);
	addParseToken(['Z', 'ZZ'], function (input, array, config) {
	    config._useUTC = true;
	    config._tzm = offsetFromString(matchShortOffset, input);
	});

	// HELPERS

	// timezone chunker
	// '+10:00' > ['10',  '00']
	// '-1530'  > ['-15', '30']
	var chunkOffset = /([\+\-]|\d\d)/gi;

	function offsetFromString(matcher, string) {
	    var matches = (string || '').match(matcher);

	    if (matches === null) {
	        return null;
	    }

	    var chunk   = matches[matches.length - 1] || [];
	    var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
	    var minutes = +(parts[1] * 60) + toInt(parts[2]);

	    return minutes === 0 ?
	      0 :
	      parts[0] === '+' ? minutes : -minutes;
	}

	// Return a moment from input, that is local/utc/zone equivalent to model.
	function cloneWithOffset(input, model) {
	    var res, diff;
	    if (model._isUTC) {
	        res = model.clone();
	        diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
	        // Use low-level api, because this fn is low-level api.
	        res._d.setTime(res._d.valueOf() + diff);
	        hooks.updateOffset(res, false);
	        return res;
	    } else {
	        return createLocal(input).local();
	    }
	}

	function getDateOffset (m) {
	    // On Firefox.24 Date#getTimezoneOffset returns a floating point.
	    // https://github.com/moment/moment/pull/1871
	    return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
	}

	// HOOKS

	// This function will be called whenever a moment is mutated.
	// It is intended to keep the offset in sync with the timezone.
	hooks.updateOffset = function () {};

	// MOMENTS

	// keepLocalTime = true means only change the timezone, without
	// affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
	// 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
	// +0200, so we adjust the time as needed, to be valid.
	//
	// Keeping the time actually adds/subtracts (one hour)
	// from the actual represented time. That is why we call updateOffset
	// a second time. In case it wants us to change the offset again
	// _changeInProgress == true case, then we have to adjust, because
	// there is no such time in the given timezone.
	function getSetOffset (input, keepLocalTime) {
	    var offset = this._offset || 0,
	        localAdjust;
	    if (!this.isValid()) {
	        return input != null ? this : NaN;
	    }
	    if (input != null) {
	        if (typeof input === 'string') {
	            input = offsetFromString(matchShortOffset, input);
	            if (input === null) {
	                return this;
	            }
	        } else if (Math.abs(input) < 16) {
	            input = input * 60;
	        }
	        if (!this._isUTC && keepLocalTime) {
	            localAdjust = getDateOffset(this);
	        }
	        this._offset = input;
	        this._isUTC = true;
	        if (localAdjust != null) {
	            this.add(localAdjust, 'm');
	        }
	        if (offset !== input) {
	            if (!keepLocalTime || this._changeInProgress) {
	                addSubtract(this, createDuration(input - offset, 'm'), 1, false);
	            } else if (!this._changeInProgress) {
	                this._changeInProgress = true;
	                hooks.updateOffset(this, true);
	                this._changeInProgress = null;
	            }
	        }
	        return this;
	    } else {
	        return this._isUTC ? offset : getDateOffset(this);
	    }
	}

	function getSetZone (input, keepLocalTime) {
	    if (input != null) {
	        if (typeof input !== 'string') {
	            input = -input;
	        }

	        this.utcOffset(input, keepLocalTime);

	        return this;
	    } else {
	        return -this.utcOffset();
	    }
	}

	function setOffsetToUTC (keepLocalTime) {
	    return this.utcOffset(0, keepLocalTime);
	}

	function setOffsetToLocal (keepLocalTime) {
	    if (this._isUTC) {
	        this.utcOffset(0, keepLocalTime);
	        this._isUTC = false;

	        if (keepLocalTime) {
	            this.subtract(getDateOffset(this), 'm');
	        }
	    }
	    return this;
	}

	function setOffsetToParsedOffset () {
	    if (this._tzm != null) {
	        this.utcOffset(this._tzm);
	    } else if (typeof this._i === 'string') {
	        var tZone = offsetFromString(matchOffset, this._i);
	        if (tZone != null) {
	            this.utcOffset(tZone);
	        }
	        else {
	            this.utcOffset(0, true);
	        }
	    }
	    return this;
	}

	function hasAlignedHourOffset (input) {
	    if (!this.isValid()) {
	        return false;
	    }
	    input = input ? createLocal(input).utcOffset() : 0;

	    return (this.utcOffset() - input) % 60 === 0;
	}

	function isDaylightSavingTime () {
	    return (
	        this.utcOffset() > this.clone().month(0).utcOffset() ||
	        this.utcOffset() > this.clone().month(5).utcOffset()
	    );
	}

	function isDaylightSavingTimeShifted () {
	    if (!isUndefined(this._isDSTShifted)) {
	        return this._isDSTShifted;
	    }

	    var c = {};

	    copyConfig(c, this);
	    c = prepareConfig(c);

	    if (c._a) {
	        var other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
	        this._isDSTShifted = this.isValid() &&
	            compareArrays(c._a, other.toArray()) > 0;
	    } else {
	        this._isDSTShifted = false;
	    }

	    return this._isDSTShifted;
	}

	function isLocal () {
	    return this.isValid() ? !this._isUTC : false;
	}

	function isUtcOffset () {
	    return this.isValid() ? this._isUTC : false;
	}

	function isUtc () {
	    return this.isValid() ? this._isUTC && this._offset === 0 : false;
	}

	// ASP.NET json date format regex
	var aspNetRegex = /^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

	// from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
	// somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
	// and further modified to allow for strings containing both week and day
	var isoRegex = /^(-)?P(?:(-?[0-9,.]*)Y)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)W)?(?:(-?[0-9,.]*)D)?(?:T(?:(-?[0-9,.]*)H)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)S)?)?$/;

	function createDuration (input, key) {
	    var duration = input,
	        // matching against regexp is expensive, do it on demand
	        match = null,
	        sign,
	        ret,
	        diffRes;

	    if (isDuration(input)) {
	        duration = {
	            ms : input._milliseconds,
	            d  : input._days,
	            M  : input._months
	        };
	    } else if (isNumber(input)) {
	        duration = {};
	        if (key) {
	            duration[key] = input;
	        } else {
	            duration.milliseconds = input;
	        }
	    } else if (!!(match = aspNetRegex.exec(input))) {
	        sign = (match[1] === '-') ? -1 : 1;
	        duration = {
	            y  : 0,
	            d  : toInt(match[DATE])                         * sign,
	            h  : toInt(match[HOUR])                         * sign,
	            m  : toInt(match[MINUTE])                       * sign,
	            s  : toInt(match[SECOND])                       * sign,
	            ms : toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
	        };
	    } else if (!!(match = isoRegex.exec(input))) {
	        sign = (match[1] === '-') ? -1 : 1;
	        duration = {
	            y : parseIso(match[2], sign),
	            M : parseIso(match[3], sign),
	            w : parseIso(match[4], sign),
	            d : parseIso(match[5], sign),
	            h : parseIso(match[6], sign),
	            m : parseIso(match[7], sign),
	            s : parseIso(match[8], sign)
	        };
	    } else if (duration == null) {// checks for null or undefined
	        duration = {};
	    } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
	        diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

	        duration = {};
	        duration.ms = diffRes.milliseconds;
	        duration.M = diffRes.months;
	    }

	    ret = new Duration(duration);

	    if (isDuration(input) && hasOwnProp(input, '_locale')) {
	        ret._locale = input._locale;
	    }

	    return ret;
	}

	createDuration.fn = Duration.prototype;

	function parseIso (inp, sign) {
	    // We'd normally use ~~inp for this, but unfortunately it also
	    // converts floats to ints.
	    // inp may be undefined, so careful calling replace on it.
	    var res = inp && parseFloat(inp.replace(',', '.'));
	    // apply sign while we're at it
	    return (isNaN(res) ? 0 : res) * sign;
	}

	function positiveMomentsDifference(base, other) {
	    var res = {milliseconds: 0, months: 0};

	    res.months = other.month() - base.month() +
	        (other.year() - base.year()) * 12;
	    if (base.clone().add(res.months, 'M').isAfter(other)) {
	        --res.months;
	    }

	    res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

	    return res;
	}

	function momentsDifference(base, other) {
	    var res;
	    if (!(base.isValid() && other.isValid())) {
	        return {milliseconds: 0, months: 0};
	    }

	    other = cloneWithOffset(other, base);
	    if (base.isBefore(other)) {
	        res = positiveMomentsDifference(base, other);
	    } else {
	        res = positiveMomentsDifference(other, base);
	        res.milliseconds = -res.milliseconds;
	        res.months = -res.months;
	    }

	    return res;
	}

	// TODO: remove 'name' arg after deprecation is removed
	function createAdder(direction, name) {
	    return function (val, period) {
	        var dur, tmp;
	        //invert the arguments, but complain about it
	        if (period !== null && !isNaN(+period)) {
	            deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
	            'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
	            tmp = val; val = period; period = tmp;
	        }

	        val = typeof val === 'string' ? +val : val;
	        dur = createDuration(val, period);
	        addSubtract(this, dur, direction);
	        return this;
	    };
	}

	function addSubtract (mom, duration, isAdding, updateOffset) {
	    var milliseconds = duration._milliseconds,
	        days = absRound(duration._days),
	        months = absRound(duration._months);

	    if (!mom.isValid()) {
	        // No op
	        return;
	    }

	    updateOffset = updateOffset == null ? true : updateOffset;

	    if (milliseconds) {
	        mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
	    }
	    if (days) {
	        set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
	    }
	    if (months) {
	        setMonth(mom, get(mom, 'Month') + months * isAdding);
	    }
	    if (updateOffset) {
	        hooks.updateOffset(mom, days || months);
	    }
	}

	var add      = createAdder(1, 'add');
	var subtract = createAdder(-1, 'subtract');

	function getCalendarFormat(myMoment, now) {
	    var diff = myMoment.diff(now, 'days', true);
	    return diff < -6 ? 'sameElse' :
	            diff < -1 ? 'lastWeek' :
	            diff < 0 ? 'lastDay' :
	            diff < 1 ? 'sameDay' :
	            diff < 2 ? 'nextDay' :
	            diff < 7 ? 'nextWeek' : 'sameElse';
	}

	function calendar$1 (time, formats) {
	    // We want to compare the start of today, vs this.
	    // Getting start-of-today depends on whether we're local/utc/offset or not.
	    var now = time || createLocal(),
	        sod = cloneWithOffset(now, this).startOf('day'),
	        format = hooks.calendarFormat(this, sod) || 'sameElse';

	    var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

	    return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
	}

	function clone () {
	    return new Moment(this);
	}

	function isAfter (input, units) {
	    var localInput = isMoment(input) ? input : createLocal(input);
	    if (!(this.isValid() && localInput.isValid())) {
	        return false;
	    }
	    units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
	    if (units === 'millisecond') {
	        return this.valueOf() > localInput.valueOf();
	    } else {
	        return localInput.valueOf() < this.clone().startOf(units).valueOf();
	    }
	}

	function isBefore (input, units) {
	    var localInput = isMoment(input) ? input : createLocal(input);
	    if (!(this.isValid() && localInput.isValid())) {
	        return false;
	    }
	    units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
	    if (units === 'millisecond') {
	        return this.valueOf() < localInput.valueOf();
	    } else {
	        return this.clone().endOf(units).valueOf() < localInput.valueOf();
	    }
	}

	function isBetween (from, to, units, inclusivity) {
	    inclusivity = inclusivity || '()';
	    return (inclusivity[0] === '(' ? this.isAfter(from, units) : !this.isBefore(from, units)) &&
	        (inclusivity[1] === ')' ? this.isBefore(to, units) : !this.isAfter(to, units));
	}

	function isSame (input, units) {
	    var localInput = isMoment(input) ? input : createLocal(input),
	        inputMs;
	    if (!(this.isValid() && localInput.isValid())) {
	        return false;
	    }
	    units = normalizeUnits(units || 'millisecond');
	    if (units === 'millisecond') {
	        return this.valueOf() === localInput.valueOf();
	    } else {
	        inputMs = localInput.valueOf();
	        return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
	    }
	}

	function isSameOrAfter (input, units) {
	    return this.isSame(input, units) || this.isAfter(input,units);
	}

	function isSameOrBefore (input, units) {
	    return this.isSame(input, units) || this.isBefore(input,units);
	}

	function diff (input, units, asFloat) {
	    var that,
	        zoneDelta,
	        delta, output;

	    if (!this.isValid()) {
	        return NaN;
	    }

	    that = cloneWithOffset(input, this);

	    if (!that.isValid()) {
	        return NaN;
	    }

	    zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

	    units = normalizeUnits(units);

	    if (units === 'year' || units === 'month' || units === 'quarter') {
	        output = monthDiff(this, that);
	        if (units === 'quarter') {
	            output = output / 3;
	        } else if (units === 'year') {
	            output = output / 12;
	        }
	    } else {
	        delta = this - that;
	        output = units === 'second' ? delta / 1e3 : // 1000
	            units === 'minute' ? delta / 6e4 : // 1000 * 60
	            units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
	            units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
	            units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
	            delta;
	    }
	    return asFloat ? output : absFloor(output);
	}

	function monthDiff (a, b) {
	    // difference in months
	    var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
	        // b is in (anchor - 1 month, anchor + 1 month)
	        anchor = a.clone().add(wholeMonthDiff, 'months'),
	        anchor2, adjust;

	    if (b - anchor < 0) {
	        anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
	        // linear across the month
	        adjust = (b - anchor) / (anchor - anchor2);
	    } else {
	        anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
	        // linear across the month
	        adjust = (b - anchor) / (anchor2 - anchor);
	    }

	    //check for negative zero, return zero if negative zero
	    return -(wholeMonthDiff + adjust) || 0;
	}

	hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
	hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

	function toString () {
	    return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
	}

	function toISOString () {
	    var m = this.clone().utc();
	    if (0 < m.year() && m.year() <= 9999) {
	        if (isFunction(Date.prototype.toISOString)) {
	            // native implementation is ~50x faster, use it when we can
	            return this.toDate().toISOString();
	        } else {
	            return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
	        }
	    } else {
	        return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
	    }
	}

	/**
	 * Return a human readable representation of a moment that can
	 * also be evaluated to get a new moment which is the same
	 *
	 * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
	 */
	function inspect () {
	    if (!this.isValid()) {
	        return 'moment.invalid(/* ' + this._i + ' */)';
	    }
	    var func = 'moment';
	    var zone = '';
	    if (!this.isLocal()) {
	        func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
	        zone = 'Z';
	    }
	    var prefix = '[' + func + '("]';
	    var year = (0 < this.year() && this.year() <= 9999) ? 'YYYY' : 'YYYYYY';
	    var datetime = '-MM-DD[T]HH:mm:ss.SSS';
	    var suffix = zone + '[")]';

	    return this.format(prefix + year + datetime + suffix);
	}

	function format (inputString) {
	    if (!inputString) {
	        inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
	    }
	    var output = formatMoment(this, inputString);
	    return this.localeData().postformat(output);
	}

	function from (time, withoutSuffix) {
	    if (this.isValid() &&
	            ((isMoment(time) && time.isValid()) ||
	             createLocal(time).isValid())) {
	        return createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
	    } else {
	        return this.localeData().invalidDate();
	    }
	}

	function fromNow (withoutSuffix) {
	    return this.from(createLocal(), withoutSuffix);
	}

	function to (time, withoutSuffix) {
	    if (this.isValid() &&
	            ((isMoment(time) && time.isValid()) ||
	             createLocal(time).isValid())) {
	        return createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
	    } else {
	        return this.localeData().invalidDate();
	    }
	}

	function toNow (withoutSuffix) {
	    return this.to(createLocal(), withoutSuffix);
	}

	// If passed a locale key, it will set the locale for this
	// instance.  Otherwise, it will return the locale configuration
	// variables for this instance.
	function locale (key) {
	    var newLocaleData;

	    if (key === undefined) {
	        return this._locale._abbr;
	    } else {
	        newLocaleData = getLocale(key);
	        if (newLocaleData != null) {
	            this._locale = newLocaleData;
	        }
	        return this;
	    }
	}

	var lang = deprecate(
	    'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
	    function (key) {
	        if (key === undefined) {
	            return this.localeData();
	        } else {
	            return this.locale(key);
	        }
	    }
	);

	function localeData () {
	    return this._locale;
	}

	function startOf (units) {
	    units = normalizeUnits(units);
	    // the following switch intentionally omits break keywords
	    // to utilize falling through the cases.
	    switch (units) {
	        case 'year':
	            this.month(0);
	            /* falls through */
	        case 'quarter':
	        case 'month':
	            this.date(1);
	            /* falls through */
	        case 'week':
	        case 'isoWeek':
	        case 'day':
	        case 'date':
	            this.hours(0);
	            /* falls through */
	        case 'hour':
	            this.minutes(0);
	            /* falls through */
	        case 'minute':
	            this.seconds(0);
	            /* falls through */
	        case 'second':
	            this.milliseconds(0);
	    }

	    // weeks are a special case
	    if (units === 'week') {
	        this.weekday(0);
	    }
	    if (units === 'isoWeek') {
	        this.isoWeekday(1);
	    }

	    // quarters are also special
	    if (units === 'quarter') {
	        this.month(Math.floor(this.month() / 3) * 3);
	    }

	    return this;
	}

	function endOf (units) {
	    units = normalizeUnits(units);
	    if (units === undefined || units === 'millisecond') {
	        return this;
	    }

	    // 'date' is an alias for 'day', so it should be considered as such.
	    if (units === 'date') {
	        units = 'day';
	    }

	    return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
	}

	function valueOf () {
	    return this._d.valueOf() - ((this._offset || 0) * 60000);
	}

	function unix () {
	    return Math.floor(this.valueOf() / 1000);
	}

	function toDate () {
	    return new Date(this.valueOf());
	}

	function toArray () {
	    var m = this;
	    return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
	}

	function toObject () {
	    var m = this;
	    return {
	        years: m.year(),
	        months: m.month(),
	        date: m.date(),
	        hours: m.hours(),
	        minutes: m.minutes(),
	        seconds: m.seconds(),
	        milliseconds: m.milliseconds()
	    };
	}

	function toJSON () {
	    // new Date(NaN).toJSON() === null
	    return this.isValid() ? this.toISOString() : null;
	}

	function isValid$1 () {
	    return isValid(this);
	}

	function parsingFlags () {
	    return extend({}, getParsingFlags(this));
	}

	function invalidAt () {
	    return getParsingFlags(this).overflow;
	}

	function creationData() {
	    return {
	        input: this._i,
	        format: this._f,
	        locale: this._locale,
	        isUTC: this._isUTC,
	        strict: this._strict
	    };
	}

	// FORMATTING

	addFormatToken(0, ['gg', 2], 0, function () {
	    return this.weekYear() % 100;
	});

	addFormatToken(0, ['GG', 2], 0, function () {
	    return this.isoWeekYear() % 100;
	});

	function addWeekYearFormatToken (token, getter) {
	    addFormatToken(0, [token, token.length], 0, getter);
	}

	addWeekYearFormatToken('gggg',     'weekYear');
	addWeekYearFormatToken('ggggg',    'weekYear');
	addWeekYearFormatToken('GGGG',  'isoWeekYear');
	addWeekYearFormatToken('GGGGG', 'isoWeekYear');

	// ALIASES

	addUnitAlias('weekYear', 'gg');
	addUnitAlias('isoWeekYear', 'GG');

	// PRIORITY

	addUnitPriority('weekYear', 1);
	addUnitPriority('isoWeekYear', 1);


	// PARSING

	addRegexToken('G',      matchSigned);
	addRegexToken('g',      matchSigned);
	addRegexToken('GG',     match1to2, match2);
	addRegexToken('gg',     match1to2, match2);
	addRegexToken('GGGG',   match1to4, match4);
	addRegexToken('gggg',   match1to4, match4);
	addRegexToken('GGGGG',  match1to6, match6);
	addRegexToken('ggggg',  match1to6, match6);

	addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
	    week[token.substr(0, 2)] = toInt(input);
	});

	addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
	    week[token] = hooks.parseTwoDigitYear(input);
	});

	// MOMENTS

	function getSetWeekYear (input) {
	    return getSetWeekYearHelper.call(this,
	            input,
	            this.week(),
	            this.weekday(),
	            this.localeData()._week.dow,
	            this.localeData()._week.doy);
	}

	function getSetISOWeekYear (input) {
	    return getSetWeekYearHelper.call(this,
	            input, this.isoWeek(), this.isoWeekday(), 1, 4);
	}

	function getISOWeeksInYear () {
	    return weeksInYear(this.year(), 1, 4);
	}

	function getWeeksInYear () {
	    var weekInfo = this.localeData()._week;
	    return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
	}

	function getSetWeekYearHelper(input, week, weekday, dow, doy) {
	    var weeksTarget;
	    if (input == null) {
	        return weekOfYear(this, dow, doy).year;
	    } else {
	        weeksTarget = weeksInYear(input, dow, doy);
	        if (week > weeksTarget) {
	            week = weeksTarget;
	        }
	        return setWeekAll.call(this, input, week, weekday, dow, doy);
	    }
	}

	function setWeekAll(weekYear, week, weekday, dow, doy) {
	    var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
	        date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

	    this.year(date.getUTCFullYear());
	    this.month(date.getUTCMonth());
	    this.date(date.getUTCDate());
	    return this;
	}

	// FORMATTING

	addFormatToken('Q', 0, 'Qo', 'quarter');

	// ALIASES

	addUnitAlias('quarter', 'Q');

	// PRIORITY

	addUnitPriority('quarter', 7);

	// PARSING

	addRegexToken('Q', match1);
	addParseToken('Q', function (input, array) {
	    array[MONTH] = (toInt(input) - 1) * 3;
	});

	// MOMENTS

	function getSetQuarter (input) {
	    return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
	}

	// FORMATTING

	addFormatToken('D', ['DD', 2], 'Do', 'date');

	// ALIASES

	addUnitAlias('date', 'D');

	// PRIOROITY
	addUnitPriority('date', 9);

	// PARSING

	addRegexToken('D',  match1to2);
	addRegexToken('DD', match1to2, match2);
	addRegexToken('Do', function (isStrict, locale) {
	    return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
	});

	addParseToken(['D', 'DD'], DATE);
	addParseToken('Do', function (input, array) {
	    array[DATE] = toInt(input.match(match1to2)[0], 10);
	});

	// MOMENTS

	var getSetDayOfMonth = makeGetSet('Date', true);

	// FORMATTING

	addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

	// ALIASES

	addUnitAlias('dayOfYear', 'DDD');

	// PRIORITY
	addUnitPriority('dayOfYear', 4);

	// PARSING

	addRegexToken('DDD',  match1to3);
	addRegexToken('DDDD', match3);
	addParseToken(['DDD', 'DDDD'], function (input, array, config) {
	    config._dayOfYear = toInt(input);
	});

	// HELPERS

	// MOMENTS

	function getSetDayOfYear (input) {
	    var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
	    return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
	}

	// FORMATTING

	addFormatToken('m', ['mm', 2], 0, 'minute');

	// ALIASES

	addUnitAlias('minute', 'm');

	// PRIORITY

	addUnitPriority('minute', 14);

	// PARSING

	addRegexToken('m',  match1to2);
	addRegexToken('mm', match1to2, match2);
	addParseToken(['m', 'mm'], MINUTE);

	// MOMENTS

	var getSetMinute = makeGetSet('Minutes', false);

	// FORMATTING

	addFormatToken('s', ['ss', 2], 0, 'second');

	// ALIASES

	addUnitAlias('second', 's');

	// PRIORITY

	addUnitPriority('second', 15);

	// PARSING

	addRegexToken('s',  match1to2);
	addRegexToken('ss', match1to2, match2);
	addParseToken(['s', 'ss'], SECOND);

	// MOMENTS

	var getSetSecond = makeGetSet('Seconds', false);

	// FORMATTING

	addFormatToken('S', 0, 0, function () {
	    return ~~(this.millisecond() / 100);
	});

	addFormatToken(0, ['SS', 2], 0, function () {
	    return ~~(this.millisecond() / 10);
	});

	addFormatToken(0, ['SSS', 3], 0, 'millisecond');
	addFormatToken(0, ['SSSS', 4], 0, function () {
	    return this.millisecond() * 10;
	});
	addFormatToken(0, ['SSSSS', 5], 0, function () {
	    return this.millisecond() * 100;
	});
	addFormatToken(0, ['SSSSSS', 6], 0, function () {
	    return this.millisecond() * 1000;
	});
	addFormatToken(0, ['SSSSSSS', 7], 0, function () {
	    return this.millisecond() * 10000;
	});
	addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
	    return this.millisecond() * 100000;
	});
	addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
	    return this.millisecond() * 1000000;
	});


	// ALIASES

	addUnitAlias('millisecond', 'ms');

	// PRIORITY

	addUnitPriority('millisecond', 16);

	// PARSING

	addRegexToken('S',    match1to3, match1);
	addRegexToken('SS',   match1to3, match2);
	addRegexToken('SSS',  match1to3, match3);

	var token;
	for (token = 'SSSS'; token.length <= 9; token += 'S') {
	    addRegexToken(token, matchUnsigned);
	}

	function parseMs(input, array) {
	    array[MILLISECOND] = toInt(('0.' + input) * 1000);
	}

	for (token = 'S'; token.length <= 9; token += 'S') {
	    addParseToken(token, parseMs);
	}
	// MOMENTS

	var getSetMillisecond = makeGetSet('Milliseconds', false);

	// FORMATTING

	addFormatToken('z',  0, 0, 'zoneAbbr');
	addFormatToken('zz', 0, 0, 'zoneName');

	// MOMENTS

	function getZoneAbbr () {
	    return this._isUTC ? 'UTC' : '';
	}

	function getZoneName () {
	    return this._isUTC ? 'Coordinated Universal Time' : '';
	}

	var proto = Moment.prototype;

	proto.add               = add;
	proto.calendar          = calendar$1;
	proto.clone             = clone;
	proto.diff              = diff;
	proto.endOf             = endOf;
	proto.format            = format;
	proto.from              = from;
	proto.fromNow           = fromNow;
	proto.to                = to;
	proto.toNow             = toNow;
	proto.get               = stringGet;
	proto.invalidAt         = invalidAt;
	proto.isAfter           = isAfter;
	proto.isBefore          = isBefore;
	proto.isBetween         = isBetween;
	proto.isSame            = isSame;
	proto.isSameOrAfter     = isSameOrAfter;
	proto.isSameOrBefore    = isSameOrBefore;
	proto.isValid           = isValid$1;
	proto.lang              = lang;
	proto.locale            = locale;
	proto.localeData        = localeData;
	proto.max               = prototypeMax;
	proto.min               = prototypeMin;
	proto.parsingFlags      = parsingFlags;
	proto.set               = stringSet;
	proto.startOf           = startOf;
	proto.subtract          = subtract;
	proto.toArray           = toArray;
	proto.toObject          = toObject;
	proto.toDate            = toDate;
	proto.toISOString       = toISOString;
	proto.inspect           = inspect;
	proto.toJSON            = toJSON;
	proto.toString          = toString;
	proto.unix              = unix;
	proto.valueOf           = valueOf;
	proto.creationData      = creationData;

	// Year
	proto.year       = getSetYear;
	proto.isLeapYear = getIsLeapYear;

	// Week Year
	proto.weekYear    = getSetWeekYear;
	proto.isoWeekYear = getSetISOWeekYear;

	// Quarter
	proto.quarter = proto.quarters = getSetQuarter;

	// Month
	proto.month       = getSetMonth;
	proto.daysInMonth = getDaysInMonth;

	// Week
	proto.week           = proto.weeks        = getSetWeek;
	proto.isoWeek        = proto.isoWeeks     = getSetISOWeek;
	proto.weeksInYear    = getWeeksInYear;
	proto.isoWeeksInYear = getISOWeeksInYear;

	// Day
	proto.date       = getSetDayOfMonth;
	proto.day        = proto.days             = getSetDayOfWeek;
	proto.weekday    = getSetLocaleDayOfWeek;
	proto.isoWeekday = getSetISODayOfWeek;
	proto.dayOfYear  = getSetDayOfYear;

	// Hour
	proto.hour = proto.hours = getSetHour;

	// Minute
	proto.minute = proto.minutes = getSetMinute;

	// Second
	proto.second = proto.seconds = getSetSecond;

	// Millisecond
	proto.millisecond = proto.milliseconds = getSetMillisecond;

	// Offset
	proto.utcOffset            = getSetOffset;
	proto.utc                  = setOffsetToUTC;
	proto.local                = setOffsetToLocal;
	proto.parseZone            = setOffsetToParsedOffset;
	proto.hasAlignedHourOffset = hasAlignedHourOffset;
	proto.isDST                = isDaylightSavingTime;
	proto.isLocal              = isLocal;
	proto.isUtcOffset          = isUtcOffset;
	proto.isUtc                = isUtc;
	proto.isUTC                = isUtc;

	// Timezone
	proto.zoneAbbr = getZoneAbbr;
	proto.zoneName = getZoneName;

	// Deprecations
	proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
	proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
	proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
	proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
	proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

	function createUnix (input) {
	    return createLocal(input * 1000);
	}

	function createInZone () {
	    return createLocal.apply(null, arguments).parseZone();
	}

	function preParsePostFormat (string) {
	    return string;
	}

	var proto$1 = Locale.prototype;

	proto$1.calendar        = calendar;
	proto$1.longDateFormat  = longDateFormat;
	proto$1.invalidDate     = invalidDate;
	proto$1.ordinal         = ordinal;
	proto$1.preparse        = preParsePostFormat;
	proto$1.postformat      = preParsePostFormat;
	proto$1.relativeTime    = relativeTime;
	proto$1.pastFuture      = pastFuture;
	proto$1.set             = set;

	// Month
	proto$1.months            =        localeMonths;
	proto$1.monthsShort       =        localeMonthsShort;
	proto$1.monthsParse       =        localeMonthsParse;
	proto$1.monthsRegex       = monthsRegex;
	proto$1.monthsShortRegex  = monthsShortRegex;

	// Week
	proto$1.week = localeWeek;
	proto$1.firstDayOfYear = localeFirstDayOfYear;
	proto$1.firstDayOfWeek = localeFirstDayOfWeek;

	// Day of Week
	proto$1.weekdays       =        localeWeekdays;
	proto$1.weekdaysMin    =        localeWeekdaysMin;
	proto$1.weekdaysShort  =        localeWeekdaysShort;
	proto$1.weekdaysParse  =        localeWeekdaysParse;

	proto$1.weekdaysRegex       =        weekdaysRegex;
	proto$1.weekdaysShortRegex  =        weekdaysShortRegex;
	proto$1.weekdaysMinRegex    =        weekdaysMinRegex;

	// Hours
	proto$1.isPM = localeIsPM;
	proto$1.meridiem = localeMeridiem;

	function get$1 (format, index, field, setter) {
	    var locale = getLocale();
	    var utc = createUTC().set(setter, index);
	    return locale[field](utc, format);
	}

	function listMonthsImpl (format, index, field) {
	    if (isNumber(format)) {
	        index = format;
	        format = undefined;
	    }

	    format = format || '';

	    if (index != null) {
	        return get$1(format, index, field, 'month');
	    }

	    var i;
	    var out = [];
	    for (i = 0; i < 12; i++) {
	        out[i] = get$1(format, i, field, 'month');
	    }
	    return out;
	}

	// ()
	// (5)
	// (fmt, 5)
	// (fmt)
	// (true)
	// (true, 5)
	// (true, fmt, 5)
	// (true, fmt)
	function listWeekdaysImpl (localeSorted, format, index, field) {
	    if (typeof localeSorted === 'boolean') {
	        if (isNumber(format)) {
	            index = format;
	            format = undefined;
	        }

	        format = format || '';
	    } else {
	        format = localeSorted;
	        index = format;
	        localeSorted = false;

	        if (isNumber(format)) {
	            index = format;
	            format = undefined;
	        }

	        format = format || '';
	    }

	    var locale = getLocale(),
	        shift = localeSorted ? locale._week.dow : 0;

	    if (index != null) {
	        return get$1(format, (index + shift) % 7, field, 'day');
	    }

	    var i;
	    var out = [];
	    for (i = 0; i < 7; i++) {
	        out[i] = get$1(format, (i + shift) % 7, field, 'day');
	    }
	    return out;
	}

	function listMonths (format, index) {
	    return listMonthsImpl(format, index, 'months');
	}

	function listMonthsShort (format, index) {
	    return listMonthsImpl(format, index, 'monthsShort');
	}

	function listWeekdays (localeSorted, format, index) {
	    return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
	}

	function listWeekdaysShort (localeSorted, format, index) {
	    return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
	}

	function listWeekdaysMin (localeSorted, format, index) {
	    return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
	}

	getSetGlobalLocale('en', {
	    ordinalParse: /\d{1,2}(th|st|nd|rd)/,
	    ordinal : function (number) {
	        var b = number % 10,
	            output = (toInt(number % 100 / 10) === 1) ? 'th' :
	            (b === 1) ? 'st' :
	            (b === 2) ? 'nd' :
	            (b === 3) ? 'rd' : 'th';
	        return number + output;
	    }
	});

	// Side effect imports
	hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
	hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);

	var mathAbs = Math.abs;

	function abs () {
	    var data           = this._data;

	    this._milliseconds = mathAbs(this._milliseconds);
	    this._days         = mathAbs(this._days);
	    this._months       = mathAbs(this._months);

	    data.milliseconds  = mathAbs(data.milliseconds);
	    data.seconds       = mathAbs(data.seconds);
	    data.minutes       = mathAbs(data.minutes);
	    data.hours         = mathAbs(data.hours);
	    data.months        = mathAbs(data.months);
	    data.years         = mathAbs(data.years);

	    return this;
	}

	function addSubtract$1 (duration, input, value, direction) {
	    var other = createDuration(input, value);

	    duration._milliseconds += direction * other._milliseconds;
	    duration._days         += direction * other._days;
	    duration._months       += direction * other._months;

	    return duration._bubble();
	}

	// supports only 2.0-style add(1, 's') or add(duration)
	function add$1 (input, value) {
	    return addSubtract$1(this, input, value, 1);
	}

	// supports only 2.0-style subtract(1, 's') or subtract(duration)
	function subtract$1 (input, value) {
	    return addSubtract$1(this, input, value, -1);
	}

	function absCeil (number) {
	    if (number < 0) {
	        return Math.floor(number);
	    } else {
	        return Math.ceil(number);
	    }
	}

	function bubble () {
	    var milliseconds = this._milliseconds;
	    var days         = this._days;
	    var months       = this._months;
	    var data         = this._data;
	    var seconds, minutes, hours, years, monthsFromDays;

	    // if we have a mix of positive and negative values, bubble down first
	    // check: https://github.com/moment/moment/issues/2166
	    if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
	            (milliseconds <= 0 && days <= 0 && months <= 0))) {
	        milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
	        days = 0;
	        months = 0;
	    }

	    // The following code bubbles up values, see the tests for
	    // examples of what that means.
	    data.milliseconds = milliseconds % 1000;

	    seconds           = absFloor(milliseconds / 1000);
	    data.seconds      = seconds % 60;

	    minutes           = absFloor(seconds / 60);
	    data.minutes      = minutes % 60;

	    hours             = absFloor(minutes / 60);
	    data.hours        = hours % 24;

	    days += absFloor(hours / 24);

	    // convert days to months
	    monthsFromDays = absFloor(daysToMonths(days));
	    months += monthsFromDays;
	    days -= absCeil(monthsToDays(monthsFromDays));

	    // 12 months -> 1 year
	    years = absFloor(months / 12);
	    months %= 12;

	    data.days   = days;
	    data.months = months;
	    data.years  = years;

	    return this;
	}

	function daysToMonths (days) {
	    // 400 years have 146097 days (taking into account leap year rules)
	    // 400 years have 12 months === 4800
	    return days * 4800 / 146097;
	}

	function monthsToDays (months) {
	    // the reverse of daysToMonths
	    return months * 146097 / 4800;
	}

	function as (units) {
	    var days;
	    var months;
	    var milliseconds = this._milliseconds;

	    units = normalizeUnits(units);

	    if (units === 'month' || units === 'year') {
	        days   = this._days   + milliseconds / 864e5;
	        months = this._months + daysToMonths(days);
	        return units === 'month' ? months : months / 12;
	    } else {
	        // handle milliseconds separately because of floating point math errors (issue #1867)
	        days = this._days + Math.round(monthsToDays(this._months));
	        switch (units) {
	            case 'week'   : return days / 7     + milliseconds / 6048e5;
	            case 'day'    : return days         + milliseconds / 864e5;
	            case 'hour'   : return days * 24    + milliseconds / 36e5;
	            case 'minute' : return days * 1440  + milliseconds / 6e4;
	            case 'second' : return days * 86400 + milliseconds / 1000;
	            // Math.floor prevents floating point math errors here
	            case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
	            default: throw new Error('Unknown unit ' + units);
	        }
	    }
	}

	// TODO: Use this.as('ms')?
	function valueOf$1 () {
	    return (
	        this._milliseconds +
	        this._days * 864e5 +
	        (this._months % 12) * 2592e6 +
	        toInt(this._months / 12) * 31536e6
	    );
	}

	function makeAs (alias) {
	    return function () {
	        return this.as(alias);
	    };
	}

	var asMilliseconds = makeAs('ms');
	var asSeconds      = makeAs('s');
	var asMinutes      = makeAs('m');
	var asHours        = makeAs('h');
	var asDays         = makeAs('d');
	var asWeeks        = makeAs('w');
	var asMonths       = makeAs('M');
	var asYears        = makeAs('y');

	function get$2 (units) {
	    units = normalizeUnits(units);
	    return this[units + 's']();
	}

	function makeGetter(name) {
	    return function () {
	        return this._data[name];
	    };
	}

	var milliseconds = makeGetter('milliseconds');
	var seconds      = makeGetter('seconds');
	var minutes      = makeGetter('minutes');
	var hours        = makeGetter('hours');
	var days         = makeGetter('days');
	var months       = makeGetter('months');
	var years        = makeGetter('years');

	function weeks () {
	    return absFloor(this.days() / 7);
	}

	var round = Math.round;
	var thresholds = {
	    s: 45,  // seconds to minute
	    m: 45,  // minutes to hour
	    h: 22,  // hours to day
	    d: 26,  // days to month
	    M: 11   // months to year
	};

	// helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
	function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
	    return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
	}

	function relativeTime$1 (posNegDuration, withoutSuffix, locale) {
	    var duration = createDuration(posNegDuration).abs();
	    var seconds  = round(duration.as('s'));
	    var minutes  = round(duration.as('m'));
	    var hours    = round(duration.as('h'));
	    var days     = round(duration.as('d'));
	    var months   = round(duration.as('M'));
	    var years    = round(duration.as('y'));

	    var a = seconds < thresholds.s && ['s', seconds]  ||
	            minutes <= 1           && ['m']           ||
	            minutes < thresholds.m && ['mm', minutes] ||
	            hours   <= 1           && ['h']           ||
	            hours   < thresholds.h && ['hh', hours]   ||
	            days    <= 1           && ['d']           ||
	            days    < thresholds.d && ['dd', days]    ||
	            months  <= 1           && ['M']           ||
	            months  < thresholds.M && ['MM', months]  ||
	            years   <= 1           && ['y']           || ['yy', years];

	    a[2] = withoutSuffix;
	    a[3] = +posNegDuration > 0;
	    a[4] = locale;
	    return substituteTimeAgo.apply(null, a);
	}

	// This function allows you to set the rounding function for relative time strings
	function getSetRelativeTimeRounding (roundingFunction) {
	    if (roundingFunction === undefined) {
	        return round;
	    }
	    if (typeof(roundingFunction) === 'function') {
	        round = roundingFunction;
	        return true;
	    }
	    return false;
	}

	// This function allows you to set a threshold for relative time strings
	function getSetRelativeTimeThreshold (threshold, limit) {
	    if (thresholds[threshold] === undefined) {
	        return false;
	    }
	    if (limit === undefined) {
	        return thresholds[threshold];
	    }
	    thresholds[threshold] = limit;
	    return true;
	}

	function humanize (withSuffix) {
	    var locale = this.localeData();
	    var output = relativeTime$1(this, !withSuffix, locale);

	    if (withSuffix) {
	        output = locale.pastFuture(+this, output);
	    }

	    return locale.postformat(output);
	}

	var abs$1 = Math.abs;

	function toISOString$1() {
	    // for ISO strings we do not use the normal bubbling rules:
	    //  * milliseconds bubble up until they become hours
	    //  * days do not bubble at all
	    //  * months bubble up until they become years
	    // This is because there is no context-free conversion between hours and days
	    // (think of clock changes)
	    // and also not between days and months (28-31 days per month)
	    var seconds = abs$1(this._milliseconds) / 1000;
	    var days         = abs$1(this._days);
	    var months       = abs$1(this._months);
	    var minutes, hours, years;

	    // 3600 seconds -> 60 minutes -> 1 hour
	    minutes           = absFloor(seconds / 60);
	    hours             = absFloor(minutes / 60);
	    seconds %= 60;
	    minutes %= 60;

	    // 12 months -> 1 year
	    years  = absFloor(months / 12);
	    months %= 12;


	    // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
	    var Y = years;
	    var M = months;
	    var D = days;
	    var h = hours;
	    var m = minutes;
	    var s = seconds;
	    var total = this.asSeconds();

	    if (!total) {
	        // this is the same as C#'s (Noda) and python (isodate)...
	        // but not other JS (goog.date)
	        return 'P0D';
	    }

	    return (total < 0 ? '-' : '') +
	        'P' +
	        (Y ? Y + 'Y' : '') +
	        (M ? M + 'M' : '') +
	        (D ? D + 'D' : '') +
	        ((h || m || s) ? 'T' : '') +
	        (h ? h + 'H' : '') +
	        (m ? m + 'M' : '') +
	        (s ? s + 'S' : '');
	}

	var proto$2 = Duration.prototype;

	proto$2.abs            = abs;
	proto$2.add            = add$1;
	proto$2.subtract       = subtract$1;
	proto$2.as             = as;
	proto$2.asMilliseconds = asMilliseconds;
	proto$2.asSeconds      = asSeconds;
	proto$2.asMinutes      = asMinutes;
	proto$2.asHours        = asHours;
	proto$2.asDays         = asDays;
	proto$2.asWeeks        = asWeeks;
	proto$2.asMonths       = asMonths;
	proto$2.asYears        = asYears;
	proto$2.valueOf        = valueOf$1;
	proto$2._bubble        = bubble;
	proto$2.get            = get$2;
	proto$2.milliseconds   = milliseconds;
	proto$2.seconds        = seconds;
	proto$2.minutes        = minutes;
	proto$2.hours          = hours;
	proto$2.days           = days;
	proto$2.weeks          = weeks;
	proto$2.months         = months;
	proto$2.years          = years;
	proto$2.humanize       = humanize;
	proto$2.toISOString    = toISOString$1;
	proto$2.toString       = toISOString$1;
	proto$2.toJSON         = toISOString$1;
	proto$2.locale         = locale;
	proto$2.localeData     = localeData;

	// Deprecations
	proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
	proto$2.lang = lang;

	// Side effect imports

	// FORMATTING

	addFormatToken('X', 0, 0, 'unix');
	addFormatToken('x', 0, 0, 'valueOf');

	// PARSING

	addRegexToken('x', matchSigned);
	addRegexToken('X', matchTimestamp);
	addParseToken('X', function (input, array, config) {
	    config._d = new Date(parseFloat(input, 10) * 1000);
	});
	addParseToken('x', function (input, array, config) {
	    config._d = new Date(toInt(input));
	});

	// Side effect imports


	hooks.version = '2.17.1';

	setHookCallback(createLocal);

	hooks.fn                    = proto;
	hooks.min                   = min;
	hooks.max                   = max;
	hooks.now                   = now;
	hooks.utc                   = createUTC;
	hooks.unix                  = createUnix;
	hooks.months                = listMonths;
	hooks.isDate                = isDate;
	hooks.locale                = getSetGlobalLocale;
	hooks.invalid               = createInvalid;
	hooks.duration              = createDuration;
	hooks.isMoment              = isMoment;
	hooks.weekdays              = listWeekdays;
	hooks.parseZone             = createInZone;
	hooks.localeData            = getLocale;
	hooks.isDuration            = isDuration;
	hooks.monthsShort           = listMonthsShort;
	hooks.weekdaysMin           = listWeekdaysMin;
	hooks.defineLocale          = defineLocale;
	hooks.updateLocale          = updateLocale;
	hooks.locales               = listLocales;
	hooks.weekdaysShort         = listWeekdaysShort;
	hooks.normalizeUnits        = normalizeUnits;
	hooks.relativeTimeRounding = getSetRelativeTimeRounding;
	hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
	hooks.calendarFormat        = getCalendarFormat;
	hooks.prototype             = proto;

	return hooks;

	})));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)(module)))

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./af": 8,
		"./af.js": 8,
		"./ar": 9,
		"./ar-dz": 10,
		"./ar-dz.js": 10,
		"./ar-ly": 11,
		"./ar-ly.js": 11,
		"./ar-ma": 12,
		"./ar-ma.js": 12,
		"./ar-sa": 13,
		"./ar-sa.js": 13,
		"./ar-tn": 14,
		"./ar-tn.js": 14,
		"./ar.js": 9,
		"./az": 15,
		"./az.js": 15,
		"./be": 16,
		"./be.js": 16,
		"./bg": 17,
		"./bg.js": 17,
		"./bn": 18,
		"./bn.js": 18,
		"./bo": 19,
		"./bo.js": 19,
		"./br": 20,
		"./br.js": 20,
		"./bs": 21,
		"./bs.js": 21,
		"./ca": 22,
		"./ca.js": 22,
		"./cs": 23,
		"./cs.js": 23,
		"./cv": 24,
		"./cv.js": 24,
		"./cy": 25,
		"./cy.js": 25,
		"./da": 26,
		"./da.js": 26,
		"./de": 27,
		"./de-at": 28,
		"./de-at.js": 28,
		"./de.js": 27,
		"./dv": 29,
		"./dv.js": 29,
		"./el": 30,
		"./el.js": 30,
		"./en-au": 31,
		"./en-au.js": 31,
		"./en-ca": 32,
		"./en-ca.js": 32,
		"./en-gb": 33,
		"./en-gb.js": 33,
		"./en-ie": 34,
		"./en-ie.js": 34,
		"./en-nz": 35,
		"./en-nz.js": 35,
		"./eo": 36,
		"./eo.js": 36,
		"./es": 37,
		"./es-do": 38,
		"./es-do.js": 38,
		"./es.js": 37,
		"./et": 39,
		"./et.js": 39,
		"./eu": 40,
		"./eu.js": 40,
		"./fa": 41,
		"./fa.js": 41,
		"./fi": 42,
		"./fi.js": 42,
		"./fo": 43,
		"./fo.js": 43,
		"./fr": 44,
		"./fr-ca": 45,
		"./fr-ca.js": 45,
		"./fr-ch": 46,
		"./fr-ch.js": 46,
		"./fr.js": 44,
		"./fy": 47,
		"./fy.js": 47,
		"./gd": 48,
		"./gd.js": 48,
		"./gl": 49,
		"./gl.js": 49,
		"./he": 50,
		"./he.js": 50,
		"./hi": 51,
		"./hi.js": 51,
		"./hr": 52,
		"./hr.js": 52,
		"./hu": 53,
		"./hu.js": 53,
		"./hy-am": 54,
		"./hy-am.js": 54,
		"./id": 55,
		"./id.js": 55,
		"./is": 56,
		"./is.js": 56,
		"./it": 57,
		"./it.js": 57,
		"./ja": 58,
		"./ja.js": 58,
		"./jv": 59,
		"./jv.js": 59,
		"./ka": 60,
		"./ka.js": 60,
		"./kk": 61,
		"./kk.js": 61,
		"./km": 62,
		"./km.js": 62,
		"./ko": 63,
		"./ko.js": 63,
		"./ky": 64,
		"./ky.js": 64,
		"./lb": 65,
		"./lb.js": 65,
		"./lo": 66,
		"./lo.js": 66,
		"./lt": 67,
		"./lt.js": 67,
		"./lv": 68,
		"./lv.js": 68,
		"./me": 69,
		"./me.js": 69,
		"./mi": 70,
		"./mi.js": 70,
		"./mk": 71,
		"./mk.js": 71,
		"./ml": 72,
		"./ml.js": 72,
		"./mr": 73,
		"./mr.js": 73,
		"./ms": 74,
		"./ms-my": 75,
		"./ms-my.js": 75,
		"./ms.js": 74,
		"./my": 76,
		"./my.js": 76,
		"./nb": 77,
		"./nb.js": 77,
		"./ne": 78,
		"./ne.js": 78,
		"./nl": 79,
		"./nl-be": 80,
		"./nl-be.js": 80,
		"./nl.js": 79,
		"./nn": 81,
		"./nn.js": 81,
		"./pa-in": 82,
		"./pa-in.js": 82,
		"./pl": 83,
		"./pl.js": 83,
		"./pt": 84,
		"./pt-br": 85,
		"./pt-br.js": 85,
		"./pt.js": 84,
		"./ro": 86,
		"./ro.js": 86,
		"./ru": 87,
		"./ru.js": 87,
		"./se": 88,
		"./se.js": 88,
		"./si": 89,
		"./si.js": 89,
		"./sk": 90,
		"./sk.js": 90,
		"./sl": 91,
		"./sl.js": 91,
		"./sq": 92,
		"./sq.js": 92,
		"./sr": 93,
		"./sr-cyrl": 94,
		"./sr-cyrl.js": 94,
		"./sr.js": 93,
		"./ss": 95,
		"./ss.js": 95,
		"./sv": 96,
		"./sv.js": 96,
		"./sw": 97,
		"./sw.js": 97,
		"./ta": 98,
		"./ta.js": 98,
		"./te": 99,
		"./te.js": 99,
		"./tet": 100,
		"./tet.js": 100,
		"./th": 101,
		"./th.js": 101,
		"./tl-ph": 102,
		"./tl-ph.js": 102,
		"./tlh": 103,
		"./tlh.js": 103,
		"./tr": 104,
		"./tr.js": 104,
		"./tzl": 105,
		"./tzl.js": 105,
		"./tzm": 106,
		"./tzm-latn": 107,
		"./tzm-latn.js": 107,
		"./tzm.js": 106,
		"./uk": 108,
		"./uk.js": 108,
		"./uz": 109,
		"./uz.js": 109,
		"./vi": 110,
		"./vi.js": 110,
		"./x-pseudo": 111,
		"./x-pseudo.js": 111,
		"./yo": 112,
		"./yo.js": 112,
		"./zh-cn": 113,
		"./zh-cn.js": 113,
		"./zh-hk": 114,
		"./zh-hk.js": 114,
		"./zh-tw": 115,
		"./zh-tw.js": 115
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 7;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Afrikaans [af]
	//! author : Werner Mollentze : https://github.com/wernerm

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var af = moment.defineLocale('af', {
	    months : 'Januarie_Februarie_Maart_April_Mei_Junie_Julie_Augustus_September_Oktober_November_Desember'.split('_'),
	    monthsShort : 'Jan_Feb_Mrt_Apr_Mei_Jun_Jul_Aug_Sep_Okt_Nov_Des'.split('_'),
	    weekdays : 'Sondag_Maandag_Dinsdag_Woensdag_Donderdag_Vrydag_Saterdag'.split('_'),
	    weekdaysShort : 'Son_Maa_Din_Woe_Don_Vry_Sat'.split('_'),
	    weekdaysMin : 'So_Ma_Di_Wo_Do_Vr_Sa'.split('_'),
	    meridiemParse: /vm|nm/i,
	    isPM : function (input) {
	        return /^nm$/i.test(input);
	    },
	    meridiem : function (hours, minutes, isLower) {
	        if (hours < 12) {
	            return isLower ? 'vm' : 'VM';
	        } else {
	            return isLower ? 'nm' : 'NM';
	        }
	    },
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[Vandag om] LT',
	        nextDay : '[M??re om] LT',
	        nextWeek : 'dddd [om] LT',
	        lastDay : '[Gister om] LT',
	        lastWeek : '[Laas] dddd [om] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'oor %s',
	        past : '%s gelede',
	        s : '\'n paar sekondes',
	        m : '\'n minuut',
	        mm : '%d minute',
	        h : '\'n uur',
	        hh : '%d ure',
	        d : '\'n dag',
	        dd : '%d dae',
	        M : '\'n maand',
	        MM : '%d maande',
	        y : '\'n jaar',
	        yy : '%d jaar'
	    },
	    ordinalParse: /\d{1,2}(ste|de)/,
	    ordinal : function (number) {
	        return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de'); // Thanks to Joris R??ling : https://github.com/jjupiter
	    },
	    week : {
	        dow : 1, // Maandag is die eerste dag van die week.
	        doy : 4  // Die week wat die 4de Januarie bevat is die eerste week van die jaar.
	    }
	});

	return af;

	})));


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Arabic [ar]
	//! author : Abdel Said: https://github.com/abdelsaid
	//! author : Ahmed Elkhatib
	//! author : forabi https://github.com/forabi

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var symbolMap = {
	    '1': '??',
	    '2': '??',
	    '3': '??',
	    '4': '??',
	    '5': '??',
	    '6': '??',
	    '7': '??',
	    '8': '??',
	    '9': '??',
	    '0': '??'
	};
	var numberMap = {
	    '??': '1',
	    '??': '2',
	    '??': '3',
	    '??': '4',
	    '??': '5',
	    '??': '6',
	    '??': '7',
	    '??': '8',
	    '??': '9',
	    '??': '0'
	};
	var pluralForm = function (n) {
	    return n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5;
	};
	var plurals = {
	    s : ['?????? ???? ??????????', '?????????? ??????????', ['??????????????', '??????????????'], '%d ????????', '%d ??????????', '%d ??????????'],
	    m : ['?????? ???? ??????????', '?????????? ??????????', ['??????????????', '??????????????'], '%d ??????????', '%d ??????????', '%d ??????????'],
	    h : ['?????? ???? ????????', '???????? ??????????', ['????????????', '????????????'], '%d ??????????', '%d ????????', '%d ????????'],
	    d : ['?????? ???? ??????', '?????? ????????', ['??????????', '??????????'], '%d ????????', '%d ??????????', '%d ??????'],
	    M : ['?????? ???? ??????', '?????? ????????', ['??????????', '??????????'], '%d ????????', '%d ????????', '%d ??????'],
	    y : ['?????? ???? ??????', '?????? ????????', ['??????????', '??????????'], '%d ??????????', '%d ??????????', '%d ??????']
	};
	var pluralize = function (u) {
	    return function (number, withoutSuffix, string, isFuture) {
	        var f = pluralForm(number),
	            str = plurals[u][pluralForm(number)];
	        if (f === 2) {
	            str = str[withoutSuffix ? 0 : 1];
	        }
	        return str.replace(/%d/i, number);
	    };
	};
	var months = [
	    '?????????? ???????????? ??????????',
	    '???????? ????????????',
	    '???????? ????????',
	    '?????????? ??????????',
	    '???????? ????????',
	    '???????????? ??????????',
	    '???????? ??????????',
	    '???? ??????????',
	    '?????????? ????????????',
	    '?????????? ?????????? ????????????',
	    '?????????? ???????????? ????????????',
	    '?????????? ?????????? ????????????'
	];

	var ar = moment.defineLocale('ar', {
	    months : months,
	    monthsShort : months,
	    weekdays : '??????????_??????????????_????????????????_????????????????_????????????_????????????_??????????'.split('_'),
	    weekdaysShort : '??????_??????????_????????????_????????????_????????_????????_??????'.split('_'),
	    weekdaysMin : '??_??_??_??_??_??_??'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'D/\u200FM/\u200FYYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    meridiemParse: /??|??/,
	    isPM : function (input) {
	        return '??' === input;
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 12) {
	            return '??';
	        } else {
	            return '??';
	        }
	    },
	    calendar : {
	        sameDay: '[?????????? ?????? ????????????] LT',
	        nextDay: '[???????? ?????? ????????????] LT',
	        nextWeek: 'dddd [?????? ????????????] LT',
	        lastDay: '[?????? ?????? ????????????] LT',
	        lastWeek: 'dddd [?????? ????????????] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : '?????? %s',
	        past : '?????? %s',
	        s : pluralize('s'),
	        m : pluralize('m'),
	        mm : pluralize('m'),
	        h : pluralize('h'),
	        hh : pluralize('h'),
	        d : pluralize('d'),
	        dd : pluralize('d'),
	        M : pluralize('M'),
	        MM : pluralize('M'),
	        y : pluralize('y'),
	        yy : pluralize('y')
	    },
	    preparse: function (string) {
	        return string.replace(/\u200f/g, '').replace(/[????????????????????]/g, function (match) {
	            return numberMap[match];
	        }).replace(/??/g, ',');
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        }).replace(/,/g, '??');
	    },
	    week : {
	        dow : 6, // Saturday is the first day of the week.
	        doy : 12  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return ar;

	})));


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Arabic (Algeria) [ar-dz]
	//! author : Noureddine LOUAHEDJ : https://github.com/noureddineme

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var arDz = moment.defineLocale('ar-dz', {
	    months : '??????????_??????????_????????_??????????_??????_????????_????????????_??????_????????????_????????????_????????????_????????????'.split('_'),
	    monthsShort : '??????????_??????????_????????_??????????_??????_????????_????????????_??????_????????????_????????????_????????????_????????????'.split('_'),
	    weekdays : '??????????_??????????????_????????????????_????????????????_????????????_????????????_??????????'.split('_'),
	    weekdaysShort : '??????_??????????_????????????_????????????_????????_????????_??????'.split('_'),
	    weekdaysMin : '????_????_??????_????_????_????_????'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[?????????? ?????? ????????????] LT',
	        nextDay: '[?????? ?????? ????????????] LT',
	        nextWeek: 'dddd [?????? ????????????] LT',
	        lastDay: '[?????? ?????? ????????????] LT',
	        lastWeek: 'dddd [?????? ????????????] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : '???? %s',
	        past : '?????? %s',
	        s : '????????',
	        m : '??????????',
	        mm : '%d ??????????',
	        h : '????????',
	        hh : '%d ??????????',
	        d : '??????',
	        dd : '%d ????????',
	        M : '??????',
	        MM : '%d ????????',
	        y : '??????',
	        yy : '%d ??????????'
	    },
	    week : {
	        dow : 0, // Sunday is the first day of the week.
	        doy : 4  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return arDz;

	})));


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Arabic (Lybia) [ar-ly]
	//! author : Ali Hmer: https://github.com/kikoanis

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var symbolMap = {
	    '1': '1',
	    '2': '2',
	    '3': '3',
	    '4': '4',
	    '5': '5',
	    '6': '6',
	    '7': '7',
	    '8': '8',
	    '9': '9',
	    '0': '0'
	};
	var pluralForm = function (n) {
	    return n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5;
	};
	var plurals = {
	    s : ['?????? ???? ??????????', '?????????? ??????????', ['??????????????', '??????????????'], '%d ????????', '%d ??????????', '%d ??????????'],
	    m : ['?????? ???? ??????????', '?????????? ??????????', ['??????????????', '??????????????'], '%d ??????????', '%d ??????????', '%d ??????????'],
	    h : ['?????? ???? ????????', '???????? ??????????', ['????????????', '????????????'], '%d ??????????', '%d ????????', '%d ????????'],
	    d : ['?????? ???? ??????', '?????? ????????', ['??????????', '??????????'], '%d ????????', '%d ??????????', '%d ??????'],
	    M : ['?????? ???? ??????', '?????? ????????', ['??????????', '??????????'], '%d ????????', '%d ????????', '%d ??????'],
	    y : ['?????? ???? ??????', '?????? ????????', ['??????????', '??????????'], '%d ??????????', '%d ??????????', '%d ??????']
	};
	var pluralize = function (u) {
	    return function (number, withoutSuffix, string, isFuture) {
	        var f = pluralForm(number),
	            str = plurals[u][pluralForm(number)];
	        if (f === 2) {
	            str = str[withoutSuffix ? 0 : 1];
	        }
	        return str.replace(/%d/i, number);
	    };
	};
	var months = [
	    '??????????',
	    '????????????',
	    '????????',
	    '??????????',
	    '????????',
	    '??????????',
	    '??????????',
	    '??????????',
	    '????????????',
	    '????????????',
	    '????????????',
	    '????????????'
	];

	var arLy = moment.defineLocale('ar-ly', {
	    months : months,
	    monthsShort : months,
	    weekdays : '??????????_??????????????_????????????????_????????????????_????????????_????????????_??????????'.split('_'),
	    weekdaysShort : '??????_??????????_????????????_????????????_????????_????????_??????'.split('_'),
	    weekdaysMin : '??_??_??_??_??_??_??'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'D/\u200FM/\u200FYYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    meridiemParse: /??|??/,
	    isPM : function (input) {
	        return '??' === input;
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 12) {
	            return '??';
	        } else {
	            return '??';
	        }
	    },
	    calendar : {
	        sameDay: '[?????????? ?????? ????????????] LT',
	        nextDay: '[???????? ?????? ????????????] LT',
	        nextWeek: 'dddd [?????? ????????????] LT',
	        lastDay: '[?????? ?????? ????????????] LT',
	        lastWeek: 'dddd [?????? ????????????] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : '?????? %s',
	        past : '?????? %s',
	        s : pluralize('s'),
	        m : pluralize('m'),
	        mm : pluralize('m'),
	        h : pluralize('h'),
	        hh : pluralize('h'),
	        d : pluralize('d'),
	        dd : pluralize('d'),
	        M : pluralize('M'),
	        MM : pluralize('M'),
	        y : pluralize('y'),
	        yy : pluralize('y')
	    },
	    preparse: function (string) {
	        return string.replace(/\u200f/g, '').replace(/??/g, ',');
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        }).replace(/,/g, '??');
	    },
	    week : {
	        dow : 6, // Saturday is the first day of the week.
	        doy : 12  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return arLy;

	})));


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Arabic (Morocco) [ar-ma]
	//! author : ElFadili Yassine : https://github.com/ElFadiliY
	//! author : Abdel Said : https://github.com/abdelsaid

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var arMa = moment.defineLocale('ar-ma', {
	    months : '??????????_????????????_????????_??????????_??????_??????????_????????????_??????_??????????_????????????_??????????_??????????'.split('_'),
	    monthsShort : '??????????_????????????_????????_??????????_??????_??????????_????????????_??????_??????????_????????????_??????????_??????????'.split('_'),
	    weekdays : '??????????_??????????????_????????????????_????????????????_????????????_????????????_??????????'.split('_'),
	    weekdaysShort : '??????_??????????_????????????_????????????_????????_????????_??????'.split('_'),
	    weekdaysMin : '??_??_??_??_??_??_??'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[?????????? ?????? ????????????] LT',
	        nextDay: '[?????? ?????? ????????????] LT',
	        nextWeek: 'dddd [?????? ????????????] LT',
	        lastDay: '[?????? ?????? ????????????] LT',
	        lastWeek: 'dddd [?????? ????????????] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : '???? %s',
	        past : '?????? %s',
	        s : '????????',
	        m : '??????????',
	        mm : '%d ??????????',
	        h : '????????',
	        hh : '%d ??????????',
	        d : '??????',
	        dd : '%d ????????',
	        M : '??????',
	        MM : '%d ????????',
	        y : '??????',
	        yy : '%d ??????????'
	    },
	    week : {
	        dow : 6, // Saturday is the first day of the week.
	        doy : 12  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return arMa;

	})));


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Arabic (Saudi Arabia) [ar-sa]
	//! author : Suhail Alkowaileet : https://github.com/xsoh

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var symbolMap = {
	    '1': '??',
	    '2': '??',
	    '3': '??',
	    '4': '??',
	    '5': '??',
	    '6': '??',
	    '7': '??',
	    '8': '??',
	    '9': '??',
	    '0': '??'
	};
	var numberMap = {
	    '??': '1',
	    '??': '2',
	    '??': '3',
	    '??': '4',
	    '??': '5',
	    '??': '6',
	    '??': '7',
	    '??': '8',
	    '??': '9',
	    '??': '0'
	};

	var arSa = moment.defineLocale('ar-sa', {
	    months : '??????????_????????????_????????_??????????_????????_??????????_??????????_??????????_????????????_????????????_????????????_????????????'.split('_'),
	    monthsShort : '??????????_????????????_????????_??????????_????????_??????????_??????????_??????????_????????????_????????????_????????????_????????????'.split('_'),
	    weekdays : '??????????_??????????????_????????????????_????????????????_????????????_????????????_??????????'.split('_'),
	    weekdaysShort : '??????_??????????_????????????_????????????_????????_????????_??????'.split('_'),
	    weekdaysMin : '??_??_??_??_??_??_??'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    meridiemParse: /??|??/,
	    isPM : function (input) {
	        return '??' === input;
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 12) {
	            return '??';
	        } else {
	            return '??';
	        }
	    },
	    calendar : {
	        sameDay: '[?????????? ?????? ????????????] LT',
	        nextDay: '[?????? ?????? ????????????] LT',
	        nextWeek: 'dddd [?????? ????????????] LT',
	        lastDay: '[?????? ?????? ????????????] LT',
	        lastWeek: 'dddd [?????? ????????????] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : '???? %s',
	        past : '?????? %s',
	        s : '????????',
	        m : '??????????',
	        mm : '%d ??????????',
	        h : '????????',
	        hh : '%d ??????????',
	        d : '??????',
	        dd : '%d ????????',
	        M : '??????',
	        MM : '%d ????????',
	        y : '??????',
	        yy : '%d ??????????'
	    },
	    preparse: function (string) {
	        return string.replace(/[????????????????????]/g, function (match) {
	            return numberMap[match];
	        }).replace(/??/g, ',');
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        }).replace(/,/g, '??');
	    },
	    week : {
	        dow : 0, // Sunday is the first day of the week.
	        doy : 6  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return arSa;

	})));


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale  :  Arabic (Tunisia) [ar-tn]
	//! author : Nader Toukabri : https://github.com/naderio

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var arTn = moment.defineLocale('ar-tn', {
	    months: '??????????_??????????_????????_??????????_??????_????????_????????????_??????_????????????_????????????_????????????_????????????'.split('_'),
	    monthsShort: '??????????_??????????_????????_??????????_??????_????????_????????????_??????_????????????_????????????_????????????_????????????'.split('_'),
	    weekdays: '??????????_??????????????_????????????????_????????????????_????????????_????????????_??????????'.split('_'),
	    weekdaysShort: '??????_??????????_????????????_????????????_????????_????????_??????'.split('_'),
	    weekdaysMin: '??_??_??_??_??_??_??'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat: {
	        LT: 'HH:mm',
	        LTS: 'HH:mm:ss',
	        L: 'DD/MM/YYYY',
	        LL: 'D MMMM YYYY',
	        LLL: 'D MMMM YYYY HH:mm',
	        LLLL: 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar: {
	        sameDay: '[?????????? ?????? ????????????] LT',
	        nextDay: '[?????? ?????? ????????????] LT',
	        nextWeek: 'dddd [?????? ????????????] LT',
	        lastDay: '[?????? ?????? ????????????] LT',
	        lastWeek: 'dddd [?????? ????????????] LT',
	        sameElse: 'L'
	    },
	    relativeTime: {
	        future: '???? %s',
	        past: '?????? %s',
	        s: '????????',
	        m: '??????????',
	        mm: '%d ??????????',
	        h: '????????',
	        hh: '%d ??????????',
	        d: '??????',
	        dd: '%d ????????',
	        M: '??????',
	        MM: '%d ????????',
	        y: '??????',
	        yy: '%d ??????????'
	    },
	    week: {
	        dow: 1, // Monday is the first day of the week.
	        doy: 4 // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return arTn;

	})));


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Azerbaijani [az]
	//! author : topchiyev : https://github.com/topchiyev

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var suffixes = {
	    1: '-inci',
	    5: '-inci',
	    8: '-inci',
	    70: '-inci',
	    80: '-inci',
	    2: '-nci',
	    7: '-nci',
	    20: '-nci',
	    50: '-nci',
	    3: '-??nc??',
	    4: '-??nc??',
	    100: '-??nc??',
	    6: '-nc??',
	    9: '-uncu',
	    10: '-uncu',
	    30: '-uncu',
	    60: '-??nc??',
	    90: '-??nc??'
	};

	var az = moment.defineLocale('az', {
	    months : 'yanvar_fevral_mart_aprel_may_iyun_iyul_avqust_sentyabr_oktyabr_noyabr_dekabr'.split('_'),
	    monthsShort : 'yan_fev_mar_apr_may_iyn_iyl_avq_sen_okt_noy_dek'.split('_'),
	    weekdays : 'Bazar_Bazar ert??si_????r????nb?? ax??am??_????r????nb??_C??m?? ax??am??_C??m??_????nb??'.split('_'),
	    weekdaysShort : 'Baz_BzE_??Ax_????r_CAx_C??m_????n'.split('_'),
	    weekdaysMin : 'Bz_BE_??A_????_CA_C??_????'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[bug??n saat] LT',
	        nextDay : '[sabah saat] LT',
	        nextWeek : '[g??l??n h??ft??] dddd [saat] LT',
	        lastDay : '[d??n??n] LT',
	        lastWeek : '[ke????n h??ft??] dddd [saat] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s sonra',
	        past : '%s ??vv??l',
	        s : 'birne???? saniyy??',
	        m : 'bir d??qiq??',
	        mm : '%d d??qiq??',
	        h : 'bir saat',
	        hh : '%d saat',
	        d : 'bir g??n',
	        dd : '%d g??n',
	        M : 'bir ay',
	        MM : '%d ay',
	        y : 'bir il',
	        yy : '%d il'
	    },
	    meridiemParse: /gec??|s??h??r|g??nd??z|ax??am/,
	    isPM : function (input) {
	        return /^(g??nd??z|ax??am)$/.test(input);
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 4) {
	            return 'gec??';
	        } else if (hour < 12) {
	            return 's??h??r';
	        } else if (hour < 17) {
	            return 'g??nd??z';
	        } else {
	            return 'ax??am';
	        }
	    },
	    ordinalParse: /\d{1,2}-(??nc??|inci|nci|??nc??|nc??|uncu)/,
	    ordinal : function (number) {
	        if (number === 0) {  // special case for zero
	            return number + '-??nc??';
	        }
	        var a = number % 10,
	            b = number % 100 - a,
	            c = number >= 100 ? 100 : null;
	        return number + (suffixes[a] || suffixes[b] || suffixes[c]);
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return az;

	})));


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Belarusian [be]
	//! author : Dmitry Demidov : https://github.com/demidov91
	//! author: Praleska: http://praleska.pro/
	//! Author : Menelion Elens??le : https://github.com/Oire

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	function plural(word, num) {
	    var forms = word.split('_');
	    return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
	}
	function relativeTimeWithPlural(number, withoutSuffix, key) {
	    var format = {
	        'mm': withoutSuffix ? '??????????????_??????????????_????????????' : '??????????????_??????????????_????????????',
	        'hh': withoutSuffix ? '??????????????_??????????????_????????????' : '??????????????_??????????????_????????????',
	        'dd': '??????????_??????_????????',
	        'MM': '??????????_????????????_??????????????',
	        'yy': '??????_????????_??????????'
	    };
	    if (key === 'm') {
	        return withoutSuffix ? '??????????????' : '??????????????';
	    }
	    else if (key === 'h') {
	        return withoutSuffix ? '??????????????' : '??????????????';
	    }
	    else {
	        return number + ' ' + plural(format[key], +number);
	    }
	}

	var be = moment.defineLocale('be', {
	    months : {
	        format: '????????????????_????????????_????????????????_??????????????????_????????????_??????????????_????????????_????????????_??????????????_??????????????????????_??????????????????_????????????'.split('_'),
	        standalone: '????????????????_????????_??????????????_????????????????_??????????????_??????????????_????????????_??????????????_????????????????_????????????????????_????????????????_??????????????'.split('_')
	    },
	    monthsShort : '????????_??????_??????_????????_????????_????????_??????_????????_??????_????????_????????_????????'.split('_'),
	    weekdays : {
	        format: '??????????????_????????????????????_??????????????_????????????_????????????_??????????????_????????????'.split('_'),
	        standalone: '??????????????_????????????????????_??????????????_????????????_????????????_??????????????_????????????'.split('_'),
	        isFormat: /\[ ?[????] ?(?:??????????????|??????????????????)? ?\] ?dddd/
	    },
	    weekdaysShort : '????_????_????_????_????_????_????'.split('_'),
	    weekdaysMin : '????_????_????_????_????_????_????'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY ??.',
	        LLL : 'D MMMM YYYY ??., HH:mm',
	        LLLL : 'dddd, D MMMM YYYY ??., HH:mm'
	    },
	    calendar : {
	        sameDay: '[?????????? ??] LT',
	        nextDay: '[???????????? ??] LT',
	        lastDay: '[?????????? ??] LT',
	        nextWeek: function () {
	            return '[??] dddd [??] LT';
	        },
	        lastWeek: function () {
	            switch (this.day()) {
	                case 0:
	                case 3:
	                case 5:
	                case 6:
	                    return '[?? ??????????????] dddd [??] LT';
	                case 1:
	                case 2:
	                case 4:
	                    return '[?? ????????????] dddd [??] LT';
	            }
	        },
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : '???????? %s',
	        past : '%s ????????',
	        s : '???????????????? ????????????',
	        m : relativeTimeWithPlural,
	        mm : relativeTimeWithPlural,
	        h : relativeTimeWithPlural,
	        hh : relativeTimeWithPlural,
	        d : '??????????',
	        dd : relativeTimeWithPlural,
	        M : '??????????',
	        MM : relativeTimeWithPlural,
	        y : '??????',
	        yy : relativeTimeWithPlural
	    },
	    meridiemParse: /????????|????????????|??????|????????????/,
	    isPM : function (input) {
	        return /^(??????|????????????)$/.test(input);
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 4) {
	            return '????????';
	        } else if (hour < 12) {
	            return '????????????';
	        } else if (hour < 17) {
	            return '??????';
	        } else {
	            return '????????????';
	        }
	    },
	    ordinalParse: /\d{1,2}-(??|??|????)/,
	    ordinal: function (number, period) {
	        switch (period) {
	            case 'M':
	            case 'd':
	            case 'DDD':
	            case 'w':
	            case 'W':
	                return (number % 10 === 2 || number % 10 === 3) && (number % 100 !== 12 && number % 100 !== 13) ? number + '-??' : number + '-??';
	            case 'D':
	                return number + '-????';
	            default:
	                return number;
	        }
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return be;

	})));


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Bulgarian [bg]
	//! author : Krasen Borisov : https://github.com/kraz

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var bg = moment.defineLocale('bg', {
	    months : '????????????_????????????????_????????_??????????_??????_??????_??????_????????????_??????????????????_????????????????_??????????????_????????????????'.split('_'),
	    monthsShort : '??????_??????_??????_??????_??????_??????_??????_??????_??????_??????_??????_??????'.split('_'),
	    weekdays : '????????????_????????????????????_??????????????_??????????_??????????????????_??????????_????????????'.split('_'),
	    weekdaysShort : '??????_??????_??????_??????_??????_??????_??????'.split('_'),
	    weekdaysMin : '????_????_????_????_????_????_????'.split('_'),
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'D.MM.YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY H:mm',
	        LLLL : 'dddd, D MMMM YYYY H:mm'
	    },
	    calendar : {
	        sameDay : '[???????? ??] LT',
	        nextDay : '[???????? ??] LT',
	        nextWeek : 'dddd [??] LT',
	        lastDay : '[?????????? ??] LT',
	        lastWeek : function () {
	            switch (this.day()) {
	                case 0:
	                case 3:
	                case 6:
	                    return '[?? ????????????????????] dddd [??] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[?? ??????????????????] dddd [??] LT';
	            }
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '???????? %s',
	        past : '?????????? %s',
	        s : '?????????????? ??????????????',
	        m : '????????????',
	        mm : '%d ????????????',
	        h : '??????',
	        hh : '%d ????????',
	        d : '??????',
	        dd : '%d ??????',
	        M : '??????????',
	        MM : '%d ????????????',
	        y : '????????????',
	        yy : '%d ????????????'
	    },
	    ordinalParse: /\d{1,2}-(????|????|????|????|????|????)/,
	    ordinal : function (number) {
	        var lastDigit = number % 10,
	            last2Digits = number % 100;
	        if (number === 0) {
	            return number + '-????';
	        } else if (last2Digits === 0) {
	            return number + '-????';
	        } else if (last2Digits > 10 && last2Digits < 20) {
	            return number + '-????';
	        } else if (lastDigit === 1) {
	            return number + '-????';
	        } else if (lastDigit === 2) {
	            return number + '-????';
	        } else if (lastDigit === 7 || lastDigit === 8) {
	            return number + '-????';
	        } else {
	            return number + '-????';
	        }
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return bg;

	})));


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Bengali [bn]
	//! author : Kaushik Gandhi : https://github.com/kaushikgandhi

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var symbolMap = {
	    '1': '???',
	    '2': '???',
	    '3': '???',
	    '4': '???',
	    '5': '???',
	    '6': '???',
	    '7': '???',
	    '8': '???',
	    '9': '???',
	    '0': '???'
	};
	var numberMap = {
	    '???': '1',
	    '???': '2',
	    '???': '3',
	    '???': '4',
	    '???': '5',
	    '???': '6',
	    '???': '7',
	    '???': '8',
	    '???': '9',
	    '???': '0'
	};

	var bn = moment.defineLocale('bn', {
	    months : '????????????????????????_??????????????????????????????_???????????????_??????????????????_??????_?????????_???????????????_???????????????_??????????????????????????????_?????????????????????_?????????????????????_????????????????????????'.split('_'),
	    monthsShort : '????????????_?????????_???????????????_????????????_??????_?????????_?????????_??????_???????????????_???????????????_?????????_????????????'.split('_'),
	    weekdays : '??????????????????_??????????????????_????????????????????????_??????????????????_?????????????????????????????????_????????????????????????_??????????????????'.split('_'),
	    weekdaysShort : '?????????_?????????_???????????????_?????????_????????????????????????_???????????????_?????????'.split('_'),
	    weekdaysMin : '?????????_?????????_????????????_?????????_????????????_???????????????_?????????'.split('_'),
	    longDateFormat : {
	        LT : 'A h:mm ?????????',
	        LTS : 'A h:mm:ss ?????????',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY, A h:mm ?????????',
	        LLLL : 'dddd, D MMMM YYYY, A h:mm ?????????'
	    },
	    calendar : {
	        sameDay : '[??????] LT',
	        nextDay : '[????????????????????????] LT',
	        nextWeek : 'dddd, LT',
	        lastDay : '[???????????????] LT',
	        lastWeek : '[??????] dddd, LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s ?????????',
	        past : '%s ?????????',
	        s : '???????????? ?????????????????????',
	        m : '?????? ???????????????',
	        mm : '%d ???????????????',
	        h : '?????? ???????????????',
	        hh : '%d ???????????????',
	        d : '?????? ?????????',
	        dd : '%d ?????????',
	        M : '?????? ?????????',
	        MM : '%d ?????????',
	        y : '?????? ?????????',
	        yy : '%d ?????????'
	    },
	    preparse: function (string) {
	        return string.replace(/[??????????????????????????????]/g, function (match) {
	            return numberMap[match];
	        });
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        });
	    },
	    meridiemParse: /?????????|????????????|???????????????|???????????????|?????????/,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if ((meridiem === '?????????' && hour >= 4) ||
	                (meridiem === '???????????????' && hour < 5) ||
	                meridiem === '???????????????') {
	            return hour + 12;
	        } else {
	            return hour;
	        }
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 4) {
	            return '?????????';
	        } else if (hour < 10) {
	            return '????????????';
	        } else if (hour < 17) {
	            return '???????????????';
	        } else if (hour < 20) {
	            return '???????????????';
	        } else {
	            return '?????????';
	        }
	    },
	    week : {
	        dow : 0, // Sunday is the first day of the week.
	        doy : 6  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return bn;

	})));


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Tibetan [bo]
	//! author : Thupten N. Chakrishar : https://github.com/vajradog

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var symbolMap = {
	    '1': '???',
	    '2': '???',
	    '3': '???',
	    '4': '???',
	    '5': '???',
	    '6': '???',
	    '7': '???',
	    '8': '???',
	    '9': '???',
	    '0': '???'
	};
	var numberMap = {
	    '???': '1',
	    '???': '2',
	    '???': '3',
	    '???': '4',
	    '???': '5',
	    '???': '6',
	    '???': '7',
	    '???': '8',
	    '???': '9',
	    '???': '0'
	};

	var bo = moment.defineLocale('bo', {
	    months : '??????????????????????????????_?????????????????????????????????_?????????????????????????????????_??????????????????????????????_???????????????????????????_?????????????????????????????????_?????????????????????????????????_????????????????????????????????????_??????????????????????????????_??????????????????????????????_?????????????????????????????????????????????_?????????????????????????????????????????????'.split('_'),
	    monthsShort : '??????????????????????????????_?????????????????????????????????_?????????????????????????????????_??????????????????????????????_???????????????????????????_?????????????????????????????????_?????????????????????????????????_????????????????????????????????????_??????????????????????????????_??????????????????????????????_?????????????????????????????????????????????_?????????????????????????????????????????????'.split('_'),
	    weekdays : '???????????????????????????_???????????????????????????_????????????????????????????????????_??????????????????????????????_??????????????????????????????_??????????????????????????????_?????????????????????????????????'.split('_'),
	    weekdaysShort : '???????????????_???????????????_????????????????????????_??????????????????_??????????????????_??????????????????_?????????????????????'.split('_'),
	    weekdaysMin : '???????????????_???????????????_????????????????????????_??????????????????_??????????????????_??????????????????_?????????????????????'.split('_'),
	    longDateFormat : {
	        LT : 'A h:mm',
	        LTS : 'A h:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY, A h:mm',
	        LLLL : 'dddd, D MMMM YYYY, A h:mm'
	    },
	    calendar : {
	        sameDay : '[??????????????????] LT',
	        nextDay : '[??????????????????] LT',
	        nextWeek : '[?????????????????????????????????????????????], LT',
	        lastDay : '[????????????] LT',
	        lastWeek : '[??????????????????????????????????????????] dddd, LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s ??????',
	        past : '%s ???????????????',
	        s : '???????????????',
	        m : '??????????????????????????????',
	        mm : '%d ???????????????',
	        h : '?????????????????????????????????',
	        hh : '%d ??????????????????',
	        d : '????????????????????????',
	        dd : '%d ????????????',
	        M : '???????????????????????????',
	        MM : '%d ????????????',
	        y : '?????????????????????',
	        yy : '%d ??????'
	    },
	    preparse: function (string) {
	        return string.replace(/[??????????????????????????????]/g, function (match) {
	            return numberMap[match];
	        });
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        });
	    },
	    meridiemParse: /??????????????????|?????????????????????|?????????????????????|?????????????????????|??????????????????/,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if ((meridiem === '??????????????????' && hour >= 4) ||
	                (meridiem === '?????????????????????' && hour < 5) ||
	                meridiem === '?????????????????????') {
	            return hour + 12;
	        } else {
	            return hour;
	        }
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 4) {
	            return '??????????????????';
	        } else if (hour < 10) {
	            return '?????????????????????';
	        } else if (hour < 17) {
	            return '?????????????????????';
	        } else if (hour < 20) {
	            return '?????????????????????';
	        } else {
	            return '??????????????????';
	        }
	    },
	    week : {
	        dow : 0, // Sunday is the first day of the week.
	        doy : 6  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return bo;

	})));


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Breton [br]
	//! author : Jean-Baptiste Le Duigou : https://github.com/jbleduigou

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	function relativeTimeWithMutation(number, withoutSuffix, key) {
	    var format = {
	        'mm': 'munutenn',
	        'MM': 'miz',
	        'dd': 'devezh'
	    };
	    return number + ' ' + mutation(format[key], number);
	}
	function specialMutationForYears(number) {
	    switch (lastNumber(number)) {
	        case 1:
	        case 3:
	        case 4:
	        case 5:
	        case 9:
	            return number + ' bloaz';
	        default:
	            return number + ' vloaz';
	    }
	}
	function lastNumber(number) {
	    if (number > 9) {
	        return lastNumber(number % 10);
	    }
	    return number;
	}
	function mutation(text, number) {
	    if (number === 2) {
	        return softMutation(text);
	    }
	    return text;
	}
	function softMutation(text) {
	    var mutationTable = {
	        'm': 'v',
	        'b': 'v',
	        'd': 'z'
	    };
	    if (mutationTable[text.charAt(0)] === undefined) {
	        return text;
	    }
	    return mutationTable[text.charAt(0)] + text.substring(1);
	}

	var br = moment.defineLocale('br', {
	    months : 'Genver_C\'hwevrer_Meurzh_Ebrel_Mae_Mezheven_Gouere_Eost_Gwengolo_Here_Du_Kerzu'.split('_'),
	    monthsShort : 'Gen_C\'hwe_Meu_Ebr_Mae_Eve_Gou_Eos_Gwe_Her_Du_Ker'.split('_'),
	    weekdays : 'Sul_Lun_Meurzh_Merc\'her_Yaou_Gwener_Sadorn'.split('_'),
	    weekdaysShort : 'Sul_Lun_Meu_Mer_Yao_Gwe_Sad'.split('_'),
	    weekdaysMin : 'Su_Lu_Me_Mer_Ya_Gw_Sa'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'h[e]mm A',
	        LTS : 'h[e]mm:ss A',
	        L : 'DD/MM/YYYY',
	        LL : 'D [a viz] MMMM YYYY',
	        LLL : 'D [a viz] MMMM YYYY h[e]mm A',
	        LLLL : 'dddd, D [a viz] MMMM YYYY h[e]mm A'
	    },
	    calendar : {
	        sameDay : '[Hiziv da] LT',
	        nextDay : '[Warc\'hoazh da] LT',
	        nextWeek : 'dddd [da] LT',
	        lastDay : '[Dec\'h da] LT',
	        lastWeek : 'dddd [paset da] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'a-benn %s',
	        past : '%s \'zo',
	        s : 'un nebeud segondenno??',
	        m : 'ur vunutenn',
	        mm : relativeTimeWithMutation,
	        h : 'un eur',
	        hh : '%d eur',
	        d : 'un devezh',
	        dd : relativeTimeWithMutation,
	        M : 'ur miz',
	        MM : relativeTimeWithMutation,
	        y : 'ur bloaz',
	        yy : specialMutationForYears
	    },
	    ordinalParse: /\d{1,2}(a??|vet)/,
	    ordinal : function (number) {
	        var output = (number === 1) ? 'a??' : 'vet';
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return br;

	})));


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Bosnian [bs]
	//! author : Nedim Cholich : https://github.com/frontyard
	//! based on (hr) translation by Bojan Markovi??

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	function translate(number, withoutSuffix, key) {
	    var result = number + ' ';
	    switch (key) {
	        case 'm':
	            return withoutSuffix ? 'jedna minuta' : 'jedne minute';
	        case 'mm':
	            if (number === 1) {
	                result += 'minuta';
	            } else if (number === 2 || number === 3 || number === 4) {
	                result += 'minute';
	            } else {
	                result += 'minuta';
	            }
	            return result;
	        case 'h':
	            return withoutSuffix ? 'jedan sat' : 'jednog sata';
	        case 'hh':
	            if (number === 1) {
	                result += 'sat';
	            } else if (number === 2 || number === 3 || number === 4) {
	                result += 'sata';
	            } else {
	                result += 'sati';
	            }
	            return result;
	        case 'dd':
	            if (number === 1) {
	                result += 'dan';
	            } else {
	                result += 'dana';
	            }
	            return result;
	        case 'MM':
	            if (number === 1) {
	                result += 'mjesec';
	            } else if (number === 2 || number === 3 || number === 4) {
	                result += 'mjeseca';
	            } else {
	                result += 'mjeseci';
	            }
	            return result;
	        case 'yy':
	            if (number === 1) {
	                result += 'godina';
	            } else if (number === 2 || number === 3 || number === 4) {
	                result += 'godine';
	            } else {
	                result += 'godina';
	            }
	            return result;
	    }
	}

	var bs = moment.defineLocale('bs', {
	    months : 'januar_februar_mart_april_maj_juni_juli_august_septembar_oktobar_novembar_decembar'.split('_'),
	    monthsShort : 'jan._feb._mar._apr._maj._jun._jul._aug._sep._okt._nov._dec.'.split('_'),
	    monthsParseExact: true,
	    weekdays : 'nedjelja_ponedjeljak_utorak_srijeda_??etvrtak_petak_subota'.split('_'),
	    weekdaysShort : 'ned._pon._uto._sri._??et._pet._sub.'.split('_'),
	    weekdaysMin : 'ne_po_ut_sr_??e_pe_su'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D. MMMM YYYY',
	        LLL : 'D. MMMM YYYY H:mm',
	        LLLL : 'dddd, D. MMMM YYYY H:mm'
	    },
	    calendar : {
	        sameDay  : '[danas u] LT',
	        nextDay  : '[sutra u] LT',
	        nextWeek : function () {
	            switch (this.day()) {
	                case 0:
	                    return '[u] [nedjelju] [u] LT';
	                case 3:
	                    return '[u] [srijedu] [u] LT';
	                case 6:
	                    return '[u] [subotu] [u] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[u] dddd [u] LT';
	            }
	        },
	        lastDay  : '[ju??er u] LT',
	        lastWeek : function () {
	            switch (this.day()) {
	                case 0:
	                case 3:
	                    return '[pro??lu] dddd [u] LT';
	                case 6:
	                    return '[pro??le] [subote] [u] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[pro??li] dddd [u] LT';
	            }
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'za %s',
	        past   : 'prije %s',
	        s      : 'par sekundi',
	        m      : translate,
	        mm     : translate,
	        h      : translate,
	        hh     : translate,
	        d      : 'dan',
	        dd     : translate,
	        M      : 'mjesec',
	        MM     : translate,
	        y      : 'godinu',
	        yy     : translate
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return bs;

	})));


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Catalan [ca]
	//! author : Juan G. Hurtado : https://github.com/juanghurtado

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var ca = moment.defineLocale('ca', {
	    months : 'gener_febrer_mar??_abril_maig_juny_juliol_agost_setembre_octubre_novembre_desembre'.split('_'),
	    monthsShort : 'gen._febr._mar._abr._mai._jun._jul._ag._set._oct._nov._des.'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'diumenge_dilluns_dimarts_dimecres_dijous_divendres_dissabte'.split('_'),
	    weekdaysShort : 'dg._dl._dt._dc._dj._dv._ds.'.split('_'),
	    weekdaysMin : 'Dg_Dl_Dt_Dc_Dj_Dv_Ds'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY H:mm',
	        LLLL : 'dddd D MMMM YYYY H:mm'
	    },
	    calendar : {
	        sameDay : function () {
	            return '[avui a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
	        },
	        nextDay : function () {
	            return '[dem?? a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
	        },
	        nextWeek : function () {
	            return 'dddd [a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
	        },
	        lastDay : function () {
	            return '[ahir a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
	        },
	        lastWeek : function () {
	            return '[el] dddd [passat a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'd\'aqu?? %s',
	        past : 'fa %s',
	        s : 'uns segons',
	        m : 'un minut',
	        mm : '%d minuts',
	        h : 'una hora',
	        hh : '%d hores',
	        d : 'un dia',
	        dd : '%d dies',
	        M : 'un mes',
	        MM : '%d mesos',
	        y : 'un any',
	        yy : '%d anys'
	    },
	    ordinalParse: /\d{1,2}(r|n|t|??|a)/,
	    ordinal : function (number, period) {
	        var output = (number === 1) ? 'r' :
	            (number === 2) ? 'n' :
	            (number === 3) ? 'r' :
	            (number === 4) ? 't' : '??';
	        if (period === 'w' || period === 'W') {
	            output = 'a';
	        }
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return ca;

	})));


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Czech [cs]
	//! author : petrbela : https://github.com/petrbela

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var months = 'leden_??nor_b??ezen_duben_kv??ten_??erven_??ervenec_srpen_z??????_????jen_listopad_prosinec'.split('_');
	var monthsShort = 'led_??no_b??e_dub_kv??_??vn_??vc_srp_z????_????j_lis_pro'.split('_');
	function plural(n) {
	    return (n > 1) && (n < 5) && (~~(n / 10) !== 1);
	}
	function translate(number, withoutSuffix, key, isFuture) {
	    var result = number + ' ';
	    switch (key) {
	        case 's':  // a few seconds / in a few seconds / a few seconds ago
	            return (withoutSuffix || isFuture) ? 'p??r sekund' : 'p??r sekundami';
	        case 'm':  // a minute / in a minute / a minute ago
	            return withoutSuffix ? 'minuta' : (isFuture ? 'minutu' : 'minutou');
	        case 'mm': // 9 minutes / in 9 minutes / 9 minutes ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'minuty' : 'minut');
	            } else {
	                return result + 'minutami';
	            }
	            break;
	        case 'h':  // an hour / in an hour / an hour ago
	            return withoutSuffix ? 'hodina' : (isFuture ? 'hodinu' : 'hodinou');
	        case 'hh': // 9 hours / in 9 hours / 9 hours ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'hodiny' : 'hodin');
	            } else {
	                return result + 'hodinami';
	            }
	            break;
	        case 'd':  // a day / in a day / a day ago
	            return (withoutSuffix || isFuture) ? 'den' : 'dnem';
	        case 'dd': // 9 days / in 9 days / 9 days ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'dny' : 'dn??');
	            } else {
	                return result + 'dny';
	            }
	            break;
	        case 'M':  // a month / in a month / a month ago
	            return (withoutSuffix || isFuture) ? 'm??s??c' : 'm??s??cem';
	        case 'MM': // 9 months / in 9 months / 9 months ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'm??s??ce' : 'm??s??c??');
	            } else {
	                return result + 'm??s??ci';
	            }
	            break;
	        case 'y':  // a year / in a year / a year ago
	            return (withoutSuffix || isFuture) ? 'rok' : 'rokem';
	        case 'yy': // 9 years / in 9 years / 9 years ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'roky' : 'let');
	            } else {
	                return result + 'lety';
	            }
	            break;
	    }
	}

	var cs = moment.defineLocale('cs', {
	    months : months,
	    monthsShort : monthsShort,
	    monthsParse : (function (months, monthsShort) {
	        var i, _monthsParse = [];
	        for (i = 0; i < 12; i++) {
	            // use custom parser to solve problem with July (??ervenec)
	            _monthsParse[i] = new RegExp('^' + months[i] + '$|^' + monthsShort[i] + '$', 'i');
	        }
	        return _monthsParse;
	    }(months, monthsShort)),
	    shortMonthsParse : (function (monthsShort) {
	        var i, _shortMonthsParse = [];
	        for (i = 0; i < 12; i++) {
	            _shortMonthsParse[i] = new RegExp('^' + monthsShort[i] + '$', 'i');
	        }
	        return _shortMonthsParse;
	    }(monthsShort)),
	    longMonthsParse : (function (months) {
	        var i, _longMonthsParse = [];
	        for (i = 0; i < 12; i++) {
	            _longMonthsParse[i] = new RegExp('^' + months[i] + '$', 'i');
	        }
	        return _longMonthsParse;
	    }(months)),
	    weekdays : 'ned??le_pond??l??_??ter??_st??eda_??tvrtek_p??tek_sobota'.split('_'),
	    weekdaysShort : 'ne_po_??t_st_??t_p??_so'.split('_'),
	    weekdaysMin : 'ne_po_??t_st_??t_p??_so'.split('_'),
	    longDateFormat : {
	        LT: 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D. MMMM YYYY',
	        LLL : 'D. MMMM YYYY H:mm',
	        LLLL : 'dddd D. MMMM YYYY H:mm',
	        l : 'D. M. YYYY'
	    },
	    calendar : {
	        sameDay: '[dnes v] LT',
	        nextDay: '[z??tra v] LT',
	        nextWeek: function () {
	            switch (this.day()) {
	                case 0:
	                    return '[v ned??li v] LT';
	                case 1:
	                case 2:
	                    return '[v] dddd [v] LT';
	                case 3:
	                    return '[ve st??edu v] LT';
	                case 4:
	                    return '[ve ??tvrtek v] LT';
	                case 5:
	                    return '[v p??tek v] LT';
	                case 6:
	                    return '[v sobotu v] LT';
	            }
	        },
	        lastDay: '[v??era v] LT',
	        lastWeek: function () {
	            switch (this.day()) {
	                case 0:
	                    return '[minulou ned??li v] LT';
	                case 1:
	                case 2:
	                    return '[minul??] dddd [v] LT';
	                case 3:
	                    return '[minulou st??edu v] LT';
	                case 4:
	                case 5:
	                    return '[minul??] dddd [v] LT';
	                case 6:
	                    return '[minulou sobotu v] LT';
	            }
	        },
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'za %s',
	        past : 'p??ed %s',
	        s : translate,
	        m : translate,
	        mm : translate,
	        h : translate,
	        hh : translate,
	        d : translate,
	        dd : translate,
	        M : translate,
	        MM : translate,
	        y : translate,
	        yy : translate
	    },
	    ordinalParse : /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return cs;

	})));


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Chuvash [cv]
	//! author : Anatoly Mironov : https://github.com/mirontoli

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var cv = moment.defineLocale('cv', {
	    months : '????????????_??????????_??????_??????_??????_????????????_??????_??????????_????????_??????_??????_????????????'.split('_'),
	    monthsShort : '??????_??????_??????_??????_??????_??????_??????_??????_??????_??????_??????_??????'.split('_'),
	    weekdays : '??????????????????????_????????????????_??????????????????_??????????_??????????????????????_??????????????_????????????????'.split('_'),
	    weekdaysShort : '??????_??????_??????_????_??????_??????_??????'.split('_'),
	    weekdaysMin : '????_????_????_????_????_????_????'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD-MM-YYYY',
	        LL : 'YYYY [??????????] MMMM [????????????] D[-????????]',
	        LLL : 'YYYY [??????????] MMMM [????????????] D[-????????], HH:mm',
	        LLLL : 'dddd, YYYY [??????????] MMMM [????????????] D[-????????], HH:mm'
	    },
	    calendar : {
	        sameDay: '[????????] LT [??????????????]',
	        nextDay: '[????????] LT [??????????????]',
	        lastDay: '[????????] LT [??????????????]',
	        nextWeek: '[??????????] dddd LT [??????????????]',
	        lastWeek: '[??????????] dddd LT [??????????????]',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : function (output) {
	            var affix = /??????????$/i.exec(output) ? '??????' : /??????$/i.exec(output) ? '??????' : '??????';
	            return output + affix;
	        },
	        past : '%s ????????????',
	        s : '??????-???? ??????????????',
	        m : '?????? ??????????',
	        mm : '%d ??????????',
	        h : '?????? ??????????',
	        hh : '%d ??????????',
	        d : '?????? ??????',
	        dd : '%d ??????',
	        M : '?????? ????????',
	        MM : '%d ????????',
	        y : '?????? ??????',
	        yy : '%d ??????'
	    },
	    ordinalParse: /\d{1,2}-??????/,
	    ordinal : '%d-??????',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return cv;

	})));


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Welsh [cy]
	//! author : Robert Allen : https://github.com/robgallen
	//! author : https://github.com/ryangreaves

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var cy = moment.defineLocale('cy', {
	    months: 'Ionawr_Chwefror_Mawrth_Ebrill_Mai_Mehefin_Gorffennaf_Awst_Medi_Hydref_Tachwedd_Rhagfyr'.split('_'),
	    monthsShort: 'Ion_Chwe_Maw_Ebr_Mai_Meh_Gor_Aws_Med_Hyd_Tach_Rhag'.split('_'),
	    weekdays: 'Dydd Sul_Dydd Llun_Dydd Mawrth_Dydd Mercher_Dydd Iau_Dydd Gwener_Dydd Sadwrn'.split('_'),
	    weekdaysShort: 'Sul_Llun_Maw_Mer_Iau_Gwe_Sad'.split('_'),
	    weekdaysMin: 'Su_Ll_Ma_Me_Ia_Gw_Sa'.split('_'),
	    weekdaysParseExact : true,
	    // time formats are the same as en-gb
	    longDateFormat: {
	        LT: 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L: 'DD/MM/YYYY',
	        LL: 'D MMMM YYYY',
	        LLL: 'D MMMM YYYY HH:mm',
	        LLLL: 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar: {
	        sameDay: '[Heddiw am] LT',
	        nextDay: '[Yfory am] LT',
	        nextWeek: 'dddd [am] LT',
	        lastDay: '[Ddoe am] LT',
	        lastWeek: 'dddd [diwethaf am] LT',
	        sameElse: 'L'
	    },
	    relativeTime: {
	        future: 'mewn %s',
	        past: '%s yn ??l',
	        s: 'ychydig eiliadau',
	        m: 'munud',
	        mm: '%d munud',
	        h: 'awr',
	        hh: '%d awr',
	        d: 'diwrnod',
	        dd: '%d diwrnod',
	        M: 'mis',
	        MM: '%d mis',
	        y: 'blwyddyn',
	        yy: '%d flynedd'
	    },
	    ordinalParse: /\d{1,2}(fed|ain|af|il|ydd|ed|eg)/,
	    // traditional ordinal numbers above 31 are not commonly used in colloquial Welsh
	    ordinal: function (number) {
	        var b = number,
	            output = '',
	            lookup = [
	                '', 'af', 'il', 'ydd', 'ydd', 'ed', 'ed', 'ed', 'fed', 'fed', 'fed', // 1af to 10fed
	                'eg', 'fed', 'eg', 'eg', 'fed', 'eg', 'eg', 'fed', 'eg', 'fed' // 11eg to 20fed
	            ];
	        if (b > 20) {
	            if (b === 40 || b === 50 || b === 60 || b === 80 || b === 100) {
	                output = 'fed'; // not 30ain, 70ain or 90ain
	            } else {
	                output = 'ain';
	            }
	        } else if (b > 0) {
	            output = lookup[b];
	        }
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return cy;

	})));


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Danish [da]
	//! author : Ulrik Nielsen : https://github.com/mrbase

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var da = moment.defineLocale('da', {
	    months : 'januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december'.split('_'),
	    monthsShort : 'jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec'.split('_'),
	    weekdays : 's??ndag_mandag_tirsdag_onsdag_torsdag_fredag_l??rdag'.split('_'),
	    weekdaysShort : 's??n_man_tir_ons_tor_fre_l??r'.split('_'),
	    weekdaysMin : 's??_ma_ti_on_to_fr_l??'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D. MMMM YYYY',
	        LLL : 'D. MMMM YYYY HH:mm',
	        LLLL : 'dddd [d.] D. MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[I dag kl.] LT',
	        nextDay : '[I morgen kl.] LT',
	        nextWeek : 'dddd [kl.] LT',
	        lastDay : '[I g??r kl.] LT',
	        lastWeek : '[sidste] dddd [kl] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'om %s',
	        past : '%s siden',
	        s : 'f?? sekunder',
	        m : 'et minut',
	        mm : '%d minutter',
	        h : 'en time',
	        hh : '%d timer',
	        d : 'en dag',
	        dd : '%d dage',
	        M : 'en m??ned',
	        MM : '%d m??neder',
	        y : 'et ??r',
	        yy : '%d ??r'
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return da;

	})));


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : German [de]
	//! author : lluchs : https://github.com/lluchs
	//! author: Menelion Elens??le: https://github.com/Oire
	//! author : Mikolaj Dadela : https://github.com/mik01aj

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	function processRelativeTime(number, withoutSuffix, key, isFuture) {
	    var format = {
	        'm': ['eine Minute', 'einer Minute'],
	        'h': ['eine Stunde', 'einer Stunde'],
	        'd': ['ein Tag', 'einem Tag'],
	        'dd': [number + ' Tage', number + ' Tagen'],
	        'M': ['ein Monat', 'einem Monat'],
	        'MM': [number + ' Monate', number + ' Monaten'],
	        'y': ['ein Jahr', 'einem Jahr'],
	        'yy': [number + ' Jahre', number + ' Jahren']
	    };
	    return withoutSuffix ? format[key][0] : format[key][1];
	}

	var de = moment.defineLocale('de', {
	    months : 'Januar_Februar_M??rz_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
	    monthsShort : 'Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
	    weekdaysShort : 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
	    weekdaysMin : 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT: 'HH:mm',
	        LTS: 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D. MMMM YYYY',
	        LLL : 'D. MMMM YYYY HH:mm',
	        LLLL : 'dddd, D. MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[heute um] LT [Uhr]',
	        sameElse: 'L',
	        nextDay: '[morgen um] LT [Uhr]',
	        nextWeek: 'dddd [um] LT [Uhr]',
	        lastDay: '[gestern um] LT [Uhr]',
	        lastWeek: '[letzten] dddd [um] LT [Uhr]'
	    },
	    relativeTime : {
	        future : 'in %s',
	        past : 'vor %s',
	        s : 'ein paar Sekunden',
	        m : processRelativeTime,
	        mm : '%d Minuten',
	        h : processRelativeTime,
	        hh : '%d Stunden',
	        d : processRelativeTime,
	        dd : processRelativeTime,
	        M : processRelativeTime,
	        MM : processRelativeTime,
	        y : processRelativeTime,
	        yy : processRelativeTime
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return de;

	})));


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : German (Austria) [de-at]
	//! author : lluchs : https://github.com/lluchs
	//! author: Menelion Elens??le: https://github.com/Oire
	//! author : Martin Groller : https://github.com/MadMG
	//! author : Mikolaj Dadela : https://github.com/mik01aj

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	function processRelativeTime(number, withoutSuffix, key, isFuture) {
	    var format = {
	        'm': ['eine Minute', 'einer Minute'],
	        'h': ['eine Stunde', 'einer Stunde'],
	        'd': ['ein Tag', 'einem Tag'],
	        'dd': [number + ' Tage', number + ' Tagen'],
	        'M': ['ein Monat', 'einem Monat'],
	        'MM': [number + ' Monate', number + ' Monaten'],
	        'y': ['ein Jahr', 'einem Jahr'],
	        'yy': [number + ' Jahre', number + ' Jahren']
	    };
	    return withoutSuffix ? format[key][0] : format[key][1];
	}

	var deAt = moment.defineLocale('de-at', {
	    months : 'J??nner_Februar_M??rz_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
	    monthsShort : 'J??n._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
	    weekdaysShort : 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
	    weekdaysMin : 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT: 'HH:mm',
	        LTS: 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D. MMMM YYYY',
	        LLL : 'D. MMMM YYYY HH:mm',
	        LLLL : 'dddd, D. MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[heute um] LT [Uhr]',
	        sameElse: 'L',
	        nextDay: '[morgen um] LT [Uhr]',
	        nextWeek: 'dddd [um] LT [Uhr]',
	        lastDay: '[gestern um] LT [Uhr]',
	        lastWeek: '[letzten] dddd [um] LT [Uhr]'
	    },
	    relativeTime : {
	        future : 'in %s',
	        past : 'vor %s',
	        s : 'ein paar Sekunden',
	        m : processRelativeTime,
	        mm : '%d Minuten',
	        h : processRelativeTime,
	        hh : '%d Stunden',
	        d : processRelativeTime,
	        dd : processRelativeTime,
	        M : processRelativeTime,
	        MM : processRelativeTime,
	        y : processRelativeTime,
	        yy : processRelativeTime
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return deAt;

	})));


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Maldivian [dv]
	//! author : Jawish Hameed : https://github.com/jawish

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var months = [
	    '????????????????',
	    '????????????????????',
	    '????????????',
	    '????????????????',
	    '????',
	    '????????',
	    '????????????',
	    '????????????????',
	    '????????????????????????',
	    '????????????????????',
	    '????????????????????',
	    '????????????????????'
	];
	var weekdays = [
	    '????????????????',
	    '????????',
	    '????????????????',
	    '????????',
	    '????????????????????',
	    '????????????',
	    '????????????????'
	];

	var dv = moment.defineLocale('dv', {
	    months : months,
	    monthsShort : months,
	    weekdays : weekdays,
	    weekdaysShort : weekdays,
	    weekdaysMin : '????????_????????_????????_????????_????????_????????_????????'.split('_'),
	    longDateFormat : {

	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'D/M/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    meridiemParse: /????|????/,
	    isPM : function (input) {
	        return '????' === input;
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 12) {
	            return '????';
	        } else {
	            return '????';
	        }
	    },
	    calendar : {
	        sameDay : '[????????????] LT',
	        nextDay : '[????????????] LT',
	        nextWeek : 'dddd LT',
	        lastDay : '[????????????] LT',
	        lastWeek : '[????????????????] dddd LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '???????????????? %s',
	        past : '???????????? %s',
	        s : '????????????????????????????',
	        m : '????????????????',
	        mm : '???????????? %d',
	        h : '????????????????????',
	        hh : '???????????????? %d',
	        d : '????????????????',
	        dd : '???????????? %d',
	        M : '????????????',
	        MM : '???????? %d',
	        y : '????????????????',
	        yy : '???????????? %d'
	    },
	    preparse: function (string) {
	        return string.replace(/??/g, ',');
	    },
	    postformat: function (string) {
	        return string.replace(/,/g, '??');
	    },
	    week : {
	        dow : 7,  // Sunday is the first day of the week.
	        doy : 12  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return dv;

	})));


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Greek [el]
	//! author : Aggelos Karalias : https://github.com/mehiel

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';

	function isFunction(input) {
	    return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
	}


	var el = moment.defineLocale('el', {
	    monthsNominativeEl : '????????????????????_??????????????????????_??????????????_????????????????_??????????_??????????????_??????????????_??????????????????_??????????????????????_??????????????????_??????????????????_????????????????????'.split('_'),
	    monthsGenitiveEl : '????????????????????_??????????????????????_??????????????_????????????????_??????????_??????????????_??????????????_??????????????????_??????????????????????_??????????????????_??????????????????_????????????????????'.split('_'),
	    months : function (momentToFormat, format) {
	        if (/D/.test(format.substring(0, format.indexOf('MMMM')))) { // if there is a day number before 'MMMM'
	            return this._monthsGenitiveEl[momentToFormat.month()];
	        } else {
	            return this._monthsNominativeEl[momentToFormat.month()];
	        }
	    },
	    monthsShort : '??????_??????_??????_??????_??????_????????_????????_??????_??????_??????_??????_??????'.split('_'),
	    weekdays : '??????????????_??????????????_??????????_??????????????_????????????_??????????????????_??????????????'.split('_'),
	    weekdaysShort : '??????_??????_??????_??????_??????_??????_??????'.split('_'),
	    weekdaysMin : '????_????_????_????_????_????_????'.split('_'),
	    meridiem : function (hours, minutes, isLower) {
	        if (hours > 11) {
	            return isLower ? '????' : '????';
	        } else {
	            return isLower ? '????' : '????';
	        }
	    },
	    isPM : function (input) {
	        return ((input + '').toLowerCase()[0] === '??');
	    },
	    meridiemParse : /[????]\.????\.?/i,
	    longDateFormat : {
	        LT : 'h:mm A',
	        LTS : 'h:mm:ss A',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY h:mm A',
	        LLLL : 'dddd, D MMMM YYYY h:mm A'
	    },
	    calendarEl : {
	        sameDay : '[???????????? {}] LT',
	        nextDay : '[?????????? {}] LT',
	        nextWeek : 'dddd [{}] LT',
	        lastDay : '[???????? {}] LT',
	        lastWeek : function () {
	            switch (this.day()) {
	                case 6:
	                    return '[???? ??????????????????????] dddd [{}] LT';
	                default:
	                    return '[?????? ??????????????????????] dddd [{}] LT';
	            }
	        },
	        sameElse : 'L'
	    },
	    calendar : function (key, mom) {
	        var output = this._calendarEl[key],
	            hours = mom && mom.hours();
	        if (isFunction(output)) {
	            output = output.apply(mom);
	        }
	        return output.replace('{}', (hours % 12 === 1 ? '??????' : '????????'));
	    },
	    relativeTime : {
	        future : '???? %s',
	        past : '%s ????????',
	        s : '???????? ????????????????????????',
	        m : '?????? ??????????',
	        mm : '%d ??????????',
	        h : '?????? ??????',
	        hh : '%d ????????',
	        d : '?????? ????????',
	        dd : '%d ??????????',
	        M : '???????? ??????????',
	        MM : '%d ??????????',
	        y : '???????? ????????????',
	        yy : '%d ????????????'
	    },
	    ordinalParse: /\d{1,2}??/,
	    ordinal: '%d??',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4st is the first week of the year.
	    }
	});

	return el;

	})));


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : English (Australia) [en-au]
	//! author : Jared Morse : https://github.com/jarcoal

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var enAu = moment.defineLocale('en-au', {
	    months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
	    monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
	    weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
	    weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
	    weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
	    longDateFormat : {
	        LT : 'h:mm A',
	        LTS : 'h:mm:ss A',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY h:mm A',
	        LLLL : 'dddd, D MMMM YYYY h:mm A'
	    },
	    calendar : {
	        sameDay : '[Today at] LT',
	        nextDay : '[Tomorrow at] LT',
	        nextWeek : 'dddd [at] LT',
	        lastDay : '[Yesterday at] LT',
	        lastWeek : '[Last] dddd [at] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'in %s',
	        past : '%s ago',
	        s : 'a few seconds',
	        m : 'a minute',
	        mm : '%d minutes',
	        h : 'an hour',
	        hh : '%d hours',
	        d : 'a day',
	        dd : '%d days',
	        M : 'a month',
	        MM : '%d months',
	        y : 'a year',
	        yy : '%d years'
	    },
	    ordinalParse: /\d{1,2}(st|nd|rd|th)/,
	    ordinal : function (number) {
	        var b = number % 10,
	            output = (~~(number % 100 / 10) === 1) ? 'th' :
	            (b === 1) ? 'st' :
	            (b === 2) ? 'nd' :
	            (b === 3) ? 'rd' : 'th';
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return enAu;

	})));


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : English (Canada) [en-ca]
	//! author : Jonathan Abourbih : https://github.com/jonbca

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var enCa = moment.defineLocale('en-ca', {
	    months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
	    monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
	    weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
	    weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
	    weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
	    longDateFormat : {
	        LT : 'h:mm A',
	        LTS : 'h:mm:ss A',
	        L : 'YYYY-MM-DD',
	        LL : 'MMMM D, YYYY',
	        LLL : 'MMMM D, YYYY h:mm A',
	        LLLL : 'dddd, MMMM D, YYYY h:mm A'
	    },
	    calendar : {
	        sameDay : '[Today at] LT',
	        nextDay : '[Tomorrow at] LT',
	        nextWeek : 'dddd [at] LT',
	        lastDay : '[Yesterday at] LT',
	        lastWeek : '[Last] dddd [at] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'in %s',
	        past : '%s ago',
	        s : 'a few seconds',
	        m : 'a minute',
	        mm : '%d minutes',
	        h : 'an hour',
	        hh : '%d hours',
	        d : 'a day',
	        dd : '%d days',
	        M : 'a month',
	        MM : '%d months',
	        y : 'a year',
	        yy : '%d years'
	    },
	    ordinalParse: /\d{1,2}(st|nd|rd|th)/,
	    ordinal : function (number) {
	        var b = number % 10,
	            output = (~~(number % 100 / 10) === 1) ? 'th' :
	            (b === 1) ? 'st' :
	            (b === 2) ? 'nd' :
	            (b === 3) ? 'rd' : 'th';
	        return number + output;
	    }
	});

	return enCa;

	})));


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : English (United Kingdom) [en-gb]
	//! author : Chris Gedrim : https://github.com/chrisgedrim

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var enGb = moment.defineLocale('en-gb', {
	    months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
	    monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
	    weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
	    weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
	    weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[Today at] LT',
	        nextDay : '[Tomorrow at] LT',
	        nextWeek : 'dddd [at] LT',
	        lastDay : '[Yesterday at] LT',
	        lastWeek : '[Last] dddd [at] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'in %s',
	        past : '%s ago',
	        s : 'a few seconds',
	        m : 'a minute',
	        mm : '%d minutes',
	        h : 'an hour',
	        hh : '%d hours',
	        d : 'a day',
	        dd : '%d days',
	        M : 'a month',
	        MM : '%d months',
	        y : 'a year',
	        yy : '%d years'
	    },
	    ordinalParse: /\d{1,2}(st|nd|rd|th)/,
	    ordinal : function (number) {
	        var b = number % 10,
	            output = (~~(number % 100 / 10) === 1) ? 'th' :
	            (b === 1) ? 'st' :
	            (b === 2) ? 'nd' :
	            (b === 3) ? 'rd' : 'th';
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return enGb;

	})));


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : English (Ireland) [en-ie]
	//! author : Chris Cartlidge : https://github.com/chriscartlidge

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var enIe = moment.defineLocale('en-ie', {
	    months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
	    monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
	    weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
	    weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
	    weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD-MM-YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[Today at] LT',
	        nextDay : '[Tomorrow at] LT',
	        nextWeek : 'dddd [at] LT',
	        lastDay : '[Yesterday at] LT',
	        lastWeek : '[Last] dddd [at] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'in %s',
	        past : '%s ago',
	        s : 'a few seconds',
	        m : 'a minute',
	        mm : '%d minutes',
	        h : 'an hour',
	        hh : '%d hours',
	        d : 'a day',
	        dd : '%d days',
	        M : 'a month',
	        MM : '%d months',
	        y : 'a year',
	        yy : '%d years'
	    },
	    ordinalParse: /\d{1,2}(st|nd|rd|th)/,
	    ordinal : function (number) {
	        var b = number % 10,
	            output = (~~(number % 100 / 10) === 1) ? 'th' :
	            (b === 1) ? 'st' :
	            (b === 2) ? 'nd' :
	            (b === 3) ? 'rd' : 'th';
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return enIe;

	})));


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : English (New Zealand) [en-nz]
	//! author : Luke McGregor : https://github.com/lukemcgregor

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var enNz = moment.defineLocale('en-nz', {
	    months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
	    monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
	    weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
	    weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
	    weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
	    longDateFormat : {
	        LT : 'h:mm A',
	        LTS : 'h:mm:ss A',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY h:mm A',
	        LLLL : 'dddd, D MMMM YYYY h:mm A'
	    },
	    calendar : {
	        sameDay : '[Today at] LT',
	        nextDay : '[Tomorrow at] LT',
	        nextWeek : 'dddd [at] LT',
	        lastDay : '[Yesterday at] LT',
	        lastWeek : '[Last] dddd [at] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'in %s',
	        past : '%s ago',
	        s : 'a few seconds',
	        m : 'a minute',
	        mm : '%d minutes',
	        h : 'an hour',
	        hh : '%d hours',
	        d : 'a day',
	        dd : '%d days',
	        M : 'a month',
	        MM : '%d months',
	        y : 'a year',
	        yy : '%d years'
	    },
	    ordinalParse: /\d{1,2}(st|nd|rd|th)/,
	    ordinal : function (number) {
	        var b = number % 10,
	            output = (~~(number % 100 / 10) === 1) ? 'th' :
	            (b === 1) ? 'st' :
	            (b === 2) ? 'nd' :
	            (b === 3) ? 'rd' : 'th';
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return enNz;

	})));


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Esperanto [eo]
	//! author : Colin Dean : https://github.com/colindean
	//! komento: Mi estas malcerta se mi korekte traktis akuzativojn en tiu traduko.
	//!          Se ne, bonvolu korekti kaj avizi min por ke mi povas lerni!

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var eo = moment.defineLocale('eo', {
	    months : 'januaro_februaro_marto_aprilo_majo_junio_julio_a??gusto_septembro_oktobro_novembro_decembro'.split('_'),
	    monthsShort : 'jan_feb_mar_apr_maj_jun_jul_a??g_sep_okt_nov_dec'.split('_'),
	    weekdays : 'Diman??o_Lundo_Mardo_Merkredo_??a??do_Vendredo_Sabato'.split('_'),
	    weekdaysShort : 'Dim_Lun_Mard_Merk_??a??_Ven_Sab'.split('_'),
	    weekdaysMin : 'Di_Lu_Ma_Me_??a_Ve_Sa'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'YYYY-MM-DD',
	        LL : 'D[-an de] MMMM, YYYY',
	        LLL : 'D[-an de] MMMM, YYYY HH:mm',
	        LLLL : 'dddd, [la] D[-an de] MMMM, YYYY HH:mm'
	    },
	    meridiemParse: /[ap]\.t\.m/i,
	    isPM: function (input) {
	        return input.charAt(0).toLowerCase() === 'p';
	    },
	    meridiem : function (hours, minutes, isLower) {
	        if (hours > 11) {
	            return isLower ? 'p.t.m.' : 'P.T.M.';
	        } else {
	            return isLower ? 'a.t.m.' : 'A.T.M.';
	        }
	    },
	    calendar : {
	        sameDay : '[Hodia?? je] LT',
	        nextDay : '[Morga?? je] LT',
	        nextWeek : 'dddd [je] LT',
	        lastDay : '[Hiera?? je] LT',
	        lastWeek : '[pasinta] dddd [je] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'je %s',
	        past : 'anta?? %s',
	        s : 'sekundoj',
	        m : 'minuto',
	        mm : '%d minutoj',
	        h : 'horo',
	        hh : '%d horoj',
	        d : 'tago',//ne 'diurno', ??ar estas uzita por proksimumo
	        dd : '%d tagoj',
	        M : 'monato',
	        MM : '%d monatoj',
	        y : 'jaro',
	        yy : '%d jaroj'
	    },
	    ordinalParse: /\d{1,2}a/,
	    ordinal : '%da',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return eo;

	})));


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Spanish [es]
	//! author : Julio Napur?? : https://github.com/julionc

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var monthsShortDot = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_');
	var monthsShort = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');

	var es = moment.defineLocale('es', {
	    months : 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
	    monthsShort : function (m, format) {
	        if (/-MMM-/.test(format)) {
	            return monthsShort[m.month()];
	        } else {
	            return monthsShortDot[m.month()];
	        }
	    },
	    monthsParseExact : true,
	    weekdays : 'domingo_lunes_martes_mi??rcoles_jueves_viernes_s??bado'.split('_'),
	    weekdaysShort : 'dom._lun._mar._mi??._jue._vie._s??b.'.split('_'),
	    weekdaysMin : 'do_lu_ma_mi_ju_vi_s??'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D [de] MMMM [de] YYYY',
	        LLL : 'D [de] MMMM [de] YYYY H:mm',
	        LLLL : 'dddd, D [de] MMMM [de] YYYY H:mm'
	    },
	    calendar : {
	        sameDay : function () {
	            return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        nextDay : function () {
	            return '[ma??ana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        nextWeek : function () {
	            return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        lastDay : function () {
	            return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        lastWeek : function () {
	            return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'en %s',
	        past : 'hace %s',
	        s : 'unos segundos',
	        m : 'un minuto',
	        mm : '%d minutos',
	        h : 'una hora',
	        hh : '%d horas',
	        d : 'un d??a',
	        dd : '%d d??as',
	        M : 'un mes',
	        MM : '%d meses',
	        y : 'un a??o',
	        yy : '%d a??os'
	    },
	    ordinalParse : /\d{1,2}??/,
	    ordinal : '%d??',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return es;

	})));


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Spanish (Dominican Republic) [es-do]

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var monthsShortDot = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_');
	var monthsShort = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');

	var esDo = moment.defineLocale('es-do', {
	    months : 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
	    monthsShort : function (m, format) {
	        if (/-MMM-/.test(format)) {
	            return monthsShort[m.month()];
	        } else {
	            return monthsShortDot[m.month()];
	        }
	    },
	    monthsParseExact : true,
	    weekdays : 'domingo_lunes_martes_mi??rcoles_jueves_viernes_s??bado'.split('_'),
	    weekdaysShort : 'dom._lun._mar._mi??._jue._vie._s??b.'.split('_'),
	    weekdaysMin : 'do_lu_ma_mi_ju_vi_s??'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'h:mm A',
	        LTS : 'h:mm:ss A',
	        L : 'DD/MM/YYYY',
	        LL : 'D [de] MMMM [de] YYYY',
	        LLL : 'D [de] MMMM [de] YYYY h:mm A',
	        LLLL : 'dddd, D [de] MMMM [de] YYYY h:mm A'
	    },
	    calendar : {
	        sameDay : function () {
	            return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        nextDay : function () {
	            return '[ma??ana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        nextWeek : function () {
	            return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        lastDay : function () {
	            return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        lastWeek : function () {
	            return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'en %s',
	        past : 'hace %s',
	        s : 'unos segundos',
	        m : 'un minuto',
	        mm : '%d minutos',
	        h : 'una hora',
	        hh : '%d horas',
	        d : 'un d??a',
	        dd : '%d d??as',
	        M : 'un mes',
	        MM : '%d meses',
	        y : 'un a??o',
	        yy : '%d a??os'
	    },
	    ordinalParse : /\d{1,2}??/,
	    ordinal : '%d??',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return esDo;

	})));


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Estonian [et]
	//! author : Henry Kehlmann : https://github.com/madhenry
	//! improvements : Illimar Tambek : https://github.com/ragulka

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	function processRelativeTime(number, withoutSuffix, key, isFuture) {
	    var format = {
	        's' : ['m??ne sekundi', 'm??ni sekund', 'paar sekundit'],
	        'm' : ['??he minuti', '??ks minut'],
	        'mm': [number + ' minuti', number + ' minutit'],
	        'h' : ['??he tunni', 'tund aega', '??ks tund'],
	        'hh': [number + ' tunni', number + ' tundi'],
	        'd' : ['??he p??eva', '??ks p??ev'],
	        'M' : ['kuu aja', 'kuu aega', '??ks kuu'],
	        'MM': [number + ' kuu', number + ' kuud'],
	        'y' : ['??he aasta', 'aasta', '??ks aasta'],
	        'yy': [number + ' aasta', number + ' aastat']
	    };
	    if (withoutSuffix) {
	        return format[key][2] ? format[key][2] : format[key][1];
	    }
	    return isFuture ? format[key][0] : format[key][1];
	}

	var et = moment.defineLocale('et', {
	    months        : 'jaanuar_veebruar_m??rts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember'.split('_'),
	    monthsShort   : 'jaan_veebr_m??rts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets'.split('_'),
	    weekdays      : 'p??hap??ev_esmasp??ev_teisip??ev_kolmap??ev_neljap??ev_reede_laup??ev'.split('_'),
	    weekdaysShort : 'P_E_T_K_N_R_L'.split('_'),
	    weekdaysMin   : 'P_E_T_K_N_R_L'.split('_'),
	    longDateFormat : {
	        LT   : 'H:mm',
	        LTS : 'H:mm:ss',
	        L    : 'DD.MM.YYYY',
	        LL   : 'D. MMMM YYYY',
	        LLL  : 'D. MMMM YYYY H:mm',
	        LLLL : 'dddd, D. MMMM YYYY H:mm'
	    },
	    calendar : {
	        sameDay  : '[T??na,] LT',
	        nextDay  : '[Homme,] LT',
	        nextWeek : '[J??rgmine] dddd LT',
	        lastDay  : '[Eile,] LT',
	        lastWeek : '[Eelmine] dddd LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s p??rast',
	        past   : '%s tagasi',
	        s      : processRelativeTime,
	        m      : processRelativeTime,
	        mm     : processRelativeTime,
	        h      : processRelativeTime,
	        hh     : processRelativeTime,
	        d      : processRelativeTime,
	        dd     : '%d p??eva',
	        M      : processRelativeTime,
	        MM     : processRelativeTime,
	        y      : processRelativeTime,
	        yy     : processRelativeTime
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return et;

	})));


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Basque [eu]
	//! author : Eneko Illarramendi : https://github.com/eillarra

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var eu = moment.defineLocale('eu', {
	    months : 'urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua'.split('_'),
	    monthsShort : 'urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata'.split('_'),
	    weekdaysShort : 'ig._al._ar._az._og._ol._lr.'.split('_'),
	    weekdaysMin : 'ig_al_ar_az_og_ol_lr'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'YYYY-MM-DD',
	        LL : 'YYYY[ko] MMMM[ren] D[a]',
	        LLL : 'YYYY[ko] MMMM[ren] D[a] HH:mm',
	        LLLL : 'dddd, YYYY[ko] MMMM[ren] D[a] HH:mm',
	        l : 'YYYY-M-D',
	        ll : 'YYYY[ko] MMM D[a]',
	        lll : 'YYYY[ko] MMM D[a] HH:mm',
	        llll : 'ddd, YYYY[ko] MMM D[a] HH:mm'
	    },
	    calendar : {
	        sameDay : '[gaur] LT[etan]',
	        nextDay : '[bihar] LT[etan]',
	        nextWeek : 'dddd LT[etan]',
	        lastDay : '[atzo] LT[etan]',
	        lastWeek : '[aurreko] dddd LT[etan]',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s barru',
	        past : 'duela %s',
	        s : 'segundo batzuk',
	        m : 'minutu bat',
	        mm : '%d minutu',
	        h : 'ordu bat',
	        hh : '%d ordu',
	        d : 'egun bat',
	        dd : '%d egun',
	        M : 'hilabete bat',
	        MM : '%d hilabete',
	        y : 'urte bat',
	        yy : '%d urte'
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return eu;

	})));


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Persian [fa]
	//! author : Ebrahim Byagowi : https://github.com/ebraminio

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var symbolMap = {
	    '1': '??',
	    '2': '??',
	    '3': '??',
	    '4': '??',
	    '5': '??',
	    '6': '??',
	    '7': '??',
	    '8': '??',
	    '9': '??',
	    '0': '??'
	};
	var numberMap = {
	    '??': '1',
	    '??': '2',
	    '??': '3',
	    '??': '4',
	    '??': '5',
	    '??': '6',
	    '??': '7',
	    '??': '8',
	    '??': '9',
	    '??': '0'
	};

	var fa = moment.defineLocale('fa', {
	    months : '????????????_??????????_????????_??????????_????_????????_??????????_??????_??????????????_??????????_????????????_????????????'.split('_'),
	    monthsShort : '????????????_??????????_????????_??????????_????_????????_??????????_??????_??????????????_??????????_????????????_????????????'.split('_'),
	    weekdays : '????\u200c????????_????????????_????\u200c????????_????????????????_??????\u200c????????_????????_????????'.split('_'),
	    weekdaysShort : '????\u200c????????_????????????_????\u200c????????_????????????????_??????\u200c????????_????????_????????'.split('_'),
	    weekdaysMin : '??_??_??_??_??_??_??'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    meridiemParse: /?????? ???? ??????|?????? ???? ??????/,
	    isPM: function (input) {
	        return /?????? ???? ??????/.test(input);
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 12) {
	            return '?????? ???? ??????';
	        } else {
	            return '?????? ???? ??????';
	        }
	    },
	    calendar : {
	        sameDay : '[?????????? ????????] LT',
	        nextDay : '[???????? ????????] LT',
	        nextWeek : 'dddd [????????] LT',
	        lastDay : '[?????????? ????????] LT',
	        lastWeek : 'dddd [??????] [????????] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '???? %s',
	        past : '%s ??????',
	        s : '?????????? ??????????',
	        m : '???? ??????????',
	        mm : '%d ??????????',
	        h : '???? ????????',
	        hh : '%d ????????',
	        d : '???? ??????',
	        dd : '%d ??????',
	        M : '???? ??????',
	        MM : '%d ??????',
	        y : '???? ??????',
	        yy : '%d ??????'
	    },
	    preparse: function (string) {
	        return string.replace(/[??-??]/g, function (match) {
	            return numberMap[match];
	        }).replace(/??/g, ',');
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        }).replace(/,/g, '??');
	    },
	    ordinalParse: /\d{1,2}??/,
	    ordinal : '%d??',
	    week : {
	        dow : 6, // Saturday is the first day of the week.
	        doy : 12 // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return fa;

	})));


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Finnish [fi]
	//! author : Tarmo Aidantausta : https://github.com/bleadof

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var numbersPast = 'nolla yksi kaksi kolme nelj?? viisi kuusi seitsem??n kahdeksan yhdeks??n'.split(' ');
	var numbersFuture = [
	        'nolla', 'yhden', 'kahden', 'kolmen', 'nelj??n', 'viiden', 'kuuden',
	        numbersPast[7], numbersPast[8], numbersPast[9]
	    ];
	function translate(number, withoutSuffix, key, isFuture) {
	    var result = '';
	    switch (key) {
	        case 's':
	            return isFuture ? 'muutaman sekunnin' : 'muutama sekunti';
	        case 'm':
	            return isFuture ? 'minuutin' : 'minuutti';
	        case 'mm':
	            result = isFuture ? 'minuutin' : 'minuuttia';
	            break;
	        case 'h':
	            return isFuture ? 'tunnin' : 'tunti';
	        case 'hh':
	            result = isFuture ? 'tunnin' : 'tuntia';
	            break;
	        case 'd':
	            return isFuture ? 'p??iv??n' : 'p??iv??';
	        case 'dd':
	            result = isFuture ? 'p??iv??n' : 'p??iv????';
	            break;
	        case 'M':
	            return isFuture ? 'kuukauden' : 'kuukausi';
	        case 'MM':
	            result = isFuture ? 'kuukauden' : 'kuukautta';
	            break;
	        case 'y':
	            return isFuture ? 'vuoden' : 'vuosi';
	        case 'yy':
	            result = isFuture ? 'vuoden' : 'vuotta';
	            break;
	    }
	    result = verbalNumber(number, isFuture) + ' ' + result;
	    return result;
	}
	function verbalNumber(number, isFuture) {
	    return number < 10 ? (isFuture ? numbersFuture[number] : numbersPast[number]) : number;
	}

	var fi = moment.defineLocale('fi', {
	    months : 'tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kes??kuu_hein??kuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu'.split('_'),
	    monthsShort : 'tammi_helmi_maalis_huhti_touko_kes??_hein??_elo_syys_loka_marras_joulu'.split('_'),
	    weekdays : 'sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai'.split('_'),
	    weekdaysShort : 'su_ma_ti_ke_to_pe_la'.split('_'),
	    weekdaysMin : 'su_ma_ti_ke_to_pe_la'.split('_'),
	    longDateFormat : {
	        LT : 'HH.mm',
	        LTS : 'HH.mm.ss',
	        L : 'DD.MM.YYYY',
	        LL : 'Do MMMM[ta] YYYY',
	        LLL : 'Do MMMM[ta] YYYY, [klo] HH.mm',
	        LLLL : 'dddd, Do MMMM[ta] YYYY, [klo] HH.mm',
	        l : 'D.M.YYYY',
	        ll : 'Do MMM YYYY',
	        lll : 'Do MMM YYYY, [klo] HH.mm',
	        llll : 'ddd, Do MMM YYYY, [klo] HH.mm'
	    },
	    calendar : {
	        sameDay : '[t??n????n] [klo] LT',
	        nextDay : '[huomenna] [klo] LT',
	        nextWeek : 'dddd [klo] LT',
	        lastDay : '[eilen] [klo] LT',
	        lastWeek : '[viime] dddd[na] [klo] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s p????st??',
	        past : '%s sitten',
	        s : translate,
	        m : translate,
	        mm : translate,
	        h : translate,
	        hh : translate,
	        d : translate,
	        dd : translate,
	        M : translate,
	        MM : translate,
	        y : translate,
	        yy : translate
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return fi;

	})));


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Faroese [fo]
	//! author : Ragnar Johannesen : https://github.com/ragnar123

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var fo = moment.defineLocale('fo', {
	    months : 'januar_februar_mars_apr??l_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
	    monthsShort : 'jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_'),
	    weekdays : 'sunnudagur_m??nadagur_t??sdagur_mikudagur_h??sdagur_fr??ggjadagur_leygardagur'.split('_'),
	    weekdaysShort : 'sun_m??n_t??s_mik_h??s_fr??_ley'.split('_'),
	    weekdaysMin : 'su_m??_t??_mi_h??_fr_le'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D. MMMM, YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[?? dag kl.] LT',
	        nextDay : '[?? morgin kl.] LT',
	        nextWeek : 'dddd [kl.] LT',
	        lastDay : '[?? gj??r kl.] LT',
	        lastWeek : '[s????stu] dddd [kl] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'um %s',
	        past : '%s s????ani',
	        s : 'f?? sekund',
	        m : 'ein minutt',
	        mm : '%d minuttir',
	        h : 'ein t??mi',
	        hh : '%d t??mar',
	        d : 'ein dagur',
	        dd : '%d dagar',
	        M : 'ein m??na??i',
	        MM : '%d m??na??ir',
	        y : 'eitt ??r',
	        yy : '%d ??r'
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return fo;

	})));


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : French [fr]
	//! author : John Fischer : https://github.com/jfroffice

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var fr = moment.defineLocale('fr', {
	    months : 'janvier_f??vrier_mars_avril_mai_juin_juillet_ao??t_septembre_octobre_novembre_d??cembre'.split('_'),
	    monthsShort : 'janv._f??vr._mars_avr._mai_juin_juil._ao??t_sept._oct._nov._d??c.'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
	    weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
	    weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[Aujourd\'hui ??] LT',
	        nextDay: '[Demain ??] LT',
	        nextWeek: 'dddd [??] LT',
	        lastDay: '[Hier ??] LT',
	        lastWeek: 'dddd [dernier ??] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'dans %s',
	        past : 'il y a %s',
	        s : 'quelques secondes',
	        m : 'une minute',
	        mm : '%d minutes',
	        h : 'une heure',
	        hh : '%d heures',
	        d : 'un jour',
	        dd : '%d jours',
	        M : 'un mois',
	        MM : '%d mois',
	        y : 'un an',
	        yy : '%d ans'
	    },
	    ordinalParse: /\d{1,2}(er|)/,
	    ordinal : function (number) {
	        return number + (number === 1 ? 'er' : '');
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return fr;

	})));


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : French (Canada) [fr-ca]
	//! author : Jonathan Abourbih : https://github.com/jonbca

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var frCa = moment.defineLocale('fr-ca', {
	    months : 'janvier_f??vrier_mars_avril_mai_juin_juillet_ao??t_septembre_octobre_novembre_d??cembre'.split('_'),
	    monthsShort : 'janv._f??vr._mars_avr._mai_juin_juil._ao??t_sept._oct._nov._d??c.'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
	    weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
	    weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'YYYY-MM-DD',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[Aujourd\'hui ??] LT',
	        nextDay: '[Demain ??] LT',
	        nextWeek: 'dddd [??] LT',
	        lastDay: '[Hier ??] LT',
	        lastWeek: 'dddd [dernier ??] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'dans %s',
	        past : 'il y a %s',
	        s : 'quelques secondes',
	        m : 'une minute',
	        mm : '%d minutes',
	        h : 'une heure',
	        hh : '%d heures',
	        d : 'un jour',
	        dd : '%d jours',
	        M : 'un mois',
	        MM : '%d mois',
	        y : 'un an',
	        yy : '%d ans'
	    },
	    ordinalParse: /\d{1,2}(er|e)/,
	    ordinal : function (number) {
	        return number + (number === 1 ? 'er' : 'e');
	    }
	});

	return frCa;

	})));


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : French (Switzerland) [fr-ch]
	//! author : Gaspard Bucher : https://github.com/gaspard

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var frCh = moment.defineLocale('fr-ch', {
	    months : 'janvier_f??vrier_mars_avril_mai_juin_juillet_ao??t_septembre_octobre_novembre_d??cembre'.split('_'),
	    monthsShort : 'janv._f??vr._mars_avr._mai_juin_juil._ao??t_sept._oct._nov._d??c.'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
	    weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
	    weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[Aujourd\'hui ??] LT',
	        nextDay: '[Demain ??] LT',
	        nextWeek: 'dddd [??] LT',
	        lastDay: '[Hier ??] LT',
	        lastWeek: 'dddd [dernier ??] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'dans %s',
	        past : 'il y a %s',
	        s : 'quelques secondes',
	        m : 'une minute',
	        mm : '%d minutes',
	        h : 'une heure',
	        hh : '%d heures',
	        d : 'un jour',
	        dd : '%d jours',
	        M : 'un mois',
	        MM : '%d mois',
	        y : 'un an',
	        yy : '%d ans'
	    },
	    ordinalParse: /\d{1,2}(er|e)/,
	    ordinal : function (number) {
	        return number + (number === 1 ? 'er' : 'e');
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return frCh;

	})));


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Frisian [fy]
	//! author : Robin van der Vliet : https://github.com/robin0van0der0v

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var monthsShortWithDots = 'jan._feb._mrt._apr._mai_jun._jul._aug._sep._okt._nov._des.'.split('_');
	var monthsShortWithoutDots = 'jan_feb_mrt_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_');

	var fy = moment.defineLocale('fy', {
	    months : 'jannewaris_febrewaris_maart_april_maaie_juny_july_augustus_septimber_oktober_novimber_desimber'.split('_'),
	    monthsShort : function (m, format) {
	        if (/-MMM-/.test(format)) {
	            return monthsShortWithoutDots[m.month()];
	        } else {
	            return monthsShortWithDots[m.month()];
	        }
	    },
	    monthsParseExact : true,
	    weekdays : 'snein_moandei_tiisdei_woansdei_tongersdei_freed_sneon'.split('_'),
	    weekdaysShort : 'si._mo._ti._wo._to._fr._so.'.split('_'),
	    weekdaysMin : 'Si_Mo_Ti_Wo_To_Fr_So'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD-MM-YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[hjoed om] LT',
	        nextDay: '[moarn om] LT',
	        nextWeek: 'dddd [om] LT',
	        lastDay: '[juster om] LT',
	        lastWeek: '[??fr??ne] dddd [om] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'oer %s',
	        past : '%s lyn',
	        s : 'in pear sekonden',
	        m : 'ien min??t',
	        mm : '%d minuten',
	        h : 'ien oere',
	        hh : '%d oeren',
	        d : 'ien dei',
	        dd : '%d dagen',
	        M : 'ien moanne',
	        MM : '%d moannen',
	        y : 'ien jier',
	        yy : '%d jierren'
	    },
	    ordinalParse: /\d{1,2}(ste|de)/,
	    ordinal : function (number) {
	        return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de');
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return fy;

	})));


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Scottish Gaelic [gd]
	//! author : Jon Ashdown : https://github.com/jonashdown

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var months = [
	    'Am Faoilleach', 'An Gearran', 'Am M??rt', 'An Giblean', 'An C??itean', 'An t-??gmhios', 'An t-Iuchar', 'An L??nastal', 'An t-Sultain', 'An D??mhair', 'An t-Samhain', 'An D??bhlachd'
	];

	var monthsShort = ['Faoi', 'Gear', 'M??rt', 'Gibl', 'C??it', '??gmh', 'Iuch', 'L??n', 'Sult', 'D??mh', 'Samh', 'D??bh'];

	var weekdays = ['Did??mhnaich', 'Diluain', 'Dim??irt', 'Diciadain', 'Diardaoin', 'Dihaoine', 'Disathairne'];

	var weekdaysShort = ['Did', 'Dil', 'Dim', 'Dic', 'Dia', 'Dih', 'Dis'];

	var weekdaysMin = ['D??', 'Lu', 'M??', 'Ci', 'Ar', 'Ha', 'Sa'];

	var gd = moment.defineLocale('gd', {
	    months : months,
	    monthsShort : monthsShort,
	    monthsParseExact : true,
	    weekdays : weekdays,
	    weekdaysShort : weekdaysShort,
	    weekdaysMin : weekdaysMin,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[An-diugh aig] LT',
	        nextDay : '[A-m??ireach aig] LT',
	        nextWeek : 'dddd [aig] LT',
	        lastDay : '[An-d?? aig] LT',
	        lastWeek : 'dddd [seo chaidh] [aig] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'ann an %s',
	        past : 'bho chionn %s',
	        s : 'beagan diogan',
	        m : 'mionaid',
	        mm : '%d mionaidean',
	        h : 'uair',
	        hh : '%d uairean',
	        d : 'latha',
	        dd : '%d latha',
	        M : 'm??os',
	        MM : '%d m??osan',
	        y : 'bliadhna',
	        yy : '%d bliadhna'
	    },
	    ordinalParse : /\d{1,2}(d|na|mh)/,
	    ordinal : function (number) {
	        var output = number === 1 ? 'd' : number % 10 === 2 ? 'na' : 'mh';
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return gd;

	})));


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Galician [gl]
	//! author : Juan G. Hurtado : https://github.com/juanghurtado

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var gl = moment.defineLocale('gl', {
	    months : 'xaneiro_febreiro_marzo_abril_maio_xu??o_xullo_agosto_setembro_outubro_novembro_decembro'.split('_'),
	    monthsShort : 'xan._feb._mar._abr._mai._xu??._xul._ago._set._out._nov._dec.'.split('_'),
	    monthsParseExact: true,
	    weekdays : 'domingo_luns_martes_m??rcores_xoves_venres_s??bado'.split('_'),
	    weekdaysShort : 'dom._lun._mar._m??r._xov._ven._s??b.'.split('_'),
	    weekdaysMin : 'do_lu_ma_m??_xo_ve_s??'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D [de] MMMM [de] YYYY',
	        LLL : 'D [de] MMMM [de] YYYY H:mm',
	        LLLL : 'dddd, D [de] MMMM [de] YYYY H:mm'
	    },
	    calendar : {
	        sameDay : function () {
	            return '[hoxe ' + ((this.hours() !== 1) ? '??s' : '??') + '] LT';
	        },
	        nextDay : function () {
	            return '[ma???? ' + ((this.hours() !== 1) ? '??s' : '??') + '] LT';
	        },
	        nextWeek : function () {
	            return 'dddd [' + ((this.hours() !== 1) ? '??s' : 'a') + '] LT';
	        },
	        lastDay : function () {
	            return '[onte ' + ((this.hours() !== 1) ? '??' : 'a') + '] LT';
	        },
	        lastWeek : function () {
	            return '[o] dddd [pasado ' + ((this.hours() !== 1) ? '??s' : 'a') + '] LT';
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : function (str) {
	            if (str.indexOf('un') === 0) {
	                return 'n' + str;
	            }
	            return 'en ' + str;
	        },
	        past : 'hai %s',
	        s : 'uns segundos',
	        m : 'un minuto',
	        mm : '%d minutos',
	        h : 'unha hora',
	        hh : '%d horas',
	        d : 'un d??a',
	        dd : '%d d??as',
	        M : 'un mes',
	        MM : '%d meses',
	        y : 'un ano',
	        yy : '%d anos'
	    },
	    ordinalParse : /\d{1,2}??/,
	    ordinal : '%d??',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return gl;

	})));


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Hebrew [he]
	//! author : Tomer Cohen : https://github.com/tomer
	//! author : Moshe Simantov : https://github.com/DevelopmentIL
	//! author : Tal Ater : https://github.com/TalAter

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var he = moment.defineLocale('he', {
	    months : '??????????_????????????_??????_??????????_??????_????????_????????_????????????_????????????_??????????????_????????????_??????????'.split('_'),
	    monthsShort : '????????_????????_??????_????????_??????_????????_????????_????????_????????_????????_????????_????????'.split('_'),
	    weekdays : '??????????_??????_??????????_??????????_??????????_????????_??????'.split('_'),
	    weekdaysShort : '????_????_????_????_????_????_????'.split('_'),
	    weekdaysMin : '??_??_??_??_??_??_??'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D [??]MMMM YYYY',
	        LLL : 'D [??]MMMM YYYY HH:mm',
	        LLLL : 'dddd, D [??]MMMM YYYY HH:mm',
	        l : 'D/M/YYYY',
	        ll : 'D MMM YYYY',
	        lll : 'D MMM YYYY HH:mm',
	        llll : 'ddd, D MMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[???????? ????]LT',
	        nextDay : '[?????? ????]LT',
	        nextWeek : 'dddd [????????] LT',
	        lastDay : '[?????????? ????]LT',
	        lastWeek : '[????????] dddd [???????????? ????????] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '???????? %s',
	        past : '???????? %s',
	        s : '???????? ??????????',
	        m : '??????',
	        mm : '%d ????????',
	        h : '??????',
	        hh : function (number) {
	            if (number === 2) {
	                return '????????????';
	            }
	            return number + ' ????????';
	        },
	        d : '??????',
	        dd : function (number) {
	            if (number === 2) {
	                return '????????????';
	            }
	            return number + ' ????????';
	        },
	        M : '????????',
	        MM : function (number) {
	            if (number === 2) {
	                return '??????????????';
	            }
	            return number + ' ????????????';
	        },
	        y : '??????',
	        yy : function (number) {
	            if (number === 2) {
	                return '????????????';
	            } else if (number % 10 === 0 && number !== 10) {
	                return number + ' ??????';
	            }
	            return number + ' ????????';
	        }
	    },
	    meridiemParse: /??????"??|????????"??|???????? ??????????????|???????? ??????????????|?????????? ????????|??????????|????????/i,
	    isPM : function (input) {
	        return /^(??????"??|???????? ??????????????|????????)$/.test(input);
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 5) {
	            return '?????????? ????????';
	        } else if (hour < 10) {
	            return '??????????';
	        } else if (hour < 12) {
	            return isLower ? '????????"??' : '???????? ??????????????';
	        } else if (hour < 18) {
	            return isLower ? '??????"??' : '???????? ??????????????';
	        } else {
	            return '????????';
	        }
	    }
	});

	return he;

	})));


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Hindi [hi]
	//! author : Mayank Singhal : https://github.com/mayanksinghal

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var symbolMap = {
	    '1': '???',
	    '2': '???',
	    '3': '???',
	    '4': '???',
	    '5': '???',
	    '6': '???',
	    '7': '???',
	    '8': '???',
	    '9': '???',
	    '0': '???'
	};
	var numberMap = {
	    '???': '1',
	    '???': '2',
	    '???': '3',
	    '???': '4',
	    '???': '5',
	    '???': '6',
	    '???': '7',
	    '???': '8',
	    '???': '9',
	    '???': '0'
	};

	var hi = moment.defineLocale('hi', {
	    months : '???????????????_??????????????????_???????????????_??????????????????_??????_?????????_???????????????_???????????????_?????????????????????_?????????????????????_??????????????????_?????????????????????'.split('_'),
	    monthsShort : '??????._?????????._???????????????_???????????????._??????_?????????_?????????._??????._?????????._???????????????._??????._?????????.'.split('_'),
	    monthsParseExact: true,
	    weekdays : '??????????????????_??????????????????_?????????????????????_??????????????????_?????????????????????_????????????????????????_??????????????????'.split('_'),
	    weekdaysShort : '?????????_?????????_????????????_?????????_????????????_???????????????_?????????'.split('_'),
	    weekdaysMin : '???_??????_??????_??????_??????_??????_???'.split('_'),
	    longDateFormat : {
	        LT : 'A h:mm ?????????',
	        LTS : 'A h:mm:ss ?????????',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY, A h:mm ?????????',
	        LLLL : 'dddd, D MMMM YYYY, A h:mm ?????????'
	    },
	    calendar : {
	        sameDay : '[??????] LT',
	        nextDay : '[??????] LT',
	        nextWeek : 'dddd, LT',
	        lastDay : '[??????] LT',
	        lastWeek : '[???????????????] dddd, LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s ?????????',
	        past : '%s ????????????',
	        s : '????????? ?????? ????????????',
	        m : '?????? ????????????',
	        mm : '%d ????????????',
	        h : '?????? ????????????',
	        hh : '%d ????????????',
	        d : '?????? ?????????',
	        dd : '%d ?????????',
	        M : '?????? ???????????????',
	        MM : '%d ???????????????',
	        y : '?????? ????????????',
	        yy : '%d ????????????'
	    },
	    preparse: function (string) {
	        return string.replace(/[??????????????????????????????]/g, function (match) {
	            return numberMap[match];
	        });
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        });
	    },
	    // Hindi notation for meridiems are quite fuzzy in practice. While there exists
	    // a rigid notion of a 'Pahar' it is not used as rigidly in modern Hindi.
	    meridiemParse: /?????????|????????????|???????????????|?????????/,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === '?????????') {
	            return hour < 4 ? hour : hour + 12;
	        } else if (meridiem === '????????????') {
	            return hour;
	        } else if (meridiem === '???????????????') {
	            return hour >= 10 ? hour : hour + 12;
	        } else if (meridiem === '?????????') {
	            return hour + 12;
	        }
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 4) {
	            return '?????????';
	        } else if (hour < 10) {
	            return '????????????';
	        } else if (hour < 17) {
	            return '???????????????';
	        } else if (hour < 20) {
	            return '?????????';
	        } else {
	            return '?????????';
	        }
	    },
	    week : {
	        dow : 0, // Sunday is the first day of the week.
	        doy : 6  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return hi;

	})));


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Croatian [hr]
	//! author : Bojan Markovi?? : https://github.com/bmarkovic

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	function translate(number, withoutSuffix, key) {
	    var result = number + ' ';
	    switch (key) {
	        case 'm':
	            return withoutSuffix ? 'jedna minuta' : 'jedne minute';
	        case 'mm':
	            if (number === 1) {
	                result += 'minuta';
	            } else if (number === 2 || number === 3 || number === 4) {
	                result += 'minute';
	            } else {
	                result += 'minuta';
	            }
	            return result;
	        case 'h':
	            return withoutSuffix ? 'jedan sat' : 'jednog sata';
	        case 'hh':
	            if (number === 1) {
	                result += 'sat';
	            } else if (number === 2 || number === 3 || number === 4) {
	                result += 'sata';
	            } else {
	                result += 'sati';
	            }
	            return result;
	        case 'dd':
	            if (number === 1) {
	                result += 'dan';
	            } else {
	                result += 'dana';
	            }
	            return result;
	        case 'MM':
	            if (number === 1) {
	                result += 'mjesec';
	            } else if (number === 2 || number === 3 || number === 4) {
	                result += 'mjeseca';
	            } else {
	                result += 'mjeseci';
	            }
	            return result;
	        case 'yy':
	            if (number === 1) {
	                result += 'godina';
	            } else if (number === 2 || number === 3 || number === 4) {
	                result += 'godine';
	            } else {
	                result += 'godina';
	            }
	            return result;
	    }
	}

	var hr = moment.defineLocale('hr', {
	    months : {
	        format: 'sije??nja_velja??e_o??ujka_travnja_svibnja_lipnja_srpnja_kolovoza_rujna_listopada_studenoga_prosinca'.split('_'),
	        standalone: 'sije??anj_velja??a_o??ujak_travanj_svibanj_lipanj_srpanj_kolovoz_rujan_listopad_studeni_prosinac'.split('_')
	    },
	    monthsShort : 'sij._velj._o??u._tra._svi._lip._srp._kol._ruj._lis._stu._pro.'.split('_'),
	    monthsParseExact: true,
	    weekdays : 'nedjelja_ponedjeljak_utorak_srijeda_??etvrtak_petak_subota'.split('_'),
	    weekdaysShort : 'ned._pon._uto._sri._??et._pet._sub.'.split('_'),
	    weekdaysMin : 'ne_po_ut_sr_??e_pe_su'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D. MMMM YYYY',
	        LLL : 'D. MMMM YYYY H:mm',
	        LLLL : 'dddd, D. MMMM YYYY H:mm'
	    },
	    calendar : {
	        sameDay  : '[danas u] LT',
	        nextDay  : '[sutra u] LT',
	        nextWeek : function () {
	            switch (this.day()) {
	                case 0:
	                    return '[u] [nedjelju] [u] LT';
	                case 3:
	                    return '[u] [srijedu] [u] LT';
	                case 6:
	                    return '[u] [subotu] [u] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[u] dddd [u] LT';
	            }
	        },
	        lastDay  : '[ju??er u] LT',
	        lastWeek : function () {
	            switch (this.day()) {
	                case 0:
	                case 3:
	                    return '[pro??lu] dddd [u] LT';
	                case 6:
	                    return '[pro??le] [subote] [u] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[pro??li] dddd [u] LT';
	            }
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'za %s',
	        past   : 'prije %s',
	        s      : 'par sekundi',
	        m      : translate,
	        mm     : translate,
	        h      : translate,
	        hh     : translate,
	        d      : 'dan',
	        dd     : translate,
	        M      : 'mjesec',
	        MM     : translate,
	        y      : 'godinu',
	        yy     : translate
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return hr;

	})));


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Hungarian [hu]
	//! author : Adam Brunner : https://github.com/adambrunner

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var weekEndings = 'vas??rnap h??tf??n kedden szerd??n cs??t??rt??k??n p??nteken szombaton'.split(' ');
	function translate(number, withoutSuffix, key, isFuture) {
	    var num = number,
	        suffix;
	    switch (key) {
	        case 's':
	            return (isFuture || withoutSuffix) ? 'n??h??ny m??sodperc' : 'n??h??ny m??sodperce';
	        case 'm':
	            return 'egy' + (isFuture || withoutSuffix ? ' perc' : ' perce');
	        case 'mm':
	            return num + (isFuture || withoutSuffix ? ' perc' : ' perce');
	        case 'h':
	            return 'egy' + (isFuture || withoutSuffix ? ' ??ra' : ' ??r??ja');
	        case 'hh':
	            return num + (isFuture || withoutSuffix ? ' ??ra' : ' ??r??ja');
	        case 'd':
	            return 'egy' + (isFuture || withoutSuffix ? ' nap' : ' napja');
	        case 'dd':
	            return num + (isFuture || withoutSuffix ? ' nap' : ' napja');
	        case 'M':
	            return 'egy' + (isFuture || withoutSuffix ? ' h??nap' : ' h??napja');
	        case 'MM':
	            return num + (isFuture || withoutSuffix ? ' h??nap' : ' h??napja');
	        case 'y':
	            return 'egy' + (isFuture || withoutSuffix ? ' ??v' : ' ??ve');
	        case 'yy':
	            return num + (isFuture || withoutSuffix ? ' ??v' : ' ??ve');
	    }
	    return '';
	}
	function week(isFuture) {
	    return (isFuture ? '' : '[m??lt] ') + '[' + weekEndings[this.day()] + '] LT[-kor]';
	}

	var hu = moment.defineLocale('hu', {
	    months : 'janu??r_febru??r_m??rcius_??prilis_m??jus_j??nius_j??lius_augusztus_szeptember_okt??ber_november_december'.split('_'),
	    monthsShort : 'jan_feb_m??rc_??pr_m??j_j??n_j??l_aug_szept_okt_nov_dec'.split('_'),
	    weekdays : 'vas??rnap_h??tf??_kedd_szerda_cs??t??rt??k_p??ntek_szombat'.split('_'),
	    weekdaysShort : 'vas_h??t_kedd_sze_cs??t_p??n_szo'.split('_'),
	    weekdaysMin : 'v_h_k_sze_cs_p_szo'.split('_'),
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'YYYY.MM.DD.',
	        LL : 'YYYY. MMMM D.',
	        LLL : 'YYYY. MMMM D. H:mm',
	        LLLL : 'YYYY. MMMM D., dddd H:mm'
	    },
	    meridiemParse: /de|du/i,
	    isPM: function (input) {
	        return input.charAt(1).toLowerCase() === 'u';
	    },
	    meridiem : function (hours, minutes, isLower) {
	        if (hours < 12) {
	            return isLower === true ? 'de' : 'DE';
	        } else {
	            return isLower === true ? 'du' : 'DU';
	        }
	    },
	    calendar : {
	        sameDay : '[ma] LT[-kor]',
	        nextDay : '[holnap] LT[-kor]',
	        nextWeek : function () {
	            return week.call(this, true);
	        },
	        lastDay : '[tegnap] LT[-kor]',
	        lastWeek : function () {
	            return week.call(this, false);
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s m??lva',
	        past : '%s',
	        s : translate,
	        m : translate,
	        mm : translate,
	        h : translate,
	        hh : translate,
	        d : translate,
	        dd : translate,
	        M : translate,
	        MM : translate,
	        y : translate,
	        yy : translate
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return hu;

	})));


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Armenian [hy-am]
	//! author : Armendarabyan : https://github.com/armendarabyan

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var hyAm = moment.defineLocale('hy-am', {
	    months : {
	        format: '????????????????_????????????????_??????????_????????????_????????????_??????????????_??????????????_????????????????_????????????????????_????????????????????_??????????????????_????????????????????'.split('_'),
	        standalone: '??????????????_??????????????_????????_??????????_??????????_????????????_????????????_??????????????_??????????????????_??????????????????_????????????????_??????????????????'.split('_')
	    },
	    monthsShort : '??????_??????_??????_??????_??????_??????_??????_??????_??????_??????_??????_??????'.split('_'),
	    weekdays : '????????????_????????????????????_??????????????????_????????????????????_??????????????????_????????????_??????????'.split('_'),
	    weekdaysShort : '??????_??????_??????_??????_??????_????????_??????'.split('_'),
	    weekdaysMin : '??????_??????_??????_??????_??????_????????_??????'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY ??.',
	        LLL : 'D MMMM YYYY ??., HH:mm',
	        LLLL : 'dddd, D MMMM YYYY ??., HH:mm'
	    },
	    calendar : {
	        sameDay: '[??????????] LT',
	        nextDay: '[????????] LT',
	        lastDay: '[????????] LT',
	        nextWeek: function () {
	            return 'dddd [?????? ????????] LT';
	        },
	        lastWeek: function () {
	            return '[??????????] dddd [?????? ????????] LT';
	        },
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : '%s ????????',
	        past : '%s ????????',
	        s : '???? ???????? ????????????????',
	        m : '????????',
	        mm : '%d ????????',
	        h : '??????',
	        hh : '%d ??????',
	        d : '????',
	        dd : '%d ????',
	        M : '????????',
	        MM : '%d ????????',
	        y : '????????',
	        yy : '%d ????????'
	    },
	    meridiemParse: /??????????????|????????????????|??????????????|????????????????/,
	    isPM: function (input) {
	        return /^(??????????????|????????????????)$/.test(input);
	    },
	    meridiem : function (hour) {
	        if (hour < 4) {
	            return '??????????????';
	        } else if (hour < 12) {
	            return '????????????????';
	        } else if (hour < 17) {
	            return '??????????????';
	        } else {
	            return '????????????????';
	        }
	    },
	    ordinalParse: /\d{1,2}|\d{1,2}-(????|????)/,
	    ordinal: function (number, period) {
	        switch (period) {
	            case 'DDD':
	            case 'w':
	            case 'W':
	            case 'DDDo':
	                if (number === 1) {
	                    return number + '-????';
	                }
	                return number + '-????';
	            default:
	                return number;
	        }
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return hyAm;

	})));


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Indonesian [id]
	//! author : Mohammad Satrio Utomo : https://github.com/tyok
	//! reference: http://id.wikisource.org/wiki/Pedoman_Umum_Ejaan_Bahasa_Indonesia_yang_Disempurnakan

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var id = moment.defineLocale('id', {
	    months : 'Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember'.split('_'),
	    monthsShort : 'Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nov_Des'.split('_'),
	    weekdays : 'Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu'.split('_'),
	    weekdaysShort : 'Min_Sen_Sel_Rab_Kam_Jum_Sab'.split('_'),
	    weekdaysMin : 'Mg_Sn_Sl_Rb_Km_Jm_Sb'.split('_'),
	    longDateFormat : {
	        LT : 'HH.mm',
	        LTS : 'HH.mm.ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY [pukul] HH.mm',
	        LLLL : 'dddd, D MMMM YYYY [pukul] HH.mm'
	    },
	    meridiemParse: /pagi|siang|sore|malam/,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === 'pagi') {
	            return hour;
	        } else if (meridiem === 'siang') {
	            return hour >= 11 ? hour : hour + 12;
	        } else if (meridiem === 'sore' || meridiem === 'malam') {
	            return hour + 12;
	        }
	    },
	    meridiem : function (hours, minutes, isLower) {
	        if (hours < 11) {
	            return 'pagi';
	        } else if (hours < 15) {
	            return 'siang';
	        } else if (hours < 19) {
	            return 'sore';
	        } else {
	            return 'malam';
	        }
	    },
	    calendar : {
	        sameDay : '[Hari ini pukul] LT',
	        nextDay : '[Besok pukul] LT',
	        nextWeek : 'dddd [pukul] LT',
	        lastDay : '[Kemarin pukul] LT',
	        lastWeek : 'dddd [lalu pukul] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'dalam %s',
	        past : '%s yang lalu',
	        s : 'beberapa detik',
	        m : 'semenit',
	        mm : '%d menit',
	        h : 'sejam',
	        hh : '%d jam',
	        d : 'sehari',
	        dd : '%d hari',
	        M : 'sebulan',
	        MM : '%d bulan',
	        y : 'setahun',
	        yy : '%d tahun'
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return id;

	})));


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Icelandic [is]
	//! author : Hinrik ??rn Sigur??sson : https://github.com/hinrik

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	function plural(n) {
	    if (n % 100 === 11) {
	        return true;
	    } else if (n % 10 === 1) {
	        return false;
	    }
	    return true;
	}
	function translate(number, withoutSuffix, key, isFuture) {
	    var result = number + ' ';
	    switch (key) {
	        case 's':
	            return withoutSuffix || isFuture ? 'nokkrar sek??ndur' : 'nokkrum sek??ndum';
	        case 'm':
	            return withoutSuffix ? 'm??n??ta' : 'm??n??tu';
	        case 'mm':
	            if (plural(number)) {
	                return result + (withoutSuffix || isFuture ? 'm??n??tur' : 'm??n??tum');
	            } else if (withoutSuffix) {
	                return result + 'm??n??ta';
	            }
	            return result + 'm??n??tu';
	        case 'hh':
	            if (plural(number)) {
	                return result + (withoutSuffix || isFuture ? 'klukkustundir' : 'klukkustundum');
	            }
	            return result + 'klukkustund';
	        case 'd':
	            if (withoutSuffix) {
	                return 'dagur';
	            }
	            return isFuture ? 'dag' : 'degi';
	        case 'dd':
	            if (plural(number)) {
	                if (withoutSuffix) {
	                    return result + 'dagar';
	                }
	                return result + (isFuture ? 'daga' : 'd??gum');
	            } else if (withoutSuffix) {
	                return result + 'dagur';
	            }
	            return result + (isFuture ? 'dag' : 'degi');
	        case 'M':
	            if (withoutSuffix) {
	                return 'm??nu??ur';
	            }
	            return isFuture ? 'm??nu??' : 'm??nu??i';
	        case 'MM':
	            if (plural(number)) {
	                if (withoutSuffix) {
	                    return result + 'm??nu??ir';
	                }
	                return result + (isFuture ? 'm??nu??i' : 'm??nu??um');
	            } else if (withoutSuffix) {
	                return result + 'm??nu??ur';
	            }
	            return result + (isFuture ? 'm??nu??' : 'm??nu??i');
	        case 'y':
	            return withoutSuffix || isFuture ? '??r' : '??ri';
	        case 'yy':
	            if (plural(number)) {
	                return result + (withoutSuffix || isFuture ? '??r' : '??rum');
	            }
	            return result + (withoutSuffix || isFuture ? '??r' : '??ri');
	    }
	}

	var is = moment.defineLocale('is', {
	    months : 'jan??ar_febr??ar_mars_apr??l_ma??_j??n??_j??l??_??g??st_september_okt??ber_n??vember_desember'.split('_'),
	    monthsShort : 'jan_feb_mar_apr_ma??_j??n_j??l_??g??_sep_okt_n??v_des'.split('_'),
	    weekdays : 'sunnudagur_m??nudagur_??ri??judagur_mi??vikudagur_fimmtudagur_f??studagur_laugardagur'.split('_'),
	    weekdaysShort : 'sun_m??n_??ri_mi??_fim_f??s_lau'.split('_'),
	    weekdaysMin : 'Su_M??_??r_Mi_Fi_F??_La'.split('_'),
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D. MMMM YYYY',
	        LLL : 'D. MMMM YYYY [kl.] H:mm',
	        LLLL : 'dddd, D. MMMM YYYY [kl.] H:mm'
	    },
	    calendar : {
	        sameDay : '[?? dag kl.] LT',
	        nextDay : '[?? morgun kl.] LT',
	        nextWeek : 'dddd [kl.] LT',
	        lastDay : '[?? g??r kl.] LT',
	        lastWeek : '[s????asta] dddd [kl.] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'eftir %s',
	        past : 'fyrir %s s????an',
	        s : translate,
	        m : translate,
	        mm : translate,
	        h : 'klukkustund',
	        hh : translate,
	        d : translate,
	        dd : translate,
	        M : translate,
	        MM : translate,
	        y : translate,
	        yy : translate
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return is;

	})));


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Italian [it]
	//! author : Lorenzo : https://github.com/aliem
	//! author: Mattia Larentis: https://github.com/nostalgiaz

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var it = moment.defineLocale('it', {
	    months : 'gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre'.split('_'),
	    monthsShort : 'gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic'.split('_'),
	    weekdays : 'Domenica_Luned??_Marted??_Mercoled??_Gioved??_Venerd??_Sabato'.split('_'),
	    weekdaysShort : 'Dom_Lun_Mar_Mer_Gio_Ven_Sab'.split('_'),
	    weekdaysMin : 'Do_Lu_Ma_Me_Gi_Ve_Sa'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[Oggi alle] LT',
	        nextDay: '[Domani alle] LT',
	        nextWeek: 'dddd [alle] LT',
	        lastDay: '[Ieri alle] LT',
	        lastWeek: function () {
	            switch (this.day()) {
	                case 0:
	                    return '[la scorsa] dddd [alle] LT';
	                default:
	                    return '[lo scorso] dddd [alle] LT';
	            }
	        },
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : function (s) {
	            return ((/^[0-9].+$/).test(s) ? 'tra' : 'in') + ' ' + s;
	        },
	        past : '%s fa',
	        s : 'alcuni secondi',
	        m : 'un minuto',
	        mm : '%d minuti',
	        h : 'un\'ora',
	        hh : '%d ore',
	        d : 'un giorno',
	        dd : '%d giorni',
	        M : 'un mese',
	        MM : '%d mesi',
	        y : 'un anno',
	        yy : '%d anni'
	    },
	    ordinalParse : /\d{1,2}??/,
	    ordinal: '%d??',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return it;

	})));


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Japanese [ja]
	//! author : LI Long : https://github.com/baryon

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var ja = moment.defineLocale('ja', {
	    months : '1???_2???_3???_4???_5???_6???_7???_8???_9???_10???_11???_12???'.split('_'),
	    monthsShort : '1???_2???_3???_4???_5???_6???_7???_8???_9???_10???_11???_12???'.split('_'),
	    weekdays : '?????????_?????????_?????????_?????????_?????????_?????????_?????????'.split('_'),
	    weekdaysShort : '???_???_???_???_???_???_???'.split('_'),
	    weekdaysMin : '???_???_???_???_???_???_???'.split('_'),
	    longDateFormat : {
	        LT : 'Ah???m???',
	        LTS : 'Ah???m???s???',
	        L : 'YYYY/MM/DD',
	        LL : 'YYYY???M???D???',
	        LLL : 'YYYY???M???D???Ah???m???',
	        LLLL : 'YYYY???M???D???Ah???m??? dddd'
	    },
	    meridiemParse: /??????|??????/i,
	    isPM : function (input) {
	        return input === '??????';
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 12) {
	            return '??????';
	        } else {
	            return '??????';
	        }
	    },
	    calendar : {
	        sameDay : '[??????] LT',
	        nextDay : '[??????] LT',
	        nextWeek : '[??????]dddd LT',
	        lastDay : '[??????] LT',
	        lastWeek : '[??????]dddd LT',
	        sameElse : 'L'
	    },
	    ordinalParse : /\d{1,2}???/,
	    ordinal : function (number, period) {
	        switch (period) {
	            case 'd':
	            case 'D':
	            case 'DDD':
	                return number + '???';
	            default:
	                return number;
	        }
	    },
	    relativeTime : {
	        future : '%s???',
	        past : '%s???',
	        s : '??????',
	        m : '1???',
	        mm : '%d???',
	        h : '1??????',
	        hh : '%d??????',
	        d : '1???',
	        dd : '%d???',
	        M : '1??????',
	        MM : '%d??????',
	        y : '1???',
	        yy : '%d???'
	    }
	});

	return ja;

	})));


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Javanese [jv]
	//! author : Rony Lantip : https://github.com/lantip
	//! reference: http://jv.wikipedia.org/wiki/Basa_Jawa

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var jv = moment.defineLocale('jv', {
	    months : 'Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_Nopember_Desember'.split('_'),
	    monthsShort : 'Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nop_Des'.split('_'),
	    weekdays : 'Minggu_Senen_Seloso_Rebu_Kemis_Jemuwah_Septu'.split('_'),
	    weekdaysShort : 'Min_Sen_Sel_Reb_Kem_Jem_Sep'.split('_'),
	    weekdaysMin : 'Mg_Sn_Sl_Rb_Km_Jm_Sp'.split('_'),
	    longDateFormat : {
	        LT : 'HH.mm',
	        LTS : 'HH.mm.ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY [pukul] HH.mm',
	        LLLL : 'dddd, D MMMM YYYY [pukul] HH.mm'
	    },
	    meridiemParse: /enjing|siyang|sonten|ndalu/,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === 'enjing') {
	            return hour;
	        } else if (meridiem === 'siyang') {
	            return hour >= 11 ? hour : hour + 12;
	        } else if (meridiem === 'sonten' || meridiem === 'ndalu') {
	            return hour + 12;
	        }
	    },
	    meridiem : function (hours, minutes, isLower) {
	        if (hours < 11) {
	            return 'enjing';
	        } else if (hours < 15) {
	            return 'siyang';
	        } else if (hours < 19) {
	            return 'sonten';
	        } else {
	            return 'ndalu';
	        }
	    },
	    calendar : {
	        sameDay : '[Dinten puniko pukul] LT',
	        nextDay : '[Mbenjang pukul] LT',
	        nextWeek : 'dddd [pukul] LT',
	        lastDay : '[Kala wingi pukul] LT',
	        lastWeek : 'dddd [kepengker pukul] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'wonten ing %s',
	        past : '%s ingkang kepengker',
	        s : 'sawetawis detik',
	        m : 'setunggal menit',
	        mm : '%d menit',
	        h : 'setunggal jam',
	        hh : '%d jam',
	        d : 'sedinten',
	        dd : '%d dinten',
	        M : 'sewulan',
	        MM : '%d wulan',
	        y : 'setaun',
	        yy : '%d taun'
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return jv;

	})));


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Georgian [ka]
	//! author : Irakli Janiashvili : https://github.com/irakli-janiashvili

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var ka = moment.defineLocale('ka', {
	    months : {
	        standalone: '?????????????????????_???????????????????????????_???????????????_??????????????????_???????????????_??????????????????_??????????????????_?????????????????????_??????????????????????????????_???????????????????????????_????????????????????????_???????????????????????????'.split('_'),
	        format: '?????????????????????_???????????????????????????_???????????????_?????????????????????_???????????????_??????????????????_??????????????????_?????????????????????_??????????????????????????????_???????????????????????????_????????????????????????_???????????????????????????'.split('_')
	    },
	    monthsShort : '?????????_?????????_?????????_?????????_?????????_?????????_?????????_?????????_?????????_?????????_?????????_?????????'.split('_'),
	    weekdays : {
	        standalone: '???????????????_????????????????????????_???????????????????????????_???????????????????????????_???????????????????????????_???????????????????????????_??????????????????'.split('_'),
	        format: '??????????????????_????????????????????????_???????????????????????????_???????????????????????????_???????????????????????????_???????????????????????????_??????????????????'.split('_'),
	        isFormat: /(????????????|??????????????????)/
	    },
	    weekdaysShort : '?????????_?????????_?????????_?????????_?????????_?????????_?????????'.split('_'),
	    weekdaysMin : '??????_??????_??????_??????_??????_??????_??????'.split('_'),
	    longDateFormat : {
	        LT : 'h:mm A',
	        LTS : 'h:mm:ss A',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY h:mm A',
	        LLLL : 'dddd, D MMMM YYYY h:mm A'
	    },
	    calendar : {
	        sameDay : '[????????????] LT[-??????]',
	        nextDay : '[????????????] LT[-??????]',
	        lastDay : '[???????????????] LT[-??????]',
	        nextWeek : '[??????????????????] dddd LT[-??????]',
	        lastWeek : '[????????????] dddd LT-??????',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : function (s) {
	            return (/(????????????|????????????|???????????????|????????????)/).test(s) ?
	                s.replace(/???$/, '??????') :
	                s + '??????';
	        },
	        past : function (s) {
	            if ((/(????????????|????????????|???????????????|?????????|?????????)/).test(s)) {
	                return s.replace(/(???|???)$/, '?????? ?????????');
	            }
	            if ((/????????????/).test(s)) {
	                return s.replace(/????????????$/, '???????????? ?????????');
	            }
	        },
	        s : '??????????????????????????? ????????????',
	        m : '????????????',
	        mm : '%d ????????????',
	        h : '???????????????',
	        hh : '%d ???????????????',
	        d : '?????????',
	        dd : '%d ?????????',
	        M : '?????????',
	        MM : '%d ?????????',
	        y : '????????????',
	        yy : '%d ????????????'
	    },
	    ordinalParse: /0|1-??????|??????-\d{1,2}|\d{1,2}-???/,
	    ordinal : function (number) {
	        if (number === 0) {
	            return number;
	        }
	        if (number === 1) {
	            return number + '-??????';
	        }
	        if ((number < 20) || (number <= 100 && (number % 20 === 0)) || (number % 100 === 0)) {
	            return '??????-' + number;
	        }
	        return number + '-???';
	    },
	    week : {
	        dow : 1,
	        doy : 7
	    }
	});

	return ka;

	})));


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Kazakh [kk]
	//! authors : Nurlan Rakhimzhanov : https://github.com/nurlan

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var suffixes = {
	    0: '-????',
	    1: '-????',
	    2: '-????',
	    3: '-????',
	    4: '-????',
	    5: '-????',
	    6: '-????',
	    7: '-????',
	    8: '-????',
	    9: '-????',
	    10: '-????',
	    20: '-????',
	    30: '-????',
	    40: '-????',
	    50: '-????',
	    60: '-????',
	    70: '-????',
	    80: '-????',
	    90: '-????',
	    100: '-????'
	};

	var kk = moment.defineLocale('kk', {
	    months : '????????????_??????????_????????????_??????????_??????????_????????????_??????????_??????????_????????????????_??????????_????????????_??????????????????'.split('_'),
	    monthsShort : '??????_??????_??????_??????_??????_??????_??????_??????_??????_??????_??????_??????'.split('_'),
	    weekdays : '????????????????_????????????????_????????????????_????????????????_????????????????_????????_??????????'.split('_'),
	    weekdaysShort : '??????_??????_??????_??????_??????_??????_??????'.split('_'),
	    weekdaysMin : '????_????_????_????_????_????_????'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[?????????? ??????????] LT',
	        nextDay : '[?????????? ??????????] LT',
	        nextWeek : 'dddd [??????????] LT',
	        lastDay : '[???????? ??????????] LT',
	        lastWeek : '[?????????? ??????????????] dddd [??????????] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s ????????????',
	        past : '%s ??????????',
	        s : '?????????????? ????????????',
	        m : '?????? ??????????',
	        mm : '%d ??????????',
	        h : '?????? ??????????',
	        hh : '%d ??????????',
	        d : '?????? ??????',
	        dd : '%d ??????',
	        M : '?????? ????',
	        MM : '%d ????',
	        y : '?????? ??????',
	        yy : '%d ??????'
	    },
	    ordinalParse: /\d{1,2}-(????|????)/,
	    ordinal : function (number) {
	        var a = number % 10,
	            b = number >= 100 ? 100 : null;
	        return number + (suffixes[number] || suffixes[a] || suffixes[b]);
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return kk;

	})));


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Cambodian [km]
	//! author : Kruy Vanna : https://github.com/kruyvanna

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var km = moment.defineLocale('km', {
	    months: '????????????_??????????????????_????????????_????????????_????????????_??????????????????_??????????????????_????????????_???????????????_????????????_????????????????????????_????????????'.split('_'),
	    monthsShort: '????????????_??????????????????_????????????_????????????_????????????_??????????????????_??????????????????_????????????_???????????????_????????????_????????????????????????_????????????'.split('_'),
	    weekdays: '?????????????????????_???????????????_??????????????????_?????????_??????????????????????????????_???????????????_????????????'.split('_'),
	    weekdaysShort: '?????????????????????_???????????????_??????????????????_?????????_??????????????????????????????_???????????????_????????????'.split('_'),
	    weekdaysMin: '?????????????????????_???????????????_??????????????????_?????????_??????????????????????????????_???????????????_????????????'.split('_'),
	    longDateFormat: {
	        LT: 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L: 'DD/MM/YYYY',
	        LL: 'D MMMM YYYY',
	        LLL: 'D MMMM YYYY HH:mm',
	        LLLL: 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar: {
	        sameDay: '[????????????????????? ????????????] LT',
	        nextDay: '[??????????????? ????????????] LT',
	        nextWeek: 'dddd [????????????] LT',
	        lastDay: '[???????????????????????? ????????????] LT',
	        lastWeek: 'dddd [??????????????????????????????] [????????????] LT',
	        sameElse: 'L'
	    },
	    relativeTime: {
	        future: '%s?????????',
	        past: '%s?????????',
	        s: '??????????????????????????????????????????',
	        m: '?????????????????????',
	        mm: '%d ????????????',
	        h: '?????????????????????',
	        hh: '%d ????????????',
	        d: '?????????????????????',
	        dd: '%d ????????????',
	        M: '???????????????',
	        MM: '%d ??????',
	        y: '????????????????????????',
	        yy: '%d ???????????????'
	    },
	    week: {
	        dow: 1, // Monday is the first day of the week.
	        doy: 4 // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return km;

	})));


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Korean [ko]
	//! author : Kyungwook, Park : https://github.com/kyungw00k
	//! author : Jeeeyul Lee <jeeeyul@gmail.com>

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var ko = moment.defineLocale('ko', {
	    months : '1???_2???_3???_4???_5???_6???_7???_8???_9???_10???_11???_12???'.split('_'),
	    monthsShort : '1???_2???_3???_4???_5???_6???_7???_8???_9???_10???_11???_12???'.split('_'),
	    weekdays : '?????????_?????????_?????????_?????????_?????????_?????????_?????????'.split('_'),
	    weekdaysShort : '???_???_???_???_???_???_???'.split('_'),
	    weekdaysMin : '???_???_???_???_???_???_???'.split('_'),
	    longDateFormat : {
	        LT : 'A h??? m???',
	        LTS : 'A h??? m??? s???',
	        L : 'YYYY.MM.DD',
	        LL : 'YYYY??? MMMM D???',
	        LLL : 'YYYY??? MMMM D??? A h??? m???',
	        LLLL : 'YYYY??? MMMM D??? dddd A h??? m???'
	    },
	    calendar : {
	        sameDay : '?????? LT',
	        nextDay : '?????? LT',
	        nextWeek : 'dddd LT',
	        lastDay : '?????? LT',
	        lastWeek : '????????? dddd LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s ???',
	        past : '%s ???',
	        s : '??? ???',
	        ss : '%d???',
	        m : '??????',
	        mm : '%d???',
	        h : '??? ??????',
	        hh : '%d??????',
	        d : '??????',
	        dd : '%d???',
	        M : '??? ???',
	        MM : '%d???',
	        y : '??? ???',
	        yy : '%d???'
	    },
	    ordinalParse : /\d{1,2}???/,
	    ordinal : '%d???',
	    meridiemParse : /??????|??????/,
	    isPM : function (token) {
	        return token === '??????';
	    },
	    meridiem : function (hour, minute, isUpper) {
	        return hour < 12 ? '??????' : '??????';
	    }
	});

	return ko;

	})));


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Kyrgyz [ky]
	//! author : Chyngyz Arystan uulu : https://github.com/chyngyz

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';



	var suffixes = {
	    0: '-????',
	    1: '-????',
	    2: '-????',
	    3: '-????',
	    4: '-????',
	    5: '-????',
	    6: '-????',
	    7: '-????',
	    8: '-????',
	    9: '-????',
	    10: '-????',
	    20: '-????',
	    30: '-????',
	    40: '-????',
	    50: '-????',
	    60: '-????',
	    70: '-????',
	    80: '-????',
	    90: '-????',
	    100: '-????'
	};

	var ky = moment.defineLocale('ky', {
	    months : '????????????_??????????????_????????_????????????_??????_????????_????????_????????????_????????????????_??????????????_????????????_??????????????'.split('_'),
	    monthsShort : '??????_??????_????????_??????_??????_????????_????????_??????_??????_??????_??????_??????'.split('_'),
	    weekdays : '????????????????_????????????????_????????????????_????????????????_????????????????_????????_????????????'.split('_'),
	    weekdaysShort : '??????_??????_??????_??????_??????_??????_??????'.split('_'),
	    weekdaysMin : '????_????_????_????_????_????_????'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[?????????? ????????] LT',
	        nextDay : '[?????????? ????????] LT',
	        nextWeek : 'dddd [????????] LT',
	        lastDay : '[???????? ????????] LT',
	        lastWeek : '[?????????? ??????????????] dddd [????????] [????????] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s ????????????',
	        past : '%s ??????????',
	        s : '?????????????? ????????????',
	        m : '?????? ??????????',
	        mm : '%d ??????????',
	        h : '?????? ????????',
	        hh : '%d ????????',
	        d : '?????? ??????',
	        dd : '%d ??????',
	        M : '?????? ????',
	        MM : '%d ????',
	        y : '?????? ??????',
	        yy : '%d ??????'
	    },
	    ordinalParse: /\d{1,2}-(????|????|????|????)/,
	    ordinal : function (number) {
	        var a = number % 10,
	            b = number >= 100 ? 100 : null;
	        return number + (suffixes[number] || suffixes[a] || suffixes[b]);
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return ky;

	})));


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Luxembourgish [lb]
	//! author : mweimerskirch : https://github.com/mweimerskirch
	//! author : David Raison : https://github.com/kwisatz

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	function processRelativeTime(number, withoutSuffix, key, isFuture) {
	    var format = {
	        'm': ['eng Minutt', 'enger Minutt'],
	        'h': ['eng Stonn', 'enger Stonn'],
	        'd': ['een Dag', 'engem Dag'],
	        'M': ['ee Mount', 'engem Mount'],
	        'y': ['ee Joer', 'engem Joer']
	    };
	    return withoutSuffix ? format[key][0] : format[key][1];
	}
	function processFutureTime(string) {
	    var number = string.substr(0, string.indexOf(' '));
	    if (eifelerRegelAppliesToNumber(number)) {
	        return 'a ' + string;
	    }
	    return 'an ' + string;
	}
	function processPastTime(string) {
	    var number = string.substr(0, string.indexOf(' '));
	    if (eifelerRegelAppliesToNumber(number)) {
	        return 'viru ' + string;
	    }
	    return 'virun ' + string;
	}
	/**
	 * Returns true if the word before the given number loses the '-n' ending.
	 * e.g. 'an 10 Deeg' but 'a 5 Deeg'
	 *
	 * @param number {integer}
	 * @returns {boolean}
	 */
	function eifelerRegelAppliesToNumber(number) {
	    number = parseInt(number, 10);
	    if (isNaN(number)) {
	        return false;
	    }
	    if (number < 0) {
	        // Negative Number --> always true
	        return true;
	    } else if (number < 10) {
	        // Only 1 digit
	        if (4 <= number && number <= 7) {
	            return true;
	        }
	        return false;
	    } else if (number < 100) {
	        // 2 digits
	        var lastDigit = number % 10, firstDigit = number / 10;
	        if (lastDigit === 0) {
	            return eifelerRegelAppliesToNumber(firstDigit);
	        }
	        return eifelerRegelAppliesToNumber(lastDigit);
	    } else if (number < 10000) {
	        // 3 or 4 digits --> recursively check first digit
	        while (number >= 10) {
	            number = number / 10;
	        }
	        return eifelerRegelAppliesToNumber(number);
	    } else {
	        // Anything larger than 4 digits: recursively check first n-3 digits
	        number = number / 1000;
	        return eifelerRegelAppliesToNumber(number);
	    }
	}

	var lb = moment.defineLocale('lb', {
	    months: 'Januar_Februar_M??erz_Abr??ll_Mee_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
	    monthsShort: 'Jan._Febr._Mrz._Abr._Mee_Jun._Jul._Aug._Sept._Okt._Nov._Dez.'.split('_'),
	    monthsParseExact : true,
	    weekdays: 'Sonndeg_M??indeg_D??nschdeg_M??ttwoch_Donneschdeg_Freideg_Samschdeg'.split('_'),
	    weekdaysShort: 'So._M??._D??._M??._Do._Fr._Sa.'.split('_'),
	    weekdaysMin: 'So_M??_D??_M??_Do_Fr_Sa'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat: {
	        LT: 'H:mm [Auer]',
	        LTS: 'H:mm:ss [Auer]',
	        L: 'DD.MM.YYYY',
	        LL: 'D. MMMM YYYY',
	        LLL: 'D. MMMM YYYY H:mm [Auer]',
	        LLLL: 'dddd, D. MMMM YYYY H:mm [Auer]'
	    },
	    calendar: {
	        sameDay: '[Haut um] LT',
	        sameElse: 'L',
	        nextDay: '[Muer um] LT',
	        nextWeek: 'dddd [um] LT',
	        lastDay: '[G??schter um] LT',
	        lastWeek: function () {
	            // Different date string for 'D??nschdeg' (Tuesday) and 'Donneschdeg' (Thursday) due to phonological rule
	            switch (this.day()) {
	                case 2:
	                case 4:
	                    return '[Leschten] dddd [um] LT';
	                default:
	                    return '[Leschte] dddd [um] LT';
	            }
	        }
	    },
	    relativeTime : {
	        future : processFutureTime,
	        past : processPastTime,
	        s : 'e puer Sekonnen',
	        m : processRelativeTime,
	        mm : '%d Minutten',
	        h : processRelativeTime,
	        hh : '%d Stonnen',
	        d : processRelativeTime,
	        dd : '%d Deeg',
	        M : processRelativeTime,
	        MM : '%d M??int',
	        y : processRelativeTime,
	        yy : '%d Joer'
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal: '%d.',
	    week: {
	        dow: 1, // Monday is the first day of the week.
	        doy: 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return lb;

	})));


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Lao [lo]
	//! author : Ryan Hart : https://github.com/ryanhart2

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var lo = moment.defineLocale('lo', {
	    months : '??????????????????_???????????????_????????????_????????????_?????????????????????_??????????????????_?????????????????????_???????????????_???????????????_????????????_???????????????_???????????????'.split('_'),
	    monthsShort : '??????????????????_???????????????_????????????_????????????_?????????????????????_??????????????????_?????????????????????_???????????????_???????????????_????????????_???????????????_???????????????'.split('_'),
	    weekdays : '???????????????_?????????_??????????????????_?????????_???????????????_?????????_????????????'.split('_'),
	    weekdaysShort : '?????????_?????????_??????????????????_?????????_???????????????_?????????_????????????'.split('_'),
	    weekdaysMin : '???_???_??????_???_??????_??????_???'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : '?????????dddd D MMMM YYYY HH:mm'
	    },
	    meridiemParse: /????????????????????????|??????????????????/,
	    isPM: function (input) {
	        return input === '??????????????????';
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 12) {
	            return '????????????????????????';
	        } else {
	            return '??????????????????';
	        }
	    },
	    calendar : {
	        sameDay : '[??????????????????????????????] LT',
	        nextDay : '[?????????????????????????????????] LT',
	        nextWeek : '[?????????]dddd[?????????????????????] LT',
	        lastDay : '[???????????????????????????????????????] LT',
	        lastWeek : '[?????????]dddd[?????????????????????????????????] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '????????? %s',
	        past : '%s??????????????????',
	        s : '????????????????????????????????????????????????',
	        m : '1 ????????????',
	        mm : '%d ????????????',
	        h : '1 ?????????????????????',
	        hh : '%d ?????????????????????',
	        d : '1 ?????????',
	        dd : '%d ?????????',
	        M : '1 ???????????????',
	        MM : '%d ???????????????',
	        y : '1 ??????',
	        yy : '%d ??????'
	    },
	    ordinalParse: /(?????????)\d{1,2}/,
	    ordinal : function (number) {
	        return '?????????' + number;
	    }
	});

	return lo;

	})));


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Lithuanian [lt]
	//! author : Mindaugas Moz??ras : https://github.com/mmozuras

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var units = {
	    'm' : 'minut??_minut??s_minut??',
	    'mm': 'minut??s_minu??i??_minutes',
	    'h' : 'valanda_valandos_valand??',
	    'hh': 'valandos_valand??_valandas',
	    'd' : 'diena_dienos_dien??',
	    'dd': 'dienos_dien??_dienas',
	    'M' : 'm??nuo_m??nesio_m??nes??',
	    'MM': 'm??nesiai_m??nesi??_m??nesius',
	    'y' : 'metai_met??_metus',
	    'yy': 'metai_met??_metus'
	};
	function translateSeconds(number, withoutSuffix, key, isFuture) {
	    if (withoutSuffix) {
	        return 'kelios sekund??s';
	    } else {
	        return isFuture ? 'keli?? sekund??i??' : 'kelias sekundes';
	    }
	}
	function translateSingular(number, withoutSuffix, key, isFuture) {
	    return withoutSuffix ? forms(key)[0] : (isFuture ? forms(key)[1] : forms(key)[2]);
	}
	function special(number) {
	    return number % 10 === 0 || (number > 10 && number < 20);
	}
	function forms(key) {
	    return units[key].split('_');
	}
	function translate(number, withoutSuffix, key, isFuture) {
	    var result = number + ' ';
	    if (number === 1) {
	        return result + translateSingular(number, withoutSuffix, key[0], isFuture);
	    } else if (withoutSuffix) {
	        return result + (special(number) ? forms(key)[1] : forms(key)[0]);
	    } else {
	        if (isFuture) {
	            return result + forms(key)[1];
	        } else {
	            return result + (special(number) ? forms(key)[1] : forms(key)[2]);
	        }
	    }
	}
	var lt = moment.defineLocale('lt', {
	    months : {
	        format: 'sausio_vasario_kovo_baland??io_gegu????s_bir??elio_liepos_rugpj????io_rugs??jo_spalio_lapkri??io_gruod??io'.split('_'),
	        standalone: 'sausis_vasaris_kovas_balandis_gegu????_bir??elis_liepa_rugpj??tis_rugs??jis_spalis_lapkritis_gruodis'.split('_'),
	        isFormat: /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?|MMMM?(\[[^\[\]]*\]|\s)+D[oD]?/
	    },
	    monthsShort : 'sau_vas_kov_bal_geg_bir_lie_rgp_rgs_spa_lap_grd'.split('_'),
	    weekdays : {
	        format: 'sekmadien??_pirmadien??_antradien??_tre??iadien??_ketvirtadien??_penktadien??_??e??tadien??'.split('_'),
	        standalone: 'sekmadienis_pirmadienis_antradienis_tre??iadienis_ketvirtadienis_penktadienis_??e??tadienis'.split('_'),
	        isFormat: /dddd HH:mm/
	    },
	    weekdaysShort : 'Sek_Pir_Ant_Tre_Ket_Pen_??e??'.split('_'),
	    weekdaysMin : 'S_P_A_T_K_Pn_??'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'YYYY-MM-DD',
	        LL : 'YYYY [m.] MMMM D [d.]',
	        LLL : 'YYYY [m.] MMMM D [d.], HH:mm [val.]',
	        LLLL : 'YYYY [m.] MMMM D [d.], dddd, HH:mm [val.]',
	        l : 'YYYY-MM-DD',
	        ll : 'YYYY [m.] MMMM D [d.]',
	        lll : 'YYYY [m.] MMMM D [d.], HH:mm [val.]',
	        llll : 'YYYY [m.] MMMM D [d.], ddd, HH:mm [val.]'
	    },
	    calendar : {
	        sameDay : '[??iandien] LT',
	        nextDay : '[Rytoj] LT',
	        nextWeek : 'dddd LT',
	        lastDay : '[Vakar] LT',
	        lastWeek : '[Pra??jus??] dddd LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'po %s',
	        past : 'prie?? %s',
	        s : translateSeconds,
	        m : translateSingular,
	        mm : translate,
	        h : translateSingular,
	        hh : translate,
	        d : translateSingular,
	        dd : translate,
	        M : translateSingular,
	        MM : translate,
	        y : translateSingular,
	        yy : translate
	    },
	    ordinalParse: /\d{1,2}-oji/,
	    ordinal : function (number) {
	        return number + '-oji';
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return lt;

	})));


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Latvian [lv]
	//! author : Kristaps Karlsons : https://github.com/skakri
	//! author : J??nis Elmeris : https://github.com/JanisE

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var units = {
	    'm': 'min??tes_min??t??m_min??te_min??tes'.split('_'),
	    'mm': 'min??tes_min??t??m_min??te_min??tes'.split('_'),
	    'h': 'stundas_stund??m_stunda_stundas'.split('_'),
	    'hh': 'stundas_stund??m_stunda_stundas'.split('_'),
	    'd': 'dienas_dien??m_diena_dienas'.split('_'),
	    'dd': 'dienas_dien??m_diena_dienas'.split('_'),
	    'M': 'm??ne??a_m??ne??iem_m??nesis_m??ne??i'.split('_'),
	    'MM': 'm??ne??a_m??ne??iem_m??nesis_m??ne??i'.split('_'),
	    'y': 'gada_gadiem_gads_gadi'.split('_'),
	    'yy': 'gada_gadiem_gads_gadi'.split('_')
	};
	/**
	 * @param withoutSuffix boolean true = a length of time; false = before/after a period of time.
	 */
	function format(forms, number, withoutSuffix) {
	    if (withoutSuffix) {
	        // E.g. "21 min??te", "3 min??tes".
	        return number % 10 === 1 && number % 100 !== 11 ? forms[2] : forms[3];
	    } else {
	        // E.g. "21 min??tes" as in "p??c 21 min??tes".
	        // E.g. "3 min??t??m" as in "p??c 3 min??t??m".
	        return number % 10 === 1 && number % 100 !== 11 ? forms[0] : forms[1];
	    }
	}
	function relativeTimeWithPlural(number, withoutSuffix, key) {
	    return number + ' ' + format(units[key], number, withoutSuffix);
	}
	function relativeTimeWithSingular(number, withoutSuffix, key) {
	    return format(units[key], number, withoutSuffix);
	}
	function relativeSeconds(number, withoutSuffix) {
	    return withoutSuffix ? 'da??as sekundes' : 'da????m sekund??m';
	}

	var lv = moment.defineLocale('lv', {
	    months : 'janv??ris_febru??ris_marts_apr??lis_maijs_j??nijs_j??lijs_augusts_septembris_oktobris_novembris_decembris'.split('_'),
	    monthsShort : 'jan_feb_mar_apr_mai_j??n_j??l_aug_sep_okt_nov_dec'.split('_'),
	    weekdays : 'sv??tdiena_pirmdiena_otrdiena_tre??diena_ceturtdiena_piektdiena_sestdiena'.split('_'),
	    weekdaysShort : 'Sv_P_O_T_C_Pk_S'.split('_'),
	    weekdaysMin : 'Sv_P_O_T_C_Pk_S'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY.',
	        LL : 'YYYY. [gada] D. MMMM',
	        LLL : 'YYYY. [gada] D. MMMM, HH:mm',
	        LLLL : 'YYYY. [gada] D. MMMM, dddd, HH:mm'
	    },
	    calendar : {
	        sameDay : '[??odien pulksten] LT',
	        nextDay : '[R??t pulksten] LT',
	        nextWeek : 'dddd [pulksten] LT',
	        lastDay : '[Vakar pulksten] LT',
	        lastWeek : '[Pag??ju????] dddd [pulksten] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'p??c %s',
	        past : 'pirms %s',
	        s : relativeSeconds,
	        m : relativeTimeWithSingular,
	        mm : relativeTimeWithPlural,
	        h : relativeTimeWithSingular,
	        hh : relativeTimeWithPlural,
	        d : relativeTimeWithSingular,
	        dd : relativeTimeWithPlural,
	        M : relativeTimeWithSingular,
	        MM : relativeTimeWithPlural,
	        y : relativeTimeWithSingular,
	        yy : relativeTimeWithPlural
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return lv;

	})));


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Montenegrin [me]
	//! author : Miodrag Nika?? <miodrag@restartit.me> : https://github.com/miodragnikac

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var translator = {
	    words: { //Different grammatical cases
	        m: ['jedan minut', 'jednog minuta'],
	        mm: ['minut', 'minuta', 'minuta'],
	        h: ['jedan sat', 'jednog sata'],
	        hh: ['sat', 'sata', 'sati'],
	        dd: ['dan', 'dana', 'dana'],
	        MM: ['mjesec', 'mjeseca', 'mjeseci'],
	        yy: ['godina', 'godine', 'godina']
	    },
	    correctGrammaticalCase: function (number, wordKey) {
	        return number === 1 ? wordKey[0] : (number >= 2 && number <= 4 ? wordKey[1] : wordKey[2]);
	    },
	    translate: function (number, withoutSuffix, key) {
	        var wordKey = translator.words[key];
	        if (key.length === 1) {
	            return withoutSuffix ? wordKey[0] : wordKey[1];
	        } else {
	            return number + ' ' + translator.correctGrammaticalCase(number, wordKey);
	        }
	    }
	};

	var me = moment.defineLocale('me', {
	    months: 'januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar'.split('_'),
	    monthsShort: 'jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.'.split('_'),
	    monthsParseExact : true,
	    weekdays: 'nedjelja_ponedjeljak_utorak_srijeda_??etvrtak_petak_subota'.split('_'),
	    weekdaysShort: 'ned._pon._uto._sri._??et._pet._sub.'.split('_'),
	    weekdaysMin: 'ne_po_ut_sr_??e_pe_su'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat: {
	        LT: 'H:mm',
	        LTS : 'H:mm:ss',
	        L: 'DD.MM.YYYY',
	        LL: 'D. MMMM YYYY',
	        LLL: 'D. MMMM YYYY H:mm',
	        LLLL: 'dddd, D. MMMM YYYY H:mm'
	    },
	    calendar: {
	        sameDay: '[danas u] LT',
	        nextDay: '[sjutra u] LT',

	        nextWeek: function () {
	            switch (this.day()) {
	                case 0:
	                    return '[u] [nedjelju] [u] LT';
	                case 3:
	                    return '[u] [srijedu] [u] LT';
	                case 6:
	                    return '[u] [subotu] [u] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[u] dddd [u] LT';
	            }
	        },
	        lastDay  : '[ju??e u] LT',
	        lastWeek : function () {
	            var lastWeekDays = [
	                '[pro??le] [nedjelje] [u] LT',
	                '[pro??log] [ponedjeljka] [u] LT',
	                '[pro??log] [utorka] [u] LT',
	                '[pro??le] [srijede] [u] LT',
	                '[pro??log] [??etvrtka] [u] LT',
	                '[pro??log] [petka] [u] LT',
	                '[pro??le] [subote] [u] LT'
	            ];
	            return lastWeekDays[this.day()];
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'za %s',
	        past   : 'prije %s',
	        s      : 'nekoliko sekundi',
	        m      : translator.translate,
	        mm     : translator.translate,
	        h      : translator.translate,
	        hh     : translator.translate,
	        d      : 'dan',
	        dd     : translator.translate,
	        M      : 'mjesec',
	        MM     : translator.translate,
	        y      : 'godinu',
	        yy     : translator.translate
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return me;

	})));


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Maori [mi]
	//! author : John Corrigan <robbiecloset@gmail.com> : https://github.com/johnideal

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var mi = moment.defineLocale('mi', {
	    months: 'Kohi-t??te_Hui-tanguru_Pout??-te-rangi_Paenga-wh??wh??_Haratua_Pipiri_H??ngoingoi_Here-turi-k??k??_Mahuru_Whiringa-??-nuku_Whiringa-??-rangi_Hakihea'.split('_'),
	    monthsShort: 'Kohi_Hui_Pou_Pae_Hara_Pipi_H??ngoi_Here_Mahu_Whi-nu_Whi-ra_Haki'.split('_'),
	    monthsRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
	    monthsStrictRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
	    monthsShortRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
	    monthsShortStrictRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,2}/i,
	    weekdays: 'R??tapu_Mane_T??rei_Wenerei_T??ite_Paraire_H??tarei'.split('_'),
	    weekdaysShort: 'Ta_Ma_T??_We_T??i_Pa_H??'.split('_'),
	    weekdaysMin: 'Ta_Ma_T??_We_T??i_Pa_H??'.split('_'),
	    longDateFormat: {
	        LT: 'HH:mm',
	        LTS: 'HH:mm:ss',
	        L: 'DD/MM/YYYY',
	        LL: 'D MMMM YYYY',
	        LLL: 'D MMMM YYYY [i] HH:mm',
	        LLLL: 'dddd, D MMMM YYYY [i] HH:mm'
	    },
	    calendar: {
	        sameDay: '[i teie mahana, i] LT',
	        nextDay: '[apopo i] LT',
	        nextWeek: 'dddd [i] LT',
	        lastDay: '[inanahi i] LT',
	        lastWeek: 'dddd [whakamutunga i] LT',
	        sameElse: 'L'
	    },
	    relativeTime: {
	        future: 'i roto i %s',
	        past: '%s i mua',
	        s: 'te h??kona ruarua',
	        m: 'he meneti',
	        mm: '%d meneti',
	        h: 'te haora',
	        hh: '%d haora',
	        d: 'he ra',
	        dd: '%d ra',
	        M: 'he marama',
	        MM: '%d marama',
	        y: 'he tau',
	        yy: '%d tau'
	    },
	    ordinalParse: /\d{1,2}??/,
	    ordinal: '%d??',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return mi;

	})));


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Macedonian [mk]
	//! author : Borislav Mickov : https://github.com/B0k0

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var mk = moment.defineLocale('mk', {
	    months : '??????????????_????????????????_????????_??????????_??????_????????_????????_????????????_??????????????????_????????????????_??????????????_????????????????'.split('_'),
	    monthsShort : '??????_??????_??????_??????_??????_??????_??????_??????_??????_??????_??????_??????'.split('_'),
	    weekdays : '????????????_????????????????????_??????????????_??????????_????????????????_??????????_????????????'.split('_'),
	    weekdaysShort : '??????_??????_??????_??????_??????_??????_??????'.split('_'),
	    weekdaysMin : '??e_??o_????_????_????_????_??a'.split('_'),
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'D.MM.YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY H:mm',
	        LLLL : 'dddd, D MMMM YYYY H:mm'
	    },
	    calendar : {
	        sameDay : '[?????????? ????] LT',
	        nextDay : '[???????? ????] LT',
	        nextWeek : '[????] dddd [????] LT',
	        lastDay : '[?????????? ????] LT',
	        lastWeek : function () {
	            switch (this.day()) {
	                case 0:
	                case 3:
	                case 6:
	                    return '[????????????????????] dddd [????] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[????????????????????] dddd [????] LT';
	            }
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '?????????? %s',
	        past : '???????? %s',
	        s : '?????????????? ??????????????',
	        m : '????????????',
	        mm : '%d ????????????',
	        h : '??????',
	        hh : '%d ????????',
	        d : '??????',
	        dd : '%d ????????',
	        M : '??????????',
	        MM : '%d ????????????',
	        y : '????????????',
	        yy : '%d ????????????'
	    },
	    ordinalParse: /\d{1,2}-(????|????|????|????|????|????)/,
	    ordinal : function (number) {
	        var lastDigit = number % 10,
	            last2Digits = number % 100;
	        if (number === 0) {
	            return number + '-????';
	        } else if (last2Digits === 0) {
	            return number + '-????';
	        } else if (last2Digits > 10 && last2Digits < 20) {
	            return number + '-????';
	        } else if (lastDigit === 1) {
	            return number + '-????';
	        } else if (lastDigit === 2) {
	            return number + '-????';
	        } else if (lastDigit === 7 || lastDigit === 8) {
	            return number + '-????';
	        } else {
	            return number + '-????';
	        }
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return mk;

	})));


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Malayalam [ml]
	//! author : Floyd Pink : https://github.com/floydpink

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var ml = moment.defineLocale('ml', {
	    months : '??????????????????_???????????????????????????_?????????????????????_??????????????????_????????????_?????????_????????????_????????????????????????_??????????????????????????????_?????????????????????_???????????????_??????????????????'.split('_'),
	    monthsShort : '?????????._??????????????????._?????????._???????????????._????????????_?????????_????????????._??????._?????????????????????._???????????????._?????????._????????????.'.split('_'),
	    monthsParseExact : true,
	    weekdays : '????????????????????????_??????????????????????????????_???????????????????????????_????????????????????????_???????????????????????????_?????????????????????????????????_????????????????????????'.split('_'),
	    weekdaysShort : '????????????_??????????????????_???????????????_????????????_??????????????????_??????????????????_?????????'.split('_'),
	    weekdaysMin : '??????_??????_??????_??????_????????????_??????_???'.split('_'),
	    longDateFormat : {
	        LT : 'A h:mm -??????',
	        LTS : 'A h:mm:ss -??????',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY, A h:mm -??????',
	        LLLL : 'dddd, D MMMM YYYY, A h:mm -??????'
	    },
	    calendar : {
	        sameDay : '[???????????????] LT',
	        nextDay : '[????????????] LT',
	        nextWeek : 'dddd, LT',
	        lastDay : '[??????????????????] LT',
	        lastWeek : '[??????????????????] dddd, LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s ?????????????????????',
	        past : '%s ???????????????',
	        s : '????????? ???????????????????????????',
	        m : '????????? ????????????????????????',
	        mm : '%d ????????????????????????',
	        h : '????????? ????????????????????????',
	        hh : '%d ????????????????????????',
	        d : '????????? ???????????????',
	        dd : '%d ???????????????',
	        M : '????????? ????????????',
	        MM : '%d ????????????',
	        y : '????????? ????????????',
	        yy : '%d ????????????'
	    },
	    meridiemParse: /??????????????????|??????????????????|???????????? ?????????????????????|??????????????????????????????|??????????????????/i,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if ((meridiem === '??????????????????' && hour >= 4) ||
	                meridiem === '???????????? ?????????????????????' ||
	                meridiem === '??????????????????????????????') {
	            return hour + 12;
	        } else {
	            return hour;
	        }
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 4) {
	            return '??????????????????';
	        } else if (hour < 12) {
	            return '??????????????????';
	        } else if (hour < 17) {
	            return '???????????? ?????????????????????';
	        } else if (hour < 20) {
	            return '??????????????????????????????';
	        } else {
	            return '??????????????????';
	        }
	    }
	});

	return ml;

	})));


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Marathi [mr]
	//! author : Harshad Kale : https://github.com/kalehv
	//! author : Vivek Athalye : https://github.com/vnathalye

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var symbolMap = {
	    '1': '???',
	    '2': '???',
	    '3': '???',
	    '4': '???',
	    '5': '???',
	    '6': '???',
	    '7': '???',
	    '8': '???',
	    '9': '???',
	    '0': '???'
	};
	var numberMap = {
	    '???': '1',
	    '???': '2',
	    '???': '3',
	    '???': '4',
	    '???': '5',
	    '???': '6',
	    '???': '7',
	    '???': '8',
	    '???': '9',
	    '???': '0'
	};

	function relativeTimeMr(number, withoutSuffix, string, isFuture)
	{
	    var output = '';
	    if (withoutSuffix) {
	        switch (string) {
	            case 's': output = '???????????? ???????????????'; break;
	            case 'm': output = '?????? ???????????????'; break;
	            case 'mm': output = '%d ??????????????????'; break;
	            case 'h': output = '?????? ?????????'; break;
	            case 'hh': output = '%d ?????????'; break;
	            case 'd': output = '?????? ????????????'; break;
	            case 'dd': output = '%d ????????????'; break;
	            case 'M': output = '?????? ???????????????'; break;
	            case 'MM': output = '%d ???????????????'; break;
	            case 'y': output = '?????? ????????????'; break;
	            case 'yy': output = '%d ???????????????'; break;
	        }
	    }
	    else {
	        switch (string) {
	            case 's': output = '???????????? ?????????????????????'; break;
	            case 'm': output = '????????? ??????????????????'; break;
	            case 'mm': output = '%d ?????????????????????'; break;
	            case 'h': output = '????????? ????????????'; break;
	            case 'hh': output = '%d ???????????????'; break;
	            case 'd': output = '????????? ???????????????'; break;
	            case 'dd': output = '%d ??????????????????'; break;
	            case 'M': output = '????????? ?????????????????????'; break;
	            case 'MM': output = '%d ????????????????????????'; break;
	            case 'y': output = '????????? ???????????????'; break;
	            case 'yy': output = '%d ??????????????????'; break;
	        }
	    }
	    return output.replace(/%d/i, number);
	}

	var mr = moment.defineLocale('mr', {
	    months : '????????????????????????_??????????????????????????????_???????????????_??????????????????_??????_?????????_????????????_???????????????_????????????????????????_?????????????????????_???????????????????????????_?????????????????????'.split('_'),
	    monthsShort: '????????????._??????????????????._???????????????._???????????????._??????._?????????._????????????._??????._??????????????????._???????????????._?????????????????????._???????????????.'.split('_'),
	    monthsParseExact : true,
	    weekdays : '??????????????????_??????????????????_?????????????????????_??????????????????_?????????????????????_????????????????????????_??????????????????'.split('_'),
	    weekdaysShort : '?????????_?????????_????????????_?????????_????????????_???????????????_?????????'.split('_'),
	    weekdaysMin : '???_??????_??????_??????_??????_??????_???'.split('_'),
	    longDateFormat : {
	        LT : 'A h:mm ???????????????',
	        LTS : 'A h:mm:ss ???????????????',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY, A h:mm ???????????????',
	        LLLL : 'dddd, D MMMM YYYY, A h:mm ???????????????'
	    },
	    calendar : {
	        sameDay : '[??????] LT',
	        nextDay : '[???????????????] LT',
	        nextWeek : 'dddd, LT',
	        lastDay : '[?????????] LT',
	        lastWeek: '[???????????????] dddd, LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future: '%s???????????????',
	        past: '%s??????????????????',
	        s: relativeTimeMr,
	        m: relativeTimeMr,
	        mm: relativeTimeMr,
	        h: relativeTimeMr,
	        hh: relativeTimeMr,
	        d: relativeTimeMr,
	        dd: relativeTimeMr,
	        M: relativeTimeMr,
	        MM: relativeTimeMr,
	        y: relativeTimeMr,
	        yy: relativeTimeMr
	    },
	    preparse: function (string) {
	        return string.replace(/[??????????????????????????????]/g, function (match) {
	            return numberMap[match];
	        });
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        });
	    },
	    meridiemParse: /??????????????????|???????????????|??????????????????|????????????????????????/,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === '??????????????????') {
	            return hour < 4 ? hour : hour + 12;
	        } else if (meridiem === '???????????????') {
	            return hour;
	        } else if (meridiem === '??????????????????') {
	            return hour >= 10 ? hour : hour + 12;
	        } else if (meridiem === '????????????????????????') {
	            return hour + 12;
	        }
	    },
	    meridiem: function (hour, minute, isLower) {
	        if (hour < 4) {
	            return '??????????????????';
	        } else if (hour < 10) {
	            return '???????????????';
	        } else if (hour < 17) {
	            return '??????????????????';
	        } else if (hour < 20) {
	            return '????????????????????????';
	        } else {
	            return '??????????????????';
	        }
	    },
	    week : {
	        dow : 0, // Sunday is the first day of the week.
	        doy : 6  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return mr;

	})));


/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Malay [ms]
	//! author : Weldan Jamili : https://github.com/weldan

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var ms = moment.defineLocale('ms', {
	    months : 'Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember'.split('_'),
	    monthsShort : 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis'.split('_'),
	    weekdays : 'Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu'.split('_'),
	    weekdaysShort : 'Ahd_Isn_Sel_Rab_Kha_Jum_Sab'.split('_'),
	    weekdaysMin : 'Ah_Is_Sl_Rb_Km_Jm_Sb'.split('_'),
	    longDateFormat : {
	        LT : 'HH.mm',
	        LTS : 'HH.mm.ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY [pukul] HH.mm',
	        LLLL : 'dddd, D MMMM YYYY [pukul] HH.mm'
	    },
	    meridiemParse: /pagi|tengahari|petang|malam/,
	    meridiemHour: function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === 'pagi') {
	            return hour;
	        } else if (meridiem === 'tengahari') {
	            return hour >= 11 ? hour : hour + 12;
	        } else if (meridiem === 'petang' || meridiem === 'malam') {
	            return hour + 12;
	        }
	    },
	    meridiem : function (hours, minutes, isLower) {
	        if (hours < 11) {
	            return 'pagi';
	        } else if (hours < 15) {
	            return 'tengahari';
	        } else if (hours < 19) {
	            return 'petang';
	        } else {
	            return 'malam';
	        }
	    },
	    calendar : {
	        sameDay : '[Hari ini pukul] LT',
	        nextDay : '[Esok pukul] LT',
	        nextWeek : 'dddd [pukul] LT',
	        lastDay : '[Kelmarin pukul] LT',
	        lastWeek : 'dddd [lepas pukul] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'dalam %s',
	        past : '%s yang lepas',
	        s : 'beberapa saat',
	        m : 'seminit',
	        mm : '%d minit',
	        h : 'sejam',
	        hh : '%d jam',
	        d : 'sehari',
	        dd : '%d hari',
	        M : 'sebulan',
	        MM : '%d bulan',
	        y : 'setahun',
	        yy : '%d tahun'
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return ms;

	})));


/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Malay [ms-my]
	//! note : DEPRECATED, the correct one is [ms]
	//! author : Weldan Jamili : https://github.com/weldan

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var msMy = moment.defineLocale('ms-my', {
	    months : 'Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember'.split('_'),
	    monthsShort : 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis'.split('_'),
	    weekdays : 'Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu'.split('_'),
	    weekdaysShort : 'Ahd_Isn_Sel_Rab_Kha_Jum_Sab'.split('_'),
	    weekdaysMin : 'Ah_Is_Sl_Rb_Km_Jm_Sb'.split('_'),
	    longDateFormat : {
	        LT : 'HH.mm',
	        LTS : 'HH.mm.ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY [pukul] HH.mm',
	        LLLL : 'dddd, D MMMM YYYY [pukul] HH.mm'
	    },
	    meridiemParse: /pagi|tengahari|petang|malam/,
	    meridiemHour: function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === 'pagi') {
	            return hour;
	        } else if (meridiem === 'tengahari') {
	            return hour >= 11 ? hour : hour + 12;
	        } else if (meridiem === 'petang' || meridiem === 'malam') {
	            return hour + 12;
	        }
	    },
	    meridiem : function (hours, minutes, isLower) {
	        if (hours < 11) {
	            return 'pagi';
	        } else if (hours < 15) {
	            return 'tengahari';
	        } else if (hours < 19) {
	            return 'petang';
	        } else {
	            return 'malam';
	        }
	    },
	    calendar : {
	        sameDay : '[Hari ini pukul] LT',
	        nextDay : '[Esok pukul] LT',
	        nextWeek : 'dddd [pukul] LT',
	        lastDay : '[Kelmarin pukul] LT',
	        lastWeek : 'dddd [lepas pukul] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'dalam %s',
	        past : '%s yang lepas',
	        s : 'beberapa saat',
	        m : 'seminit',
	        mm : '%d minit',
	        h : 'sejam',
	        hh : '%d jam',
	        d : 'sehari',
	        dd : '%d hari',
	        M : 'sebulan',
	        MM : '%d bulan',
	        y : 'setahun',
	        yy : '%d tahun'
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return msMy;

	})));


/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Burmese [my]
	//! author : Squar team, mysquar.com
	//! author : David Rossellat : https://github.com/gholadr
	//! author : Tin Aung Lin : https://github.com/thanyawzinmin

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var symbolMap = {
	    '1': '???',
	    '2': '???',
	    '3': '???',
	    '4': '???',
	    '5': '???',
	    '6': '???',
	    '7': '???',
	    '8': '???',
	    '9': '???',
	    '0': '???'
	};
	var numberMap = {
	    '???': '1',
	    '???': '2',
	    '???': '3',
	    '???': '4',
	    '???': '5',
	    '???': '6',
	    '???': '7',
	    '???': '8',
	    '???': '9',
	    '???': '0'
	};

	var my = moment.defineLocale('my', {
	    months: '????????????????????????_??????????????????????????????_?????????_????????????_??????_????????????_?????????????????????_??????????????????_????????????????????????_??????????????????????????????_????????????????????????_?????????????????????'.split('_'),
	    monthsShort: '?????????_??????_?????????_?????????_??????_????????????_???????????????_??????_?????????_???????????????_?????????_??????'.split('_'),
	    weekdays: '???????????????????????????_?????????????????????_??????????????????_????????????????????????_????????????????????????_??????????????????_?????????'.split('_'),
	    weekdaysShort: '?????????_??????_??????_?????????_?????????_?????????_??????'.split('_'),
	    weekdaysMin: '?????????_??????_??????_?????????_?????????_?????????_??????'.split('_'),

	    longDateFormat: {
	        LT: 'HH:mm',
	        LTS: 'HH:mm:ss',
	        L: 'DD/MM/YYYY',
	        LL: 'D MMMM YYYY',
	        LLL: 'D MMMM YYYY HH:mm',
	        LLLL: 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar: {
	        sameDay: '[?????????.] LT [?????????]',
	        nextDay: '[????????????????????????] LT [?????????]',
	        nextWeek: 'dddd LT [?????????]',
	        lastDay: '[?????????.???] LT [?????????]',
	        lastWeek: '[??????????????????????????????] dddd LT [?????????]',
	        sameElse: 'L'
	    },
	    relativeTime: {
	        future: '?????????????????? %s ?????????',
	        past: '?????????????????????????????? %s ???',
	        s: '??????????????????.????????????????????????',
	        m: '????????????????????????',
	        mm: '%d ???????????????',
	        h: '?????????????????????',
	        hh: '%d ????????????',
	        d: '??????????????????',
	        dd: '%d ?????????',
	        M: '????????????',
	        MM: '%d ???',
	        y: '?????????????????????',
	        yy: '%d ????????????'
	    },
	    preparse: function (string) {
	        return string.replace(/[??????????????????????????????]/g, function (match) {
	            return numberMap[match];
	        });
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        });
	    },
	    week: {
	        dow: 1, // Monday is the first day of the week.
	        doy: 4 // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return my;

	})));


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Norwegian Bokm??l [nb]
	//! authors : Espen Hovlandsdal : https://github.com/rexxars
	//!           Sigurd Gartmann : https://github.com/sigurdga

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var nb = moment.defineLocale('nb', {
	    months : 'januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
	    monthsShort : 'jan._feb._mars_april_mai_juni_juli_aug._sep._okt._nov._des.'.split('_'),
	    monthsParseExact : true,
	    weekdays : 's??ndag_mandag_tirsdag_onsdag_torsdag_fredag_l??rdag'.split('_'),
	    weekdaysShort : 's??._ma._ti._on._to._fr._l??.'.split('_'),
	    weekdaysMin : 's??_ma_ti_on_to_fr_l??'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D. MMMM YYYY',
	        LLL : 'D. MMMM YYYY [kl.] HH:mm',
	        LLLL : 'dddd D. MMMM YYYY [kl.] HH:mm'
	    },
	    calendar : {
	        sameDay: '[i dag kl.] LT',
	        nextDay: '[i morgen kl.] LT',
	        nextWeek: 'dddd [kl.] LT',
	        lastDay: '[i g??r kl.] LT',
	        lastWeek: '[forrige] dddd [kl.] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'om %s',
	        past : '%s siden',
	        s : 'noen sekunder',
	        m : 'ett minutt',
	        mm : '%d minutter',
	        h : 'en time',
	        hh : '%d timer',
	        d : 'en dag',
	        dd : '%d dager',
	        M : 'en m??ned',
	        MM : '%d m??neder',
	        y : 'ett ??r',
	        yy : '%d ??r'
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return nb;

	})));


/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Nepalese [ne]
	//! author : suvash : https://github.com/suvash

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var symbolMap = {
	    '1': '???',
	    '2': '???',
	    '3': '???',
	    '4': '???',
	    '5': '???',
	    '6': '???',
	    '7': '???',
	    '8': '???',
	    '9': '???',
	    '0': '???'
	};
	var numberMap = {
	    '???': '1',
	    '???': '2',
	    '???': '3',
	    '???': '4',
	    '???': '5',
	    '???': '6',
	    '???': '7',
	    '???': '8',
	    '???': '9',
	    '???': '0'
	};

	var ne = moment.defineLocale('ne', {
	    months : '???????????????_???????????????????????????_???????????????_??????????????????_??????_?????????_???????????????_???????????????_??????????????????????????????_?????????????????????_????????????????????????_????????????????????????'.split('_'),
	    monthsShort : '??????._??????????????????._???????????????_???????????????._??????_?????????_???????????????._??????._???????????????._???????????????._????????????._????????????.'.split('_'),
	    monthsParseExact : true,
	    weekdays : '??????????????????_??????????????????_????????????????????????_??????????????????_?????????????????????_????????????????????????_??????????????????'.split('_'),
	    weekdaysShort : '?????????._?????????._???????????????._?????????._????????????._???????????????._?????????.'.split('_'),
	    weekdaysMin : '???._??????._??????._??????._??????._??????._???.'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'A?????? h:mm ?????????',
	        LTS : 'A?????? h:mm:ss ?????????',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY, A?????? h:mm ?????????',
	        LLLL : 'dddd, D MMMM YYYY, A?????? h:mm ?????????'
	    },
	    preparse: function (string) {
	        return string.replace(/[??????????????????????????????]/g, function (match) {
	            return numberMap[match];
	        });
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        });
	    },
	    meridiemParse: /????????????|???????????????|??????????????????|????????????/,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === '????????????') {
	            return hour < 4 ? hour : hour + 12;
	        } else if (meridiem === '???????????????') {
	            return hour;
	        } else if (meridiem === '??????????????????') {
	            return hour >= 10 ? hour : hour + 12;
	        } else if (meridiem === '????????????') {
	            return hour + 12;
	        }
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 3) {
	            return '????????????';
	        } else if (hour < 12) {
	            return '???????????????';
	        } else if (hour < 16) {
	            return '??????????????????';
	        } else if (hour < 20) {
	            return '????????????';
	        } else {
	            return '????????????';
	        }
	    },
	    calendar : {
	        sameDay : '[??????] LT',
	        nextDay : '[????????????] LT',
	        nextWeek : '[???????????????] dddd[,] LT',
	        lastDay : '[????????????] LT',
	        lastWeek : '[????????????] dddd[,] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s??????',
	        past : '%s ???????????????',
	        s : '???????????? ????????????',
	        m : '?????? ???????????????',
	        mm : '%d ???????????????',
	        h : '?????? ???????????????',
	        hh : '%d ???????????????',
	        d : '?????? ?????????',
	        dd : '%d ?????????',
	        M : '?????? ???????????????',
	        MM : '%d ???????????????',
	        y : '?????? ????????????',
	        yy : '%d ????????????'
	    },
	    week : {
	        dow : 0, // Sunday is the first day of the week.
	        doy : 6  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return ne;

	})));


/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Dutch [nl]
	//! author : Joris R??ling : https://github.com/jorisroling
	//! author : Jacob Middag : https://github.com/middagj

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var monthsShortWithDots = 'jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.'.split('_');
	var monthsShortWithoutDots = 'jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec'.split('_');

	var monthsParse = [/^jan/i, /^feb/i, /^maart|mrt.?$/i, /^apr/i, /^mei$/i, /^jun[i.]?$/i, /^jul[i.]?$/i, /^aug/i, /^sep/i, /^okt/i, /^nov/i, /^dec/i];
	var monthsRegex = /^(januari|februari|maart|april|mei|april|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;

	var nl = moment.defineLocale('nl', {
	    months : 'januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december'.split('_'),
	    monthsShort : function (m, format) {
	        if (/-MMM-/.test(format)) {
	            return monthsShortWithoutDots[m.month()];
	        } else {
	            return monthsShortWithDots[m.month()];
	        }
	    },

	    monthsRegex: monthsRegex,
	    monthsShortRegex: monthsRegex,
	    monthsStrictRegex: /^(januari|februari|maart|mei|ju[nl]i|april|augustus|september|oktober|november|december)/i,
	    monthsShortStrictRegex: /^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,

	    monthsParse : monthsParse,
	    longMonthsParse : monthsParse,
	    shortMonthsParse : monthsParse,

	    weekdays : 'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag'.split('_'),
	    weekdaysShort : 'zo._ma._di._wo._do._vr._za.'.split('_'),
	    weekdaysMin : 'Zo_Ma_Di_Wo_Do_Vr_Za'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD-MM-YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[vandaag om] LT',
	        nextDay: '[morgen om] LT',
	        nextWeek: 'dddd [om] LT',
	        lastDay: '[gisteren om] LT',
	        lastWeek: '[afgelopen] dddd [om] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'over %s',
	        past : '%s geleden',
	        s : 'een paar seconden',
	        m : '????n minuut',
	        mm : '%d minuten',
	        h : '????n uur',
	        hh : '%d uur',
	        d : '????n dag',
	        dd : '%d dagen',
	        M : '????n maand',
	        MM : '%d maanden',
	        y : '????n jaar',
	        yy : '%d jaar'
	    },
	    ordinalParse: /\d{1,2}(ste|de)/,
	    ordinal : function (number) {
	        return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de');
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return nl;

	})));


/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Dutch (Belgium) [nl-be]
	//! author : Joris R??ling : https://github.com/jorisroling
	//! author : Jacob Middag : https://github.com/middagj

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var monthsShortWithDots = 'jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.'.split('_');
	var monthsShortWithoutDots = 'jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec'.split('_');

	var monthsParse = [/^jan/i, /^feb/i, /^maart|mrt.?$/i, /^apr/i, /^mei$/i, /^jun[i.]?$/i, /^jul[i.]?$/i, /^aug/i, /^sep/i, /^okt/i, /^nov/i, /^dec/i];
	var monthsRegex = /^(januari|februari|maart|april|mei|april|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;

	var nlBe = moment.defineLocale('nl-be', {
	    months : 'januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december'.split('_'),
	    monthsShort : function (m, format) {
	        if (/-MMM-/.test(format)) {
	            return monthsShortWithoutDots[m.month()];
	        } else {
	            return monthsShortWithDots[m.month()];
	        }
	    },

	    monthsRegex: monthsRegex,
	    monthsShortRegex: monthsRegex,
	    monthsStrictRegex: /^(januari|februari|maart|mei|ju[nl]i|april|augustus|september|oktober|november|december)/i,
	    monthsShortStrictRegex: /^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,

	    monthsParse : monthsParse,
	    longMonthsParse : monthsParse,
	    shortMonthsParse : monthsParse,

	    weekdays : 'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag'.split('_'),
	    weekdaysShort : 'zo._ma._di._wo._do._vr._za.'.split('_'),
	    weekdaysMin : 'Zo_Ma_Di_Wo_Do_Vr_Za'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[vandaag om] LT',
	        nextDay: '[morgen om] LT',
	        nextWeek: 'dddd [om] LT',
	        lastDay: '[gisteren om] LT',
	        lastWeek: '[afgelopen] dddd [om] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'over %s',
	        past : '%s geleden',
	        s : 'een paar seconden',
	        m : '????n minuut',
	        mm : '%d minuten',
	        h : '????n uur',
	        hh : '%d uur',
	        d : '????n dag',
	        dd : '%d dagen',
	        M : '????n maand',
	        MM : '%d maanden',
	        y : '????n jaar',
	        yy : '%d jaar'
	    },
	    ordinalParse: /\d{1,2}(ste|de)/,
	    ordinal : function (number) {
	        return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de');
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return nlBe;

	})));


/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Nynorsk [nn]
	//! author : https://github.com/mechuwind

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var nn = moment.defineLocale('nn', {
	    months : 'januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
	    monthsShort : 'jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_'),
	    weekdays : 'sundag_m??ndag_tysdag_onsdag_torsdag_fredag_laurdag'.split('_'),
	    weekdaysShort : 'sun_m??n_tys_ons_tor_fre_lau'.split('_'),
	    weekdaysMin : 'su_m??_ty_on_to_fr_l??'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D. MMMM YYYY',
	        LLL : 'D. MMMM YYYY [kl.] H:mm',
	        LLLL : 'dddd D. MMMM YYYY [kl.] HH:mm'
	    },
	    calendar : {
	        sameDay: '[I dag klokka] LT',
	        nextDay: '[I morgon klokka] LT',
	        nextWeek: 'dddd [klokka] LT',
	        lastDay: '[I g??r klokka] LT',
	        lastWeek: '[F??reg??ande] dddd [klokka] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'om %s',
	        past : '%s sidan',
	        s : 'nokre sekund',
	        m : 'eit minutt',
	        mm : '%d minutt',
	        h : 'ein time',
	        hh : '%d timar',
	        d : 'ein dag',
	        dd : '%d dagar',
	        M : 'ein m??nad',
	        MM : '%d m??nader',
	        y : 'eit ??r',
	        yy : '%d ??r'
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return nn;

	})));


/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Punjabi (India) [pa-in]
	//! author : Harpreet Singh : https://github.com/harpreetkhalsagtbit

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var symbolMap = {
	    '1': '???',
	    '2': '???',
	    '3': '???',
	    '4': '???',
	    '5': '???',
	    '6': '???',
	    '7': '???',
	    '8': '???',
	    '9': '???',
	    '0': '???'
	};
	var numberMap = {
	    '???': '1',
	    '???': '2',
	    '???': '3',
	    '???': '4',
	    '???': '5',
	    '???': '6',
	    '???': '7',
	    '???': '8',
	    '???': '9',
	    '???': '0'
	};

	var paIn = moment.defineLocale('pa-in', {
	    // There are months name as per Nanakshahi Calender but they are not used as rigidly in modern Punjabi.
	    months : '???????????????_??????????????????_????????????_??????????????????_??????_?????????_???????????????_????????????_???????????????_??????????????????_???????????????_???????????????'.split('_'),
	    monthsShort : '???????????????_??????????????????_????????????_??????????????????_??????_?????????_???????????????_????????????_???????????????_??????????????????_???????????????_???????????????'.split('_'),
	    weekdays : '???????????????_??????????????????_?????????????????????_??????????????????_??????????????????_???????????????????????????_???????????????????????????'.split('_'),
	    weekdaysShort : '??????_?????????_????????????_?????????_?????????_???????????????_????????????'.split('_'),
	    weekdaysMin : '??????_?????????_????????????_?????????_?????????_???????????????_????????????'.split('_'),
	    longDateFormat : {
	        LT : 'A h:mm ?????????',
	        LTS : 'A h:mm:ss ?????????',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY, A h:mm ?????????',
	        LLLL : 'dddd, D MMMM YYYY, A h:mm ?????????'
	    },
	    calendar : {
	        sameDay : '[??????] LT',
	        nextDay : '[??????] LT',
	        nextWeek : 'dddd, LT',
	        lastDay : '[??????] LT',
	        lastWeek : '[???????????????] dddd, LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s ????????????',
	        past : '%s ???????????????',
	        s : '????????? ???????????????',
	        m : '?????? ????????????',
	        mm : '%d ????????????',
	        h : '????????? ????????????',
	        hh : '%d ????????????',
	        d : '????????? ?????????',
	        dd : '%d ?????????',
	        M : '????????? ???????????????',
	        MM : '%d ???????????????',
	        y : '????????? ?????????',
	        yy : '%d ?????????'
	    },
	    preparse: function (string) {
	        return string.replace(/[??????????????????????????????]/g, function (match) {
	            return numberMap[match];
	        });
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        });
	    },
	    // Punjabi notation for meridiems are quite fuzzy in practice. While there exists
	    // a rigid notion of a 'Pahar' it is not used as rigidly in modern Punjabi.
	    meridiemParse: /?????????|????????????|??????????????????|????????????/,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === '?????????') {
	            return hour < 4 ? hour : hour + 12;
	        } else if (meridiem === '????????????') {
	            return hour;
	        } else if (meridiem === '??????????????????') {
	            return hour >= 10 ? hour : hour + 12;
	        } else if (meridiem === '????????????') {
	            return hour + 12;
	        }
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 4) {
	            return '?????????';
	        } else if (hour < 10) {
	            return '????????????';
	        } else if (hour < 17) {
	            return '??????????????????';
	        } else if (hour < 20) {
	            return '????????????';
	        } else {
	            return '?????????';
	        }
	    },
	    week : {
	        dow : 0, // Sunday is the first day of the week.
	        doy : 6  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return paIn;

	})));


/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Polish [pl]
	//! author : Rafal Hirsz : https://github.com/evoL

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var monthsNominative = 'stycze??_luty_marzec_kwiecie??_maj_czerwiec_lipiec_sierpie??_wrzesie??_pa??dziernik_listopad_grudzie??'.split('_');
	var monthsSubjective = 'stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_wrze??nia_pa??dziernika_listopada_grudnia'.split('_');
	function plural(n) {
	    return (n % 10 < 5) && (n % 10 > 1) && ((~~(n / 10) % 10) !== 1);
	}
	function translate(number, withoutSuffix, key) {
	    var result = number + ' ';
	    switch (key) {
	        case 'm':
	            return withoutSuffix ? 'minuta' : 'minut??';
	        case 'mm':
	            return result + (plural(number) ? 'minuty' : 'minut');
	        case 'h':
	            return withoutSuffix  ? 'godzina'  : 'godzin??';
	        case 'hh':
	            return result + (plural(number) ? 'godziny' : 'godzin');
	        case 'MM':
	            return result + (plural(number) ? 'miesi??ce' : 'miesi??cy');
	        case 'yy':
	            return result + (plural(number) ? 'lata' : 'lat');
	    }
	}

	var pl = moment.defineLocale('pl', {
	    months : function (momentToFormat, format) {
	        if (format === '') {
	            // Hack: if format empty we know this is used to generate
	            // RegExp by moment. Give then back both valid forms of months
	            // in RegExp ready format.
	            return '(' + monthsSubjective[momentToFormat.month()] + '|' + monthsNominative[momentToFormat.month()] + ')';
	        } else if (/D MMMM/.test(format)) {
	            return monthsSubjective[momentToFormat.month()];
	        } else {
	            return monthsNominative[momentToFormat.month()];
	        }
	    },
	    monthsShort : 'sty_lut_mar_kwi_maj_cze_lip_sie_wrz_pa??_lis_gru'.split('_'),
	    weekdays : 'niedziela_poniedzia??ek_wtorek_??roda_czwartek_pi??tek_sobota'.split('_'),
	    weekdaysShort : 'ndz_pon_wt_??r_czw_pt_sob'.split('_'),
	    weekdaysMin : 'Nd_Pn_Wt_??r_Cz_Pt_So'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[Dzi?? o] LT',
	        nextDay: '[Jutro o] LT',
	        nextWeek: '[W] dddd [o] LT',
	        lastDay: '[Wczoraj o] LT',
	        lastWeek: function () {
	            switch (this.day()) {
	                case 0:
	                    return '[W zesz???? niedziel?? o] LT';
	                case 3:
	                    return '[W zesz???? ??rod?? o] LT';
	                case 6:
	                    return '[W zesz???? sobot?? o] LT';
	                default:
	                    return '[W zesz??y] dddd [o] LT';
	            }
	        },
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'za %s',
	        past : '%s temu',
	        s : 'kilka sekund',
	        m : translate,
	        mm : translate,
	        h : translate,
	        hh : translate,
	        d : '1 dzie??',
	        dd : '%d dni',
	        M : 'miesi??c',
	        MM : translate,
	        y : 'rok',
	        yy : translate
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return pl;

	})));


/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Portuguese [pt]
	//! author : Jefferson : https://github.com/jalex79

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var pt = moment.defineLocale('pt', {
	    months : 'Janeiro_Fevereiro_Mar??o_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split('_'),
	    monthsShort : 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_'),
	    weekdays : 'Domingo_Segunda-Feira_Ter??a-Feira_Quarta-Feira_Quinta-Feira_Sexta-Feira_S??bado'.split('_'),
	    weekdaysShort : 'Dom_Seg_Ter_Qua_Qui_Sex_S??b'.split('_'),
	    weekdaysMin : 'Dom_2??_3??_4??_5??_6??_S??b'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D [de] MMMM [de] YYYY',
	        LLL : 'D [de] MMMM [de] YYYY HH:mm',
	        LLLL : 'dddd, D [de] MMMM [de] YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[Hoje ??s] LT',
	        nextDay: '[Amanh?? ??s] LT',
	        nextWeek: 'dddd [??s] LT',
	        lastDay: '[Ontem ??s] LT',
	        lastWeek: function () {
	            return (this.day() === 0 || this.day() === 6) ?
	                '[??ltimo] dddd [??s] LT' : // Saturday + Sunday
	                '[??ltima] dddd [??s] LT'; // Monday - Friday
	        },
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'em %s',
	        past : 'h?? %s',
	        s : 'segundos',
	        m : 'um minuto',
	        mm : '%d minutos',
	        h : 'uma hora',
	        hh : '%d horas',
	        d : 'um dia',
	        dd : '%d dias',
	        M : 'um m??s',
	        MM : '%d meses',
	        y : 'um ano',
	        yy : '%d anos'
	    },
	    ordinalParse: /\d{1,2}??/,
	    ordinal : '%d??',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return pt;

	})));


/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Portuguese (Brazil) [pt-br]
	//! author : Caio Ribeiro Pereira : https://github.com/caio-ribeiro-pereira

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var ptBr = moment.defineLocale('pt-br', {
	    months : 'Janeiro_Fevereiro_Mar??o_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split('_'),
	    monthsShort : 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_'),
	    weekdays : 'Domingo_Segunda-feira_Ter??a-feira_Quarta-feira_Quinta-feira_Sexta-feira_S??bado'.split('_'),
	    weekdaysShort : 'Dom_Seg_Ter_Qua_Qui_Sex_S??b'.split('_'),
	    weekdaysMin : 'Dom_2??_3??_4??_5??_6??_S??b'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D [de] MMMM [de] YYYY',
	        LLL : 'D [de] MMMM [de] YYYY [??s] HH:mm',
	        LLLL : 'dddd, D [de] MMMM [de] YYYY [??s] HH:mm'
	    },
	    calendar : {
	        sameDay: '[Hoje ??s] LT',
	        nextDay: '[Amanh?? ??s] LT',
	        nextWeek: 'dddd [??s] LT',
	        lastDay: '[Ontem ??s] LT',
	        lastWeek: function () {
	            return (this.day() === 0 || this.day() === 6) ?
	                '[??ltimo] dddd [??s] LT' : // Saturday + Sunday
	                '[??ltima] dddd [??s] LT'; // Monday - Friday
	        },
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'em %s',
	        past : '%s atr??s',
	        s : 'poucos segundos',
	        m : 'um minuto',
	        mm : '%d minutos',
	        h : 'uma hora',
	        hh : '%d horas',
	        d : 'um dia',
	        dd : '%d dias',
	        M : 'um m??s',
	        MM : '%d meses',
	        y : 'um ano',
	        yy : '%d anos'
	    },
	    ordinalParse: /\d{1,2}??/,
	    ordinal : '%d??'
	});

	return ptBr;

	})));


/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Romanian [ro]
	//! author : Vlad Gurdiga : https://github.com/gurdiga
	//! author : Valentin Agachi : https://github.com/avaly

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	function relativeTimeWithPlural(number, withoutSuffix, key) {
	    var format = {
	            'mm': 'minute',
	            'hh': 'ore',
	            'dd': 'zile',
	            'MM': 'luni',
	            'yy': 'ani'
	        },
	        separator = ' ';
	    if (number % 100 >= 20 || (number >= 100 && number % 100 === 0)) {
	        separator = ' de ';
	    }
	    return number + separator + format[key];
	}

	var ro = moment.defineLocale('ro', {
	    months : 'ianuarie_februarie_martie_aprilie_mai_iunie_iulie_august_septembrie_octombrie_noiembrie_decembrie'.split('_'),
	    monthsShort : 'ian._febr._mart._apr._mai_iun._iul._aug._sept._oct._nov._dec.'.split('_'),
	    monthsParseExact: true,
	    weekdays : 'duminic??_luni_mar??i_miercuri_joi_vineri_s??mb??t??'.split('_'),
	    weekdaysShort : 'Dum_Lun_Mar_Mie_Joi_Vin_S??m'.split('_'),
	    weekdaysMin : 'Du_Lu_Ma_Mi_Jo_Vi_S??'.split('_'),
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY H:mm',
	        LLLL : 'dddd, D MMMM YYYY H:mm'
	    },
	    calendar : {
	        sameDay: '[azi la] LT',
	        nextDay: '[m??ine la] LT',
	        nextWeek: 'dddd [la] LT',
	        lastDay: '[ieri la] LT',
	        lastWeek: '[fosta] dddd [la] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'peste %s',
	        past : '%s ??n urm??',
	        s : 'c??teva secunde',
	        m : 'un minut',
	        mm : relativeTimeWithPlural,
	        h : 'o or??',
	        hh : relativeTimeWithPlural,
	        d : 'o zi',
	        dd : relativeTimeWithPlural,
	        M : 'o lun??',
	        MM : relativeTimeWithPlural,
	        y : 'un an',
	        yy : relativeTimeWithPlural
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return ro;

	})));


/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Russian [ru]
	//! author : Viktorminator : https://github.com/Viktorminator
	//! Author : Menelion Elens??le : https://github.com/Oire
	//! author : ?????????????????? ???????? : https://github.com/socketpair

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	function plural(word, num) {
	    var forms = word.split('_');
	    return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
	}
	function relativeTimeWithPlural(number, withoutSuffix, key) {
	    var format = {
	        'mm': withoutSuffix ? '????????????_????????????_??????????' : '????????????_????????????_??????????',
	        'hh': '??????_????????_??????????',
	        'dd': '????????_??????_????????',
	        'MM': '??????????_????????????_??????????????',
	        'yy': '??????_????????_??????'
	    };
	    if (key === 'm') {
	        return withoutSuffix ? '????????????' : '????????????';
	    }
	    else {
	        return number + ' ' + plural(format[key], +number);
	    }
	}
	var monthsParse = [/^??????/i, /^??????/i, /^??????/i, /^??????/i, /^????[????]/i, /^??????/i, /^??????/i, /^??????/i, /^??????/i, /^??????/i, /^??????/i, /^??????/i];

	// http://new.gramota.ru/spravka/rules/139-prop : ?? 103
	// ???????????????????? ??????????????: http://new.gramota.ru/spravka/buro/search-answer?s=242637
	// CLDR data:          http://www.unicode.org/cldr/charts/28/summary/ru.html#1753
	var ru = moment.defineLocale('ru', {
	    months : {
	        format: '????????????_??????????????_??????????_????????????_??????_????????_????????_??????????????_????????????????_??????????????_????????????_??????????????'.split('_'),
	        standalone: '????????????_??????????????_????????_????????????_??????_????????_????????_????????????_????????????????_??????????????_????????????_??????????????'.split('_')
	    },
	    monthsShort : {
	        // ???? CLDR ???????????? "??????." ?? "??????.", ???? ?????????? ?????????? ???????????? ?????????? ???? ?????????? ?
	        format: '??????._????????._??????._??????._??????_????????_????????_??????._????????._??????._????????._??????.'.split('_'),
	        standalone: '??????._????????._????????_??????._??????_????????_????????_??????._????????._??????._????????._??????.'.split('_')
	    },
	    weekdays : {
	        standalone: '??????????????????????_??????????????????????_??????????????_??????????_??????????????_??????????????_??????????????'.split('_'),
	        format: '??????????????????????_??????????????????????_??????????????_??????????_??????????????_??????????????_??????????????'.split('_'),
	        isFormat: /\[ ?[????] ?(?:??????????????|??????????????????|??????)? ?\] ?dddd/
	    },
	    weekdaysShort : '????_????_????_????_????_????_????'.split('_'),
	    weekdaysMin : '????_????_????_????_????_????_????'.split('_'),
	    monthsParse : monthsParse,
	    longMonthsParse : monthsParse,
	    shortMonthsParse : monthsParse,

	    // ???????????? ???????????????? ?? ????????????????, ???? ?????? ??????????, ?????? ??????????????????, ???? 4 ??????????, ???????????????????? ?? ???????????? ?? ?????? ??????????
	    monthsRegex: /^(??????????[????]|??????\.?|????????????[????]|?????????\.?|???????????|??????\.?|??????????[????]|??????\.?|????[????]|??????[????]|??????\.?|??????[????]|??????\.?|???????????????|??????\.?|??????????????[????]|?????????\.?|????????????[????]|??????\.?|??????????[????]|?????????\.?|????????????[????]|??????\.?)/i,

	    // ?????????? ??????????????????????
	    monthsShortRegex: /^(??????????[????]|??????\.?|????????????[????]|?????????\.?|???????????|??????\.?|??????????[????]|??????\.?|????[????]|??????[????]|??????\.?|??????[????]|??????\.?|???????????????|??????\.?|??????????????[????]|?????????\.?|????????????[????]|??????\.?|??????????[????]|?????????\.?|????????????[????]|??????\.?)/i,

	    // ???????????? ???????????????? ?? ????????????????
	    monthsStrictRegex: /^(??????????[????]|????????????[????]|???????????|??????????[????]|????[????]|??????[????]|??????[????]|???????????????|??????????????[????]|????????????[????]|??????????[????]|????????????[????])/i,

	    // ??????????????????, ?????????????? ???????????????????????? ???????????? ?????????????????????? ????????????
	    monthsShortStrictRegex: /^(??????\.|?????????\.|??????[??.]|??????\.|????[????]|??????[????.]|??????[????.]|??????\.|?????????\.|??????\.|?????????\.|??????\.)/i,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY ??.',
	        LLL : 'D MMMM YYYY ??., HH:mm',
	        LLLL : 'dddd, D MMMM YYYY ??., HH:mm'
	    },
	    calendar : {
	        sameDay: '[?????????????? ??] LT',
	        nextDay: '[???????????? ??] LT',
	        lastDay: '[?????????? ??] LT',
	        nextWeek: function (now) {
	            if (now.week() !== this.week()) {
	                switch (this.day()) {
	                    case 0:
	                        return '[?? ??????????????????] dddd [??] LT';
	                    case 1:
	                    case 2:
	                    case 4:
	                        return '[?? ??????????????????] dddd [??] LT';
	                    case 3:
	                    case 5:
	                    case 6:
	                        return '[?? ??????????????????] dddd [??] LT';
	                }
	            } else {
	                if (this.day() === 2) {
	                    return '[????] dddd [??] LT';
	                } else {
	                    return '[??] dddd [??] LT';
	                }
	            }
	        },
	        lastWeek: function (now) {
	            if (now.week() !== this.week()) {
	                switch (this.day()) {
	                    case 0:
	                        return '[?? ??????????????] dddd [??] LT';
	                    case 1:
	                    case 2:
	                    case 4:
	                        return '[?? ??????????????] dddd [??] LT';
	                    case 3:
	                    case 5:
	                    case 6:
	                        return '[?? ??????????????] dddd [??] LT';
	                }
	            } else {
	                if (this.day() === 2) {
	                    return '[????] dddd [??] LT';
	                } else {
	                    return '[??] dddd [??] LT';
	                }
	            }
	        },
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : '?????????? %s',
	        past : '%s ??????????',
	        s : '?????????????????? ????????????',
	        m : relativeTimeWithPlural,
	        mm : relativeTimeWithPlural,
	        h : '??????',
	        hh : relativeTimeWithPlural,
	        d : '????????',
	        dd : relativeTimeWithPlural,
	        M : '??????????',
	        MM : relativeTimeWithPlural,
	        y : '??????',
	        yy : relativeTimeWithPlural
	    },
	    meridiemParse: /????????|????????|??????|????????????/i,
	    isPM : function (input) {
	        return /^(??????|????????????)$/.test(input);
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 4) {
	            return '????????';
	        } else if (hour < 12) {
	            return '????????';
	        } else if (hour < 17) {
	            return '??????';
	        } else {
	            return '????????????';
	        }
	    },
	    ordinalParse: /\d{1,2}-(??|????|??)/,
	    ordinal: function (number, period) {
	        switch (period) {
	            case 'M':
	            case 'd':
	            case 'DDD':
	                return number + '-??';
	            case 'D':
	                return number + '-????';
	            case 'w':
	            case 'W':
	                return number + '-??';
	            default:
	                return number;
	        }
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return ru;

	})));


/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Northern Sami [se]
	//! authors : B??rd Rolstad Henriksen : https://github.com/karamell

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';



	var se = moment.defineLocale('se', {
	    months : 'o????ajagem??nnu_guovvam??nnu_njuk??am??nnu_cuo??om??nnu_miessem??nnu_geassem??nnu_suoidnem??nnu_borgem??nnu_??ak??am??nnu_golggotm??nnu_sk??bmam??nnu_juovlam??nnu'.split('_'),
	    monthsShort : 'o????j_guov_njuk_cuo_mies_geas_suoi_borg_??ak??_golg_sk??b_juov'.split('_'),
	    weekdays : 'sotnabeaivi_vuoss??rga_ma????eb??rga_gaskavahkku_duorastat_bearjadat_l??vvardat'.split('_'),
	    weekdaysShort : 'sotn_vuos_ma??_gask_duor_bear_l??v'.split('_'),
	    weekdaysMin : 's_v_m_g_d_b_L'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'MMMM D. [b.] YYYY',
	        LLL : 'MMMM D. [b.] YYYY [ti.] HH:mm',
	        LLLL : 'dddd, MMMM D. [b.] YYYY [ti.] HH:mm'
	    },
	    calendar : {
	        sameDay: '[otne ti] LT',
	        nextDay: '[ihttin ti] LT',
	        nextWeek: 'dddd [ti] LT',
	        lastDay: '[ikte ti] LT',
	        lastWeek: '[ovddit] dddd [ti] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : '%s gea??es',
	        past : 'ma??it %s',
	        s : 'moadde sekunddat',
	        m : 'okta minuhta',
	        mm : '%d minuhtat',
	        h : 'okta diimmu',
	        hh : '%d diimmut',
	        d : 'okta beaivi',
	        dd : '%d beaivvit',
	        M : 'okta m??nnu',
	        MM : '%d m??nut',
	        y : 'okta jahki',
	        yy : '%d jagit'
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return se;

	})));


/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Sinhalese [si]
	//! author : Sampath Sitinamaluwa : https://github.com/sampathsris

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	/*jshint -W100*/
	var si = moment.defineLocale('si', {
	    months : '??????????????????_????????????????????????_??????????????????_????????????????????????_????????????_????????????_????????????_?????????????????????_?????????????????????????????????_????????????????????????_???????????????????????????_???????????????????????????'.split('_'),
	    monthsShort : '??????_?????????_????????????_?????????_????????????_????????????_????????????_?????????_????????????_?????????_????????????_????????????'.split('_'),
	    weekdays : '???????????????_???????????????_???????????????????????????_???????????????_??????????????????????????????????????????_????????????????????????_???????????????????????????'.split('_'),
	    weekdaysShort : '?????????_?????????_??????_?????????_???????????????_????????????_?????????'.split('_'),
	    weekdaysMin : '???_???_???_???_????????????_??????_??????'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'a h:mm',
	        LTS : 'a h:mm:ss',
	        L : 'YYYY/MM/DD',
	        LL : 'YYYY MMMM D',
	        LLL : 'YYYY MMMM D, a h:mm',
	        LLLL : 'YYYY MMMM D [????????????] dddd, a h:mm:ss'
	    },
	    calendar : {
	        sameDay : '[??????] LT[???]',
	        nextDay : '[?????????] LT[???]',
	        nextWeek : 'dddd LT[???]',
	        lastDay : '[?????????] LT[???]',
	        lastWeek : '[??????????????????] dddd LT[???]',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s????????????',
	        past : '%s?????? ?????????',
	        s : '??????????????? ??????????????????',
	        m : '???????????????????????????',
	        mm : '???????????????????????? %d',
	        h : '?????????',
	        hh : '????????? %d',
	        d : '????????????',
	        dd : '????????? %d',
	        M : '????????????',
	        MM : '????????? %d',
	        y : '?????????',
	        yy : '????????? %d'
	    },
	    ordinalParse: /\d{1,2} ????????????/,
	    ordinal : function (number) {
	        return number + ' ????????????';
	    },
	    meridiemParse : /????????? ?????????|????????? ?????????|??????.???|???.???./,
	    isPM : function (input) {
	        return input === '???.???.' || input === '????????? ?????????';
	    },
	    meridiem : function (hours, minutes, isLower) {
	        if (hours > 11) {
	            return isLower ? '???.???.' : '????????? ?????????';
	        } else {
	            return isLower ? '??????.???.' : '????????? ?????????';
	        }
	    }
	});

	return si;

	})));


/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Slovak [sk]
	//! author : Martin Minka : https://github.com/k2s
	//! based on work of petrbela : https://github.com/petrbela

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var months = 'janu??r_febru??r_marec_apr??l_m??j_j??n_j??l_august_september_okt??ber_november_december'.split('_');
	var monthsShort = 'jan_feb_mar_apr_m??j_j??n_j??l_aug_sep_okt_nov_dec'.split('_');
	function plural(n) {
	    return (n > 1) && (n < 5);
	}
	function translate(number, withoutSuffix, key, isFuture) {
	    var result = number + ' ';
	    switch (key) {
	        case 's':  // a few seconds / in a few seconds / a few seconds ago
	            return (withoutSuffix || isFuture) ? 'p??r sek??nd' : 'p??r sekundami';
	        case 'm':  // a minute / in a minute / a minute ago
	            return withoutSuffix ? 'min??ta' : (isFuture ? 'min??tu' : 'min??tou');
	        case 'mm': // 9 minutes / in 9 minutes / 9 minutes ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'min??ty' : 'min??t');
	            } else {
	                return result + 'min??tami';
	            }
	            break;
	        case 'h':  // an hour / in an hour / an hour ago
	            return withoutSuffix ? 'hodina' : (isFuture ? 'hodinu' : 'hodinou');
	        case 'hh': // 9 hours / in 9 hours / 9 hours ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'hodiny' : 'hod??n');
	            } else {
	                return result + 'hodinami';
	            }
	            break;
	        case 'd':  // a day / in a day / a day ago
	            return (withoutSuffix || isFuture) ? 'de??' : 'd??om';
	        case 'dd': // 9 days / in 9 days / 9 days ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'dni' : 'dn??');
	            } else {
	                return result + 'd??ami';
	            }
	            break;
	        case 'M':  // a month / in a month / a month ago
	            return (withoutSuffix || isFuture) ? 'mesiac' : 'mesiacom';
	        case 'MM': // 9 months / in 9 months / 9 months ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'mesiace' : 'mesiacov');
	            } else {
	                return result + 'mesiacmi';
	            }
	            break;
	        case 'y':  // a year / in a year / a year ago
	            return (withoutSuffix || isFuture) ? 'rok' : 'rokom';
	        case 'yy': // 9 years / in 9 years / 9 years ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'roky' : 'rokov');
	            } else {
	                return result + 'rokmi';
	            }
	            break;
	    }
	}

	var sk = moment.defineLocale('sk', {
	    months : months,
	    monthsShort : monthsShort,
	    weekdays : 'nede??a_pondelok_utorok_streda_??tvrtok_piatok_sobota'.split('_'),
	    weekdaysShort : 'ne_po_ut_st_??t_pi_so'.split('_'),
	    weekdaysMin : 'ne_po_ut_st_??t_pi_so'.split('_'),
	    longDateFormat : {
	        LT: 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D. MMMM YYYY',
	        LLL : 'D. MMMM YYYY H:mm',
	        LLLL : 'dddd D. MMMM YYYY H:mm'
	    },
	    calendar : {
	        sameDay: '[dnes o] LT',
	        nextDay: '[zajtra o] LT',
	        nextWeek: function () {
	            switch (this.day()) {
	                case 0:
	                    return '[v nede??u o] LT';
	                case 1:
	                case 2:
	                    return '[v] dddd [o] LT';
	                case 3:
	                    return '[v stredu o] LT';
	                case 4:
	                    return '[vo ??tvrtok o] LT';
	                case 5:
	                    return '[v piatok o] LT';
	                case 6:
	                    return '[v sobotu o] LT';
	            }
	        },
	        lastDay: '[v??era o] LT',
	        lastWeek: function () {
	            switch (this.day()) {
	                case 0:
	                    return '[minul?? nede??u o] LT';
	                case 1:
	                case 2:
	                    return '[minul??] dddd [o] LT';
	                case 3:
	                    return '[minul?? stredu o] LT';
	                case 4:
	                case 5:
	                    return '[minul??] dddd [o] LT';
	                case 6:
	                    return '[minul?? sobotu o] LT';
	            }
	        },
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'za %s',
	        past : 'pred %s',
	        s : translate,
	        m : translate,
	        mm : translate,
	        h : translate,
	        hh : translate,
	        d : translate,
	        dd : translate,
	        M : translate,
	        MM : translate,
	        y : translate,
	        yy : translate
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return sk;

	})));


/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Slovenian [sl]
	//! author : Robert Sedov??ek : https://github.com/sedovsek

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	function processRelativeTime(number, withoutSuffix, key, isFuture) {
	    var result = number + ' ';
	    switch (key) {
	        case 's':
	            return withoutSuffix || isFuture ? 'nekaj sekund' : 'nekaj sekundami';
	        case 'm':
	            return withoutSuffix ? 'ena minuta' : 'eno minuto';
	        case 'mm':
	            if (number === 1) {
	                result += withoutSuffix ? 'minuta' : 'minuto';
	            } else if (number === 2) {
	                result += withoutSuffix || isFuture ? 'minuti' : 'minutama';
	            } else if (number < 5) {
	                result += withoutSuffix || isFuture ? 'minute' : 'minutami';
	            } else {
	                result += withoutSuffix || isFuture ? 'minut' : 'minutami';
	            }
	            return result;
	        case 'h':
	            return withoutSuffix ? 'ena ura' : 'eno uro';
	        case 'hh':
	            if (number === 1) {
	                result += withoutSuffix ? 'ura' : 'uro';
	            } else if (number === 2) {
	                result += withoutSuffix || isFuture ? 'uri' : 'urama';
	            } else if (number < 5) {
	                result += withoutSuffix || isFuture ? 'ure' : 'urami';
	            } else {
	                result += withoutSuffix || isFuture ? 'ur' : 'urami';
	            }
	            return result;
	        case 'd':
	            return withoutSuffix || isFuture ? 'en dan' : 'enim dnem';
	        case 'dd':
	            if (number === 1) {
	                result += withoutSuffix || isFuture ? 'dan' : 'dnem';
	            } else if (number === 2) {
	                result += withoutSuffix || isFuture ? 'dni' : 'dnevoma';
	            } else {
	                result += withoutSuffix || isFuture ? 'dni' : 'dnevi';
	            }
	            return result;
	        case 'M':
	            return withoutSuffix || isFuture ? 'en mesec' : 'enim mesecem';
	        case 'MM':
	            if (number === 1) {
	                result += withoutSuffix || isFuture ? 'mesec' : 'mesecem';
	            } else if (number === 2) {
	                result += withoutSuffix || isFuture ? 'meseca' : 'mesecema';
	            } else if (number < 5) {
	                result += withoutSuffix || isFuture ? 'mesece' : 'meseci';
	            } else {
	                result += withoutSuffix || isFuture ? 'mesecev' : 'meseci';
	            }
	            return result;
	        case 'y':
	            return withoutSuffix || isFuture ? 'eno leto' : 'enim letom';
	        case 'yy':
	            if (number === 1) {
	                result += withoutSuffix || isFuture ? 'leto' : 'letom';
	            } else if (number === 2) {
	                result += withoutSuffix || isFuture ? 'leti' : 'letoma';
	            } else if (number < 5) {
	                result += withoutSuffix || isFuture ? 'leta' : 'leti';
	            } else {
	                result += withoutSuffix || isFuture ? 'let' : 'leti';
	            }
	            return result;
	    }
	}

	var sl = moment.defineLocale('sl', {
	    months : 'januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december'.split('_'),
	    monthsShort : 'jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.'.split('_'),
	    monthsParseExact: true,
	    weekdays : 'nedelja_ponedeljek_torek_sreda_??etrtek_petek_sobota'.split('_'),
	    weekdaysShort : 'ned._pon._tor._sre._??et._pet._sob.'.split('_'),
	    weekdaysMin : 'ne_po_to_sr_??e_pe_so'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D. MMMM YYYY',
	        LLL : 'D. MMMM YYYY H:mm',
	        LLLL : 'dddd, D. MMMM YYYY H:mm'
	    },
	    calendar : {
	        sameDay  : '[danes ob] LT',
	        nextDay  : '[jutri ob] LT',

	        nextWeek : function () {
	            switch (this.day()) {
	                case 0:
	                    return '[v] [nedeljo] [ob] LT';
	                case 3:
	                    return '[v] [sredo] [ob] LT';
	                case 6:
	                    return '[v] [soboto] [ob] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[v] dddd [ob] LT';
	            }
	        },
	        lastDay  : '[v??eraj ob] LT',
	        lastWeek : function () {
	            switch (this.day()) {
	                case 0:
	                    return '[prej??njo] [nedeljo] [ob] LT';
	                case 3:
	                    return '[prej??njo] [sredo] [ob] LT';
	                case 6:
	                    return '[prej??njo] [soboto] [ob] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[prej??nji] dddd [ob] LT';
	            }
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '??ez %s',
	        past   : 'pred %s',
	        s      : processRelativeTime,
	        m      : processRelativeTime,
	        mm     : processRelativeTime,
	        h      : processRelativeTime,
	        hh     : processRelativeTime,
	        d      : processRelativeTime,
	        dd     : processRelativeTime,
	        M      : processRelativeTime,
	        MM     : processRelativeTime,
	        y      : processRelativeTime,
	        yy     : processRelativeTime
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return sl;

	})));


/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Albanian [sq]
	//! author : Flak??rim Ismani : https://github.com/flakerimi
	//! author : Menelion Elens??le : https://github.com/Oire
	//! author : Oerd Cukalla : https://github.com/oerd

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var sq = moment.defineLocale('sq', {
	    months : 'Janar_Shkurt_Mars_Prill_Maj_Qershor_Korrik_Gusht_Shtator_Tetor_N??ntor_Dhjetor'.split('_'),
	    monthsShort : 'Jan_Shk_Mar_Pri_Maj_Qer_Kor_Gus_Sht_Tet_N??n_Dhj'.split('_'),
	    weekdays : 'E Diel_E H??n??_E Mart??_E M??rkur??_E Enjte_E Premte_E Shtun??'.split('_'),
	    weekdaysShort : 'Die_H??n_Mar_M??r_Enj_Pre_Sht'.split('_'),
	    weekdaysMin : 'D_H_Ma_M??_E_P_Sh'.split('_'),
	    weekdaysParseExact : true,
	    meridiemParse: /PD|MD/,
	    isPM: function (input) {
	        return input.charAt(0) === 'M';
	    },
	    meridiem : function (hours, minutes, isLower) {
	        return hours < 12 ? 'PD' : 'MD';
	    },
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[Sot n??] LT',
	        nextDay : '[Nes??r n??] LT',
	        nextWeek : 'dddd [n??] LT',
	        lastDay : '[Dje n??] LT',
	        lastWeek : 'dddd [e kaluar n??] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'n?? %s',
	        past : '%s m?? par??',
	        s : 'disa sekonda',
	        m : 'nj?? minut??',
	        mm : '%d minuta',
	        h : 'nj?? or??',
	        hh : '%d or??',
	        d : 'nj?? dit??',
	        dd : '%d dit??',
	        M : 'nj?? muaj',
	        MM : '%d muaj',
	        y : 'nj?? vit',
	        yy : '%d vite'
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return sq;

	})));


/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Serbian [sr]
	//! author : Milan Jana??kovi??<milanjanackovic@gmail.com> : https://github.com/milan-j

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var translator = {
	    words: { //Different grammatical cases
	        m: ['jedan minut', 'jedne minute'],
	        mm: ['minut', 'minute', 'minuta'],
	        h: ['jedan sat', 'jednog sata'],
	        hh: ['sat', 'sata', 'sati'],
	        dd: ['dan', 'dana', 'dana'],
	        MM: ['mesec', 'meseca', 'meseci'],
	        yy: ['godina', 'godine', 'godina']
	    },
	    correctGrammaticalCase: function (number, wordKey) {
	        return number === 1 ? wordKey[0] : (number >= 2 && number <= 4 ? wordKey[1] : wordKey[2]);
	    },
	    translate: function (number, withoutSuffix, key) {
	        var wordKey = translator.words[key];
	        if (key.length === 1) {
	            return withoutSuffix ? wordKey[0] : wordKey[1];
	        } else {
	            return number + ' ' + translator.correctGrammaticalCase(number, wordKey);
	        }
	    }
	};

	var sr = moment.defineLocale('sr', {
	    months: 'januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar'.split('_'),
	    monthsShort: 'jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.'.split('_'),
	    monthsParseExact: true,
	    weekdays: 'nedelja_ponedeljak_utorak_sreda_??etvrtak_petak_subota'.split('_'),
	    weekdaysShort: 'ned._pon._uto._sre._??et._pet._sub.'.split('_'),
	    weekdaysMin: 'ne_po_ut_sr_??e_pe_su'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat: {
	        LT: 'H:mm',
	        LTS : 'H:mm:ss',
	        L: 'DD.MM.YYYY',
	        LL: 'D. MMMM YYYY',
	        LLL: 'D. MMMM YYYY H:mm',
	        LLLL: 'dddd, D. MMMM YYYY H:mm'
	    },
	    calendar: {
	        sameDay: '[danas u] LT',
	        nextDay: '[sutra u] LT',
	        nextWeek: function () {
	            switch (this.day()) {
	                case 0:
	                    return '[u] [nedelju] [u] LT';
	                case 3:
	                    return '[u] [sredu] [u] LT';
	                case 6:
	                    return '[u] [subotu] [u] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[u] dddd [u] LT';
	            }
	        },
	        lastDay  : '[ju??e u] LT',
	        lastWeek : function () {
	            var lastWeekDays = [
	                '[pro??le] [nedelje] [u] LT',
	                '[pro??log] [ponedeljka] [u] LT',
	                '[pro??log] [utorka] [u] LT',
	                '[pro??le] [srede] [u] LT',
	                '[pro??log] [??etvrtka] [u] LT',
	                '[pro??log] [petka] [u] LT',
	                '[pro??le] [subote] [u] LT'
	            ];
	            return lastWeekDays[this.day()];
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'za %s',
	        past   : 'pre %s',
	        s      : 'nekoliko sekundi',
	        m      : translator.translate,
	        mm     : translator.translate,
	        h      : translator.translate,
	        hh     : translator.translate,
	        d      : 'dan',
	        dd     : translator.translate,
	        M      : 'mesec',
	        MM     : translator.translate,
	        y      : 'godinu',
	        yy     : translator.translate
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return sr;

	})));


/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Serbian Cyrillic [sr-cyrl]
	//! author : Milan Jana??kovi??<milanjanackovic@gmail.com> : https://github.com/milan-j

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var translator = {
	    words: { //Different grammatical cases
	        m: ['?????????? ??????????', '?????????? ????????????'],
	        mm: ['??????????', '????????????', '????????????'],
	        h: ['?????????? ??????', '???????????? ????????'],
	        hh: ['??????', '????????', '????????'],
	        dd: ['??????', '????????', '????????'],
	        MM: ['??????????', '????????????', '????????????'],
	        yy: ['????????????', '????????????', '????????????']
	    },
	    correctGrammaticalCase: function (number, wordKey) {
	        return number === 1 ? wordKey[0] : (number >= 2 && number <= 4 ? wordKey[1] : wordKey[2]);
	    },
	    translate: function (number, withoutSuffix, key) {
	        var wordKey = translator.words[key];
	        if (key.length === 1) {
	            return withoutSuffix ? wordKey[0] : wordKey[1];
	        } else {
	            return number + ' ' + translator.correctGrammaticalCase(number, wordKey);
	        }
	    }
	};

	var srCyrl = moment.defineLocale('sr-cyrl', {
	    months: '????????????_??????????????_????????_??????????_??????_??????_??????_????????????_??????????????????_??????????????_????????????????_????????????????'.split('_'),
	    monthsShort: '??????._??????._??????._??????._??????_??????_??????_??????._??????._??????._??????._??????.'.split('_'),
	    monthsParseExact: true,
	    weekdays: '????????????_??????????????????_????????????_??????????_????????????????_??????????_????????????'.split('_'),
	    weekdaysShort: '??????._??????._??????._??????._??????._??????._??????.'.split('_'),
	    weekdaysMin: '????_????_????_????_????_????_????'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat: {
	        LT: 'H:mm',
	        LTS : 'H:mm:ss',
	        L: 'DD.MM.YYYY',
	        LL: 'D. MMMM YYYY',
	        LLL: 'D. MMMM YYYY H:mm',
	        LLLL: 'dddd, D. MMMM YYYY H:mm'
	    },
	    calendar: {
	        sameDay: '[?????????? ??] LT',
	        nextDay: '[?????????? ??] LT',
	        nextWeek: function () {
	            switch (this.day()) {
	                case 0:
	                    return '[??] [????????????] [??] LT';
	                case 3:
	                    return '[??] [??????????] [??] LT';
	                case 6:
	                    return '[??] [????????????] [??] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[??] dddd [??] LT';
	            }
	        },
	        lastDay  : '[???????? ??] LT',
	        lastWeek : function () {
	            var lastWeekDays = [
	                '[????????????] [????????????] [??] LT',
	                '[??????????????] [??????????????????] [??] LT',
	                '[??????????????] [????????????] [??] LT',
	                '[????????????] [??????????] [??] LT',
	                '[??????????????] [????????????????] [??] LT',
	                '[??????????????] [??????????] [??] LT',
	                '[????????????] [????????????] [??] LT'
	            ];
	            return lastWeekDays[this.day()];
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '???? %s',
	        past   : '?????? %s',
	        s      : '???????????????? ??????????????',
	        m      : translator.translate,
	        mm     : translator.translate,
	        h      : translator.translate,
	        hh     : translator.translate,
	        d      : '??????',
	        dd     : translator.translate,
	        M      : '??????????',
	        MM     : translator.translate,
	        y      : '????????????',
	        yy     : translator.translate
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return srCyrl;

	})));


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : siSwati [ss]
	//! author : Nicolai Davies<mail@nicolai.io> : https://github.com/nicolaidavies

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';



	var ss = moment.defineLocale('ss', {
	    months : "Bhimbidvwane_Indlovana_Indlov'lenkhulu_Mabasa_Inkhwekhweti_Inhlaba_Kholwane_Ingci_Inyoni_Imphala_Lweti_Ingongoni".split('_'),
	    monthsShort : 'Bhi_Ina_Inu_Mab_Ink_Inh_Kho_Igc_Iny_Imp_Lwe_Igo'.split('_'),
	    weekdays : 'Lisontfo_Umsombuluko_Lesibili_Lesitsatfu_Lesine_Lesihlanu_Umgcibelo'.split('_'),
	    weekdaysShort : 'Lis_Umb_Lsb_Les_Lsi_Lsh_Umg'.split('_'),
	    weekdaysMin : 'Li_Us_Lb_Lt_Ls_Lh_Ug'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'h:mm A',
	        LTS : 'h:mm:ss A',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY h:mm A',
	        LLLL : 'dddd, D MMMM YYYY h:mm A'
	    },
	    calendar : {
	        sameDay : '[Namuhla nga] LT',
	        nextDay : '[Kusasa nga] LT',
	        nextWeek : 'dddd [nga] LT',
	        lastDay : '[Itolo nga] LT',
	        lastWeek : 'dddd [leliphelile] [nga] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'nga %s',
	        past : 'wenteka nga %s',
	        s : 'emizuzwana lomcane',
	        m : 'umzuzu',
	        mm : '%d emizuzu',
	        h : 'lihora',
	        hh : '%d emahora',
	        d : 'lilanga',
	        dd : '%d emalanga',
	        M : 'inyanga',
	        MM : '%d tinyanga',
	        y : 'umnyaka',
	        yy : '%d iminyaka'
	    },
	    meridiemParse: /ekuseni|emini|entsambama|ebusuku/,
	    meridiem : function (hours, minutes, isLower) {
	        if (hours < 11) {
	            return 'ekuseni';
	        } else if (hours < 15) {
	            return 'emini';
	        } else if (hours < 19) {
	            return 'entsambama';
	        } else {
	            return 'ebusuku';
	        }
	    },
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === 'ekuseni') {
	            return hour;
	        } else if (meridiem === 'emini') {
	            return hour >= 11 ? hour : hour + 12;
	        } else if (meridiem === 'entsambama' || meridiem === 'ebusuku') {
	            if (hour === 0) {
	                return 0;
	            }
	            return hour + 12;
	        }
	    },
	    ordinalParse: /\d{1,2}/,
	    ordinal : '%d',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return ss;

	})));


/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Swedish [sv]
	//! author : Jens Alm : https://github.com/ulmus

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var sv = moment.defineLocale('sv', {
	    months : 'januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december'.split('_'),
	    monthsShort : 'jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec'.split('_'),
	    weekdays : 's??ndag_m??ndag_tisdag_onsdag_torsdag_fredag_l??rdag'.split('_'),
	    weekdaysShort : 's??n_m??n_tis_ons_tor_fre_l??r'.split('_'),
	    weekdaysMin : 's??_m??_ti_on_to_fr_l??'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'YYYY-MM-DD',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY [kl.] HH:mm',
	        LLLL : 'dddd D MMMM YYYY [kl.] HH:mm',
	        lll : 'D MMM YYYY HH:mm',
	        llll : 'ddd D MMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[Idag] LT',
	        nextDay: '[Imorgon] LT',
	        lastDay: '[Ig??r] LT',
	        nextWeek: '[P??] dddd LT',
	        lastWeek: '[I] dddd[s] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'om %s',
	        past : 'f??r %s sedan',
	        s : 'n??gra sekunder',
	        m : 'en minut',
	        mm : '%d minuter',
	        h : 'en timme',
	        hh : '%d timmar',
	        d : 'en dag',
	        dd : '%d dagar',
	        M : 'en m??nad',
	        MM : '%d m??nader',
	        y : 'ett ??r',
	        yy : '%d ??r'
	    },
	    ordinalParse: /\d{1,2}(e|a)/,
	    ordinal : function (number) {
	        var b = number % 10,
	            output = (~~(number % 100 / 10) === 1) ? 'e' :
	            (b === 1) ? 'a' :
	            (b === 2) ? 'a' :
	            (b === 3) ? 'e' : 'e';
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return sv;

	})));


/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Swahili [sw]
	//! author : Fahad Kassim : https://github.com/fadsel

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var sw = moment.defineLocale('sw', {
	    months : 'Januari_Februari_Machi_Aprili_Mei_Juni_Julai_Agosti_Septemba_Oktoba_Novemba_Desemba'.split('_'),
	    monthsShort : 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ago_Sep_Okt_Nov_Des'.split('_'),
	    weekdays : 'Jumapili_Jumatatu_Jumanne_Jumatano_Alhamisi_Ijumaa_Jumamosi'.split('_'),
	    weekdaysShort : 'Jpl_Jtat_Jnne_Jtan_Alh_Ijm_Jmos'.split('_'),
	    weekdaysMin : 'J2_J3_J4_J5_Al_Ij_J1'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[leo saa] LT',
	        nextDay : '[kesho saa] LT',
	        nextWeek : '[wiki ijayo] dddd [saat] LT',
	        lastDay : '[jana] LT',
	        lastWeek : '[wiki iliyopita] dddd [saat] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s baadaye',
	        past : 'tokea %s',
	        s : 'hivi punde',
	        m : 'dakika moja',
	        mm : 'dakika %d',
	        h : 'saa limoja',
	        hh : 'masaa %d',
	        d : 'siku moja',
	        dd : 'masiku %d',
	        M : 'mwezi mmoja',
	        MM : 'miezi %d',
	        y : 'mwaka mmoja',
	        yy : 'miaka %d'
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return sw;

	})));


/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Tamil [ta]
	//! author : Arjunkumar Krishnamoorthy : https://github.com/tk120404

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var symbolMap = {
	    '1': '???',
	    '2': '???',
	    '3': '???',
	    '4': '???',
	    '5': '???',
	    '6': '???',
	    '7': '???',
	    '8': '???',
	    '9': '???',
	    '0': '???'
	};
	var numberMap = {
	    '???': '1',
	    '???': '2',
	    '???': '3',
	    '???': '4',
	    '???': '5',
	    '???': '6',
	    '???': '7',
	    '???': '8',
	    '???': '9',
	    '???': '0'
	};

	var ta = moment.defineLocale('ta', {
	    months : '???????????????_????????????????????????_??????????????????_??????????????????_??????_????????????_????????????_??????????????????_?????????????????????????????????_???????????????????????????_?????????????????????_????????????????????????'.split('_'),
	    monthsShort : '???????????????_????????????????????????_??????????????????_??????????????????_??????_????????????_????????????_??????????????????_?????????????????????????????????_???????????????????????????_?????????????????????_????????????????????????'.split('_'),
	    weekdays : '?????????????????????????????????????????????_????????????????????????????????????_???????????????????????????????????????_??????????????????????????????_????????????????????????????????????_???????????????????????????????????????_??????????????????????????????'.split('_'),
	    weekdaysShort : '??????????????????_?????????????????????_????????????????????????_???????????????_?????????????????????_??????????????????_?????????'.split('_'),
	    weekdaysMin : '??????_??????_??????_??????_??????_??????_???'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY, HH:mm',
	        LLLL : 'dddd, D MMMM YYYY, HH:mm'
	    },
	    calendar : {
	        sameDay : '[???????????????] LT',
	        nextDay : '[????????????] LT',
	        nextWeek : 'dddd, LT',
	        lastDay : '[??????????????????] LT',
	        lastWeek : '[??????????????? ???????????????] dddd, LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s ?????????',
	        past : '%s ????????????',
	        s : '????????? ????????? ???????????????????????????',
	        m : '????????? ?????????????????????',
	        mm : '%d ??????????????????????????????',
	        h : '????????? ????????? ???????????????',
	        hh : '%d ????????? ???????????????',
	        d : '????????? ????????????',
	        dd : '%d ?????????????????????',
	        M : '????????? ???????????????',
	        MM : '%d ????????????????????????',
	        y : '????????? ??????????????????',
	        yy : '%d ????????????????????????'
	    },
	    ordinalParse: /\d{1,2}?????????/,
	    ordinal : function (number) {
	        return number + '?????????';
	    },
	    preparse: function (string) {
	        return string.replace(/[??????????????????????????????]/g, function (match) {
	            return numberMap[match];
	        });
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        });
	    },
	    // refer http://ta.wikipedia.org/s/1er1
	    meridiemParse: /???????????????|???????????????|????????????|?????????????????????|?????????????????????|????????????/,
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 2) {
	            return ' ???????????????';
	        } else if (hour < 6) {
	            return ' ???????????????';  // ???????????????
	        } else if (hour < 10) {
	            return ' ????????????'; // ????????????
	        } else if (hour < 14) {
	            return ' ?????????????????????'; // ?????????????????????
	        } else if (hour < 18) {
	            return ' ?????????????????????'; // ?????????????????????
	        } else if (hour < 22) {
	            return ' ????????????'; // ????????????
	        } else {
	            return ' ???????????????';
	        }
	    },
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === '???????????????') {
	            return hour < 2 ? hour : hour + 12;
	        } else if (meridiem === '???????????????' || meridiem === '????????????') {
	            return hour;
	        } else if (meridiem === '?????????????????????') {
	            return hour >= 10 ? hour : hour + 12;
	        } else {
	            return hour + 12;
	        }
	    },
	    week : {
	        dow : 0, // Sunday is the first day of the week.
	        doy : 6  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return ta;

	})));


/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Telugu [te]
	//! author : Krishna Chaitanya Thota : https://github.com/kcthota

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var te = moment.defineLocale('te', {
	    months : '???????????????_????????????????????????_??????????????????_?????????????????????_??????_????????????_???????????????_??????????????????_??????????????????????????????_????????????????????????_??????????????????_????????????????????????'.split('_'),
	    monthsShort : '??????._???????????????._??????????????????_???????????????._??????_????????????_???????????????_??????._????????????._???????????????._??????._????????????.'.split('_'),
	    monthsParseExact : true,
	    weekdays : '?????????????????????_?????????????????????_????????????????????????_?????????????????????_????????????????????????_???????????????????????????_?????????????????????'.split('_'),
	    weekdaysShort : '?????????_?????????_????????????_?????????_????????????_???????????????_?????????'.split('_'),
	    weekdaysMin : '???_??????_??????_??????_??????_??????_???'.split('_'),
	    longDateFormat : {
	        LT : 'A h:mm',
	        LTS : 'A h:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY, A h:mm',
	        LLLL : 'dddd, D MMMM YYYY, A h:mm'
	    },
	    calendar : {
	        sameDay : '[????????????] LT',
	        nextDay : '[????????????] LT',
	        nextWeek : 'dddd, LT',
	        lastDay : '[???????????????] LT',
	        lastWeek : '[??????] dddd, LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s ??????',
	        past : '%s ??????????????????',
	        s : '?????????????????? ?????????????????????',
	        m : '?????? ??????????????????',
	        mm : '%d ????????????????????????',
	        h : '?????? ?????????',
	        hh : '%d ???????????????',
	        d : '?????? ????????????',
	        dd : '%d ??????????????????',
	        M : '?????? ?????????',
	        MM : '%d ???????????????',
	        y : '?????? ????????????????????????',
	        yy : '%d ??????????????????????????????'
	    },
	    ordinalParse : /\d{1,2}???/,
	    ordinal : '%d???',
	    meridiemParse: /??????????????????|????????????|???????????????????????????|????????????????????????/,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === '??????????????????') {
	            return hour < 4 ? hour : hour + 12;
	        } else if (meridiem === '????????????') {
	            return hour;
	        } else if (meridiem === '???????????????????????????') {
	            return hour >= 10 ? hour : hour + 12;
	        } else if (meridiem === '????????????????????????') {
	            return hour + 12;
	        }
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 4) {
	            return '??????????????????';
	        } else if (hour < 10) {
	            return '????????????';
	        } else if (hour < 17) {
	            return '???????????????????????????';
	        } else if (hour < 20) {
	            return '????????????????????????';
	        } else {
	            return '??????????????????';
	        }
	    },
	    week : {
	        dow : 0, // Sunday is the first day of the week.
	        doy : 6  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return te;

	})));


/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Tetun Dili (East Timor) [tet]
	//! author : Joshua Brooks : https://github.com/joshbrooks
	//! author : Onorio De J. Afonso : https://github.com/marobo

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var tet = moment.defineLocale('tet', {
	    months : 'Janeiru_Fevereiru_Marsu_Abril_Maiu_Juniu_Juliu_Augustu_Setembru_Outubru_Novembru_Dezembru'.split('_'),
	    monthsShort : 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Aug_Set_Out_Nov_Dez'.split('_'),
	    weekdays : 'Domingu_Segunda_Tersa_Kuarta_Kinta_Sexta_Sabadu'.split('_'),
	    weekdaysShort : 'Dom_Seg_Ters_Kua_Kint_Sext_Sab'.split('_'),
	    weekdaysMin : 'Do_Seg_Te_Ku_Ki_Sex_Sa'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[Ohin iha] LT',
	        nextDay: '[Aban iha] LT',
	        nextWeek: 'dddd [iha] LT',
	        lastDay: '[Horiseik iha] LT',
	        lastWeek: 'dddd [semana kotuk] [iha] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'iha %s',
	        past : '%s liuba',
	        s : 'minutu balun',
	        m : 'minutu ida',
	        mm : 'minutus %d',
	        h : 'horas ida',
	        hh : 'horas %d',
	        d : 'loron ida',
	        dd : 'loron %d',
	        M : 'fulan ida',
	        MM : 'fulan %d',
	        y : 'tinan ida',
	        yy : 'tinan %d'
	    },
	    ordinalParse: /\d{1,2}(st|nd|rd|th)/,
	    ordinal : function (number) {
	        var b = number % 10,
	            output = (~~(number % 100 / 10) === 1) ? 'th' :
	            (b === 1) ? 'st' :
	            (b === 2) ? 'nd' :
	            (b === 3) ? 'rd' : 'th';
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return tet;

	})));


/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Thai [th]
	//! author : Kridsada Thanabulpong : https://github.com/sirn

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var th = moment.defineLocale('th', {
	    months : '??????????????????_??????????????????????????????_??????????????????_??????????????????_?????????????????????_????????????????????????_?????????????????????_?????????????????????_?????????????????????_??????????????????_???????????????????????????_?????????????????????'.split('_'),
	    monthsShort : '???.???._???.???._??????.???._??????.???._???.???._??????.???._???.???._???.???._???.???._???.???._???.???._???.???.'.split('_'),
	    monthsParseExact: true,
	    weekdays : '?????????????????????_??????????????????_??????????????????_?????????_????????????????????????_???????????????_???????????????'.split('_'),
	    weekdaysShort : '?????????????????????_??????????????????_??????????????????_?????????_???????????????_???????????????_???????????????'.split('_'), // yes, three characters difference
	    weekdaysMin : '??????._???._???._???._??????._???._???.'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'YYYY/MM/DD',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY ???????????? H:mm',
	        LLLL : '?????????dddd????????? D MMMM YYYY ???????????? H:mm'
	    },
	    meridiemParse: /??????????????????????????????|??????????????????????????????/,
	    isPM: function (input) {
	        return input === '??????????????????????????????';
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 12) {
	            return '??????????????????????????????';
	        } else {
	            return '??????????????????????????????';
	        }
	    },
	    calendar : {
	        sameDay : '[?????????????????? ????????????] LT',
	        nextDay : '[???????????????????????? ????????????] LT',
	        nextWeek : 'dddd[???????????? ????????????] LT',
	        lastDay : '[????????????????????????????????? ????????????] LT',
	        lastWeek : '[?????????]dddd[????????????????????? ????????????] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '????????? %s',
	        past : '%s?????????????????????',
	        s : '????????????????????????????????????',
	        m : '1 ????????????',
	        mm : '%d ????????????',
	        h : '1 ?????????????????????',
	        hh : '%d ?????????????????????',
	        d : '1 ?????????',
	        dd : '%d ?????????',
	        M : '1 ???????????????',
	        MM : '%d ???????????????',
	        y : '1 ??????',
	        yy : '%d ??????'
	    }
	});

	return th;

	})));


/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Tagalog (Philippines) [tl-ph]
	//! author : Dan Hagman : https://github.com/hagmandan

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var tlPh = moment.defineLocale('tl-ph', {
	    months : 'Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre'.split('_'),
	    monthsShort : 'Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis'.split('_'),
	    weekdays : 'Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado'.split('_'),
	    weekdaysShort : 'Lin_Lun_Mar_Miy_Huw_Biy_Sab'.split('_'),
	    weekdaysMin : 'Li_Lu_Ma_Mi_Hu_Bi_Sab'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'MM/D/YYYY',
	        LL : 'MMMM D, YYYY',
	        LLL : 'MMMM D, YYYY HH:mm',
	        LLLL : 'dddd, MMMM DD, YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: 'LT [ngayong araw]',
	        nextDay: '[Bukas ng] LT',
	        nextWeek: 'LT [sa susunod na] dddd',
	        lastDay: 'LT [kahapon]',
	        lastWeek: 'LT [noong nakaraang] dddd',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'sa loob ng %s',
	        past : '%s ang nakalipas',
	        s : 'ilang segundo',
	        m : 'isang minuto',
	        mm : '%d minuto',
	        h : 'isang oras',
	        hh : '%d oras',
	        d : 'isang araw',
	        dd : '%d araw',
	        M : 'isang buwan',
	        MM : '%d buwan',
	        y : 'isang taon',
	        yy : '%d taon'
	    },
	    ordinalParse: /\d{1,2}/,
	    ordinal : function (number) {
	        return number;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return tlPh;

	})));


/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Klingon [tlh]
	//! author : Dominika Kruk : https://github.com/amaranthrose

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var numbersNouns = 'pagh_wa???_cha???_wej_loS_vagh_jav_Soch_chorgh_Hut'.split('_');

	function translateFuture(output) {
	    var time = output;
	    time = (output.indexOf('jaj') !== -1) ?
	    time.slice(0, -3) + 'leS' :
	    (output.indexOf('jar') !== -1) ?
	    time.slice(0, -3) + 'waQ' :
	    (output.indexOf('DIS') !== -1) ?
	    time.slice(0, -3) + 'nem' :
	    time + ' pIq';
	    return time;
	}

	function translatePast(output) {
	    var time = output;
	    time = (output.indexOf('jaj') !== -1) ?
	    time.slice(0, -3) + 'Hu???' :
	    (output.indexOf('jar') !== -1) ?
	    time.slice(0, -3) + 'wen' :
	    (output.indexOf('DIS') !== -1) ?
	    time.slice(0, -3) + 'ben' :
	    time + ' ret';
	    return time;
	}

	function translate(number, withoutSuffix, string, isFuture) {
	    var numberNoun = numberAsNoun(number);
	    switch (string) {
	        case 'mm':
	            return numberNoun + ' tup';
	        case 'hh':
	            return numberNoun + ' rep';
	        case 'dd':
	            return numberNoun + ' jaj';
	        case 'MM':
	            return numberNoun + ' jar';
	        case 'yy':
	            return numberNoun + ' DIS';
	    }
	}

	function numberAsNoun(number) {
	    var hundred = Math.floor((number % 1000) / 100),
	    ten = Math.floor((number % 100) / 10),
	    one = number % 10,
	    word = '';
	    if (hundred > 0) {
	        word += numbersNouns[hundred] + 'vatlh';
	    }
	    if (ten > 0) {
	        word += ((word !== '') ? ' ' : '') + numbersNouns[ten] + 'maH';
	    }
	    if (one > 0) {
	        word += ((word !== '') ? ' ' : '') + numbersNouns[one];
	    }
	    return (word === '') ? 'pagh' : word;
	}

	var tlh = moment.defineLocale('tlh', {
	    months : 'tera??? jar wa???_tera??? jar cha???_tera??? jar wej_tera??? jar loS_tera??? jar vagh_tera??? jar jav_tera??? jar Soch_tera??? jar chorgh_tera??? jar Hut_tera??? jar wa???maH_tera??? jar wa???maH wa???_tera??? jar wa???maH cha???'.split('_'),
	    monthsShort : 'jar wa???_jar cha???_jar wej_jar loS_jar vagh_jar jav_jar Soch_jar chorgh_jar Hut_jar wa???maH_jar wa???maH wa???_jar wa???maH cha???'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj'.split('_'),
	    weekdaysShort : 'lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj'.split('_'),
	    weekdaysMin : 'lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[DaHjaj] LT',
	        nextDay: '[wa???leS] LT',
	        nextWeek: 'LLL',
	        lastDay: '[wa???Hu???] LT',
	        lastWeek: 'LLL',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : translateFuture,
	        past : translatePast,
	        s : 'puS lup',
	        m : 'wa??? tup',
	        mm : translate,
	        h : 'wa??? rep',
	        hh : translate,
	        d : 'wa??? jaj',
	        dd : translate,
	        M : 'wa??? jar',
	        MM : translate,
	        y : 'wa??? DIS',
	        yy : translate
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return tlh;

	})));


/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Turkish [tr]
	//! authors : Erhan Gundogan : https://github.com/erhangundogan,
	//!           Burak Yi??it Kaya: https://github.com/BYK

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var suffixes = {
	    1: '\'inci',
	    5: '\'inci',
	    8: '\'inci',
	    70: '\'inci',
	    80: '\'inci',
	    2: '\'nci',
	    7: '\'nci',
	    20: '\'nci',
	    50: '\'nci',
	    3: '\'??nc??',
	    4: '\'??nc??',
	    100: '\'??nc??',
	    6: '\'nc??',
	    9: '\'uncu',
	    10: '\'uncu',
	    30: '\'uncu',
	    60: '\'??nc??',
	    90: '\'??nc??'
	};

	var tr = moment.defineLocale('tr', {
	    months : 'Ocak_??ubat_Mart_Nisan_May??s_Haziran_Temmuz_A??ustos_Eyl??l_Ekim_Kas??m_Aral??k'.split('_'),
	    monthsShort : 'Oca_??ub_Mar_Nis_May_Haz_Tem_A??u_Eyl_Eki_Kas_Ara'.split('_'),
	    weekdays : 'Pazar_Pazartesi_Sal??_??ar??amba_Per??embe_Cuma_Cumartesi'.split('_'),
	    weekdaysShort : 'Paz_Pts_Sal_??ar_Per_Cum_Cts'.split('_'),
	    weekdaysMin : 'Pz_Pt_Sa_??a_Pe_Cu_Ct'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[bug??n saat] LT',
	        nextDay : '[yar??n saat] LT',
	        nextWeek : '[haftaya] dddd [saat] LT',
	        lastDay : '[d??n] LT',
	        lastWeek : '[ge??en hafta] dddd [saat] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s sonra',
	        past : '%s ??nce',
	        s : 'birka?? saniye',
	        m : 'bir dakika',
	        mm : '%d dakika',
	        h : 'bir saat',
	        hh : '%d saat',
	        d : 'bir g??n',
	        dd : '%d g??n',
	        M : 'bir ay',
	        MM : '%d ay',
	        y : 'bir y??l',
	        yy : '%d y??l'
	    },
	    ordinalParse: /\d{1,2}'(inci|nci|??nc??|nc??|uncu|??nc??)/,
	    ordinal : function (number) {
	        if (number === 0) {  // special case for zero
	            return number + '\'??nc??';
	        }
	        var a = number % 10,
	            b = number % 100 - a,
	            c = number >= 100 ? 100 : null;
	        return number + (suffixes[a] || suffixes[b] || suffixes[c]);
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return tr;

	})));


/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Talossan [tzl]
	//! author : Robin van der Vliet : https://github.com/robin0van0der0v
	//! author : Iust?? Canun

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	// After the year there should be a slash and the amount of years since December 26, 1979 in Roman numerals.
	// This is currently too difficult (maybe even impossible) to add.
	var tzl = moment.defineLocale('tzl', {
	    months : 'Januar_Fevraglh_Mar??_Avr??u_Mai_G??n_Julia_Guscht_Setemvar_Listop??ts_Noemvar_Zecemvar'.split('_'),
	    monthsShort : 'Jan_Fev_Mar_Avr_Mai_G??n_Jul_Gus_Set_Lis_Noe_Zec'.split('_'),
	    weekdays : 'S??ladi_L??ne??i_Maitzi_M??rcuri_Xh??adi_Vi??ner??i_S??turi'.split('_'),
	    weekdaysShort : 'S??l_L??n_Mai_M??r_Xh??_Vi??_S??t'.split('_'),
	    weekdaysMin : 'S??_L??_Ma_M??_Xh_Vi_S??'.split('_'),
	    longDateFormat : {
	        LT : 'HH.mm',
	        LTS : 'HH.mm.ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D. MMMM [dallas] YYYY',
	        LLL : 'D. MMMM [dallas] YYYY HH.mm',
	        LLLL : 'dddd, [li] D. MMMM [dallas] YYYY HH.mm'
	    },
	    meridiemParse: /d\'o|d\'a/i,
	    isPM : function (input) {
	        return 'd\'o' === input.toLowerCase();
	    },
	    meridiem : function (hours, minutes, isLower) {
	        if (hours > 11) {
	            return isLower ? 'd\'o' : 'D\'O';
	        } else {
	            return isLower ? 'd\'a' : 'D\'A';
	        }
	    },
	    calendar : {
	        sameDay : '[oxhi ??] LT',
	        nextDay : '[dem?? ??] LT',
	        nextWeek : 'dddd [??] LT',
	        lastDay : '[ieiri ??] LT',
	        lastWeek : '[s??r el] dddd [lasteu ??] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'osprei %s',
	        past : 'ja%s',
	        s : processRelativeTime,
	        m : processRelativeTime,
	        mm : processRelativeTime,
	        h : processRelativeTime,
	        hh : processRelativeTime,
	        d : processRelativeTime,
	        dd : processRelativeTime,
	        M : processRelativeTime,
	        MM : processRelativeTime,
	        y : processRelativeTime,
	        yy : processRelativeTime
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	function processRelativeTime(number, withoutSuffix, key, isFuture) {
	    var format = {
	        's': ['viensas secunds', '\'iensas secunds'],
	        'm': ['\'n m??ut', '\'iens m??ut'],
	        'mm': [number + ' m??uts', '' + number + ' m??uts'],
	        'h': ['\'n ??ora', '\'iensa ??ora'],
	        'hh': [number + ' ??oras', '' + number + ' ??oras'],
	        'd': ['\'n ziua', '\'iensa ziua'],
	        'dd': [number + ' ziuas', '' + number + ' ziuas'],
	        'M': ['\'n mes', '\'iens mes'],
	        'MM': [number + ' mesen', '' + number + ' mesen'],
	        'y': ['\'n ar', '\'iens ar'],
	        'yy': [number + ' ars', '' + number + ' ars']
	    };
	    return isFuture ? format[key][0] : (withoutSuffix ? format[key][0] : format[key][1]);
	}

	return tzl;

	})));


/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Central Atlas Tamazight [tzm]
	//! author : Abdel Said : https://github.com/abdelsaid

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var tzm = moment.defineLocale('tzm', {
	    months : '??????????????????_???????????????_????????????_???????????????_???????????????_???????????????_??????????????????_????????????_????????????????????????_???????????????_????????????????????????_?????????????????????'.split('_'),
	    monthsShort : '??????????????????_???????????????_????????????_???????????????_???????????????_???????????????_??????????????????_????????????_????????????????????????_???????????????_????????????????????????_?????????????????????'.split('_'),
	    weekdays : '??????????????????_???????????????_??????????????????_???????????????_???????????????_?????????????????????_?????????????????????'.split('_'),
	    weekdaysShort : '??????????????????_???????????????_??????????????????_???????????????_???????????????_?????????????????????_?????????????????????'.split('_'),
	    weekdaysMin : '??????????????????_???????????????_??????????????????_???????????????_???????????????_?????????????????????_?????????????????????'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS: 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[???????????? ???] LT',
	        nextDay: '[???????????? ???] LT',
	        nextWeek: 'dddd [???] LT',
	        lastDay: '[??????????????? ???] LT',
	        lastWeek: 'dddd [???] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : '???????????? ??? ????????? %s',
	        past : '????????? %s',
	        s : '????????????',
	        m : '???????????????',
	        mm : '%d ???????????????',
	        h : '????????????',
	        hh : '%d ????????????????????????',
	        d : '?????????',
	        dd : '%d o????????????',
	        M : '??????o??????',
	        MM : '%d ??????????????????',
	        y : '???????????????',
	        yy : '%d ??????????????????'
	    },
	    week : {
	        dow : 6, // Saturday is the first day of the week.
	        doy : 12  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return tzm;

	})));


/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Central Atlas Tamazight Latin [tzm-latn]
	//! author : Abdel Said : https://github.com/abdelsaid

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var tzmLatn = moment.defineLocale('tzm-latn', {
	    months : 'innayr_br??ayr??_mar??s??_ibrir_mayyw_ywnyw_ywlywz_??w??t_??wtanbir_kt??wbr??_nwwanbir_dwjnbir'.split('_'),
	    monthsShort : 'innayr_br??ayr??_mar??s??_ibrir_mayyw_ywnyw_ywlywz_??w??t_??wtanbir_kt??wbr??_nwwanbir_dwjnbir'.split('_'),
	    weekdays : 'asamas_aynas_asinas_akras_akwas_asimwas_asi???yas'.split('_'),
	    weekdaysShort : 'asamas_aynas_asinas_akras_akwas_asimwas_asi???yas'.split('_'),
	    weekdaysMin : 'asamas_aynas_asinas_akras_akwas_asimwas_asi???yas'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[asdkh g] LT',
	        nextDay: '[aska g] LT',
	        nextWeek: 'dddd [g] LT',
	        lastDay: '[assant g] LT',
	        lastWeek: 'dddd [g] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'dadkh s yan %s',
	        past : 'yan %s',
	        s : 'imik',
	        m : 'minu???',
	        mm : '%d minu???',
	        h : 'sa??a',
	        hh : '%d tassa??in',
	        d : 'ass',
	        dd : '%d ossan',
	        M : 'ayowr',
	        MM : '%d iyyirn',
	        y : 'asgas',
	        yy : '%d isgasn'
	    },
	    week : {
	        dow : 6, // Saturday is the first day of the week.
	        doy : 12  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return tzmLatn;

	})));


/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Ukrainian [uk]
	//! author : zemlanin : https://github.com/zemlanin
	//! Author : Menelion Elens??le : https://github.com/Oire

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	function plural(word, num) {
	    var forms = word.split('_');
	    return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
	}
	function relativeTimeWithPlural(number, withoutSuffix, key) {
	    var format = {
	        'mm': withoutSuffix ? '??????????????_??????????????_????????????' : '??????????????_??????????????_????????????',
	        'hh': withoutSuffix ? '????????????_????????????_??????????' : '????????????_????????????_??????????',
	        'dd': '????????_??????_????????',
	        'MM': '????????????_????????????_??????????????',
	        'yy': '??????_????????_??????????'
	    };
	    if (key === 'm') {
	        return withoutSuffix ? '??????????????' : '??????????????';
	    }
	    else if (key === 'h') {
	        return withoutSuffix ? '????????????' : '????????????';
	    }
	    else {
	        return number + ' ' + plural(format[key], +number);
	    }
	}
	function weekdaysCaseReplace(m, format) {
	    var weekdays = {
	        'nominative': '????????????_??????????????????_????????????????_????????????_????????????_?????????????????_????????????'.split('_'),
	        'accusative': '????????????_??????????????????_????????????????_????????????_????????????_?????????????????_????????????'.split('_'),
	        'genitive': '????????????_??????????????????_????????????????_????????????_????????????????_?????????????????_????????????'.split('_')
	    },
	    nounCase = (/(\[[????????]\]) ?dddd/).test(format) ?
	        'accusative' :
	        ((/\[?(?:??????????????|??????????????????)? ?\] ?dddd/).test(format) ?
	            'genitive' :
	            'nominative');
	    return weekdays[nounCase][m.day()];
	}
	function processHoursFunction(str) {
	    return function () {
	        return str + '??' + (this.hours() === 11 ? '??' : '') + '] LT';
	    };
	}

	var uk = moment.defineLocale('uk', {
	    months : {
	        'format': '??????????_????????????_??????????????_????????????_????????????_????????????_??????????_????????????_??????????????_????????????_??????????????????_????????????'.split('_'),
	        'standalone': '????????????_??????????_????????????????_??????????????_??????????????_??????????????_????????????_??????????????_????????????????_??????????????_????????????????_??????????????'.split('_')
	    },
	    monthsShort : '??????_??????_??????_????????_????????_????????_??????_????????_??????_????????_????????_????????'.split('_'),
	    weekdays : weekdaysCaseReplace,
	    weekdaysShort : '????_????_????_????_????_????_????'.split('_'),
	    weekdaysMin : '????_????_????_????_????_????_????'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY ??.',
	        LLL : 'D MMMM YYYY ??., HH:mm',
	        LLLL : 'dddd, D MMMM YYYY ??., HH:mm'
	    },
	    calendar : {
	        sameDay: processHoursFunction('[???????????????? '),
	        nextDay: processHoursFunction('[???????????? '),
	        lastDay: processHoursFunction('[?????????? '),
	        nextWeek: processHoursFunction('[??] dddd ['),
	        lastWeek: function () {
	            switch (this.day()) {
	                case 0:
	                case 3:
	                case 5:
	                case 6:
	                    return processHoursFunction('[??????????????] dddd [').call(this);
	                case 1:
	                case 2:
	                case 4:
	                    return processHoursFunction('[????????????????] dddd [').call(this);
	            }
	        },
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : '???? %s',
	        past : '%s ????????',
	        s : '???????????????? ????????????',
	        m : relativeTimeWithPlural,
	        mm : relativeTimeWithPlural,
	        h : '????????????',
	        hh : relativeTimeWithPlural,
	        d : '????????',
	        dd : relativeTimeWithPlural,
	        M : '????????????',
	        MM : relativeTimeWithPlural,
	        y : '??????',
	        yy : relativeTimeWithPlural
	    },
	    // M. E.: those two are virtually unused but a user might want to implement them for his/her website for some reason
	    meridiemParse: /????????|??????????|??????|????????????/,
	    isPM: function (input) {
	        return /^(??????|????????????)$/.test(input);
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 4) {
	            return '????????';
	        } else if (hour < 12) {
	            return '??????????';
	        } else if (hour < 17) {
	            return '??????';
	        } else {
	            return '????????????';
	        }
	    },
	    ordinalParse: /\d{1,2}-(??|????)/,
	    ordinal: function (number, period) {
	        switch (period) {
	            case 'M':
	            case 'd':
	            case 'DDD':
	            case 'w':
	            case 'W':
	                return number + '-??';
	            case 'D':
	                return number + '-????';
	            default:
	                return number;
	        }
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return uk;

	})));


/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Uzbek [uz]
	//! author : Sardor Muminov : https://github.com/muminoff

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var uz = moment.defineLocale('uz', {
	    months : '??????????_????????????_????????_??????????_??????_??????_??????_????????????_??????????????_????????????_??????????_????????????'.split('_'),
	    monthsShort : '??????_??????_??????_??????_??????_??????_??????_??????_??????_??????_??????_??????'.split('_'),
	    weekdays : '??????????????_??????????????_??????????????_????????????????_????????????????_????????_??????????'.split('_'),
	    weekdaysShort : '??????_??????_??????_??????_??????_??????_??????'.split('_'),
	    weekdaysMin : '????_????_????_????_????_????_????'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'D MMMM YYYY, dddd HH:mm'
	    },
	    calendar : {
	        sameDay : '[?????????? ????????] LT [????]',
	        nextDay : '[????????????] LT [????]',
	        nextWeek : 'dddd [???????? ????????] LT [????]',
	        lastDay : '[???????? ????????] LT [????]',
	        lastWeek : '[??????????] dddd [???????? ????????] LT [????]',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '???????? %s ??????????',
	        past : '?????? ???????? %s ??????????',
	        s : '????????????',
	        m : '?????? ????????????',
	        mm : '%d ????????????',
	        h : '?????? ????????',
	        hh : '%d ????????',
	        d : '?????? ??????',
	        dd : '%d ??????',
	        M : '?????? ????',
	        MM : '%d ????',
	        y : '?????? ??????',
	        yy : '%d ??????'
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return uz;

	})));


/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Vietnamese [vi]
	//! author : Bang Nguyen : https://github.com/bangnk

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var vi = moment.defineLocale('vi', {
	    months : 'th??ng 1_th??ng 2_th??ng 3_th??ng 4_th??ng 5_th??ng 6_th??ng 7_th??ng 8_th??ng 9_th??ng 10_th??ng 11_th??ng 12'.split('_'),
	    monthsShort : 'Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'ch??? nh???t_th??? hai_th??? ba_th??? t??_th??? n??m_th??? s??u_th??? b???y'.split('_'),
	    weekdaysShort : 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
	    weekdaysMin : 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
	    weekdaysParseExact : true,
	    meridiemParse: /sa|ch/i,
	    isPM : function (input) {
	        return /^ch$/i.test(input);
	    },
	    meridiem : function (hours, minutes, isLower) {
	        if (hours < 12) {
	            return isLower ? 'sa' : 'SA';
	        } else {
	            return isLower ? 'ch' : 'CH';
	        }
	    },
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM [n??m] YYYY',
	        LLL : 'D MMMM [n??m] YYYY HH:mm',
	        LLLL : 'dddd, D MMMM [n??m] YYYY HH:mm',
	        l : 'DD/M/YYYY',
	        ll : 'D MMM YYYY',
	        lll : 'D MMM YYYY HH:mm',
	        llll : 'ddd, D MMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[H??m nay l??c] LT',
	        nextDay: '[Ng??y mai l??c] LT',
	        nextWeek: 'dddd [tu???n t???i l??c] LT',
	        lastDay: '[H??m qua l??c] LT',
	        lastWeek: 'dddd [tu???n r???i l??c] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : '%s t???i',
	        past : '%s tr?????c',
	        s : 'v??i gi??y',
	        m : 'm???t ph??t',
	        mm : '%d ph??t',
	        h : 'm???t gi???',
	        hh : '%d gi???',
	        d : 'm???t ng??y',
	        dd : '%d ng??y',
	        M : 'm???t th??ng',
	        MM : '%d th??ng',
	        y : 'm???t n??m',
	        yy : '%d n??m'
	    },
	    ordinalParse: /\d{1,2}/,
	    ordinal : function (number) {
	        return number;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return vi;

	})));


/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Pseudo [x-pseudo]
	//! author : Andrew Hood : https://github.com/andrewhood125

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var xPseudo = moment.defineLocale('x-pseudo', {
	    months : 'J~????????~r??_F~??br??~??r??_~M??rc~h_??p~r??l_~M????_~J??????~_J??l~??_????~g??st~_S??p~t??mb~??r_??~ct??b~??r_??~??v??m~b??r_~D??c??~mb??r'.split('_'),
	    monthsShort : 'J~????_~F??b_~M??r_~??pr_~M????_~J????_~J??l_~????g_~S??p_~??ct_~????v_~D??c'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'S~????d??~??_M??~??d????~_T????~sd????~_W??d~????sd~????_T~h??rs~d????_~Fr??d~????_S~??t??r~d????'.split('_'),
	    weekdaysShort : 'S~????_~M????_~T????_~W??d_~Th??_~Fr??_~S??t'.split('_'),
	    weekdaysMin : 'S~??_M??~_T??_~W??_T~h_Fr~_S??'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[T~??d??~?? ??t] LT',
	        nextDay : '[T~??m??~rr??~w ??t] LT',
	        nextWeek : 'dddd [??t] LT',
	        lastDay : '[??~??st~??rd??~?? ??t] LT',
	        lastWeek : '[L~??st] dddd [??t] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '??~?? %s',
	        past : '%s ??~g??',
	        s : '?? ~f??w ~s??c??~??ds',
	        m : '?? ~m????~??t??',
	        mm : '%d m~??????~t??s',
	        h : '??~?? h??~??r',
	        hh : '%d h~????rs',
	        d : '?? ~d????',
	        dd : '%d d~????s',
	        M : '?? ~m????~th',
	        MM : '%d m~????t~hs',
	        y : '?? ~??????r',
	        yy : '%d ??~????rs'
	    },
	    ordinalParse: /\d{1,2}(th|st|nd|rd)/,
	    ordinal : function (number) {
	        var b = number % 10,
	            output = (~~(number % 100 / 10) === 1) ? 'th' :
	            (b === 1) ? 'st' :
	            (b === 2) ? 'nd' :
	            (b === 3) ? 'rd' : 'th';
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return xPseudo;

	})));


/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Yoruba Nigeria [yo]
	//! author : Atolagbe Abisoye : https://github.com/andela-batolagbe

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var yo = moment.defineLocale('yo', {
	    months : 'S?????r?????_E??re??le??_???r?????na??_I??gbe??_E??bibi_O??ku??du_Ag???mo_O??gu??n_Owewe_?????wa??ra??_Be??lu??_?????p???????'.split('_'),
	    monthsShort : 'S?????r_E??rl_???rn_I??gb_E??bi_O??ku??_Ag???_O??gu??_Owe_?????wa??_Be??l_?????p???????'.split('_'),
	    weekdays : 'A??i??ku??_Aje??_I??s?????gun_???j?????ru??_???j?????b???_???ti??_A??ba??m?????ta'.split('_'),
	    weekdaysShort : 'A??i??k_Aje??_I??s?????_???jr_???jb_???ti??_A??ba??'.split('_'),
	    weekdaysMin : 'A??i??_Aj_I??s_???r_???b_???t_A??b'.split('_'),
	    longDateFormat : {
	        LT : 'h:mm A',
	        LTS : 'h:mm:ss A',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY h:mm A',
	        LLLL : 'dddd, D MMMM YYYY h:mm A'
	    },
	    calendar : {
	        sameDay : '[O??ni?? ni] LT',
	        nextDay : '[?????la ni] LT',
	        nextWeek : 'dddd [???s????? to??n\'b???] [ni] LT',
	        lastDay : '[A??na ni] LT',
	        lastWeek : 'dddd [???s????? to??l?????] [ni] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'ni?? %s',
	        past : '%s k???ja??',
	        s : 'i??s???ju?? aaya?? die',
	        m : 'i??s???ju?? kan',
	        mm : 'i??s???ju?? %d',
	        h : 'wa??kati kan',
	        hh : 'wa??kati %d',
	        d : '???j????? kan',
	        dd : '???j????? %d',
	        M : 'osu?? kan',
	        MM : 'osu?? %d',
	        y : '???du??n kan',
	        yy : '???du??n %d'
	    },
	    ordinalParse : /???j?????\s\d{1,2}/,
	    ordinal : '???j????? %d',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4 // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return yo;

	})));


/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Chinese (China) [zh-cn]
	//! author : suupic : https://github.com/suupic
	//! author : Zeno Zeng : https://github.com/zenozeng

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var zhCn = moment.defineLocale('zh-cn', {
	    months : '??????_??????_??????_??????_??????_??????_??????_??????_??????_??????_?????????_?????????'.split('_'),
	    monthsShort : '1???_2???_3???_4???_5???_6???_7???_8???_9???_10???_11???_12???'.split('_'),
	    weekdays : '?????????_?????????_?????????_?????????_?????????_?????????_?????????'.split('_'),
	    weekdaysShort : '??????_??????_??????_??????_??????_??????_??????'.split('_'),
	    weekdaysMin : '???_???_???_???_???_???_???'.split('_'),
	    longDateFormat : {
	        LT : 'Ah???mm???',
	        LTS : 'Ah???m???s???',
	        L : 'YYYY-MM-DD',
	        LL : 'YYYY???MMMD???',
	        LLL : 'YYYY???MMMD???Ah???mm???',
	        LLLL : 'YYYY???MMMD???ddddAh???mm???',
	        l : 'YYYY-MM-DD',
	        ll : 'YYYY???MMMD???',
	        lll : 'YYYY???MMMD???Ah???mm???',
	        llll : 'YYYY???MMMD???ddddAh???mm???'
	    },
	    meridiemParse: /??????|??????|??????|??????|??????|??????/,
	    meridiemHour: function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === '??????' || meridiem === '??????' ||
	                meridiem === '??????') {
	            return hour;
	        } else if (meridiem === '??????' || meridiem === '??????') {
	            return hour + 12;
	        } else {
	            // '??????'
	            return hour >= 11 ? hour : hour + 12;
	        }
	    },
	    meridiem : function (hour, minute, isLower) {
	        var hm = hour * 100 + minute;
	        if (hm < 600) {
	            return '??????';
	        } else if (hm < 900) {
	            return '??????';
	        } else if (hm < 1130) {
	            return '??????';
	        } else if (hm < 1230) {
	            return '??????';
	        } else if (hm < 1800) {
	            return '??????';
	        } else {
	            return '??????';
	        }
	    },
	    calendar : {
	        sameDay : function () {
	            return this.minutes() === 0 ? '[??????]Ah[??????]' : '[??????]LT';
	        },
	        nextDay : function () {
	            return this.minutes() === 0 ? '[??????]Ah[??????]' : '[??????]LT';
	        },
	        lastDay : function () {
	            return this.minutes() === 0 ? '[??????]Ah[??????]' : '[??????]LT';
	        },
	        nextWeek : function () {
	            var startOfWeek, prefix;
	            startOfWeek = moment().startOf('week');
	            prefix = this.diff(startOfWeek, 'days') >= 7 ? '[???]' : '[???]';
	            return this.minutes() === 0 ? prefix + 'dddAh??????' : prefix + 'dddAh???mm';
	        },
	        lastWeek : function () {
	            var startOfWeek, prefix;
	            startOfWeek = moment().startOf('week');
	            prefix = this.unix() < startOfWeek.unix()  ? '[???]' : '[???]';
	            return this.minutes() === 0 ? prefix + 'dddAh??????' : prefix + 'dddAh???mm';
	        },
	        sameElse : 'LL'
	    },
	    ordinalParse: /\d{1,2}(???|???|???)/,
	    ordinal : function (number, period) {
	        switch (period) {
	            case 'd':
	            case 'D':
	            case 'DDD':
	                return number + '???';
	            case 'M':
	                return number + '???';
	            case 'w':
	            case 'W':
	                return number + '???';
	            default:
	                return number;
	        }
	    },
	    relativeTime : {
	        future : '%s???',
	        past : '%s???',
	        s : '??????',
	        m : '1 ??????',
	        mm : '%d ??????',
	        h : '1 ??????',
	        hh : '%d ??????',
	        d : '1 ???',
	        dd : '%d ???',
	        M : '1 ??????',
	        MM : '%d ??????',
	        y : '1 ???',
	        yy : '%d ???'
	    },
	    week : {
	        // GB/T 7408-1994?????????????????????????????????????????????????????????????????????????ISO 8601:1988??????
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return zhCn;

	})));


/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Chinese (Hong Kong) [zh-hk]
	//! author : Ben : https://github.com/ben-lin
	//! author : Chris Lam : https://github.com/hehachris
	//! author : Konstantin : https://github.com/skfd

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var zhHk = moment.defineLocale('zh-hk', {
	    months : '??????_??????_??????_??????_??????_??????_??????_??????_??????_??????_?????????_?????????'.split('_'),
	    monthsShort : '1???_2???_3???_4???_5???_6???_7???_8???_9???_10???_11???_12???'.split('_'),
	    weekdays : '?????????_?????????_?????????_?????????_?????????_?????????_?????????'.split('_'),
	    weekdaysShort : '??????_??????_??????_??????_??????_??????_??????'.split('_'),
	    weekdaysMin : '???_???_???_???_???_???_???'.split('_'),
	    longDateFormat : {
	        LT : 'Ah???mm???',
	        LTS : 'Ah???m???s???',
	        L : 'YYYY???MMMD???',
	        LL : 'YYYY???MMMD???',
	        LLL : 'YYYY???MMMD???Ah???mm???',
	        LLLL : 'YYYY???MMMD???ddddAh???mm???',
	        l : 'YYYY???MMMD???',
	        ll : 'YYYY???MMMD???',
	        lll : 'YYYY???MMMD???Ah???mm???',
	        llll : 'YYYY???MMMD???ddddAh???mm???'
	    },
	    meridiemParse: /??????|??????|??????|??????|??????|??????/,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === '??????' || meridiem === '??????' || meridiem === '??????') {
	            return hour;
	        } else if (meridiem === '??????') {
	            return hour >= 11 ? hour : hour + 12;
	        } else if (meridiem === '??????' || meridiem === '??????') {
	            return hour + 12;
	        }
	    },
	    meridiem : function (hour, minute, isLower) {
	        var hm = hour * 100 + minute;
	        if (hm < 600) {
	            return '??????';
	        } else if (hm < 900) {
	            return '??????';
	        } else if (hm < 1130) {
	            return '??????';
	        } else if (hm < 1230) {
	            return '??????';
	        } else if (hm < 1800) {
	            return '??????';
	        } else {
	            return '??????';
	        }
	    },
	    calendar : {
	        sameDay : '[??????]LT',
	        nextDay : '[??????]LT',
	        nextWeek : '[???]ddddLT',
	        lastDay : '[??????]LT',
	        lastWeek : '[???]ddddLT',
	        sameElse : 'L'
	    },
	    ordinalParse: /\d{1,2}(???|???|???)/,
	    ordinal : function (number, period) {
	        switch (period) {
	            case 'd' :
	            case 'D' :
	            case 'DDD' :
	                return number + '???';
	            case 'M' :
	                return number + '???';
	            case 'w' :
	            case 'W' :
	                return number + '???';
	            default :
	                return number;
	        }
	    },
	    relativeTime : {
	        future : '%s???',
	        past : '%s???',
	        s : '??????',
	        m : '1 ??????',
	        mm : '%d ??????',
	        h : '1 ??????',
	        hh : '%d ??????',
	        d : '1 ???',
	        dd : '%d ???',
	        M : '1 ??????',
	        MM : '%d ??????',
	        y : '1 ???',
	        yy : '%d ???'
	    }
	});

	return zhHk;

	})));


/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Chinese (Taiwan) [zh-tw]
	//! author : Ben : https://github.com/ben-lin
	//! author : Chris Lam : https://github.com/hehachris

	;(function (global, factory) {
	    true ? factory(__webpack_require__(5)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var zhTw = moment.defineLocale('zh-tw', {
	    months : '??????_??????_??????_??????_??????_??????_??????_??????_??????_??????_?????????_?????????'.split('_'),
	    monthsShort : '1???_2???_3???_4???_5???_6???_7???_8???_9???_10???_11???_12???'.split('_'),
	    weekdays : '?????????_?????????_?????????_?????????_?????????_?????????_?????????'.split('_'),
	    weekdaysShort : '??????_??????_??????_??????_??????_??????_??????'.split('_'),
	    weekdaysMin : '???_???_???_???_???_???_???'.split('_'),
	    longDateFormat : {
	        LT : 'Ah???mm???',
	        LTS : 'Ah???m???s???',
	        L : 'YYYY???MMMD???',
	        LL : 'YYYY???MMMD???',
	        LLL : 'YYYY???MMMD???Ah???mm???',
	        LLLL : 'YYYY???MMMD???ddddAh???mm???',
	        l : 'YYYY???MMMD???',
	        ll : 'YYYY???MMMD???',
	        lll : 'YYYY???MMMD???Ah???mm???',
	        llll : 'YYYY???MMMD???ddddAh???mm???'
	    },
	    meridiemParse: /??????|??????|??????|??????|??????|??????/,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === '??????' || meridiem === '??????' || meridiem === '??????') {
	            return hour;
	        } else if (meridiem === '??????') {
	            return hour >= 11 ? hour : hour + 12;
	        } else if (meridiem === '??????' || meridiem === '??????') {
	            return hour + 12;
	        }
	    },
	    meridiem : function (hour, minute, isLower) {
	        var hm = hour * 100 + minute;
	        if (hm < 600) {
	            return '??????';
	        } else if (hm < 900) {
	            return '??????';
	        } else if (hm < 1130) {
	            return '??????';
	        } else if (hm < 1230) {
	            return '??????';
	        } else if (hm < 1800) {
	            return '??????';
	        } else {
	            return '??????';
	        }
	    },
	    calendar : {
	        sameDay : '[??????]LT',
	        nextDay : '[??????]LT',
	        nextWeek : '[???]ddddLT',
	        lastDay : '[??????]LT',
	        lastWeek : '[???]ddddLT',
	        sameElse : 'L'
	    },
	    ordinalParse: /\d{1,2}(???|???|???)/,
	    ordinal : function (number, period) {
	        switch (period) {
	            case 'd' :
	            case 'D' :
	            case 'DDD' :
	                return number + '???';
	            case 'M' :
	                return number + '???';
	            case 'w' :
	            case 'W' :
	                return number + '???';
	            default :
	                return number;
	        }
	    },
	    relativeTime : {
	        future : '%s???',
	        past : '%s???',
	        s : '??????',
	        m : '1 ??????',
	        mm : '%d ??????',
	        h : '1 ??????',
	        hh : '%d ??????',
	        d : '1 ???',
	        dd : '%d ???',
	        M : '1 ??????',
	        MM : '%d ??????',
	        y : '1 ???',
	        yy : '%d ???'
	    }
	});

	return zhTw;

	})));


/***/ },
/* 116 */
/***/ function(module, exports) {

	module.exports = "<div class=\"row\">\r\n  <div class=\"col-lg-12\">\r\n    <uib-alert type=\"info\" close=\"dismissAlert()\" ng-show=\"!has_seen_alert\">\r\n      <span ng-app=\"myApp\" ng-controller=\"envVariablesCtrl\">Welcome to {{company_name}} - Administration System</span>\r\n    </uib-alert>\r\n  </div>\r\n</div>\r\n<div class=\"row\">\r\n  <div class=\"col-lg-3\">\r\n    <div class=\"panel panel-default theme\">\r\n      <div class=\"panel-heading\">\r\n        <div class=\"row\">\r\n          <div class=\"col-xs-3\">\r\n            <i class=\"fa fa-user fa-5x\"></i>\r\n          </div>\r\n          <div class=\"col-xs-9 text-right\">\r\n            <div class=\"huge\">{{ stats.logindata | number:0 }}</div>\r\n            <div>Login Accounts</div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <a ui-sref=\"list({entity:'LoginData'})\">\r\n        <div class=\"panel-footer\">\r\n          <span class=\"pull-left\">View Details</span>\r\n          <span class=\"pull-right\"><i class=\"fa fa-arrow-circle-right\"></i></span>\r\n          <div class=\"clearfix\"></div>\r\n        </div>\r\n      </a>\r\n\r\n    </div>\r\n  </div>\r\n  <div class=\"col-lg-3\">\r\n    <div class=\"panel panel-default theme\">\r\n      <div class=\"panel-heading\">\r\n        <div class=\"row\">\r\n          <div class=\"col-xs-3\">\r\n            <i class=\"fa fa-tv fa-5x\"></i>\r\n          </div>\r\n          <div class=\"col-xs-9 text-right\">\r\n            <div class=\"huge\">{{ stats.channels }}</div>\r\n            <div>Channels</div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <a ui-sref=\"list({entity:'Channels'})\">\r\n        <div class=\"panel-footer\">\r\n          <span class=\"pull-left\">View Details</span>\r\n          <span class=\"pull-right\"><i class=\"fa fa-arrow-circle-right\"></i></span>\r\n          <div class=\"clearfix\"></div>\r\n        </div>\r\n      </a>\r\n    </div>\r\n  </div>\r\n  <div class=\"col-lg-3\">\r\n    <div class=\"panel panel-default theme\">\r\n      <div class=\"panel-heading\">\r\n        <div class=\"row\">\r\n          <div class=\"col-xs-3\">\r\n            <i class=\"fa fa-film fa-5x\"></i>\r\n          </div>\r\n          <div class=\"col-xs-9 text-right\">\r\n            <div class=\"huge\">{{ stats.vods }}</div>\r\n            <div>VOD Movies</div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <a ui-sref=\"list({entity:'Vods'})\">\r\n        <div class=\"panel-footer\">\r\n          <span class=\"pull-left\">View Details</span>\r\n          <span class=\"pull-right\"><i class=\"fa fa-arrow-circle-right\"></i></span>\r\n          <div class=\"clearfix\"></div>\r\n        </div>\r\n      </a>\r\n    </div>\r\n  </div>\r\n  <div class=\"col-lg-3\">\r\n    <div class=\"panel default theme\">\r\n      <div class=\"panel-heading\">\r\n        <div class=\"row\">\r\n          <div class=\"col-xs-3\">\r\n            <i class=\"fa fa-outdent fa-5x\"></i>\r\n          </div>\r\n          <div class=\"col-xs-9 text-right\">\r\n            <div class=\"huge\">{{ stats.devices }}</div>\r\n            <div>Devices</div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <a ui-sref=\"list({entity:'Devices'})\">\r\n        <div class=\"panel-footer\">\r\n          <span class=\"pull-left\">View Details</span>\r\n          <span class=\"pull-right\"><i class=\"fa fa-arrow-circle-right\"></i></span>\r\n          <div class=\"clearfix\"></div>\r\n        </div>\r\n      </a>\r\n    </div>\r\n  </div>\r\n</div>\r\n";

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _moment = __webpack_require__(5);

	var _moment2 = _interopRequireDefault(_moment);

	var _resellers_dashboardSummaryHtml = __webpack_require__(118);

	var _resellers_dashboardSummaryHtml2 = _interopRequireDefault(_resellers_dashboardSummaryHtml);

	// var oneMonthAgo = moment().subtract(1, 'months').toDate();
	var dateObj = new Date();
	var year = dateObj.getFullYear();
	var yearago = dateObj.getFullYear() - 1;
	var monthnow = ("0" + (dateObj.getMonth() + 1)).slice(-2);
	var datenow = year + "-" + monthnow;
	var oneMonthAgo = ("0" + dateObj.getMonth()).slice(-2);
	var dateOneMonthAgo = year + "-" + oneMonthAgo;

	var has_seen_alert = false;

	function resellersdashboardSummary(Restangular) {
	    'use strict';

	    return {
	        restrict: 'E',
	        scope: {},
	        controller: function controller($scope) {
	            $scope.stats = {};
	            $scope.has_seen_alert = has_seen_alert;
	            $scope.dismissAlert = function () {
	                has_seen_alert = true;
	                $scope.has_seen_alert = true;
	            };

	            //my sales this month
	            Restangular.all('sales_by_month?distributorname=' + localStorage.userName + '').getList().then(function (response) {
	                var data = response.data;
	                function findWithAttr(array, attr, value) {
	                    for (var i = 0; i < array.length; i += 1) {
	                        if (array[i][attr] === value) {
	                            return i;
	                        }
	                    }
	                    return -1;
	                }
	                var number = findWithAttr(data, 'saledate', datenow);
	                if (number == -1) {
	                    $scope.stats.this_month = 0;
	                } else {
	                    $scope.stats.this_month = response.data[number].count;
	                }
	            });

	            //my sales last month
	            Restangular.all('sales_by_month?distributorname=' + localStorage.userName + '').getList().then(function (response) {
	                var data = response.data;
	                function findWithAttr(array, attr, value) {
	                    for (var i = 0; i < array.length; i += 1) {
	                        if (array[i][attr] === value) {
	                            return i;
	                        }
	                    }
	                    return -1;
	                }
	                var number = findWithAttr(data, 'saledate', dateOneMonthAgo);
	                if (number == -1) {
	                    $scope.stats.last_month = 0;
	                } else {
	                    $scope.stats.last_month = response.data[number].count;
	                }
	            });

	            //my sales this year
	            Restangular.all('sales_by_month?distributorname=' + localStorage.userName + '&startsaledate=' + year + '-01-01&endsaledate=' + year + '-12-31').getList().then(function (response) {
	                var data = response.data;
	                var array_count = [];
	                for (var i = 0; i < data.length; i++) {
	                    array_count.push(data[i].count);
	                }
	                if (array_count.length == 0) {
	                    $scope.stats.this_year = 0;
	                } else {
	                    var sum = array_count.reduce(function (a, b) {
	                        return a + b;
	                    });
	                    $scope.stats.this_year = sum;
	                }
	            });

	            //my sales last year
	            Restangular.all('sales_by_month?distributorname=' + localStorage.userName + '&startsaledate=' + yearago + '-01-01&endsaledate=' + yearago + '-12-31').getList().then(function (response) {
	                var data = response.data;
	                var array_count = [];
	                for (var i = 0; i < data.length; i++) {
	                    array_count.push(data[i].count);
	                }
	                if (array_count.length == 0) {
	                    $scope.stats.last_year = 0;
	                } else {
	                    var sum = array_count.reduce(function (a, b) {
	                        return a + b;
	                    });
	                    $scope.stats.last_year = sum;
	                }
	            });
	        },
	        template: _resellers_dashboardSummaryHtml2['default']
	    };
	}

	resellersdashboardSummary.$inject = ['Restangular'];

	exports['default'] = resellersdashboardSummary;
	module.exports = exports['default'];

/***/ },
/* 118 */
/***/ function(module, exports) {

	module.exports = "<div class=\"row\">\r\n    <div class=\"col-lg-12\">\r\n        <uib-alert type=\"info\" close=\"dismissAlert()\" ng-show=\"!has_seen_alert\">\r\n            <span ng-app=\"myApp\" ng-controller=\"envVariablesCtrl\">Welcome to {{company_name}} - Administration System</span>\r\n        </uib-alert>\r\n    </div>\r\n</div>\r\n\r\n<div class=\"row\">\r\n    <!--My Sales This Month-->\r\n    <div class=\"col-lg-3\">\r\n        <div class=\"panel panel-default theme\">\r\n            <div class=\"panel-heading\">\r\n                <div class=\"row\">\r\n                    <div class=\"col-xs-3\">\r\n                        <i class=\"fa fa-user-plus fa-5x\"></i>\r\n                    </div>\r\n                    <div class=\"col-xs-9 text-right\">\r\n                        <div class=\"huge\">{{ stats.this_month }}</div>\r\n                        <div>My Sales This Month</div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <!-- code below, maybe used later -->\r\n            <!--<a ui-sref=\"list({entity:'LoginData'})\">-->\r\n                <!--<div class=\"panel-footer\">-->\r\n                    <!--<span class=\"pull-left\">View Details</span>-->\r\n                    <!--<span class=\"pull-right\"><i class=\"fa fa-arrow-circle-right\"></i></span>-->\r\n                    <!--<div class=\"clearfix\"></div>-->\r\n                <!--</div>-->\r\n            <!--</a>-->\r\n        </div>\r\n    </div>\r\n    <!--My Sales This Month-->\r\n\r\n    <!--My Sales Last Month-->\r\n    <div class=\"col-lg-3\">\r\n        <div class=\"panel panel-default theme\">\r\n            <div class=\"panel-heading\">\r\n                <div class=\"row\">\r\n                    <div class=\"col-xs-3\">\r\n                        <i class=\"fa fa-user-plus fa-5x\"></i>\r\n                    </div>\r\n                    <div class=\"col-xs-9 text-right\">\r\n                        <div class=\"huge\">{{ stats.last_month }}</div>\r\n                        <div>My Sales Last Month</div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <!-- code below, maybe used later -->\r\n            <!--<a ui-sref=\"list({entity:'Channels'})\">-->\r\n                <!--<div class=\"panel-footer\">-->\r\n                    <!--<span class=\"pull-left\">View Details</span>-->\r\n                    <!--<span class=\"pull-right\"><i class=\"fa fa-arrow-circle-right\"></i></span>-->\r\n                    <!--<div class=\"clearfix\"></div>-->\r\n                <!--</div>-->\r\n            <!--</a>-->\r\n        </div>\r\n    </div>\r\n    <!--My Sales Last Month-->\r\n\r\n    <!--My Sales This Year-->\r\n    <div class=\"col-lg-3\">\r\n        <div class=\"panel panel-default theme\">\r\n            <div class=\"panel-heading\">\r\n                <div class=\"row\">\r\n                    <div class=\"col-xs-3\">\r\n                        <i class=\"fa fa-user-plus fa-5x\"></i>\r\n                    </div>\r\n                    <div class=\"col-xs-9 text-right\">\r\n                        <div class=\"huge\">{{ stats.this_year }}</div>\r\n                        <div>My Sales This Year</div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <!-- code below, maybe used later -->\r\n            <!--<a ui-sref=\"list({entity:'Vods'})\">-->\r\n                <!--<div class=\"panel-footer\">-->\r\n                    <!--<span class=\"pull-left\">View Details</span>-->\r\n                    <!--<span class=\"pull-right\"><i class=\"fa fa-arrow-circle-right\"></i></span>-->\r\n                    <!--<div class=\"clearfix\"></div>-->\r\n                <!--</div>-->\r\n            <!--</a>-->\r\n        </div>\r\n    </div>\r\n    <!--My Sales This Year-->\r\n\r\n    <!--My Sales Last Year-->\r\n    <div class=\"col-lg-3\">\r\n        <div class=\"panel panel-default theme\">\r\n            <div class=\"panel-heading\">\r\n                <div class=\"row\">\r\n                    <div class=\"col-xs-3\">\r\n                        <i class=\"fa fa-user-plus fa-5x\"></i>\r\n                    </div>\r\n                    <div class=\"col-xs-9 text-right\">\r\n                        <div class=\"huge\">{{ stats.last_year }}</div>\r\n                        <div>My Sales Last Year</div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <!-- code below, maybe used later -->\r\n            <!--<a ui-sref=\"list({entity:'Devices'})\">-->\r\n                <!--<div class=\"panel-footer\">-->\r\n                    <!--<span class=\"pull-left\">View Details</span>-->\r\n                    <!--<span class=\"pull-right\"><i class=\"fa fa-arrow-circle-right\"></i></span>-->\r\n                    <!--<div class=\"clearfix\"></div>-->\r\n                <!--</div>-->\r\n            <!--</a>-->\r\n        </div>\r\n    </div>\r\n    <!--My Sales Last Year-->\r\n\r\n</div><!--row-->\r\n";

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _graphsHtml = __webpack_require__(120);

	var _graphsHtml2 = _interopRequireDefault(_graphsHtml);

	function graph(Restangular) {
		'use strict';

		return {
			restrict: 'E',
			scope: {},
			controller: function controller($scope, VisDataSet) {

				$scope.onSelect = function (items) {
					// debugger;
					alert('select');
				};

				$scope.onClick = function (props) {
					//debugger;
					alert('Click');
				};

				$scope.onDoubleClick = function (props) {
					// debugger;
					alert('DoubleClick');
				};

				$scope.rightClick = function (props) {
					alert('Right click!');
					props.event.preventDefault();
				};

				$scope.options = {
					//stack: false,
					//style:'bar',
					//barChart: {width:50, align:'center'}, // align: left, center, right
					//drawPoints: false,

					start: '2017-05-05',
					end: Date.now(),

					editable: true

				};

				//orientation: 'top'
				var items = [{ x: '2014-06-11', y: 10 }, { x: '2014-06-12', y: 25 }, { x: '2014-06-13', y: 30 }, { x: '2014-06-14', y: 10 }, { x: '2014-06-15', y: 15 }, { x: '2014-06-16', y: 30 }];
				// Model Test
			},
			template: _graphsHtml2['default']
		};
	}

	graph.$inject = ['Restangular'];
	exports['default'] = graph;
	module.exports = exports['default'];

/***/ },
/* 120 */
/***/ function(module, exports) {

	module.exports = "\r\n<vis-graph2d data=\"data\" options=\"options\"></vis-graph2d>\r\n<vis-timeline data=\"data_timeline\" options=\"options\" events=\"events\"></vis-timeline>\r\n";

/***/ },
/* 121 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	function sendpush(Restangular, $uibModal, $q, notification, $state) {
	    'use strict';

	    return {
	        restrict: 'E',
	        scope: {
	            selection: '=',
	            type: '@',
	            ngConfirmMessage: '@',
	            ngConfirm: '&'
	        },
	        link: function link(scope, element, attrs) {

	            scope.icon = 'glyphicon-plus';

	            if (attrs.type == 'softwareupdate') scope.label = 'Send Update Request';
	            if (attrs.type == 'deletedata') scope.label = 'Send Delete Data Request';
	            if (attrs.type == 'deletesharedpreferences') scope.label = 'Send Delete Shared Pref Request';

	            scope.modal = function () {
	                element.bind('click', function () {
	                    var modalInstance = $uibModal.open({
	                        template: '<div class="modal-header">' + '<h5 class="modal-title">Are you sure ? (' + scope.label + ')</h5>' + '</div>' + '<div class="modal-footer">' + '<button class="btn btn-primary" type="button" ng-click="ok()">OK</button>' + '<button class="btn btn-warning" type="button" ng-click="cancel()">Cancel</button>' + '</div>',
	                        controller: ('main', ['$scope', '$uibModalInstance', 'confirmClick', 'confirmMessge', function ($scope, $uibModalInstance, confirmClick, confirmMessge) {

	                            $scope.confirmMessage = confirmMessge;

	                            function closeModal() {

	                                $uibModalInstance.dismiss('cancel');
	                            }

	                            $scope.ok = function () {

	                                closeModal();
	                                $q.all(scope.selection.map(function (e) {
	                                    return Restangular.one('send-message-action').customPOST({ deviceid: e.values.id, messageaction: attrs.type });
	                                })).then(function () {
	                                    return notification.log(scope.selection.length + ' Successfully', { addnCls: 'humane-flatty-success' });
	                                })['catch'](function (e) {
	                                    return notification.log('A problem occurred, please try again', { addnCls: 'humane-flatty-error' }) && console.error(e);
	                                });
	                            };

	                            $scope.cancel = function () {
	                                closeModal();
	                            };
	                        }]),
	                        size: 'lg',
	                        windowClass: 'confirm-window',
	                        resolve: {
	                            confirmClick: function confirmClick() {
	                                return scope.ngConfirm;
	                            },
	                            confirmMessge: function confirmMessge() {
	                                return scope.ngConfirmMessage;
	                            }
	                        }
	                    });
	                });
	            };
	        },
	        template: '<span ng-click="modal()"><span class="glyphicon {{ icon }}" aria-hidden="true"></span>&nbsp;{{ label }}</span>'
	    };
	}

	sendpush.$inject = ['Restangular', '$uibModal', '$q', 'notification', '$state'];

	exports['default'] = sendpush;
	module.exports = exports['default'];

/***/ },
/* 122 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	function sale(Restangular, $uibModal, $q, notification, $state) {
	    'use strict';

	    return {
	        restrict: 'E',
	        scope: {
	            selection: '=',
	            type: '@',
	            ngConfirmMessage: '@',
	            ngConfirm: '&'
	        },
	        link: function link(scope, element, attrs) {

	            scope.icon = 'glyphicon-plus';

	            if (attrs.type == 'cancel_sale') scope.label = 'Annul selected sales';

	            scope.modal = function () {
	                element.bind('click', function () {
	                    var modalInstance = $uibModal.open({
	                        template: '<div class="modal-header">' + '<h5 class="modal-title">Are you sure ? (' + scope.label + ')</h5>' + '</div>' + '<div class="modal-footer">' + '<button class="btn btn-primary" type="button" ng-click="ok()">OK</button>' + '<button class="btn btn-warning" type="button" ng-click="cancel()">Cancel</button>' + '</div>',
	                        controller: ('main', ['$scope', '$uibModalInstance', 'confirmClick', 'confirmMessge', function ($scope, $uibModalInstance, confirmClick, confirmMessge) {

	                            $scope.confirmMessage = confirmMessge;

	                            function closeModal() {
	                                $uibModalInstance.dismiss('cancel');
	                            }

	                            $scope.ok = function () {

	                                closeModal();
	                                $q.all(scope.selection.map(function (e) {
	                                    return Restangular.one('annul').customPOST({ sale_id: e.values.id, username: e.values.user_username, login_id: e.values.login_data_id, product: e.values.combo_id });
	                                })).then(function (success) {
	                                    return notification.log(success[0].data.message + '', { addnCls: 'humane-flatty-success' }) && winston.info("The response is ", success);
	                                });
	                                $state.reload(); //action is performed, reload page with latest data
	                            };

	                            $scope.cancel = function () {
	                                closeModal();
	                            };
	                        }]),
	                        size: 'lg',
	                        windowClass: 'confirm-window',
	                        resolve: {
	                            confirmClick: function confirmClick() {
	                                return scope.ngConfirm;
	                            },
	                            confirmMessge: function confirmMessge() {
	                                return scope.ngConfirmMessage;
	                            }
	                        }
	                    });
	                });
	            };
	        },
	        template: '<span ng-click="modal()"><span class="glyphicon {{ icon }}" aria-hidden="true"></span>&nbsp;{{ label }}</span>'
	    };
	}

	sale.$inject = ['Restangular', '$uibModal', '$q', 'notification', '$state'];

	exports['default'] = sale;
	module.exports = exports['default'];

/***/ },
/* 123 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	function sale(Restangular, $uibModal, $q, notification, $state) {
	    'use strict';

	    return {
	        restrict: 'E',
	        scope: {
	            selection: '=',
	            type: '@',
	            ngConfirmMessage: '@',
	            ngConfirm: '&'
	        },
	        link: function link(scope, element, attrs) {

	            scope.icon = 'glyphicon-plus';

	            if (attrs.type == 'update_film') scope.label = 'Update selected film(s)';

	            scope.modal = function () {
	                element.bind('click', function () {
	                    var modalInstance = $uibModal.open({
	                        template: '<div class="modal-header">' + '<h5 class="modal-title">Are you sure ? (' + scope.label + ')</h5>' + '</div>' + '<div class="modal-footer">' + '<button class="btn btn-primary" type="button" ng-click="ok()">OK</button>' + '<button class="btn btn-warning" type="button" ng-click="cancel()">Cancel</button>' + '</div>',
	                        controller: ('main', ['$scope', '$uibModalInstance', 'confirmClick', 'confirmMessge', function ($scope, $uibModalInstance, confirmClick, confirmMessge) {

	                            $scope.confirmMessage = confirmMessge;

	                            function closeModal() {
	                                $uibModalInstance.dismiss('cancel');
	                            }

	                            $scope.ok = function () {
	                                closeModal();
	                                $q.all(scope.selection.map(function (e) {
	                                    return Restangular.one('update_film/' + e.values.id).customPUT({ title: e.values.title, year: e.values.year });
	                                })).then(function (success) {
	                                    return notification.log(success[0].data.message + '', { addnCls: 'humane-flatty-success' }) && winston.info("The response is ", success);
	                                });
	                                $state.reload(); //action is performed, reload page with latest data
	                            };

	                            $scope.cancel = function () {
	                                closeModal();
	                            };
	                        }]),
	                        size: 'lg',
	                        windowClass: 'confirm-window',
	                        resolve: {
	                            confirmClick: function confirmClick() {
	                                return scope.ngConfirm;
	                            },
	                            confirmMessge: function confirmMessge() {
	                                return scope.ngConfirmMessage;
	                            }
	                        }
	                    });
	                });
	            };
	        },
	        template: '<span ng-click="modal()"><span class="glyphicon {{ icon }}" aria-hidden="true"></span>&nbsp;{{ label }}</span>'
	    };
	}

	sale.$inject = ['Restangular', '$uibModal', '$q', 'notification', '$state'];

	exports['default'] = sale;
	module.exports = exports['default'];

/***/ },
/* 124 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	function move(Restangular, $uibModal, $q, notification, $state, $http) {
	    'use strict';

	    return {
	        restrict: 'E',
	        scope: {
	            selection: '=',
	            type: '@',
	            ngConfirmMessage: '@',
	            ngConfirm: '&'
	        },
	        link: function link(scope, element, attrs) {

	            scope.icon = 'glyphicon-list';
	            if (attrs.type == 'move_to_package') scope.button = 'Move to Package';
	            var vods_array = [];

	            $http.get('../api/vodpackages?package_type_id=3&package_type_id=4').then(function (response) {
	                var data = response.data;
	                for (var i = 0; i < data.length; i++) {
	                    vods_array.push({ name: data[i].package_name, id: data[i].id });
	                }
	            });

	            scope.list_of_vods = vods_array;
	            var newarray = [];

	            scope.moveto = function () {
	                var array_of_selection_vod = scope.selection;

	                scope.change = function (name, id) {
	                    scope.button = name;
	                    var id_of_selected_package = id;

	                    for (var j = 0; j < array_of_selection_vod.length; j++) {
	                        newarray.push({ package_id: id_of_selected_package, vod_id: array_of_selection_vod[j].values.id });
	                    }

	                    if (newarray.length === 0) {
	                        notification.log('Sorry, you have not selected any Vod item.', { addnCls: 'humane-flatty-error' });
	                    } else {
	                        $http.post("../api/package_vod", newarray).then(function (response, data, status, headers, config, file) {
	                            notification.log('Vod successfully added', { addnCls: 'humane-flatty-success' });
	                            window.location.replace("#/vodPackages/edit/" + id_of_selected_package);
	                        }, function (data, status, headers, config) {
	                            notification.log('Something Wrong', { addnCls: 'humane-flatty-error' });
	                        }).on(error, function (error) {
	                            winston.error("The error during post request is ");
	                        });
	                    }
	                };
	            };
	        },
	        template: '<div class="btn-group" uib-dropdown is-open="status.isopen"> ' + '<button id="single-button" type="button" class="btn btn-default" uib-dropdown-toggle ng-disabled="disabled">' + '<span class="glyphicon {{icon}}"></span> {{button}} <span class="caret"></span>' + '</button>' + '<ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="single-button">' + '<li role="menuitem" ng-click="change(choice.name,choice.id)"  ng-repeat="choice in list_of_vods">' + '<p id="paragraph_vod" ng-click="moveto()">{{choice.name}}</p>' + '</li>' + '</ul>' + '</div>'
	    };
	}

	move.$inject = ['Restangular', '$uibModal', '$q', 'notification', '$state', '$http'];

	exports['default'] = move;
	module.exports = exports['default'];

/***/ },
/* 125 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	function generate(Restangular, $uibModal, $q, notification, $state, $http) {
	    'use strict';

	    return {
	        restrict: 'E',
	        scope: { post: '&' },
	        link: function link(scope) {
	            scope.generate = function () {

	                function guid() {
	                    return "ssssssss".replace(/s/g, s4);
	                }

	                function s4() {
	                    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	                }

	                scope.post().values.jwtoken = guid();
	            };
	        },
	        template: '<a class="btn btn-default btn-xs" ng-click="generate()"><i class="fa fa-key fa-lg"></i>&nbsp;Generate Api Key</a>'
	    };
	}

	generate.$inject = ['Restangular', '$uibModal', '$q', 'notification', '$state', '$http'];

	exports['default'] = generate;
	module.exports = exports['default'];

/***/ },
/* 126 */
/***/ function(module, exports) {

	//todo: change function name
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	function approveReview(Restangular, $state, notification) {
	    'use strict';

	    return {
	        restrict: 'E',
	        scope: {
	            review: "&",
	            size: "@"
	        },
	        link: function link(scope, element, attrs) {
	            var obj = scope.$parent.datastore._entries; //saves group-related data into variable obj

	            scope.review = scope.review();
	            scope.type = attrs.type;
	            scope.approve = function (method, value) {

	                if (!value) value = true;else value = !value;

	                var theobj = {};
	                theobj.group_id = obj[Object.keys(obj)[0]]["0"]._identifierValue; // reads the value from the first property, since name of the property can vary
	                theobj.api_group_id = scope.review.values.id;

	                if (method == 'read') theobj.read = value;
	                if (method == 'edit') theobj.edit = value;
	                if (method == 'create') theobj.create = value;

	                Restangular.one('grouprights').customPUT(theobj).then(function successCallback(response) {
	                    notification.log('Updated successfully', { addnCls: 'humane-flatty-success' });
	                }, function errorCallback(response) {
	                    notification.log('Could not save changes', { addnCls: 'humane-flatty-error' });
	                });
	            };
	        },
	        template: '\n                <label class="btn btn-default">Read<input type="checkbox" ng-checked="review.values[\'grouprights.read\'] == 1" ng-click="approve(\'read\',review.values[\'grouprights.read\'])" id="default" class="badgebox"><span class="badge">&check;</span></label>\n                <label class="btn btn-default">Edit<input type="checkbox" ng-checked="review.values[\'grouprights.edit\'] == 1" ng-click="approve(\'edit\',review.values[\'grouprights.edit\'])" id="default" class="badgebox"><span class="badge">&check;</span></label>\n                <label class="btn btn-default">Create<input type="checkbox" ng-checked="review.values[\'grouprights.create\'] == 1" ng-click="approve(\'create\',review.values[\'grouprights.create\'])" id="default" class="badgebox"><span class="badge">&check;</span></label>\n            '
	    };
	}

	approveReview.$inject = ['Restangular', '$state', 'notification'];

	exports['default'] = approveReview;
	module.exports = exports['default'];

/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _userDetailsHtml = __webpack_require__(128);

	var _userDetailsHtml2 = _interopRequireDefault(_userDetailsHtml);

	function details($stateProvider) {

	    $stateProvider.state('personal', {
	        parent: 'main',
	        url: '/personal',
	        headers: { "Content-Type": "application/json;charset=UTF-8" },
	        controller: ['Restangular', '$scope', 'notification', function (Restangular, $scope, notification) {

	            Restangular.one('personal-details').get().then(function successCallback(response) {
	                $scope.user = {
	                    username: response.username,
	                    email: response.email,
	                    telephone: response.telephone,
	                    role: localStorage.userRole,
	                    apikey: response.jwtoken
	                };
	            }, function errorCallback(response) {});

	            // Start Update Details

	            $scope.updateDetails = function () {
	                Restangular.one('personal-details').put($scope.user).then(function successCallback(response) {}, function errorCallback(response) {});
	            };
	        }],
	        template: _userDetailsHtml2['default']
	    });
	}

	details.$inject = ['$stateProvider'];

	exports['default'] = details;
	module.exports = exports['default'];

/***/ },
/* 128 */
/***/ function(module, exports) {

	module.exports = "<head>\r\n  <style type=\"text/css\">\r\n    @media screen and ( max-width: 1600px ) {\r\n      .frm {\r\n        margin-left: 150px;\r\n        margin-right: 150px;\r\n      }\r\n    }\r\n\r\n    @media screen and ( max-width: 989px ) {\r\n      .frm {\r\n        margin-left: auto;\r\n        margin-right: auto;\r\n      }\r\n    }\r\n\r\n    @media screen and ( max-width: 767px ) {\r\n      .frm {\r\n        margin-left: auto;\r\n        margin-right: auto;\r\n      }\r\n    }\r\n\r\n    @media screen and ( max-width: 600px ) {\r\n      .frm {\r\n        margin-left: auto;\r\n        margin-right: auto;\r\n      }\r\n    }\r\n\r\n    @media screen and ( max-width: 540px ) {\r\n      .frm {\r\n        margin-left: auto;\r\n        margin-right: auto;\r\n      }\r\n    }\r\n\r\n    @media screen and ( max-width: 480px ) {\r\n      .frm {\r\n        margin-left: auto;\r\n        margin-right: auto;\r\n      }\r\n    }\r\n\r\n    @media screen and ( max-width: 380px ) {\r\n      .frm {\r\n        margin-left: auto;\r\n        margin-right: auto;\r\n      }\r\n    }\r\n  </style>\r\n</head>\r\n\r\n<div class=\"row list-header\">\r\n    <div class=\"col-lg-12\">\r\n\r\n        <div class=\"page-header\">\r\n            <h4>Personal Details</h4>\r\n        </div>\r\n\r\n    </div>\r\n</div>\r\n\r\n    <div class=\"row frm\">\r\n\r\n              <form ng-controller=\"updateDetails\" ng-submit=\"updateDetails()\" ng-controller=\"main\">\r\n\r\n                <div class=\"form-group\">\r\n                  <label for=\"exampleInputEmail1\">Group</label>\r\n                  <input type=\"input\" class=\"form-control\" id=\"exampleInputEmail1\" value=\"{{user.role}}\" aria-describedby=\"emailHelp\" placeholder=\"\" disabled=\"disabled\">\r\n                </div>\r\n\r\n                <div class=\"form-group\">\r\n                  <label for=\"exampleInputEmail1\">Username</label>\r\n                  <input type=\"input\" class=\"form-control\" id=\"exampleInputEmail1\" value=\"{{user.username}}\" aria-describedby=\"emailHelp\" placeholder=\"\" disabled=\"disabled\">\r\n                </div>\r\n\r\n                  <div class=\"form-group\">\r\n                      <label for=\"exampleInputEmail1\">Api Key</label>\r\n                      <input type=\"input\" class=\"form-control\" id=\"exampleInputEmail1\" value=\"{{user.apikey}}\" aria-describedby=\"emailHelp\" placeholder=\"\" disabled=\"disabled\">\r\n                  </div>\r\n\r\n                <div class=\"form-group\">\r\n                  <label for=\"exampleInputEmail1\">Email</label>\r\n                  <input type=\"email\" class=\"form-control\" id=\"exampleInputEmail1\" ng-model=\"user.email\" value=\"user.email\" aria-describedby=\"emailHelp\" placeholder=\"\">\r\n                </div>\r\n\r\n                <div class=\"form-group\">\r\n                  <label for=\"exampleInputEmail1\">Telephone</label>\r\n                  <input type=\"input\" class=\"form-control\" id=\"exampleInputEmail1\" ng-model=\"user.telephone\" value=\"user.telephone\" aria-describedby=\"emailHelp\" placeholder=\"\">\r\n                </div>\r\n\r\n                  <hr>\r\n                <button type=\"submit\" class=\"btn btn-default pull-right\">Submit</button>\r\n              </form>\r\n\r\n    \r\n    </div>";

/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _geoipHtml = __webpack_require__(130);

	var _geoipHtml2 = _interopRequireDefault(_geoipHtml);

	function details($stateProvider) {

	    $stateProvider.state('geoip', {
	        parent: 'main',
	        url: '/geoip',
	        headers: { "Content-Type": "application/json;charset=UTF-8" },
	        controller: ['$http', '$scope', 'notification', function ($http, $scope, notification) {

	            $http.post('../apiv2/geoip/status').then(function successCallback(response) {

	                if (response.data.status === false) {
	                    document.getElementById('status_false').style.display = "block";
	                    document.getElementById('status_false').innerHTML = response.data.message;
	                } else {
	                    document.getElementById('status_true').style.display = "block";
	                    document.getElementById('status_true').innerHTML = response.data.message;
	                }
	            }, function errorCallback(response) {
	                document.getElementById('status_false').style.display = "none";
	                document.getElementById('status_true').style.display = "none";
	                notification.log(response.statusText, { addnCls: 'humane-flatty-error' });
	            });

	            $scope.updateurl = function () {
	                var ui_url = document.getElementById('send_url').value;

	                var data = { 'url': ui_url };
	                $http.post('../apiv2/geoip/update', data).then(function successCallback(response) {

	                    if (response.data.status === true) {
	                        document.getElementById('status_false').style.display = "none";
	                        document.getElementById('status_true').style.display = "block";
	                        document.getElementById('status_true').innerHTML = 'Geoip is active';
	                        notification.log(response.data.message, { addnCls: 'humane-flatty-success' });
	                    } else {
	                        document.getElementById('status_true').style.display = "none";
	                        document.getElementById('status_false').style.display = "block";
	                        document.getElementById('status_false').innerHTML = "Geoip is not active because Database binary file not found";
	                        notification.log(response.data.message, { addnCls: 'humane-flatty-error' });
	                    }
	                }, function errorCallback(response) {
	                    document.getElementById('status_false').style.display = "none";
	                    document.getElementById('status_true').style.display = "none";
	                    notification.log(response.statusText, { addnCls: 'humane-flatty-error' });
	                });
	            };
	        }],
	        template: _geoipHtml2['default']
	    });
	}

	details.$inject = ['$stateProvider'];

	exports['default'] = details;
	module.exports = exports['default'];

/***/ },
/* 130 */
/***/ function(module, exports) {

	module.exports = "<head>\r\n    <style type=\"text/css\">\r\n        @media screen and ( max-width: 1600px ) {\r\n            .frm {\r\n                margin-left: 150px;\r\n                margin-right: 150px;\r\n            }\r\n        }\r\n\r\n        @media screen and ( max-width: 989px ) {\r\n            .frm {\r\n                margin-left: auto;\r\n                margin-right: auto;\r\n            }\r\n        }\r\n\r\n        @media screen and ( max-width: 767px ) {\r\n            .frm {\r\n                margin-left: auto;\r\n                margin-right: auto;\r\n            }\r\n        }\r\n\r\n        @media screen and ( max-width: 600px ) {\r\n            .frm {\r\n                margin-left: auto;\r\n                margin-right: auto;\r\n            }\r\n        }\r\n\r\n        @media screen and ( max-width: 540px ) {\r\n            .frm {\r\n                margin-left: auto;\r\n                margin-right: auto;\r\n            }\r\n        }\r\n\r\n        @media screen and ( max-width: 480px ) {\r\n            .frm {\r\n                margin-left: auto;\r\n                margin-right: auto;\r\n            }\r\n        }\r\n\r\n        @media screen and ( max-width: 380px ) {\r\n            .frm {\r\n                margin-left: auto;\r\n                margin-right: auto;\r\n            }\r\n        }\r\n    </style>\r\n</head>\r\n\r\n<div class=\"row list-header\">\r\n    <div class=\"col-lg-12\">\r\n\r\n        <div class=\"page-header\">\r\n            <h4>GeoIP</h4>\r\n        </div>\r\n\r\n    </div>\r\n</div>\r\n\r\n<div class=\"row frm\">\r\n\r\n    <form ng-submit=\"updateurl()\">\r\n\r\n        <div class=\"alert alert-danger\" id=\"status_false\" style=\"display:none;\"></div>\r\n        <div class=\"alert alert-success\" id=\"status_true\" style=\"display: none;\"></div>\r\n\r\n        <div class=\"form-group\">\r\n            <label for=\"send_url\">URL</label>\r\n            <input class=\"form-control\" id=\"send_url\"  aria-describedby=\"emailHelp\" placeholder=\"URL\">\r\n        </div>\r\n\r\n        <hr>\r\n        <button type=\"submit\" class=\"btn btn-default pull-right\">Submit</button>\r\n    </form>\r\n\r\n\r\n</div>";

/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _changePasswordHtml = __webpack_require__(132);

	var _changePasswordHtml2 = _interopRequireDefault(_changePasswordHtml);

	exports['default'] = function ($stateProvider) {
	    $stateProvider.state('change-password', {
	        parent: 'main',
	        url: '/change-password',
	        params: {},

	        controller: ['Restangular', '$scope', 'notification', function (Restangular, $scope, notification) {

	            $scope.pwdata = {
	                currentPassword: '',
	                newPassword: '',
	                verifyPassword: ''
	            };

	            $scope.createPost = function () {
	                Restangular.one('user/change-password').customPOST($scope.pwdata).then(function successCallback(response) {
	                    notification.log(response.message, { addnCls: 'humane-flatty-success' });
	                }, function errorCallback(response) {
	                    notification.log(response.data.message, { addnCls: 'humane-flatty-error' });
	                });
	            };
	        }],

	        template: _changePasswordHtml2['default']
	    });
	};

	;
	module.exports = exports['default'];

/***/ },
/* 132 */
/***/ function(module, exports) {

	module.exports = "<head>\r\n  <style type=\"text/css\">\r\n    @media screen and ( max-width: 1600px ) {\r\n      .frm {\r\n        margin-left: 150px;\r\n        margin-right: 150px;\r\n      }\r\n    }\r\n\r\n    @media screen and ( max-width: 989px ) {\r\n      .frm {\r\n        margin-left: auto;\r\n        margin-right: auto;\r\n      }\r\n    }\r\n\r\n    @media screen and ( max-width: 767px ) {\r\n      .frm {\r\n        margin-left: auto;\r\n        margin-right: auto;\r\n      }\r\n    }\r\n\r\n    @media screen and ( max-width: 600px ) {\r\n      .frm {\r\n        margin-left: auto;\r\n        margin-right: auto;\r\n      }\r\n    }\r\n\r\n    @media screen and ( max-width: 540px ) {\r\n      .frm {\r\n        margin-left: auto;\r\n        margin-right: auto;\r\n      }\r\n    }\r\n\r\n    @media screen and ( max-width: 480px ) {\r\n      .frm {\r\n        margin-left: auto;\r\n        margin-right: auto;\r\n      }\r\n    }\r\n\r\n    @media screen and ( max-width: 380px ) {\r\n      .frm {\r\n        margin-left: auto;\r\n        margin-right: auto;\r\n      }\r\n    }\r\n  </style>\r\n</head>\r\n<body>\r\n\r\n<div class=\"row list-header\">\r\n    <div class=\"col-lg-12\">\r\n\r\n        <div class=\"page-header\">\r\n            <h4>Change Password</h4>\r\n        </div>\r\n\r\n    </div>\r\n</div>\r\n\r\n<div class=\"container\">\r\n    <div class=\"row\">\r\n\r\n        <div class=\"col-md-12\">\r\n            <form ng-submit=\"createPost()\">\r\n\r\n                <div class=\"form-group\">\r\n                    <label for=\"currentPassword\">Old Password</label>\r\n                    <input type=\"password\" class=\"form-control\" id=\"currentPassword\" ng-model=\"pwdata.currentPassword\" placeholder=\"\">\r\n                </div>\r\n\r\n                <div class=\"form-group\">\r\n                    <label for=\"newPassword\">New Password</label>\r\n                    <input type=\"password\" class=\"form-control\" id=\"newPassword\" ng-model=\"pwdata.newPassword\"  placeholder=\"\">\r\n                </div>\r\n\r\n                <div class=\"form-group\">\r\n                    <label for=\"verifyPassword\">Repeat Password</label>\r\n                    <input type=\"password\" class=\"form-control\" id=\"verifyPassword\" ng-model=\"pwdata.verifyPassword\" placeholder=\"\">\r\n                </div>\r\n\r\n                <button type=\"submit\" class=\"btn btn-default pull-right\">Submit</button>\r\n            </form>\r\n        </div>\r\n\r\n    </div>\r\n</div>\r\n</body>\r\n";

/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _epgchartHtml = __webpack_require__(134);

	var _epgchartHtml2 = _interopRequireDefault(_epgchartHtml);

	exports['default'] = function ($stateProvider) {
	    $stateProvider.state('epgdata_chart', {
	        parent: 'main',
	        url: '/epggraph',
	        params: {},

	        //controller: ['Restangular', '$scope', 'notification', (Restangular, $scope, notification) => {

	        controller: function controller(Restangular, $scope, VisDataSet) {

	            $scope.events = {
	                //rangechange: $scope.onRangeChange,
	                //rangechanged: $scope.onRangeChanged,
	                //onload: $scope.onLoaded,
	                select: $scope.onSelect,
	                click: $scope.onClick
	            };

	            //doubleClick: $scope.onDoubleClick,
	            //contextmenu: $scope.rightClick
	            $scope.onSelect = function (items) {
	                // debugger;
	                winston.info('onselect: ', items);
	            };

	            $scope.onClick = function (items) {
	                //debugger;
	                winston.info('click: ', items);
	            };

	            $scope.dragEnd = function (items) {
	                //debugger;
	                winston.info('drag end: ', items);
	            };

	            $scope.onRangeChange = function (items) {
	                //debugger;
	                winston.info('enter onrangechange: ', items);
	            };

	            $scope.options = {
	                stack: false,
	                start: new Date(),
	                end: new Date(1000 * 60 * 60 * 24 + new Date().valueOf()),
	                editable: true,
	                orientation: 'top',

	                // right order
	                groupOrder: function groupOrder(a, b) {
	                    return a.value - b.value;
	                }

	            };

	            $scope.events = {
	                //rangechange: $scope.onRangeChange,
	                //rangechanged: $scope.onRangeChanged,
	                //onload: $scope.onLoaded,
	                select: $scope.onSelect,
	                click: $scope.onClick,
	                dragEnd: $scope.dragEnd
	            };

	            //doubleClick: $scope.onDoubleClick,
	            //contextmenu: $scope.rightClick
	            Restangular.one('epgdata_chart').get().then(function successCallback(response) {
	                $scope.data_timeline = {
	                    "items": response.data ? response.data.items : response.items,
	                    "groups": response.data ? response.data.groups : response.groups
	                };
	            }, function errorCallback(response) {});
	        },

	        template: _epgchartHtml2['default']
	    });
	};

	;
	module.exports = exports['default'];

/***/ },
/* 134 */
/***/ function(module, exports) {

	module.exports = "<vis-graph2d data=\"data\" options=\"options\"></vis-graph2d>\r\n<vis-timeline data=\"data_timeline\" options=\"options\" events=\"events\"></vis-timeline>\r\n\r\n";

/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	var _filter_genre_btnHtml = __webpack_require__(137);

	var _filter_genre_btnHtml2 = _interopRequireDefault(_filter_genre_btnHtml);

	exports['default'] = function (nga, admin) {
	    var tmdbvods = admin.getEntity('tmdbvods');

	    var language_list = [{ value: { "iso_639_1": "en", "name": "English" }, label: 'English' }, { value: { "iso_639_1": "sp", "name": "Spanish" }, label: 'Spanish' }, { value: { "iso_639_1": "gr", "name": "German" }, label: 'German' }, { value: { "iso_639_1": "fr", "name": "French" }, label: 'French' }];

	    tmdbvods.listView().title('<h4>TMDB Vods <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').actions([]).batchActions([]).fields([nga.field('id').label('ID'), nga.field('title').label('Title'), nga.field('vote_count').label('Vote Count'), nga.field('release_date').label('Release Date')]).filters([nga.field('q').label('').template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>').pinned(true)]).listActions(['<ma-edit-button entry="entry" entity="entity" label="Import" size="xs"></ma-edit-button>']);

	    tmdbvods.editionView().title('<h4>TMDB Vods <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.id }}</h4>').fields([nga.field('title', 'string').attributes({ placeholder: 'Movie Name' }).validation({ required: true }).label('Title'), nga.field('original_title', 'string').label('Original title'), nga.field('imdb_id', 'string').attributes({ placeholder: 'Movie Imdb Id' }).defaultValue(0).template('<ma-input-field field="field" value="entry.values.imdb_id"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">*This Id should either be left empty, or match exactly the Imdb Id</small>').label('Movie Imdb Id'), nga.field('vod_vod_categories', 'reference_many').targetEntity(admin.getEntity('VodCategories')).targetField(nga.field('name')).label('Genres').attributes({ placeholder: 'Select genre' }).singleApiCall(function (category_id) {
	        return { 'category_id[]': category_id };
	    }), nga.field('package_vods', 'reference_many').targetEntity(admin.getEntity('Packages')).permanentFilters({ package_type_id: [3, 4] }).targetField(nga.field('package_name')).label('Packages').attributes({ placeholder: 'Select packages' }).singleApiCall(function (package_id) {
	        return { 'package_id[]': package_id };
	    }), nga.field('director', 'string').attributes({ placeholder: 'Movie Director' }).validation({ required: true }).label('Director'), nga.field('rate', 'number').attributes({ placeholder: 'Movie rated. Must be greater than 0, smaller or equal to 10' }).validation({ required: true, validator: function validator(value) {
	            if (value <= 0) throw new Error('Rate must be greater than 0');
	            if (value > 10) throw new Error('Rate cannot be greater than 10');
	        } }).label('Rate'), nga.field('vote_average', 'float').validation({ required: true }).defaultValue(5.0).label('Vote Average'), nga.field('vote_count', 'number').validation({ required: true }).defaultValue(0).label('Vote Count'), nga.field('popularity', 'float').validation({ required: true }).defaultValue(0).label('Popularity'), nga.field('clicks', 'number').attributes({ placeholder: 'Movie clicks' }).validation({ required: true }).label('Clicks'), nga.field('duration').validation({ required: true }).attributes({ placeholder: 'Duration of movie in minutes' }).label('Duration'), nga.field('tagline', 'string').defaultValue('').attributes({ placeholder: 'Short description' }).label('Short description'), nga.field('description', 'text').transform(function lineBreaks(value, entry) {
	        return value.split("\n").join("<br/>");
	    }).attributes({ placeholder: 'Movie Subject' }).validation({ required: true, maxlength: 1000 }).label('Description'), nga.field('starring', 'text').transform(function lineBreak(value, entry) {
	        return value.split("\n").join("<br/>");
	    }).attributes({ placeholder: 'Movie actors' }).validation({ required: true, maxlength: 1000 }).label('Starring'), nga.field('trailer_url', 'string').defaultValue('').attributes({ placeholder: 'Trailer url' }).label('Trailer url'), nga.field('homepage', 'string').defaultValue('').validation({ required: true }).attributes({ placeholder: 'Movie website' }).label('Movie website'), nga.field('vod_preview_url', 'file').uploadInformation({ 'url': '/file-upload/single-file/video_scrubbing_url/vod_preview_url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.vod_preview_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.vod_preview_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">Not larger than 1MB</small></div>').defaultValue('').validation({
	        validator: function validator(value) {
	            var vod_preview_url = document.getElementById('vod_preview_url');
	            if (vod_preview_url.value.length > 0) {
	                if (vod_preview_url.files[0].size > 1048576) {
	                    throw new Error('Your File of Video scrubbing url is too Big, not larger than 1MB');
	                }
	            }
	        }
	    }).label('Video scrubbing url'), nga.field('icon_url', 'file').uploadInformation({ 'url': '/file-upload/single-file/vod/icon_url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.icon_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.icon_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">Not larger than 1MB</small></div>').validation({
	        validator: function validator(value) {
	            if (value == null) {
	                throw new Error('Please, choose icon');
	            } else {
	                var icon_url = document.getElementById('icon_url');
	                if (icon_url.value.length > 0) {
	                    if (icon_url.files[0].size > 153600) {
	                        throw new Error('Your Icon is too Big, not larger than 150 KB');
	                    }
	                }
	            }
	        }
	    }).label('Icon *'), nga.field('image_url', 'file').uploadInformation({ 'url': '/file-upload/single-file/vod/image_url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.image_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.image_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">1920x1200 px, not larger than 600 KB</small></div>').validation({
	        validator: function validator(value) {
	            if (value == null) {
	                throw new Error('Please, choose image');
	            } else {
	                var image_url = document.getElementById('image_url');
	                if (image_url.value.length > 0) {
	                    if (image_url.files[0].size > 614400) {
	                        throw new Error('Your Image is too Big, not larger than 600 KB');
	                    }
	                }
	            }
	        }
	    }).label('Image *'), nga.field('pin_protected', 'boolean').attributes({ placeholder: 'Pin Protected' }).validation({ required: true }).label('Pin Protected'), nga.field('adult_content', 'choice')
	    // .defaultValue(false)
	    .choices([{ value: true, label: 'Yes' }, { value: false, label: 'No' }])
	    // .map(function (value, entry) {
	    //     return false;
	    // })
	    .attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Has adult content'), nga.field('isavailable', 'boolean').attributes({ placeholder: 'Is Available' }).validation({ required: true }).label('Is Available'), nga.field('expiration_time', 'datetime').validation({ required: true }).defaultValue('3018-01-01 00:00:00').map(function (value, entry) {
	        return '3018-01-01 00:00:00';
	    }).label('Expiration date'), nga.field('price', 'float').template('<ma-input-field field="field" value="entry.values.price"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">*Set price to 0 for movies that are not for sale</small>').validation({ required: true }).label('Price'), nga.field('mandatory_ads', 'choice').defaultValue(false).choices([{ value: true, label: 'Enabled' }, { value: false, label: 'Disabled' }]).map(function (value, entry) {
	        return false;
	    }).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Mandatory ads'), nga.field('revenue', 'number').validation({ required: true }).label('Revenues'), nga.field('budget', 'number').validation({ required: true }).label('Budget'), nga.field('original_language', 'string').validation({ required: true }).defaultValue('en').label('Original language'), nga.field('spoken_languages', 'choices').choices(language_list).label('Spoken languages'), nga.field('release_date', 'date').validation({ required: true }).defaultValue('1896-12-28').label('Release date'), nga.field('status', 'string').validation({ required: true }).label('Status'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    return tmdbvods;
	};

	module.exports = exports['default'];

/***/ },
/* 136 */
/***/ function(module, exports) {

	module.exports = "<div class=\"row\">\r\n    <div class=\"btn-group inline pull-right\">\r\n      <div class=\"btn btn-small\"><ma-submit-button class=\"pull-right\" label=\"Submit\"></ma-submit-button></div>\r\n      <div class=\"btn btn-small\"><ma-back-button class=\"pull-right\" label=\"Cancel\"></ma-back-button></div>\r\n    </div>\r\n</div>\r\n\r\n<hr>";

/***/ },
/* 137 */
/***/ function(module, exports) {

	module.exports = "<div class=\"row\">\r\n    <div class=\"btn-group inline pull-right\"> \r\n      <div class=\"btn btn-small\"><ma-filtered-list-button entity-name=\"Channels\" class=\"pull-right\" label=\"SEE ALL CHANNELS\" filter=\"{ genre_id: entry.values.id }\"></ma-filtered-list-button></div> \r\n    </div>\r\n</div>\r\n\r\n<hr>";

/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	    var htmlContent = admin.getEntity('htmlContent');

	    htmlContent.listView().title('<h4>HTML Content <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').listActions(['edit', 'delete']).batchActions([]).fields([nga.field('id').label('ID'), nga.field('name').label('Name'), nga.field('description').label('Description'), nga.field('content').map(function truncate(value) {
	        if (!value) return '';
	        return value.length > 80 ? value.substr(0, 80) + '...' : value;
	    }).label('Content'), nga.field('url').label('Url')]);

	    htmlContent.creationView().title('<h4>HTML Content <i class="fa fa-angle-right" aria-hidden="true"></i> Create: Template</h4>').fields([nga.field('id', 'number').attributes({ placeholder: 'ID' }).validation({ required: true }).label('ID'), nga.field('name', 'string').attributes({ placeholder: 'Name' }).validation({ required: true }).label('Name'), nga.field('description', 'string').attributes({ placeholder: 'Description' }).validation({ required: true }).label('Description'), nga.field('content', 'wysiwyg').attributes({ placeholder: 'HTML Content' }).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Content Cannot Be Empty');
	            }
	        }
	    }).label('Content *'), nga.field('url').transform(function (value, entry) {
	        var url = window.location.origin + '/api/htmlContentApp/' + entry.id;
	        return url;
	    }).cssClasses('hidden').label(''), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    htmlContent.editionView().actions(['list']).title('<h4>HTML Content <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.id }}</h4>').fields([nga.field('name', 'string').attributes({ placeholder: 'Name', readOnly: true }).validation({ required: true }).label('Name'), nga.field('description', 'string').attributes({ placeholder: 'Description' }).validation({ required: true }).label('Description'), nga.field('content', 'wysiwyg').attributes({ placeholder: 'HTML Content' }).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Content Cannot Be Empty');
	            }
	        }
	    }).label('Content *'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    htmlContent.deletionView().title('<h4>HTML Content <i class="fa fa-angle-right" aria-hidden="true"></i> Remove <span style ="color:red;"> {{ entry.values.id }}').actions(['<ma-back-button entry="entry" entity="entity"></ma-back-button>']);

	    return htmlContent;
	};

	module.exports = exports['default'];

/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	    var VodMenuCarousel = admin.getEntity('vodMenuCarousel');

	    VodMenuCarousel.listView().title('<h4>Vod Menu Carousel<i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).actions(['create']).fields([nga.field('id').label('ID'), nga.field('vod_menu_id', 'reference').targetEntity(admin.getEntity('vodMenu')).targetField(nga.field('name')).label('Vod Menu Name'), nga.field('name', 'string').label('Carousel Name'), nga.field('order', 'number').label('Order'), nga.field('url', 'string').label('Url'), nga.field('isavailable', 'boolean').label('Available')]).listActions(['edit', 'delete']);

	    VodMenuCarousel.creationView().title('<h4>Vod Menu Carousel<i class="fa fa-angle-right" aria-hidden="true"></i> Create: {{ entry.values.id }}</h4>').fields([nga.field('vod_menu_id', 'reference').targetEntity(admin.getEntity('vodMenu')).targetField(nga.field('name')).attributes({ placeholder: 'Choose from dropdown list the vod menu that this carousel will belong to' }).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select Vod Menu ID');
	            }
	        }
	    }).label('Vod Menu ID *'), nga.field('name', 'string').attributes({ placeholder: 'Name' }).validation({ required: true }).label('Carousel Name'), nga.field('description', 'text').transform(function lineBreaks(value, entry) {
	        return value.split("\n").join("<br/>");
	    }).attributes({ placeholder: 'Description' }).validation({ required: true, maxlength: 1000 }).label('Description'), nga.field('order', 'number').attributes({ placeholder: 'Order' }).validation({ required: true }).label('Order'), nga.field('url', 'string').defaultValue('').validation({ required: true }).attributes({ placeholder: 'Url' }).label('Url'), nga.field('isavailable', 'boolean').attributes({ placeholder: 'Is Available' }).validation({ required: true }).label('Is Available'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    VodMenuCarousel.editionView().actions(['list']).title('<h4>Vod Menu Carousel<i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.id }}</h4>').fields([VodMenuCarousel.creationView().fields()]);

	    VodMenuCarousel.deletionView().title('<h4>Vod Menu Carousel<i class="fa fa-angle-right" aria-hidden="true"></i> Remove <span style ="color:red;"> {{ entry.values.id }}').actions(['<ma-back-button entry="entry" entity="entity"></ma-back-button>']);

	    return VodMenuCarousel;
	};

	module.exports = exports['default'];

/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	    var VodMenu = admin.getEntity('vodMenu');

	    VodMenu.listView().title('<h4>Vod Menu <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).actions(['create']).fields([nga.field('id').label('ID'), nga.field('name', 'string').label('Vod Menu Name'), nga.field('order', 'number').label('Order'), nga.field('pin_protected', 'boolean').label('Pin Protected'), nga.field('isavailable', 'boolean').label('Available')]).listActions(['edit', 'delete']);

	    VodMenu.creationView().title('<h4>Vod Menu <i class="fa fa-angle-right" aria-hidden="true"></i> Create: {{ entry.values.id }}</h4>').fields([nga.field('name', 'string').attributes({ placeholder: 'Vod Menu Name' }).validation({ required: true }).label('Vod Menu Name'), nga.field('description', 'text').transform(function lineBreaks(value, entry) {
	        return value.split("\n").join("<br/>");
	    }).attributes({ placeholder: 'Description' }).validation({ required: true }).label('Description'), nga.field('order', 'number').attributes({ placeholder: 'Order' }).validation({ required: true }).label('Order'), nga.field('pin_protected', 'boolean').attributes({ placeholder: 'Pin Protected' }).validation({ required: true }).label('Pin Protected'), nga.field('isavailable', 'boolean').attributes({ placeholder: 'Is Available' }).validation({ required: true }).label('Is Available'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    VodMenu.editionView().actions(['list']).title('<h4>Vod Menu <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.id }}</h4>').fields([VodMenu.creationView().fields()]);

	    VodMenu.deletionView().title('<h4>Vod Menu <i class="fa fa-angle-right" aria-hidden="true"></i> Remove <span style ="color:red;"> {{ entry.values.id }}').actions(['<ma-back-button entry="entry" entity="entity"></ma-back-button>']);

	    return VodMenu;
	};

	module.exports = exports['default'];

/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	//import foto from '../foto.html';

	exports['default'] = function (nga, admin) {
	    var Season = admin.getEntity('Season');
	    Season.listView().title('<h4>Season <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions(['<vod type="update_film" selection="selection"></vod>']).actions(['<move type="move_to_package" selection="selection"></move>', 'batch', 'export', 'filter', 'create']).fields([nga.field('title', 'string').label('Title'), nga.field('expiration_time', 'datetime').label('Expiration Time'), nga.field('duration', 'number').cssClasses('hidden-xs').label('Duration'), nga.field('icon_url', 'file').template('<img src="{{ entry.values.icon_url }}" height="35" width="35" />').cssClasses('hidden-xs').label('Icon'), nga.field('is_available', 'boolean').cssClasses('hidden-xs').label('Available'), nga.field('createdAt', 'date').cssClasses('hidden-xs').label('Created at'), nga.field('pin_protected', 'boolean').cssClasses('hidden-xs').label('Pin Protected')]).sortDir("DESC").sortField("createdAt").filters([nga.field('expiration_time', 'datetime').label('Expiration Time'), nga.field('title').label('Title'), nga.field('pin_protected', 'choice').choices([{ value: 0, label: 'False' }, { value: 1, label: 'True' }]).attributes({ placeholder: 'Pin Protected' }).label('Pin Protected'), nga.field('added_before', 'datetime').label('Added before'), nga.field('added_after', 'datetime').label('Added after'), nga.field('updated_before', 'date').label('Last updated before'), nga.field('updated_after', 'date').label('Last updated after'), nga.field('is_available', 'boolean').filterChoices([{ value: true, label: 'Available' }, { value: false, label: 'Not Available' }]).label('Available'), nga.field('q').label('').template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>').pinned(true)]).listActions(['edit']).exportFields([Season.listView().fields()]);

	    Season.deletionView().title('<h4>Season <i class="fa fa-angle-right" aria-hidden="true"></i> Remove <span style ="color:red;"> {{ entry.values.title }}').actions(['<ma-back-button entry="entry" entity="entity"></ma-back-button>']);

	    Season.creationView().title('<h4>Season <i class="fa fa-angle-right" aria-hidden="true"></i> Create: Season</h4>').onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
	        progression.done();
	        $state.go($state.get('edit'), { entity: entity.name(), id: entry._identifierValue });
	        return false;
	    }]).fields([nga.field('title', 'string').attributes({ placeholder: 'Season Name' }).validation({ required: true }).label('Title'), nga.field('imdb_id', 'string').attributes({ placeholder: 'Season Imdb Id' }).defaultValue(0).template('<ma-input-field field="field" value="entry.values.imdb_id"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">*This Id should either be left empty, or match exactly the Imdb Id</small>').label('Movie Imdb Id'), nga.field('tv_show_id', 'reference').targetEntity(admin.getEntity('Series')).targetField(nga.field('title')).attributes({ placeholder: 'Select the TV Shows name from the dropdown list ' }).validation({ required: true }).label('TV Shows Name'), nga.field('season_number', 'number').attributes({ placeholder: 'Season Number' }).validation({ required: true }).label('Season Number'), nga.field('director', 'string').attributes({ placeholder: 'Season Director' }).validation({ required: true }).label('Director'), nga.field('rate', 'number').attributes({ placeholder: 'Season rated. Must be greater than 0, smaller or equal to 10' }).validation({ required: true, validator: function validator(value) {
	            if (value <= 0) throw new Error('Rate must be greater than 0');
	            if (value > 10) throw new Error('Rate cannot be greater than 10');
	        } }).label('Rate'), nga.field('description', 'text').transform(function lineBreaks(value, entry) {
	        return value.split("\n").join("<br/>");
	    }).attributes({ placeholder: 'Season Subject' }).validation({ required: true, maxlength: 1000 }).label('Description'), nga.field('cast', 'text').transform(function lineBreak(value, entry) {
	        return value.split("\n").join("<br/>");
	    }).attributes({ placeholder: 'Season actors' }).validation({ required: true, maxlength: 1000 }).label('Starring'), nga.field('trailer_url', 'string').defaultValue('').attributes({ placeholder: 'Trailer url' }).label('Trailer url'), nga.field('icon_url', 'file').uploadInformation({ 'url': '/file-upload/single-file/vod/icon_url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.icon_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.icon_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">360x516 px, not larger than 150 KB</small></div>').validation({
	        validator: function validator(value) {
	            if (value == null) {
	                throw new Error('Please, choose icon');
	            } else {
	                var icon_url = document.getElementById('icon_url');
	                if (icon_url.value.length > 0) {
	                    if (icon_url.files[0].size > 153600) {
	                        throw new Error('Your Icon is too Big, not larger than 150 KB');
	                    }
	                }
	            }
	        }
	    }).label('Icon *'), nga.field('image_url', 'file').uploadInformation({ 'url': '/file-upload/single-file/vod/image_url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.image_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.image_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">1920x1200 px, not larger than 600 KB</small></div>').validation({
	        validator: function validator(value) {
	            if (value == null) {
	                throw new Error('Please, choose image');
	            } else {
	                var image_url = document.getElementById('image_url');
	                if (image_url.value.length > 0) {
	                    if (image_url.files[0].size > 614400) {
	                        throw new Error('Your Image is too Big, not larger than 600 KB');
	                    }
	                }
	            }
	        }
	    }).label('Image *'), nga.field('pin_protected', 'boolean').attributes({ placeholder: 'Pin Protected' }).validation({ required: true }).label('Pin Protected'), nga.field('is_available', 'boolean').attributes({ placeholder: 'Is Available' }).validation({ required: true }).label('Is Available'), nga.field('expiration_time', 'datetime').validation({ required: true }).defaultValue(new Date()).label('Expiration date'), nga.field('mandatory_ads', 'choice').defaultValue(false).choices([{ value: true, label: 'Enabled' }, { value: false, label: 'Disabled' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Mandatory ads'), nga.field('revenue', 'number').defaultValue(0).label('Revenues'), nga.field('budget', 'number').defaultValue(0).label('Budget'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    Season.editionView().title('<h4>Season <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.title }}</h4>').actions(['list', 'create', '<ma-delete-button label="Remove" entry="entry" entity="entity"></ma-delete-button>']).onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
	        progression.done();
	        notification.log('Changes successfully saved', { addnCls: 'humane-flatty-success' });
	        $state.go($state.get('list'), { entity: entity.name() });
	        return false;
	    }]).fields([nga.field('title', 'string').attributes({ placeholder: 'Season Name' }).validation({ required: true }).label('Title'), nga.field('imdb_id', 'string').attributes({ placeholder: 'Season Imdb Id' }).defaultValue(0).template('<ma-input-field field="field" value="entry.values.imdb_id"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">*This Id should either be left empty, or match exactly the Imdb Id</small>').label('Movie Imdb Id'), nga.field('tv_show_id', 'reference').targetEntity(admin.getEntity('Series')).targetField(nga.field('title')).attributes({ placeholder: 'Select the TV Shows name from the dropdown list ' }).validation({ required: true }).label('TV Shows Name'), nga.field('season_number', 'number').attributes({ placeholder: 'Season Number' }).validation({ required: true }).label('Season Number'), nga.field('director', 'string').attributes({ placeholder: 'Season Director' }).validation({ required: true }).label('Director'), nga.field('rate', 'number').attributes({ placeholder: 'Season rated. Must be greater than 0, smaller or equal to 10' }).validation({ required: true, validator: function validator(value) {
	            if (value <= 0) throw new Error('Rate must be greater than 0');
	            if (value > 10) throw new Error('Rate cannot be greater than 10');
	        } }).label('Rate'), nga.field('description', 'text').transform(function lineBreaks(value, entry) {
	        return value.split("\n").join("<br/>");
	    }).attributes({ placeholder: 'Season Subject' }).validation({ required: true, maxlength: 1000 }).label('Description'), nga.field('cast', 'text').transform(function lineBreak(value, entry) {
	        return value.split("\n").join("<br/>");
	    }).attributes({ placeholder: 'Season actors' }).validation({ required: true, maxlength: 1000 }).label('Starring'), nga.field('trailer_url', 'string').defaultValue('').attributes({ placeholder: 'Trailer url' }).label('Trailer url'), nga.field('icon_url', 'file').uploadInformation({ 'url': '/file-upload/single-file/vod/icon_url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.icon_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.icon_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">360x516 px, not larger than 150 KB</small></div>').validation({
	        validator: function validator(value) {
	            if (value == null) {
	                throw new Error('Please, choose icon');
	            } else {
	                var icon_url = document.getElementById('icon_url');
	                if (icon_url.value.length > 0) {
	                    if (icon_url.files[0].size > 153600) {
	                        throw new Error('Your Icon is too Big, not larger than 150 KB');
	                    }
	                }
	            }
	        }
	    }).label('Icon *'), nga.field('image_url', 'file').uploadInformation({ 'url': '/file-upload/single-file/vod/image_url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.image_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.image_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">1920x1200 px, not larger than 600 KB</small></div>').validation({
	        validator: function validator(value) {
	            if (value == null) {
	                throw new Error('Please, choose image');
	            } else {
	                var image_url = document.getElementById('image_url');
	                if (image_url.value.length > 0) {
	                    if (image_url.files[0].size > 614400) {
	                        throw new Error('Your Image is too Big, not larger than 600 KB');
	                    }
	                }
	            }
	        }
	    }).label('Image *'), nga.field('pin_protected', 'boolean').attributes({ placeholder: 'Pin Protected' }).validation({ required: true }).label('Pin Protected'), nga.field('is_available', 'boolean').attributes({ placeholder: 'Is Available' }).validation({ required: true }).label('Is Available'), nga.field('expiration_time', 'datetime').validation({ required: true }).defaultValue(new Date()).label('Expiration date'), nga.field('mandatory_ads', 'choice').defaultValue(false).choices([{ value: true, label: 'Enabled' }, { value: false, label: 'Disabled' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Mandatory ads'), nga.field('revenue', 'number').defaultValue(0).label('Revenues'), nga.field('budget', 'number').defaultValue(0).label('Budget'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);
	    return Season;
	};

	module.exports = exports['default'];

/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	//import foto from '../foto.html';

	exports['default'] = function (nga, admin) {
	    var Series = admin.getEntity('Series');
	    Series.listView().title('<h4>TV Shows <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions(['<vod type="update_film" selection="selection"></vod>']).actions(['<move type="move_to_package" selection="selection"></move>', 'batch', 'export', 'filter', 'create']).fields([nga.field('title', 'string').label('Title'), nga.field('expiration_time', 'datetime').label('Expiration Time'), nga.field('tv_series_categories').cssClasses('hidden').map(function getpckgid(value, entry) {
	        var return_object = [];
	        for (var i = 0; i < value.length; i++) {
	            return_object[i] = value[i].category_id;
	        }
	        return return_object;
	    }).label('Tv shows in categories'), nga.field('tv_series_categories', 'reference_many').targetEntity(admin.getEntity('VodCategories')).targetField(nga.field('name')).singleApiCall(function (category_id) {
	        return { 'category_id[]': category_id };
	    }).label('Genres'), nga.field('tv_series_packages').cssClasses('hidden').map(function getpckgid(value, entry) {
	        var return_object = [];
	        for (var i = 0; i < value.length; i++) return_object[i] = value[i].package_id;
	        return return_object;
	    }).label('Vod in packages'), nga.field('tv_series_packages', 'reference_many').targetEntity(admin.getEntity('Packages')).perPage(-1).permanentFilters({ package_type_id: [3, 4] }).targetField(nga.field('package_name')).singleApiCall(function (package_id) {
	        return { 'package_id[]': package_id };
	    }).label('Packages'), nga.field('icon_url', 'file').template('<img src="{{ entry.values.icon_url }}" height="35" width="35" />').cssClasses('hidden-xs').label('Icon'), nga.field('is_available', 'boolean').cssClasses('hidden-xs').label('Available'), nga.field('createdAt', 'date').cssClasses('hidden-xs').label('Created at'), nga.field('pin_protected', 'boolean').cssClasses('hidden-xs').label('Pin Protected')]).sortDir("DESC").sortField("createdAt").filters([nga.field('not_id', 'reference').targetEntity(admin.getEntity('vodPackages')).permanentFilters({ package_type_id: [3, 4] }).targetField(nga.field('package_name')).label('Not In Package'), nga.field('expiration_time', 'datetime').label('Expiration Time'), nga.field('title').label('Title'), nga.field('pin_protected', 'choice').choices([{ value: 0, label: 'False' }, { value: 1, label: 'True' }]).attributes({ placeholder: 'Pin Protected' }).label('Pin Protected'), nga.field('added_before', 'datetime').label('Added before'), nga.field('added_after', 'datetime').label('Added after'), nga.field('updated_before', 'date').label('Last updated before'), nga.field('updated_after', 'date').label('Last updated after'), nga.field('isavailable', 'boolean').filterChoices([{ value: true, label: 'Available' }, { value: false, label: 'Not Available' }]).label('Available'), nga.field('q').label('').template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>').pinned(true)]).listActions(['edit']).exportFields([Series.listView().fields()]);

	    Series.deletionView().title('<h4>TV Shows <i class="fa fa-angle-right" aria-hidden="true"></i> Remove <span style ="color:red;"> {{ entry.values.title }}').actions(['<ma-back-button entry="entry" entity="entity"></ma-back-button>']);

	    Series.creationView().title('<h4>TV Shows <i class="fa fa-angle-right" aria-hidden="true"></i> Create: TV Shows</h4>').onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
	        progression.done();
	        $state.go($state.get('edit'), { entity: entity.name(), id: entry._identifierValue });
	        return false;
	    }]).fields([nga.field('title', 'string').attributes({ placeholder: 'TV Shows Name' }).validation({ required: true }).label('Title'), nga.field('imdb_id', 'string').attributes({ placeholder: 'TV Shows Imdb Id' }).defaultValue(0).template('<ma-input-field field="field" value="entry.values.imdb_id"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">*This Id should either be left empty, or match exactly the Imdb Id</small>').label('Movie Imdb Id'), nga.field('tv_series_categories', 'reference_many').targetEntity(admin.getEntity('VodCategories')).targetField(nga.field('name')).label('Genres').attributes({ placeholder: 'Select genre' }).singleApiCall(function (category_id) {
	        return { 'category_id[]': category_id };
	    }), nga.field('tv_series_packages', 'reference_many').targetEntity(admin.getEntity('Packages')).permanentFilters({ package_type_id: [3, 4] }).targetField(nga.field('package_name')).label('Packages').attributes({ placeholder: 'Select packages' }).singleApiCall(function (package_id) {
	        return { 'package_id[]': package_id };
	    }), nga.field('director', 'string').attributes({ placeholder: 'TV Shows Director' }).validation({ required: true }).label('Director'), nga.field('rate', 'number').attributes({ placeholder: 'TV Shows rated. Must be greater than 0, smaller or equal to 10' }).validation({ required: true, validator: function validator(value) {
	            if (value <= 0) throw new Error('Rate must be greater than 0');
	            if (value > 10) throw new Error('Rate cannot be greater than 10');
	        } }).label('Rate'), nga.field('clicks', 'number').attributes({ placeholder: 'TV Shows clicks' }).validation({ required: true }).label('Clicks'), nga.field('description', 'text').transform(function lineBreaks(value, entry) {
	        return value.split("\n").join("<br/>");
	    }).attributes({ placeholder: 'TV Shows Subject' }).validation({ required: true, maxlength: 1000 }).label('Description'), nga.field('cast', 'text').transform(function lineBreak(value, entry) {
	        return value.split("\n").join("<br/>");
	    }).attributes({ placeholder: 'TV Shows actors' }).validation({ required: true, maxlength: 1000 }).label('Starring'), nga.field('trailer_url', 'string').defaultValue('').attributes({ placeholder: 'Trailer url' }).label('Trailer url'), nga.field('icon_url', 'file').uploadInformation({ 'url': '/file-upload/single-file/vod/icon_url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.icon_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.icon_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">360x516 px, not larger than 150 KB</small></div>').validation({
	        validator: function validator(value) {
	            if (value == null) {
	                throw new Error('Please, choose icon');
	            } else {
	                var icon_url = document.getElementById('icon_url');
	                if (icon_url.value.length > 0) {
	                    if (icon_url.files[0].size > 153600) {
	                        throw new Error('Your Icon is too Big, not larger than 150 KB');
	                    }
	                }
	            }
	        }
	    }).label('Icon *'), nga.field('image_url', 'file').uploadInformation({ 'url': '/file-upload/single-file/vod/image_url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.image_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.image_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">1920x1200 px, not larger than 600 KB</small></div>').validation({
	        validator: function validator(value) {
	            if (value == null) {
	                throw new Error('Please, choose image');
	            } else {
	                var image_url = document.getElementById('image_url');
	                if (image_url.value.length > 0) {
	                    if (image_url.files[0].size > 614400) {
	                        throw new Error('Your Image is too Big, not larger than 600 KB');
	                    }
	                }
	            }
	        }
	    }).label('Image *'), nga.field('pin_protected', 'boolean').attributes({ placeholder: 'Pin Protected' }).validation({ required: true }).label('Pin Protected'), nga.field('adult_content', 'choice').defaultValue(false).choices([{ value: true, label: 'Yes' }, { value: false, label: 'No' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Has adult content'), nga.field('is_available', 'boolean').attributes({ placeholder: 'Is Available' }).validation({ required: true }).label('Is Available'), nga.field('expiration_time', 'datetime').validation({ required: true }).defaultValue(new Date()).label('Expiration date'), nga.field('mandatory_ads', 'choice').defaultValue(false).choices([{ value: true, label: 'Enabled' }, { value: false, label: 'Disabled' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Mandatory ads'), nga.field('revenue', 'number').defaultValue(0).label('Revenues'), nga.field('budget', 'number').defaultValue(0).label('Budget'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    Series.editionView().title('<h4>TV Shows <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.title }}</h4>').actions(['list', 'create', '<ma-delete-button label="Remove" entry="entry" entity="entity"></ma-delete-button>']).onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
	        progression.done();
	        notification.log('Changes successfully saved', { addnCls: 'humane-flatty-success' });
	        $state.go($state.get('list'), { entity: entity.name() });
	        return false;
	    }]).fields([nga.field('title', 'string').attributes({ placeholder: 'TV Shows Name' }).validation({ required: true }).label('Title'), nga.field('imdb_id', 'string').attributes({ placeholder: 'TV Shows Imdb Id' }).defaultValue(0).template('<ma-input-field field="field" value="entry.values.imdb_id"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">*This Id should either be left empty, or match exactly the Imdb Id</small>').label('Movie Imdb Id'), nga.field('tv_series_categories', 'reference_many').targetEntity(admin.getEntity('VodCategories')).targetField(nga.field('name')).label('Genres').attributes({ placeholder: 'Select genre' }).map(function getpckgid(value, entry) {
	        var return_object = [];
	        for (var i = 0; i < value.length; i++) {
	            return_object[i] = value[i].category_id;
	        }
	        return return_object;
	    }).singleApiCall(function (category_id) {
	        return { 'category_id[]': category_id };
	    }), nga.field('tv_series_packages', 'reference_many').targetEntity(admin.getEntity('Packages')).permanentFilters({ package_type_id: [3, 4] }).targetField(nga.field('package_name')).label('Packages').attributes({ placeholder: 'Select packages' }).map(function getpckgid(value, entry) {
	        var return_object = [];
	        for (var i = 0; i < value.length; i++) {
	            return_object[i] = value[i].package_id;
	        }
	        return return_object;
	    }).singleApiCall(function (package_id) {
	        return { 'package_id[]': package_id };
	    }), nga.field('director', 'string').attributes({ placeholder: 'TV Shows Director' }).validation({ required: true }).label('Director'), nga.field('rate', 'number').attributes({ placeholder: 'TV Shows rated. Must be greater than 0, smaller or equal to 10' }).validation({ required: true, validator: function validator(value) {
	            if (value <= 0) throw new Error('Rate must be greater than 0');
	            if (value > 10) throw new Error('Rate cannot be greater than 10');
	        } }).label('Rate'), nga.field('clicks', 'number').attributes({ placeholder: 'TV Shows clicks' }).validation({ required: true }).label('Clicks'), nga.field('description', 'text').transform(function lineBreaks(value, entry) {
	        return value.split("\n").join("<br/>");
	    }).attributes({ placeholder: 'TV Shows Subject' }).validation({ required: true, maxlength: 1000 }).label('Description'), nga.field('cast', 'text').transform(function lineBreak(value, entry) {
	        return value.split("\n").join("<br/>");
	    }).attributes({ placeholder: 'TV Shows actors' }).validation({ required: true, maxlength: 1000 }).label('Starring'), nga.field('trailer_url', 'string').defaultValue('').attributes({ placeholder: 'Trailer url' }).label('Trailer url'), nga.field('icon_url', 'file').uploadInformation({ 'url': '/file-upload/single-file/vod/icon_url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.icon_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.icon_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">360x516 px, not larger than 150 KB</small></div>').validation({
	        validator: function validator(value) {
	            if (value == null) {
	                throw new Error('Please, choose icon');
	            } else {
	                var icon_url = document.getElementById('icon_url');
	                if (icon_url.value.length > 0) {
	                    if (icon_url.files[0].size > 153600) {
	                        throw new Error('Your Icon is too Big, not larger than 150 KB');
	                    }
	                }
	            }
	        }
	    }).label('Icon *'), nga.field('image_url', 'file').uploadInformation({ 'url': '/file-upload/single-file/vod/image_url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.image_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.image_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">1920x1200 px, not larger than 600 KB</small></div>').validation({
	        validator: function validator(value) {
	            if (value == null) {
	                throw new Error('Please, choose image');
	            } else {
	                var image_url = document.getElementById('image_url');
	                if (image_url.value.length > 0) {
	                    if (image_url.files[0].size > 614400) {
	                        throw new Error('Your Image is too Big, not larger than 600 KB');
	                    }
	                }
	            }
	        }
	    }).label('Image *'), nga.field('pin_protected', 'boolean').attributes({ placeholder: 'Pin Protected' }).validation({ required: true }).label('Pin Protected'), nga.field('adult_content', 'choice').defaultValue(false).choices([{ value: true, label: 'Yes' }, { value: false, label: 'No' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Has adult content'), nga.field('is_available', 'boolean').attributes({ placeholder: 'Is Available' }).validation({ required: true }).label('Is Available'), nga.field('expiration_time', 'datetime').validation({ required: true }).defaultValue(new Date()).label('Expiration date'), nga.field('mandatory_ads', 'choice').defaultValue(false).choices([{ value: true, label: 'Enabled' }, { value: false, label: 'Disabled' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Mandatory ads'), nga.field('revenue', 'number').defaultValue(0).label('Revenues'), nga.field('budget', 'number').defaultValue(0).label('Budget'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    return Series;
	};

	module.exports = exports['default'];

/***/ },
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	    var ResellersUsers = admin.getEntity('ResellersUsers');
	    ResellersUsers.listView().title('<h4>Users <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('group_id', 'reference').targetEntity(admin.getEntity('Groups')).targetField(nga.field('name')).label('Group'), nga.field('username', 'string').label('Username'), nga.field('email', 'email').cssClasses('hidden-xs').label('Email'), nga.field('telephone', 'string').cssClasses('hidden-xs').label('Telephone'), nga.field('isavailable', 'boolean').label('Is Available')]).listActions(['edit']).exportFields([ResellersUsers.listView().fields()]);

	    ResellersUsers.creationView().title('<h4>Users <i class="fa fa-angle-right" aria-hidden="true"></i> Create: User </h4>').fields([nga.field('group_id', 'reference').targetEntity(admin.getEntity('Groups')).targetField(nga.field('name')).validation({ required: true }).attributes({ placeholder: 'Select group' }).label('Group'), nga.field('username', 'string').attributes({ placeholder: 'Username must be at least 3 character long' }).validation({ required: true, minlength: 3 }).label('Username'), nga.field('hashedpassword', 'password').attributes({ placeholder: 'Password must be at least 4 character long' }).validation({ required: true, minlength: 4 }).label('Password'), nga.field('email', 'email').attributes({ placeholder: 'Email' }).validation({ required: true }).label('Email'), nga.field('telephone', 'string').attributes({ placeholder: 'Telephone' }).validation({ required: true }).label('Telephone'), nga.field('third_party_api_token', 'string').label('Third party token'), nga.field('isavailable', 'boolean').validation({ required: true }).label('Is Available'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    ResellersUsers.editionView().title('<h4>Users <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.username }}</h4>').actions(['back']).fields([nga.field('group_id', 'reference').targetEntity(admin.getEntity('Groups')).targetField(nga.field('name')).validation({ required: true }).attributes({ placeholder: 'Select group' }).isDetailLink(false).editable(false).label('Group'), nga.field('username', 'string').attributes({ placeholder: 'Username must be at least 3 character long' }).validation({ required: true, minlength: 3 }).label('Username'), nga.field('hashedpassword', 'password').attributes({ placeholder: 'Password must be at least 4 character long' }).validation({ required: true, minlength: 4 }).label('Password'), nga.field('email', 'email').attributes({ placeholder: 'Email' }).validation({ required: true }).label('Email'), nga.field('telephone', 'string').attributes({ placeholder: 'Telephone' }).validation({ required: true }).label('Telephone'), nga.field('third_party_api_token', 'string').label('Third party token'), nga.field('isavailable', 'boolean').validation({ required: true }).label('Is Available'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    return ResellersUsers;
	};

	module.exports = exports['default'];

/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	    var ResellersLoginData = admin.getEntity('ResellersLoginData');
	    ResellersLoginData.listView().title('<h4>Login Accounts <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('customer_id', 'reference').targetEntity(admin.getEntity('CustomerData')).targetField(nga.field('firstname').map(function (value, entry) {
	        return entry.firstname + ' ' + entry.lastname;
	    })).cssClasses('hidden-xs').label('Customer'), nga.field('username').isDetailLink(true).label('Username'), nga.field('channel_stream_source_id', 'reference').targetEntity(admin.getEntity('ChannelStreamSources')).targetField(nga.field('stream_source')).cssClasses('hidden-xs').label('Channel Stream Source'), nga.field('vod_stream_source', 'reference').targetEntity(admin.getEntity('VodStreamSources')).targetField(nga.field('description')).cssClasses('hidden-xs').label('VOD Stream Source'), nga.field('pin', 'string').cssClasses('hidden-xs').label('Pin'), nga.field('activity_timeout').cssClasses('hidden-xs').label('Activity Time Out'), nga.field('timezone', 'number').cssClasses('hidden-xs').label('Timezone'), nga.field('account_lock', 'boolean').cssClasses('hidden-xs').label('Account Locked'), nga.field('get_messages', 'boolean').label('Get messages'), nga.field('show_adult', 'boolean').label('Show adult'), nga.field('auto_timezone', 'boolean').cssClasses('hidden-xs').label('Auto Timezone')]).filters([nga.field('q').label('').template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>').pinned(true)]).listActions(['edit']);

	    ResellersLoginData.creationView().title('<h4>Login Accounts <i class="fa fa-angle-right" aria-hidden="true"></i> Create: Login Account</h4>').onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
	        progression.done();
	        $state.go($state.get('edit'), { entity: entity.name(), id: entry._identifierValue });
	        return false;
	    }]).fields([nga.field('customer_id', 'reference').targetEntity(admin.getEntity('CustomerData')).targetField(nga.field('firstname').map(function (v, e) {
	        return e.firstname + ' ' + e.lastname;
	    })).remoteComplete(true, {
	        refreshDelay: 300,
	        // populate choices from the response of GET
	        searchQuery: function searchQuery(search) {
	            return { q: search };
	        }
	    }).perPage(5) // limit the number of results to 5
	    .attributes({ placeholder: 'Select Customer' }).label('Customer').validation({ required: true }), nga.field('username', 'string').attributes({ placeholder: 'Number,lowercase letter, and at least 2 or more characters' }).label('Username').validation({ required: true, pattern: '^[a-z\\d]{2,}$' }), nga.field('password', 'password').attributes({ placeholder: '4 or more characters', title: '4 or more characters' }).label('Password').validation({ required: true, pattern: '.{4,}' }), nga.field('channel_stream_source_id', 'reference').targetEntity(admin.getEntity('ChannelStreamSources')).targetField(nga.field('stream_source')).attributes({ placeholder: 'Choose from dropdown list channel stream source for this customer' }).label('Channel Stream Source').perPage(-1).validation({ required: true }), nga.field('vod_stream_source', 'reference').targetEntity(admin.getEntity('VodStreamSources')).targetField(nga.field('description')).attributes({ placeholder: 'Choose from dropdown list VOD Stream Source for this customer' }).label('VOD Stream Source').perPage(-1).validation({ required: true }), nga.field('pin', 'string').attributes({ placeholder: 'Must contain 4 numbers', title: 'Must contain 4 numbers' }).validation({ required: true, pattern: '(?=.*\\d)[0-9]{4}' }).label('Pin'), nga.field('activity_timeout', 'string').attributes({ placeholder: 'Activity time out' }).validation({ required: true }).defaultValue(10800).label('Activity Time Out (sec)'), nga.field('timezone', 'choice').choices([{ value: -12, label: '(UTC-12:00) International Date Line West' }, { value: -11, label: '(UTC-11:00) Samoa' }, { value: -10, label: '(UTC-10:00) Hawaii' }, { value: -9, label: '(UTC-9:00) Alaska' }, { value: -8, label: '(UTC-8:00) Pacific Time (US & Canada)' }, { value: -7, label: '(UTC-7:00) Arizona, La Paz, Mazatlan' }, { value: -6, label: '(UTC-6:00) Central America, Monterrey, Mexico City ' }, { value: -5, label: '(UTC-5:00) Bogota, Lima, Quito, Indiana' }, { value: -4, label: '(UTC-4:00) Atlantic Time (Canada), Manaus ' }, { value: -3, label: '(UTC-3:00) Brasilia, Buenos Aires, Cayenne' }, { value: -2, label: '(UTC-2:00) Mid-Atlantic' }, { value: -1, label: '(UTC-1:00) Azores, Cape Verde Is.' }, { value: 0, label: '(UTC 0:00) Dublin, Lisbon, London, Reykjavik' }, { value: +1, label: '(UTC+1:00) Amsterdam, Berlin, Rome, Paris, Prague, Skopje ' }, { value: +2, label: '(UTC+2:00) Athens, Istanbul, Cairo, Helsinki, Kyiv, Vilnius ' }, { value: +3, label: '(UTC+3:00) Baghdad, Kuwait, Moscow, St. Petersburg, Nairobi' }, { value: +4, label: '(UTC+4:00) Abu Dhabi, Baku, Muscat' }, { value: +5, label: '(UTC+5:00) Ekaterinburg, Karachi, Tashkent' }, { value: +6, label: '(UTC+6:00) Astana, Dhaka, Novosibirsk' }, { value: +7, label: '(UTC+7:00) Bangkok, Hanoi, Jakarta' }, { value: +8, label: '(UTC+8:00) Beijing, Hong Kong, Kuala Lumpur, Perth, Taipei' }, { value: +9, label: '(UTC+9:00) Sapporo, Tokyo, Seoul' }, { value: +10, label: '(UTC+10:00) Brisbane, Melbourne, Sydney' }, { value: +11, label: '(UTC+11:00) Magadan, Solomon Is.' }, { value: +12, label: '(UTC+12:00) Auckland, Fiji' }]).attributes({ placeholder: 'Select client timezone depending on country' }).validation({ required: true }).label('Timezone'), nga.field('get_messages', 'choice').defaultValue(false).choices([{ value: false, label: 'Disabled' }, { value: true, label: 'Enabled' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Get messages'), nga.field('get_ads', 'choice').defaultValue(false).choices([{ value: false, label: 'Disabled' }, { value: true, label: 'Enabled' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Receive ads'), nga.field('show_adult', 'choice').defaultValue(false).choices([{ value: false, label: 'Disabled' }, { value: true, label: 'Enabled' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Show adult content'), nga.field('auto_timezone', 'choice').defaultValue(false).choices([{ value: false, label: 'Disabled' }, { value: true, label: 'Enabled' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Auto Timezone'), nga.field('account_lock', 'choice').defaultValue(false).choices([{ value: false, label: 'Disabled' }, { value: true, label: 'Enabled' }]).attributes({ placeholder: 'Choose from dropdown list' }).label('Account Locked').validation({ required: true }), nga.field('beta_user', 'choice').attributes({ placeholder: 'Choose from dropdown list' }).defaultValue(false).choices([{ value: false, label: 'Disabled' }, { value: true, label: 'Enabled' }]).label('Is tester').validation({ required: true }), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    ResellersLoginData.editionView().title('<h4>Login Accounts <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.username }}</h4>').actions(['back']).fields([nga.field('customer_id', 'reference').targetEntity(admin.getEntity('CustomerData')).targetField(nga.field('firstname', 'template').map(function (v, e) {
	        return e.firstname + ' ' + e.lastname;
	    })).attributes({ placeholder: 'Select Customer' }).label('Customer').perPage(1000).validation({ required: true }), nga.field('username', 'string').attributes({ placeholder: 'Username', readOnly: true }).label('Username').validation({ required: true }), nga.field('password', 'password').attributes({ placeholder: 'Password' }).label('Password').validation({ required: true }), nga.field('pin', 'string').attributes({ placeholder: 'Pin' }).validation({ required: true }).label('Pin'), nga.field('channel_stream_source_id', 'reference').targetEntity(admin.getEntity('ChannelStreamSources')).targetField(nga.field('stream_source')).attributes({ placeholder: 'Select Channel Stream Source' }).label('Channel Stream Source').validation({ required: true }), nga.field('vod_stream_source', 'reference').targetEntity(admin.getEntity('VodStreamSources')).targetField(nga.field('description')).attributes({ placeholder: 'Select Vod Stream Source' }).label('VOD Stream Source').validation({ required: true }), nga.field('activity_timeout', 'string').attributes({ placeholder: 'Activity time out' }).validation({ required: true }).defaultValue(10800).label('Activity Time Out'), nga.field('timezone', 'choice').choices([{ value: -12, label: '(UTC-12:00) International Date Line West' }, { value: -11, label: '(UTC-11:00) Samoa' }, { value: -10, label: '(UTC-10:00) Hawaii' }, { value: -9, label: '(UTC-9:00) Alaska' }, { value: -8, label: '(UTC-8:00) Pacific Time (US & Canada)' }, { value: -7, label: '(UTC-7:00) Arizona, La Paz, Mazatlan' }, { value: -6, label: '(UTC-6:00) Central America, Monterrey, Mexico City ' }, { value: -5, label: '(UTC-5:00) Bogota, Lima, Quito, Indiana' }, { value: -4, label: '(UTC-4:00) Atlantic Time (Canada), Manaus ' }, { value: -3, label: '(UTC-3:00) Brasilia, Buenos Aires, Cayenne' }, { value: -2, label: '(UTC-2:00) Mid-Atlantic' }, { value: -1, label: '(UTC-1:00) Azores, Cape Verde Is.' }, { value: 0, label: '(UTC 0:00) Dublin, Lisbon, London, Reykjavik' }, { value: +1, label: '(UTC+1:00) Amsterdam, Berlin, Rome, Paris, Prague, Skopje ' }, { value: +2, label: '(UTC+2:00) Athens, Istanbul, Cairo, Helsinki, Kyiv, Vilnius ' }, { value: +3, label: '(UTC+3:00) Baghdad, Kuwait, Moscow, St. Petersburg, Nairobi' }, { value: +4, label: '(UTC+4:00) Abu Dhabi, Baku, Muscat' }, { value: +5, label: '(UTC+5:00) Ekaterinburg, Karachi, Tashkent' }, { value: +6, label: '(UTC+6:00) Astana, Dhaka, Novosibirsk' }, { value: +7, label: '(UTC+7:00) Bangkok, Hanoi, Jakarta' }, { value: +8, label: '(UTC+8:00) Beijing, Hong Kong, Kuala Lumpur, Perth, Taipei' }, { value: +9, label: '(UTC+9:00) Sapporo, Tokyo, Seoul' }, { value: +10, label: '(UTC+10:00) Brisbane, Melbourne, Sydney' }, { value: +11, label: '(UTC+11:00) Magadan, Solomon Is.' }, { value: +12, label: '(UTC+12:00) Auckland, Fiji' }]).attributes({ placeholder: 'Select Timezone' }).validation({ required: true }).label('Timezone'), nga.field('get_messages', 'choice').choices([{ value: false, label: 'Disabled' }, { value: true, label: 'Enabled' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Get messages'), nga.field('get_ads', 'choice').defaultValue(false).choices([{ value: false, label: 'Disabled' }, { value: true, label: 'Enabled' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Receive ads'), nga.field('show_adult', 'choice').choices([{ value: false, label: 'Disabled' }, { value: true, label: 'Enabled' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Show adult content'), nga.field('auto_timezone', 'choice').choices([{ value: true, label: 'Enabled' }, { value: false, label: 'Disabled' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Auto Timezone'), nga.field('account_lock', 'choice').choices([{ value: false, label: 'Disabled' }, { value: true, label: 'Enabled' }]).attributes({ placeholder: 'Choose from dropdown list' }).label('Account Locked').validation({ required: true }), nga.field('beta_user', 'choice').choices([{ value: false, label: 'Disabled' }, { value: true, label: 'Enabled' }]).attributes({ placeholder: 'Choose from dropdown list' }).label('Is tester').validation({ required: true }), nga.field('template').label('').template(_edit_buttonHtml2['default']), nga.field('Subscriptions', 'referenced_list').label('Subscription').targetEntity(admin.getEntity('Subscriptions')).targetReferenceField('login_id').targetFields([nga.field('package_id', 'reference').targetEntity(admin.getEntity('Packages')).targetField(nga.field('package_name')).isDetailLink(false).label('Package'), nga.field('package_id', 'reference').targetEntity(admin.getEntity('Packages')).targetField(nga.field('package_type_id').map(function truncate(value) {
	        if (value === 1) {
	            return 'Live big screen';
	        } else if (value === 2) {
	            return 'Live small screen';
	        } else if (value === 3) {
	            return 'Vod big screen';
	        } else if (value === 4) {
	            return 'Vod small screen';
	        }
	    })).isDetailLink(false).label('Package Type'), nga.field('start_date', 'date').cssClasses('hidden-xs').template(function (entry) {
	        var moment = new Date().toISOString().slice(0, 10);
	        var ng_vlera_start = new Date(entry.values.start_date).toISOString().slice(0, 10);
	        var ng_vlera_end = new Date(entry.values.end_date).toISOString().slice(0, 10);
	        if (moment >= ng_vlera_start && moment <= ng_vlera_end) {
	            return ng_vlera_start.fontcolor("green");
	        } else {
	            return ng_vlera_start.fontcolor("red").bold();
	        }
	    }).label('Start date'), nga.field('end_date', 'date').cssClasses('hidden-xs').template(function (entry) {
	        var moment = new Date().toISOString().slice(0, 10);
	        var ng_vlera_start = new Date(entry.values.start_date).toISOString().slice(0, 10);
	        var ng_vlera_end = new Date(entry.values.end_date).toISOString().slice(0, 10);
	        if (moment >= ng_vlera_start && moment <= ng_vlera_end) {
	            return ng_vlera_end.fontcolor("green");
	        } else {
	            return ng_vlera_end.fontcolor("red").bold();
	        }
	    }).label('End date')]), nga.field('').label('').template('<ma-create-button entity-name="MySubscription" class="pull-right" label="ADD SUBSCRIPTION" default-values="{ login_id: entry.values.id }"></ma-create-button>'), nga.field('Devices', 'referenced_list').label('Devices').targetEntity(admin.getEntity('Devices')).targetReferenceField('login_data_id').targetFields([nga.field('login_data_id', 'reference').targetEntity(admin.getEntity('LoginData')).targetField(nga.field('username')).isDetailLink(false).label('Account'), nga.field('device_ip').cssClasses('hidden-xs').label('Device IP'), nga.field('appid').cssClasses('hidden-xs').label('App ID'), nga.field('app_version').cssClasses('hidden-xs').label('App Version'), nga.field('ntype').cssClasses('hidden-xs').label('Ntype'), nga.field('updatedAt', 'date').cssClasses('hidden-xs').label('Last Updated'), nga.field('device_brand').cssClasses('hidden-xs').label('Device Brand'), nga.field('device_active', 'boolean').label('Device Active')]).listActions(['edit']), nga.field('MySales', 'referenced_list').label('Sale Reports').targetEntity(nga.entity('MySales')).targetReferenceField('login_data_id').targetFields([nga.field('user_id', 'reference').targetEntity(admin.getEntity('Users')).targetField(nga.field('username')).cssClasses('hidden-xs').isDetailLink(false).label('User'), nga.field('on_behalf_id', 'reference').targetEntity(admin.getEntity('Users')).targetField(nga.field('username')).cssClasses('hidden-xs').isDetailLink(false).label('On Behalf of'), nga.field('saledate', 'date').cssClasses('hidden-xs').label('Sale Date'), nga.field('combo_id', 'reference').targetEntity(admin.getEntity('Combos')).targetField(nga.field('name')).isDetailLink(false).label('Product')]).listActions(['<ma-edit-button entry="entry" entity="entity" label="Cancel Subscription" size="xs"></ma-edit-button><download-invoice post="entry"></download-invoice>']),
	    //hidden field
	    nga.field('livetvlastchange', 'datetime').cssClasses('hidden').editable(false).label(''), nga.field('updatelivetvtimestamp', 'boolean').cssClasses('hidden').editable(true).validation({ required: false }).label(''), nga.field('vodlastchange', 'datetime').cssClasses('hidden').editable(false).label(''), nga.field('updatevodtimestamp', 'boolean').cssClasses('hidden').editable(true).validation({ required: false }).label('')
	    //./hidden field
	    ]);

	    return ResellersLoginData;
	};

	module.exports = exports['default'];

/***/ },
/* 145 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	//import foto from '../foto.html';

	exports['default'] = function (nga, admin) {
	    var VodEpisode = admin.getEntity('VodEpisode');
	    VodEpisode.listView().title('<h4>Episode <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions(['<vod type="update_film" selection="selection"></vod>']).actions(['batch', 'export', 'filter', 'create']).fields([nga.field('title', 'string').label('Title'), nga.field('expiration_time', 'datetime').label('Expiration Time'), nga.field('duration', 'number').cssClasses('hidden-xs').label('Duration'), nga.field('icon_url', 'file').template('<img src="{{ entry.values.icon_url }}" height="35" width="35" />').cssClasses('hidden-xs').label('Icon'), nga.field('is_available', 'boolean').cssClasses('hidden-xs').label('Available'), nga.field('createdAt', 'date').cssClasses('hidden-xs').label('Created at'), nga.field('pin_protected', 'boolean').cssClasses('hidden-xs').label('Pin Protected')]).sortDir("DESC").sortField("createdAt").filters([nga.field('tv_show_title').label('Tv show'), nga.field('season_number', 'number').label('Season number'), nga.field('expiration_time', 'datetime').label('Expiration Time'), nga.field('title').label('Title'), nga.field('pin_protected', 'choice').choices([{ value: 0, label: 'False' }, { value: 1, label: 'True' }]).attributes({ placeholder: 'Pin Protected' }).label('Pin Protected'), nga.field('added_before', 'datetime').label('Added before'), nga.field('added_after', 'datetime').label('Added after'), nga.field('updated_before', 'date').label('Last updated before'), nga.field('updated_after', 'date').label('Last updated after'), nga.field('is_available', 'boolean').filterChoices([{ value: true, label: 'Available' }, { value: false, label: 'Not Available' }]).label('Available'), nga.field('q').label('').template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>').pinned(true)]).listActions(['edit']).exportFields([VodEpisode.listView().fields()]);

	    VodEpisode.deletionView().title('<h4>Episode <i class="fa fa-angle-right" aria-hidden="true"></i> Remove <span style ="color:red;"> {{ entry.values.title }}').actions(['<ma-back-button entry="entry" entity="entity"></ma-back-button>']);

	    VodEpisode.creationView().title('<h4>Episode <i class="fa fa-angle-right" aria-hidden="true"></i> Create: Episode</h4>').onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
	        progression.done();
	        $state.go($state.get('edit'), { entity: entity.name(), id: entry._identifierValue });
	        return false;
	    }]).fields([nga.field('title', 'string').attributes({ placeholder: 'Episode Name' }).validation({ required: true }).label('Title'), nga.field('imdb_id', 'string').attributes({ placeholder: 'Episode Imdb Id' }).defaultValue(0).template('<ma-input-field field="field" value="entry.values.imdb_id"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">*This Id should either be left empty, or match exactly the Imdb Id</small>').label('Movie Imdb Id'), nga.field('tv_show_id', 'reference').targetEntity(admin.getEntity('Series')).targetField(nga.field('title')).attributes({ placeholder: 'Select the TV Shows name from the dropdown list ' }).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select TV Shows Name');
	            }
	        }
	    }).label('TV Shows Name *'), nga.field('season_number', 'number').attributes({ placeholder: 'Season Number' }).validation({ required: true }).label('Season Number'), nga.field('episode_number', 'number').attributes({ placeholder: 'Episode Number' }).validation({ required: true }).label('Episode Number'), nga.field('director', 'string').attributes({ placeholder: 'Episode Director' }).validation({ required: true }).label('Director'), nga.field('rate', 'number').attributes({ placeholder: 'Episode rated. Must be greater than 0, smaller or equal to 10' }).validation({ required: true, validator: function validator(value) {
	            if (value <= 0) throw new Error('Rate must be greater than 0');
	            if (value > 10) throw new Error('Rate cannot be greater than 10');
	        } }).label('Rate'), nga.field('clicks', 'number').attributes({ placeholder: 'Episode clicks' }).validation({ required: true }).label('Clicks'), nga.field('duration').validation({ required: true }).attributes({ placeholder: 'Duration of movie in minutes' }).label('Duration'), nga.field('description', 'text').transform(function lineBreaks(value, entry) {
	        return value.split("\n").join("<br/>");
	    }).attributes({ placeholder: 'Episode Subject' }).validation({ required: true, maxlength: 1000 }).label('Description'), nga.field('cast', 'text').transform(function lineBreak(value, entry) {
	        return value.split("\n").join("<br/>");
	    }).attributes({ placeholder: 'Episode actors' }).validation({ required: true, maxlength: 1000 }).label('Starring'), nga.field('trailer_url', 'string').defaultValue('').attributes({ placeholder: 'Trailer url' }).label('Trailer url'), nga.field('vod_preview_url', 'file').uploadInformation({ 'url': '/file-upload/single-file/video_scrubbing_url/vod_preview_url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.vod_preview_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.vod_preview_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">Not larger than 1MB</small></div>').defaultValue('').validation({
	        validator: function validator(value) {
	            var vod_preview_url = document.getElementById('vod_preview_url');
	            if (vod_preview_url.value.length > 0) {
	                if (vod_preview_url.files[0].size > 1048576) {
	                    throw new Error('Your File of Video scrubbing url is too Big, not larger than 1MB');
	                }
	            }
	        }
	    }).label('Video scrubbing url'), nga.field('icon_url', 'file').uploadInformation({ 'url': '/file-upload/single-file/vod/icon_url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.icon_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.icon_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">360x516 px, not larger than 150 KB</small></div>').validation({
	        validator: function validator(value) {
	            if (value == null) {
	                throw new Error('Please, choose icon');
	            } else {
	                var icon_url = document.getElementById('icon_url');
	                if (icon_url.value.length > 0) {
	                    if (icon_url.files[0].size > 153600) {
	                        throw new Error('Your Icon is too Big, not larger than 150 KB');
	                    }
	                }
	            }
	        }
	    }).label('Icon *'), nga.field('image_url', 'file').uploadInformation({ 'url': '/file-upload/single-file/vod/image_url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.image_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.image_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">1920x1200 px, not larger than 600 KB</small></div>').validation({
	        validator: function validator(value) {
	            if (value == null) {
	                throw new Error('Please, choose image');
	            } else {
	                var image_url = document.getElementById('image_url');
	                if (image_url.value.length > 0) {
	                    if (image_url.files[0].size > 614400) {
	                        throw new Error('Your Image is too Big, not larger than 600 KB');
	                    }
	                }
	            }
	        }
	    }).label('Image *'), nga.field('adult_content', 'choice').defaultValue(false).choices([{ value: true, label: 'Yes' }, { value: false, label: 'No' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Has adult content'), nga.field('pin_protected', 'boolean').attributes({ placeholder: 'Pin Protected' }).validation({ required: true }).label('Pin Protected'), nga.field('is_available', 'boolean').attributes({ placeholder: 'Is Available' }).validation({ required: true }).label('Is Available'), nga.field('expiration_time', 'datetime').validation({ required: true }).defaultValue(new Date()).label('Expiration date'), nga.field('mandatory_ads', 'choice').defaultValue(false).choices([{ value: true, label: 'Enabled' }, { value: false, label: 'Disabled' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Mandatory ads'), nga.field('revenue', 'number').defaultValue(0).label('Revenues'), nga.field('budget', 'number').defaultValue(0).label('Budget'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    VodEpisode.editionView().title('<h4>Episode <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.title }}</h4>').actions(['list', 'create', '<ma-delete-button label="Remove" entry="entry" entity="entity"></ma-delete-button>']).onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
	        progression.done();
	        notification.log('Changes successfully saved', { addnCls: 'humane-flatty-success' });
	        $state.go($state.get('list'), { entity: entity.name() });
	        return false;
	    }]).fields([
	    //creation view fields
	    nga.field('title', 'string').attributes({ placeholder: 'Episode Name' }).validation({ required: true }).label('Title'), nga.field('imdb_id', 'string').attributes({ placeholder: 'Episode Imdb Id' }).defaultValue(0).template('<ma-input-field field="field" value="entry.values.imdb_id"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">*This Id should either be left empty, or match exactly the Imdb Id</small>').label('Movie Imdb Id'), nga.field('tv_season.tv_sery.tv_show_id', 'reference').targetEntity(admin.getEntity('Series')).targetField(nga.field('title')).attributes({ placeholder: 'Select the TV Shows name from the dropdown list ' }).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select TV Shows Name');
	            }
	        }
	    }).label('TV Shows Name *'), nga.field('season_number', 'number').attributes({ placeholder: 'Season Number' }).validation({ required: true }).label('Season Number'), nga.field('episode_number', 'number').attributes({ placeholder: 'Episode Number' }).validation({ required: true }).label('Episode Number'), nga.field('director', 'string').attributes({ placeholder: 'Episode Director' }).validation({ required: true }).label('Director'), nga.field('rate', 'number').attributes({ placeholder: 'Episode rated. Must be greater than 0, smaller or equal to 10' }).validation({ required: true, validator: function validator(value) {
	            if (value <= 0) throw new Error('Rate must be greater than 0');
	            if (value > 10) throw new Error('Rate cannot be greater than 10');
	        } }).label('Rate'), nga.field('clicks', 'number').attributes({ placeholder: 'Episode clicks' }).validation({ required: true }).label('Clicks'), nga.field('duration').validation({ required: true }).attributes({ placeholder: 'Duration of movie in minutes' }).label('Duration'), nga.field('description', 'text').transform(function lineBreaks(value, entry) {
	        return value.split("\n").join("<br/>");
	    }).attributes({ placeholder: 'Episode Subject' }).validation({ required: true, maxlength: 1000 }).label('Description'), nga.field('cast', 'text').transform(function lineBreak(value, entry) {
	        return value.split("\n").join("<br/>");
	    }).attributes({ placeholder: 'Episode actors' }).validation({ required: true, maxlength: 1000 }).label('Starring'), nga.field('trailer_url', 'string').defaultValue('').attributes({ placeholder: 'Trailer url' }).label('Trailer url'), nga.field('vod_preview_url', 'file').uploadInformation({ 'url': '/file-upload/single-file/video_scrubbing_url/vod_preview_url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.vod_preview_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.vod_preview_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">Not larger than 1MB</small></div>').defaultValue('').validation({
	        validator: function validator(value) {
	            var vod_preview_url = document.getElementById('vod_preview_url');
	            if (vod_preview_url.value.length > 0) {
	                if (vod_preview_url.files[0].size > 1048576) {
	                    throw new Error('Your File of Video scrubbing url is too Big, not larger than 1MB');
	                }
	            }
	        }
	    }).label('Video scrubbing url'), nga.field('icon_url', 'file').uploadInformation({ 'url': '/file-upload/single-file/vod/icon_url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.icon_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.icon_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">360x516 px, not larger than 150 KB</small></div>').validation({
	        validator: function validator(value) {
	            if (value == null) {
	                throw new Error('Please, choose icon');
	            } else {
	                var icon_url = document.getElementById('icon_url');
	                if (icon_url.value.length > 0) {
	                    if (icon_url.files[0].size > 153600) {
	                        throw new Error('Your Icon is too Big, not larger than 150 KB');
	                    }
	                }
	            }
	        }
	    }).label('Icon *'), nga.field('image_url', 'file').uploadInformation({ 'url': '/file-upload/single-file/vod/image_url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.image_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.image_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">1920x1200 px, not larger than 600 KB</small></div>').validation({
	        validator: function validator(value) {
	            if (value == null) {
	                throw new Error('Please, choose image');
	            } else {
	                var image_url = document.getElementById('image_url');
	                if (image_url.value.length > 0) {
	                    if (image_url.files[0].size > 614400) {
	                        throw new Error('Your Image is too Big, not larger than 600 KB');
	                    }
	                }
	            }
	        }
	    }).label('Image *'), nga.field('adult_content', 'choice').defaultValue(false).choices([{ value: true, label: 'Yes' }, { value: false, label: 'No' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Has adult content'), nga.field('pin_protected', 'boolean').attributes({ placeholder: 'Pin Protected' }).validation({ required: true }).label('Pin Protected'), nga.field('is_available', 'boolean').attributes({ placeholder: 'Is Available' }).validation({ required: true }).label('Is Available'), nga.field('expiration_time', 'datetime').validation({ required: true }).defaultValue(new Date()).label('Expiration date'), nga.field('mandatory_ads', 'choice').defaultValue(false).choices([{ value: true, label: 'Enabled' }, { value: false, label: 'Disabled' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Mandatory ads'), nga.field('revenue', 'number').defaultValue(0).label('Revenues'), nga.field('budget', 'number').defaultValue(0).label('Budget'),
	    //default subtitle field is exclusive to the edition view
	    nga.field('default_subtitle_id', 'choice').choices(function (entry) {
	        var no_sub_object = { value: 0, label: "No default subtitles", selected: true };
	        entry.values.tv_episode_subtitles.unshift(no_sub_object);
	        return entry.values.tv_episode_subtitles;
	    }).label('Default subtitles'), nga.field('template').label('').template(_edit_buttonHtml2['default']), nga.field('tv_episode_subtitles', 'referenced_list').label('Subtitles').targetEntity(admin.getEntity('tv_episode_subtitles')).targetReferenceField('tv_episode_id').targetFields([nga.field('title').label('Language')]).listActions(['edit', 'delete']), nga.field('ADD SUBTITLES', 'template').label('').template('<ma-create-button entity-name="tv_episode_subtitles" class="pull-right" label="ADD SUBTITLES" default-values="{ tv_episode_id: entry.values.id }"></ma-create-button>'), nga.field('tv_episode_url', 'referenced_list').label('Stream url Sources').targetEntity(admin.getEntity('tv_episode_stream')).targetReferenceField('tv_episode_id').targetFields([nga.field('tv_episode_url').label('Episode URL')]).listActions(['edit', 'delete']), nga.field('ADD STREAM', 'template').label('').template('<ma-create-button entity-name="tv_episode_stream" class="pull-right" label="ADD STREAM" default-values="{ tv_episode_id: entry.values.id }"></ma-create-button>')]);

	    return VodEpisode;
	};

	module.exports = exports['default'];

/***/ },
/* 146 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	    var tv_episode_subtitles = admin.getEntity('tv_episode_subtitles');
	    tv_episode_subtitles.listView().title('<h4>Episode Subtitles <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('tv_episode_id', 'reference').targetEntity(admin.getEntity('VodEpisode')).targetField(nga.field('title')).label('Episode'), nga.field('title', 'string').label('Title'), nga.field('subtitle_url', 'string').map(function truncate(value) {
	        if (!value) {
	            return '';
	        }
	        return value.length > 25 ? value.substr(0, 25) + '...' : value;
	    }).label('Subtitle Url')]).filters([nga.field('q').label('').template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>').pinned(true)]).listActions(['edit']).exportFields([tv_episode_subtitles.listView().fields()]);

	    tv_episode_subtitles.deletionView().title('<h4>Channel Streams <i class="fa fa-angle-right" aria-hidden="true"></i> Remove <span style ="color:red;"> {{entry.values.title}}').actions(['<ma-back-button entry="entry" entity="entity"></ma-back-button>']);

	    tv_episode_subtitles.creationView().title('<h4>Episode Subtitles <i class="fa fa-angle-right" aria-hidden="true"></i> Create: Episode Subtitles</h4>').onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
	        progression.done();
	        $state.go($state.get('edit'), { entity: 'VodEpisode', id: entry.values.tv_episode_id });

	        return false;
	    }]).fields([nga.field('tv_episode_id', 'reference').targetEntity(admin.getEntity('VodEpisode')).targetField(nga.field('title')).attributes({ placeholder: 'Select Episode from dropdown list' }).validation({ required: true }).perPage(-1).label('Episode'), nga.field('title').attributes({ placeholder: 'Specify the subtitles title' }).validation({ required: true }).label('Title'), nga.field('subtitle_url', 'file').uploadInformation({ 'url': '/file-upload/single-file/subtitles/subtitle_url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.subtitle_url"></ma-file-field></div>' + '<div class="col-xs-12 col-sm-1" style="display: none;"><img src="{{ entry.values.subtitle_url }}"/></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">Please, make sure the subtitle file is correctly encoded</small></div>').label('File input *').validation({ required: true }).label('URL'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    tv_episode_subtitles.editionView().title('<h4>Episode Subtitles <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.tv_episode_id }}</h4>').actions(['list', 'delete']).fields([tv_episode_subtitles.creationView().fields()]);

	    return tv_episode_subtitles;
	};

	module.exports = exports['default'];

/***/ },
/* 147 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	    var tv_episode_stream = admin.getEntity('tv_episode_stream');
	    tv_episode_stream.listView().title('<h4>Episode Streams <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('tv_episode_id', 'reference').targetEntity(admin.getEntity('VodEpisode')).targetField(nga.field('title')).label('Episode'), nga.field('stream_source_id', 'reference').targetEntity(admin.getEntity('VodStreamSources')).targetField(nga.field('description')).label('Stream Source'), nga.field('tv_episode_url', 'string')
	    // .map(function truncate(value) {
	    // 	if (!value) {
	    //            return '';
	    //      	}
	    //            return value.length > 25 ? value.substr(0, 25) + '...' : value;
	    //      	})
	    .label('Url'), nga.field('token', 'boolean').label('Token'), nga.field('encryption', 'boolean').label('Encryption'), nga.field('token_url', 'string').label('Token Url')]).listActions(['edit']).exportFields([tv_episode_stream.listView().fields()]);

	    tv_episode_stream.deletionView().title('<h4>Episode Streams <i class="fa fa-angle-right" aria-hidden="true"></i> Remove <span style ="color:red;"> Episode Streams').actions(['<ma-back-button entry="entry" entity="entity"></ma-back-button>']);

	    tv_episode_stream.creationView().title('<h4>Episode Streams <i class="fa fa-angle-right" aria-hidden="true"></i> Create: Episode Stream</h4>').onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
	        progression.done();
	        $state.go($state.get('edit'), { entity: 'VodEpisode', id: entry.values.tv_episode_id });
	        return false;
	    }]).fields([nga.field('tv_episode_id', 'reference').targetEntity(admin.getEntity('VodEpisode')).targetField(nga.field('title')).attributes({ placeholder: 'Choose from dropdown list of Episodes' }).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select Episode');
	            }
	        }
	    }).perPage(-1).label('Episode *'), nga.field('stream_source_id', 'reference').targetEntity(admin.getEntity('VodStreamSources')).targetField(nga.field('description')).attributes({ placeholder: 'Stream Source' }).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select Stream Source');
	            }
	        }
	    }).perPage(-1).label('Stream Source *'), nga.field('tv_episode_url', 'string').attributes({ placeholder: 'Episode Stream Url' }).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select Url');
	            }
	        }
	    }).label('Url *'), nga.field('stream_resolution', 'choices').attributes({ placeholder: 'Select screen types where this stream should play' }).choices([{ value: 1, label: 'Android Set Top Box' }, { value: 2, label: 'Android Smart Phone' }, { value: 3, label: 'IOS' }, { value: 4, label: 'Android Smart TV' }, { value: 5, label: 'Samsung Smart TV' }, { value: 6, label: 'Apple TV' }]).defaultValue([1, 2, 3, 4, 5, 6]).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select Stream resolution');
	            }
	        }
	    }).label('Stream resolution *'), nga.field('stream_format', 'choice').attributes({ placeholder: 'Stream Format' }).choices([{ value: 0, label: 'MPEG Dash' }, { value: 1, label: 'Smooth Streaming' }, { value: 2, label: 'HLS' }, { value: 3, label: 'OTHER' }]).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select Stream Format');
	            }
	        }
	    }).label('Stream Format *'), nga.field('token', 'boolean').attributes({ placeholder: 'Token' }).validation({ required: true }).label('Token'), nga.field('token_url', 'string').defaultValue('Token Url').attributes({ placeholder: 'Token Url' }).validation({ required: true }).label('Token Url'), nga.field('encryption', 'boolean').validation({ required: true }).label('Encryption'), nga.field('encryption_url', 'string').defaultValue('Encryption url').validation({ required: true }).label('Encryption url'), nga.field('drm_platform', 'choice').attributes({ placeholder: 'Select from dropdown list' }).defaultValue('none').choices([{ value: 'none', label: 'None' }, { value: 'pallycon', label: 'Pallycon' }, { value: 'verimatrix', label: 'Verimatrix' }, { value: 'widevine', label: 'Widevine' }]).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select DRM Platform');
	            }
	        }
	    }).label('DRM Platform *'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    tv_episode_stream.editionView().title('<h4>Episode Streams <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.tv_episode_id }}</h4>').actions(['list', 'delete']).fields([tv_episode_stream.creationView().fields()]);

	    return tv_episode_stream;
	};

	module.exports = exports['default'];

/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	    var Submenu = admin.getEntity('Submenu');
	    var appids = { 1: 'Android Set Top Box', 2: 'Android Smart Phone', 3: 'IOS', 4: 'Android Smart TV', 5: 'Samsung Smart TV', 6: 'Apple TV' };

	    Submenu.listView().title('<h4>Submenu <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('icon_url', 'file').template('<img src="{{ entry.values.icon_url }}" height="42" width="45" />').cssClasses('hidden-xs').label('Icon'), nga.field('title', 'string').isDetailLink(true).label('Title'), nga.field('url').map(function truncate(value) {
	        if (!value) {
	            return '';
	        }
	        return value.length > 25 ? value.substr(0, 25) + '...' : value;
	    }).cssClasses('hidden-xs').label('Url'), nga.field('menu_code', 'choice').attributes({ placeholder: 'Menu Code' }).choices([{ value: 0, label: 'Url' }, { value: 1, label: 'Live TV' }, { value: 2, label: 'EPG' }, { value: 3, label: 'Logout' }, { value: 4, label: 'Apps' }, { value: 10, label: 'Network Test' }, { value: 11, label: 'Vod' }, { value: 12, label: 'Application menu' }, { value: 20, label: 'Personal' }, { value: 21, label: 'Catchup' }]).validation({ required: true }).label('Menu Code'), nga.field('position', 'string').label('Position'), nga.field('appid', 'template').map(function toarray(value) {
	        var thearray = JSON.parse("[" + value + "]");
	        var returnobj = {};
	        thearray.forEach(function (element) {
	            returnobj[element] = appids[element];
	        });
	        return returnobj;
	    }).template('<span ng-repeat="theappid in entry.values.appid track by $index" class="label label-default">{{theappid}}</span>').label('Applications IDs'), nga.field('isavailable', 'boolean').label('Available')]).filters([nga.field('q').label('').template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>').pinned(true)]).listActions(['edit', 'delete']).exportFields([Submenu.listView().fields()]);

	    Submenu.creationView().onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
	        progression.done();
	        $state.go($state.get('list'), { entity: entity.name() });
	        return false;
	    }]).title('<h4>Submenu <i class="fa fa-angle-right" aria-hidden="true"></i> Create: Menu</h4>').fields([nga.field('title', 'string').attributes({ placeholder: 'Name menu item' }).validation({ required: true }).label('Title'), nga.field('url', 'string').attributes({ placeholder: 'In case you are adding an external application (for example youtube) fill the application url.' }).label('Url'), nga.field('icon_url', 'file').uploadInformation({ 'url': '/file-upload/single-file/device_menu/icon_url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.icon_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.icon_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">240x240 px, not larger than 600 KB</small></div>').validation({
	        validator: function validator(value) {
	            if (value == null) {
	                throw new Error('Please, choose icon');
	            } else {
	                var icon_url = document.getElementById('icon_url');
	                if (icon_url.value.length > 0) {
	                    if (icon_url.files[0].size > 614400) {
	                        throw new Error('Your Icon is too Big, not larger than 600 KB');
	                    }
	                }
	            }
	        }
	    }).label('Icon *'), nga.field('menu_code', 'choice').attributes({ placeholder: 'Choose from dropdown list the type of menu item you are creating' }).choices([{ value: 0, label: 'Url' }, { value: 1, label: 'Live TV' }, { value: 2, label: 'EPG' }, { value: 3, label: 'Logout' }, { value: 4, label: 'Apps' }, { value: 10, label: 'Network Test' }, { value: 11, label: 'Vod' }, { value: 12, label: 'Application menu' }, { value: 20, label: 'Personal' }, { value: 21, label: 'Catchup' }]).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select Menu Code');
	            }
	        }
	    }).label('Menu Code *'), nga.field('appid', 'choices').attributes({ placeholder: 'Choose from dropdown list the device application this menu will belong to' }).choices([{ value: 1, label: 'Android Set Top Box' }, { value: 2, label: 'Android Smart Phone' }, { value: 3, label: 'IOS' }, { value: 4, label: 'Android Smart TV' }, { value: 5, label: 'Samsung Smart TV' }, { value: 6, label: 'Apple TV' }]).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select Applications IDs');
	            }
	        }
	    }).label('Applications IDs *'), nga.field('position', 'string').attributes({ placeholder: 'Position of this menu item in main menu ex:if you place number 1 this menu item will be the first one in main menu' }).validation({ required: true }).label('Position'), nga.field('isavailable', 'boolean').attributes({ placeholder: 'Is Available' }).validation({ required: true }).label('Is Available'), nga.field('parent_id', 'reference').targetEntity(admin.getEntity('DeviceMenus')).targetField(nga.field('title')).attributes({ placeholder: 'Choose from dropdown list the parent that this menu will belong to' }).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select Parent ID');
	            }
	        }
	    }).label('Parent ID *'), nga.field('menu_description').attributes({ placeholder: 'Menu Description' }).validation({ required: true }).label('Menu Description'), nga.field('menu_level').defaultValue(2).cssClasses('hidden').label(''), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    Submenu.editionView().title('<h4>Submenu <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.title }}</h4>').actions(['list']).fields([Submenu.creationView().fields()]);

	    return Submenu;
	};

	module.exports = exports['default'];

/***/ },
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	    var AdvancedSettings = admin.getEntity('AdvancedSettings');

	    AdvancedSettings.listView().title('<h4>Advanced Settings <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').actions([]).batchActions([]).fields([nga.field('id').label('ID'), nga.field('parameter_id').label('Parameter ID'), nga.field('parameter_value').label('Parameter'), nga.field('parameter1_value').label('Parameter 1'), nga.field('parameter2_value').label('Parameter 2'), nga.field('duration').label('Duration'), nga.field('description', 'text').label('Description')]).listActions(['edit']);

	    AdvancedSettings.editionView().title('<h4>Advanced Settings <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.id }}</h4>').fields([nga.field('parameter_id').attributes({ readOnly: true }).validation({ required: true }).label('Parameter ID'), nga.field('parameter_value').validation({ required: true }).label('Parameter'), nga.field('parameter1_value').label('Parameter 1'), nga.field('parameter2_value').label('Parameter 2'), nga.field('duration', 'number').label('Duration'), nga.field('description', 'text').attributes({ placeholder: 'Usage Description' }).validation({ maxlength: 1000 }).label('Description'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    AdvancedSettings.editionView().actions(['list']).title('<h4>Advanced Settings <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.id }}</h4>').fields([AdvancedSettings.creationView().fields()]);

	    AdvancedSettings.deletionView().title('<h4>Advanced Settings <i class="fa fa-angle-right" aria-hidden="true"></i> Remove <span style ="color:red;"> {{ entry.values.id }}').actions(['<ma-back-button entry="entry" entity="entity"></ma-back-button>']);

	    return AdvancedSettings;
	};

	module.exports = exports['default'];

/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	//import set from './setting.html';

	exports['default'] = function (nga, admin) {
	    var PlayerSettings = admin.getEntity('PlayerSettings');
	    PlayerSettings.listView().batchActions([]).fields([nga.field('activity_timeout', 'number').attributes({ placeholder: 'Activity Timeout' }).template('<div class="form-group">' + '<ma-input-field field="field" value="entry.values.activity_timeout"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">If there is no activity for this time then application will return to main menu. Default value 3 hr</small>' + '</div>').label('Activity Time Out'), nga.field('log_event_interval', 'number').attributes({ placeholder: 'Log event interval' }).template('<div class="form-group">' + '<ma-input-field field="field" value="entry.values.log_event_interval"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">Frequency to send audience logs.</small>' + '</div>').label('Log event interval'), nga.field('channel_log_time', 'number').attributes({ placeholder: 'Channel log time' }).template('<div class="form-group">' + '<ma-input-field field="field" value="entry.values.channel_log_time"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">Timeout to define a channel as not able to play.</small>' + '</div>').label('Channel log time'), nga.field('vod_subset_nr', 'number').template('<div class="form-group">' + '<ma-input-field field="field" value="entry.values.vod_subset_nr"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">Number of movies sent in each vod request</small>' + '</div>').label('Vod movies / request'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    PlayerSettings.editionView().title('<h4><i class="fa fa-angle-right" aria-hidden="true"></i> Player Settings</h4>').actions(['']).onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
	        progression.done(); // stop the progress bar
	        notification.log('Element #' + entry._identifierValue + ' successfully edited.', { addnCls: 'humane-flatty-success' }); // add a notification
	        // redirect to the list view
	        $state.go($state.current, {}, { reload: true }); // cancel the default action (redirect to the edition view)
	        return false;
	    }]).fields([PlayerSettings.listView().fields()]);

	    return PlayerSettings;
	};

	module.exports = exports['default'];

/***/ },
/* 151 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	//import set from './setting.html';

	exports['default'] = function (nga, admin) {
	    var ImagesSettings = admin.getEntity('ImagesSettings');
	    ImagesSettings.listView().batchActions([]).fields([nga.field('box_logo_url', 'file').label('Box Logo').template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.box_logo_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.box_logo_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">1988x318 px,not larger than 600 KB</small></div>').uploadInformation({ 'url': '/file-upload/single-file/settings/box_logo_url', 'apifilename': 'result' }).validation({ required: true, validator: function validator() {
	            var box_logo_url = document.getElementById('box_logo_url');
	            if (box_logo_url.value.length > 0) {
	                if (box_logo_url.files[0].size > 614400) {
	                    throw new Error('Your Box Logo is too Big, not larger than 600 KB');
	                }
	            }
	        }
	    }), nga.field('box_background_url', 'file').label('Box Background').template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.box_background_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.box_background_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">1920x1080 px, not larger than 1.3 MB</small></div>').uploadInformation({ 'url': '/file-upload/single-file/settings/box_background_url', 'apifilename': 'result' }).validation({ required: true, validator: function validator() {
	            var box_background_url = document.getElementById('box_background_url');
	            if (box_background_url.value.length > 0) {
	                if (box_background_url.files[0].size > 1572864) {
	                    throw new Error('Your Box Background is too Big, not larger than 1.3 MB');
	                }
	            }
	        }
	    }), nga.field('mobile_background_url', 'file').label('Mobile Background').template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.mobile_background_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.mobile_background_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">566x318 px, not larger than 1 MB</small></div>').uploadInformation({ 'url': '/file-upload/single-file/settings/mobile_background_url', 'apifilename': 'result' }).validation({ required: true, validator: function validator() {
	            var mobile_background_url = document.getElementById('mobile_background_url');
	            if (mobile_background_url.value.length > 0) {
	                if (mobile_background_url.files[0].size > 1048576) {
	                    throw new Error('Your Mobile Background is too Big, not larger than 1 MB');
	                }
	            }
	        }
	    }), nga.field('mobile_logo_url', 'file').label('Mobile Logo').template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.mobile_logo_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.mobile_logo_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">240x38 px, not larger than 600 KB</small></div>').uploadInformation({ 'url': '/file-upload/single-file/settings/mobile_logo_url', 'apifilename': 'result' }).validation({ required: true, validator: function validator() {
	            var mobile_logo_url = document.getElementById('mobile_logo_url');
	            if (mobile_logo_url.value.length > 0) {
	                if (mobile_logo_url.files[0].size > 614400) {
	                    throw new Error('Your Mobile Logo is too Big, not larger than 600 KB');
	                }
	            }
	        }
	    }), nga.field('vod_background_url', 'file').label('VOD Background').template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.vod_background_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.vod_background_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">1920x1080 px, not larger than 1 MB</small></div>').uploadInformation({ 'url': '/file-upload/single-file/settings/vod_background_url', 'apifilename': 'result' }).validation({ required: true, validator: function validator() {
	            var vod_background_url = document.getElementById('vod_background_url');
	            if (vod_background_url.value.length > 0) {
	                if (vod_background_url.files[0].size > 1048576) {
	                    throw new Error('Your VOD Background is too Big, not larger than 1 MB');
	                }
	            }
	        }
	    }), nga.field('company_name', 'string').validation({ required: true }).label('Company name').template('<div class="form-group">' + '<ma-input-field field="field" value="entry.values.company_name"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">Set your company name (By default - MAGOWARE)</small>' + '</div>'), nga.field('company_logo', 'file').label('Company logo').template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.company_logo }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.company_logo"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">1920x1080 px, not larger than 1 MB</small></div>').uploadInformation({ 'url': '/file-upload/single-file/settings/company_logo', 'apifilename': 'result' }).validation({ required: true, validator: function validator() {
	            var company_logo = document.getElementById('company_logo');
	            if (company_logo.value.length > 0) {
	                if (company_logo.files[0].size > 1048576) {
	                    throw new Error('Your company logo is too Big, not larger than 1 MB');
	                }
	            }
	        }
	    }), nga.field('locale', 'string').validation({ required: true }).label('Locale').template('<div class="form-group">' + '<ma-input-field field="field" value="entry.values.locale"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">User interface language (not in use).</small>' + '</div>'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    ImagesSettings.editionView().title('<h4><i class="fa fa-angle-right" aria-hidden="true"></i> Images and Logos</h4>').actions(['']).onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
	        progression.done(); // stop the progress bar
	        notification.log('Element #' + entry._identifierValue + ' successfully edited.', { addnCls: 'humane-flatty-success' }); // add a notification
	        // redirect to the list view
	        $state.go($state.current, {}, { reload: true }); // cancel the default action (redirect to the edition view)
	        return false;
	    }]).fields([ImagesSettings.listView().fields()]);

	    return ImagesSettings;
	};

	module.exports = exports['default'];

/***/ },
/* 152 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	//import set from './setting.html';

	exports['default'] = function (nga, admin) {
	    var ApiKeys = admin.getEntity('ApiKeys');
	    ApiKeys.listView().batchActions([]).fields([nga.field('new_encryption_key').validation({ required: true, minlength: 16, maxlength: 16 }).label('New Encryption Key').template('<div class="form-group">' + '<ma-input-field field="field" value="entry.values.new_encryption_key"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">Key used to encrypt/decrypt token. 16 characters long</small>' + '</div>'), nga.field('key_transition', 'boolean').validation({ required: true }).label('Key Transition'), nga.field('firebase_key', 'text').validation({ required: true }).label('Firebase key'), nga.field('akamai_token_key', 'string').label('Akamai  token key'), nga.field('flussonic_token_key', 'string').label('Flussonic token key'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    ApiKeys.editionView().title('<h4><i class="fa fa-angle-right" aria-hidden="true"></i> Api Keys</h4>').actions(['']).onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
	        progression.done(); // stop the progress bar
	        notification.log('Element #' + entry._identifierValue + ' successfully edited.', { addnCls: 'humane-flatty-success' }); // add a notification
	        // redirect to the list view
	        $state.go($state.current, {}, { reload: true }); // cancel the default action (redirect to the edition view)
	        return false;
	    }]).fields([ApiKeys.listView().fields()]);

	    return ApiKeys;
	};

	module.exports = exports['default'];

/***/ },
/* 153 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	//import set from './setting.html';

	exports['default'] = function (nga, admin) {
	    var URL = admin.getEntity('URL');
	    URL.listView().batchActions([]).fields([nga.field('help_page', 'string').validation({ required: true }).label('Help and Support website').template('<div class="form-group">' + '<ma-input-field field="field" value="entry.values.help_page"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">Configure application help page (By default /help_and_support)</small>' + '</div>'), nga.field('online_payment_url', 'string').validation({ required: true }).label('Online payment web page').template('<div class="form-group">' + '<ma-input-field field="field" value="entry.values.online_payment_url"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">Configure web page for online payments from application</small>' + '</div>'), nga.field('assets_url', 'string').validation({ required: true }).label('Assets URL').template('<div class="form-group">' + '<ma-input-field field="field" value="entry.values.assets_url"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">URL to provide images through a CDN.</small>' + '</div>').attributes({ placeholder: 'Assets URL' }), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    URL.editionView().title('<h4><i class="fa fa-angle-right" aria-hidden="true"></i> URLs</h4>').actions(['']).onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
	        progression.done(); // stop the progress bar
	        notification.log('Element #' + entry._identifierValue + ' successfully edited.', { addnCls: 'humane-flatty-success' }); // add a notification
	        // redirect to the list view
	        $state.go($state.current, {}, { reload: true }); // cancel the default action (redirect to the edition view)
	        return false;
	    }]).fields([URL.listView().fields()]);

	    return URL;
	};

	module.exports = exports['default'];

/***/ },
/* 154 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	//import set from './setting.html';

	exports['default'] = function (nga, admin) {
	    var EmailSettings = admin.getEntity('EmailSettings');
	    EmailSettings.listView().batchActions([]).fields([nga.field('smtp_host').validation({ required: true }).label('Smtp host').template('<div class="form-group">' + '<ma-input-field field="field" value="entry.values.smtp_host"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">Smtp host and port (smtp_host:port)</small>' + '</div>').attributes({ placeholder: 'smtp.gmail.com:465' }), nga.field('email_username').validation({ required: true }).label('Email Username').template('<div class="form-group">' + '<ma-input-field field="field" value="entry.values.email_username"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">Username for outgoing smtp mail server.</small>' + '</div>').attributes({ placeholder: 'Username' }), nga.field('email_password', 'password').validation({ required: true }).label('Email Password').template('<div class="form-group">' + '<ma-input-field field="field" type="password" value="entry.values.email_password"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">Password for outgoing smtp mail server.</small>' + '</div>').attributes({ placeholder: 'Password' }), nga.field('smtp_secure', 'choice').defaultValue(true).choices([{ value: false, label: 'Disable secure connection with Smtp server' }, { value: true, label: 'Enable secure connection with Smtp server' }]).validation({ required: true }).template('<div class="form-group">' + '<ma-choice-field field="field" value="entry.values.smtp_secure"></ma-choice-field>' + '<small id="emailHelp" class="form-text text-muted">Consider your Smtp host configurations for this setting </small>' + '</div>').label('Secure connection'), nga.field('email_address').validation({ required: true }).label('Email Address').template('<div class="form-group">' + '<ma-input-field field="field" value="entry.values.email_address"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">Email address appearing in the email details.</small>' + '</div>').attributes({ placeholder: 'Address' }), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    EmailSettings.editionView().title('<h4><i class="fa fa-angle-right" aria-hidden="true"></i> Email Settings</h4>').actions(['']).onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
	        progression.done(); // stop the progress bar
	        notification.log('Element #' + entry._identifierValue + ' successfully edited.', { addnCls: 'humane-flatty-success' }); // add a notification
	        // redirect to the list view
	        $state.go($state.current, {}, { reload: true }); // cancel the default action (redirect to the edition view)
	        return false;
	    }]).fields([EmailSettings.listView().fields()]);

	    return EmailSettings;
	};

	module.exports = exports['default'];

/***/ },
/* 155 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	    var search_customer = admin.getEntity('search_customer');

	    search_customer.listView().title('<h4>Search Customers <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('username').label('Username'), nga.field('customer_datum.firstname').label('Firstname'), nga.field('customer_datum.lastname').label('Lastname'), nga.field('customer_datum.email').label('Email'), nga.field('customer_datum.address').label('Address'), nga.field('subscription_status').label('Subscription Status'), nga.field('').label('').template('<ma-create-button entity-name="MySubscription" class="pull-right" label="ADD SUBSCRIPTION" default-values="{ login_id: entry.values.id }"></ma-create-button>')]).filters([nga.field('q').label('').template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>').pinned(true), nga.field('firstname').label('firstname')]);
	    return search_customer;
	};

	module.exports = exports['default'];

/***/ },
/* 156 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	    var mysubscription = admin.getEntity('MySubscription');

	    mysubscription.creationView().title('<h4>Subscriptions <i class="fa fa-angle-right" aria-hidden="true"></i> Create: Subscription</h4>').fields([nga.field('login_id', 'reference').targetEntity(admin.getEntity('LoginData')).targetField(nga.field('username')).attributes({ placeholder: 'Choose Username from dropdown list' }).validation({ required: true }).perPage(-1).remoteComplete(true, {
	        refreshDelay: 300,
	        // populate choices from the response of GET /posts?q=XXX
	        searchQuery: function searchQuery(search) {
	            return { q: search };
	        }
	    }).perPage(10) // limit the number of results to 10
	    .label('Username'), nga.field('combo_id', 'reference').targetEntity(admin.getEntity('Combos')).targetField(nga.field('name')).attributes({ placeholder: 'Choose Combo from dropdown list' }).validation({ required: true }).perPage(-1).label('Combo'), nga.field('on_behalf_id', 'reference').targetEntity(admin.getEntity('Users')).targetField(nga.field('username')).label('On Behalf Id'), nga.field('start_date', 'date').attributes({ placeholder: 'Start date' }).validation({ required: true }).defaultValue(new Date()).label('Start date'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]).onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
	        progression.done();
	        notification.log('Subscription successfully created.', { addnCls: 'humane-flatty-success' });
	        window.location.replace('#/MySales/list?search=%7B"distributorname":"' + localStorage.userName + '"%7D');
	        return false;
	    }]);

	    return mysubscription;
	};

	module.exports = exports['default'];

/***/ },
/* 157 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	    var emailTemplate = admin.getEntity('EmailTemplate');

	    emailTemplate.listView().title('<h4>Email Template <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').listActions(['edit', 'delete']).batchActions([]).fields([nga.field('id').label('ID'), nga.field('template_id', 'choice').choices([{ value: 'code-pin-email', label: 'Email Template for Forgot Pin' }, { value: 'new-account', label: 'Email Template for New Account' }, { value: 'new-email', label: 'Email Template for New Email' }, { value: 'reset-password-email', label: 'Email Template for Reset Password' }, { value: 'weather-widget', label: 'Weather Widget' }, { value: 'invoice-info', label: 'Invoice Information' }]).
	    // { value: 'reset-password-confirm-email', label: '' },
	    // { value: 'reset-password-email', label: '' },
	    // { value: 'reset-password-enter-password', label: '' },
	    // { value: 'salesreport-invoice', label: '' },
	    label('Template ID'), nga.field('title', 'string').label('Title'), nga.field('language', 'string').label('Language'), nga.field('content', 'text').label('Content')]);

	    emailTemplate.creationView().title('<h4>Email Template <i class="fa fa-angle-right" aria-hidden="true"></i> Create: Template</h4>').fields([nga.field('template_id', 'choice').attributes({ placeholder: 'Choose from dropdown list' }).choices([{ value: 'code-pin-email', label: 'Email Template for Forgot Pin' }, { value: 'new-account', label: 'Email Template for New Account' }, { value: 'new-email', label: 'Email Template for New Email' }, { value: 'reset-password-email', label: 'Email Template for Reset Password' }, { value: 'weather-widget', label: 'Weather Widget' }, { value: 'invoice-info', label: 'Invoice Information' }]).
	    // { value: 'reset-password-confirm-email', label: '' },
	    // { value: 'reset-password-email', label: '' },
	    // { value: 'reset-password-enter-password', label: '' },
	    // { value: 'salesreport-invoice', label: '' },
	    validation({ required: true }).label('Template ID'), nga.field('title', 'string').attributes({ placeholder: 'Title' }).validation({ required: true }).label('Title'), nga.field('language', 'choice').attributes({ placeholder: 'Choose from dropdown list' }).choices([{ value: 'eng', label: 'English' }, { value: 'fre', label: 'French' }, { value: 'spa', label: 'Spanish' }, { value: 'sqi', label: 'Albanian' }]).validation({ required: true }).label('Language'), nga.field('content', 'text').attributes({ placeholder: 'Content' }).validation({ required: true }).label('Content'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    emailTemplate.editionView().actions(['list']).title('<h4>Email Template <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.id }}</h4>').fields([nga.field('template_id', 'choice').attributes({ placeholder: 'Choose from dropdown list' }).choices([{ value: 'code-pin-email', label: 'Email Template for Forgot Pin' }, { value: 'new-account', label: 'Email Template for New Account' }, { value: 'new-email', label: 'Email Template for New Email' }, { value: 'reset-password-email', label: 'Email Template for Reset Password' }, { value: 'weather-widget', label: 'Weather Widget' }, { value: 'invoice-info', label: 'Invoice Information' }]).
	    // { value: 'reset-password-confirm-email', label: '' },
	    // { value: 'reset-password-email', label: '' },
	    // { value: 'reset-password-enter-password', label: '' },
	    // { value: 'salesreport-invoice', label: '' },
	    validation({ required: true }).label('Template ID'), nga.field('title', 'string').attributes({ placeholder: 'Title' }).validation({ required: true }).label('Title'), nga.field('language', 'choice').attributes({ placeholder: 'Choose from dropdown list' }).choices([{ value: 'eng', label: 'English' }, { value: 'fre', label: 'French' }, { value: 'spa', label: 'Spanish' }, { value: 'sqi', label: 'Albanian' }]).validation({ required: true }).label('Language'), nga.field('content', 'text').attributes({ placeholder: 'Content' }).validation({ required: true }).label('Content'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    emailTemplate.deletionView().title('<h4>Email Template <i class="fa fa-angle-right" aria-hidden="true"></i> Remove <span style ="color:red;"> {{ entry.values.id }}').actions(['<ma-back-button entry="entry" entity="entity"></ma-back-button>']);

	    return emailTemplate;
	};

	module.exports = exports['default'];

/***/ },
/* 158 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	    var newcustomer = admin.getEntity('NewCustomer');

	    newcustomer.creationView()
	    // .url(function(entityId) {
	    //     return 'NewCustomer'; // Can be absolute or relative
	    // })
	    .title('<h4>Customer Data <i class="fa fa-angle-right" aria-hidden="true"></i> Create Customer</h4>').onSubmitError(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
	        progression.done();
	        notification.log('New Customer successfully created.', { addnCls: 'humane-flatty-success' });
	        window.location.replace('#/MySales/list?search=%7B"distributorname":"' + localStorage.userName + '"%7D');
	        return false;
	    }]).fields([nga.field('username', 'string').attributes({ placeholder: 'Number,lowercase letter, and at least 2 or more characters' }).label('Username').validation({ required: true, pattern: '^[a-z\\d]{2,}$' }), nga.field('password', 'password').attributes({ placeholder: '4 or more characters', title: '4 or more characters' }).label('Password').validation({ required: true, pattern: '.{4,}' }), nga.field('group_id', 'reference').targetEntity(admin.getEntity('CustomerGroups')).targetField(nga.field('description')).attributes({ placeholder: ' Select from the dropdown list one of the groups you created' }).label('Group').perPage(-1).validation({ required: true }), nga.field('firstname', 'string').attributes({ placeholder: 'Customer Firstname' }).validation({ required: true }).label('Firstname'), nga.field('lastname', 'string').attributes({ placeholder: 'Customer Lastname' }).validation({ required: true }).label('Lastname'), nga.field('email', 'email').attributes({ placeholder: 'Customer email' }).validation({ required: true }).label('Email'), nga.field('address', 'string').attributes({ placeholder: 'Customer address (for example house number, street or other information)' }).validation({ required: true }).label('Address'), nga.field('city', 'string').attributes({ placeholder: 'Part of customer address' }).validation({ required: true }).label('City'), nga.field('country', 'choice').choices([{ value: ' Afghanistan', label: ' Afghanistan' }, { value: ' Albania', label: ' Albania' }, { value: ' Algeria', label: ' Algeria' }, { value: ' Andorra', label: ' Andorra' }, { value: ' Angola', label: ' Angola' }, { value: ' Antigua and Barbuda', label: ' Antigua and Barbuda' }, { value: ' Argentina', label: ' Argentina' }, { value: ' Armenia', label: ' Armenia' }, { value: ' Australia', label: ' Australia' }, { value: ' Austria', label: ' Austria' }, { value: ' Azerbaijan', label: ' Azerbaijan' }, { value: ' Bahamas', label: ' Bahamas' }, { value: ' Bahrain', label: ' Bahrain' }, { value: ' Bangladesh', label: ' Bangladesh' }, { value: ' Barbados', label: ' Barbados' }, { value: ' Belarus', label: ' Belarus' }, { value: ' Belgium', label: ' Belgium' }, { value: ' Belize', label: ' Belize' }, { value: ' Benin', label: ' Benin' }, { value: ' Bhutan', label: ' Bhutan' }, { value: ' Bolivia', label: ' Bolivia' }, { value: ' Bosnia and Herzegovina', label: ' Bosnia and Herzegovina' }, { value: ' Botswana', label: ' Botswana' }, { value: ' Brazil', label: ' Brazil' }, { value: ' Brunei Darussalam', label: ' Brunei Darussalam' }, { value: ' Bulgaria', label: ' Bulgaria' }, { value: ' Burkina Faso', label: ' Burkina Faso' }, { value: ' Burundi', label: ' Burundi' }, { value: ' Cabo Verde', label: ' Cabo Verde' }, { value: ' Cambodia', label: ' Cambodia' }, { value: ' Cameroon', label: ' Cameroon' }, { value: ' Canada', label: ' Canada' }, { value: ' Central African Republic', label: ' Central African Republic' }, { value: ' Chad', label: ' Chad' }, { value: ' Chile', label: ' Chile' }, { value: ' China', label: ' China' }, { value: ' Colombia', label: ' Colombia' }, { value: ' Comoros', label: ' Comoros' }, { value: ' Congo', label: ' Congo ' }, { value: ' Costa Rica', label: ' Costa Rica' }, { value: ' C??te D Ivoire', label: ' C??te D Ivoire' }, { value: ' Croatia', label: ' Croatia' }, { value: ' Cuba', label: ' Cuba' }, { value: ' Cyprus', label: ' Cyprus' }, { value: ' Czech Republic', label: ' Czech Republic' }, { value: ' (North Korea)', label: '(North Korea)' }, { value: ' Congo', label: ' Congo' }, { value: ' Denmark', label: ' Denmark' }, { value: ' Djibouti', label: ' Djibouti' }, { value: ' Dominica', label: ' Dominica' }, { value: ' Dominican Republic', label: ' Dominican Republic' }, { value: ' Ecuador', label: ' Ecuador' }, { value: ' Egypt', label: ' Egypt' }, { value: ' El Salvador', label: ' El Salvador' }, { value: ' Equatorial Guinea', label: ' Equatorial Guinea' }, { value: ' Eritrea', label: ' Eritrea' }, { value: 'Estonia', label: ' Estonia' }, { value: ' Ethiopia', label: ' Ethiopia' }, { value: ' Fiji', label: ' Fiji' }, { value: ' Finland', label: ' Finland' }, { value: ' France', label: ' France' }, { value: ' Gabon', label: ' Gabon ' }, { value: ' Gambia', label: ' Gambia ' }, { value: ' Georgia', label: ' Georgia' }, { value: ' Germany', label: ' Germany ' }, { value: ' Ghana', label: ' Ghana ' }, { value: ' Greece', label: ' Greece ' }, { value: ' Grenada', label: ' Grenada' }, { value: ' Guatemala', label: ' Guatemala' }, { value: ' Guinea', label: ' Guinea' }, { value: ' Guinea-Bissau', label: ' Guinea-Bissau' }, { value: ' Guyana', label: ' Guyana' }, { value: ' Haiti', label: ' Haiti ' }, { value: ' Honduras', label: ' Honduras' }, { value: ' Hungary', label: ' Hungary' }, { value: ' Iceland', label: ' Iceland ' }, { value: ' India', label: ' India ' }, { value: ' Indonesia', label: ' Indonesia' }, { value: ' Iran', label: ' Iran ' }, { value: ' Iraq', label: ' Iraq' }, { value: ' Ireland', label: ' Ireland ' }, { value: ' Israel', label: ' Israel' }, { value: ' Italy', label: ' Italy' }, { value: ' Jamaica', label: ' Jamaica' }, { value: ' Japan', label: ' Japan ' }, { value: ' Jordan', label: ' Jordan' }, { value: ' Kazakhstan', label: ' Kazakhstan ' }, { value: ' Kenya', label: ' Kenya ' }, { value: ' Kiribati', label: ' Kiribati' }, { value: ' Kuwait', label: ' Kuwait' }, { value: ' Kyrgyzstan', label: ' Kyrgyzstan' }, { value: ' Lao', label: ' Lao' }, { value: ' Latvia', label: ' Latvia' }, { value: ' Lebanon', label: ' Lebanon' }, { value: ' Lesotho', label: ' Lesotho' }, { value: ' Liberia', label: ' Liberia' }, { value: ' Libya', label: ' Libya ' }, { value: ' Liechtenstein', label: ' Liechtenstein' }, { value: ' Lithuania', label: ' Lithuania ' }, { value: ' Luxembourg', label: ' Luxembourg' }, { value: ' Macedonia', label: ' Macedonia ' }, { value: ' Madagascar', label: ' Madagascar' }, { value: ' Malawi', label: ' Malawi ' }, { value: ' Malaysia', label: ' Malaysia' }, { value: ' Maldives', label: ' Maldives ' }, { value: ' Mali', label: ' Mali' }, { value: ' Malta', label: ' Malta' }, { value: ' Marshall Islands', label: ' Marshall Islands ' }, { value: ' Mauritania', label: ' Mauritania' }, { value: ' Mauritius', label: ' Mauritius' }, { value: ' Mexico', label: ' Mexico' }, { value: ' Micronesia', label: ' Micronesia' }, { value: ' Monaco', label: ' Monaco' }, { value: ' Mongolia', label: ' Mongolia' }, { value: ' Montenegro', label: ' Montenegro' }, { value: ' Morocco', label: ' Morocco' }, { value: ' Mozambique', label: ' Mozambique' }, { value: ' Myanmar', label: ' Myanmar' }, { value: ' Namibia', label: ' Namibia ' }, { value: ' Nauru', label: ' Nauru ' }, { value: ' Nepal', label: ' Nepal ' }, { value: ' Netherlands', label: ' Netherlands' }, { value: ' New Zealand', label: ' New Zealand' }, { value: ' Nicaragua', label: ' Nicaragua ' }, { value: ' Niger', label: ' Niger  ' }, { value: ' Nigeria', label: ' Nigeria ' }, { value: ' Norway', label: ' Norway ' }, { value: ' Oman', label: ' Oman ' }, { value: ' Pakistan', label: ' Pakistan ' }, { value: ' Palau', label: ' Palau ' }, { value: ' Panama', label: ' Panama ' }, { value: ' Papua New Guinea', label: ' Papua New Guinea ' }, { value: ' Paraguay', label: ' Paraguay ' }, { value: ' Peru', label: ' Peru' }, { value: ' Philippines', label: ' Philippines ' }, { value: ' Poland', label: ' Poland ' }, { value: ' Portugal', label: ' Portugal ' }, { value: ' Qatar', label: ' Qatar  ' }, { value: ' Republic of Korea (South Korea)', label: ' Republic of Korea (South Korea) ' }, { value: ' Republic of Moldova', label: ' Republic of Moldova ' }, { value: ' Romania', label: ' Romania' }, { value: ' Russian Federation', label: ' Russian Federation ' }, { value: ' Rwanda', label: ' Rwanda ' }, { value: ' Saint Kitts and Nevis', label: ' Saint Kitts and Nevis' }, { value: ' Saint Lucia', label: ' Saint Lucia ' }, { value: ' Saint Vincent and the Grenadines', label: ' Saint Vincent and the Grenadines ' }, { value: ' Samoa', label: ' Samoa ' }, { value: ' San Marino', label: ' San Marino' }, { value: ' Sao Tome and Principe', label: ' Sao Tome and Principe  ' }, { value: ' Saudi Arabia', label: ' Saudi Arabia ' }, { value: ' Senegal', label: ' Senegal' }, { value: ' Serbia', label: ' Serbia ' }, { value: ' Seychelles', label: ' Seychelles ' }, { value: ' Sierra Leone', label: ' Sierra Leone ' }, { value: ' Singapore', label: ' Singapore  ' }, { value: ' Slovakia', label: ' Slovakia  ' }, { value: ' Slovenia', label: ' Slovenia  ' }, { value: ' Solomon Islands', label: ' Solomon Islands' }, { value: ' Somalia', label: ' Somalia ' }, { value: ' South Africa', label: ' South Africa ' }, { value: ' South Sudan', label: ' South Sudan ' }, { value: ' Spain', label: ' Spain    ' }, { value: ' Sri Lanka', label: ' Sri Lanka ' }, { value: ' Sudan', label: ' Sudan    ' }, { value: ' Suriname', label: ' Suriname  ' }, { value: ' Swaziland', label: ' Swaziland  ' }, { value: ' Sweden', label: ' Sweden  ' }, { value: ' Switzerland', label: ' Switzerland ' }, { value: ' Syrian Arab Republic', label: ' Syrian Arab Republic  ' }, { value: ' Tajikistan', label: ' Tajikistan' }, { value: ' Thailand', label: ' Thailand ' }, { value: ' Timor-Leste', label: ' Timor-Leste ' }, { value: ' Togo', label: ' Togo  ' }, { value: ' Tonga', label: ' Tonga ' }, { value: ' Trinidad and Tobago', label: ' Trinidad and Tobago ' }, { value: ' Tunisia', label: ' Tunisia ' }, { value: ' Turkey', label: ' Turkey  ' }, { value: ' Turkmenistan', label: ' Turkmenistan ' }, { value: ' Tuvalu', label: ' Tuvalu  ' }, { value: ' Uganda', label: ' Uganda  ' }, { value: ' Ukraine', label: ' Ukraine  ' }, { value: ' United Arab Emirates', label: ' United Arab Emirates  ' }, { value: ' United Kingdom', label: ' United Kingdom' }, { value: ' United Republic of Tanzania', label: ' United Republic of Tanzania ' }, { value: ' United States of America', label: ' United States of America   ' }, { value: ' Uruguay', label: ' Uruguay ' }, { value: ' Uzbekistan', label: ' Uzbekistan ' }, { value: ' Vanuatu', label: ' Vanuatu ' }, { value: ' Venezuela', label: ' Venezuela  ' }, { value: ' Vietnam', label: ' Vietnam' }, { value: ' Yemen', label: ' Yemen ' }, { value: ' Zambia', label: ' Zambia ' }, { value: ' Zimbabwe', label: ' Zimbabwe ' }]).attributes({ placeholder: 'Part of customer address. Please select from dropdown list.' }).validation({ required: true }).label('Country'), nga.field('telephone').attributes({ placeholder: 'Customer phone number' }).validation({ required: true }).label('Telephone'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    return newcustomer;
	};

	module.exports = exports['default'];

/***/ },
/* 159 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	    var mysales = admin.getEntity('MySales');

	    mysales.listView()
	    // .url(function() {
	    //     return 'MySales/list';
	    // })
	    .title('<h4>Sale report <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').listActions(['<ma-edit-button entry="entry" entity="entity" label="Cancel Subscription" size="xs"></ma-edit-button><download-invoice post="entry"></download-invoice>']).batchActions([]).fields([nga.field('id', 'number').cssClasses('hidden-xs').label('ID'), nga.field('user_id', 'reference').targetEntity(admin.getEntity('ResellersUsers')).targetField(nga.field('username')).label('Sales Agent'), nga.field('login_data_id', 'reference').targetEntity(admin.getEntity('ResellersLoginData')).targetField(nga.field('username')).label('Account Username'), nga.field('transaction_id', 'string').label('Transaction ID').editable(false), nga.field('saledate', 'date').cssClasses('hidden-xs').label('Sale Date'), nga.field('combo.name', 'string').label('Products'), nga.field('active', 'boolean').label('Active sale'), nga.field('cancelation_date', 'date').cssClasses('hidden-xs').label('Cancelation Date'), nga.field('cancelation_user', 'reference').targetEntity(admin.getEntity('ResellersUsers')).targetField(nga.field('username')).label('Cancelation User'), nga.field('cancelation_reason', 'text').cssClasses('hidden-xs').label('Cancelation Reason')]).filters([nga.field('user_username').attributes({ placeholder: 'Client' }).label('Client'),
	    // nga.field('distributorname')
	    //     .attributes({ placeholder: 'Distributor' })
	    //     .label('Distributor'),
	    nga.field('startsaledate', 'date').attributes({ placeholder: 'From date' }).label('From date'), nga.field('endsaledate', 'date').attributes({ placeholder: 'To date' }).label('To date'), nga.field('name', 'reference').targetEntity(admin.getEntity('Combos')).attributes({ placeholder: 'Product' }).perPage(-1).targetField(nga.field('name')).label('Product'), nga.field('active', 'choice').choices([{ value: 'active', label: 'Active sales' }, { value: 'cancelled', label: 'Canceled sales' }, { value: 'all', label: 'All sales' }]).attributes({ placeholder: 'Sale active' }).label('Sale status')]).exportFields([mysales.listView().fields()]);

	    mysales.editionView().title('<h4>Transaction <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.username }}</h4>').actions(['list']).fields([nga.field('id', 'number').editable(false).label('ID'), nga.field('transaction_id', 'string').label('Transaction ID').editable(false),
	    /*
	    nga.field('active', 'boolean')
	            .attributes({readOnly: true})
	            .defaultValue(true)
	            .validation({ required: true })
	        .label('Cancel Sale'),
	    */
	    nga.field('cancelation_reason', 'string').label('Cancelation Reason').editable(true).validation({ required: true }), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    return mysales;
	};

	module.exports = exports['default'];

/***/ },
/* 160 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	    var channels = admin.getEntity('Channels');

	    channels.listView().title('<h4>Channels <i class="fa fa-angle-right" aria-hidden="true"></i> List </h4>').batchActions([]).fields([nga.field('channel_number', 'string').label('Number'), nga.field('title', 'string').isDetailLink(true).label('Title'), nga.field('epg_map_id', 'string').label('EPG MAP ID'), nga.field('genre_id', 'reference').targetEntity(admin.getEntity('Genres')).targetField(nga.field('description')).label('Genres'), nga.field('icon_url', 'file').template('<img src="{{ entry.values.icon_url }}" height="35" width="35" />').cssClasses('hidden-xs').label('Icon'), nga.field('packages_channels').cssClasses('hidden').map(function getpckgid(value, entry) {
	        var return_object = [];
	        for (var i = 0; i < value.length; i++) {
	            return_object[i] = value[i].package_id;
	        }
	        return return_object;
	    }).label('Packages Channels'), nga.field('packages_channels', 'reference_many').targetEntity(admin.getEntity('Packages')).targetField(nga.field('package_name')).singleApiCall(function (package_id) {
	        return { 'package_id[]': package_id };
	    }).label('Packages'), nga.field('description', 'text').cssClasses('hidden-xs').label('Description'), nga.field('isavailable', 'boolean').label('Available'), nga.field('pin_protected', 'boolean').label('Pin Protected')]).sortDir("ASC").sortField("channel_number").filters([nga.field('isavailable', 'boolean').filterChoices([{ value: true, label: 'Available' }, { value: false, label: 'Not Available' }]).label('Available'), nga.field('q').label('').template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>').pinned(true)]).listActions(['edit']).exportFields([channels.listView().fields()]);

	    channels.deletionView().title('<h4>Channels <i class="fa fa-angle-right" aria-hidden="true"></i> Remove <span style ="color:red;"> {{ entry.values.title }}').actions(['<ma-back-button entry="entry" entity="entity"></ma-back-button>']);

	    channels.creationView().title('<h4>Channels <i class="fa fa-angle-right" aria-hidden="true"></i> Create: Channel</h4>').onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
	        // stop the progress bar
	        progression.done();
	        // add a notification
	        $state.go($state.get('edit'), { entity: entity.name(), id: entry._identifierValue });
	        // cancel the default action (redirect to the edition view)
	        return false;
	    }]).onSubmitError(['error', 'form', 'progression', 'notification', function (error, form, progression, notification) {
	        progression.done(); // stop the progress bar
	        return false;
	    }]).fields([nga.field('title', 'string').attributes({ placeholder: 'Channel name' }).validation({ required: true }).label('Title'), nga.field('epg_map_id', 'string').template('<ma-input-field field="field" value="entry.values.epg_map_id"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">Identifier used to match epg files with the respective channel</small>').label('EPG MAP ID'), nga.field('channel_number', 'number').attributes({ placeholder: 'Must be number' }).validation({ required: true }).label('Number'), nga.field('genre_id', 'reference').targetEntity(admin.getEntity('Genres')).targetField(nga.field('description')).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select Genre');
	            }
	        }
	    }).attributes({ placeholder: 'Choose from dropdown list one of the genres you already created' }).label('Genre *'), nga.field('description', 'text').attributes({ placeholder: 'You can specify data you need to know for the channel in this field' }).validation({ required: true }).label('Description'), nga.field('isavailable', 'boolean').attributes({ placeholder: 'Is Available' }).validation({ required: true }).label('Is Available'), nga.field('pin_protected', 'boolean').validation({ required: true }).label('Pin Protected'), nga.field('packages_channels', 'reference_many').targetEntity(admin.getEntity('Packages')).permanentFilters({ package_type_id: [1, 2] }).targetField(nga.field('package_name')).label('Packages').attributes({ placeholder: 'Select packages' }).singleApiCall(function (package_id) {
	        return { 'package_id[]': package_id };
	    }), nga.field('icon_url', 'file').uploadInformation({ 'url': '/file-upload/single-file/channels/icon_url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.icon_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.icon_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">240x240 px, not larger than 100 KB</small></div>').validation({
	        validator: function validator(value) {
	            if (value == null) {
	                throw new Error('Please, choose icon');
	            } else {
	                var icon_url = document.getElementById('icon_url');
	                if (icon_url.value.length > 0) {
	                    if (icon_url.files[0].size > 102400) {
	                        throw new Error('Your Icon is too Big, not larger than 100 KB');
	                    }
	                }
	            }
	        }
	    }).label('Icon *'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    channels.editionView().title('<h4>Channels <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.title }}</h4>').actions(['list', '<ma-delete-button label="Remove" entry="entry" entity="entity"></ma-delete-button>']).fields([nga.field('title', 'string').attributes({ placeholder: 'Channel name' }).validation({ required: true }).label('Title'), nga.field('epg_map_id', 'string').template('<ma-input-field field="field" value="entry.values.epg_map_id"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">Identifier used to match epg files with the respective channel</small>').label('EPG MAP ID'), nga.field('channel_number', 'number').attributes({ placeholder: 'Must be number' }).validation({ required: true }).label('Number'), nga.field('genre_id', 'reference').targetEntity(admin.getEntity('Genres')).targetField(nga.field('description')).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select Genre');
	            }
	        }
	    }).attributes({ placeholder: 'Choose from dropdown list one of the genres you already created' }).label('Genre *'), nga.field('description', 'text').attributes({ placeholder: 'You can specify data you need to know for the channel in this field' }).validation({ required: true }).label('Description'), nga.field('isavailable', 'boolean').attributes({ placeholder: 'Is Available' }).validation({ required: true }).label('Is Available'), nga.field('pin_protected', 'boolean').validation({ required: true }).label('Pin Protected'), nga.field('packages_channels', 'reference_many').targetEntity(admin.getEntity('Packages')).permanentFilters({ package_type_id: [1, 2] }).targetField(nga.field('package_name')).label('Packages').attributes({ placeholder: 'Select packages' }).map(function getpckgid(value, entry) {
	        var return_object = [];
	        for (var i = 0; i < value.length; i++) {
	            return_object[i] = value[i].package_id;
	        }
	        return return_object;
	    }).singleApiCall(function (package_id) {
	        return { 'package_id[]': package_id };
	    }), nga.field('icon_url', 'file').uploadInformation({ 'url': '/file-upload/single-file/channels/icon_url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.icon_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.icon_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">240x240 px, not larger than 100 KB</small></div>').validation({
	        validator: function validator(value) {
	            if (value == null) {
	                throw new Error('Please, choose icon');
	            } else {
	                var icon_url = document.getElementById('icon_url');
	                if (icon_url.value.length > 0) {
	                    if (icon_url.files[0].size > 102400) {
	                        throw new Error('Your Icon is too Big, not larger than 100 KB');
	                    }
	                }
	            }
	        }
	    }).label('Icon *'), nga.field('template').label('').template(_edit_buttonHtml2['default']), nga.field('ChannelStreams', 'referenced_list').label('Channel Streams').targetEntity(admin.getEntity('ChannelStreams')).targetReferenceField('channel_id').targetFields([nga.field('stream_url')
	    // .map(function truncate(value) {
	    // 	if (!value) {
	    // 		return '';
	    // 	}
	    // 	return value.length > 25 ? value.substr(0, 25) + '...' : value;
	    // })
	    .label('Stream Url'), nga.field('stream_source_id', 'reference').targetEntity(admin.getEntity('ChannelStreamSources')).targetField(nga.field('stream_source')).cssClasses('hidden-xs').label('Stream Source'), nga.field('stream_format').cssClasses('hidden-xs').label('Stream Format'), nga.field('token', 'boolean').label('Token'), nga.field('encryption', 'boolean').cssClasses('hidden-xs').label('Encryption'), nga.field('stream_mode', 'string').cssClasses('hidden-xs').label('Stream Mode')]).listActions(['edit', 'delete']), nga.field('template').label('').template('<ma-create-button entity-name="ChannelStreams" class="pull-right" label="ADD STREAM" default-values="{ channel_id: entry.values.id }"></ma-create-button>')]);

	    return channels;
	};

	module.exports = exports['default'];

/***/ },
/* 161 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	    var channelstream = admin.getEntity('ChannelStreams');
	    channelstream.listView().title('<h4>Channel Streams <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('channel_id', 'reference').targetEntity(admin.getEntity('Channels')).targetField(nga.field('channel_number')).label('Nr'), nga.field('channel_id', 'reference').targetEntity(admin.getEntity('Channels')).targetField(nga.field('title')).label('Channel'), nga.field('stream_source_id', 'reference').targetEntity(admin.getEntity('ChannelStreamSources')).targetField(nga.field('stream_source')).label('Stream Source'), nga.field('stream_url', 'string')
	    // .map(function truncate(value) {
	    //     if (!value) {
	    //         return 'No Stream Url';
	    //     }
	    //     return value.length > 25 ? value.substr(0, 25) + '...' : value;
	    // })
	    .label('Stream Url'), nga.field('stream_mode', 'choice').attributes({ placeholder: 'Stream Format' }).choices([{ value: 'live', label: 'Live TV stream' }, { value: 'catchup', label: 'Catchup stream' }]).validation({ required: true }).cssClasses('hidden-xs').label('Stream mode'), nga.field('token_url', 'string').map(function truncate(value) {
	        if (!value) {
	            return 'No Token Url';
	        }
	        return value.length > 25 ? value.substr(0, 25) + '...' : value;
	    }).label('Token Url'), nga.field('encryption_url', 'string').label('Encryption Url'), nga.field('token', 'boolean').label('Token'), nga.field('encryption', 'boolean').label('Encryption'), nga.field('stream_format', 'choice').choices([{ value: 0, label: 'MPEG Dash' }, { value: 1, label: 'Smooth Streaming' }, { value: 2, label: 'HLS' }, { value: 3, label: 'OTHER' }]).validation({ required: true }).label('Stream Format')]).listActions(['edit']).exportFields([channelstream.listView().fields()]);

	    channelstream.deletionView().title('<h4>Channel Streams <i class="fa fa-angle-right" aria-hidden="true"></i> Remove <span style ="color:red;"> Streams').actions(['<ma-back-button entry="entry" entity="entity"></ma-back-button>']);

	    channelstream.creationView().title('<h4>Channel Streams <i class="fa fa-angle-right" aria-hidden="true"></i> Create: Channel Stream</h4>').onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
	        progression.done();
	        $state.go($state.get('edit'), { entity: 'Channels', id: entry.values.channel_id });
	        return false;
	    }]).fields([nga.field('channel_id', 'reference').targetEntity(admin.getEntity('Channels')).targetField(nga.field('title')).attributes({ placeholder: 'Select Channel from dropdown list' }).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select Channel');
	            }
	        }
	    }).perPage(-1).label('Channel *'), nga.field('stream_source_id', 'reference').targetEntity(admin.getEntity('ChannelStreamSources')).targetField(nga.field('stream_source')).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select Stream Source Id');
	            }
	        }
	    }).attributes({ placeholder: 'Select Stream Source from dropdown list' }).perPage(-1).label('Stream Source Id *'), nga.field('stream_url', 'string').attributes({ placeholder: 'Channel Stream Url' }).validation({ validator: function validator(value) {
	            if (value === null) {
	                throw new Error('Please Select Stream Url');
	            } else if (value.indexOf('http://') == 0 || value.indexOf('https://') == 0 || value.indexOf('udp://') == 0 || value.indexOf('rtmp://') == 0) {
	                document.getElementById('row-stream_url').classList.remove("has-error");
	                document.getElementById('row-stream_url').classList.add("has-success");
	            } else {
	                document.getElementById('row-stream_url').classList.add("has-error");
	                throw new Error('Invalid Url');
	            }
	        }
	    }).label('Stream Url *'), nga.field('stream_mode', 'choice').attributes({ placeholder: 'Select Channel Mode from dropdown list' }).choices([{ value: 'live', label: 'Live TV stream' }, { value: 'catchup', label: 'Catchup stream' }]).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select Channel mode');
	            }
	        }
	    }).label('Channel mode *'), nga.field('recording_engine', 'choice').defaultValue('none').choices([{ value: 'none', label: 'None' }, { value: 'wowza', label: 'Wowza' }, { value: 'flussonic', label: 'Flussonic' }]).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select Recording Engine');
	            }
	        }
	    }).template('<div>' + '<ma-choice-field field="field" value="entry.values.recording_engine"></ma-choice-field>' + '<small id="emailHelp" class="form-text text-muted">For catchup channels choose the Recording Engine from dropdown list. By default is None</small>' + '</div>').label('Recording Engine *'), nga.field('stream_resolution', 'choices').attributes({ placeholder: 'Select screen types where this stream should play' }).choices([{ value: 1, label: 'Android Set Top Box' }, { value: 2, label: 'Android Smart Phone' }, { value: 3, label: 'IOS' }, { value: 4, label: 'Android Smart TV' }, { value: 5, label: 'Samsung Smart TV' }, { value: 6, label: 'Apple TV' }]).defaultValue([1, 2, 3, 4, 5, 6]).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select Stream resolution');
	            }
	        }
	    }).label('Stream resolution *'), nga.field('stream_format', 'choice').attributes({ placeholder: 'Choose from dropdown list stream format , for example HLS format' }).choices([{ value: 0, label: 'MPEG Dash' }, { value: 1, label: 'Smooth Streaming' }, { value: 2, label: 'HLS' }, { value: 3, label: 'OTHER' }]).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select Stream Format');
	            }
	        }
	    }).label('Stream Format *'), nga.field('token', 'boolean').attributes({ placeholder: 'Token' }).validation({ required: true }).label('Token'), nga.field('token_url', 'string').defaultValue('Token Url').validation({ required: false }).label('Token Url'), nga.field('encryption', 'boolean').attributes({ placeholder: 'Encryption' }).validation({ required: true }).label('Encryption'), nga.field('encryption_url', 'string').defaultValue('Encryption url').validation({ required: false }).label('Encryption Url'), nga.field('drm_platform', 'choice').attributes({ placeholder: 'Select from dropdown list' }).defaultValue('none').choices([{ value: 'none', label: 'None' }, { value: 'pallycon', label: 'Pallycon' }, { value: 'verimatrix', label: 'Verimatrix' }, { value: 'widevine', label: 'Widevine' }]).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select DRM Platform');
	            }
	        }
	    }).label('DRM Platform *'), nga.field('template').label('').template(_edit_buttonHtml2['default']),

	    //hidden from UI
	    nga.field('is_octoshape', 'boolean').defaultValue(false).validation({ required: false }).cssClasses('hidden').label('')]);

	    channelstream.editionView().title('<h4>Channel Streams <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.channel_id }}</h4>').actions(['list', 'delete']).fields([channelstream.creationView().fields()]);

	    return channelstream;
	};

	module.exports = exports['default'];

/***/ },
/* 162 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	    var channelstreamsource = admin.getEntity('ChannelStreamSources');
	    channelstreamsource.listView().title('<h4>Channel Stream Sources <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('stream_source', 'string').label('Stream Source')]).listActions(['edit']).exportFields([channelstreamsource.listView().fields()]);

	    channelstreamsource.creationView().title('<h4>Channel Stream Sources <i class="fa fa-angle-right" aria-hidden="true"></i> Create: Channel Stream Source</h4>').fields([nga.field('stream_source', 'string').attributes({ placeholder: 'Stream Source' }).validation({ required: true }).label('Stream Source'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    channelstreamsource.editionView().title('<h4>Channel Stream Sources <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.stream_source }}</h4>').actions(['list']).fields([channelstreamsource.creationView().fields(), nga.field('ChannelStreams', 'referenced_list').label('Channels').targetEntity(admin.getEntity('ChannelStreams')).targetReferenceField('stream_source_id').targetFields([nga.field('channel_id', 'reference').targetEntity(admin.getEntity('Channels')).targetField(nga.field('channel_number')).label('Nr'), nga.field('channel_id', 'reference').targetEntity(admin.getEntity('Channels')).targetField(nga.field('icon_url').template('<img src="{{ entry.values.icon_url }}" height="35" width="35" />')).cssClasses('hidden-xs').label('Icon'), nga.field('channel_id', 'reference').targetEntity(admin.getEntity('Channels')).targetField(nga.field('title')).label('Channel'), nga.field('stream_source_id', 'reference').targetEntity(admin.getEntity('ChannelStreamSources')).targetField(nga.field('stream_source')).label('Stream Source'), nga.field('stream_url', 'string').map(function truncate(value) {
	        if (!value) {
	            return '';
	        }
	        return value.length > 25 ? value.substr(0, 25) + '...' : value;
	    }).label('Stream Url')]).listActions(['edit']).perPage(15)]);

	    return channelstreamsource;
	};

	module.exports = exports['default'];

/***/ },
/* 163 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	    var combo = admin.getEntity('Combos');
	    combo.listView().title('<h4>Products & Services <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('id', 'string').isDetailLink(true).label('ID'), nga.field('product_id', 'string').isDetailLink(true).label('Product ID'), nga.field('name', 'string').isDetailLink(true).label('Name'), nga.field('duration').cssClasses('hidden-xs').label('Duration'), nga.field('value', 'number').cssClasses('hidden-xs').label('Value'), nga.field('isavailable', 'boolean').label('Available')]).listActions(['edit']).exportFields([combo.listView().fields()]);

	    combo.creationView().onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
	        progression.done();
	        $state.go($state.get('edit'), { entity: entity.name(), id: entry._identifierValue });
	        return false;
	    }]).title('<h4>Products & Services <i class="fa fa-angle-right" aria-hidden="true"></i> Create: Product</h4>').fields([nga.field('product_id', 'string').attributes({ placeholder: 'Product ID' }).validation({ required: true }).label('Product ID'), nga.field('name', 'string').attributes({ placeholder: ' Name of your product' }).validation({ required: true }).label('Name'), nga.field('duration').attributes({ placeholder: 'Duration of this product in days' }).validation({ required: true }).label('Duration'), nga.field('value', 'number').attributes({ placeholder: 'Price of the product' }).validation({ required: true }).label('Value'), nga.field('isavailable', 'boolean').attributes({ placeholder: 'Is Available' }).validation({ required: true }).label('Is Available'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    combo.editionView().actions(['list']).title('<h4>Products & Services <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.name }}</h4>').fields([combo.creationView().fields(), nga.field('', 'referenced_list').label('Packages').targetEntity(admin.getEntity('comboPackages')).targetReferenceField('combo_id').targetFields([nga.field('package_id', 'reference').targetEntity(admin.getEntity('Packages')).targetField(nga.field('package_name')).label('Package'), nga.field('package_id', 'reference').targetEntity(admin.getEntity('Packages')).targetField(nga.field('package_type').map(function getpckdes(value, entry) {
	        return entry["package_type.description"];
	    })).label('Package Type')]).listActions(['<ma-delete-button label="Remove" entry="entry" entity="entity" size="xs"></ma-delete-button>']), nga.field('ADD PACKAGE', 'template').label('').template('<ma-create-button entity-name="comboPackages" class="pull-right" label="ADD PACKAGE" default-values="{ combo_id: entry.values.id }"></ma-create-button>')]);

	    return combo;
	};

	module.exports = exports['default'];

/***/ },
/* 164 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	    var combopackages = admin.getEntity('comboPackages');
	    combopackages.listView().title('<h4>Combo Packages <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('package_id', 'reference').targetEntity(admin.getEntity('Packages')).targetField(nga.field('package_name')).label('Package'), nga.field('combo_id', 'reference').targetEntity(admin.getEntity('Combos')).targetField(nga.field('name')).label('Combo')]).listActions(['edit']).exportFields([combopackages.listView().fields()]);

	    combopackages.deletionView().title('<h4>Combo Packages <i class="fa fa-angle-right" aria-hidden="true"></i> Remove <span style ="color:red;"> {{ entry.values.package.package_name }} </span> from <span style ="color:red;"> {{ entry.values.combo.name }} </span></h4>').fields([nga.field('combo', 'template').template(function (entry, value) {
	        return entry.values.combo.name;
	    }), nga.field('package', 'template').template(function (entry, value) {
	        return entry.values['package'].package_name;
	    })]).actions(['<ma-back-button entry="entry" entity="entity"></ma-back-button>']);

	    combopackages.creationView().onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
	        progression.done();
	        $state.go($state.get('edit'), { entity: 'Combos', id: entry.values.combo_id });
	        return false;
	    }]).title('<h4>Link Package with Combo/Plan</h4>').fields([nga.field('combo_id', 'reference').targetEntity(admin.getEntity('Combos')).targetField(nga.field('name')).perPage(-1).validation({ required: true }).label('Product'), nga.field('package_id', 'reference').targetEntity(admin.getEntity('Packages')).targetField(nga.field('package_name').map(function getpckdes(value, entry) {
	        return entry["package_name"] + ' - ' + entry["package_type.description"];
	    })).perPage(-1).validation({ required: true }).attributes({ placeholder: 'Select packages' }).label('Package'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    combopackages.editionView().title('<h4>Combo Packages <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.combo_id }}</h4>').actions(['list']).fields([combopackages.creationView().fields()]);

	    return combopackages;
	};

	module.exports = exports['default'];

/***/ },
/* 165 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	    var customerdata = admin.getEntity('CustomerData');
	    customerdata.listView().title('<h4>Customer Data <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('group_id', 'reference').targetEntity(admin.getEntity('CustomerGroups')).targetField(nga.field('description')).cssClasses('hidden-xs').label('Group'), nga.field('firstname', 'string').label('Firstname'), nga.field('lastname', 'string').label('Lastname'), nga.field('email', 'email').cssClasses('hidden-xs').label('Email'), nga.field('address', 'string').map(function truncate(value) {
	        if (!value) {
	            return '';
	        }
	        return value.length > 15 ? value.substr(0, 15) + '...' : value;
	    }).cssClasses('hidden-xs').label('Address'), nga.field('city', 'string').cssClasses('hidden-xs').label('City'), nga.field('country').cssClasses('hidden-xs').label('Country'), nga.field('telephone', 'string').cssClasses('hidden-xs').label('Telephone')]).filters([nga.field('q').label('').template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>').pinned(true)]).listActions(['edit']).exportFields([customerdata.listView().fields()]);

	    customerdata.creationView().title('<h4>Customer Data <i class="fa fa-angle-right" aria-hidden="true"></i> Create Customer</h4>').onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
	        progression.done();
	        $state.go($state.get('edit'), { entity: entity.name(), id: entry._identifierValue });
	        return false;
	    }]).fields([nga.field('group_id', 'reference').targetEntity(admin.getEntity('CustomerGroups')).targetField(nga.field('description')).attributes({ placeholder: 'Select from the dropdown list one of the groups you created' }).label('Group *').perPage(-1).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select Group');
	            }
	        }
	    }), nga.field('firstname', 'string').attributes({ placeholder: 'Customer Firstname' }).validation({ required: true }).label('Firstname'), nga.field('lastname', 'string').attributes({ placeholder: 'Customer Lastname' }).validation({ required: true }).label('Lastname'), nga.field('email', 'email').attributes({ placeholder: 'Customer email' }).validation({ required: true }).label('Email'), nga.field('address', 'string').attributes({ placeholder: 'Customer address (for example house number, street or other information)' }).validation({ required: true }).label('Address'), nga.field('city', 'string').attributes({ placeholder: 'Part of customer address' }).validation({ required: true }).label('City'), nga.field('country', 'choice').choices([{ value: ' Afghanistan', label: ' Afghanistan' }, { value: ' Albania', label: ' Albania' }, { value: ' Algeria', label: ' Algeria' }, { value: ' Andorra', label: ' Andorra' }, { value: ' Angola', label: ' Angola' }, { value: ' Antigua and Barbuda', label: ' Antigua and Barbuda' }, { value: ' Argentina', label: ' Argentina' }, { value: ' Armenia', label: ' Armenia' }, { value: ' Australia', label: ' Australia' }, { value: ' Austria', label: ' Austria' }, { value: ' Azerbaijan', label: ' Azerbaijan' }, { value: ' Bahamas', label: ' Bahamas' }, { value: ' Bahrain', label: ' Bahrain' }, { value: ' Bangladesh', label: ' Bangladesh' }, { value: ' Barbados', label: ' Barbados' }, { value: ' Belarus', label: ' Belarus' }, { value: ' Belgium', label: ' Belgium' }, { value: ' Belize', label: ' Belize' }, { value: ' Benin', label: ' Benin' }, { value: ' Bhutan', label: ' Bhutan' }, { value: ' Bolivia', label: ' Bolivia' }, { value: ' Bosnia and Herzegovina', label: ' Bosnia and Herzegovina' }, { value: ' Botswana', label: ' Botswana' }, { value: ' Brazil', label: ' Brazil' }, { value: ' Brunei Darussalam', label: ' Brunei Darussalam' }, { value: ' Bulgaria', label: ' Bulgaria' }, { value: ' Burkina Faso', label: ' Burkina Faso' }, { value: ' Burundi', label: ' Burundi' }, { value: ' Cabo Verde', label: ' Cabo Verde' }, { value: ' Cambodia', label: ' Cambodia' }, { value: ' Cameroon', label: ' Cameroon' }, { value: ' Canada', label: ' Canada' }, { value: ' Central African Republic', label: ' Central African Republic' }, { value: ' Chad', label: ' Chad' }, { value: ' Chile', label: ' Chile' }, { value: ' China', label: ' China' }, { value: ' Colombia', label: ' Colombia' }, { value: ' Comoros', label: ' Comoros' }, { value: ' Congo', label: ' Congo ' }, { value: ' Costa Rica', label: ' Costa Rica' }, { value: ' C??te D Ivoire', label: ' C??te D Ivoire' }, { value: ' Croatia', label: ' Croatia' }, { value: ' Cuba', label: ' Cuba' }, { value: ' Cyprus', label: ' Cyprus' }, { value: ' Czech Republic', label: ' Czech Republic' }, { value: ' (North Korea)', label: '(North Korea)' }, { value: ' Congo', label: ' Congo' }, { value: ' Denmark', label: ' Denmark' }, { value: ' Djibouti', label: ' Djibouti' }, { value: ' Dominica', label: ' Dominica' }, { value: ' Dominican Republic', label: ' Dominican Republic' }, { value: ' Ecuador', label: ' Ecuador' }, { value: ' Egypt', label: ' Egypt' }, { value: ' El Salvador', label: ' El Salvador' }, { value: ' Equatorial Guinea', label: ' Equatorial Guinea' }, { value: ' Eritrea', label: ' Eritrea' }, { value: 'Estonia', label: ' Estonia' }, { value: ' Ethiopia', label: ' Ethiopia' }, { value: ' Fiji', label: ' Fiji' }, { value: ' Finland', label: ' Finland' }, { value: ' France', label: ' France' }, { value: ' Gabon', label: ' Gabon ' }, { value: ' Gambia', label: ' Gambia ' }, { value: ' Georgia', label: ' Georgia' }, { value: ' Germany', label: ' Germany ' }, { value: ' Ghana', label: ' Ghana ' }, { value: ' Greece', label: ' Greece ' }, { value: ' Grenada', label: ' Grenada' }, { value: ' Guatemala', label: ' Guatemala' }, { value: ' Guinea', label: ' Guinea' }, { value: ' Guinea-Bissau', label: ' Guinea-Bissau' }, { value: ' Guyana', label: ' Guyana' }, { value: ' Haiti', label: ' Haiti ' }, { value: ' Honduras', label: ' Honduras' }, { value: ' Hungary', label: ' Hungary' }, { value: ' Iceland', label: ' Iceland ' }, { value: ' India', label: ' India ' }, { value: ' Indonesia', label: ' Indonesia' }, { value: ' Iran', label: ' Iran ' }, { value: ' Iraq', label: ' Iraq' }, { value: ' Ireland', label: ' Ireland ' }, { value: ' Israel', label: ' Israel' }, { value: ' Italy', label: ' Italy' }, { value: ' Jamaica', label: ' Jamaica' }, { value: ' Japan', label: ' Japan ' }, { value: ' Jordan', label: ' Jordan' }, { value: ' Kazakhstan', label: ' Kazakhstan ' }, { value: ' Kenya', label: ' Kenya ' }, { value: ' Kiribati', label: ' Kiribati' }, { value: ' Kuwait', label: ' Kuwait' }, { value: ' Kyrgyzstan', label: ' Kyrgyzstan' }, { value: ' Lao', label: ' Lao' }, { value: ' Latvia', label: ' Latvia' }, { value: ' Lebanon', label: ' Lebanon' }, { value: ' Lesotho', label: ' Lesotho' }, { value: ' Liberia', label: ' Liberia' }, { value: ' Libya', label: ' Libya ' }, { value: ' Liechtenstein', label: ' Liechtenstein' }, { value: ' Lithuania', label: ' Lithuania ' }, { value: ' Luxembourg', label: ' Luxembourg' }, { value: ' Macedonia', label: ' Macedonia ' }, { value: ' Madagascar', label: ' Madagascar' }, { value: ' Malawi', label: ' Malawi ' }, { value: ' Malaysia', label: ' Malaysia' }, { value: ' Maldives', label: ' Maldives ' }, { value: ' Mali', label: ' Mali' }, { value: ' Malta', label: ' Malta' }, { value: ' Marshall Islands', label: ' Marshall Islands ' }, { value: ' Mauritania', label: ' Mauritania' }, { value: ' Mauritius', label: ' Mauritius' }, { value: ' Mexico', label: ' Mexico' }, { value: ' Micronesia', label: ' Micronesia' }, { value: ' Monaco', label: ' Monaco' }, { value: ' Mongolia', label: ' Mongolia' }, { value: ' Montenegro', label: ' Montenegro' }, { value: ' Morocco', label: ' Morocco' }, { value: ' Mozambique', label: ' Mozambique' }, { value: ' Myanmar', label: ' Myanmar' }, { value: ' Namibia', label: ' Namibia ' }, { value: ' Nauru', label: ' Nauru ' }, { value: ' Nepal', label: ' Nepal ' }, { value: ' Netherlands', label: ' Netherlands' }, { value: ' New Zealand', label: ' New Zealand' }, { value: ' Nicaragua', label: ' Nicaragua ' }, { value: ' Niger', label: ' Niger  ' }, { value: ' Nigeria', label: ' Nigeria ' }, { value: ' Norway', label: ' Norway ' }, { value: ' Oman', label: ' Oman ' }, { value: ' Pakistan', label: ' Pakistan ' }, { value: ' Palau', label: ' Palau ' }, { value: ' Panama', label: ' Panama ' }, { value: ' Papua New Guinea', label: ' Papua New Guinea ' }, { value: ' Paraguay', label: ' Paraguay ' }, { value: ' Peru', label: ' Peru' }, { value: ' Philippines', label: ' Philippines ' }, { value: ' Poland', label: ' Poland ' }, { value: ' Portugal', label: ' Portugal ' }, { value: ' Qatar', label: ' Qatar  ' }, { value: ' Republic of Korea (South Korea)', label: ' Republic of Korea (South Korea) ' }, { value: ' Republic of Moldova', label: ' Republic of Moldova ' }, { value: ' Romania', label: ' Romania' }, { value: ' Russian Federation', label: ' Russian Federation ' }, { value: ' Rwanda', label: ' Rwanda ' }, { value: ' Saint Kitts and Nevis', label: ' Saint Kitts and Nevis' }, { value: ' Saint Lucia', label: ' Saint Lucia ' }, { value: ' Saint Vincent and the Grenadines', label: ' Saint Vincent and the Grenadines ' }, { value: ' Samoa', label: ' Samoa ' }, { value: ' San Marino', label: ' San Marino' }, { value: ' Sao Tome and Principe', label: ' Sao Tome and Principe  ' }, { value: ' Saudi Arabia', label: ' Saudi Arabia ' }, { value: ' Senegal', label: ' Senegal' }, { value: ' Serbia', label: ' Serbia ' }, { value: ' Seychelles', label: ' Seychelles ' }, { value: ' Sierra Leone', label: ' Sierra Leone ' }, { value: ' Singapore', label: ' Singapore  ' }, { value: ' Slovakia', label: ' Slovakia  ' }, { value: ' Slovenia', label: ' Slovenia  ' }, { value: ' Solomon Islands', label: ' Solomon Islands' }, { value: ' Somalia', label: ' Somalia ' }, { value: ' South Africa', label: ' South Africa ' }, { value: ' South Sudan', label: ' South Sudan ' }, { value: ' Spain', label: ' Spain    ' }, { value: ' Sri Lanka', label: ' Sri Lanka ' }, { value: ' Sudan', label: ' Sudan    ' }, { value: ' Suriname', label: ' Suriname  ' }, { value: ' Swaziland', label: ' Swaziland  ' }, { value: ' Sweden', label: ' Sweden  ' }, { value: ' Switzerland', label: ' Switzerland ' }, { value: ' Syrian Arab Republic', label: ' Syrian Arab Republic  ' }, { value: ' Tajikistan', label: ' Tajikistan' }, { value: ' Thailand', label: ' Thailand ' }, { value: ' Timor-Leste', label: ' Timor-Leste ' }, { value: ' Togo', label: ' Togo  ' }, { value: ' Tonga', label: ' Tonga ' }, { value: ' Trinidad and Tobago', label: ' Trinidad and Tobago ' }, { value: ' Tunisia', label: ' Tunisia ' }, { value: ' Turkey', label: ' Turkey  ' }, { value: ' Turkmenistan', label: ' Turkmenistan ' }, { value: ' Tuvalu', label: ' Tuvalu  ' }, { value: ' Uganda', label: ' Uganda  ' }, { value: ' Ukraine', label: ' Ukraine  ' }, { value: ' United Arab Emirates', label: ' United Arab Emirates  ' }, { value: ' United Kingdom', label: ' United Kingdom' }, { value: ' United Republic of Tanzania', label: ' United Republic of Tanzania ' }, { value: ' United States of America', label: ' United States of America   ' }, { value: ' Uruguay', label: ' Uruguay ' }, { value: ' Uzbekistan', label: ' Uzbekistan ' }, { value: ' Vanuatu', label: ' Vanuatu ' }, { value: ' Venezuela', label: ' Venezuela  ' }, { value: ' Vietnam', label: ' Vietnam' }, { value: ' Yemen', label: ' Yemen ' }, { value: ' Zambia', label: ' Zambia ' }, { value: ' Zimbabwe', label: ' Zimbabwe ' }]).attributes({ placeholder: 'Part of customer address. Please select from dropdown list.' }).validation({ required: true }).label('Country'), nga.field('zip_code', 'string').attributes({ placeholder: 'Customer zip code', maxlength: 10 }).label('Zip code'), nga.field('telephone').attributes({ placeholder: 'Customer phone number' }).validation({ required: true }).label('Telephone'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    customerdata.editionView().title('<h4>Customer Data<i class="fa fa-chevron-right" aria-hidden="true"></i>Edit: {{ entry.values.firstname }} {{ entry.values.lastname }} </h4>').actions(['list']).fields([customerdata.creationView().fields(), nga.field('LoginData', 'referenced_list').label('Login Data').targetEntity(admin.getEntity('LoginData')).targetReferenceField('customer_id').targetFields([nga.field('username').label('Username'), nga.field('force_upgrade', 'boolean').label('Forced Upgrade'), nga.field('account_lock', 'boolean').label('Account Lock'), nga.field('auto_timezone', 'boolean').label('Auto TimeZone'), nga.field('pin').label('Pin')]).listActions(['edit']), nga.field('ADD ACCOUNT', 'template').label('').template('<ma-create-button entity-name="LoginData" class="pull-right" label="ADD ACCOUNT" default-values="{ customer_id: entry.values.id }"></ma-create-button>')]);

	    return customerdata;
	};

	module.exports = exports['default'];

/***/ },
/* 166 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	    var customergroup = admin.getEntity('CustomerGroups');

	    customergroup.listView().title('<h4>Customer Group <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('description').label('Description')]).listActions(['edit']).exportFields([customergroup.listView().fields()]);

	    customergroup.creationView().title('<h4>Customer Group <i class="fa fa-angle-right" aria-hidden="true"></i> Create: Customer Group</h4>').fields([nga.field('description').attributes({ placeholder: 'Name the group to identify customers types(for example staff)' }).validation({ required: true }).label('Description'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    customergroup.editionView().title('<h4>Customer Group <i class="fa fa-chevron-right" aria-hidden="true"></i>Edit: {{ entry.values.description }} </h4>').actions(['list']).fields([customergroup.creationView().fields()]);

	    return customergroup;
	};

	module.exports = exports['default'];

/***/ },
/* 167 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	    var devicemenu = admin.getEntity('DeviceMenus');
	    var appids = { 1: 'Android Set Top Box', 2: 'Android Smart Phone', 3: 'IOS', 4: 'Android Smart TV', 5: 'Samsung Smart TV', 6: 'Apple TV' };

	    devicemenu.listView().title('<h4>Main Menu <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('icon_url', 'file').template('<img src="{{ entry.values.icon_url }}" height="42" width="45" />').cssClasses('hidden-xs').label('Icon'), nga.field('title', 'string').isDetailLink(true).label('Title'), nga.field('url').map(function truncate(value) {
	        if (!value) {
	            return '';
	        }
	        return value.length > 25 ? value.substr(0, 25) + '...' : value;
	    }).cssClasses('hidden-xs').label('Url'), nga.field('menu_code', 'choice').attributes({ placeholder: 'Menu Code' }).choices([{ value: 0, label: 'Url' }, { value: 1, label: 'Live TV' }, { value: 2, label: 'EPG' }, { value: 3, label: 'Logout' }, { value: 4, label: 'Apps' }, { value: 8, label: 'Webview url' }, { value: 10, label: 'Network Test' }, { value: 11, label: 'Vod' }, { value: 12, label: 'Application menu' }, { value: 14, label: 'Video Url' }, { value: 20, label: 'Personal' }, { value: 21, label: 'Catchup' }, { value: 22, label: 'Language' }]).validation({ required: true }).label('Menu Code'), nga.field('position', 'string').label('Position'), nga.field('appid', 'template').map(function toarray(value) {
	        var thearray = JSON.parse("[" + value + "]");
	        var returnobj = {};
	        thearray.forEach(function (element) {
	            returnobj[element] = appids[element];
	        });
	        return returnobj;
	    }).template('<span ng-repeat="theappid in entry.values.appid track by $index" class="label label-default">{{theappid}}</span>').label('Applications IDs'), nga.field('is_guest_menu', 'boolean').label('Guest menu'), nga.field('isavailable', 'boolean').label('Available')]).filters([nga.field('q').label('').template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>').pinned(true)]).listActions(['edit', 'delete']).exportFields([devicemenu.listView().fields()]);

	    devicemenu.creationView().onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
	        progression.done();
	        $state.go($state.get('list'), { entity: entity.name() });
	        return false;
	    }]).title('<h4>Main Menu <i class="fa fa-angle-right" aria-hidden="true"></i> Create: Menu</h4>').fields([nga.field('title', 'string').attributes({ placeholder: 'Name of main menu item (for example Live TV)' }).validation({ required: true }).label('Title'), nga.field('url_type', 'choice').choices([{ value: 'internal', label: 'HTML Content Url' }, { value: 'external', label: 'Url Free Text' }]).template('<div>' + '<ma-choice-field field="field" value="entry.values.url_type"></ma-choice-field>' + '<small id="emailHelp" class="form-text text-muted">Choose from dropdown list the type of Url.</small>' + '</div>').label('Url Type'), nga.field('url', 'reference').targetEntity(admin.getEntity('htmlContent')).targetField(nga.field('url')).label('HTML Content Url').template('<ma-field ng-if="entry.values.url_type === \'internal\' " field="::field" value="entry.values[field.name()]" entry="entry" entity="::entity" form="formController.form" datastore="::formController.dataStore"></ma-field>', true), nga.field('url').transform(function (value, entry) {
	        if (isNaN(value)) {
	            return value;
	        } else {
	            var url = window.location.origin + '/api/htmlContentApp/' + value;
	            return url;
	        }
	    }).template('<ma-field ng-if="entry.values.url_type === \'external\' " field="::field" value="entry.values[field.name()]" entry="entry" entity="::entity" form="formController.form" datastore="::formController.dataStore"></ma-field>', true), nga.field('icon_url', 'file').uploadInformation({ 'url': '/file-upload/single-file/device_menu/icon_url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.icon_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.icon_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">240x240 px, not larger than 600 KB</small></div>').validation({
	        validator: function validator(value) {
	            if (value == null) {
	                throw new Error('Please, choose icon');
	            } else {
	                var icon_url = document.getElementById('icon_url');
	                if (icon_url.value.length > 0) {
	                    if (icon_url.files[0].size > 614400) {
	                        throw new Error('Your Icon is too Big, not larger than 600 KB');
	                    }
	                }
	            }
	        }
	    }).label('Icon *'), nga.field('menu_code', 'choice').attributes({ placeholder: 'Choose from dropdown list the type of main menu item you are creating' }).choices([{ value: 0, label: 'Url' }, { value: 1, label: 'Live TV' }, { value: 2, label: 'EPG' }, { value: 3, label: 'Logout' }, { value: 4, label: 'Apps' }, { value: 8, label: 'Webview url' }, { value: 10, label: 'Network Test' }, { value: 11, label: 'Vod' }, { value: 12, label: 'Application menu' }, { value: 14, label: 'Video Url' }, { value: 20, label: 'Personal' }, { value: 21, label: 'Catchup' }, { value: 22, label: 'Language' }]).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select Menu Code');
	            }
	        }
	    }).label('Menu Code *'), nga.field('appid', 'choices').attributes({ placeholder: 'Choose from dropdown list the device application this main menu will belong to' }).choices([{ value: 1, label: 'Android Set Top Box' }, { value: 2, label: 'Android Smart Phone' }, { value: 3, label: 'IOS' }, { value: 4, label: 'Android Smart TV' }, { value: 5, label: 'Samsung Smart TV' }, { value: 6, label: 'Apple TV' }]).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select Applications IDs');
	            }
	        }
	    }).label('Applications IDs *'), nga.field('position', 'string').attributes({ placeholder: 'Position of this menu item in main menu ex:if you place number 1 this menu item will be the first one in main menu' }).validation({ required: true }).label('Position'), nga.field('is_guest_menu', 'choice').defaultValue(false).choices([{ value: true, label: 'Create for guests only' }, { value: false, label: 'Create for clients only' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Guest menu'), nga.field('isavailable', 'boolean').attributes({ placeholder: 'Is Available' }).validation({ required: true }).label('Is Available'), nga.field('menu_description').attributes({ placeholder: 'Menu Description' }).validation({ required: true }).label('Menu Description'), nga.field('menu_level').defaultValue(1).cssClasses('hidden').label(''), nga.field('parent_id').defaultValue(0).cssClasses('hidden').label(''), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    devicemenu.editionView().title('<h4>Main Menu <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.title }}</h4>').actions(['list']).fields([nga.field('title', 'string').attributes({ placeholder: 'Name of main menu item (for example Live TV)' }).validation({ required: true }).label('Title'), nga.field('url', 'string').attributes({ placeholder: 'In case you are adding an external application (for example youtube) fill the application url.' }).label('Url'), nga.field('icon_url', 'file').uploadInformation({ 'url': '/file-upload/single-file/device_menu/icon_url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.icon_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.icon_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">240x240 px, not larger than 600 KB</small></div>').validation({
	        validator: function validator(value) {
	            if (value == null) {
	                throw new Error('Please, choose icon');
	            } else {
	                var icon_url = document.getElementById('icon_url');
	                if (icon_url.value.length > 0) {
	                    if (icon_url.files[0].size > 614400) {
	                        throw new Error('Your Icon is too Big, not larger than 600 KB');
	                    }
	                }
	            }
	        }
	    }).label('Icon *'), nga.field('menu_code', 'choice').attributes({ placeholder: 'Choose from dropdown list the type of main menu item you are creating' }).choices([{ value: 0, label: 'Url' }, { value: 1, label: 'Live TV' }, { value: 2, label: 'EPG' }, { value: 3, label: 'Logout' }, { value: 4, label: 'Apps' }, { value: 8, label: 'Webview url' }, { value: 10, label: 'Network Test' }, { value: 11, label: 'Vod' }, { value: 12, label: 'Application menu' }, { value: 14, label: 'Video Url' }, { value: 20, label: 'Personal' }, { value: 21, label: 'Catchup' }, { value: 22, label: 'Language' }]).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select Menu Code');
	            }
	        }
	    }).label('Menu Code *'), nga.field('appid', 'choices').attributes({ placeholder: 'Choose from dropdown list the device application this main menu will belong to' }).choices([{ value: 1, label: 'Android Set Top Box' }, { value: 2, label: 'Android Smart Phone' }, { value: 3, label: 'IOS' }, { value: 4, label: 'Android Smart TV' }, { value: 5, label: 'Samsung Smart TV' }, { value: 6, label: 'Apple TV' }]).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select Applications IDs');
	            }
	        }
	    }).label('Applications IDs *'), nga.field('position', 'string').attributes({ placeholder: 'Position of this menu item in main menu ex:if you place number 1 this menu item will be the first one in main menu' }).validation({ required: true }).label('Position'), nga.field('is_guest_menu', 'choice').defaultValue(false).choices([{ value: true, label: 'Create for guests only' }, { value: false, label: 'Create for clients only' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Guest menu'), nga.field('isavailable', 'boolean').attributes({ placeholder: 'Is Available' }).validation({ required: true }).label('Is Available'), nga.field('menu_description').attributes({ placeholder: 'Menu Description' }).validation({ required: true }).label('Menu Description'), nga.field('menu_level').defaultValue(1).cssClasses('hidden').label(''), nga.field('parent_id').defaultValue(0).cssClasses('hidden').label(''), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    return devicemenu;
	};

	module.exports = exports['default'];

/***/ },
/* 168 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	    var systemmenu = admin.getEntity('SystemMenu');

	    systemmenu.listView().title('<h4>System Menu <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('id', 'string').label('Menu Code'), nga.field('title', 'string').label('Menu Title').map(function deepth(value, entry) {
	        if (entry.parent_menu_code !== 'root') value = "--" + value;
	        return value;
	    }), nga.field('menu_order', 'number').label('Menu Order'), nga.field('link', 'string').label('Link'), nga.field('isavailable', 'boolean').label('Available')]).listActions(['edit']).exportFields([systemmenu.listView().fields()]);

	    systemmenu.creationView().title('<h4>system Menu <i class="fa fa-angle-right" aria-hidden="true"></i> Create: Sytem Menu</h4>').fields([nga.field('parent_menu_code', 'reference').targetEntity(admin.getEntity('SystemMenu')).targetField(nga.field('menu_name')).attributes({ placeholder: 'Leave empty for root menu' }).permanentFilters({
	        root: true // display only the published posts
	    }).label('Parent Menu Code'), nga.field('id', 'string').label('Menu Code'), nga.field('title', 'string').label('Menu Title'), nga.field('menu_order', 'number').label('Menu Order'), nga.field('entity_name', 'string').label('System Entity Name'), nga.field('icon', 'string').label('Icon'), nga.field('link', 'string').label('Link'), nga.field('template', 'string').label('Template'), nga.field('isavailable', 'boolean').label('Available').defaultValue(true).validation({ required: true }), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    systemmenu.editionView().title('<h4>Users <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.username }}</h4>').actions(['list']).fields([systemmenu.creationView().fields()]);

	    return systemmenu;
	};

	module.exports = exports['default'];

/***/ },
/* 169 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
		var devices = admin.getEntity('Devices');
		devices.listView().title('<h4>Devices <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions(['<sendpush type="softwareupdate" selection="selection"></sendpush>', '<sendpush type="deletedata" selection="selection"></sendpush>', '<sendpush type="deletesharedpreferences" selection="selection"></sendpush>']).actions(['batch', 'export', 'filter']).fields([nga.field('username').label('Username'), nga.field('device_ip', 'string').map(function truncate(value) {
			if (!value) {
				return '';
			}
			return value.length > 14 ? value.substr(0, 14) + '...' : value;
		}).label('IP'), nga.field('device_mac_address', 'string').label('Ethernet'), nga.field('device_wifimac_address', 'string').label('WiFi'), nga.field('ntype').map(function app(value) {
			if (value == 1) {
				return 'Wifi';
			} else if (value == 2) {
				return 'Ethernet';
			} else if (value == 3) {
				return '(GPRS)';
			}
		}).label('Ntype'), nga.field('appid').map(function app(value) {
			if (value === 1) {
				return 'Box';
			} else if (value === 2) {
				return 'Android';
			} else if (value === 3) {
				return 'Ios';
			} else if (value === 4) {
				return 'Stv';
			} else if (value === 5) {
				return 'Samsung';
			}
		}).label('App'), nga.field('app_version').label('App Version'), nga.field('screen_resolution').label('Screen Resolution'), nga.field('hdmi').label('HDMI'), nga.field('device_brand').map(function truncate(value) {
			if (!value) {
				return '';
			}
			return value.length > 14 ? value.substr(0, 14) + '...' : value;
		}).label('Device Brand'), nga.field('device_active', 'boolean').label('Device Active'), nga.field('api_version', 'string').label('Api Version')]).filters([nga.field('q').label('').template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>').pinned(true), nga.field('appid', 'choice').choices([{ value: 1, label: 'Box' }, { value: 2, label: 'Android' }, { value: 3, label: 'Ios' }, { value: 4, label: 'Stv' }, { value: 5, label: 'Samsung' }]).attributes({ placeholder: 'App Id' }).label('App ID'), nga.field('app_version').attributes({ placeholder: 'App Version' }).label('App Version'), nga.field('api_version').attributes({ placeholder: 'Api Version' }).label('Api Version'), nga.field('ntype', 'choice').choices([{ value: 1, label: 'Wifi' }, { value: 2, label: 'Ethernet' }, { value: 3, label: 'GPRS' }]).attributes({ placeholder: 'Ntype' }).label('Ntype'), nga.field('device_active', 'boolean').filterChoices([{ value: true, label: 'Active' }, { value: false, label: 'Not Active' }]).label('Device Active'), nga.field('hdmi').attributes({ placeholder: 'HDMI' }).label('HDMI'), nga.field('username').attributes({ placeholder: 'Username' }).label('Username')]).listActions(['edit']).exportFields([devices.listView().fields()]);

		devices.creationView().title('<h4>Devices <i class="fa fa-angle-right" aria-hidden="true"></i> Create: Device</h4>').fields([nga.field('username').attributes({ placeholder: 'Username' }).validation({ required: true }).editable(false).label('Username'), nga.field('googleappid', 'string').editable(false).attributes({ placeholder: 'Google App Id' }).label('Google App ID'), nga.field('device_active', 'boolean').validation({ required: true }).label('Device Active'), nga.field('device_mac_address', 'string').attributes({ placeholder: 'Device Mac Address' }).validation({ required: true }).editable(false).label('Device Mac Address'), nga.field('device_wifimac_address', 'string').attributes({ placeholder: 'Device Wifi Mac Address' }).validation({ required: true }).editable(false).label('Device Wifi Mac Address'), nga.field('device_ip', 'string').attributes({ placeholder: 'Device IP' }).validation({ required: true }).editable(false).label('Device IP'), nga.field('device_id', 'string').attributes({ placeholder: 'Device ID' }).validation({ required: true }).editable(false).label('Device ID'), nga.field('ntype', 'string').attributes({ placeholder: 'Ntype' }).validation({ required: true }).editable(false).label('Ntype'), nga.field('appid', 'string').attributes({ placeholder: 'App ID' }).validation({ required: true }).editable(false).label('App ID'), nga.field('api_version', 'string').attributes({ placeholder: 'Api Version' }).validation({ required: true }).editable(false).label('Api Version'), nga.field('firmware', 'string').editable(false).label('Firmware'), nga.field('os').editable(false).label('Os'), nga.field('screen_resolution').editable(false).label('Screen Resolution'), nga.field('hdmi').editable(false).label('HDMI'), nga.field('device_brand').editable(false).label('Device Brand'), nga.field('app_version', 'string').editable(false).validation({ required: true }).label('App Version'), nga.field('createdAt', 'datetime').editable(false).label('First Login'), nga.field('updatedAt', 'datetime').editable(false).label('Last Login'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

		devices.editionView().title('<h4>Devices <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.username }}</h4>').actions(['list']).fields([devices.creationView().fields()]);

		return devices;
	};

	module.exports = exports['default'];

/***/ },
/* 170 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	        value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	        var epgdata = admin.getEntity('EpgData');
	        epgdata.listView().title('<h4>Epg Data <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').actions(['batch', 'export', 'create']).fields([nga.field('channel_number').cssClasses('hidden-xs').label('Nr'), nga.field('title', 'string').label('Title'), nga.field('episode_title', 'string').label('Episode title'), nga.field('short_name', 'string').cssClasses('hidden-xs').label('Short Name'), nga.field('event_category', 'string').label('Category'), nga.field('event_rating', 'number').attributes({ min: 1, max: 10 }).label('Rating'), nga.field('event_language', 'string').label('Language'), nga.field('short_description').label('Short Description'), nga.field('long_description', 'text').map(function truncate(value) {
	                if (!value) {
	                        return 'No Description';
	                }
	                return value.length > 40 ? value.substr(0, 40) + '...' : value;
	        }).cssClasses('hidden-xs').label('Long Description'), nga.field('program_start', 'datetime').cssClasses('hidden-xs').label('Program Start'), nga.field('program_end', 'datetime').cssClasses('hidden-xs').label('Program End'), nga.field('duration_seconds', 'number').cssClasses('hidden-xs').label('Duration'), nga.field('timezone', 'number').map(function truncate(value) {
	                if (!value) {
	                        return "No Timezone";
	                }
	        }).cssClasses('hidden-xs').label('Timezone')]).filters([nga.field('q').label('').template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>').pinned(true)]).listActions(['edit']).exportFields([epgdata.listView().fields()]);

	        epgdata.creationView().onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
	                progression.done();
	                $state.go($state.get('list'), { entity: entity.name() });
	                return false;
	        }]).title('<h4>Epg Data <i class="fa fa-angle-right" aria-hidden="true"></i> Create: Epg Data</h4>').fields([nga.field('channel_number', 'string').attributes({ placeholder: 'Channel Number' }).validation({ required: true }).label('Channel Number'), nga.field('timezone', 'choice').choices([{ value: -12, label: '(UTC-12:00) International Date Line West' }, { value: -11, label: '(UTC-11:00) Samoa' }, { value: -10, label: '(UTC-10:00) Hawaii' }, { value: -9, label: '(UTC-9:00) Alaska' }, { value: -8, label: '(UTC-8:00) Pacific Time (US & Canada)' }, { value: -7, label: '(UTC-7:00) Arizona, La Paz, Mazatlan' }, { value: -6, label: '(UTC-6:00) Central America, Monterrey, Mexico City ' }, { value: -5, label: '(UTC-5:00) Bogota, Lima, Quito, Indiana' }, { value: -4, label: '(UTC-4:00) Atlantic Time (Canada), Manaus ' }, { value: -3, label: '(UTC-3:00) Brasilia, Buenos Aires, Cayenne' }, { value: -2, label: '(UTC-2:00) Mid-Atlantic' }, { value: -1, label: '(UTC-1:00) Azores, Cape Verde Is.' }, { value: 0, label: '(UTC 0:00) Dublin, Lisbon, London, Reykjavik' }, { value: +1, label: '(UTC+1:00) Amsterdam, Berlin, Rome, Paris, Prague, Skopje ' }, { value: +2, label: '(UTC+2:00) Athens, Istanbul, Cairo, Helsinki, Kyiv, Vilnius ' }, { value: +3, label: '(UTC+3:00) Baghdad, Kuwait, Moscow, St. Petersburg, Nairobi' }, { value: +4, label: '(UTC+4:00) Abu Dhabi, Baku, Muscat' }, { value: +5, label: '(UTC+5:00) Ekaterinburg, Karachi, Tashkent' }, { value: +6, label: '(UTC+6:00) Astana, Dhaka, Novosibirsk' }, { value: +7, label: '(UTC+7:00) Bangkok, Hanoi, Jakarta' }, { value: +8, label: '(UTC+8:00) Beijing, Hong Kong, Kuala Lumpur, Perth, Taipei' }, { value: +9, label: '(UTC+9:00) Sapporo, Tokyo, Seoul' }, { value: +10, label: '(UTC+10:00) Brisbane, Melbourne, Sydney' }, { value: +11, label: '(UTC+11:00) Magadan, Solomon Is.' }, { value: +12, label: '(UTC+12:00) Auckland, Fiji' }]).attributes({ placeholder: 'Select Timezone' }).validation({ required: false }).label('Timezone'), nga.field('title', 'string').attributes({ placeholder: 'Title' }).validation({ required: true }).label('Title'), nga.field('episode_title', 'string').map(function truncate(value) {
	                if (!value) {
	                        return "-";
	                } else return value;
	        }).label('Episode title'), nga.field('short_name', 'string').attributes({ placeholder: 'Short Name' }).validation({ required: true }).label('Short Name'), nga.field('short_description', 'string').attributes({ placeholder: 'Short Description' }).validation({ required: true }).label('Short Description'), nga.field('long_description', 'text').attributes({ placeholder: 'Long Description' }).validation({ required: true }).label('Long Description'), nga.field('event_category', 'string').map(function truncate(value) {
	                if (!value) {
	                        return "-";
	                } else return value;
	        }).label('Category'), nga.field('event_rating', 'number').attributes({ min: 1, max: 10 }).label('Rating (1-10)'), nga.field('event_language', 'string').map(function truncate(value) {
	                if (!value) {
	                        return "-";
	                } else return value;
	        }).label('Language'), nga.field('program_start', 'datetime').attributes({ placeholder: 'Program Start' }).validation({ required: true }).label('Program Start'), nga.field('program_end', 'datetime').attributes({ placeholder: 'Program End' }).validation({ required: true }).label('Program End'), nga.field('duration_seconds', 'number').attributes({ placeholder: 'Duration' }).validation({ required: true }).label('Duration'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	        epgdata.editionView().title('<h4>Epg Data <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.title }}</h4>').actions(['list']).fields([epgdata.creationView().fields()]);

	        return epgdata;
	};

	module.exports = exports['default'];

/***/ },
/* 171 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _epg_logsHtml = __webpack_require__(172);

	var _epg_logsHtml2 = _interopRequireDefault(_epg_logsHtml);

	exports['default'] = function (nga, admin) {
	    var epgImport = admin.getEntity('epgimport');
	    epgImport.listView().title('<h4>Epg Data <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').actions(['create']).fields([nga.field('channel_number').cssClasses('hidden-xs').label('Nr'), nga.field('title', 'string').label('Title'), nga.field('short_name', 'string').cssClasses('hidden-xs').label('Short Name'), nga.field('short_description').label('Short Description'), nga.field('program_start', 'datetime').cssClasses('hidden-xs').label('Program Start'), nga.field('program_end', 'datetime').cssClasses('hidden-xs').label('Program End'), nga.field('duration_seconds', 'number').cssClasses('hidden-xs').label('Duration'), nga.field('timezone', 'number').map(function truncate(value) {
	        if (!value) {
	            return "No Timezone";
	        }
	    }).cssClasses('hidden-xs').label('Timezone')]).batchActions([]).filters([nga.field('q').label('').template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>').pinned(true)]);

	    epgImport.creationView().onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
	        return false;
	    }]).title('<h4>Epg Data <i class="fa fa-angle-right" aria-hidden="true"></i> Import EPG</h4>').fields([nga.field('channel_number', 'string').attributes({ placeholder: 'Channel number' }).validation({ required: false }).label('Enter channel number'), nga.field('delete_existing', 'boolean').attributes({ placeholder: 'deleteorappend' }).validation({ required: true }).label('Delete existing data'), nga.field('timezone', 'number').attributes({ placeholder: 0 }).validation({
	        validator: function validator(value) {
	            if (value == null) value = 0;
	            if (value < -12 || value > 12) throw new Error('Timezone should be in the range of [-12:12]');
	        }
	    }).label('Generated with timezone:'), nga.field('encoding', 'choice').attributes({ placeholder: 'utf-8' }).choices([{ value: 'ascii', label: 'ascii' }, { value: 'utf-8', label: 'utf-8' }, { value: 'ISO-8859-1', label: 'latin1 ' }]).label('Epg file encoding'), nga.field('epg_file', 'file').uploadInformation({ 'url': '/file-upload/single-file/epg/epg_file', 'accept': 'image/*, .csv, text/xml, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'apifilename': 'result', multiple: true }).template('<div class="row">' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.epg_file"></ma-file-field></div>' + '<div class="col-xs-12 col-sm-1" style="display: none;"><img src="{{ entry.values.epg_file }}"/></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">Expected file types: csv and xml</small></div>').label('File input *'), nga.field('epg_url', 'string').attributes({ placeholder: 'Url of the epg file' }).validation({ required: false }).label('Enter the url for the epg file'), nga.field('template').label('').template(_epg_logsHtml2['default'])]);

	    return epgImport;
	};

	module.exports = exports['default'];

/***/ },
/* 172 */
/***/ function(module, exports) {

	module.exports = "<!DOCTYPE html>\r\n<html >\r\n<head>\r\n    <title>Simple Invoicing - Built with AngularJS</title>\r\n    <meta charset='utf-8'>\r\n    <meta name=\"description\" content=\"AngularJS and Angular Code Example for creating Invoices and Invoicing Application\">\r\n    <script src=\"https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular.min.js\"></script>\r\n    <script type=\"text/javascript\" src=\"js/main.js\"></script>\r\n</head>\r\n<body>\r\n\r\n<div class=\"container\" ng-app=\"myApp\" ng-controller=\"logsCtrl\">\r\n    <div class=\"row\">\r\n        <div class=\"btn-group inline pull-right\">\r\n            <div class=\"btn btn-small\"><see-logs post=\"entry\" class=\"pull-right\" data-method=\"ctrlFn\"></see-logs></div>\r\n            <div class=\"btn btn-small\"><ma-back-button class=\"pull-right\" label=\"Cancel\"></ma-back-button></div>\r\n        </div>\r\n    </div>\r\n    <hr><br/><br/><br/><br/>\r\n\r\n    <div class=\"row\">\r\n        <table class=\"table\">\r\n            <thead>\r\n            <tr>\r\n                <th style=\"border-bottom: none;\">{{records1[0]}}</th>\r\n                <th style=\"border-bottom: none;\">{{records1[1]}}</th>\r\n                <th style=\"border-bottom: none;\">{{records1[2]}}</th>\r\n                <th style=\"border-bottom: none;\">{{records1[3]}}</th>\r\n            </tr>\r\n            </thead>\r\n            <tbody>\r\n            <tr ng-repeat=\"x in records.message\">\r\n                <td>{{x.file_name}}</td>\r\n                <td>{{x.saved_records}}</td>\r\n                <td>{{x.non_saved_records}}</td>\r\n                <td>{{x.error_log}}</td>\r\n            </tr>\r\n            </tbody>\r\n        </table>\r\n    </div>\r\n</div>\r\n\r\n</body>\r\n</html>";

/***/ },
/* 173 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	var _filter_genre_btnHtml = __webpack_require__(137);

	var _filter_genre_btnHtml2 = _interopRequireDefault(_filter_genre_btnHtml);

	exports['default'] = function (nga, admin) {
	    var genre = admin.getEntity('Genres');
	    genre.listView().title('<h4>Genres <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('id', 'string').isDetailLink(true).label('ID'), nga.field('description', 'string').label('Description'), nga.field('icon_url', 'file').template('<img src="{{ entry.values.icon_url }}" height="35" width="35" />').cssClasses('hidden-xs').label('Icon'), nga.field('is_available', 'boolean').label('Available'), nga.field('channels').map(function total(value, entry) {
	        var obj = [];
	        for (var i = value.length - 1; i >= 0; i--) {
	            obj[i] = value[i].total;
	            return obj[i];
	        }
	    }).label('Number of Channels')]).listActions(['edit', 'delete']).exportFields([genre.listView().fields()]);

	    genre.deletionView().title('<h4>Genre <i class="fa fa-angle-right" aria-hidden="true"></i> Remove <span style ="color:red;"> {{ entry.values.description }} </span></h4>').actions(['<ma-back-button entry="entry" entity="entity"></ma-back-button>']);

	    genre.creationView().title('<h4>Genres <i class="fa fa-angle-right" aria-hidden="true"></i> Create: Genre</h4>').fields([nga.field('description', 'string').attributes({ placeholder: 'Name of the channel genre/category' }).validation({ required: true }).label('Description'), nga.field('is_available', 'boolean').attributes({ placeholder: 'Is Available' }).validation({ required: true }).label('Is Available'), nga.field('icon_url', 'file').uploadInformation({ 'url': '/file-upload/single-file/genre/icon_url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.icon_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.icon_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">120x120 px, not larger than 200 KB</small></div>').validation({
	        validator: function validator(value) {
	            if (value == null) {
	                throw new Error('Please, choose icon');
	            } else {
	                var icon_url = document.getElementById('icon_url');
	                if (icon_url.value.length > 0) {
	                    if (icon_url.files[0].size > 204800) {
	                        throw new Error('Your Icon is too Big, not larger than 200 KB');
	                    }
	                }
	            }
	        }
	    }).label('Icon *'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    genre.editionView().title('<h4>Genres <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.description }}</h4>').actions(['list']).fields([genre.creationView().fields(), nga.field('', 'referenced_list').label('Channel').targetEntity(admin.getEntity('Channels')).targetReferenceField('genre_id').targetFields([nga.field('channel_number').label('Nr'), nga.field('icon_url', 'file').template('<img src="{{ entry.values.icon_url }}" height="35" width="35" />').label('Icon'), nga.field('title', 'string').attributes({ placeholder: 'Title' }).validation({ required: true }).label('Title')]).listActions(['edit']), nga.field('template').label('').template(_filter_genre_btnHtml2['default'])]);

	    return genre;
	};

	module.exports = exports['default'];

/***/ },
/* 174 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	    var logindata = admin.getEntity('LoginData');
	    logindata.listView().title('<h4>Login Accounts <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('customer_id', 'reference').targetEntity(admin.getEntity('CustomerData')).targetField(nga.field('firstname').map(function (value, entry) {
	        return entry.firstname + ' ' + entry.lastname;
	    })).cssClasses('hidden-xs').label('Customer'), nga.field('username').isDetailLink(true).label('Username'), nga.field('channel_stream_source_id', 'reference').targetEntity(admin.getEntity('ChannelStreamSources')).targetField(nga.field('stream_source')).cssClasses('hidden-xs').label('Channel Stream Source'), nga.field('vod_stream_source', 'reference').targetEntity(admin.getEntity('VodStreamSources')).targetField(nga.field('description')).cssClasses('hidden-xs').label('VOD Stream Source'), nga.field('pin', 'string').cssClasses('hidden-xs').label('Pin'), nga.field('activity_timeout').cssClasses('hidden-xs').label('Activity Time Out'), nga.field('timezone', 'number').cssClasses('hidden-xs').label('Timezone'), nga.field('account_lock', 'boolean').cssClasses('hidden-xs').label('Account Locked'), nga.field('get_messages', 'boolean').label('Get messages'), nga.field('show_adult', 'boolean').label('Show adult'), nga.field('auto_timezone', 'boolean').cssClasses('hidden-xs').label('Auto Timezone')]).filters([nga.field('username', 'string').label('Search for client account'), nga.field('q').label('').template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>').pinned(true)]).listActions(['edit']);

	    logindata.creationView().title('<h4>Login Accounts <i class="fa fa-angle-right" aria-hidden="true"></i> Create: Login Account</h4>').onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
	        progression.done();
	        $state.go($state.get('edit'), { entity: entity.name(), id: entry._identifierValue });
	        return false;
	    }]).fields([nga.field('customer_id', 'reference').targetEntity(admin.getEntity('CustomerData')).targetField(nga.field('firstname').map(function (v, e) {
	        return e.firstname + ' ' + e.lastname;
	    })).remoteComplete(true, {
	        refreshDelay: 300,
	        // populate choices from the response of GET
	        searchQuery: function searchQuery(search) {
	            return { q: search };
	        }
	    }).perPage(5) // limit the number of results to 5
	    .attributes({ placeholder: 'Select Customer' }).label('Customer *').validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select Customer');
	            }
	        }
	    }), nga.field('username', 'string').attributes({ placeholder: 'Number,lowercase letter, and at least 2 or more characters' }).label('Username').validation({ required: true, pattern: '^[a-z\\d]{2,}$' }), nga.field('mac_address', 'string').attributes({ maxlength: 12 }).label('Sale mac address'), nga.field('password', 'password').attributes({ placeholder: '4 or more characters', title: '4 or more characters' }).label('Password').validation({ required: true, pattern: '.{4,}' }), nga.field('channel_stream_source_id', 'reference').defaultValue(1).targetEntity(admin.getEntity('ChannelStreamSources')).targetField(nga.field('stream_source')).attributes({ placeholder: 'Choose from dropdown list channel stream source for this customer' }).label('Channel Stream Source *').perPage(-1).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select Channel Stream Source');
	            }
	        }
	    }), nga.field('vod_stream_source', 'reference').defaultValue(1).targetEntity(admin.getEntity('VodStreamSources')).targetField(nga.field('description')).attributes({ placeholder: 'Choose from dropdown list VOD Stream Source for this customer' }).label('VOD Stream Source *').perPage(-1).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select VOD Stream Source');
	            }
	        }
	    }), nga.field('pin', 'string').attributes({ placeholder: 'Must contain 4 numbers', title: 'Must contain 4 numbers' }).validation({ required: true, pattern: '(?=.*\\d)[0-9]{4}' }).label('Pin'), nga.field('activity_timeout', 'string').attributes({ placeholder: 'Activity time out' }).validation({ required: true }).defaultValue(10800).label('Activity Time Out (sec)'), nga.field('comment').attributes({ placeholder: 'Comments' }).validation({ required: false }).label('Comments'), nga.field('timezone', 'choice').choices([{ value: -12, label: '(UTC-12:00) International Date Line West' }, { value: -11, label: '(UTC-11:00) Samoa' }, { value: -10, label: '(UTC-10:00) Hawaii' }, { value: -9, label: '(UTC-9:00) Alaska' }, { value: -8, label: '(UTC-8:00) Pacific Time (US & Canada)' }, { value: -7, label: '(UTC-7:00) Arizona, La Paz, Mazatlan' }, { value: -6, label: '(UTC-6:00) Central America, Monterrey, Mexico City ' }, { value: -5, label: '(UTC-5:00) Bogota, Lima, Quito, Indiana' }, { value: -4, label: '(UTC-4:00) Atlantic Time (Canada), Manaus ' }, { value: -3, label: '(UTC-3:00) Brasilia, Buenos Aires, Cayenne' }, { value: -2, label: '(UTC-2:00) Mid-Atlantic' }, { value: -1, label: '(UTC-1:00) Azores, Cape Verde Is.' }, { value: 0, label: '(UTC 0:00) Dublin, Lisbon, London, Reykjavik' }, { value: +1, label: '(UTC+1:00) Amsterdam, Berlin, Rome, Paris, Prague, Skopje ' }, { value: +2, label: '(UTC+2:00) Athens, Istanbul, Cairo, Helsinki, Kyiv, Vilnius ' }, { value: +3, label: '(UTC+3:00) Baghdad, Kuwait, Moscow, St. Petersburg, Nairobi' }, { value: +4, label: '(UTC+4:00) Abu Dhabi, Baku, Muscat' }, { value: +5, label: '(UTC+5:00) Ekaterinburg, Karachi, Tashkent' }, { value: +6, label: '(UTC+6:00) Astana, Dhaka, Novosibirsk' }, { value: +7, label: '(UTC+7:00) Bangkok, Hanoi, Jakarta' }, { value: +8, label: '(UTC+8:00) Beijing, Hong Kong, Kuala Lumpur, Perth, Taipei' }, { value: +9, label: '(UTC+9:00) Sapporo, Tokyo, Seoul' }, { value: +10, label: '(UTC+10:00) Brisbane, Melbourne, Sydney' }, { value: +11, label: '(UTC+11:00) Magadan, Solomon Is.' }, { value: +12, label: '(UTC+12:00) Auckland, Fiji' }]).attributes({ placeholder: 'Select client timezone depending on country' }).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select Timezone');
	            }
	        }
	    }).label('Timezone *'), nga.field('player', 'choice').choices([{ value: 'default', label: 'Default Player' }, { value: 'exoplayer', label: 'Exoplayer' }]).attributes({ placeholder: 'Player' }).defaultValue('default').validation({ required: true }).label('Player'), nga.field('get_messages', 'choice').defaultValue(false).choices([{ value: false, label: 'Disabled' }, { value: true, label: 'Enabled' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Get messages'), nga.field('get_ads', 'choice').defaultValue(false).choices([{ value: false, label: 'Disabled' }, { value: true, label: 'Enabled' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Receive ads'), nga.field('show_adult', 'choice').defaultValue(false).choices([{ value: false, label: 'Disabled' }, { value: true, label: 'Enabled' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Show adult content'), nga.field('auto_timezone', 'choice').defaultValue(false).choices([{ value: false, label: 'Disabled' }, { value: true, label: 'Enabled' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Auto Timezone'), nga.field('account_lock', 'choice').defaultValue(false).choices([{ value: false, label: 'Disabled' }, { value: true, label: 'Enabled' }]).attributes({ placeholder: 'Choose from dropdown list' }).label('Account Locked').validation({ required: true }), nga.field('beta_user', 'choice').attributes({ placeholder: 'Choose from dropdown list' }).defaultValue(false).choices([{ value: false, label: 'Disabled' }, { value: true, label: 'Enabled' }]).label('Is tester').validation({ required: true }), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    logindata.editionView().title('<h4>Login Accounts <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.username }}</h4>').actions(['list']).fields([nga.field('customer_id', 'reference').targetEntity(admin.getEntity('CustomerData')).targetField(nga.field('firstname', 'template').map(function (v, e) {
	        return e.firstname + ' ' + e.lastname;
	    })).attributes({ placeholder: 'Select Customer' }).label('Customer *').perPage(1000).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select Customer');
	            }
	        }
	    }), nga.field('username', 'string').attributes({ placeholder: 'Username', readOnly: true }).label('Username').validation({ required: true }), nga.field('mac_address', 'string').attributes({ maxlength: 12 }).label('Sale mac address'), nga.field('password', 'password').attributes({ placeholder: 'Password' }).label('Password').validation({ required: true }), nga.field('pin', 'string').attributes({ placeholder: 'Pin' }).validation({ required: true }).label('Pin'), nga.field('channel_stream_source_id', 'reference').targetEntity(admin.getEntity('ChannelStreamSources')).targetField(nga.field('stream_source')).attributes({ placeholder: 'Select Channel Stream Source' }).label('Channel Stream Source *').validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select Channel Stream Source');
	            }
	        }
	    }), nga.field('vod_stream_source', 'reference').targetEntity(admin.getEntity('VodStreamSources')).targetField(nga.field('description')).attributes({ placeholder: 'Select Vod Stream Source' }).label('VOD Stream Source *').validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select VOD Stream Source');
	            }
	        }
	    }), nga.field('activity_timeout', 'string').attributes({ placeholder: 'Activity time out' }).validation({ required: true }).defaultValue(10800).label('Activity Time Out'), nga.field('comment').attributes({ placeholder: 'Comments' }).validation({ required: false }).label('Comments'), nga.field('timezone', 'choice').choices([{ value: -12, label: '(UTC-12:00) International Date Line West' }, { value: -11, label: '(UTC-11:00) Samoa' }, { value: -10, label: '(UTC-10:00) Hawaii' }, { value: -9, label: '(UTC-9:00) Alaska' }, { value: -8, label: '(UTC-8:00) Pacific Time (US & Canada)' }, { value: -7, label: '(UTC-7:00) Arizona, La Paz, Mazatlan' }, { value: -6, label: '(UTC-6:00) Central America, Monterrey, Mexico City ' }, { value: -5, label: '(UTC-5:00) Bogota, Lima, Quito, Indiana' }, { value: -4, label: '(UTC-4:00) Atlantic Time (Canada), Manaus ' }, { value: -3, label: '(UTC-3:00) Brasilia, Buenos Aires, Cayenne' }, { value: -2, label: '(UTC-2:00) Mid-Atlantic' }, { value: -1, label: '(UTC-1:00) Azores, Cape Verde Is.' }, { value: 0, label: '(UTC 0:00) Dublin, Lisbon, London, Reykjavik' }, { value: +1, label: '(UTC+1:00) Amsterdam, Berlin, Rome, Paris, Prague, Skopje ' }, { value: +2, label: '(UTC+2:00) Athens, Istanbul, Cairo, Helsinki, Kyiv, Vilnius ' }, { value: +3, label: '(UTC+3:00) Baghdad, Kuwait, Moscow, St. Petersburg, Nairobi' }, { value: +4, label: '(UTC+4:00) Abu Dhabi, Baku, Muscat' }, { value: +5, label: '(UTC+5:00) Ekaterinburg, Karachi, Tashkent' }, { value: +6, label: '(UTC+6:00) Astana, Dhaka, Novosibirsk' }, { value: +7, label: '(UTC+7:00) Bangkok, Hanoi, Jakarta' }, { value: +8, label: '(UTC+8:00) Beijing, Hong Kong, Kuala Lumpur, Perth, Taipei' }, { value: +9, label: '(UTC+9:00) Sapporo, Tokyo, Seoul' }, { value: +10, label: '(UTC+10:00) Brisbane, Melbourne, Sydney' }, { value: +11, label: '(UTC+11:00) Magadan, Solomon Is.' }, { value: +12, label: '(UTC+12:00) Auckland, Fiji' }]).attributes({ placeholder: 'Select Timezone' }).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select Timezone');
	            }
	        }
	    }).label('Timezone *'), nga.field('player', 'choice').choices([{ value: 'default', label: 'Default Player' }, { value: 'exoplayer', label: 'Exoplayer' }]).attributes({ placeholder: 'Player' }).defaultValue('default').validation({ required: true }).label('Player'), nga.field('get_messages', 'choice').choices([{ value: false, label: 'Disabled' }, { value: true, label: 'Enabled' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Get messages'), nga.field('get_ads', 'choice').defaultValue(false).choices([{ value: false, label: 'Disabled' }, { value: true, label: 'Enabled' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Receive ads'), nga.field('show_adult', 'choice').choices([{ value: false, label: 'Disabled' }, { value: true, label: 'Enabled' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Show adult content'), nga.field('auto_timezone', 'choice').choices([{ value: true, label: 'Enabled' }, { value: false, label: 'Disabled' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Auto Timezone'), nga.field('account_lock', 'choice').choices([{ value: false, label: 'Disabled' }, { value: true, label: 'Enabled' }]).attributes({ placeholder: 'Choose from dropdown list' }).label('Account Locked').validation({ required: true }), nga.field('beta_user', 'choice').choices([{ value: false, label: 'Disabled' }, { value: true, label: 'Enabled' }]).attributes({ placeholder: 'Choose from dropdown list' }).label('Is tester').validation({ required: true }), nga.field('template').label('').template(_edit_buttonHtml2['default']), nga.field('Subscriptions', 'referenced_list').label('Subscription').targetEntity(admin.getEntity('Subscriptions')).targetReferenceField('login_id').targetFields([nga.field('package_id', 'reference').targetEntity(admin.getEntity('Packages')).targetField(nga.field('package_name')).label('Package'), nga.field('package_id', 'reference').targetEntity(admin.getEntity('Packages')).targetField(nga.field('package_type_id').map(function truncate(value) {
	        if (value === 1) {
	            return 'Live big screen';
	        } else if (value === 2) {
	            return 'Live small screen';
	        } else if (value === 3) {
	            return 'Vod big screen';
	        } else if (value === 4) {
	            return 'Vod small screen';
	        }
	    })).label('Package Type'), nga.field('start_date', 'date').cssClasses('hidden-xs').template(function (entry) {
	        var moment = new Date().toISOString().slice(0, 10);
	        var ng_vlera_start = new Date(entry.values.start_date).toISOString().slice(0, 10);
	        var ng_vlera_end = new Date(entry.values.end_date).toISOString().slice(0, 10);
	        if (moment >= ng_vlera_start && moment <= ng_vlera_end) {
	            return ng_vlera_start.fontcolor("green");
	        } else {
	            return ng_vlera_start.fontcolor("red").bold();
	        }
	    }).label('Start date'), nga.field('end_date', 'date').cssClasses('hidden-xs').template(function (entry) {
	        var moment = new Date().toISOString().slice(0, 10);
	        var ng_vlera_start = new Date(entry.values.start_date).toISOString().slice(0, 10);
	        var ng_vlera_end = new Date(entry.values.end_date).toISOString().slice(0, 10);
	        if (moment >= ng_vlera_start && moment <= ng_vlera_end) {
	            return ng_vlera_end.fontcolor("green");
	        } else {
	            return ng_vlera_end.fontcolor("red").bold();
	        }
	    }).label('End date')]), nga.field('').label('').template('<ma-create-button entity-name="Subscriptions" class="pull-right" label="ADD SUBSCRIPTION" default-values="{ login_id: entry.values.id }"></ma-create-button>'), nga.field('Devices', 'referenced_list').label('Devices').targetEntity(admin.getEntity('Devices')).targetReferenceField('login_data_id').targetFields([nga.field('login_data_id', 'reference').targetEntity(admin.getEntity('LoginData')).targetField(nga.field('username')).label('Account'), nga.field('device_ip').cssClasses('hidden-xs').label('Device IP'), nga.field('appid').cssClasses('hidden-xs').label('App ID'), nga.field('app_version').cssClasses('hidden-xs').label('App Version'), nga.field('ntype').cssClasses('hidden-xs').label('Ntype'), nga.field('updatedAt', 'date').cssClasses('hidden-xs').label('Last Updated'), nga.field('device_brand').cssClasses('hidden-xs').label('Device Brand'), nga.field('device_active', 'boolean').label('Device Active')]).listActions(['edit']), nga.field('Salesreports', 'referenced_list').label('Sale Reports').targetEntity(nga.entity('Salesreports')).targetReferenceField('login_data_id').targetFields([nga.field('user_id', 'reference').targetEntity(admin.getEntity('Users')).targetField(nga.field('username')).cssClasses('hidden-xs').label('User'), nga.field('on_behalf_id', 'reference').targetEntity(admin.getEntity('Users')).targetField(nga.field('username')).cssClasses('hidden-xs').label('On Behalf of'), nga.field('saledate', 'date').cssClasses('hidden-xs').label('Sale Date'), nga.field('combo_id', 'reference').targetEntity(admin.getEntity('Combos')).targetField(nga.field('name')).label('Product')]).listActions(['<ma-edit-button entry="entry" entity="entity" label="Cancel Subscription" size="xs"></ma-edit-button><download-invoice post="entry"></download-invoice>']),
	    //hidden field
	    nga.field('livetvlastchange', 'datetime').cssClasses('hidden').editable(false).label(''), nga.field('updatelivetvtimestamp', 'boolean').cssClasses('hidden').editable(true).validation({ required: false }).label(''), nga.field('vodlastchange', 'datetime').cssClasses('hidden').editable(false).label(''), nga.field('updatevodtimestamp', 'boolean').cssClasses('hidden').editable(true).validation({ required: false }).label('')
	    //./hidden field
	    ]);

	    return logindata;
	};

	module.exports = exports['default'];

/***/ },
/* 175 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	var _filter_package_btnHtml = __webpack_require__(176);

	var _filter_package_btnHtml2 = _interopRequireDefault(_filter_package_btnHtml);

	var _drag_drop_packageDrag_and_drop_templateHtml = __webpack_require__(177);

	var _drag_drop_packageDrag_and_drop_templateHtml2 = _interopRequireDefault(_drag_drop_packageDrag_and_drop_templateHtml);

	exports['default'] = function (nga, admin) {
	    var livepackages = admin.getEntity('livepackages');

	    livepackages.listView().title('<h4>All Packages <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').permanentFilters({ package_type_id: [1, 2] }).batchActions([]).fields([nga.field('package_name').isDetailLink(true).label('Package Name'), nga.field('package_type_id', 'reference').targetEntity(admin.getEntity('packagetypes')).targetField(nga.field('description')).cssClasses('hidden-xs').label('Package Type')]).listActions(['edit']).exportFields([livepackages.listView().fields()]);

	    livepackages.creationView().title('<h4>Packages <i class="fa fa-angle-right" aria-hidden="true"></i> Create: Package</h4>').fields([nga.field('package_name', 'string').attributes({ placeholder: 'Name the package you are creating' }).validation({ required: true }).label('Package Name'), nga.field('package_type_id', 'reference').targetEntity(admin.getEntity('packagetypes')).targetField(nga.field('description')).attributes({ placeholder: 'Choose the Package Type from dropdown list' }).validation({ required: true }).permanentFilters({ package_type_id: [1, 2] }).label('Package Type'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    livepackages.editionView().title('<h4>Packages <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.package_name }}</h4>').actions(['list']).fields([nga.field('package_name', 'string').attributes({ placeholder: 'Package Name' }).validation({ required: true }).label('Package Name'), nga.field('package_type_id', 'reference').targetEntity(admin.getEntity('packagetypes')).targetField(nga.field('description')).validation({ required: true }).attributes({ placeholder: 'Select Package Type' }).permanentFilters({ package_type_id: [1, 2] }).label('Package Type'), nga.field('template').label('').template(_edit_buttonHtml2['default']), nga.field('', 'template').label('').template(_drag_drop_packageDrag_and_drop_templateHtml2['default'])]);

	    // nga.field('packagechannels', 'referenced_list')
	    //     .label('Channels')
	    //     .targetEntity(admin.getEntity('packagechannels'))
	    //     .targetReferenceField('package_id')
	    //     .targetFields([
	    //         nga.field('channel_id', 'reference')
	    //             .targetEntity(admin.getEntity('Channels'))
	    //             .targetField(nga.field('channel_number'))
	    //             .label('Nr'),
	    //         nga.field('channel_id', 'reference')
	    //             .targetEntity(admin.getEntity('Channels'))
	    //             .targetField(nga.field('icon_url', 'file')
	    //                 .template('<img src="{{ entry.values.icon_url }}" height="35" width="35" />'))
	    //             .label('Icon'),
	    //         nga.field('channel_id', 'reference')
	    //             .targetEntity(admin.getEntity('Channels'))
	    //             .targetField(nga.field('title'))
	    //             .label('Channels'),
	    //         nga.field('channel_id', 'reference')
	    //             .targetEntity(admin.getEntity('Channels'))
	    //             .targetField(nga.field('genre.description'))
	    //             .label('Genre'),
	    //         nga.field('channel_id', 'reference')
	    //             .targetEntity(admin.getEntity('Channels'))
	    //             .targetField(nga.field('isavailable', 'boolean'))
	    //             .label('available'),
	    //     ])
	    //     .listActions(['<ma-delete-button label="Remove" entry="entry" entity="entity" size="xs"></ma-delete-button>'])
	    //
	    //     .perPage(15),
	    // nga.field('template')
	    //     .label('')
	    //     .template(filter_package_btn),
	    return livepackages;
	};

	module.exports = exports['default'];

/***/ },
/* 176 */
/***/ function(module, exports) {

	module.exports = "<div class=\"row\">\r\n    <div class=\"btn-group inline pull-right\"> \r\n      <div class=\"btn btn-small\"><ma-filtered-list-button entity-name=\"packagechannels\" class=\"pull-right\" label=\"SEE ALL CHANNELS\" filter=\"{ package_id: entry.values.id }\"></ma-filtered-list-button></div> \r\n      <div class=\"btn btn-small\"><ma-create-button entity-name=\"packagechannels\" class=\"pull-right\" label=\"ADD CHANNEL\" default-values=\"{ package_id: entry.values.id }\"></ma-create-button></div> \r\n    </div>\r\n</div>\r\n\r\n<hr>";

/***/ },
/* 177 */
/***/ function(module, exports) {

	module.exports = "<!DOCTYPE html>\r\n<html>\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <title>Drag &amp; Drop Lists for angular.js</title>\r\n</head>\r\n<body ng-app=\"myApp\">\r\n\r\n<div ng-controller=\"dragdropctrl\">\r\n    <div class=\"multiDemo row\">\r\n\r\n        <p class=\"text-center bg-default paragraph\">You can select or multiselect Channels from Available list to Selected list and back.</p>\r\n\r\n        <div class=\"col-md-12\">\r\n            <div class=\"row\">\r\n\r\n                <div ng-repeat=\"list in models\" class=\"col-md-6\">\r\n                    <div class=\"panel panel-default\">\r\n                        <div class=\"panel-heading\">\r\n                            <h3 class=\"panel-title text-center\">{{list.listName}}</h3>\r\n                        </div>\r\n                        <div class=\"panel-body\">\r\n                            <input type=\"text\" id=\"usr\" ng-model=\"searchText\" placeholder=\"Search Channel by name or by number...\" />\r\n                            <ul dnd-list dnd-drop=\"onDrop(list, item, index)\">\r\n                                <li ng-repeat=\"item in list.items | filter:searchText\"\r\n                                    dnd-draggable=\"getSelectedItemsIncluding(list, item)\"\r\n                                    dnd-dragstart=\"onDragstart(list, event)\"\r\n                                    dnd-moved=\"onMoved(list)\"\r\n                                    dnd-dragend=\"list.dragging = false\"\r\n                                    dnd-selected=\"item.selected = !item.selected\"\r\n                                    ng-class=\"{'selected': item.selected}\"\r\n                                    ng-hide=\"list.dragging && item.selected\"\r\n                                >\r\n                                    <div style=\"display: none;\">{{item.id}}</div> &nbsp;{{item.nr}}&nbsp;-&nbsp;{{item.label}}\r\n                                </li>\r\n                            </ul>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div><!--row-->\r\n            <div class=\"row\">\r\n                <div class=\"btn-group inline pull-right\">\r\n                    <div class=\"btn btn-small\"><see-drag post=\"entry\" class=\"pull-right\" data-method=\"ctrlFn\"></see-drag></div>\r\n                    <!--<div class=\"btn btn-small\"><ma-filtered-list-button entity-name=\"packagechannels\" class=\"pull-right\" label=\"SEE ALL CHANNELS\" filter=\"{ package_id: entry.values.id }\"></ma-filtered-list-button></div>-->\r\n                </div>\r\n            </div><!--row-->\r\n            <hr><br/><br/><br/><br/>\r\n        </div><!--col-md-12-->\r\n    </div>\r\n\r\n\r\n\r\n\r\n\r\n\r\n</div>\r\n</body>\r\n</html>";

/***/ },
/* 178 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	var _filter_package_btnHtml = __webpack_require__(176);

	var _filter_package_btnHtml2 = _interopRequireDefault(_filter_package_btnHtml);

	exports['default'] = function (nga, admin) {
	    var packages = admin.getEntity('Packages');

	    packages.listView().title('<h4>Packages <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('package_name').isDetailLink(true).label('Package Name'), nga.field('package_type_id', 'reference').targetEntity(admin.getEntity('packagetypes')).targetField(nga.field('description')).cssClasses('hidden-xs').label('Package Type')]).listActions(['edit']).exportFields([packages.listView().fields()]);

	    packages.creationView().title('<h4>Packages <i class="fa fa-angle-right" aria-hidden="true"></i> Create: Package</h4>').fields([nga.field('package_name', 'string').attributes({ placeholder: 'Package Name' }).validation({ required: true }).label('Package Name'), nga.field('package_type_id', 'reference').targetEntity(admin.getEntity('packagetypes')).targetField(nga.field('description')).attributes({ placeholder: 'Select Package Type' }).validation({ required: true }).label('Package Type'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    packages.editionView().title('<h4>Packages <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.package_name }}</h4>').actions(['list']).fields([nga.field('package_name', 'string').attributes({ placeholder: 'Package Name' }).validation({ required: true }).label('Package Name'), nga.field('package_type_id', 'reference').targetEntity(admin.getEntity('packagetypes')).targetField(nga.field('description')).validation({ required: true }).attributes({ placeholder: 'Select Package Type' }).label('Package Type'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    return packages;
	};

	module.exports = exports['default'];

/***/ },
/* 179 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	var _filter_package_btnHtml = __webpack_require__(176);

	var _filter_package_btnHtml2 = _interopRequireDefault(_filter_package_btnHtml);

	exports['default'] = function (nga, admin) {
	    var vpackages = admin.getEntity('vodPackages');

	    vpackages.listView().actions(['list', '<ma-create-button entity-name="vodPackages" class="pull-right"></ma-create-button>']).title('<h4>Packages <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').permanentFilters({ package_type_id: [3, 4] }).batchActions([]).fields([nga.field('package_name').isDetailLink(true).label('Package Name'), nga.field('package_type_id', 'reference').targetEntity(admin.getEntity('packagetypes')).targetField(nga.field('description')).cssClasses('hidden-xs').label('Package Type')]).listActions(['edit']).exportFields([vpackages.listView().fields()]);

	    vpackages.creationView().title('<h4>Packages <i class="fa fa-angle-right" aria-hidden="true"></i> Create: Package</h4>').onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
	        progression.done();
	        $state.go($state.get('edit'), { entity: entity.name(), id: entry._identifierValue });
	        return false;
	    }]).fields([nga.field('package_name', 'string').attributes({ placeholder: 'Package Name' }).validation({ required: true }).label('Package Name'), nga.field('package_type_id', 'reference').targetEntity(admin.getEntity('packagetypes')).targetField(nga.field('description')).permanentFilters({ package_type_id: [3, 4] }).attributes({ placeholder: 'Select Package Type' }).validation({ required: true }).label('Package Type'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    vpackages.editionView().title('<h4>Vod Packages <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.package_name }}</h4>').actions(['list']).fields([nga.field('package_name', 'string').attributes({ placeholder: 'Package Name' }).validation({ required: true }).label('Package Name'), nga.field('package_type_id', 'reference').targetEntity(admin.getEntity('packagetypes')).targetField(nga.field('description')).validation({ required: true }).permanentFilters({ package_type_id: [3, 4] }).attributes({ placeholder: 'Select Package Type' }).label('Package Type'), nga.field('template').label('').template(_edit_buttonHtml2['default']), nga.field('Vod films', 'referenced_list').label('Vods').targetEntity(admin.getEntity('Vods')).targetReferenceField('package_id').targetFields([nga.field('icon_url', 'file').template('<img src="{{ entry.values.icon_url }}" height="35" width="35" />').cssClasses('hidden-xs').label('Icon'), nga.field('title', 'string').label('Title'), nga.field('category_id', 'reference').targetEntity(admin.getEntity('VodCategories')).targetField(nga.field('name')).label('Genre'), nga.field('rate', 'number').attributes({ placeholder: 'Rate' }).validation({ required: true }).label('Rate'), nga.field('duration').validation({ required: true }).attributes({ placeholder: 'Duration' }).label('Duration'), nga.field('isavailable', 'boolean').label('Available')])
	    //.listActions(['<ma-delete-button label="Remove" entry="entry" entity="entity" size="xs"></ma-delete-button>'])
	    .perPage(15), nga.field('template').label('').template('<div class="row">' + '<div class="btn-group inline pull-right"> ' + '<div class="btn btn-small"><ma-filtered-list-button entity-name="Vods" class="pull-right" label="SEE ALL VODS" filter="{ vod_id: entry.values.id }"></ma-filtered-list-button></div> ' +
	    //'<div class="btn btn-small"><ma-create-button entity-name="vodPackages" class="pull-right" label="ADD VOD" default-values="{ package_id: entry.values.id }"></ma-create-button></div> '+
	    '</div>' + '</div>')]);

	    return vpackages;
	};

	module.exports = exports['default'];

/***/ },
/* 180 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	var _filter_genre_btnHtml = __webpack_require__(137);

	var _filter_genre_btnHtml2 = _interopRequireDefault(_filter_genre_btnHtml);

	exports['default'] = function (nga, admin) {
	    var mychann = admin.getEntity('mychannels');
	    mychann.listView().title('<h4>My  Channels <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('login_id', 'reference').targetEntity(admin.getEntity('LoginData')).targetField(nga.field('username')).label('Username'), nga.field('title', 'string').label('Title'), nga.field('channel_number').label('Channel Nr'), nga.field('genre_id', 'reference').targetEntity(admin.getEntity('Genres')).targetField(nga.field('description')).label('Genre'), nga.field('description', 'string').label('Description'), nga.field('isavailable', 'boolean').label('Is Available')]).listActions(['edit', 'delete']).filters([nga.field('q').label('').template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>').pinned(true)]);

	    mychann.creationView().title('<h4>My  Channels <i class="fa fa-angle-right" aria-hidden="true"></i> Create</h4>').fields([nga.field('login_id', 'reference').targetEntity(admin.getEntity('LoginData')).targetField(nga.field('username')).perPage(-1).attributes({ placeholder: 'Select Account from dropdown list' }).label('Username'), nga.field('title', 'string').attributes({ placeholder: 'Title' }).label('Title'), nga.field('channel_number').attributes({ placeholder: 'Channel Nr' }).label('Channel Nr'), nga.field('stream_url', 'string').attributes({ placeholder: 'Stream Url' }).label('Stream Url'), nga.field('genre_id', 'reference').targetEntity(admin.getEntity('Genres')).targetField(nga.field('description')).validation({ required: true }).attributes({ placeholder: 'Select genre' }).label('Genre'), nga.field('description', 'string').attributes({ placeholder: 'Description' }).label('Description'), nga.field('isavailable', 'boolean').validation({ required: true }).label('Is Available'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    mychann.deletionView().title('<h4>User Channels <i class="fa fa-angle-right" aria-hidden="true"></i> Remove <span style ="color:red;"> {{ entry.values.title }} </span></h4>').actions(['<ma-back-button entry="entry" entity="entity"></ma-back-button>']);

	    mychann.editionView().title('<h4>My  Channels <i class="fa fa-angle-right" aria-hidden="true"></i> Create</h4>').fields([mychann.creationView().fields()]);

	    return mychann;
	};

	module.exports = exports['default'];

/***/ },
/* 181 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
		var packageschannels = admin.getEntity('packagechannels');
		packageschannels.listView().title('<h4>Package Channels <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).actions(['<ma-back-button entry="entry" entity="entity"></ma-back-button>']).fields([nga.field('channel_id', 'reference').targetEntity(admin.getEntity('Channels')).targetField(nga.field('channel_number')).label('Nr'), nga.field('channel_id', 'reference').targetEntity(admin.getEntity('Channels')).targetField(nga.field('icon_url', 'file').template('<img src="{{ entry.values.icon_url }}" height="35" width="35" />')).label('Icon'), nga.field('channel_id', 'reference').targetEntity(admin.getEntity('Channels')).targetField(nga.field('title')).label('Channels'), nga.field('channel_id', 'reference').targetEntity(admin.getEntity('Channels')).targetField(nga.field('genre.description')).label('Genres'), nga.field('channel_id', 'reference').targetEntity(admin.getEntity('Channels')).targetField(nga.field('isavailable', 'boolean')).label('Available')]).listActions(['<ma-delete-button label="Remove" entry="entry" entity="entity" size="xs"></ma-delete-button>']).exportFields([packageschannels.listView().fields()]);

		packageschannels.deletionView().title('<h4>Package Channels <i class="fa fa-angle-right" aria-hidden="true"></i> Remove <span style ="color:red;"> {{ entry.values.channel.title }} </span> from <span style ="color:red;"> {{ entry.values.package.package_name }} </span></h4>').fields([nga.field('channel', 'template').template(function (entry, value) {

			return entry.values.channel.title;
		}), nga.field('package', 'template').template(function (entry, value) {

			return entry.values['package'].package_name;
		})]).actions(['<ma-back-button entry="entry" entity="entity"></ma-back-button>']);

		packageschannels.creationView().onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
			progression.done();
			$state.go($state.get('edit'), { entity: 'Packages', id: entry.values.package_id });
			return false;
		}]).title('<h4>Package Channels <i class="fa fa-angle-right" aria-hidden="true"></i> Create: Package Channels</h4>').fields([nga.field('package_id', 'reference').targetEntity(admin.getEntity('Packages')).targetField(nga.field('package_name')).validation({ required: true }).label('Packages'), nga.field('channel_id', 'reference').targetEntity(admin.getEntity('Channels')).targetField(nga.field('title', 'template').map(function (v, e) {
			return e.channel_number + ' - ' + e.title;
		})).validation({ required: true }).attributes({ placeholder: 'Select Channel' }).perPage(1000).label('Channels'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

		packageschannels.editionView().title('<h4>Package Channels <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.channel_id }}</h4>').actions(['list']).fields([packageschannels.creationView().fields()]);

		return packageschannels;
	};

	module.exports = exports['default'];

/***/ },
/* 182 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	    var packagetype = admin.getEntity('packagetypes');
	    packagetype.listView().title('<h4>Package Types <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('description', 'string').label('Description')]).listActions(['edit']).exportFields([packagetype.listView().fields()]);

	    packagetype.creationView().title('<h4>Package Types <i class="fa fa-angle-right" aria-hidden="true"></i> Create: Package Type</h4>').fields([nga.field('description', 'string').attributes({ placeholder: 'Description' }).validation({ required: true }).label('Description'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    packagetype.editionView().title('<h4>Package Types <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.description }}</h4>').actions(['list']).fields([packagetype.creationView().fields()]);

	    return packagetype;
	};

	module.exports = exports['default'];

/***/ },
/* 183 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
			value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
			var salesreport = admin.getEntity('Salesreports');

			salesreport.listView().title('<h4>Sale report <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').listActions(['<ma-edit-button entry="entry" entity="entity" label="Cancel Subscription" size="xs"></ma-edit-button><download-invoice post="entry"></download-invoice>']).batchActions([]).fields([nga.field('id', 'number').cssClasses('hidden-xs').label('ID'), nga.field('user_id', 'reference').targetEntity(admin.getEntity('Users')).targetField(nga.field('username')).label('Sales Agent'), nga.field('login_data_id', 'reference').targetEntity(admin.getEntity('LoginData')).targetField(nga.field('username')).label('Username'), nga.field('login_data_id', 'reference').targetEntity(admin.getEntity('LoginData')).targetField(nga.field('customer_datum.firstname').map(function (value, entry) {
					return entry['customer_datum.firstname'] + ' ' + entry['customer_datum.lastname'];
			})).label('Full Name'), nga.field('transaction_id', 'string').label('Transaction ID').editable(false), nga.field('saledate', 'date').cssClasses('hidden-xs').label('Sale Date'), nga.field('combo.name', 'string').label('Products'), nga.field('combo_id', 'reference').targetEntity(admin.getEntity('Combos')).targetField(nga.field('value')).isDetailLink(false).label('Value'), nga.field('active', 'boolean').label('Active sale'), nga.field('cancelation_date', 'date').cssClasses('hidden-xs').label('Cancelation Date'), nga.field('cancelation_user', 'reference').targetEntity(admin.getEntity('Users')).targetField(nga.field('username')).label('Cancelation User'), nga.field('cancelation_reason', 'text').cssClasses('hidden-xs').label('Cancelation Reason')]).filters([nga.field('user_username').attributes({ placeholder: 'Client' }).label('Client'), nga.field('distributorname').attributes({ placeholder: 'Distributor' }).label('Distributor'), nga.field('startsaledate', 'date').attributes({ placeholder: 'From date' }).label('From date'), nga.field('endsaledate', 'date').attributes({ placeholder: 'To date' }).label('To date'), nga.field('name', 'reference').targetEntity(admin.getEntity('Combos')).attributes({ placeholder: 'Product' }).perPage(-1).targetField(nga.field('name')).label('Product'), nga.field('active', 'choice').choices([{ value: 'active', label: 'Active sales' }, { value: 'cancelled', label: 'Canceled sales' }, { value: 'all', label: 'All sales' }]).attributes({ placeholder: 'Sale active' }).label('Sale status')]).exportFields([salesreport.listView().fields()]);

			salesreport.editionView().title('<h4>Transaction <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.username }}</h4>').actions(['list']).fields([nga.field('id', 'number').editable(false).label('ID'), nga.field('transaction_id', 'string').label('Transaction ID').editable(false),
			/*
	  nga.field('active', 'boolean')
	  		.attributes({readOnly: true})
	  		.defaultValue(true)
	  		.validation({ required: true })
	  	.label('Cancel Sale'),
	  */
			nga.field('cancelation_reason', 'string').label('Cancelation Reason').editable(true).validation({ required: true }), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

			return salesreport;
	};

	module.exports = exports['default'];

/***/ },
/* 184 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	exports['default'] = function (nga, admin) {
	    var salesreport = admin.getEntity('sales_by_product');
	    salesreport.listView().title('<h4>Sales by product <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('combo.name', 'string').label('Product '), nga.field('count', 'number').cssClasses('hidden-xs').label('Sales Total'), nga.field('saledate', 'date').cssClasses('hidden-xs').label('Last sold on'), nga.field('combo.duration', 'string').label('Duration (days)'), nga.field('combo.value', 'string').label('Product price')]).filters([nga.field('startsaledate', 'date').attributes({ placeholder: 'From date' }).label('From date'), nga.field('endsaledate', 'date').attributes({ placeholder: 'To date' }).label('To date'), nga.field('active', 'choice').choices([{ value: 'active', label: 'Active sales' }, { value: 'cancelled', label: 'Canceled sales' }, { value: 'all', label: 'All sales' }]).attributes({ placeholder: 'Sale active' }).label('Sale status')]).exportFields([salesreport.listView().fields()]);

	    return salesreport;
	};

	module.exports = exports['default'];

/***/ },
/* 185 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	exports['default'] = function (nga, admin) {
	    var salesreport = admin.getEntity('sales_by_date');
	    salesreport.listView().title('<h4>Sales per day <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('saledate', 'date').cssClasses('hidden-xs').label('Day'), nga.field('count', 'number').cssClasses('hidden-xs').label('Sale no.'), nga.field('combo.total_value', 'number').cssClasses('hidden-xs').label('Total earnings')]).filters([nga.field('startsaledate', 'date').attributes({ placeholder: 'From date' }).label('From date'), nga.field('endsaledate', 'date').attributes({ placeholder: 'To date' }).label('To date'), nga.field('name', 'reference').targetEntity(admin.getEntity('Combos')).attributes({ placeholder: 'Product' }).perPage(-1).targetField(nga.field('name')).label('Product'), nga.field('active', 'choice').choices([{ value: 'active', label: 'Active sales' }, { value: 'cancelled', label: 'Canceled sales' }, { value: 'all', label: 'All sales' }]).attributes({ placeholder: 'Sale active' }).label('Sale status')]).exportFields([salesreport.listView().fields()]);

	    return salesreport;
	};

	module.exports = exports['default'];

/***/ },
/* 186 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	exports['default'] = function (nga, admin) {
	    var salesreport = admin.getEntity('sales_by_month');
	    salesreport.listView().title('<h4>Sales by month <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('saledate', 'date').cssClasses('hidden-xs').label('Month/year'), nga.field('count', 'number').cssClasses('hidden-xs').label('Sale no.'), nga.field('combo.total_value', 'number').cssClasses('hidden-xs').label('Total earnings')]).filters([nga.field('distributorname').attributes({ placeholder: 'Distributor' }).label('Distributor'), nga.field('startsaledate', 'date').attributes({ placeholder: 'From date' }).label('From date'), nga.field('endsaledate', 'date').attributes({ placeholder: 'To date' }).label('To date'), nga.field('name', 'reference').targetEntity(admin.getEntity('Combos')).attributes({ placeholder: 'Product' }).perPage(-1).targetField(nga.field('name')).label('Product'), nga.field('active', 'choice').choices([{ value: 'active', label: 'Active sales' }, { value: 'cancelled', label: 'Canceled sales' }, { value: 'all', label: 'All sales' }]).attributes({ placeholder: 'Sale active' }).label('Sale status')]).exportFields([salesreport.listView().fields()]);

	    return salesreport;
	};

	module.exports = exports['default'];

/***/ },
/* 187 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	exports['default'] = function (nga, admin) {
	    var salesreport = admin.getEntity('sales_monthly_expiration');
	    salesreport.listView().title('<h4>Subscription expirations by month<i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('enddate', 'date').cssClasses('hidden-xs').label('Month/year'), nga.field('count', 'number').cssClasses('hidden-xs').label('Sale no.')]).filters([nga.field('username', 'string').attributes({ placeholder: 'Client' }), nga.field('startsaledate', 'date').attributes({ placeholder: 'From date' }).label('From date'), nga.field('endsaledate', 'date').attributes({ placeholder: 'To date' }).label('To date')]).exportFields([salesreport.listView().fields()]);

	    return salesreport;
	};

	module.exports = exports['default'];

/***/ },
/* 188 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	exports['default'] = function (nga, admin) {
	    var salesreport = admin.getEntity('sales_by_expiration');
	    salesreport.listView().title('<h4>Expirations list <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('login_datum.username', 'string').label('Client'), nga.field('end_date', 'date').cssClasses('hidden-xs').label('Expiration date')]).filters([nga.field('username', 'string').attributes({ placeholder: 'Client' }), nga.field('startsaledate', 'date').attributes({ placeholder: 'From date' }).label('From date'), nga.field('endsaledate', 'date').attributes({ placeholder: 'To date' }).label('To date'), nga.field('next', 'string').attributes({ placeholder: 30 }).label('Expires in (days)')]).exportFields([salesreport.listView().fields()]);

	    return salesreport;
	};

	module.exports = exports['default'];

/***/ },
/* 189 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	//import set from './setting.html';

	exports['default'] = function (nga, admin) {
		var settings = admin.getEntity('Settings');
		settings.listView().batchActions([]).fields([nga.field('analytics_id', 'string').attributes({ placeholder: 'Analytics ID' }).template('<div class="form-group">' + '<ma-input-field field="field" value="entry.values.analytics_id"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">Google analytics ID to monitor audience and system logs.</small>' + '</div>').label('Analytics ID'), nga.field('company_name', 'string').validation({ required: true }).label('Company name').template('<div class="form-group">' + '<ma-input-field field="field" value="entry.values.company_name"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">Set your company name (By default - MAGOWARE)</small>' + '</div>'), nga.field('locale', 'string').validation({ required: true }).label('Locale').template('<div class="form-group">' + '<ma-input-field field="field" value="entry.values.locale"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">User interface language (not in use).</small>' + '</div>'), nga.field('allow_guest_login', 'boolean').label('').template('<form ng-app="myApp" ng-controller="checkboxController">' + '<div class="form-check">' + '<label class="toggle">' + '<input type="checkbox" name="toggle" ng-change="setValueForGuest(checkboxModel.checkbox_value)" ng-model="checkboxModel.checkbox_value"' +
		/*'ng-true-value="true" ng-false-value="false"*/'> <span class="label-text">Allow Guest Login</span>' + '</label>' + '</div>' + '</form>'), nga.field('template').label('').template(_edit_buttonHtml2['default']),

		//HIDDEN FROM UI
		nga.field('updatedAt', 'datetime').cssClasses('hidden').editable(false).label(''), nga.field('menulastchange', 'datetime').cssClasses('hidden').editable(false).label(''), nga.field('updatemenulastchange', 'boolean').cssClasses('hidden').editable(true).validation({ required: false }).label(''), nga.field('livetvlastchange', 'datetime').cssClasses('hidden').editable(false).label(''), nga.field('updatelivetvtimestamp', 'boolean').cssClasses('hidden').editable(true).validation({ required: false }).label(''), nga.field('vodlastchange', 'datetime').cssClasses('hidden').editable(false).label(''), nga.field('updatevodtimestamp', 'boolean').cssClasses('hidden').editable(true).validation({ required: false }).label(''), nga.field('googlegcmapi').template('<div class="form-group" style="display: none;">' + '<ma-input-field field="field" value="entry.values.googlegcmapi"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">Google GCM API code for push messages to android devices.</small>' + '</div>').label(''), nga.field('applekeyid').template('<div class="form-group" style="display: none;">' + '<ma-input-field field="field" value="entry.values.applekeyid"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">Apple key id for push messages to apple devices.</small>' + '</div>').label(''), nga.field('appleteamid').template('<div class="form-group" style="display: none;">' + '<ma-input-field field="field" value="entry.values.appleteamid"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">Apple team id for push messages to apple devices.</small>' + '</div>').label(''), nga.field('applecertificate', 'text').template('<div class="form-group" style="display: none;">' + '<ma-text-field field="field" value="entry.values.applecertificate"></ma-text-field>' + '<small id="emailHelp" class="form-text text-muted">Apple team id for push messages to apple devices.</small>' + '</div>').label('')]);

		//./HIDDEN FROM UI
		settings.editionView().title('<h4><i class="fa fa-angle-right" aria-hidden="true"></i> Other</h4>').actions(['']).onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
			progression.done(); // stop the progress bar
			notification.log('Element #' + entry._identifierValue + ' successfully edited.', { addnCls: 'humane-flatty-success' }); // add a notification
			// redirect to the list view
			$state.go($state.current, {}, { reload: true }); // cancel the default action (redirect to the edition view)
			return false;
		}]).fields([settings.listView().fields()]);

		return settings;
	};

	module.exports = exports['default'];

/***/ },
/* 190 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
		var subscription = admin.getEntity('Subscriptions');
		subscription.listView().title('<h4>Subscriptions <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('login_id', 'reference').targetEntity(admin.getEntity('LoginData')).targetField(nga.field('username')).label('Login'), nga.field('package_id', 'reference').targetEntity(admin.getEntity('Packages')).targetField(nga.field('package_name')).label('Packages'), nga.field('start_date', 'date').template(function (entry, values) {
			var moment = new Date().toISOString().slice(0, 10);
			var ng_vlera_start = new Date(entry.values.start_date).toISOString().slice(0, 10);
			var ng_vlera_end = new Date(entry.values.end_date).toISOString().slice(0, 10);
			if (moment >= ng_vlera_start && moment <= ng_vlera_end) {
				return ng_vlera_start.fontcolor("green");
			} else {
				return ng_vlera_start.fontcolor("red").bold();
			}
		}).label('Start date'), nga.field('end_date', 'date').template(function (entry, values) {
			var moment = new Date().toISOString().slice(0, 10);
			var ng_vlera_start = new Date(entry.values.start_date).toISOString().slice(0, 10);
			var ng_vlera_end = new Date(entry.values.end_date).toISOString().slice(0, 10);
			if (moment >= ng_vlera_start && moment <= ng_vlera_end) {
				return ng_vlera_end.fontcolor("green");
			} else {
				return ng_vlera_end.fontcolor("red").bold();
			}
		}).label('End date')]).listActions(['edit']).filters([nga.field('q').template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>').label('').pinned(true)]).exportFields([subscription.listView().fields()]);

		subscription.deletionView().title('<h4>Subscriptions <i class="fa fa-angle-right" aria-hidden="true"></i> Remove <span style ="color:red;"> {{ entry.values.package.package_name }} </span> from <span style ="color:red;"> {{ entry.values.login_datum.username }} </span></h4>').fields([nga.field('login_datum', 'template').template(function (entry, value) {
			return entry.values.login_datum.username;
		}), nga.field('package', 'template').template(function (entry, value) {
			return entry.values['package'].package_name;
		})]).actions(['<ma-back-button entry="entry" entity="entity"></ma-back-button>']);

		subscription.creationView().title('<h4>Subscriptions <i class="fa fa-angle-right" aria-hidden="true"></i> Create: Subscription</h4>').fields([nga.field('login_id', 'reference').targetEntity(admin.getEntity('LoginData')).targetField(nga.field('username')).attributes({ placeholder: 'Choose Username from dropdown list' }).validation({ validator: function validator(value) {
				if (value === null || value === '') {
					throw new Error('Please Select Username');
				}
			}
		}).perPage(-1).remoteComplete(true, {
			refreshDelay: 300,
			// populate choices from the response of GET /posts?q=XXX
			searchQuery: function searchQuery(search) {
				return { q: search };
			}
		}).perPage(10) // limit the number of results to 10
		.label('Username *'), nga.field('combo_id', 'reference').targetEntity(admin.getEntity('Combos')).targetField(nga.field('name')).attributes({ placeholder: 'Choose Combo from dropdown list' }).validation({ validator: function validator(value) {
				if (value === null || value === '') {
					throw new Error('Please Select Combo');
				}
			}
		}).perPage(-1).label('Combo *'), nga.field('on_behalf_id', 'reference').targetEntity(admin.getEntity('Users')).targetField(nga.field('username')).label('On Behalf Id'), nga.field('start_date', 'date').attributes({ placeholder: 'Start date' }).validation({ required: true }).defaultValue(new Date()).label('Start date'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]).onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
			progression.done();
			$state.go($state.get('edit'), { entity: 'LoginData', id: entry.values.user });
			return false;
		}]);

		subscription.editionView().title('<h4>Subscriptions: Edit subscription date <i class="fa fa-angle-right" aria-hidden="true"></i></h4>').fields([nga.field('login_id', 'reference').targetEntity(admin.getEntity('LoginData')).targetField(nga.field('username')).attributes({ placeholder: 'Select Account' }).validation({ validator: function validator(value) {
				if (value === null || value === '') {
					throw new Error('Please Select Username');
				}
			}
		}).label('Username *'), nga.field('start_date', 'date').validation({ required: true, validator: function validator(start_date_input, input_list) {
				if (start_date_input > input_list.end_date) throw new Error('Start date cannot be bigger than end date');
			}
		}).label('Start date'), nga.field('end_date', 'date').validation({ required: true, validator: function validator(end_date_input, input_list) {
				if (end_date_input < input_list.start_date) throw new Error('End date cannot be smaller than start date');
			}
		}).label('End date'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]).onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
			progression.done();
			$state.go($state.get('list'), { entity: entity.name() });
			return false;
		}]);

		return subscription;
	};

	module.exports = exports['default'];

/***/ },
/* 191 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
		var user = admin.getEntity('Users');
		user.listView().title('<h4>Users <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('group_id', 'reference').targetEntity(admin.getEntity('Groups')).targetField(nga.field('name')).label('Group'), nga.field('username', 'string').label('Username'), nga.field('email', 'email').cssClasses('hidden-xs').label('Email'), nga.field('telephone', 'string').cssClasses('hidden-xs').label('Telephone'), nga.field('last_login_ip', 'string').map(function truncate(value) {
			if (!value) {
				return '';
			}
			return value.length > 14 ? value.substr(0, 14) + '...' : value;
		}).label('Last Login IP'), nga.field('isavailable', 'boolean').label('Is Available')]).filters([nga.field('q').label('').template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>').pinned(true)]).listActions(['edit']).exportFields([user.listView().fields()]);

		user.creationView().title('<h4>Users <i class="fa fa-angle-right" aria-hidden="true"></i> Create: User </h4>').fields([nga.field('group_id', 'reference').targetEntity(admin.getEntity('Groups')).targetField(nga.field('name')).validation({ validator: function validator(value) {
				if (value === null || value === '') {
					throw new Error('Please Select Group');
				}
			}
		}).attributes({ placeholder: 'Select group' }).label('Group *'), nga.field('username', 'string').attributes({ placeholder: 'Username must be at least 3 character long' }).validation({ required: true, minlength: 3 }).label('Username'), nga.field('hashedpassword', 'password').attributes({ placeholder: 'Password must be at least 4 character long' }).validation({ required: true, minlength: 4 }).label('Password'), nga.field('email', 'email').attributes({ placeholder: 'Email' }).validation({ required: true }).label('Email'), nga.field('telephone', 'string').attributes({ placeholder: 'Telephone' }).validation({ required: true }).label('Telephone'), nga.field('jwtoken', 'string').attributes({ placeholder: 'Api Key', readOnly: true }).defaultValue('').label('Api Key'), nga.field('template').label('').template('<generate post="entry"></generate>'), nga.field('isavailable', 'boolean').validation({ required: true }).label('Is Available'), nga.field('template').label('').template(_edit_buttonHtml2['default']),
		//hidden from UI
		nga.field('third_party_api_token', 'string').cssClasses('hidden').attributes({ placeholder: 'Third party token' }).defaultValue('').label('')]);

		user.editionView().title('<h4>Users <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.username }}</h4>').actions(['list']).fields([user.creationView().fields()]);

		return user;
	};

	module.exports = exports['default'];

/***/ },
/* 192 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
			value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
			var groups = admin.getEntity('Groups');
			groups.listView().title('<h4>User Groups <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').actions(['create']).batchActions([]).fields([nga.field('name', 'string').label('Name'), nga.field('code', 'string').label('Role'), nga.field('isavailable', 'boolean').validation({ required: true }).label('Available')]).listActions(['edit']);

			groups.creationView().onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
					progression.done();
					$state.go($state.get('edit'), { entity: entity.name(), id: entry._identifierValue });
					return false;
			}]).title('<h4>User groups <i class="fa fa-angle-right" aria-hidden="true"></i> Create: User groups</h4>').fields([nga.field('name', 'string').attributes({ placeholder: 'Group name' }).validation({ required: true }).label('Group name'), nga.field('code', 'choice').choices([{ value: 'admin', label: 'admin' }, { value: 'finance', label: 'finance' }, { value: 'guest', label: 'guest' }, { value: 'distributor', label: 'distributor' }, { value: 'resellers', label: 'resellers' }, { value: 'management', label: 'management' }, { value: 'customercare', label: 'customercare' }, { value: 'vod', label: 'vod' }]).attributes({ placeholder: 'Group code' }).validation({ required: true }).label('Group code'), nga.field('isavailable', 'boolean').attributes({ placeholder: 'Is Available' }).validation({ required: true }).label('Is Available'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

			groups.editionView().title('<h4>User group <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.name }}</h4>').actions(['list']).fields([groups.creationView().fields(), nga.field('', 'referenced_list').label('User permissions').targetEntity(admin.getEntity('Grouprights')).targetReferenceField('group_id').targetFields([nga.field('api_group_name', 'string').label('Api Group'), nga.field('description', 'string').label('Description'), nga.field('grouprights.id', 'template').label('Permitions ').template('<approve-review size="xs" review="entry"></approve-review>')])]);

			return groups;
	};

	module.exports = exports['default'];

/***/ },
/* 193 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
			value: true
	});

	exports['default'] = function (nga, admin) {
			var grouprights = admin.getEntity('Grouprights');
			grouprights.listView().title('<h4>User Groups <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').actions([]).batchActions([]).fields([nga.field('api_url', 'string').label('Api Name'), nga.field('description', 'string').label('Description'), nga.field('permitions', 'string').label('Permitions')]);

			return grouprights;
	};

	module.exports = exports['default'];

/***/ },
/* 194 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
		var app_management = admin.getEntity('appmanagement');
		app_management.listView().title('<h4>App Management <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('appid', 'string').label('App ID'), nga.field('app_version').cssClasses('hidden-xs').label('App Version'), nga.field('title').cssClasses('hidden-xs').label('Title'), nga.field('description').label('Description'), nga.field('url').label('Url'), nga.field('upgrade_min_api', 'string').label('Min Upgrade Api'), nga.field('upgrade_min_app_version', 'string').label('Min Upgrade App Version'), nga.field('beta_version').map(function app(value) {
			if (value === true) {
				return 'Beta';
			} else if (value === false) {
				return 'Live';
			}
		}).label('Beta Version'), nga.field('isavailable', 'boolean').label('Is Available')]).listActions(['edit']).exportFields([app_management.listView().fields()]);

		app_management.creationView().title('<h4>App Management <i class="fa fa-angle-right" aria-hidden="true"></i> Create: APP</h4>').fields([nga.field('appid', 'string').attributes({ placeholder: 'App ID' }).validation({ required: true }).label('App ID'), nga.field('app_version').attributes({ placeholder: 'App Version' }).validation({ required: true }).label('App Version'), nga.field('title').attributes({ placeholder: 'Title' }).validation({ required: true }).label('Title'), nga.field('description').attributes({ placeholder: 'Description' }).validation({ required: true }).label('Description'), nga.field('url', 'file').uploadInformation({ 'url': '/file-upload/single-file/apk/url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">Expected file extension: apk.</small></div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">Expected filename format: x_yz.apk</small></div>').validation({
			validator: function validator(value) {
				if (value == null) {
					throw new Error('Please, choose Url');
				}
			}
		}), nga.field('upgrade_min_api', 'string').attributes({ placeholder: 'Upgrade Min API' }).validation({ required: true }).label('Min Upgrade Api'), nga.field('upgrade_min_app_version', 'string').attributes({ placeholder: 'Upgrade Min App Version' }).validation({ required: true }).label('Min Upgrade App Version'), nga.field('beta_version', 'choice').validation({ required: true }).choices([{ value: ' 0', label: ' Live' }, { value: ' 1', label: ' Beta' }]).label('Beta Version'), nga.field('isavailable', 'boolean').validation({ required: true }).label('Is Available'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

		app_management.editionView().title('<h4>App Management <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.title }}</h4>').actions(['list']).fields([app_management.creationView().fields()]);

		return app_management;
	};

	module.exports = exports['default'];

/***/ },
/* 195 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
			value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	var _filter_genre_btnHtml = __webpack_require__(137);

	var _filter_genre_btnHtml2 = _interopRequireDefault(_filter_genre_btnHtml);

	exports['default'] = function (nga, admin) {
			var message = admin.getEntity('messages');
			message.listView().batchActions(['sendmessage', '<my-custom-directive selection="selection"></my-custom-directive>']).title('<h4>Messages <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').fields([nga.field('username').label('Username'), nga.field('title').label('Title'), nga.field('message').map(function truncate(value) {
					if (!value) {
							return '';
					}
					return value.length > 14 ? value.substr(0, 14) + '...' : value;
			}).label('Messages'), nga.field('action').label('Action'), nga.field('createdAt', 'datetime').label('Created at')]).listActions(['edit']).exportFields([message.listView().fields()]);

			message.creationView().title('<h4>Messages <i class="fa fa-angle-right" aria-hidden="true"></i> Create: Messages</h4>').actions(['list']).onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
					// redirect to the list view
					$state.go($state.current, {}, { reload: true }).then($state.go($state.get('list'), { entity: entity.name() })); // cancel the default action (redirect to the edition view)
			}]).fields([nga.field('type', 'choice').choices(function (entry) {
					var types = [{ value: 'one', label: 'One User' }, { value: 'all', label: 'All User' }];
					return types;
			}).label('User Type'), nga.field('username', 'reference').targetEntity(admin.getEntity('LoginData')).targetField(nga.field('username')).attributes({ placeholder: 'Select Account' }).remoteComplete(true, {
					refreshDelay: 300,
					// populate choices from the response of GET /posts?q=XXX
					searchQuery: function searchQuery(search) {
							return { q: search };
					}
			}).perPage(10) // limit the number of results to 10
			.label('Username'), nga.field('appid', 'choices').attributes({ placeholder: 'Send to device type:' }).choices([{ value: 1, label: 'Android Set Top Box' }, { value: 2, label: 'Android Smart Phone' }, { value: 3, label: 'IOS' }, { value: 4, label: 'Android Smart TV' }, { value: 5, label: 'Samsung Smart TV' }, { value: 6, label: 'Apple TV' }]).validation({ required: true }).label('Applications IDs'), nga.field('timetolive', 'number').attributes({ placeholder: 'ttl' }).validation({ required: true }).label('Time to live in sec'), nga.field('title', 'string').attributes({ placeholder: 'Info message' }).validation({ required: true }).label('Title'), nga.field('message', 'text').attributes({ placeholder: 'Message' }).validation({ required: true }).label('Message'), nga.field('sendtoactivedevices', 'boolean').validation({ required: true }).defaultValue(true).label('Send only to active devices'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

			message.editionView().title('<h4>Messages <i class="fa fa-angle-right" aria-hidden="true"></i></h4>').actions(['list']).fields([nga.field('username').validation({ required: true }).label('Username'), nga.field('googleappid').attributes({ placeholder: 'Google app id' }).label('Google App ID'), nga.field('title').label('Title'), nga.field('action').label('Action'), nga.field('message', 'text').attributes({ placeholder: 'Message' }).validation({ required: true }).label('Messages'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

			return message;
	};

	module.exports = exports['default'];

/***/ },
/* 196 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	var _filter_genre_btnHtml = __webpack_require__(137);

	var _filter_genre_btnHtml2 = _interopRequireDefault(_filter_genre_btnHtml);

	exports['default'] = function (nga, admin) {
	    var commands = admin.getEntity('commands');
	    commands.listView().title('<h4>Commands <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').fields([nga.field('login_datum.username').label('Username'), nga.field('googleappid').label('Device'), nga.field('command').label('Action'), nga.field('status').label('Status'), nga.field('createdAt', 'datetime').label('Time sent')]).filters([nga.field('username').label('User'), nga.field('command').label('Action'), nga.field('status', 'choice').choices([{ value: 'sent', label: 'Outbox commands' }, { value: 'success', label: 'Executed commands' }, { value: 'failure', label: 'Failed commands' }])]).listActions([]);

	    commands.creationView().title('<h4>Commands <i class="fa fa-angle-right" aria-hidden="true"></i> Send: command</h4>').fields([nga.field('type', 'choice').choices(function (entry) {
	        var types = [{ value: 'one', label: 'One User' }, { value: 'all', label: 'All User' }];
	        return types;
	    }).label('User Type'), nga.field('username', 'reference').targetEntity(admin.getEntity('LoginData')).targetField(nga.field('username')).attributes({ placeholder: 'Select Account' }).remoteComplete(true, {
	        refreshDelay: 300,
	        // populate choices from the response of GET /posts?q=XXX
	        searchQuery: function searchQuery(search) {
	            return { q: search };
	        }
	    }).perPage(10) // limit the number of results to 10
	    .label('Username'), nga.field('appid', 'choices').attributes({ placeholder: 'Send to device type' }).choices([{ value: 1, label: 'Android Set Top Box' }, { value: 2, label: 'Android Smart Phone' }, { value: 3, label: 'IOS' }, { value: 4, label: 'Android Smart TV' }, { value: 5, label: 'Samsung Smart TV' }, { value: 6, label: 'Apple TV' }]).validation({ required: true }).label('Applications IDs'), nga.field('command', 'choice').choices([{ value: 'file_replace', label: 'Replace file' }, { value: 'SOFTWARE_INSTALL', label: 'Software Installation' }, { value: 'DELETE_SHP', label: 'Delete shared preferences' }, { value: 'DELETE_DATA', label: 'Clear data' }, { value: 'debuggerd', label: 'Available free space' }, { value: 'pwd', label: 'Current directory name' }, { value: 'date', label: 'Current date and time' }, { label: 'Show Username', value: 'show_username' }, { label: 'Remote Login', value: 'login_user' }]).label('Command'), nga.field('command').attributes({ placeholder: 'You can type your Command here' }).label('Write your Command').template('<ma-input-field field="field" value="entry.values.command"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">If you write here, you must not choose from above field. Above field overwrite this field.</small>'),

	    //field for show_username command with ng-if
	    nga.field('top', 'boolean').defaultValue(false).template('<ma-field ng-if="entry.values.command === \'show_username\' " field="::field" value="entry.values[field.name()]" entry="entry" entity="::entity" form="formController.form" datastore="::formController.dataStore"></ma-field>', true), nga.field('left', 'boolean').defaultValue(false).template('<ma-field ng-if="entry.values.command === \'show_username\' " field="::field" value="entry.values[field.name()]" entry="entry" entity="::entity" form="formController.form" datastore="::formController.dataStore"></ma-field>', true),
	    //./field for show_username command with ng-if

	    //field for login_user command with ng-if
	    nga.field('password').template('<ma-field ng-if="entry.values.command === \'login_user\' " field="::field" value="entry.values[field.name()]" entry="entry" entity="::entity" form="formController.form" datastore="::formController.dataStore"></ma-field>', true), nga.field('macadress').template('<ma-field ng-if="entry.values.command === \'login_user\' " field="::field" value="entry.values[field.name()]" entry="entry" entity="::entity" form="formController.form" datastore="::formController.dataStore"></ma-field>', true), nga.field('wifi').template('<ma-field ng-if="entry.values.command === \'login_user\' " field="::field" value="entry.values[field.name()]" entry="entry" entity="::entity" form="formController.form" datastore="::formController.dataStore"></ma-field>', true),
	    //./field for login_user command with ng-if

	    nga.field('parameter1', 'string').attributes({ placeholder: 'parammeter1' }).label('Target'), nga.field('parameter2', 'string').attributes({ placeholder: 'parammeter2' }).label('Destination'), nga.field('parameter3', 'string').attributes({ placeholder: 'parammeter3' }).label('Options'), nga.field('sendtoactivedevices', 'boolean').validation({ required: true }).defaultValue(true).label('Send only to active devices'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);
	    return commands;
	};

	module.exports = exports['default'];

/***/ },
/* 197 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	var _filter_genre_btnHtml = __webpack_require__(137);

	var _filter_genre_btnHtml2 = _interopRequireDefault(_filter_genre_btnHtml);

	exports['default'] = function (nga, admin) {
	    var ads = admin.getEntity('ads');

	    //todo: username ose allusers te jete required
	    ads.listView().title('<h4>Ads <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').fields([nga.field('login_datum.username').label('Username'), nga.field('googleappid').label('Device'), nga.field('command').label('Action'), nga.field('status').label('Status'), nga.field('createdAt', 'datetime').label('Time sent')]).filters([nga.field('username').label('User'), nga.field('command').label('Action'), nga.field('status', 'choice').choices([{ value: 'sent', label: 'Outbox commands' }, { value: 'success', label: 'Executed commands' }, { value: 'failure', label: 'Failed commands' }])]).listActions([]);

	    ads.creationView().title('<h4>Ads <i class="fa fa-angle-right" aria-hidden="true"></i> Send: ad</h4>').fields([nga.field('username', 'reference').targetEntity(admin.getEntity('LoginData')).targetField(nga.field('username')).attributes({ placeholder: 'Select Account from dropdown list' }).remoteComplete(true, {
	        refreshDelay: 300,
	        // populate choices from the response of GET /posts?q=XXX
	        searchQuery: function searchQuery(search) {
	            return { q: search };
	        }
	    }).perPage(10) // limit the number of results to 10
	    .label('Username'), nga.field('all_users', 'boolean').validation({ required: true }).label('Send to all users (overrides username)'), nga.field('appid', 'choices').attributes({ placeholder: 'Select from dropdown list to send to device type:' }).choices([{ value: 1, label: 'Android Set Top Box' }, { value: 2, label: 'Android Smart Phone' }, { value: 3, label: 'IOS' }, { value: 4, label: 'Android Smart TV' }, { value: 5, label: 'Samsung Smart TV' }, { value: 6, label: 'Apple TV' }]).validation({ required: true }).label('Applications IDs'), nga.field('activity', 'choices').choices([{ value: 'livetv', label: 'In live tv' }, { value: 'vod', label: 'In vod' }, { value: 'all', label: 'Everywhere (overrules other values)' }]).validation({ required: true }).attributes({ placeholder: 'Select from dropdown list filter values' }).label('Display'), nga.field('title', 'string').attributes({ placeholder: 'Title' }).label('Title'), nga.field('message', 'text').attributes({ placeholder: 'Message' }).label('Message'), nga.field('link_url', 'string').template('<ma-input-field field="field" value="entry.values.link_url"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">Default empty string</small>').label('Link'), nga.field('xOffset', 'choice').choices([{ value: '1', label: 'Top' }, { value: '2', label: 'Center' }, { value: '3', label: 'Bottom' }]).validation({ required: true }).attributes({ placeholder: 'Select from dropdown list filter values' }).label('Position'), nga.field('imageGif', 'string').validation({ required: true }).attributes({ placeholder: 'Image link' }).label('Image link'), nga.field('duration', 'number').template('<div>' + '<ma-input-field field="field" value="entry.values.duration"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">Ad duration. Default 5000 ms</small>' + '</div>').attributes({ placeholder: 'Duration in ms' }).label('Duration in ms'), nga.field('delivery_time', 'datetime').attributes({ placeholder: 'Choose date' }).label('Send ad at'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);
	    return ads;
	};

	module.exports = exports['default'];

/***/ },
/* 198 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	    var logs = admin.getEntity('logs');
	    logs.listView().title('<h4>User logs <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('id', 'number').label('ID'), nga.field('username', 'string').label('User'), nga.field('user_ip', 'string').label('from ip'), nga.field('action', 'string').label('action'), nga.field('createdAt', 'datetime').label('date')]).listActions(['show']);

	    logs.showView().title('<h4>Logs <i class="fa fa-angle-right" aria-hidden="true"></i> Details</h4>').fields([nga.field('id', 'number').label('ID'), nga.field('user.username', 'string').label('User'), nga.field('user_ip', 'string').label('from ip'), nga.field('action', 'string').label('action'), nga.field('details', 'json').map(function detailsdecode(value, entry) {
	        return JSON.parse(value);
	    }).label('details'), nga.field('createdAt', 'date').label('date')]);

	    return logs;
	};

	module.exports = exports['default'];

/***/ },
/* 199 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	  var actv = admin.getEntity('activity');
	  actv.listView().title('<h4>App Management <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('description', 'string').label('Description')]).listActions(['edit']).exportFields([actv.listView().fields()]);

	  actv.creationView().title('<h4>App Management <i class="fa fa-angle-right" aria-hidden="true"></i> Create: APP</h4>').fields([nga.field('description', 'string').attributes({ placeholder: 'Description' }).validation({ required: true }).label('Description'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	  actv.editionView().title('<h4>App Management <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.title }}</h4>').actions(['list']).fields([actv.creationView().fields()]);

	  return actv;
	};

	module.exports = exports['default'];

/***/ },
/* 200 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	    var app_gr = admin.getEntity('appgroup');
	    app_gr.listView().title('<h4>App Group <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('app_id').map(function app(value) {
	        if (value === 1) {
	            return '1 - Android Set Top Box';
	        } else if (value === 2) {
	            return '2 - Android Mobile';
	        } else if (value === 3) {
	            return '3 - Ios Mobile';
	        } else if (value === 4) {
	            return '4 - Android Smart TV';
	        } else if (value === 5) {
	            return '5 - Web TV';
	        } else if (value === 6) {
	            return '6 - Apple TV';
	        }
	    }).label('App ID'), nga.field('app_group_id').map(function app(value) {
	        if (value === 1) {
	            return '1 - Large Screen';
	        } else if (value === 2) {
	            return '2 - Small Screen';
	        }
	    }).label('App Group ID')]).
	    // nga.field('app_group_name')
	    // 	.label('App Group Name'),

	    listActions(['edit']).exportFields([app_gr.listView().fields()]);

	    app_gr.creationView().title('<h4>App Group <i class="fa fa-angle-right" aria-hidden="true"></i> Create: APP</h4>').fields([nga.field('app_group_id').attributes({ placeholder: 'App Group ID' }).validation({ required: true }).label('App Group ID'), nga.field('app_group_name').attributes({ placeholder: 'App Group Name' }).validation({ required: true }).label('App Group Name'), nga.field('app_id').attributes({ placeholder: 'App ID' }).validation({ required: true }).label('App ID'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    app_gr.editionView().title('<h4>App Group <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.title }}</h4>').actions(['list']).fields([app_gr.creationView().fields()]);

	    return app_gr;
	};

	module.exports = exports['default'];

/***/ },
/* 201 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	//import foto from '../foto.html';

	exports['default'] = function (nga, admin) {
	    var vod = admin.getEntity('Vods');
	    var language_list = [{ value: { "iso_639_1": "en", "name": "English" }, label: 'English' }, { value: { "iso_639_1": "sp", "name": "Spanish" }, label: 'Spanish' }, { value: { "iso_639_1": "gr", "name": "German" }, label: 'German' }, { value: { "iso_639_1": "fr", "name": "French" }, label: 'French' }];
	    vod.listView().title('<h4>Vods <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions(['<vod type="update_film" selection="selection"></vod>']).actions(['<move type="move_to_package" selection="selection"></move>', 'batch', 'export', 'filter', 'create']).fields([nga.field('title', 'string').label('Title'), nga.field('expiration_time', 'datetime').label('Expiration Time'), nga.field('vod_vod_categories').cssClasses('hidden').map(function getpckgid(value, entry) {
	        var return_object = [];
	        for (var i = 0; i < value.length; i++) {
	            return_object[i] = value[i].category_id;
	        }
	        return return_object;
	    }).label('Vod in categories'), nga.field('vod_vod_categories', 'reference_many').targetEntity(admin.getEntity('VodCategories')).targetField(nga.field('name')).singleApiCall(function (category_id) {
	        return { 'category_id[]': category_id };
	    }).label('Genres'), nga.field('package_vods').cssClasses('hidden').map(function getpckgid(value, entry) {
	        var return_object = [];
	        for (var i = 0; i < value.length; i++) return_object[i] = value[i].package_id;
	        return return_object;
	    }).label('Vod in packages'), nga.field('package_vods', 'reference_many').targetEntity(admin.getEntity('Packages')).perPage(-1).permanentFilters({ package_type_id: [3, 4] }).targetField(nga.field('package_name')).singleApiCall(function (package_id) {
	        return { 'package_id[]': package_id };
	    }).label('Packages'), nga.field('duration', 'number').cssClasses('hidden-xs').label('Duration'), nga.field('icon_url', 'file').template('<img src="{{ entry.values.icon_url }}" height="35" width="35" />').cssClasses('hidden-xs').label('Icon'), nga.field('isavailable', 'boolean').cssClasses('hidden-xs').label('Available'), nga.field('createdAt', 'date').cssClasses('hidden-xs').label('Created at'), nga.field('pin_protected', 'boolean').cssClasses('hidden-xs').label('Pin Protected')]).sortDir("DESC").sortField("createdAt").filters([nga.field('not_id', 'reference').targetEntity(admin.getEntity('vodPackages')).permanentFilters({ package_type_id: [3, 4] }).targetField(nga.field('package_name')).label('Not In Package'), nga.field('expiration_time', 'datetime').label('Expiration Time'), nga.field('title').label('Title'), nga.field('pin_protected', 'choice').choices([{ value: 0, label: 'False' }, { value: 1, label: 'True' }]).attributes({ placeholder: 'Pin Protected' }).label('Pin Protected'), nga.field('added_before', 'datetime').label('Added before'), nga.field('added_after', 'datetime').label('Added after'), nga.field('updated_before', 'date').label('Last updated before'), nga.field('updated_after', 'date').label('Last updated after'), nga.field('isavailable', 'boolean').filterChoices([{ value: true, label: 'Available' }, { value: false, label: 'Not Available' }]).label('Available'), nga.field('q').label('').template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>').pinned(true)]).listActions(['edit']).exportFields([vod.listView().fields()]);

	    vod.deletionView().title('<h4>Vods <i class="fa fa-angle-right" aria-hidden="true"></i> Remove <span style ="color:red;"> {{ entry.values.title }}').actions(['<ma-back-button entry="entry" entity="entity"></ma-back-button>']);

	    vod.creationView().title('<h4>Vods <i class="fa fa-angle-right" aria-hidden="true"></i> Create: Movie</h4>').onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
	        progression.done();
	        $state.go($state.get('edit'), { entity: entity.name(), id: entry._identifierValue });
	        return false;
	    }]).fields([nga.field('title', 'string').attributes({ placeholder: 'Movie Name' }).validation({ required: true }).label('Title'), nga.field('original_title', 'string').template('<ma-input-field field="field" value="entry.values.original_title"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">*Movie title as default value</small>').label('Original title'), nga.field('imdb_id', 'string').defaultValue(0).attributes({ placeholder: 'Movie Imdb Id' }).template('<ma-input-field field="field" value="entry.values.imdb_id"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">*This Id should either be left empty, or match exactly the Imdb Id</small>').label('Movie Imdb Id'), nga.field('vod_vod_categories', 'reference_many').targetEntity(admin.getEntity('VodCategories')).targetField(nga.field('name')).label('Genres').attributes({ placeholder: 'Select genre' }).singleApiCall(function (category_id) {
	        return { 'category_id[]': category_id };
	    }), nga.field('package_vods', 'reference_many').targetEntity(admin.getEntity('Packages')).permanentFilters({ package_type_id: [3, 4] }).targetField(nga.field('package_name')).label('Packages').attributes({ placeholder: 'Select packages' }).singleApiCall(function (package_id) {
	        return { 'package_id[]': package_id };
	    }), nga.field('director', 'string').attributes({ placeholder: 'Movie Director' }).validation({ required: true }).label('Director'), nga.field('rate', 'number').attributes({ placeholder: 'Movie rated. Must be greater than 0, smaller or equal to 10' }).validation({ required: true, validator: function validator(value) {
	            if (value <= 0) throw new Error('Rate must be greater than 0');
	            if (value > 10) throw new Error('Rate cannot be greater than 10');
	        } }).label('Rate'), nga.field('vote_average', 'float').defaultValue(5.0).label('Vote Average'), nga.field('vote_count', 'number').defaultValue(0).label('Vote Count'), nga.field('popularity', 'float').defaultValue(0).label('Popularity'), nga.field('clicks', 'number').attributes({ placeholder: 'Movie clicks' }).validation({ required: true }).label('Clicks'), nga.field('duration').validation({ required: true }).attributes({ placeholder: 'Duration of movie in minutes' }).label('Duration'), nga.field('tagline', 'string').defaultValue('').attributes({ placeholder: 'Short description' }).label('Short description'), nga.field('description', 'text').transform(function lineBreaks(value, entry) {
	        return value.split("\n").join("<br/>");
	    }).attributes({ placeholder: 'Movie Subject' }).validation({ required: true, maxlength: 1000 }).label('Description'), nga.field('starring', 'text').transform(function lineBreak(value, entry) {
	        return value.split("\n").join("<br/>");
	    }).attributes({ placeholder: 'Movie actors' }).validation({ required: true, maxlength: 1000 }).label('Starring'), nga.field('trailer_url', 'string').defaultValue('').attributes({ placeholder: 'Trailer url' }).label('Trailer url'), nga.field('homepage', 'string').defaultValue('').attributes({ placeholder: 'Movie website' }).label('Movie website'), nga.field('vod_preview_url', 'file').uploadInformation({ 'url': '/file-upload/single-file/video_scrubbing_url/vod_preview_url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.vod_preview_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.vod_preview_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">Not larger than 1MB</small></div>').defaultValue('').validation({
	        validator: function validator(value) {
	            var vod_preview_url = document.getElementById('vod_preview_url');
	            if (vod_preview_url.value.length > 0) {
	                if (vod_preview_url.files[0].size > 1048576) {
	                    throw new Error('Your File of Video scrubbing url is too Big, not larger than 1MB');
	                }
	            }
	        }
	    }).label('Video scrubbing url'), nga.field('icon_url', 'file').uploadInformation({ 'url': '/file-upload/single-file/vod/icon_url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.icon_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.icon_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">360x516 px, not larger than 150 KB</small></div>').validation({
	        validator: function validator(value) {
	            if (value == null) {
	                throw new Error('Please, choose icon');
	            } else {
	                var icon_url = document.getElementById('icon_url');
	                if (icon_url.value.length > 0) {
	                    if (icon_url.files[0].size > 153600) {
	                        throw new Error('Your Icon is too Big, not larger than 150 KB');
	                    }
	                }
	            }
	        }
	    }).label('Icon *'), nga.field('image_url', 'file').uploadInformation({ 'url': '/file-upload/single-file/vod/image_url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.image_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.image_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">1920x1200 px, not larger than 600 KB</small></div>').validation({
	        validator: function validator(value) {
	            if (value == null) {
	                throw new Error('Please, choose image');
	            } else {
	                var image_url = document.getElementById('image_url');
	                if (image_url.value.length > 0) {
	                    if (image_url.files[0].size > 614400) {
	                        throw new Error('Your Image is too Big, not larger than 600 KB');
	                    }
	                }
	            }
	        }
	    }).label('Image *'), nga.field('pin_protected', 'boolean').attributes({ placeholder: 'Pin Protected' }).validation({ required: true }).label('Pin Protected'), nga.field('adult_content', 'choice').defaultValue(false).choices([{ value: true, label: 'Yes' }, { value: false, label: 'No' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Has adult content'), nga.field('isavailable', 'boolean').attributes({ placeholder: 'Is Available' }).validation({ required: true }).label('Is Available'), nga.field('expiration_time', 'datetime').defaultValue('3018-01-01 00:00:00').label('Expiration date'), nga.field('price', 'float').template('<ma-input-field field="field" value="entry.values.price"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">*Set price to 0 for movies that are not for sale</small>').validation({ required: true }).label('Price'), nga.field('mandatory_ads', 'choice').defaultValue(false).choices([{ value: true, label: 'Enabled' }, { value: false, label: 'Disabled' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Mandatory ads'), nga.field('revenue', 'number').defaultValue(0).label('Revenues'), nga.field('budget', 'number').defaultValue(0).label('Budget'), nga.field('original_language', 'string').defaultValue('en').label('Original language'), nga.field('spoken_languages', 'choices').choices(language_list).label('Spoken languages'), nga.field('release_date', 'date').validation({ required: true }).defaultValue('1896-12-28').label('Release date'), nga.field('status', 'choice').defaultValue('released').choices([{ value: 'filming', label: 'Filming' }, { value: 'post-production', label: 'Post-production' }, { value: 'released', label: 'Released' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Status'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    vod.editionView().title('<h4>Vods <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.title }}</h4>').actions(['list', 'create', '<ma-delete-button label="Remove" entry="entry" entity="entity"></ma-delete-button>']).fields([
	    //creation view fields
	    nga.field('title', 'string').attributes({ placeholder: 'Movie Name' }).validation({ required: true }).label('Title'), nga.field('original_title', 'string').label('Original title'), nga.field('imdb_id', 'string').attributes({ placeholder: 'Movie Imdb Id' }).defaultValue(0).template('<ma-input-field field="field" value="entry.values.imdb_id"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">*This Id should either be left empty, or match exactly the Imdb Id</small>').label('Movie Imdb Id'), nga.field('vod_vod_categories', 'reference_many').targetEntity(admin.getEntity('VodCategories')).targetField(nga.field('name')).label('Genres').attributes({ placeholder: 'Select genre' }).map(function getpckgid(value, entry) {
	        var return_object = [];
	        for (var i = 0; i < value.length; i++) {
	            return_object[i] = value[i].category_id;
	        }
	        return return_object;
	    }).singleApiCall(function (category_id) {
	        return { 'category_id[]': category_id };
	    }), nga.field('package_vods', 'reference_many').targetEntity(admin.getEntity('Packages')).permanentFilters({ package_type_id: [3, 4] }).targetField(nga.field('package_name')).label('Packages').attributes({ placeholder: 'Select packages' }).map(function getpckgid(value, entry) {
	        var return_object = [];
	        for (var i = 0; i < value.length; i++) {
	            return_object[i] = value[i].package_id;
	        }
	        return return_object;
	    }).singleApiCall(function (package_id) {
	        return { 'package_id[]': package_id };
	    }), nga.field('director', 'string').attributes({ placeholder: 'Movie Director' }).validation({ required: true }).label('Director'), nga.field('rate', 'number').attributes({ placeholder: 'Movie rated. Must be greater than 0, smaller or equal to 10' }).validation({ required: true, validator: function validator(value) {
	            if (value <= 0) throw new Error('Rate must be greater than 0');
	            if (value > 10) throw new Error('Rate cannot be greater than 10');
	        } }).label('Rate'), nga.field('vote_average', 'float').defaultValue(5.0).label('Vote Average'), nga.field('vote_count', 'number').defaultValue(0).label('Vote Count'), nga.field('popularity', 'float').defaultValue(0).label('Popularity'), nga.field('clicks', 'number').attributes({ placeholder: 'Movie clicks' }).validation({ required: true }).label('Clicks'), nga.field('duration').validation({ required: true }).attributes({ placeholder: 'Duration of movie in minutes' }).label('Duration'), nga.field('tagline', 'string').defaultValue('').attributes({ placeholder: 'Short description' }).label('Short description'), nga.field('description', 'text').transform(function lineBreaks(value, entry) {
	        return value.split("\n").join("<br/>");
	    }).attributes({ placeholder: 'Movie Subject' }).validation({ required: true, maxlength: 1000 }).label('Description'), nga.field('starring', 'text').transform(function lineBreak(value, entry) {
	        return value.split("\n").join("<br/>");
	    }).attributes({ placeholder: 'Movie actors' }).validation({ required: true, maxlength: 1000 }).label('Starring'), nga.field('trailer_url', 'string').attributes({ placeholder: 'Trailer url' }).label('Trailer url'), nga.field('homepage', 'string').defaultValue('').attributes({ placeholder: 'Movie website' }).label('Movie website'), nga.field('vod_preview_url', 'file').uploadInformation({ 'url': '/file-upload/single-file/video_scrubbing_url/vod_preview_url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.vod_preview_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.vod_preview_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">Not larger than 1MB</small></div>').defaultValue('').validation({
	        validator: function validator(value) {
	            var vod_preview_url = document.getElementById('vod_preview_url');
	            if (vod_preview_url.value.length > 0) {
	                if (vod_preview_url.files[0].size > 1048576) {
	                    throw new Error('Your File of Video scrubbing url is too Big, not larger than 1MB');
	                }
	            }
	        }
	    }).label('Video scrubbing url'), nga.field('icon_url', 'file').uploadInformation({ 'url': '/file-upload/single-file/vod/icon_url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.icon_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.icon_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">360x516 px, not larger than 150 KB</small></div>').validation({
	        validator: function validator(value) {
	            if (value == null) {
	                // throw new Error('Please, choose icon');
	            } else {
	                    var icon_url = document.getElementById('icon_url');
	                    if (icon_url.value.length > 0) {
	                        if (icon_url.files[0].size > 153600) {
	                            throw new Error('Your Icon is too Big, not larger than 150 KB');
	                        }
	                    }
	                }
	        }
	    }).label('Icon *'), nga.field('image_url', 'file').uploadInformation({ 'url': '/file-upload/single-file/vod/image_url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.image_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.image_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">1920x1200 px, not larger than 600 KB</small></div>').validation({
	        validator: function validator(value) {
	            if (value == null) {
	                throw new Error('Please, choose image');
	            } else {
	                var image_url = document.getElementById('image_url');
	                if (image_url.value.length > 0) {
	                    if (image_url.files[0].size > 614400) {
	                        throw new Error('Your Image is too Big, not larger than 600 KB');
	                    }
	                }
	            }
	        }
	    }).label('Image *'), nga.field('pin_protected', 'boolean').attributes({ placeholder: 'Pin Protected' }).validation({ required: true }).label('Pin Protected'), nga.field('adult_content', 'choice').defaultValue(false).choices([{ value: true, label: 'Yes' }, { value: false, label: 'No' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Has adult content'), nga.field('isavailable', 'boolean').attributes({ placeholder: 'Is Available' }).validation({ required: true }).label('Is Available'), nga.field('expiration_time', 'datetime').defaultValue('3018-01-01 00:00:00').label('Expiration date'), nga.field('price', 'float').template('<ma-input-field field="field" value="entry.values.price"></ma-input-field>' + '<small id="emailHelp" class="form-text text-muted">*Set price to 0 for movies that are not for sale</small>').validation({ required: true }).label('Price'), nga.field('mandatory_ads', 'choice').defaultValue(false).choices([{ value: true, label: 'Enabled' }, { value: false, label: 'Disabled' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Mandatory ads'), nga.field('revenue', 'number').defaultValue(0).label('Revenues'), nga.field('budget', 'number').defaultValue(0).label('Budget'), nga.field('original_language', 'string').defaultValue('en').label('Original language'), nga.field('spoken_languages', 'choices').choices(language_list).label('Spoken languages'), nga.field('release_date', 'date').validation({ required: true }).defaultValue('1896-12-28').label('Release date'), nga.field('status', 'choice').defaultValue('released').choices([{ value: 'filming', label: 'Filming' }, { value: 'post-production', label: 'Post-production' }, { value: 'released', label: 'Released' }]).attributes({ placeholder: 'Choose from dropdown list' }).validation({ required: true }).label('Status'),
	    //default subtitle field is exclusive to the edition view
	    nga.field('default_subtitle_id', 'choice').choices(function (entry) {
	        var no_sub_object = { value: 0, label: "No default subtitles", selected: true };
	        entry.values.vod_subtitles.unshift(no_sub_object);
	        return entry.values.vod_subtitles;
	    }).label('Default subtitles'), nga.field('template').label('').template(_edit_buttonHtml2['default']), nga.field('vodsubtitles', 'referenced_list').label('Subtitles').targetEntity(admin.getEntity('vodsubtitles')).targetReferenceField('vod_id').targetFields([nga.field('title').label('Language')]).listActions(['edit', 'delete']), nga.field('ADD SUBTITLES', 'template').label('').template('<ma-create-button entity-name="vodsubtitles" class="pull-right" label="ADD SUBTITLES" default-values="{ vod_id: entry.values.id }"></ma-create-button>'), nga.field('vodstreams', 'referenced_list').label('Stream Sources').targetEntity(admin.getEntity('vodstreams')).targetReferenceField('vod_id').targetFields([nga.field('url')
	    // .map(function truncate(value) {
	    //     if (!value) {
	    //         return '';
	    //     }
	    //     return value.length > 35 ? value.substr(0, 35) + '...' : value;
	    // })
	    .label('Vod URL')]).listActions(['edit', 'delete']), nga.field('ADD STREAM', 'template').label('').template('<ma-create-button entity-name="vodstreams" class="pull-right" label="ADD STREAM" default-values="{ vod_id: entry.values.id }"></ma-create-button>')]);

	    return vod;
	};

	module.exports = exports['default'];

/***/ },
/* 202 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	    var vodcategory = admin.getEntity('VodCategories');
	    vodcategory.listView().title('<h4>Vod Categories <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('icon_url', 'file').template('<img src="{{ entry.values.icon_url }}" height="35" width="35" />').cssClasses('hidden-xs').label('Icon'), nga.field('small_icon_url', 'file').template('<img src="{{ entry.values.small_icon_url }}" height="35" width="35" />').cssClasses('hidden-xs').label('Small icon'), nga.field('name', 'string').label('Name'), nga.field('description', 'text').cssClasses('hidden-xs').label('Description'), nga.field('sorting', 'string').cssClasses('hidden-xs').label('Sorting'), nga.field('isavailable', 'boolean').label('Available'), nga.field('password', 'boolean').label('Password')]).listActions(['edit', '<ma-delete-button label="Remove" entry="entry" entity="entity" size="xs"></ma-delete-button>']).exportFields([vodcategory.listView().fields()]);

	    vodcategory.deletionView().title('<h4>Vod Category <i class="fa fa-angle-right" aria-hidden="true"></i> Remove <span style ="color:red;"> {{ entry.values.name }} </span></h4>').actions(['<ma-back-button entry="entry" entity="entity"></ma-back-button>']);

	    vodcategory.creationView().title('<h4>Vod Categories <i class="fa fa-angle-right" aria-hidden="true"></i> Create: Vod Category</h4>').fields([nga.field('name', 'string').attributes({ placeholder: 'Category name' }).validation({ required: true }).label('Name'), nga.field('description', 'text').attributes({ placeholder: 'Specify information you need for the category' }).validation({ required: true }).label('Description'), nga.field('sorting', 'number').attributes({ placeholder: 'Sorting' }).validation({ required: true }).label('Sorting'), nga.field('icon_url', 'file').uploadInformation({ 'url': '/file-upload/single-file/vodcategory/icon_url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.icon_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.icon_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">1920x1200 px, not larger than 600 KB</small></div>').validation({
	        validator: function validator(value) {
	            if (value == null) {
	                throw new Error('Please, choose icon');
	            } else {
	                var icon_url = document.getElementById('icon_url');
	                if (icon_url.value.length > 0) {
	                    if (icon_url.files[0].size > 614400) {
	                        throw new Error('Your Icon is too Big, not larger than 600 KB');
	                    }
	                }
	            }
	        }
	    }).label('Icon *'), nga.field('small_icon_url', 'file').uploadInformation({ 'url': '/file-upload/single-file/vodcategory/small_icon_url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-1"><img src="{{ entry.values.small_icon_url }}" height="40" width="40" /></div>' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.small_icon_url"></ma-file-field></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">159x117 px, not larger than 150 KB</small></div>').validation({
	        validator: function validator(value) {
	            if (value == null) {
	                throw new Error('Please, choose your small icon');
	            } else {
	                var small_icon_url = document.getElementById('small_icon_url');
	                if (small_icon_url.value.length > 0) {
	                    if (small_icon_url.files[0].size > 153600) {
	                        throw new Error('Your Small Icon is too Big, not larger than 150 KB');
	                    }
	                }
	            }
	        }
	    }).label('Small icon *'), nga.field('password', 'boolean').attributes({ placeholder: 'Password' }).validation({ required: true }).label('Password'), nga.field('isavailable', 'boolean').attributes({ placeholder: 'Is Available' }).validation({ required: true }).label('Is Available'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    vodcategory.editionView().title('<h4>Vod Categories <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.name }}</h4>').actions(['list']).fields([vodcategory.creationView().fields()]);

	    return vodcategory;
	};

	module.exports = exports['default'];

/***/ },
/* 203 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	    var vodstream = admin.getEntity('vodstreams');
	    vodstream.listView().title('<h4>Vod Streams <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('vod_id', 'reference').targetEntity(admin.getEntity('Vods')).targetField(nga.field('title')).label('Vod'), nga.field('stream_source_id', 'reference').targetEntity(admin.getEntity('VodStreamSources')).targetField(nga.field('description')).label('Stream Source'), nga.field('url', 'string')
	    // .map(function truncate(value) {
	    // 	if (!value) {
	    //            return '';
	    //      	}
	    //            return value.length > 25 ? value.substr(0, 25) + '...' : value;
	    //      	})
	    .label('Url'), nga.field('token', 'boolean').label('Token'), nga.field('encryption', 'boolean').label('Encryption'), nga.field('token_url', 'string').label('Token Url')]).listActions(['edit']).exportFields([vodstream.listView().fields()]);

	    vodstream.deletionView().title('<h4>Vod Streams <i class="fa fa-angle-right" aria-hidden="true"></i> Remove <span style ="color:red;"> Vod Streams').actions(['<ma-back-button entry="entry" entity="entity"></ma-back-button>']);

	    vodstream.creationView().title('<h4>Vod Streams <i class="fa fa-angle-right" aria-hidden="true"></i> Create: Vod Stream</h4>').onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
	        progression.done();
	        $state.go($state.get('edit'), { entity: 'Vods', id: entry.values.vod_id });
	        return false;
	    }]).fields([nga.field('vod_id', 'reference').targetEntity(admin.getEntity('Vods')).targetField(nga.field('title')).attributes({ placeholder: 'Choose from dropdown list VOD Movie' }).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select Vod');
	            }
	        }
	    }).perPage(-1).label('Vod *'), nga.field('stream_source_id', 'reference').targetEntity(admin.getEntity('VodStreamSources')).targetField(nga.field('description')).attributes({ placeholder: 'Stream Source' }).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select Stream Source');
	            }
	        }
	    }).perPage(-1).label('Stream Source *'), nga.field('url', 'string').attributes({ placeholder: 'Movie Stream Url' }).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select Url');
	            }
	        }
	    }).label('Url *'), nga.field('stream_resolution', 'choices').attributes({ placeholder: 'Select screen types where this stream should play' }).choices([{ value: 1, label: 'Android Set Top Box' }, { value: 2, label: 'Android Smart Phone' }, { value: 3, label: 'IOS' }, { value: 4, label: 'Android Smart TV' }, { value: 5, label: 'Samsung Smart TV' }, { value: 6, label: 'Apple TV' }]).defaultValue([1, 2, 3, 4, 5, 6]).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select Stream resolution');
	            }
	        }
	    }).label('Stream resolution *'), nga.field('stream_format', 'choice').attributes({ placeholder: 'Stream Format' }).choices([{ value: 0, label: 'MPEG Dash' }, { value: 1, label: 'Smooth Streaming' }, { value: 2, label: 'HLS' }, { value: 3, label: 'OTHER' }]).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select Stream Format');
	            }
	        }
	    }).label('Stream Format *'), nga.field('token', 'boolean').attributes({ placeholder: 'Token' }).validation({ required: true }).label('Token'), nga.field('token_url', 'string').defaultValue('Token Url').attributes({ placeholder: 'Token Url' }).validation({ required: true }).label('Token Url'), nga.field('encryption', 'boolean').validation({ required: true }).label('Encryption'), nga.field('encryption_url', 'string').defaultValue('Encryption url').validation({ required: true }).label('Encryption url'), nga.field('drm_platform', 'choice').attributes({ placeholder: 'Select from dropdown list' }).defaultValue('none').choices([{ value: 'none', label: 'None' }, { value: 'pallycon', label: 'Pallycon' }, { value: 'verimatrix', label: 'Verimatrix' }, { value: 'widevine', label: 'Widevine' }]).validation({ validator: function validator(value) {
	            if (value === null || value === '') {
	                throw new Error('Please Select DRM Platform');
	            }
	        }
	    }).label('DRM Platform *'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    vodstream.editionView().title('<h4>Vod Streams <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.vod_id }}</h4>').actions(['list', 'delete']).fields([vodstream.creationView().fields()]);

	    return vodstream;
	};

	module.exports = exports['default'];

/***/ },
/* 204 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	  var vodstreamsource = admin.getEntity('VodStreamSources');
	  vodstreamsource.listView().title('<h4>Vod Stream Sources <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('description', 'string').label('Stream Source')]).listActions(['edit']).exportFields([vodstreamsource.listView().fields()]);

	  vodstreamsource.creationView().title('<h4>Vod Stream Sources <i class="fa fa-angle-right" aria-hidden="true"></i> Create: Vod Stream Source</h4>').fields([nga.field('description', 'string').attributes({ placeholder: 'Description' }).validation({ required: true }).label('Stream Source'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	  vodstreamsource.editionView().title('<h4>Vod Stream Sources <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.description }}</h4>').actions(['list']).fields([vodstreamsource.creationView().fields()]);

	  return vodstreamsource;
	};

	module.exports = exports['default'];

/***/ },
/* 205 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	    var vodsubtitles = admin.getEntity('vodsubtitles');
	    vodsubtitles.listView().title('<h4>Vod Subtitles <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('vod_id', 'reference').targetEntity(admin.getEntity('Vods')).targetField(nga.field('title')).label('Vod'), nga.field('title', 'string').label('Title'), nga.field('subtitle_url', 'string').map(function truncate(value) {
	        if (!value) {
	            return '';
	        }
	        return value.length > 25 ? value.substr(0, 25) + '...' : value;
	    }).label('Subtitle Url')]).filters([nga.field('q').label('').template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>').pinned(true)]).listActions(['edit']).exportFields([vodsubtitles.listView().fields()]);

	    vodsubtitles.deletionView().title('<h4>Channel Streams <i class="fa fa-angle-right" aria-hidden="true"></i> Remove <span style ="color:red;"> {{entry.values.title}}').actions(['<ma-back-button entry="entry" entity="entity"></ma-back-button>']);

	    vodsubtitles.creationView().title('<h4>Vod Subtitles <i class="fa fa-angle-right" aria-hidden="true"></i> Create: Vod Subtitles</h4>').onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function (progression, notification, $state, entry, entity) {
	        progression.done();
	        $state.go($state.get('edit'), { entity: 'Vods', id: entry.values.vod_id });

	        return false;
	    }]).fields([nga.field('vod_id', 'reference').targetEntity(admin.getEntity('Vods')).targetField(nga.field('title')).attributes({ placeholder: 'Select Vod from dropdown list' }).validation({ required: true }).perPage(-1).label('Vod'), nga.field('title').attributes({ placeholder: 'Specify the subtitles title' }).validation({ required: true }).label('Title'), nga.field('subtitle_url', 'file').uploadInformation({ 'url': '/file-upload/single-file/subtitles/subtitle_url', 'apifilename': 'result' }).template('<div class="row">' + '<div class="col-xs-12 col-sm-8"><ma-file-field field="field" value="entry.values.subtitle_url"></ma-file-field></div>' + '<div class="col-xs-12 col-sm-1" style="display: none;"><img src="{{ entry.values.subtitle_url }}"/></div>' + '</div>' + '<div class="row"><small id="emailHelp" class="form-text text-muted">Please, make sure the subtitle file is correctly encoded</small></div>').label('File input *').validation({ required: true }).label('URL'), nga.field('template').label('').template(_edit_buttonHtml2['default'])]);

	    vodsubtitles.editionView().title('<h4>Vod Subtitles <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.vod_id }}</h4>').actions(['list', 'delete']).fields([vodsubtitles.creationView().fields()]);

	    return vodsubtitles;
	};

	module.exports = exports['default'];

/***/ },
/* 206 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _edit_buttonHtml = __webpack_require__(136);

	var _edit_buttonHtml2 = _interopRequireDefault(_edit_buttonHtml);

	exports['default'] = function (nga, admin) {
	    var paymenttransaction = admin.getEntity('PaymentTransactions');
	    paymenttransaction.listView().title('<h4>Payment Transactions <i class="fa fa-angle-right" aria-hidden="true"></i> List</h4>').batchActions([]).fields([nga.field('id', 'number').label('ID'), nga.field('transaction_id', 'string').label('Transaction ID'), nga.field('transaction_type', 'string').label('Transaction Type'), nga.field('transaction_token', 'string').label('Transaction Token'), nga.field('message', 'string').label('Message'), nga.field('customer_username', 'string').label('Customer Username'), nga.field('product_id', 'text').label('Product'), nga.field('payment_provider', 'string').label('Payment Provider'), nga.field('payment_success', 'boolean').label('Payment Success')]).listActions(['edit']).exportFields([paymenttransaction.listView().fields()]);

	    paymenttransaction.editionView().title('<h4>Transaction <i class="fa fa-angle-right" aria-hidden="true"></i> Edit: {{ entry.values.username }}</h4>').actions(['list']).fields([nga.field('id', 'number').editable(false).label('ID'), nga.field('transaction_id', 'string').label('Transaction ID').editable(false), nga.field('transaction_type', 'string').label('Transaction Type').editable(false), nga.field('transaction_token', 'string').editable(false).label('Transaction Token'), nga.field('message', 'string').editable(false).label('Message'), nga.field('customer_username', 'string').editable(false).label('Customer Username'), nga.field('product_id', 'text').editable(false).label('Product'), nga.field('payment_provider', 'string').editable(false).label('Payment Provider'), nga.field('payment_success', 'boolean').editable(false).label('Payment Success'), nga.field('full_log', 'json').editable(false).label('Full Transaction Log')]);

	    return paymenttransaction;
	};

	module.exports = exports['default'];

/***/ },
/* 207 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _resellers_dashboardHtml = __webpack_require__(208);

	var _resellers_dashboardHtml2 = _interopRequireDefault(_resellers_dashboardHtml);

	var moment = __webpack_require__(5);
	var fromNow = function fromNow(v) {
	    return moment(v).fromNow();
	};

	exports['default'] = function (nga, admin) {

	    return nga.dashboard().addCollection(nga.collection(admin.getEntity('MySales')).name('sales_report').title('Last 10 sales').fields([
	    // nga.field('user_id', 'reference')
	    //     .targetEntity(admin.getEntity('Users'))
	    //     .targetField(nga.field('username'))
	    //     .cssClasses('hidden-xs')
	    //     .label('User'),
	    nga.field('combo_id', 'reference').targetEntity(admin.getEntity('Combos')).targetField(nga.field('name')).isDetailLink(false).label('Product'), nga.field('user_username', 'reference').targetEntity(admin.getEntity('ResellersLoginData')).targetField(nga.field('username')).label('Customers Username'), nga.field('saledate', 'date').cssClasses('hidden-xs').label('Sale Date')]).permanentFilters({
	        distributorname: localStorage.userName
	    }).perPage(10)).template(_resellers_dashboardHtml2['default']);
	};

	module.exports = exports['default'];

/***/ },
/* 208 */
/***/ function(module, exports) {

	module.exports = "<div class=\"row dashboard-starter\"></div>\r\n<resellersdashboard-summary></resellersdashboard-summary>\r\n\r\n<graph>\r\n    <vis-timeline data=\"data\" options=\"options\"></vis-timeline>\r\n</graph>\r\n\r\n<div class=\"row dashboard-content\">\r\n\r\n    <div class=\"col-lg-12\">\r\n        <div class=\"panel panel-default theme\">\r\n            <ma-dashboard-panel collection=\"dashboardController.collections.sales_report\" entries=\"dashboardController.entries.sales_report\" datastore=\"dashboardController.datastore\"></ma-dashboard-panel>\r\n        </div>\r\n    </div>\r\n\r\n\r\n    <div class=\"container-fluid\">\r\n        <!--div class=\"col-xs-2 idiqagentstatus-buttonHolders pull-right\">\r\n        <button type=\"button\" class=\"btn btn-xs\" ng-click=\"agentClicked()\">Show hidden Node and change color</button>\r\n      </div-->\r\n        <vis-timeline data=\"data\" options=\"options\"></vis-timeline>\r\n    </div>\r\n\r\n</div>";

/***/ },
/* 209 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _dashboardHtml = __webpack_require__(210);

	var _dashboardHtml2 = _interopRequireDefault(_dashboardHtml);

	var moment = __webpack_require__(5);
	var fromNow = function fromNow(v) {
		return moment(v).fromNow();
	};

	exports['default'] = function (nga, admin) {

		return nga.dashboard().addCollection(nga.collection(admin.getEntity('Salesreports')).name('sales_report').title('Last 10 sales').fields([nga.field('user_id', 'reference').targetEntity(admin.getEntity('Users')).targetField(nga.field('username')).cssClasses('hidden-xs').label('User'), nga.field('combo_id', 'reference').targetEntity(admin.getEntity('Combos')).targetField(nga.field('name')).label('Product'), nga.field('user_username', 'reference').targetEntity(admin.getEntity('LoginData')).targetField(nga.field('username')).label('Customers Username'), nga.field('saledate', 'date').cssClasses('hidden-xs').label('Sale Date')]).perPage(10)).addCollection(nga.collection(admin.getEntity('LoginData')).name('login_accounts').title('Last 10 accounts created').fields([nga.field('customer_id', 'reference').targetEntity(admin.getEntity('CustomerData')).targetField(nga.field('firstname').map(function (value, entry) {
			return entry.firstname + ' ' + entry.lastname;
		})).cssClasses('hidden-xs').label('Customer'), nga.field('username', 'string').label('Customers Username'), nga.field('pin', 'string').cssClasses('hidden-xs').label('Pin'), nga.field('timezone', 'number').cssClasses('hidden-xs').label('Timezone'), nga.field('force_upgrade', 'boolean').cssClasses('hidden-xs').label('Force Upgrade'), nga.field('account_lock', 'boolean').cssClasses('hidden-xs').label('Account Lock'), nga.field('auto_timezone', 'boolean').cssClasses('hidden-xs').label('Auto Timezone'), nga.field('createdAt', 'date').cssClasses('hidden-xs').label('Created At')]).listActions(['edit']).perPage(10)).template(_dashboardHtml2['default']);
	};

	module.exports = exports['default'];

/***/ },
/* 210 */
/***/ function(module, exports) {

	module.exports = "<div class=\"row dashboard-starter\"></div>\r\n<dashboard-summary></dashboard-summary>\r\n\r\n<graph>\r\n    <vis-timeline data=\"data\" options=\"options\"></vis-timeline>\r\n</graph>\r\n\r\n<div class=\"row dashboard-content\">\r\n\r\n    <div class=\"container-fluid\">\r\n        <div class=\"panel panel-default theme\">\r\n            <ma-dashboard-panel collection=\"dashboardController.collections.login_accounts\" entries=\"dashboardController.entries.login_accounts\" datastore=\"dashboardController.datastore\"></ma-dashboard-panel>\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"col-lg-12\">\r\n        <div class=\"panel panel-default theme\">\r\n            <ma-dashboard-panel collection=\"dashboardController.collections.sales_report\" entries=\"dashboardController.entries.sales_report\" datastore=\"dashboardController.datastore\"></ma-dashboard-panel>\r\n        </div>\r\n    </div>\r\n\r\n\r\n    <div class=\"container-fluid\">\r\n        <!--div class=\"col-xs-2 idiqagentstatus-buttonHolders pull-right\">\r\n        <button type=\"button\" class=\"btn btn-xs\" ng-click=\"agentClicked()\">Show hidden Node and change color</button>\r\n      </div-->\r\n        <vis-timeline data=\"data\" options=\"options\"></vis-timeline>\r\n    </div>\r\n\r\n</div>";

/***/ },
/* 211 */
/***/ function(module, exports) {

	module.exports = "<div class=\"navbar-header\">\r\n    <button type=\"button\" class=\"navbar-toggle\" ng-click=\"isCollapsed = !isCollapsed\">\r\n        <span class=\"icon-bar\"></span>\r\n        <span class=\"icon-bar\"></span>\r\n        <span class=\"icon-bar\"></span>\r\n    </button>\r\n    <a class=\"navbar-brand\" href=\"#\" ng-click=\"appController.displayHome()\" ng-app=\"myApp\" ng-controller=\"envVariablesCtrl\">\r\n\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-6\">\r\n                <img src=\"{{company_logo}}\"  class=\"img-responsive logo_company\" alt=\"Company Logo\">\r\n            </div>\r\n            <div class=\"col-sm-6\">\r\n                <p id=\"company_name\">{{company_name}} - Administration System</p>\r\n            </div>\r\n        </div>\r\n    </a>\r\n</div>\r\n\r\n<ul class=\"nav navbar-top-links navbar-right text-center responsive\">\r\n    <li uib-dropdown>\r\n        <a uib-dropdown-toggle href=\"#\" aria-expanded=\"true\" ng-controller=\"username\">\r\n            <i class=\"fa fa-user fa-lg\"></i>&nbsp; {{ username }}&nbsp;<i class=\"fa fa-caret-down\"></i>\r\n        </a>\r\n        <ul class=\"dropdown-menu dropdown-user\" role=\"menu\">\r\n            <li><a href=\"#/personal\" onClick=\"window.location.reload()\"><i class=\"fa fa-user fa-fw\"></i> Personal Details</a></li>\r\n            <li><a href=\"#/change-password\"><i class=\"fa fa-cog fa-fw\"></i> Change Password</a></li>\r\n            <li><a href=\"#\" onclick=\"logout()\"><i class=\"fa fa-sign-out fa-fw\"></i> Logout</a></li>\r\n        </ul>\r\n    </li>\r\n</ul>\r\n\r\n<ul class=\"nav navbar-top-links navbar-right text-center\">\r\n    <li uib-dropdown ng-controller=\"languageCtrl\">\r\n        <a id=\"single-button\" href=\"#\" aria-expanded=\"true\" uib-dropdown-toggle ng-disabled=\"disabled\">\r\n            <i class=\"fa fa-globe fa-lg\"></i>&nbsp; Language {{button}}&nbsp;<i class=\"fa fa-caret-down\"></i>\r\n        </a>\r\n        <ul class=\"dropdown-menu dropdown-user\" role=\"menu\" aria-labelledby=\"single-button\">\r\n            <li role=\"menuitem\">\r\n                <a ng-click=\"serve_language('en');change('English')\"><i class=\"fa fa-sign-out fa-fw\"></i> English</a>\r\n                <a ng-click=\"serve_language('fr');change('French')\"><i class=\"fa fa-sign-out fa-fw\"></i> French</a>\r\n                <a ng-click=\"serve_language('sp');change('Spanish')\"><i class=\"fa fa-sign-out fa-fw\"></i> Spanish</a>\r\n\t\t\t\t<a ng-click=\"serve_language('sq');change('Albanian')\"><i class=\"fa fa-sign-out fa-fw\"></i> Albanian</a>\r\n            </li>\r\n\r\n        </ul>\r\n    </li>\r\n</ul>\r\n\r\n\r\n\r\n";

/***/ },
/* 212 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports["default"] = [{
	    "title": "Dashboard",
	    "icon": '<span class="fa fa-tachometer fa-fw"></span>',
	    "group_roles": ["admin", "administrator", "customercare", "management", "guest"],
	    "children": [],
	    "link": '/dashboard'
	}, {
	    "template": '<div class="menu_space">Customers / Users</div>',
	    "group_roles": ["admin", "administrator", "customercare", "management", "guest"],
	    "children": []
	}, {
	    "title": "Customers",
	    "icon": '<span class="fa fa-user fa-fw"></span>',
	    "group_roles": ["admin", "administrator", "customercare", "management", "guest"],
	    "children": [{
	        "entity": "CustomerGroups",
	        "title": "Customer Group",
	        "icon": '<span class="fa fa-users fa-fw"></span>',
	        "link": '/CustomerGroups/list',
	        "group_roles": ["admin", "administrator", "customercare", "management", "guest"]
	    }, {
	        "entity": "CustomerData",
	        "title": "Customer",
	        "icon": '<span class="fa fa-user fa-fw"></span>',
	        "link": '/CustomerData/list',
	        "group_roles": ["admin", "administrator", "customercare", "management", "guest"]
	    }, {
	        "entity": "LoginData",
	        "title": "Login Accounts",
	        "icon": '<span class="fa fa-user-circle fa-fw"></span>',
	        "link": '/LoginData/list',
	        "group_roles": ["admin", "administrator", "customercare", "management", "guest"]
	    }, {
	        "entity": "Devices",
	        "title": "Devices",
	        "icon": '<span class="fa fa-mobile fa-fw"></span>',
	        "link": '/Devices/list',
	        "group_roles": ["admin", "administrator", "customercare", "management", "guest"]
	    }]
	}, {
	    "title": "System Users",
	    "icon": '<span class="fa fa-users fa-fw"></span>',
	    "group_roles": ["admin", "administrator", "customercare", "management", "guest"],
	    "children": [{
	        "entity": "Groups",
	        "title": "User Groups",
	        "icon": '<span class="fa fa-users fa-fw"></span>',
	        "link": '/Groups/list',
	        "group_roles": ["admin", "administrator", "customercare", "management", "guest"]
	    }, {
	        "entity": "Users",
	        "title": "Users",
	        "icon": '<span class="fa fa-user fa-fw"></span>',
	        "link": '/Users/list',
	        "group_roles": ["admin", "administrator", "management", "guest"]
	    }]
	}, {
	    "template": '<div class="menu_space">Sales</div>',
	    "group_roles": ["admin", "administrator", "customercare", "management", "guest"],
	    "children": []
	}, {
	    "title": "Subscription",
	    "icon": '<span class="fa fa-calendar-check-o fa-fw"></span>',
	    "group_roles": ["admin", "administrator", "customercare", "management", "guest"],
	    "children": [],
	    "link": '/Subscriptions/list'
	}, {
	    "title": "Reports",
	    "icon": '<span class="fa fa-list fa-fw"></span>',
	    "group_roles": ["admin", "administrator", "finance", "customercare", "management", "guest"],
	    "children": [{
	        "entity": "Salesreports",
	        "title": "Sales export",
	        "icon": '<span class="fa fa-list fa-fw"></span>',
	        "link": '/Salesreports/list',
	        "group_roles": ["admin", "administrator", "finance", "customercare", "management", "guest"]
	    }, {
	        "entity": "sales_by_product",
	        "title": "Product Sales",
	        "icon": '<span class="fa fa-list fa-fw"></span>',
	        "link": '/sales_by_product/list',
	        "group_roles": ["admin", "administrator", "finance", "customercare", "management", "guest"]
	    }, {
	        "entity": "sales_by_date",
	        "title": "Sales By Day",
	        "icon": '<span class="fa fa-list fa-fw"></span>',
	        "link": '/sales_by_date/list',
	        "group_roles": ["admin", "administrator", "finance", "customercare", "management", "guest"]
	    }, {
	        "entity": "sales_by_month",
	        "title": "Sales By Month",
	        "icon": '<span class="fa fa-list fa-fw"></span>',
	        "link": '/sales_by_month/list',
	        "group_roles": ["admin", "administrator", "finance", "customercare", "management", "guest"]
	    }, {
	        "entity": "sales_monthly_expiration",
	        "title": "Account Expiration By Month",
	        "icon": '<span class="fa fa-list fa-fw"></span>',
	        "link": '/sales_monthly_expiration/list',
	        "group_roles": ["admin", "administrator", "finance", "customercare", "management", "guest"]
	    }, {
	        "entity": "sales_by_expiration",
	        "title": "Expirations List",
	        "icon": '<span class="fa fa-list fa-fw"></span>',
	        "link": '/sales_by_expiration/list',
	        "group_roles": ["admin", "administrator", "finance", "customercare", "management", "guest"]
	    }, {
	        "entity": "",
	        "title": "Expiration Next 30 Days",
	        "icon": '<span class="fa fa-list fa-fw"></span>',
	        "link": '/sales_by_expiration/list?search=%7B%22next%22:%2230%22%7D',
	        "group_roles": ["admin", "administrator", "finance", "customercare", "management", "guest"]
	    }]
	}, {
	    "entity": "Combos",
	    "title": "Products / Plans",
	    "icon": '<span class="fa fa-tags fa-fw"></span>',
	    "link": '/Combos/list',
	    "group_roles": ["admin", "administrator", "customercare", "management", "guest"],
	    "children": []
	}, {
	    "template": '<div class="menu_space">Settings</div>',
	    "group_roles": ["admin", "administrator", "customercare", "management", "guest"],
	    "children": []
	}, {
	    "title": "Company Settings",
	    "icon": '<span class="fa fa-cog fa-fw"></span>',
	    "group_roles": ["admin", "administrator", "customercare", "management", "guest"],
	    "children": [{
	        "entity": "EmailSettings",
	        "title": "Email Settings",
	        "icon": '<span class="fa fa-envelope-o fa-fw"></span>',
	        "link": '/EmailSettings/edit/1',
	        "group_roles": ["admin", "administrator", "customercare", "management", "guest"]
	    }, {
	        "entity": "PlayerSettings",
	        "title": "Player Settings",
	        "icon": '<span class="fa fa-play fa-fw"></span>',
	        "link": '/PlayerSettings/edit/1',
	        "group_roles": ["admin", "administrator", "customercare", "management", "guest"]
	    }, {
	        "entity": "LogosImages",
	        "title": "Logos and Images",
	        "icon": '<span class="fa fa-picture-o fa-fw"></span>',
	        "link": '/ImagesSettings/edit/1',
	        "group_roles": ["admin", "administrator", "customercare", "management", "guest"]
	    }, {
	        "entity": "URL",
	        "title": "URLs",
	        "icon": '<span class="fa fa-link fa-fw"></span>',
	        "link": '/URL/edit/1',
	        "group_roles": ["admin", "administrator", "customercare", "management", "guest"]
	    }, {
	        "entity": "ApiKeys",
	        "title": "Api Keys",
	        "icon": '<span class="fa fa-key fa-fw"></span>',
	        "link": '/ApiKeys/edit/1',
	        "group_roles": ["admin", "administrator", "customercare", "management", "guest"]
	    }, {
	        "entity": "",
	        "title": "GeoIP",
	        "icon": '<span class="fa fa-globe fa-fw"></span>',
	        "link": '/geoip',
	        "group_roles": ["admin", "administrator", "customercare", "management", "guest"]
	    }, {
	        "entity": "Settings",
	        "title": "Other",
	        "icon": '<span class="fa fa-cog fa-fw"></span>',
	        "link": '/Settings/edit/1',
	        "group_roles": ["admin", "administrator", "customercare", "management", "guest"]
	    }]
	}, {
	    "title": "Advanced Settings",
	    "icon": '<span class="fa fa-cog fa-fw"></span>',
	    "link": '/AdvancedSettings/list',
	    "group_roles": ["admin", "administrator", "customercare", "management", "guest"],
	    "children": []
	}, {
	    "entity": "DeviceMenus",
	    "title": "Main Menu",
	    "icon": '<span class="fa fa-align-justify fa-fw"></span>',
	    "link": '/DeviceMenus/list',
	    "group_roles": ["admin", "administrator", "customercare", "management", "guest"],
	    "children": []
	}, {
	    "entity": "Submenu",
	    "title": "Submenu",
	    "icon": '<span class="fa fa-align-justify fa-fw"></span>',
	    "link": '/Submenu/list',
	    "group_roles": ["admin", "administrator", "customercare", "management", "guest"],
	    "children": []
	}, {
	    "template": '<div class="menu_space">TV / VOD</div>',
	    "group_roles": ["admin", "administrator", "customercare", "management", "guest"],
	    "children": []
	},
	// {
	//     "entity":"SystemMenu",
	//     "title":"System Menu",
	//     "icon":'<span class="fa fa-align-justify fa-fw"></span>',
	//     "link":'/SystemMenu/list',
	//     "group_roles":["admin","administrator","customercare","management"],
	//     "children": []
	// },
	{
	    "title": "TV Channels",
	    "icon": '<span class="fa fa-television fa-fw"></span>',
	    "group_roles": ["admin", "administrator", "customercare", "management", "guest"],
	    "children": [{
	        "entity": "Genres",
	        "title": "Categories / Genre",
	        "icon": '<span class="fa fa-folder-open fa-fw"></span>',
	        "link": '/Genres/list',
	        "group_roles": ["admin", "administrator", "customercare", "management", "guest"]
	    }, {
	        "entity": "Channels",
	        "title": "Channels / Streams",
	        "icon": '<span class="fa fa-television fa-fw"></span>',
	        "link": '/Channels/list',
	        "group_roles": ["admin", "administrator", "customercare", "management", "guest"]
	    }, {
	        "entity": "Channels",
	        "title": "Not Active Channels",
	        "icon": '<span class="fa fa-times-circle-o fa-fw"></span>',
	        "link": '/Channels/list?search=%7B"isavailable":false%7D',
	        "group_roles": ["admin", "administrator", "customercare", "management", "guest"]
	    }, {
	        "entity": "ChannelStreamSources",
	        "title": "Live TV Stream Source",
	        "icon": '<span class="fa fa-signal fa-fw"></span>',
	        "link": '/ChannelStreamSources/list',
	        "group_roles": ["admin", "administrator", "customercare", "management", "guest"]
	    }, {
	        "entity": "livepackages",
	        "title": "Channel Packages",
	        "icon": '<span class="fa fa-th fa-fw"></span>',
	        "link": '/livepackages/list',
	        "group_roles": ["admin", "administrator", "customercare", "management", "guest"]
	    }]
	}, {
	    "title": "VOD",
	    "icon": '<span class="fa fa-film fa-fw"></span>',
	    "group_roles": ["admin", "administrator", "vod", "management", "guest"],
	    "children": [{
	        "entity": "VodCategories",
	        "title": "VOD Categories",
	        "icon": '<span class="fa fa-folder-open fa-fw"></span>',
	        "link": '/VodCategories/list',
	        "group_roles": ["admin", "administrator", "vod", "management", "guest"]
	    }, {
	        "entity": "Vods",
	        "title": "VOD Movies",
	        "icon": '<span class="fa fa-film fa-fw"></span>',
	        "link": '/Vods/list?search=%7B"pin_protected":"0"%7D',
	        "group_roles": ["admin", "administrator", "vod", "management", "guest"]
	    }, {
	        "entity": "tmdbvods",
	        "title": "TMDB Vods",
	        "icon": '<span class="fa fa-film fa-fw"></span>',
	        "link": '/tmdbvods/list?search=%7B"q":"titanic"%7D',
	        "group_roles": ["admin", "administrator", "vod", "management", "guest"]
	    }, {
	        "entity": "vodMenu",
	        "title": "VOD Menu",
	        "icon": '<span class="fa fa-film fa-fw"></span>',
	        "link": '/vodMenu/list',
	        "group_roles": ["admin", "administrator", "vod", "management", "guest"]
	    }, {
	        "entity": "vodMenuCarousel",
	        "title": "VOD Menu Carousel",
	        "icon": '<span class="fa fa-film fa-fw"></span>',
	        "link": '/vodMenuCarousel/list',
	        "group_roles": ["admin", "administrator", "vod", "management", "guest"]
	    }, {
	        "entity": "Vods",
	        "title": "Not Active VOD Movies",
	        "icon": '<span class="fa fa-times-circle-o fa-fw"></span>',
	        "link": '/Vods/list?search=%7B"isavailable":false%7D',
	        "group_roles": ["admin", "administrator", "vod", "management", "guest"]
	    }, {
	        "entity": "Series",
	        "title": "TV Shows",
	        "icon": '<span class="fa fa-film fa-fw"></span>',
	        "link": '/Series/list',
	        "group_roles": ["admin", "administrator", "vod", "management", "guest"]
	    }, {
	        "entity": "Season",
	        "title": "Season",
	        "icon": '<span class="fa fa-film fa-fw"></span>',
	        "link": '/Season/list',
	        "group_roles": ["admin", "administrator", "vod", "management", "guest"]
	    }, {
	        "entity": "VodEpisode",
	        "title": "Episodes",
	        "icon": '<span class="fa fa-film fa-fw"></span>',
	        "link": '/VodEpisode/list',
	        "group_roles": ["admin", "administrator", "vod", "management", "guest"]
	    }, {
	        "entity": "VodStreamSources",
	        "title": "VOD Stream Source",
	        "icon": '<span class="fa fa-signal fa-fw"></span>',
	        "link": '/VodStreamSources/list',
	        "group_roles": ["admin", "administrator", "vod", "management", "guest"]
	    }, {
	        "entity": "vodPackages",
	        "title": "VOD Packages",
	        "icon": '<span class="fa fa-th fa-fw"></span>',
	        "link": '/vodPackages/list',
	        "group_roles": ["admin", "administrator", "vod", "management", "guest"]
	    }]
	}, {
	    "title": "EPG",
	    "icon": '<span class="fa fa-map-o fa-fw"></span>',
	    "group_roles": ["admin", "administrator", "epg", "management", "guest"],
	    "children": [{
	        "entity": "epgimport",
	        "title": "EPG Import",
	        "icon": '<span class="fa fa-map-o fa-fw"></span>',
	        "link": '/epgimport/create',
	        "group_roles": ["admin", "administrator", "epg", "management", "guest"]
	    }, {
	        "entity": "EpgData",
	        "title": "EPG Data",
	        "icon": '<span class="fa fa-list fa-fw"></span>',
	        "link": '/EpgData/list',
	        "group_roles": ["admin", "administrator", "epg", "management", "guest"]
	    }, {
	        "entity": "",
	        "title": "EPG Graph",
	        "icon": '<span class="fa fa-bar-chart fa-fw"></span>',
	        "link": '/epggraph',
	        "group_roles": ["admin", "administrator", "epg", "management", "guest"]
	    }]
	}, {
	    "template": '<div class="menu_space">Other</div>',
	    "group_roles": ["admin", "administrator", "customercare", "management", "guest"],
	    "children": []
	}, {
	    "entity": "appgroup",
	    "title": "APP Group",
	    "icon": '<span class="fa fa-file fa-fw"></span>',
	    "link": '/appgroup/list',
	    "group_roles": ["admin", "administrator", "customercare", "management", "guest"],
	    "children": []
	}, {
	    "entity": "EmailTemplate",
	    "title": "Email Template",
	    "icon": '<span class="fa fa-envelope fa-fw"></span>',
	    "link": '/EmailTemplate/list',
	    "group_roles": ["admin", "administrator", "customercare", "management", "guest"],
	    "children": []
	}, {
	    "entity": "htmlContent",
	    "title": "HTML Content",
	    "icon": '<span class="fa fa-code fa-fw"></span>',
	    "link": '/htmlContent/list',
	    "group_roles": ["admin", "administrator", "customercare", "management", "guest"],
	    "children": []
	}, {
	    "entity": "appmanagement",
	    "title": "APP Management",
	    "icon": '<span class="fa fa-upload fa-fw"></span>',
	    "link": '/appmanagement/list',
	    "group_roles": ["admin", "administrator", "customercare", "management", "guest"],
	    "children": []
	}, {
	    "entity": "mychannels",
	    "title": "My Channels",
	    "icon": '<span class="fa fa-tv fa-fw"></span>',
	    "link": '/mychannels/list',
	    "group_roles": ["admin", "administrator", "customercare", "management", "guest"],
	    "children": []
	}, {
	    "entity": "logs",
	    "title": "Logs",
	    "icon": '<span class="fa fa-book fa-fw"></span>',
	    "link": '/logs/list',
	    "group_roles": ["admin", "administrator", "customercare", "management", "guest"],
	    "children": []
	}, {
	    "entity": "PaymentTransactions",
	    "title": "Payment Transaction",
	    "icon": '<span class="fa fa-book fa-fw"></span>',
	    "link": '/PaymentTransactions/list',
	    "group_roles": ["admin", "administrator", "customercare", "management", "guest"],
	    "children": []
	}, {
	    "title": "Push messages",
	    "icon": '<span class="fa fa-envelope fa-fw"></span>',
	    "group_roles": ["admin", "administrator", "customercare", "management", "guest"],
	    "children": [{
	        "entity": "messages",
	        "title": "Push notifications",
	        "icon": '<span class="fa fa-bell fa-fw"></span>',
	        "link": '/messages/list',
	        "group_roles": ["admin", "administrator", "customercare", "management", "guest"]
	    }, {
	        "entity": "commands",
	        "title": "Commands",
	        "icon": '<span class="fa fa-terminal fa-fw"></span>',
	        "link": '/commands/list',
	        "group_roles": ["admin", "administrator", "customercare", "guest"]
	    }, {
	        "entity": "ads",
	        "title": "Ads",
	        "icon": '<span class="fa fa-buysellads fa-fw"></span>',
	        "link": '/ads/list',
	        "group_roles": ["admin", "administrator", "customercare", "management", "guest"]
	    }]
	}, {
	    "entity": "",
	    "title": "HELP",
	    "icon": '<span class="fa fa-question-circle fa-fw"></span>',
	    "link": '/dashboard',
	    "group_roles": ["admin", "administrator", "customercare", "management", "guest"],
	    "children": []
	}, {
	    "title": "My Dashboard",
	    "icon": '<span class="fa fa-tachometer fa-fw"></span>',
	    "group_roles": ["resellers"],
	    "children": [],
	    "link": '/dashboard'
	}, {
	    "title": "Search Customers",
	    "icon": '<span class="fa fa-search fa-fw"></span>',
	    "group_roles": ["resellers"],
	    "children": [],
	    "link": '/search_customer/list'
	}, {
	    "title": "Add Subscription",
	    "icon": '<span class="fa fa-calendar-check-o fa-fw"></span>',
	    "group_roles": ["resellers"],
	    "children": [],
	    "link": '/MySubscription/create'
	}, {
	    "title": "Add New Customer",
	    "icon": '<span class="fa fa-users fa-fw"></span>',
	    "group_roles": ["resellers"],
	    "children": [],
	    "link": '/NewCustomer/create'
	}, {
	    "title": "My Sales",
	    "icon": '<span class="fa fa-list fa-fw"></span>',
	    "group_roles": ["resellers"],
	    "children": [],
	    "link": '/MySales/list?search=%7B"distributorname":"' + localStorage.userName + '"%7D'
	}];
	module.exports = exports["default"];

/***/ },
/* 213 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports["default"] = function (nga, admin, menujson) {

	    var returnmenu = nga.menu();
	    var menuidx = 0;

	    for (var i = 0; i < menujson.length; i++) {

	        if (menujson[i].group_roles.indexOf(localStorage.userRole) > -1) {
	            //add parent menu item
	            returnmenu.addChild(nga.menu().title(menujson[i].title).icon(menujson[i].icon).link(menujson[i].link));

	            if (menujson[i].template) {
	                returnmenu._children[menuidx]._template = menujson[i].template;
	            }

	            //if menu has sub menus
	            if (menujson[i].children.length > 0) {
	                //start adding children menu items
	                for (var j = 0; j < menujson[i].children.length; j++) {

	                    if (menujson[i].children[j].group_roles.indexOf(localStorage.userRole) > -1) {
	                        //add child menu item
	                        returnmenu._children[menuidx].addChild(nga.menu().title(menujson[i].children[j].title).icon(menujson[i].children[j].icon).link(menujson[i].children[j].link));
	                    }
	                }
	            }

	            menuidx++;
	        }
	    }

	    return returnmenu;
	};

	module.exports = exports["default"];

/***/ },
/* 214 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);