module app.directives {
    export class ListingTableDirective implements ng.IDirective {
        priority = 0;
        restrict = 'A';
        scope = {
            tableType : "@tt"
        };
        templateUrl = 'resources/templates/listings/listingTableTemplate.html';
        controller = "TableController";
        controllerAs = "tableCtrl";
        bindToController = true;

        link = (scope:any) => {
            scope.listingCtrl = scope.$parent.listingCtrl;
        };
    }
}
