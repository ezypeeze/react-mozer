## API Reference

#### Form
- [Properties](#formProperties)
  - [className](#className)
  - [decorator](#decorator)
  - [messageProvider](#messageProvider)
  - [onSubmit](#onSubmit)
  - [onChange](#onChange)
  - [onValid](#onValid)
  - [onInvalid](#onInvalid)
  - [displayErrorsCondition](#displayErrorsCondition)
  - [validations](#displayErrorsCondition)
  - [defaultValues](#defaultValues)
  - [values](#values)
  - [submitOnlyOnValid](#submitOnlyOnValid)
  - [disableSubmitOnEnter](#disableSubmitOnEnter)
  - [validateOnChange](#validateOnChange)
- [Methods](#formMethods)
  - [submit()](#submit)
  - [get(name)](#get)
  - [isValid()](#isValid)
  - [isSubmitted()](#isSubmitted)
  - [validate(displayErrors = true)](#validate)
  - [reset()](#reset)
  - [getValue(name)](#getValue)
  - [setValue(name, value)](#setValue)
  - [setErrorMessages(messages)](#setErrorMessages)
  - [cleanErrorMessages(name)](#cleanErrorMessages)
  - [setValidations(name, validations)](#setValidations)
  - [cleanValidations(name)](#cleanValidations)
  
#### DecoratorHOC(component)
- [Properties](#decoratorHocProperties)
  - [errorMessages](#errorMessages)
  
#### ElementHOC(component)
- [Properties](#elementHocProperties)
  - [label](#label)
  - [onChange](#onChange)
  - [onTouch](#onTouch)
  - [root](#root)
  - [value](#value)
- [Methods](#elementHocMethods)
  - [disable()](#disable)
  - [enable()](#enable)
  - [reset()](#reset)
  - [valuesChanged()](#valuesChanged)
  - [isTouched()](#isTouched)
  - [isDisabled()](#isDisabled)
  - [isValid()](#isValid)
  - [isTouched()](#isTouched)
  - [getLabel()](#getLabel)
  - [getName()](#getName)
  - [getValue()](#getValue)
  - [getRoot()](#getRoot)
 
#### Form Properties
##### className | String
Class form the form.

##### decorator | React.Component
The react component to wrap each form element on render.

##### messageProvider | function
Handler for the error types, should return a string.

##### onSubmit | function
Handler triggered when form is submitted.

##### onChange | function
Handler triggered when any form element changes.

##### onValid | function
Handler triggered when form is valid.

##### onInvalid | function
Handler triggered when form is invalid.

##### displayErrorsCondition | function
Handler to decide when to decide when form should display or not error messages.
Form will either way validate the elements

##### validations | object
The list of validations for each form element: "name_of_field": [Validator.required, Validator.min]

##### defaultValues | object
Use this if you want to set the values as uncontrolled state.

##### values | object
Use this if you want to set the values as controlled state.
'onChange' property is required when using this

##### submitOnlyOnValid | bool
Makes the form only fire onSubmit handler when form is valid. Default is: false

##### disableSubmitOnEnter | bool
Disable form submission when key 'enter' is pressed. Default is: false

##### validateOnChange | bool
Makes the form perform a validation each change. Default is: false

### Form Methods
