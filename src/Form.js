import React from 'react';
import PropTypes from 'prop-types';
import ElementHOC from './ElementHOC';
import Decorator from "./DefaultDecorator"
import {defaultMessageProvider} from "./Utility";

class Form extends React.Component {
    static propTypes = {
        decorator: PropTypes.element,
        messageProvider: PropTypes.func,
        onChange: PropTypes.func,
        onInvalid: PropTypes.func,
        onSubmit: PropTypes.func,
        onValid: PropTypes.func,
        validations: PropTypes.object,
        values: PropTypes.object
    };

    static defaultProps = {
        decorator: <Decorator />,
        messageProvider: defaultMessageProvider
    };

    state = {
        errorMessages: {},
        validations: this.props.validations || {},
        values: this.props.values || {},
    };

    elementReferences = {};

    /**
     * The component render method.
     *
     * @return
     */
    render() {
        // Clean up elements references for each re-render.
        this.elementReferences = {};

        return (
            <form onSubmit={this._handleSubmit}>
                {this._lookUpForElements(this.props.children)}
            </form>
        );
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
     * @return {Promise<boolean>}
     */
    validate() {
        const {validations, values} = this.state;
        const promises = [];

        Object.keys(validations).map(fieldName => {
            (validations[fieldName] || []).map(cb => {
                promises.push(new Promise(resolve => {
                    cb(values[fieldName], this._handleValidationCallback(cb.name, fieldName, resolve), {
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
            });
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
     *
     * @param key
     * @param value
     * @return {boolean}
     */
    setValue(key, value) {
        const {values} = this.state;
        if (this.elementReferences[key] && this.elementReferences[key].setValue) {
            values[key] = this.elementReferences[key].setValue(value);
            this.setState({values}, this._emitChange(this.elementReferences[key]));
            return true;
        }

        return false;
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
                    valid: errorMessages && errorMessages[child.props.name] && errorMessages[child.props.name].length > 0,
                    value: this.state.values[child.props.name] || ''
                });

                return appendDecorator ? React.cloneElement(decorator, {
                    ...decorator.props,
                    errorMessages: errorMessages && errorMessages[child.props.name]
                }, element) : element;
            } else if (child && child.props && child.props.children) {
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
     * @param resolve
     * @private
     */
    _handleValidationCallback = (validationName, fieldName, resolve) => (result) => {
        const {messageProvider} = this.props;
        const errorMessages = this.state.errorMessages;
        errorMessages[fieldName] = [];
        if (!result) {
            errorMessages[fieldName].push(messageProvider(validationName, result, this.elementReferences[fieldName]));
            return this.setState({errorMessages, valid: false}, () => resolve(false));
        } else if (typeof result === 'object') {
            let valid = true;
            Object.keys(result).map(v => {
                if ((typeof result[v] === 'boolean' && !result[v]) || (result[v].hasOwnProperty('valid') && !result[v].valid)) {
                    errorMessages[fieldName].push(messageProvider(v, result[v], this.elementReferences[fieldName]));
                    valid = false;
                }
            });

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
        const isValid = child && child.props && !!child.props.name && child.type && child.type.isFormElementHOC;
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
        this.setState({values: Object.assign(this.state.values, {[name]: value})}, this._emitChange(this.elementReferences[name]));
    };

    /**
     * Emits that a form element change has occurred.
     *
     * @private
     */
    _emitChange = (instance) => () => {
        this.props.onChange && this.props.onChange(this.state.values, instance);
    };

    /**
     * Default form submit, which will disable the native form submit handling, validate the data and call onSubmit
     * property callback.
     *
     * @param event
     * @private
     */
    _handleSubmit = (event) => {
        event.preventDefault();
        this.validate().then(valid => this.props.onSubmit && this.props.onSubmit(this.state.values, valid, event));
    }

}

export default Form;
