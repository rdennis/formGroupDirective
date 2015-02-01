'use strict';

var app = angular.module('app', ['albatross.ng.ui.bootstrap'])

app.config(['formGroupConfig', function (formGroupConfig: IFormGroupConfig) {
   formGroupConfig.restrict = 'C'
   formGroupConfig.invalidOnBlur = true

   formGroupConfig.invalidClass = 'has-error'
   formGroupConfig.validClass = 'has-success'
   formGroupConfig.pristineClass = 'has-warning'
}])

app.controller('app.ctrl', ['$scope', function ($scope) {
   $scope.reset = function (formCtrl: ng.IFormController) {
      $scope.model = angular.copy($scope.savedModel)
      formCtrl.$setPristine()
   }

   $scope.submit = function (formCtrl: ng.IFormController) {
      if (formCtrl.$valid) {
         console.log('valid submit')
         $scope.savedModel = angular.copy($scope.model)
         formCtrl.$setPristine()
      } else {
         console.log('invalid submit')
      }
   }
}])