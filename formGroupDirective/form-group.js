var formGroup;
(function (formGroup) {
    angular.module('albatross.ng.ui.bootstrap', ['albatross.ng.ui.bootstrap.formGroup']);
    var m = angular.module('albatross.ng.ui.bootstrap.formGroup', []);
    /************************************************************
    * formGroupConfig Constant
    */
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
    /************************************************************
    * form-group Directive
    */
    m.directive('formGroup', ['formGroupConfig', function (defaultConfig) {
        var definition = {
            restrict: defaultConfig.restrict || 'EA',
            require: '?^form',
            scope: true,
            controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
                var formGroupCtrl = this, formCtrl = $element.controller('form') || { $submitted: false }, control = null;
                // set default attrs
                angular.forEach(defaultConfig, function (value, key) {
                    if (key === 'restrict')
                        return;
                    if (angular.isDefined($attrs[key]))
                        return;
                    $attrs[key] = value;
                });
                $scope['message'] = '';
                formGroupCtrl.$setControl = function (ctrl) {
                    control = ctrl;
                    return ctrl;
                };
                formGroupCtrl.$removeControl = function (ctrl) {
                    if (control === ctrl) {
                        control = null;
                    }
                    return ctrl;
                };
                var currentState;
                $scope.$watch(function () {
                    var state = 'pristine';
                    var isDirty = control.$dirty || formCtrl.$submitted;
                    if (control.$invalid && isDirty) {
                        return Object.keys(control.$error).reduce(function (prev, curr) {
                            if (control.$error[curr])
                                return prev + '|' + $attrs.$normalize(curr);
                            return prev;
                        }, 'invalid');
                    }
                    if (control.$valid && isDirty)
                        return 'valid';
                    return 'pristine';
                }, watchAction, true);
                function watchAction(newState, oldState) {
                    var newFlags = newState.split('|');
                    newState = newFlags.splice(0, 1)[0];
                    currentState = { state: newState, flags: newFlags };
                    // we do not need flags from oldState
                    oldState = oldState.split('|')[0];
                    var oldClass = $attrs[oldState + 'Class'];
                    var newClass = $attrs[newState + 'Class'];
                    setMessage(newState, newFlags);
                    $element.removeClass(oldClass).addClass(newClass);
                }
                var watchedMessageMap = {};
                function setMessage(state, flags) {
                    var message = $attrs[state + 'Message']; // default message
                    // check $attrs for specific message(s)
                    var specificMessage = flags.reduce(function (message, flag, index) {
                        var messageKey = $attrs.$normalize(state + '-' + flag + '-message');
                        var specificMessage = $attrs[messageKey];
                        if (specificMessage) {
                            message += (index > 0 ? '\n' : '') + specificMessage;
                            // observe the message to allow for interpolation
                            if (!(messageKey in watchedMessageMap)) {
                                $attrs.$observe(messageKey, function (message) {
                                    if (watchedMessageMap[messageKey] !== message) {
                                        setMessage(currentState.state, currentState.flags);
                                    }
                                    watchedMessageMap[messageKey] = message;
                                });
                            }
                        }
                        return message;
                    }, '');
                    $scope['message'] = specificMessage || message;
                }
            }]
        };
        return definition;
    }]);
    /************************************************************
    * ng-model Directive
    */
    m.directive('ngModel', [function () {
        var definition = {
            require: ['ngModel', '?^formGroup'],
            link: function link($scope, element, attrs, ctrls) {
                var modelCtrl = ctrls[0], formGroupCtrl = ctrls[1];
                if (!modelCtrl || !formGroupCtrl)
                    return;
                formGroupCtrl.$setControl(modelCtrl);
                $scope.$on('$destroy', function () {
                    formGroupCtrl.$removeControl(modelCtrl);
                });
            }
        };
        return definition;
    }]);
})(formGroup || (formGroup = {}));
//# sourceMappingURL=form-group.js.map