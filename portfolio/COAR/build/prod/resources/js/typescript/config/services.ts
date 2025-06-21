module app.services {
    'use strict';
    import IQService = angular.IQService;
    export import IListing = app.listings.IListing;
    export import IListings = app.listings.IListings;
    export import SortedListings = app.listings.SortedListings;
    export import IEmanNames = app.eman.IEmanNames;
   
    
    // Listings service configurations
    angular.module('app')
        .factory('ListingsResource', ['$resource', ($resource:ng.resource.IResourceService):IListingsResource => {
            return <IListingsResource> $resource('data/sampledata.json', {}, {
                query: {
                    method: 'GET', params: {}, isArray: true,
                    transformResponse: function (data:IListings) {
                        return data.registration;
                    }
                }
            });
        }])
        .factory('ListingResource', ['$resource', ($resource:ng.resource.IResourceService):IListingResource => {
            return <IListingResource> $resource('data/sampledata.json', {}, {
                query: {
                    method: 'GET', params: {}, isArray: true,
                    transformResponse: function (data:IListings) {
                        return data.registration;
                    }
                }
            });
        }])
        .factory('ListingService', ['$http', '$q', ($http:ng.IHttpService, $q:ng.IQService):ListingService => {
            return new ListingService($http, $q);
        }])

        .factory('EmanResource', ['$resource', ($resource:ng.resource.IResourceService):IEmanResource => {
            return <IEmanResource> $resource('data/emanNames.json', {}, {
                query: {
                    method: 'GET', params: {}, isArray: true,
                    transformResponse: function (data:IEmanNames) {
                        return data;
                    }
                }
            });
        }])
        .factory('EmanService', ['$http', '$q', ($http:ng.IHttpService, $q:IQService):EmanService => {
            return new EmanService($http, $q)
        }])
    ;

}