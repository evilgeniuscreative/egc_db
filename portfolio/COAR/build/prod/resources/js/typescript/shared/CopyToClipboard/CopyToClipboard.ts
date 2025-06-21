module app.directives {
    interface ICopyToClipboard extends ng.IScope {
        shorttext:string;
        fulltext:string;
        showThis:boolean;
        openMe():void;
        closeMe():void;
        keyControl(el:any):void;
        type:string;
    }
    export class CopyToClipboard implements ng.IDirective {
        priority = 0;
        restrict = 'E';
        scope = {
            type: '@',
            title: '@',
            fulltext: '@'
        };
        templateUrl = 'resources/templates/shared/copyToClipboard/copyToClipboard.html';
        controller = CopyToClipboardController;
        // controllerAs = 'ctcCtrl';
        link = CopyToClipboardLink;
    }

    function CopyToClipboardController($scope:ICopyToClipboard) {
        $scope.shorttext = $scope.fulltext.substr(0, 6);
        $scope.showThis = false;
    }

    function CopyToClipboardLink(scope:ICopyToClipboard, element:ng.IAugmentedJQuery, attr:ng.IAttributes) {
        var elID = 'ctc_' + scope.type + '_' + scope.shorttext;
        element.attr('id', elID);
        var $el = $('#' + elID);
        var $balloon = $el.find('.copy-this-balloon');
        var $input = $balloon.find('input');
        var $button = $balloon.find('button');
        var $origLink = $el.find('a');
        var $focus = 0;

        scope.closeMe = function(){
            scope.showThis = false;
            console.log($origLink.parent());
            $origLink.parent().focus();
        };
        scope.openMe = function () {
            scope.showThis = true;
            setTimeout(function () {
                $input.focus().select();
                $balloon.keydown(function (e:any) {
                    if (e.which == 27) {
                        $button.trigger('click');
                        $origLink.focus();
                    }
                    if (e.which == 9) {
                        if ($focus == 0) {
                            $focus = 1;
                            $button.focus();
                        } else {
                            $focus = 0;
                            $input.focus();
                        }
                        e.preventDefault();
                    }
                });
            }, 50);
        }
    }
}