var app;
(function (app) {

    angular.module('app', ['ngRoute', 'ui.bootstrap', 'ngMessages']);
})(app || (app = {}));

(function (app) {
    var controllers;
    (function (controllers) {
    
        var TabSetController = (function () {
            function TabSetController() {
                this.tabs = [];
            }
            TabSetController.prototype.addTab = function (tab) {
                if (tab) {
                    this.tabs.push(tab);
                    if (this.tabs.length === 1) {
                        tab.active = true;
                    }
                }
            };
            
            TabSetController.prototype.select = function (selectedTab) {
                if (selectedTab) {
                    angular.forEach(this.tabs, function (tab) {
                        if (tab.active && tab !== selectedTab) {
                            tab.active = false;
                        }
                    });
                    selectedTab.active = true;
                }
            };
            return TabSetController;
        })();
        controllers.TabSetController = TabSetController;
    })(controllers = app.controllers || (app.controllers = {}));
})(app || (app = {}));
var app;
(function (app) {
    var listings;
    (function (listings) {
        var SortedListings = (function () {
            function SortedListings() {
            }
            return SortedListings;
        })();
        listings.SortedListings = SortedListings;
    })(listings = app.listings || (app.listings = {}));
})(app || (app = {}));
var app;
(function (app) {
    var controllers;
    (function (controllers) {
    
        var TableController = (function () {
            function TableController() {
            }
            return TableController;
        })();
        controllers.TableController = TableController;
    })(controllers = app.controllers || (app.controllers = {}));
})(app || (app = {}));
var app;
(function (app) {
    var services;
    (function (services) {
    
    })(services = app.services || (app.services = {}));
})(app || (app = {}));
var app;
(function (app) {
    var services;
    (function (services) {
    
        var ListingService = (function () {
            function ListingService($http, $q) {
                this.$http = $http;
                this.$q = $q;
            }
            ListingService.prototype.getListings = function () {
                var _this = this;
                if (this.listingsCache !== undefined) {
                    return this.$q.when(this.listingsCache);
                }
                else {
                    return this.$http.get('data/regdata.json')
                        .then(function (response) {
                        _this.listingsCache = response.data.registration;
                        console.log('listings',_this.listingsCache);
                        return _this.listingsCache;
                    });
                }
            };
            ListingService.prototype.getSortedListings = function () {
                var _this = this;
                if (this.listingsCache !== undefined) {
                    return this.$q.when(this.sortListings(this.listingsCache));
                }
                else {
                    var p = this.getListings();
                    return p.then(function (listings) {
                        return _this.$q.when(_this.sortListings(listings));
                    });
                }
            };
            ListingService.prototype.sortListings = function (listings) {
                var sortedListings = {
                    active: [],
                    expired: []
                };
                $.each(listings, function (i) {
                    listings[i].showExpanded = 'closed';
                    listings[i].expiresDays = ListingService.addExpireDays(listings[i].expires);
                    if (listings[i].expiresDays < 1) {
                        sortedListings.expired.push(listings[i]);
                    }
                    else {
                        sortedListings.active.push(listings[i]);
                    }
                });
                return sortedListings;
            };
            ListingService.addExpireDays = function (input) {
                var a = input.split(/[^0-9]/);
                var y = parseInt(a[0]), m = parseInt(a[1]) - 1, d = parseInt(a[2]), h = parseInt(a[3]);
                var expires = new Date(y, m, d, h).getTime();
                var now = new Date().getTime();
                return Math.round((expires - now) / 86400000);
            };
            ListingService.$inject = ['$http', '$q'];
            return ListingService;
        })();
        services.ListingService = ListingService;
    })(services = app.services || (app.services = {}));
})(app || (app = {}));
var app;
(function (app) {
    var services;
    (function (services) {
    
    })(services = app.services || (app.services = {}));
})(app || (app = {}));
var app;
(function (app) {
    var services;
    (function (services) {
    
    })(services = app.services || (app.services = {}));
})(app || (app = {}));
var app;
(function (app) {
    var listings;
    (function (listings) {
        var TestFunction = (function () {
            function TestFunction() {
                this.testFunction = function (num) {
                    console.log("TF");
                    var names = ['zero', 'one', 'two', 'three', 'four'];
                    return names[num];
                };
            }
            return TestFunction;
        })();
        listings.TestFunction = TestFunction;
    })(listings = app.listings || (app.listings = {}));
})(app || (app = {}));
var app;
(function (app) {
    var services;
    (function (services) {
    
    })(services = app.services || (app.services = {}));
})(app || (app = {}));
var app;
(function (app) {
    var services;
    (function (services) {
    
    })(services = app.services || (app.services = {}));
})(app || (app = {}));
var app;
(function (app) {
    var services;
    (function (services) {
    
        var EmanService = (function () {
            function EmanService($http, $q) {
                this.$http = $http;
                this.$q = $q;
            }
            EmanService.prototype.getEmanNames = function () {
                var _this = this;
                if (this.emanCache !== undefined) {
                    return this.$q.when(this.emanCache);
                }
                else {
                    return this.$http.get('data/emanNames.json')
                        .then(function (response) {
                        _this.emanCache = response;
                        return _this.emanCache;
                    });
                }
            };
            EmanService.$inject = ['$http', 'q'];
            return EmanService;
        })();
        services.EmanService = EmanService;
    })(services = app.services || (app.services = {}));
})(app || (app = {}));
var app;
(function (app) {
    var services;
    (function (services) {
    
        services.SortedListings = app.listings.SortedListings;
        angular.module('app')
            .factory('ListingsResource', ['$resource', function ($resource) {
                return $resource('data/regdata.json', {}, {
                    query: {
                        method: 'GET', params: {}, isArray: true,
                        transformResponse: function (data) {
                            return data.registration;
                        }
                    }
                });
            }])
            .factory('ListingResource', ['$resource', function ($resource) {
                return $resource('data/regdata.json', {}, {
                    query: {
                        method: 'GET', params: {}, isArray: true,
                        transformResponse: function (data) {
                            return data.registration;
                        }
                    }
                });
            }])
            .factory('ListingService', ['$http', '$q', function ($http, $q) {
                return new services.ListingService($http, $q);
            }])
            .factory('EmanResource', ['$resource', function ($resource) {
                return $resource('data/emanNames.json', {}, {
                    query: {
                        method: 'GET', params: {}, isArray: true,
                        transformResponse: function (data) {
                            return data;
                        }
                    }
                });
            }])
            .factory('EmanService', ['$http', '$q', function ($http, $q) {
                return new services.EmanService($http, $q);
            }]);
    })(services = app.services || (app.services = {}));
})(app || (app = {}));
var app;
(function (app) {
    var controllers;
    (function (controllers) {
    
        var ListingResourceCtrl = (function () {
            function ListingResourceCtrl(resource) {
                this.resource = resource;
                this.headings = ["type", "cecId", "expires", "consumer-id", "provider-id", "consumer-key", "consumer-secret", "locked", "approved"];
                this.sortType = 'expires';
                this.sortReverse = false;
                this.showTab = 'active';
                this.listingsCache = resource.query();
            }
            ListingResourceCtrl.prototype.getListings = function () {
                return this.listingsCache;
            };
            ListingResourceCtrl.prototype.getSortedListings = function () {
                return this.sortListings(this.listingsCache);
            };
            ListingResourceCtrl.prototype.sortListings = function (listings) {
                var sortedListings = {
                    active: [],
                    expired: []
                };
                $.each(listings, function (i) {
                    listings[i].expiresDays = ListingResourceCtrl.addExpireDays(listings[i].expires);
                    if (listings[i].expiresDays < 1) {
                        sortedListings.expired.push(listings[i]);
                    }
                    else {
                        sortedListings.active.push(listings[i]);
                    }
                });
                return sortedListings;
            };
            ListingResourceCtrl.addExpireDays = function (input) {
                var expires = new Date(input).getTime();
                var now = new Date().getTime();
                return Math.round((expires - now) / 86400000);
            };
            ListingResourceCtrl.$inject = [
                'ListingResource'
            ];
            return ListingResourceCtrl;
        })();
        controllers.ListingResourceCtrl = ListingResourceCtrl;
    })(controllers = app.controllers || (app.controllers = {}));
})(app || (app = {}));
var app;
(function (app) {
    var controllers;
    (function (controllers) {
    
        var ListingController = (function () {
            function ListingController($http, listingService, testFunction) {
                this.$http = $http;
                this.listingService = listingService;
                this.testFunction = testFunction;
                this.daysNum = function (expiresDays) {
                    var daysClass = '';
                    if (expiresDays <= 0) {
                        daysClass = 'lt-zero';
                    }
                    else if (expiresDays <= 3) {
                        daysClass = 'lt-three';
                    }
                    else if (expiresDays <= 7) {
                        daysClass = 'lt-week';
                    }
                    else if (expiresDays <= 14) {
                        daysClass = 'lt-2weeks';
                    }
                    return daysClass;
                };
                this.headings = ["type", "cecId", "expires", "consumer-id", "provider-id", "consumer-key", "consumer-secret", "locked", "approved"];
                this.sortType = 'expires';
                this.sortReverse = false;
                this.getListings();
            }
            ListingController.prototype.getListings = function () {
                var _this = this;
                return this.listingService.getSortedListings()
                    .then(function (data) {
                    return _this.regItems = data;
                });
            };
            ListingController.$inject = ['$http', 'ListingService', 'TestFunction'];
            return ListingController;
        })();
        controllers.ListingController = ListingController;
    })(controllers = app.controllers || (app.controllers = {}));
})(app || (app = {}));
var app;
(function (app) {
    var controllers;
    (function (controllers) {
    
        var EmanResourceCtrl = (function () {
            function EmanResourceCtrl(resource) {
                this.resource = resource;
                this.emanCache = resource.query();
            }
            EmanResourceCtrl.prototype.getEmanNames = function () {
                return this.emanCache;
            };
            EmanResourceCtrl.$inject = ['EmanResource'];
            return EmanResourceCtrl;
        })();
        controllers.EmanResourceCtrl = EmanResourceCtrl;
    })(controllers = app.controllers || (app.controllers = {}));
})(app || (app = {}));
var app;
(function (app) {
    var controllers;
    (function (controllers) {
    
        var NewKeyController = (function () {
            function NewKeyController($http, emanService) {
                this.$http = $http;
                this.emanService = emanService;
                this.getEmanNames();
                this.submitted = false;
            }
            NewKeyController.prototype.getEmanNames = function () {
                var _this = this;
                return this.emanService.getEmanNames()
                    .then(function (data) {
                    return _this.emanNames = data.data.AppName;
                });
            };
            NewKeyController.prototype.charCount = function (el) {
                return 10 - el.$viewValue.length;
            };
            NewKeyController.prototype.submitForm = function (valids) {
                this.submitted = true;
                return;
            };
            NewKeyController.prototype.showError = function (obj) {
                console.log(obj);
                return;
            };
            NewKeyController.$inject = ['$http', 'EmanService'];
            return NewKeyController;
        })();
        controllers.NewKeyController = NewKeyController;
    })(controllers = app.controllers || (app.controllers = {}));
})(app || (app = {}));
var app;
(function (app) {
    var controllers;
    (function (controllers) {
    
        var ApproveRegistrationsController = (function () {
            function ApproveRegistrationsController() {
            }
            return ApproveRegistrationsController;
        })();
        controllers.ApproveRegistrationsController = ApproveRegistrationsController;
    })(controllers = app.controllers || (app.controllers = {}));
})(app || (app = {}));
var app;
(function (app) {
    var controllers;
    (function (controllers) {
    
        controllers.SortedListings = app.listings.SortedListings;
        controllers.EmanService = app.services.EmanService;
        angular.module('app')
            .controller('ListingResourceCtrl', ['ListingResource', controllers.ListingResourceCtrl])
            .controller('ListingController', ['$http', 'ListingService', controllers.ListingController])
            .controller('EmanResourceCtrl', ['EmanResource', controllers.EmanResourceCtrl])
            .controller('NewKeyController', ['$http', 'EmanService', controllers.NewKeyController])
            .controller('ApproveRegistrationsController', controllers.ApproveRegistrationsController)
            .controller('TableController', controllers.TableController)
            .controller('TabSetController', controllers.TabSetController);
    })(controllers = app.controllers || (app.controllers = {}));
})(app || (app = {}));
var app;
(function (app) {
    var directives;
    (function (directives) {
        var AccessibleIconDirective = (function () {
            function AccessibleIconDirective() {
                this.priority = 0;
                this.restrict = 'A';
                this.scope = {
                    'm': '@',
                    'ic': '@',
                    's': '@',
                    'va': '@'
                };
                this.controller = AIController;
                this.link = AILink;
                this.template = EorA;
            }
            return AccessibleIconDirective;
        })();
        directives.AccessibleIconDirective = AccessibleIconDirective;
        function AIController($scope) {
            $scope.severity = ['alert-green', 'alert-yellow', 'alert-orange', 'alert-red'];
            $scope.vAlign = ['subscript', 'superscript'];
            $scope.nodes = ['A', 'SPAN', 'DIV', 'P'];
        }
        function AILink(scope, element, attr) {
            if (element[0].nodeName == 'I') {
                element.attr({
                    'aria-label': scope.m,
                    'role': 'img',
                    'class': 'acc-icon fa fa fa-' + scope.ic + ' ' + scope.severity[scope.s] + ' ' + scope.vAlign[scope.va]
                });
            }
            else {
                element.attr('class', 'icon-wrap');
            }
        }
        function EorA(tElement) {
            if (tElement[0].nodeName == 'I') {
                return '';
            }
            else {
                return '<i role="img" aria-label="Icon {{m}}" class="acc-icon fa fa-{{ic}} {{severity[s]}} {{vAlign[va]}}"></i>';
            }
        }
    })(directives = app.directives || (app.directives = {}));
})(app || (app = {}));
var app;
(function (app) {
    var directives;
    (function (directives) {
        var WarningIconDirective = (function () {
            function WarningIconDirective() {
                this.priority = 0;
                this.restrict = 'A';
                this.scope = { days: '@' };
                this.controller = WIController;
                this.link = WILink;
                this.template = '<i role="img" aria-label="Warning Icon {{urgency[getWarning(days)]}}" class="{{getWarning(days)}} fa {{iconClasses[getWarning(days)]}}"></i>';
            }
            return WarningIconDirective;
        })();
        directives.WarningIconDirective = WarningIconDirective;
        function WIController($scope) {
            $scope.urgency = [
                'Expired', 'Expiration Imminent', 'Expiring Very Soon', 'Expiring Soon', 'Renewal Coming Up'
            ];
            $scope.iconClasses = [
                'fa-exclamation-circle warning', 'fa-exclamation-circle warning', 'fa-exclamation-triangle warning', 'fa-exclamation-triangle', ''
            ];
            $scope.getWarning = function (days) {
                var warningCat;
                if (days <= 30 && days > 14) {
                    warningCat = 4;
                }
                if (days <= 14 && days > 7) {
                    warningCat = 3;
                }
                if (days <= 7 && days > 3) {
                    warningCat = 2;
                }
                if (days <= 3 && days > 0) {
                    warningCat = 1;
                }
                if (days <= 0) {
                    warningCat = 0;
                }
                return warningCat;
            };
        }
        function WILink(scope, element, attr) {
            element.attr('class', 'icon-wrap');
        }
    })(directives = app.directives || (app.directives = {}));
})(app || (app = {}));
var app;
(function (app) {
    var directives;
    (function (directives) {
        var CopyToClipboard = (function () {
            function CopyToClipboard() {
                this.priority = 0;
                this.restrict = 'E';
                this.scope = {
                    type: '@',
                    title: '@',
                    fulltext: '@'
                };
                this.templateUrl = 'resources/templates/shared/copyToClipboard/copyToClipboard.html';
                this.controller = CopyToClipboardController;
                this.link = CopyToClipboardLink;
            }
            return CopyToClipboard;
        })();
        directives.CopyToClipboard = CopyToClipboard;
        function CopyToClipboardController($scope) {
            $scope.shorttext = $scope.fulltext.substr(0, 6);
            $scope.showThis = false;
        }
        function CopyToClipboardLink(scope, element, attr) {
            var elID = 'ctc_' + scope.type + '_' + scope.shorttext;
            element.attr('id', elID);
            var $el = $('#' + elID);
            var $balloon = $el.find('.copy-this-balloon');
            var $input = $balloon.find('input');
            var $button = $balloon.find('button');
            var $origLink = $el.find('a');
            var $focus = 0;
            scope.closeMe = function () {
                scope.showThis = false;
                console.log($origLink.parent());
                $origLink.parent().focus();
            };
            scope.openMe = function () {
                scope.showThis = true;
                setTimeout(function () {
                    $input.focus().select();
                    $balloon.keydown(function (e) {
                        if (e.which == 27) {
                            $button.trigger('click');
                            $origLink.focus();
                        }
                        if (e.which == 9) {
                            if ($focus == 0) {
                                $focus = 1;
                                $button.focus();
                            }
                            else {
                                $focus = 0;
                                $input.focus();
                            }
                            e.preventDefault();
                        }
                    });
                }, 50);
            };
        }
    })(directives = app.directives || (app.directives = {}));
})(app || (app = {}));
var app;
(function (app) {
    var directives;
    (function (directives) {
        var ListingTableDirective = (function () {
            function ListingTableDirective() {
                this.priority = 0;
                this.restrict = 'A';
                this.scope = {
                    tableType: "@tt"
                };
                this.templateUrl = 'resources/templates/listings/listingTableTemplate.html';
                this.controller = "TableController";
                this.controllerAs = "tableCtrl";
                this.bindToController = true;
                this.link = function (scope) {
                    scope.listingCtrl = scope.$parent.listingCtrl;
                };
            }
            return ListingTableDirective;
        })();
        directives.ListingTableDirective = ListingTableDirective;
    })(directives = app.directives || (app.directives = {}));
})(app || (app = {}));
var app;
(function (app) {
    var directives;
    (function (directives) {
        var ListingHeadingDirective = (function () {
            function ListingHeadingDirective() {
                this.priority = 0;
                this.restrict = 'A';
                this.scope = false;
                this.templateUrl = 'resources/templates/listings/listingHeadingTemplate.html';
            }
            return ListingHeadingDirective;
        })();
        directives.ListingHeadingDirective = ListingHeadingDirective;
    })(directives = app.directives || (app.directives = {}));
})(app || (app = {}));
var app;
(function (app) {
    var directives;
    (function (directives) {
        var ListingRowCollapsedDirective = (function () {
            function ListingRowCollapsedDirective() {
                this.priority = 0;
                this.restrict = 'A';
                this.scope = false;
                this.link = function (scope, element, attrs) {
                    scope.buttonClick = function (msg) {
                        alert(msg + ' button was clicked: test only');
                    };
                    scope.expandedRowTransition = function (e, regItem) {
                        var safeSpan = $('#exp_' + regItem.consumerKey.substr(0, 9));
                        if (regItem.showExpanded == 'closed' || regItem.showExpanded == '') {
                            regItem.showExpanded = 'opening';
                            setTimeout(function () {
                                regItem.showExpanded = 'open';
                                scope.$apply();
                            }, 50);
                        }
                        else if (regItem.showExpanded == 'open') {
                            regItem.showExpanded = 'closing';
                            setTimeout(function () {
                                regItem.showExpanded = 'closed';
                                scope.$apply();
                            }, 500);
                        }
                    };
                };
                this.templateUrl = 'resources/templates/listings/listingRowCollapsedTemplate.html';
            }
            return ListingRowCollapsedDirective;
        })();
        directives.ListingRowCollapsedDirective = ListingRowCollapsedDirective;
    })(directives = app.directives || (app.directives = {}));
})(app || (app = {}));
var app;
(function (app) {
    var directives;
    (function (directives) {
        var ListingRowExpandedDirective = (function () {
            function ListingRowExpandedDirective() {
                this.priority = 0;
                this.restrict = 'A';
                this.scope = false;
                this.templateUrl = 'resources/templates/listings/listingRowExpandedTemplate.html';
            }
            return ListingRowExpandedDirective;
        })();
        directives.ListingRowExpandedDirective = ListingRowExpandedDirective;
    })(directives = app.directives || (app.directives = {}));
})(app || (app = {}));
var app;
(function (app) {
    var directives;
    (function (directives) {
        var ListingRowDirective = (function () {
            function ListingRowDirective() {
                this.priority = 0;
                this.restrict = 'A';
                this.scope = false;
                this.templateUrl = 'resources/templates/listings/listingRowTemplate.html';
            }
            return ListingRowDirective;
        })();
        directives.ListingRowDirective = ListingRowDirective;
    })(directives = app.directives || (app.directives = {}));
})(app || (app = {}));
var app;
(function (app) {
    var directives;
    (function (directives) {
        var TabTab = (function () {
            function TabTab() {
                this.priority = 0;
                this.restrict = 'A';
                this.require = '^tabSet';
                this.scope = false;
                this.link = function (scope, element, attr, tabsetCtrl) {
                    var zbnTabsCount = tabsetCtrl.tabs.length - 1;
                    element.attr({
                        'role': 'tab',
                        'aria-controls': scope.tab.id,
                        'id': 'tabFor' + scope.tab.id,
                        'aria-selected': !!scope.tab.active,
                        'tabindex': scope.tab.active ? 0 : -1,
                        'class': scope.tab.active ? 'tab active' : 'tab'
                    });
                    scope.$watch("tab.active", function () {
                        element.attr({
                            'aria-selected': !!scope.tab.active,
                            'tabindex': scope.tab.active ? 0 : -1,
                            'class': scope.tab.active ? 'tab active' : 'tab'
                        });
                    });
                    element.on('keydown', (function (ev) {
                        if (ev.which == 39) {
                            if (scope.$last == false) {
                                $('#tabFor' + tabsetCtrl.tabs[(scope.$index + 1)].id).focus();
                            }
                            else {
                                $('#tabFor' + tabsetCtrl.tabs[0].id).focus();
                            }
                        }
                        if (ev.which == 37) {
                            if (scope.$first == false) {
                                $('#tabFor' + tabsetCtrl.tabs[(scope.$index - 1)].id).focus();
                            }
                            else {
                                $('#tabFor' + tabsetCtrl.tabs[zbnTabsCount].id).focus();
                            }
                        }
                        if (ev.which == 13) {
                            element.triggerHandler('click');
                        }
                    }));
                };
            }
            return TabTab;
        })();
        directives.TabTab = TabTab;
    })(directives = app.directives || (app.directives = {}));
})(app || (app = {}));
var app;
(function (app) {
    var directives;
    (function (directives) {
        var TabSetController = app.controllers.TabSetController;
        var TabSet = (function () {
            function TabSet() {
                this.priority = 0;
                this.restrict = 'E';
                this.transclude = true;
                this.scope = {};
                this.templateUrl = 'resources/templates/shared/tabs/tabset.html';
                this.controller = TabSetController;
                this.controllerAs = 'tabsetCtrl';
                this.bindToController = true;
            }
            return TabSet;
        })();
        directives.TabSet = TabSet;
    })(directives = app.directives || (app.directives = {}));
})(app || (app = {}));
var app;
(function (app) {
    var directives;
    (function (directives) {
        var OneTab = (function () {
            function OneTab() {
                this.priority = 0;
                this.restrict = 'EA';
                this.transclude = true;
                this.require = '^tabSet';
                this.scope = {
                    heading: '@'
                };
                this.templateUrl = 'resources/templates/shared/tabs/tabpanel.html';
                this.link = function (scope, element, attr, tabsetCtrl) {
                    scope.active = false;
                    scope.id = '_' + scope.heading.replace(/\W+/g, '_').substr(0, 10);
                    tabsetCtrl.addTab(scope);
                    element.attr('role', 'presentation');
                };
            }
            return OneTab;
        })();
        directives.OneTab = OneTab;
    })(directives = app.directives || (app.directives = {}));
})(app || (app = {}));
var app;
(function (app) {
    var directives;
    (function (directives) {
    
        angular.module('app')
            .directive('warnIcon', function () { return new directives.WarningIconDirective(); })
            .directive('accIcon', function () { return new directives.AccessibleIconDirective(); })
            .directive('listingRow', function () { return new directives.ListingRowDirective(); })
            .directive('listingRowExpanded', function () { return new directives.ListingRowExpandedDirective(); })
            .directive('listingRowCollapsed', function () { return new directives.ListingRowCollapsedDirective(); })
            .directive('listingHead', function () { return new directives.ListingHeadingDirective(); })
            .directive('listingTable', function () { return new directives.ListingTableDirective(); })
            .directive('tabSet', function () { return new directives.TabSet(); })
            .directive('tabTab', function () { return new directives.TabTab(); })
            .directive('oneTab', function () { return new directives.OneTab(); })
            .directive('copyToClipboard', function () { return new directives.CopyToClipboard; });
    })(directives = app.directives || (app.directives = {}));
})(app || (app = {}));
var app;
(function (app) {
    var filters;
    (function (filters) {
    
        var ShortenByIdType = (function () {
            function ShortenByIdType() {
            }
            ShortenByIdType.prototype.filter = function (input) {
                var output = input;
                if (input.substr(0, 1) === "I" || input.substr(0, 1) === "i") {
                    output = "IND";
                }
                if (input.substr(0, 1) === "P" || input.substr(0, 1) === "p") {
                    output = "PROV";
                }
                if (input.substr(0, 1) === "M" || input.substr(0, 1) === "m") {
                    output = "MASQ";
                }
                return output;
            };
            return ShortenByIdType;
        })();
        filters.ShortenByIdType = ShortenByIdType;
    })(filters = app.filters || (app.filters = {}));
})(app || (app = {}));
var app;
(function (app) {
    var filters;
    (function (filters) {
    
        var ShortenHeading = (function () {
            function ShortenHeading() {
            }
            ShortenHeading.prototype.filter = function (input) {
                var output = input;
                if (output.indexOf('consumer id') > -1) {
                    output = "cons id";
                }
                if (output.indexOf('key') > -1) {
                    output = "c-key";
                }
                if (output.indexOf('secret') > -1) {
                    output = "c-secret";
                }
                if (output.indexOf('approved') > -1) {
                    output = output.replace('approved', 'apprv');
                }
                return output.toUpperCase();
            };
            return ShortenHeading;
        })();
        filters.ShortenHeading = ShortenHeading;
    })(filters = app.filters || (app.filters = {}));
})(app || (app = {}));
var app;
(function (app) {
    var filters;
    (function (filters) {
    
        var ScreenReaderFriendly = (function () {
            function ScreenReaderFriendly() {
            }
            ScreenReaderFriendly.prototype.filter = function (input) {
                var output = input;
                if (output.toLowerCase() == "cecid") {
                    output = "C E C I D";
                }
                output = output.replace(/-id/, ' I D');
                output = output.replace(/-/g, ' ');
                return output;
            };
            return ScreenReaderFriendly;
        })();
        filters.ScreenReaderFriendly = ScreenReaderFriendly;
    })(filters = app.filters || (app.filters = {}));
})(app || (app = {}));
var app;
(function (app) {
    var filters;
    (function (filters) {
    
        var CleanupToUpper = (function () {
            function CleanupToUpper() {
            }
            CleanupToUpper.prototype.filter = function (input) {
                input = input.replace(/[-_]/g, ' ');
                return input.toUpperCase();
            };
            return CleanupToUpper;
        })();
        filters.CleanupToUpper = CleanupToUpper;
    })(filters = app.filters || (app.filters = {}));
})(app || (app = {}));
var app;
(function (app) {
    var filters;
    (function (filters) {
    
        var DayOrDays = (function () {
            function DayOrDays() {
            }
            DayOrDays.prototype.filter = function (input) {
                var output = input;
                if (Math.abs(parseInt(output)) == 1) {
                    output = "day";
                }
                else {
                    output = "days";
                }
                return output;
            };
            return DayOrDays;
        })();
        filters.DayOrDays = DayOrDays;
    })(filters = app.filters || (app.filters = {}));
})(app || (app = {}));
var app;
(function (app) {
    var filters;
    (function (filters) {
    
        angular
            .module('app')
            .filter("shortenByIdType", function () {
            return (new filters.ShortenByIdType()).filter;
        })
            .filter("shortenHeading", function () {
            return (new filters.ShortenHeading()).filter;
        })
            .filter("screenReaderFriendly", function () {
            return (new filters.ScreenReaderFriendly()).filter;
        })
            .filter("dayOrDays", function () {
            return (new filters.DayOrDays()).filter;
        })
            .filter("cleanupToUpper", function () {
            return (new filters.CleanupToUpper()).filter;
        });
    })(filters = app.filters || (app.filters = {}));
})(app || (app = {}));
var app;
(function (app) {
    var run;
    (function (run) {
        angular.module('app')
            .run(['$location', '$rootScope', '$log', function ($location, $rootScope, $log) {
                $rootScope.$log = $log;
                $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
                    if (current.$$route) {
                        $rootScope.title = current.$$route.title;
                    }
                });
                function trackFocus() {
                    var current = document.activeElement;
                    setTimeout(function () {
                        if (current != document.activeElement) {
                            console.log("Focus: ", document.activeElement);
                        }
                        trackFocus();
                    }, 500);
                }
            }]);
    })(run = app.run || (app.run = {}));
})(app || (app = {}));
var app;
(function (app) {
    var routes;
    (function (routes) {
        angular.module('app')
            .config(function ($routeProvider) {
            $routeProvider
                .when('/', {
                templateUrl: 'resources/templates/listings/myRegistrationsTemplate.html',
                controller: 'ListingController',
                controllerAs: 'listingCtrl',
                title: 'COAR Cisco OAuth Registration: Homepage with Listings'
            })
                .when('/request-new-key', {
                templateUrl: 'resources/templates/requestNewKey/newKeyTemplate.html',
                controller: 'NewKeyController',
                controllerAs: 'newkeyCtrl',
                title: 'COAR: Request New Key'
            })
                .when('/approve-registrations', {
                templateUrl: 'resources/templates/approveRegistrations/approveRegistrationsTemplate.html',
                controller: 'ApproveRegistrationsController',
                controllerAs: 'appregCtrl',
                title: 'COAR: Approve Registrations'
            });
        });
    })(routes = app.routes || (app.routes = {}));
})(app || (app = {}));

//# sourceMappingURL=app.js.map
