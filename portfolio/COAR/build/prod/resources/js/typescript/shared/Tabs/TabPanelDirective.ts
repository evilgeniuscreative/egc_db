module app.directives {
    interface ITabScope extends ng.IScope {
        active:boolean;
        id:string;
        heading:string;
    }
    import ITabSetController = app.controllers.ITabSetController;

    export class OneTab implements ng.IDirective {
        priority = 0;
        restrict = 'EA';
        transclude = true;
        require = '^tabSet';
        scope = {
            heading: '@'
        };
        templateUrl = 'resources/templates/shared/tabs/tabpanel.html';
        link = function (scope:ITabScope, element:ng.IAugmentedJQuery, attr:ng.IAttributes, tabsetCtrl:ITabSetController) {
            scope.active = false;
            scope.id = '_'+scope.heading.replace(/\W+/g,'_').substr(0,10);
            tabsetCtrl.addTab(scope);
            element.attr('role','presentation');
        }
    }
}