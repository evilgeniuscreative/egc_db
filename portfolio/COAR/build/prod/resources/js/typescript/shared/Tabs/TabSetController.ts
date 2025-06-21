module app.controllers {
    'use strict';
   import ITabSetController = app.controllers.ITabSetController;
    
    export class TabSetController {
        tabs:Array<any>;
        tab:any;


        constructor() {
            this.tabs = [];
        }

        addTab(tab?:any) {
            if (tab) {
                this.tabs.push(tab);
                if (this.tabs.length === 1) {
                    tab.active = true
                }
            }
        };

        select(selectedTab?:any) {
            if (selectedTab) {
                angular.forEach(this.tabs, function (tab:any) {
                    // console.log("tsc tab",tab.id, tab.active);
                    if (tab.active && tab !== selectedTab) {
                        tab.active = false;
                    }
                    // console.log("tsc tab",tab.id, tab.active);
                });
                selectedTab.active = true;
                // console.log("selectedTab", selectedTab.id, selectedTab.active);
                
            }
        }
    }
}
