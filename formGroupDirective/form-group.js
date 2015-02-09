/************************************************************
 * Directive
 */
angular.module('albatross.ng.ui.bootstrap', ['albatross.ng.ui.bootstrap.formGroup']);
var m = angular.module('albatross.ng.ui.bootstrap.formGroup', ['ui.bootstrap.popover']);
m.constant('formGroupConfig', {
    restrict: 'EA',
    invalidOnBlur: false,
    pristineClass: '',
    pristineMessage: '',
    validClass: '',
    validMessage: '',
    invalidClass: 'has-error',
    invalidMessage: ''
});
m.directive('formGroup', ['formGroupConfig', function (defaultConfig) {
    var definition = {
        restrict: defaultConfig.restrict || 'EA',
        require: '^^form',
        priority: 2000,
        scope: true,
        compile: function (element, attrs) {
            var input = angular.element(element[0].querySelector('.form-control'));
            if (input.length < 1)
                return angular.noop;
            // add validation popover
            input.attr('popover', '{{message}}');
            input.attr('popover-trigger', 'mouseenter');
            return function link($scope, element, attrs) {
                var formCtrl = element.controller('form');
                var inputCtrl = input.controller('ngModel');
                if (!formCtrl || !inputCtrl)
                    return;
                // set scope from attrs and watch for changes
                angular.forEach(defaultConfig, function (value, key) {
                    if (key === 'restrict')
                        return;
                    $scope[key] = attrs[key] || value;
                    attrs.$observe(key, function (value) {
                        $scope[key] = value;
                    });
                });
                $scope.message = '';
                if ($scope.invalidOnBlur) {
                    var setDirty = function () {
                        inputCtrl.$dirty = true;
                    };
                    input.on('blur', setDirty);
                    input.on('$destroy', function ($event) {
                        input.off('blur', setDirty);
                    });
                }
                $scope.$watch(function () {
                    if (inputCtrl.$invalid && (inputCtrl.$dirty || formCtrl.$submitted))
                        return 'invalid';
                    if (inputCtrl.$valid && (inputCtrl.$dirty || formCtrl.$submitted))
                        return 'valid';
                    if (inputCtrl.$pristine)
                        return 'pristine';
                }, function (newState, oldState, scope) {
                    var oldClass = scope[oldState + 'Class'];
                    var newClass = scope[newState + 'Class'];
                    var message = scope[newState + 'Message'];
                    element.removeClass(oldClass).addClass(newClass);
                    $scope.message = message;
                });
            };
        }
    };
    return definition;
}]);
//# sourceMappingURL=form-group.js.map