import React from 'react';
import PropTypes from 'prop-types';
import ElementHOC from './ElementHOC';
import Decorator from "./DefaultDecorator"
import {defaultMessageProvider} from "./Utility";

class Form extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        decorator: PropTypes.element,
        messageProvider: PropTypes.func,
        onChange: PropTypes.func,
        onSubmit: PropTypes.func,
        onValid: PropTypes.func,
        onInvalid: PropTypes.func,
        displayErrorsCondition: PropTypes.func,
        validations: PropTypes.object,
        defaultValues: PropTypes.object,
        values: PropTypes.object,
        submitOnlyOnValid: PropTypes.bool,
        disableSubmitOnEnter: PropTypes.bool,
    };

    static defaultProps = {
        decorator: <Decorator/>,
        messageProvider: defaultMessageProvider,
        submitOnlyOnValid: false
    };

    state = {
        errorMessages: {},
        validations: this.props.validations || {},
        values: this.props.defaultValues || this.props.values || {},
        submitted: false
    };

    /**
     * Form Element References
     */
    elementReferences = {};

    /**
     * After first mounting render, we will validate the data without showing error messages.
     */
    componentDidMount() {
        this.validate(false);
    }

    componentWillMount() {
        if (this.props.values && this.props.defaultValues) {
            throw new Error('Either use "values" or "defaultValues" property. You cant use both.');
        }

        if (this.props.values && !this.props.onChange) {
            throw new Error('You must use "onChange" with "values" property when you are using controlled state.');
        }
    }

    /**
     * If initial props changes, then we must set the new props.
     * @param newProps
     */
    componentWillReceiveProps(newProps) {
        if (newProps.values && newProps.defaultValues) {
            throw new Error('Either use "values" or "defaultValues" property. You cant use both.');
        }

        if (newProps.values && !newProps.onChange) {
            throw new Error('You must use "onChange" with "values" property when you are using controlled state.');
        }

        newProps.values && this.setState({values: newProps.values});
    }

    /**
     * The component render method.
     *
     * @return
     */
    render() {
        const {onSubmit, className, children} = this.props,
            formContainer = !!onSubmit;

        // Clean up elements references for each re-render.
        this.elementReferences = {};

        return formContainer ? (
            <form className={className} onKeyPress={this._handleKeyPress} onSubmit={this._handleSubmit}>
                {this._lookUpForElements(children)}
            </form>
        ) : (
            <div className={className}>
                {this._lookUpForElements(children)}
            </div>
        );
    }

    /**
     * Performs a manual submit.
     */
    submit() {
        return this._handleSubmit();
    }

    /**
     * Check if the form was already submitted.
     *
     * @return {boolean}
     */
    isSubmitted() {
        return this.state.submitted;
    }

    /**
     * Check if the form is currently valid.
     *
     * @return {boolean}
     */
    isValid() {
        return this.state.valid;
    }

    /**
     * Gets a form element by name.
     *
     * @param name
     * @return {./ElementHOC}
     */
    get(name) {
        return this.elementReferences[name];
    }

    /**
     * Validates the form.
     *
     * @param displayErrors
     *
     * @return {Promise<boolean>}
     */
    validate(displayErrors = true) {
        const {validations, values} = this.state;
        const promises = [];

        // Clean all messages since we are validating everything.
        this.state.errorMessages = {};
        Object.keys(validations).map(fieldName => {
            const displayFieldErrors = displayErrors ?
                this.props.displayErrorsCondition ?
                    this.props.displayErrorsCondition(this.elementReferences[fieldName]) : true
                :
                false;

            (validations[fieldName] || []).map(cb => {
                promises.push(new Promise(resolve => {
                    cb(values[fieldName], this._handleValidationCallback(cb.name, fieldName, displayFieldErrors, resolve), {
                        name: fieldName,
                        component: this.elementReferences[fieldName],
                        root: this
                    });
                }));
            });
        });

        return Promise.all(promises)
            .then(valid => {
                return valid.filter(result => !result).length === 0;
            })
            .then(valid => new Promise(resolve => {
                this.setState({valid}, () => resolve(valid));
            }))
    }

    /**
     * Resets the form input values and validations.
     */
    reset() {
        Object.keys(this.elementReferences).map(fieldName => {
            this.elementReferences[fieldName].reset && this.elementReferences[fieldName].reset();
        });

        this.setState({errorMessages: {}});
    }

    /**
     * Gets a form element value if key is present. Gets all form values otherwise.
     *
     * @param key
     * @return {string|boolean|array}
     */
    getValue(key) {
        return key && this.values[key] || this.values;
    }

    /**
     * Sets a value in a form element, both in data value object and in native element.
     * Only will execute if form is with uncontrolled state.
     *
     * @param key
     * @param value
     * @return {boolean}
     */
    setValue(key, value) {
        const {values} = this.state;
        if (this.elementReferences[key] && this.elementReferences[key].setValue && !this.props.onChange) {
            values[key] = this.elementReferences[key].setValue(value);
            this.setState({values}, this._emitChange(this.elementReferences[key], values));
            return true;
        }

        return false;
    }

    /**
     * Sets custom error messages to the form elements.
     *
     * @param errorMessages
     * @return {Form}
     */
    setErrorMessages(errorMessages) {
        this.setState({errorMessages});

        return this;
    }

    /**
     * Cleans all error messages. If name is present, cleans error messages for the form element with that name.
     *
     * @param name
     * @return {Form}
     */
    cleanErrorMessages(name) {
        let errorMessages = this.state.errorMessages;
        if (name && errorMessages[name]) delete errorMessages[name];
        else errorMessages = {};

        this.setState({errorMessages});

        return this;
    }

    /**
     * Sets validations of a form element (newValidations must be an array).
     * If key is not present, cleans and sets new validations to all form elements (newValidations must be an object of arrays).
     *
     * @param key
     * @param newValidations
     */
    setValidations(key, newValidations) {
        const {validations} = this.state;
        let state = key && validations ?
            {validations: Object.assign(validations, {[key]: newValidations})} : {validations: newValidations};

        this.setState(state);
    }

    /**
     * Cleans validations of a form element.
     * If key is not present, clean all validations of all form elements.
     *
     * @param key
     */
    cleanValidations(key) {
        const {validations} = this.state;
        let state = key && validations && validations[key] ?
            {validations: Object.assign(validations, {[key]: []})} : {validations: {}};

        this.setState(state);
    }

    /**
     * Looks Up for form elements and binds events, sets parent decoration with possible error messages, recursively.
     *
     * @param children
     * @param appendDecorator
     * @return {*}
     * @private
     */
    _lookUpForElements(children, appendDecorator = true) {
        const {decorator} = this.props;
        const {errorMessages} = this.state;

        return React.Children.map(children, (child) => {
            if (this._isValidElement(child)) {
                const element = React.cloneElement(child, {
                    ...child.props,
                    onChange: this._handleElementChange(child.props.name, child.props),
                    ref: this._setElementReference(child),
                    root: this,
                    valid: errorMessages && errorMessages[child.props.name] && errorMessages[child.props.name].length > 0,
                    value: this.state.values[child.props.name] || ''
                });

                return appendDecorator ? React.cloneElement(decorator, {
                    ...decorator.props,
                    errorMessages: errorMessages && errorMessages[child.props.name]
                }, element) : element;
            } else if (child && child.props && child.props.children && child.type !== Form) {
                return React.cloneElement(child, {...child.props}, this._lookUpForElements(child.props.children, !child.props.decorator));
            }

            return child;
        });
    }

    /**
     * Handles the validation result and sets possible error messages.
     *
     * @param validationName
     * @param fieldName
     * @param displayErrors
     * @param resolve
     * @private
     */
    _handleValidationCallback = (validationName, fieldName, displayErrors, resolve) => (result) => {
        const {messageProvider} = this.props;
        const errorMessages = this.state.errorMessages;

        errorMessages[fieldName] = [];
        if (!result) {
            if (!displayErrors) return resolve(false);
            errorMessages[fieldName].push(messageProvider(validationName, result, this.elementReferences[fieldName]));

            return this.setState({errorMessages, valid: false}, () => resolve(false));
        } else if (typeof result === 'object') {
            let valid = true;
            Object.keys(result).map(v => {
                if ((typeof result[v] === 'boolean' && !result[v]) || (result[v].hasOwnProperty('valid') && !result[v].valid)) {
                    displayErrors && errorMessages[fieldName].push(messageProvider(v, result[v], this.elementReferences[fieldName]));
                    valid = false;
                }
            });

            if (!displayErrors) return resolve(valid);

            return this.setState({errorMessages, valid}, () => resolve(valid));
        }

        return resolve(true);
    };

    /**
     * Checks if a given object is a valid form element.
     *
     * @param child
     * @return {boolean}
     * @private
     */
    _isValidElement(child) {
        const isValid = child && child.props && !!child.props.name && child.type && child.type.displayName === 'ElementComponent';
        if (isValid && child.props.value) {
            this.setState({values: Object.assign(this.state.values, {[child.props.name]: child.props.value})});
        }

        return isValid;
    }

    /**
     * Sets Element mounted component reference. This will be used to "cache" elements, for faster dom tree discovering.
     *
     * @param child
     * @private
     */
    _setElementReference = (child) => reference => {
        if (child && child.props && child.props.name) {
            this.elementReferences[child.props.name] = reference;
        }
    };

    /**
     * Handles a form element change.
     *
     * @param name
     * @param childProps
     * @private
     */
    _handleElementChange = (name, childProps) => (value) => {
        const values = Object.assign({}, this.state.values, {[name]: value});
        if (!this.props.values) {
            this.setState({values}, this._emitChange(this.elementReferences[name], this.state.values));
        } else {
            this._emitChange(this.elementReferences[name], values)();
        }
    };

    /**
     * Emits that a form element change has occurred.
     *
     * @private
     */
    _emitChange = (instance, values) => () => {
        if (!this.props.onSubmit && this.props.onChange) {
            return this.validate()
                .then(valid => {
                    this.setState({valid}, () => {
                        this.props.onChange && this.props.onChange(values, instance);
                    });
                });
        }

        this.props.onChange && this.props.onChange(values, instance);
    };

    /**
     * Handles key press on form.
     * If property 'disableSubmitOnEnter' is active, will disable submission on enter.
     *
     * @param event
     * @private
     */
    _handleKeyPress = (event) => {
        if (this.props.disableSubmitOnEnter && event.which === 13 && event.target.tagName !== 'TEXTAREA') {
            event.preventDefault();
        }
    };

    /**
     * Default form submit, which will disable the native form submit handling, validate the data and call onSubmit
     * property callback.
     *
     * @param event
     * @private
     */
    _handleSubmit = (event) => {
        event && event.preventDefault();
        this.setState({submitted: true}, () => {
            this.validate()
                .then(valid => {
                    this.setState({valid}, () => {
                        if (!this.props.submitOnlyOnValid || (this.props.submitOnlyOnValid && valid)) {
                            this.props.onSubmit && this.props.onSubmit(this.state.values, valid, this)
                        }
                    });
                });
        });
    }

}

export default Form;
