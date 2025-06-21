module app.controllers {
    'use strict';

    // you apparently have to export your imports here b/c it exports the item but not its types??!!
    // http://typescript.codeplex.com/discussions/405800
    export class ListingController {
        headings:string[];
        sortType:string;
        sortReverse:boolean;
        regItems:SortedListings;

        static $inject = ['$http', 'ListingService','TestFunction'];

        constructor(private $http:ng.IHttpService, public listingService:IListingService, public testFunction:any) {
            this.headings = ["type", "cecId", "expires", "consumer-id", "provider-id", "consumer-key", "consumer-secret", "locked", "approved"];
            this.sortType = 'expires';
            this.sortReverse = false;
            this.getListings();
            // console.log(this);
        }


        getListings():ng.IPromise<SortedListings> {
            return this.listingService.getSortedListings()
                .then((data:SortedListings) => {
                    return this.regItems = data;
                });
        }

        daysNum = (expiresDays:number):string => {
            var daysClass = '';
            if (expiresDays <= 0) {
                daysClass = 'lt-zero';
            } else if (expiresDays <= 3) {
                daysClass = 'lt-three';
            } else if (expiresDays <= 7) {
                daysClass = 'lt-week';
            } else if (expiresDays <= 14) {
                daysClass = 'lt-2weeks';
            }
            return daysClass;
        }


    }
}