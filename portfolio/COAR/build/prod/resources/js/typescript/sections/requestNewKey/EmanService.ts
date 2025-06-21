module app.services{
    'use strict';

    export class EmanService implements IEmanService{
        static $inject = ['$http','q'];

        private emanCache: IEmanNames;

        constructor(private $http:ng.IHttpService, private $q:ng.IQService) {
        }

        getEmanNames():ng.IPromise<IEmanNames>{
            if (this.emanCache !== undefined) {
                return this.$q.when(this.emanCache);
            }
            else {
                return this.$http.get('sampledata/emanNames.json')
                    .then((response:IEmanNames) => {
                        this.emanCache = response;
                        return this.emanCache;
                    });
            }
        }
    }
}