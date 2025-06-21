module app.directives.controllers {
    'use strict';
    interface ICopyToClipboard extends ng.IScope{
        fullText:string;
    }
    export class CopyToClipboardController {
        shortText:string;
        fullText:string;
        showThis:boolean;

        constructor($scope:ICopyToClipboard){
            this.fullText = $scope.fullText;
            this.shortText = this.fullText.substr(0,6);
            this.showThis = false;
        }
    }


}