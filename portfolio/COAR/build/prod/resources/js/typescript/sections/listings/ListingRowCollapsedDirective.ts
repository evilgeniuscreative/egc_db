module app.directives {
   // import ExpiresWarningLevel = app.listings.ExpiresWarningLevel; // how does this fit with scope?
   // import WarningType = app.listings.WarningType;
    export class ListingRowCollapsedDirective implements ng.IDirective {
        priority = 0;
        restrict = 'A';
        scope = false;
        // controllerAs is listingCtrl when/then in routing
        link = (scope:IListingRowFunctions, element:ng.IAugmentedJQuery, attrs:ng.IAttributes) => {


            scope.buttonClick = function (msg:string) {
                alert(msg + ' button was clicked: test only')
            };

            scope.expandedRowTransition = function (e:any, regItem:app.listings.IListing):any {
                var safeSpan =  $('#exp_'+regItem.consumerKey.substr(0,9));
                if (regItem.showExpanded == 'closed' || regItem.showExpanded == '') {
                    regItem.showExpanded = 'opening';
                    setTimeout(function () {
                        regItem.showExpanded = 'open';
                        scope.$apply();
                        // setTimeout(function(){
                        //     safeSpan.attr('tabindex',0).focus();
                        //     console.log("active",document.activeElement);
                        //     setTimeout(function () {
                        //        safeSpan.attr('tabindex',-1);
                        //         console.log("active",document.activeElement)
                        //     },300);
                        // },300);
                    }, 50);
                } else if (regItem.showExpanded == 'open') {
                    // change to .closing :: pause :: closed
                    regItem.showExpanded = 'closing';
                    setTimeout(function () {
                        regItem.showExpanded = 'closed';
                        scope.$apply();

                        // setTimeout(function(){
                        //    safeSpan.attr('tabindex',0).focus();
                        //     console.log("active",document.activeElement);
                        //     setTimeout(function () {
                        //        safeSpan.attr('tabindex',-1);
                        //         console.log("active",document.activeElement)
                        //     },300);
                        // },300)
                    }, 500);
                }
            };
            
        };
        templateUrl = 'resources/templates/listings/listingRowCollapsedTemplate.html';
    }
}