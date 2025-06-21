module app.services {
    'use strict';

    export interface IEmanService {
        getEmanNames():ng.IPromise<IEmanNames>;
    }
}

