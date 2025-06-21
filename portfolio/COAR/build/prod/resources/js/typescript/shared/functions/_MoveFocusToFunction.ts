module app.services {
    export class MoveFocusToFunction {
        static  moveFocusTo(element:string):void {
            $(element).focus();
        }
    }
}
