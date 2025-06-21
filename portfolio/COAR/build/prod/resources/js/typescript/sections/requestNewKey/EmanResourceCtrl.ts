module app.controllers {
    'use strict';
    
    export class EmanResourceCtrl {
        
        public emanCache: ng.resource.IResourceArray<IEmanNames>;
        
        static $inject = ['EmanResource'];
        
        constructor(public resource: ng.resource.IResourceClass<IEmanNames>){
            this.emanCache = resource.query();
        }

        getEmanNames(): ng.resource.IResourceArray<IEmanNames>{
            return this.emanCache;
        }
    }
}
