module app.controllers {
    'use strict';

    export import IListing = app.services.IListing;
    export import IListingResource = app.services.IListingResource;
    export import SortedListings = app.listings.SortedListings;
    export import IListings = app.listings.IListings;
    export import IListingService = app.services.IListingService;

    export import IEmanNames = app.eman.IEmanNames;
  //  export import IEmanResource = app.services.IEmanResource;
    export import IEmanService = app.services.IEmanService;
    export import EmanService = app.services.EmanService;


    angular.module('app')
        .controller('ListingResourceCtrl', ['ListingResource', ListingResourceCtrl])
        .controller('ListingController', ['$http', 'ListingService', ListingController])
        .controller('EmanResourceCtrl',['EmanResource',EmanResourceCtrl])
        .controller('NewKeyController', ['$http','EmanService', NewKeyController])
        .controller('ApproveRegistrationsController', ApproveRegistrationsController)
        .controller('TableController', TableController)
        .controller('TabSetController', TabSetController)
    ;
}