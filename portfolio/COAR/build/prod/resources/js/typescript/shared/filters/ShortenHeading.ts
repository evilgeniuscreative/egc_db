module app.filters {
    'use strict';

    export class ShortenHeading {

        constructor() {
        }

        filter(input:string):string {

            var output:string = input;
            if (output.indexOf('consumer id') > -1){
                output = "cons id"; //output.replace('consumer','cns');
            }
            if (output.indexOf('key') > -1){
                output = "c-key"; //output.replace('consumer','cns');
            }
            if (output.indexOf('secret') > -1){
                output = "c-secret"; //output.replace('consumer','cns');
            }
            if (output.indexOf('approved') > -1){
                output = output.replace('approved','apprv');
            }
            return output.toUpperCase(); 
        }
    }

}