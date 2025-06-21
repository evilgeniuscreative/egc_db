module app.listings{
    export class ExpandedRowTransition{
        static expandedRowTransition(regItem:app.listings.IListing, scope:ng.IScope):void {
            if (regItem.showExpanded == 'closed' || regItem.showExpanded == '') {
                regItem.showExpanded = 'opening';
                setTimeout(function () {
                    regItem.showExpanded = 'open';
                    scope.$apply();
                }, 50);
            } else if (regItem.showExpanded == 'open') {
                // change to .closing :: pause :: closed
                regItem.showExpanded = 'closing';
                setTimeout(function () {
                    regItem.showExpanded = 'closed';
                    scope.$apply();
                }, 500);
            }
        }
    }

}