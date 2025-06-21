module app.listings {
    //import IListingRowFunctions = app.directives.IListingRowFunctions;
    export class WarningType {
        static getWarning(days:number, type:string):any {
            var warningCat:number;
            if (days <= 30 && days > 14) {
                warningCat = 4;
            }
            if (days <= 14 && days > 7) {
                warningCat = 3;
            }
            if (days <= 7 && days > 3) {
                warningCat = 2;
            }
            if (days <= 3 && days > 0) {
                warningCat = 1;
            }
            if (days <= 0) {
                warningCat = 0;
            }
            // console.log("warning type days:", days, warningCat);

            var urgency:Array<string> = [
                'Expired', 'Expiration Imminent', 'Expiring Very Soon', 'Expiring Soon', 'Renewal Coming Up'
            ];
            var iconClasses:Array<string> = [
                'fa-exclamation-triangle warning', 'fa-exclamation-triangle', 'fa-exclamation-circle','',''
            ];
            if (type == 'icon') {
                return urgency[warningCat];
            } else if(type== 'iclass'){
                return iconClasses[warningCat];
            } else {
                return warningCat;
            }

        }
    }
}
