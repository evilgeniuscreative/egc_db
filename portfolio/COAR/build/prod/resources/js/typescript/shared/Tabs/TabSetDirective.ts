module app.directives {
    import TabSetController = app.controllers.TabSetController;
    export class TabSet implements ng.IDirective{
        priority = 0;
        restrict = 'E';
        transclude = true;
        scope = {};
        templateUrl = 'resources/templates/shared/tabs/tabset.html';
        controller = TabSetController;
        controllerAs = 'tabsetCtrl';
        bindToController = true;
    } 
}
