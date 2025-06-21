
module app.directives {
    'use strict';

    angular.module('app')
        .directive('warnIcon', () => new WarningIconDirective())
        .directive('accIcon', () => new AccessibleIconDirective())
        .directive('listingRow', () => new ListingRowDirective())
        .directive('listingRowExpanded', () => new ListingRowExpandedDirective())
        .directive('listingRowCollapsed', () => new ListingRowCollapsedDirective())
        .directive('listingHead', () => new ListingHeadingDirective())
        .directive('listingTable', () => new ListingTableDirective())
        .directive('tabSet', ()=> new TabSet())
        .directive('tabTab', ()=> new TabTab())
        .directive('oneTab', ()=> new OneTab())
        .directive('copyToClipboard', ()=> new CopyToClipboard)
    ;
}