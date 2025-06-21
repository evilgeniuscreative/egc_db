module app.run {
    import IServiceProvider = angular.IServiceProvider;
    import ILocationService = angular.ILocationService;
    interface IRootScopeTitle extends ng.IRootScopeService{
        title:string;
        $log:any;
    }
    interface IRouteParams extends ng.route.ICurrentRoute{
        $$route?:{ title?:string };
    }
    angular.module('app')
        .run(['$location', '$rootScope', '$log', function($location:ILocationService, $rootScope:IRootScopeTitle,$log:ng.ILogProvider) {
            $rootScope.$log = $log;
            $rootScope.$on('$routeChangeSuccess', function (event:ng.IAngularEvent, current:IRouteParams, previous:IRouteParams) {
                // test for current route
                if(current.$$route) {
                    // Set current page title
                    $rootScope.title = current.$$route.title;
                }
            });

            // For keyboard navigation debugging
            function trackFocus(){
                var current = document.activeElement;
                setTimeout(function(){
                    if (current != document.activeElement){
                        console.log("Focus: ",document.activeElement);
                    }
                    trackFocus();
                },500)
            }
            // trackFocus(); // comment to enable / disable
        }]);
}