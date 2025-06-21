module app.filters {
    'use strict';

    export class ShortenByIdType {

        constructor() {
        }

        filter(input:string):string {
            var output:string = input;
            if (input.substr(0, 1) === "I" || input.substr(0, 1) === "i") {
                output = "IND";
            }
            if (input.substr(0, 1) === "P" || input.substr(0, 1) === "p") {
                output = "PROV";
            }
            if (input.substr(0, 1) === "M" || input.substr(0, 1) === "m") {
                output = "MASQ";
            }
            return output;
        }

    }

}