module app.routes {
    // interface IRouteTitle extends ng.route.IRoute{
    //     title?:string;
    // } // TODO I had to move this to angular-route.d.ts because it wasn't working here for some reason
    angular.module('app')
        .config(function($routeProvider:ng.route.IRouteProvider){
            $routeProvider
                .when('/',{
                    templateUrl:'resources/templates/listings/myRegistrationsTemplate.html',
                    controller: 'ListingController',
                    controllerAs: 'listingCtrl',
                    title: 'COAR Cisco OAuth Registration: Homepage with Listings'
                })
                .when('/request-new-key',{
                    templateUrl:'resources/templates/requestNewKey/newKeyTemplate.html',
                    controller: 'NewKeyController',
                    controllerAs: 'newkeyCtrl',
                    title: 'COAR: Request New Key'
                })
                .when('/approve-registrations',{
                    templateUrl:'resources/templates/approveRegistrations/approveRegistrationsTemplate.html',
                    controller: 'ApproveRegistrationsController',
                    controllerAs: 'appregCtrl',
                    title: 'COAR: Approve Registrations'
                })
            ;
        });
}
