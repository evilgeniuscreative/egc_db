module app.directives {
    export interface IListingRowFunctions extends ng.IScope {
        showCopyBalloon: {
            [key:string]:boolean;
        };
        expandedRowTransition: {
            (regItem:app.listings.IListing,e:any):any
        };
        expiresWarningLevel: {
            (expiredDays:number):string
        };
        buttonClick:{
        }
        daysNum:{
            (expiredDays:number):string
        }
    }
}
