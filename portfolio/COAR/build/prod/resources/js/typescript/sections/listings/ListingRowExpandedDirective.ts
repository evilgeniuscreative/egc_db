module app.directives {
    export class ListingRowExpandedDirective implements ng.IDirective {
        priority = 0;
        restrict = 'A';
        scope = false;
        templateUrl = 'resources/templates/listings/listingRowExpandedTemplate.html';
    }

}
