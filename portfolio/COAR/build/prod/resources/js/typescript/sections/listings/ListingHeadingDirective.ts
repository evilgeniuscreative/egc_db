module app.directives {
    export class ListingHeadingDirective implements ng.IDirective {
        priority = 0;
        restrict = 'A';
        scope = false;
        templateUrl= 'resources/templates/listings/listingHeadingTemplate.html';
    }
}