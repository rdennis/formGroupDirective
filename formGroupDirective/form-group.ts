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
   restrict: 'EA',
   invalidOnBlur: false,
   pristineClass: '',
   pristineMessage: '',
   validClass: '',
   validMessage: '',
   invalidClass: 'has-error',
   invalidMessage: ''
})

m.directive('formGroup', ['formGroupConfig', function (defaultConfig: IFormGroupConfig) {
   var definition: ng.IDirective = {
      restrict: defaultConfig.restrict || 'EA',
      require: '^^form',
      priority: 2000,
      scope: true,
      compile: function (element, attrs) {
         var input = angular.element(element[0].querySelector('.form-control'))

          // no .form-control found
         if (input.length < 1) return angular.noop

         return function link($scope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, formCtrl: ng.IFormController) {
            var inputCtrl: ng.INgModelController = input.controller('ngModel')

            if (!formCtrl || !inputCtrl) return

            // set default attrs
            angular.forEach(defaultConfig, function (value, key) {
               if (key === 'restrict') return
               if (angular.isDefined(attrs[key])) return
               attrs[key] = value
            })

            $scope.message = ''

            if ($scope.invalidOnBlur) {
               var setDirty = function () { inputCtrl.$setDirty() }
               input.on('blur', setDirty)
               input.on('$destroy', function ($event) {
                  input.off('blur', setDirty)
               })
            }

            $scope.$watch(
               function () {
                  if (inputCtrl.$invalid && (inputCtrl.$dirty || formCtrl.$submitted)) {
                     var status = Object.keys(inputCtrl.$error).reduce(function (previous, current) {
                        if (inputCtrl.$error[current]) return previous + '|' + current
                     }, 'invalid')
                     return status
                  }
                  if (inputCtrl.$valid && (inputCtrl.$dirty || formCtrl.$submitted)) return 'valid'
                  if (inputCtrl.$pristine) return 'pristine'
               },
               function (newState: string, oldState: string, scope) {
                  var newFlags = newState.split('|')
                  newState = newFlags[0]
                  newFlags = newFlags.slice(1)

                  // ensure we do not have flags in oldState
                  oldState = oldState.split('|')[0]

                  var oldClass = attrs[oldState + 'Class']
                  var newClass = attrs[newState + 'Class']
                  var message = attrs[newState + 'Message'] // default message

                  // check if a specific message is available
                  var specificMessage = newFlags.reduce(function (message, flag, index) {
                     var messageKey = newState + flag.charAt(0).toUpperCase() + flag.slice(1) + 'Message'
                     var specificMessage = attrs[messageKey]
                     if (angular.isDefined(specificMessage)) {
                        message += (index > 0 ? '\n' : '') + specificMessage
                        return message
                     }
                  }, '')

                  element.removeClass(oldClass).addClass(newClass)
                  $scope.message = specificMessage || message
               })
         }
      }
   }

   return definition
}])