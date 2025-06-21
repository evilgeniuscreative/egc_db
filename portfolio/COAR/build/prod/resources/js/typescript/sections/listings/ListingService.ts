module app.services {
    'use strict';

    export class ListingService implements IListingService {
        static $inject = ['$http','$q'];

        private listingsCache: IListing[];

        constructor(private $http:ng.IHttpService, private $q:ng.IQService) {
        }

        getListings():ng.IPromise<IListing[]> {
            if (this.listingsCache !== undefined) {
                return this.$q.when(this.listingsCache);
            }
            else {
                return this.$http.get('sampledata/sampledata.json')
                    .then((response:ng.IHttpPromiseCallbackArg<IListings>) => {
                        this.listingsCache = response.data.registration;
                        return this.listingsCache;
                    });
            }
        }

        getSortedListings():ng.IPromise<SortedListings> {
            if (this.listingsCache !== undefined) {
                return this.$q.when(this.sortListings(this.listingsCache));
            }
            else {
                var p:ng.IPromise<IListing[]> = this.getListings();
                // now sort the listings
                return p.then((listings:IListing[]):ng.IPromise<SortedListings> => {
                    return this.$q.when(this.sortListings(listings));
                });
            }
        }

        private sortListings(listings:IListing[]):SortedListings {
            var sortedListings:SortedListings = {
                active: [],
                expired: []
            };
/*
            //TODO this is part of the cheat, remove it for prod
            var exp = [3,7,14,30,45,0,-1,-3,-7,-14];
            var today = new Date();

            function addDays(date:any, days:any):string {
                var result = new Date(date);
                result.setDate(result.getDate() + days);
                var h = Math.round(Math.random() * 24).toString();
                return  result.getFullYear().toString() + '-'+(result.getMonth()+1).toString()+'-'+result.getDate()+'T'+h;
            }
            // End cheat
*/
            $.each(listings, (i: number) =>  {
                /*TODO: remove for production. Fakes dates for keeping current registrations
                listings[i].expires = addDays(today,exp[i]);
                // end cheat */
                listings[i].showExpanded = 'closed';
                listings[i].expiresDays = ListingService.addExpireDays(listings[i].expires);
                if (listings[i].expiresDays < 1) {
                    sortedListings.expired.push(listings[i]);
                } else {
                    sortedListings.active.push(listings[i]);
                }
            });
            return sortedListings

        }

        private static addExpireDays(input:string):number {
            var a = input.split(/[^0-9]/);
            var y = parseInt(a[0]), m = parseInt(a[1])-1, d = parseInt(a[2]), h = parseInt(a[3]);
            var expires = new Date( y,m,d,h ).getTime();
            var now = new Date().getTime();
            return Math.round((expires - now) / 86400000);
        }
    }
}
