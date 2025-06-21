module app.filters {
    'use strict';
    export class StringToDate {

        constructor() {
        }

        filter(input:string):string {
            var output:string = input;
            var a = input.split(/[^0-9]/);
            var y = parseInt(a[0]), m = parseInt(a[1]) - 1, d = parseInt(a[2]), h = parseInt(a[3]);
            return output; //new Date(y, m, d, h);
        }
    }

}