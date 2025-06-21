module app.filters {
    'use strict';

    angular
        .module('app')
        .filter("shortenByIdType", function() {
            return (new ShortenByIdType()).filter;
        })
        .filter("shortenHeading", function() {
            return (new ShortenHeading()).filter;
        })
        .filter("screenReaderFriendly",function(){
            return (new ScreenReaderFriendly()).filter;
        })
        .filter("dayOrDays",function(){
            return (new DayOrDays()).filter;
        })
        .filter("cleanupToUpper",function(){
            return (new CleanupToUpper()).filter;
        })
    ;

}