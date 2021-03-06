'use strict';

System.register(['aurelia-binding'], function (_export, _context) {
  var bindingMode, ThrottleBindingBehavior;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function throttle(newValue) {
    var _this = this;

    var state = this.throttleState;
    var elapsed = +new Date() - state.last;
    if (elapsed >= state.delay) {
      clearTimeout(state.timeoutId);
      state.timeoutId = null;
      state.last = +new Date();
      this.throttledMethod(newValue);
      return;
    }
    state.newValue = newValue;
    if (state.timeoutId === null) {
      state.timeoutId = setTimeout(function () {
        state.timeoutId = null;
        state.last = +new Date();
        _this.throttledMethod(state.newValue);
      }, state.delay - elapsed);
    }
  }

  return {
    setters: [function (_aureliaBinding) {
      bindingMode = _aureliaBinding.bindingMode;
    }],
    execute: function () {
      _export('ThrottleBindingBehavior', ThrottleBindingBehavior = function () {
        function ThrottleBindingBehavior() {
          _classCallCheck(this, ThrottleBindingBehavior);
        }

        ThrottleBindingBehavior.prototype.bind = function bind(binding, source) {
          var delay = arguments.length <= 2 || arguments[2] === undefined ? 200 : arguments[2];

          var methodToThrottle = 'updateTarget';
          if (binding.callSource) {
            methodToThrottle = 'callSource';
          } else if (binding.updateSource && binding.mode === bindingMode.twoWay) {
              methodToThrottle = 'updateSource';
            }

          binding.throttledMethod = binding[methodToThrottle];
          binding.throttledMethod.originalName = methodToThrottle;

          binding[methodToThrottle] = throttle;

          binding.throttleState = {
            delay: delay,
            last: 0,
            timeoutId: null
          };
        };

        ThrottleBindingBehavior.prototype.unbind = function unbind(binding, source) {
          var methodToRestore = binding.throttledMethod.originalName;
          binding[methodToRestore] = binding.throttledMethod;
          binding.throttledMethod = null;
          clearTimeout(binding.throttleState.timeoutId);
          binding.throttleState = null;
        };

        return ThrottleBindingBehavior;
      }());

      _export('ThrottleBindingBehavior', ThrottleBindingBehavior);
    }
  };
});