module app.directives {
    interface IWarningIcon extends ng.IScope{
        ariaLabel:string;
        iconClass:string;
        days:number;
        message:string;
        urgency:Array<string>;
        iconClasses:Array<string>;
        getWarning(days:number):number;
    }
    export class WarningIconDirective implements ng.IDirective {
        priority = 0;
        restrict = 'A';
        scope = { days: '@'};
        controller = WIController;
        link = WILink;
        template = '<i role="img" aria-label="Warning Icon {{urgency[getWarning(days)]}}" class="{{getWarning(days)}} fa {{iconClasses[getWarning(days)]}}"></i>';
    }
    
    function WIController($scope:IWarningIcon){
        $scope.urgency = [
            'Expired', 'Expiration Imminent', 'Expiring Very Soon', 'Expiring Soon', 'Renewal Coming Up'
        ];
        $scope.iconClasses = [
            'fa-exclamation-circle warning','fa-exclamation-circle warning', 'fa-exclamation-triangle warning', 'fa-exclamation-triangle',''
        ];

        $scope.getWarning = function(days:number):number {
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
            return warningCat;
        }
    }
    function WILink(scope:IWarningIcon, element:ng.IAugmentedJQuery, attr:ng.IAttributes){
        element.attr('class','icon-wrap');
    }
}

