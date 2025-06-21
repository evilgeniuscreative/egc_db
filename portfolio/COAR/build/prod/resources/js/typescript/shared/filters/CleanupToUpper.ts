module app.filters {
    'use strict';

    export class CleanupToUpper {

        constructor() {
        }

        filter(input:string):string {

            input = input.replace(/[-_]/g, ' ');
            // sentence case
            // var output:string =  input.replace(/\w\S*/g, function(txt){
            //     console.log(txt.charAt(0));
            //     return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            // });
            return input.toUpperCase();
        }
    }

}