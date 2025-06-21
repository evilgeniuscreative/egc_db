module app.directives {
    export class ListingRowDirective implements ng.IDirective {
        priority = 0;
        restrict = 'A';
        scope = false;
        templateUrl= 'resources/templates/listings/listingRowTemplate.html';
    }
}
