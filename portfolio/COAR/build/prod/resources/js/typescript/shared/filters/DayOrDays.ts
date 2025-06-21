module app.filters {
    'use strict';
    export class DayOrDays {

        constructor() {
        }

        filter(input:string):string {
            var output:string = input;
                if (Math.abs(parseInt(output)) == 1){
                    output = "day";
                } else{
                    output = "days";
                }
            return output;
        }
    }

}