formGroupDirective
==================
Angularjs directive to add validation classes to Bootstrap's form-group component.

Available attributes
--------------------
* `invaid-on-blur` - sets `$dirty` when the control loses focus
* `pristine-[class|message]` - class and message to be used in `$pristine` state
* `valid-[class|message]` - class and message to be used in `$valid` state
* `invalid-[class|message]` - class and message to be used in `$invalid` state
* `invalid-{some-error-}message` - messaege to be used when `{someEror}` is present in `$error`

Example
----------
```html
<form novalidate>
  <div class="form-group" form-group
      pristine-class="has-warning"
      pristine-message="Pristine number"
      valid-class="has-success"
      valid-message="Nice number!"
      invalid-class="has-error"
      invalid-message="Enter a number"
      invalid-min-message="That's too low"
      invalid-max-message="That's too high"
      invalid-required-message="A number is required">
    <label for="number" class="control-label">Input</label>
    <input id="number" type="number" class="form-control" ng-model="number" min="1" max="10" required />
    <span class="help-block">{{message}}</span>
  </div>
</form>
```

Future Plans
------------
* Remove requirement for `.form-control` (perhaps child directive?)
* Specific pristine or valid messages
* Specific invalid classes (`invalid-{some-error-}class`)
* `.form-group` to take on Angular validation classes (`.ng-pristine`, `.ng-valid`, `.ng-invalid`, etc.)
