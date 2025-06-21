module app.services {
    'use strict';

    export interface IListingService {
        getListings():ng.IPromise<IListing[]>;
        getSortedListings():ng.IPromise<SortedListings>;
    }
}
