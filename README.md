# react-mozer
Reactish Reactive Forms.

[![Build Status](https://travis-ci.org/ezypeeze/react-mozer.svg?branch=master)](https://travis-ci.org/ezypeeze/react-mozer)

## Purpose
I've been developing forms for ages... it has been a pain! With the most recent frontend frameworks (React, Vue, Angular, ...),
it has been easier and easier to make pretty and reactive forms that helps a lot to the users/customers experience.

I personally prefer react over angular/vue, but I've to admit, angular did an awesome job with Reactive Forms module,
and I never actually found any react library that follows that approach, so I decided to write my own.

It's still a work in progress, a lot needs to be done, and I'm developing new features as my professional/personal projects
needs, but feel free to contribute!

## Install
Install with `npm install react-mozer`.

## Usage
You can check [`examples` folder](/examples) for examples.

Complete API reference is available [here](/API.md).

There are 3 different component contexts:

#### Form
The form component is the root, is responsible to listen behaviours, append decorators and validation of elements.

#### Decorator
The decorator component is responsible to style the form element, as well to display the error messages (if any) in the
desired place.

#### Element
The element component is the form element itself.

### Simple Example
```jsx
  import React from 'react';
  import {Form, Input, Validators} from 'react-mozer';

  class ExampleForm extends React.Component {

      state = {};

      // Form looks up recursively for form elements (this way you can have the grid layout as you wish, inside the form)
      // --- A form element is valid when: property 'name' and its wrapped by ElementHOC.
      // --- Each form element will be wrapped by a decorator (by default decorator is empty)
      // --- Each form element will be initially validated without display the messages
      render() {
          const {values, validations} = this.state;

          return (
              <Form onSubmit={this._handleSubmit}
                    onChange={this._handleChange}
                    values={{email: 'teste@gmail.com'}}
                    validations={{email: [Validators.required(), Validators.email()]}}
              >
                  <div className="row">
                      <div className="col-6">
                          <Input name="email" type="text"/>
                      </div>
                      <div className="col-6">
                          <Input name="password" type="text"/>
                      </div>
                  </div>

                  <button type="submit">Submit</button>
              </Form>
          );
      }

      // Everytime a form element inside form changes, this handler is activated.
      // --- 'values' param is the entire form values
      // --- 'element' param is the Form Element Wrapper, which contains all needed information
              (if value has changed, if it was touched, if its valid, ...)
      handleChange = (values, element) => this.setState({values});

      // Everytime the form is submitted, first is validated and then this handler is activated.
      handleSubmit = (values, valid) => {
          if (valid) {
              // form is valid
          }
      }

  }
```

### Adding a custom decorator
Form will append decorator for each form element it finds at his children.
A decorator must have *DecoratorHOC - decorator wrapper*.
```jsx
  import React from 'react';
  import {Form, DecoratorHOC} from 'react-mozer';

  const CustomDecorator = DecoratorHOC(
      (props) => (
        <div className={"CustomDecorator " + props.foo && "foo"}>
            {React.Children.map(child => {
                return React.cloneElement(child, {
                    ...child.props,
                    className: "form-element " + child.props.className
                })
            })}
            {errorMessages && errorMessages.map(message => (
                <span className="error-message">{message}</span>
            ))}
        </div>
      )   
  );

  class CustomDecoratorForm extends React.Component {
        render() {
            return (
                <Form {...this.props} decorator={<CustomDecorator foo={true} />}>
                    {this.props.children}
                </Form>
            );
        }
  }
```

### Adding a custom form element
Sometimes using the Input or Select default component with a decorator wont be enough,
you might need some custom or non-native type of behaviour (e.g: input masks, searchable selects, ...).

```jsx
  import React from 'react';
  import {Form, ElementHOC} from 'react-mozer';

  const MaskedInput = ElementHOC(class extends React.Component {

        // These are the required properties of an form element
        static propTypes = {
            name: propTypes.func.isRequired,
            onChange: propTypes.func.isRequired,
            onTouch: propTypes.func.isRequired
        }

        render() {
            return (
                <input {...this.props}
                    onChange={this.handleChange}
                    onFocus={this.props.onTouch}
                />
            );
        }

        handleChange = (event) => {
            let value = event.target.value;

            // do your masked magic

            this.props.onChange(value);
        }
  });

  class ExampleForm extends React.Component {
        render() {
            return (
                <Form>
                    <MaskedInput name="maskedInput" type="text" />
                </Form>
            );
        }
  }
```

**NOTE:** Try to always avoid add decoration styling logic inside the form element!
Try to keep the form element as native as possible, to be easier to change between
decorations in the future, e.g:

```jsx
  import React from 'react';
  import {Form, Input, ElementHOC, DecoratorHOC, Validators} from 'react-mozer';

  // AVOID DOING THIS!!!
  // AVOID DOING THIS!!!
  // AVOID DOING THIS!!!
  const MaskedInput = ElementHOC(class extends React.Component {

        // These are the required properties of an form element
        static propTypes = {
            name: propTypes.func.isRequired,
            onChange: propTypes.func.isRequired,
            onTouch: propTypes.func.isRequired
        }

        // AVOID DOING THIS!!!
        // AVOID DOING THIS!!!
        // AVOID DOING THIS!!!
        render() {
            <div className="form-group">
                <input {...this.props}
                    className={"form-control " + this.props.className}
                    onChange={this.handleChange}
                    onFocus={this.props.onTouch}
                />
            </div>
        }

        handleChange = (event) => {
            let value = event.target.value;

            // do your masked magic

            this.props.onChange(value);
        }
  });
  // AVOID DOING THIS!!!
  // AVOID DOING THIS!!!
  // AVOID DOING THIS!!!
```

### Decide when to display error messages
By default, the form will initially validate the current data, but will not
display the error messages, only when the form is _submitted_.

If you want to decide the display error logic:
```jsx
  import React from 'react';
  import {Form} from 'react-mozer';

  class ReactiveValidationForm extends React.Component {
        render() {
            return (
                <Form {...this.props} displayErrorsCondition={this.handleErrorDisplayer}>
                    {this.props.children}
                </Form>
            );
        }

        // Everytime a form element is validated, it comes here to check if its displayable // or not
        // ---
        // 'element' param is an instance of ElementHOC - form element wrapper
        // this example will show error messages, if the form was already submitted
        // and if the element value has already changed.
        handleErrorDisplayer = (element) => {
            return element.getRoot().isSubmitted() && element.valueChanged();
        }

  }
```

### Adding custom validation error messages
By default, the form have some preset validations:
- **required** (checks the existence)
- **min** (checks if the value is bigger than a given one - works for numbers, text and dates)
- **max** (checks if the value is lower than a given one - works for numbers, text and dates)
- **pattern** (checks if the value matchs a regex)
- **email** (checks if the value is a valid email)
- **equalTo** (checks if the value is equal to some other form element value - e.g password and confirmPassword)

All of these preset validations have an *english basic error message*. If you want to had your own, your you have custom validations:
```jsx
  import React from 'react';
  import {Form, defaultMessageProvider} from 'react-mozer';

  // This will add the custom validation called 'isFoo' and will re-use the default provider
  // ---
  // 'validationName' param is the name of the validation.
  // 'validationOptions' param are the result of that validation: mostly is boolean or object
  // 'element' param is the instance of the ElementHOC - the form element wrapper component
  function customMessageProvider(validationName, validationOptions, element) {
      const label = element.getLabel() || element.getName();

      switch (validationName) {
          case 'isFoo':
              return `The ${label} is not a foo value.`;
          default:
              return defaultMessageProvider(validationName, validationOptions, element);
      }
  }

  class CustomValidationsForm extends React.Component {
        render() {
            return (
                <Form {...this.props} messageProvider={customMessageProvider}>
                    {this.props.children}
                </Form>
            );
        }
  }
```

### License

[The MIT License (MIT)](/LICENSE)
