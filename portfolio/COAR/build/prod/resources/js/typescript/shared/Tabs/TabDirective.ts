module app.directives {
    interface ITabTabScope extends ng.IScope {
        tab:{
            active:boolean;
            id:string;
            heading:string;
        }
        $index:number;
        $last:boolean;
        $first:boolean;
        select(x:number):void;
    }

    export class TabTab implements ng.IDirective {
        priority = 0;
        restrict = 'A';
        require = '^tabSet';
        scope = false;
        link = function (scope:ITabTabScope, element:ng.IAugmentedJQuery, attr:ng.IAttributes, tabsetCtrl:any) {
            /***
             * Using a directive in order to allow keyboard-friendly behaviors with arrow tab switching
             * attempting to set these via the link rather than on the element
             * using a directive is the Angular way to do this.
             *
             * Attempting to recreate in Angular the JQuery functionality from
             * http://accessibility.athena-ict.com/aria/examples/tabpanel2.shtml
             */

            var zbnTabsCount = tabsetCtrl.tabs.length - 1;
            // set initial values
            element.attr({
                'role': 'tab',
                'aria-controls': scope.tab.id,
                'id': 'tabFor' + scope.tab.id,
                'aria-selected': !!scope.tab.active,
                'tabindex': scope.tab.active ? 0 : -1,
                'class': scope.tab.active ? 'tab active' : 'tab'
            });

            // update values when new tab is selected, using a $watch instead of inline on the element
            // that gives us more control over the changes, and makes the template cleaner
            scope.$watch("tab.active", function () {
                element.attr({
                    'aria-selected': !!scope.tab.active,
                    'tabindex': scope.tab.active ? 0 : -1,
                    'class': scope.tab.active ? 'tab active' : 'tab'
                });
            });

            // element.on('focus', function () {
            //     console.log(element, "is focused()");
            // });

            element.on('keydown', (function (ev) {
                // right arrow: 39
                if (ev.which == 39) {
                    if (scope.$last == false) {
                        $('#tabFor' + tabsetCtrl.tabs[(scope.$index + 1)].id).focus();
                    } else {
                        $('#tabFor' + tabsetCtrl.tabs[0].id).focus();
                    }
                }

                // left arrow: 37
                if (ev.which == 37) {
                    if (scope.$first == false) {
                        $('#tabFor' + tabsetCtrl.tabs[(scope.$index - 1)].id).focus();
                    } else {
                        $('#tabFor' + tabsetCtrl.tabs[zbnTabsCount].id).focus();
                    }
                }
                // enter: 13
                if (ev.which == 13) {
                    element.triggerHandler('click');
                }
            }));
        }
    }
}