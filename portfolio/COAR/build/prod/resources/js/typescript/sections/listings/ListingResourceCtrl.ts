
module app.controllers {
    'use strict';

    export class ListingResourceCtrl {

        headings:String[];
        sortType:String;
        sortReverse:Boolean;
        showTab:String;

        public listingsCache : Array<IListing>;

        public static $inject = [
            'ListingResource'
        ];

        constructor(public resource : IListingResource) {
            this.headings = ["type", "cecId", "expires", "consumer-id", "provider-id", "consumer-key", "consumer-secret", "locked", "approved"];
            this.sortType = 'expires';
            this.sortReverse = false;
            this.showTab = 'active';

            this.listingsCache = resource.query();
        }

        getListings() : IListing[] {
            return this.listingsCache;
        }

        getSortedListings() : SortedListings {
            return this.sortListings(this.listingsCache);
        }

        private sortListings(listings:IListing[]):SortedListings {
            var sortedListings:SortedListings = {
                active: [],
                expired: []
            };

            $.each(listings, function (i) {
                listings[i].expiresDays = ListingResourceCtrl.addExpireDays(listings[i].expires);
                if (listings[i].expiresDays < 1) {
                    sortedListings.expired.push(listings[i]);
                } else {
                    sortedListings.active.push(listings[i]);
                }
            });
            return sortedListings
        }

        private static addExpireDays(input:string):number {
            var expires = new Date(input).getTime();
            var now = new Date().getTime();
            return Math.round((expires - now) / 86400000);
        }
    }
}