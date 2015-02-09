'use strict';
var app = angular.module('app', ['albatross.ng.ui.bootstrap', 'ui.bootstrap.tpls']);
app.config(['formGroupConfig', function (formGroupConfig) {
    formGroupConfig.invalidOnBlur = true, formGroupConfig.validClass = 'has-success';
}]);
app.controller('app.ctrl', ['$scope', function ($scope) {
    $scope.model = {
        text: 'testing',
        number: 6,
        select: 1
    };
    $scope.savedModel = angular.copy($scope.model);
    $scope.reset = function (formCtrl) {
        $scope.model = angular.copy($scope.savedModel);
        formCtrl.$setPristine();
    };
    $scope.submit = function (formCtrl) {
        if (formCtrl.$valid) {
            console.log('valid submit');
            $scope.savedModel = angular.copy($scope.model);
        }
        else {
            console.log('invalid submit');
        }
    };
}]);
//# sourceMappingURL=app.js.map