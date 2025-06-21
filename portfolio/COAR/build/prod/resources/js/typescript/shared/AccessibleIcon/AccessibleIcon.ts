/**
 * Accessible Icon
 * @file Directive to create an accessible icon
 * @module 'src/typescript/shared/AccessibleIcon/AccessibleIcon.ts'
 * @example  <a acc-icon m = "Required" ic = "star" s = "3"></a> or <acc-icon  m = "Required" ic = "star" s = "3"></acc-icon>
 * @param m: Message for screen readers (required)
 * @param ic: Font-awesome icon class, leaving out the 'fa-'. Ex: star | exclamation-triangle | info-circle (required)
 * @param v: Vertical-alignment 0 | 1 => ['subscript','superscript'] (optional)
 * @param s: Severity 0 | 1 | 2 | 3 => ['alert-green','alert-yellow','alert-orange','alert-red'] (optional)
 * @see https://fortawesome.github.io/Font-Awesome/cheatsheet/
 * @todo NA
 * @author ikleinfe on 01 Mar 2016
 * @version 0.1
 * JSDOC info http://usejsdoc.org/
 */
    module app.directives {
        interface IAccessibleIcon extends ng.IScope {
            ariaLabel:string;
            ic:string;
            m:string;
            s:number;
            va:number;
            vAlign:Array<string>;
            severity:Array<string>;
            nodes:Array<string>;
        }

        export class AccessibleIconDirective implements ng.IDirective {
            priority = 0;
            restrict = 'A';
            scope = {
                'm': '@',
                'ic': '@',
                's': '@',
                'va': '@'
            };
            controller = AIController;
            link = AILink;
            template = EorA;
        }
        function AIController($scope:IAccessibleIcon) {
            $scope.severity = ['alert-green', 'alert-yellow', 'alert-orange', 'alert-red'];
            $scope.vAlign = ['subscript', 'superscript'];
            $scope.nodes = ['A', 'SPAN', 'DIV', 'P'];
        }

        function AILink(scope:IAccessibleIcon, element:ng.IAugmentedJQuery, attr:ng.IAttributes) {
            if (element[0].nodeName == 'I') {
                // if element is <i>, there's no wrapper so there's no need for .icon-wrap class

                element.attr({
                    'aria-label': scope.m,
                    'role': 'img',
                    'class': 'acc-icon fa fa fa-' + scope.ic + ' ' + scope.severity[scope.s] + ' ' + scope.vAlign[scope.va],
                });
            }
            else {
                element.attr('class', 'icon-wrap');
            }
        }

        function EorA(tElement:ng.IAugmentedJQuery) {
            if (tElement[0].nodeName == 'I') {
                // don't use template
                return '';
            } else {
                // use template
                return '<i role="img" aria-label="Icon {{m}}" class="acc-icon fa fa-{{ic}} {{severity[s]}} {{vAlign[va]}}"></i>';
            }
        }
    }

