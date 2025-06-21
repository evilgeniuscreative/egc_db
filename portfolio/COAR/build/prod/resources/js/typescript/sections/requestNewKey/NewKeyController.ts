/**
 * NewKeyController
 * @file Controller for RequestNewKey page
 * @module NewKeyController.ts
 * @example n/a
 * @see requestNewKey.html, request-key-form.styl
 * @todo none
 * @author ikleinfe on 15 Mar 2016
 * @version 0.1
 * JSDoc info http://usejsdoc.org/
 */
module app.controllers {
    'use strict';
    export class NewKeyController {
        emanNames: Array<string>;
        submitted: boolean;

        static $inject = ['$http', 'EmanService'];

        constructor(private $http:ng.IHttpService, public emanService:IEmanService) {
            this.getEmanNames();
            this.submitted = false;
        }

        getEmanNames():ng.IPromise<IEmanNames> {
            return this.emanService.getEmanNames()
                .then((data:any)=> {
                    return this.emanNames = data.data.AppName;
                })
        }

        charCount(el:ng.INgModelController){
            return 10 - el.$viewValue.length;
        }

       submitForm(valids:any){
          this.submitted = true;
           return;
        }

        showError(obj:Object){
            // obj.$validators are the names of required attributes
            console.log(obj);
            return
        }

        // processForm(valids:any,el:ng.IFormController) {
        // $http({
        //     method  : 'POST',
        //     url     : 'process.php',
        //     data    : $.param($scope.formData),  // pass in data as strings
        //     headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        // })
        //     .success(function(data) {
        //         console.log(data);
        //
        //         if (!data.success) {
        //             // if not successful, bind errors to error variables
        //             $scope.errorName = data.errors.name;
        //             $scope.errorSuperhero = data.errors.superheroAlias;
        //         } else {
        //             // if successful, bind success message to message
        //             $scope.message = data.message;
        //         }
        //     });
    // };


    }
}