/************************************************************
 * Infrastructure
 */
interface IFormGroupConfig {
   restrict?: string
   invalidOnBlur?: boolean

   pristineClass?: string
   pristineMessage?: string
   validClass?: string
   validMessage?: string
   invalidClass?: string
   invalidMessage?: string
}

/************************************************************
 * Directive
 */
angular.module('albatross.ng.ui.bootstrap', ['albatross.ng.ui.bootstrap.formGroup'])
var m = angular.module('albatross.ng.ui.bootstrap.formGroup', [])

m.constant('formGroupConfig', <IFormGroupConfig> {
   invalidOnBlur: false,
   invalidClass: 'has-error'
})

m.directive('formGroup', ['formGroupConfig', '$compile', function (defaultConfig: IFormGroupConfig, $compile) {
   var definition = {
      restrict: defaultConfig.restrict || 'EA',
      require: '^^form',
      scope: {
         pristineClass: '@',
         pristineMessage: '@',
         validClass: '@',
         validMessage: '@',
         invalidClass: '@',
         invalidMessage: '@'
      },
      link: function ($scope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) {
         // use default settings if none exist
         angular.forEach(defaultConfig, function (value, key) {
            if(key != 'restrict' && angular.isUndefined($scope[key])) $scope[key] = value
         })

         var input = angular.element(element[0].querySelector('.form-control'))
         if (input.length > 0) {
            var formCtrl: ng.IFormController = element.controller('form')
            var inputCtrl: ng.INgModelController = input.controller('ngModel')

            if ($scope.invalidOnBlur) {
               input.on('blur', function (event) {
                  inputCtrl.$dirty = true
                  $scope.$digest()
               })
            }

            $scope.$watch(
               function () {
                  if ((inputCtrl.$dirty || formCtrl.$submitted) && inputCtrl.$invalid) return 'invalid'
                  if (inputCtrl.$pristine) return 'pristine'
                  if (inputCtrl.$valid) return 'valid'
               },
               function (newState, oldState, $scope) {
                  var removeClass = $scope[oldState + 'Class'] || ''
                  var addClass = $scope[newState + 'Class'] || ''
                  element.removeClass(removeClass).addClass(addClass)
               })
         }
      }
   }

   return definition
}])