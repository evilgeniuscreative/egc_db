module app.listings {
    export class TestFunction {
        testFunction = (num:number):string => {
            console.log("TF");
            var names = ['zero','one','two','three','four'];
            return names[num];
        }
    }
}