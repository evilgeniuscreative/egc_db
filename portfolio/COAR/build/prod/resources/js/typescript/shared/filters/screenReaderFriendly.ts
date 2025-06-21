module app.filters {
    'use strict';

    export class ScreenReaderFriendly {

        constructor() {
        }

        filter(input:string):string {

            var output:string = input;
            if (output.toLowerCase() == "cecid") {
                output = "C E C I D";
            }
            output = output.replace(/-id/, ' I D');
           output = output.replace(/-/g,' ');

            return output;
        }
    }

}