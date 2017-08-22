import React from 'react';
import PropTypes from 'prop-types';
import Decorator from "./DefaultDecorator";
import ReactDOM from 'react-dom';
import {defaultMessageProvider} from "./utils";

class Form extends React.Component {
    static propTypes = {
        values: PropTypes.object,
        decorator: PropTypes.element,
        messageProvider: PropTypes.func,
        onChange: PropTypes.func,
        onValid: PropTypes.func,
        onInvalid: PropTypes.func,
        onSubmit: PropTypes.func
    };

    static defaultProps = {
        decorator: <Decorator/>,
        messageProvider: defaultMessageProvider
    };

    state = {
        values: this.props.values || {},
        errorMessages: {}
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
     * Validates the form.
     *
     * @return {Promise<boolean>}
     */
    validate() {
        const {validations, values} = this.props;
        const promises = [];

        Object.keys(validations).map(fieldName => {
            (validations[fieldName] || []).map(cb => {
                promises.push(new Promise(resolve => {
                    cb(values[fieldName], this._handleValidationCallback(cb.name, fieldName, resolve), {
                        fieldSetName: name,
                        fieldName,
                        formValues: this.state.values
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
            const nativeElement = ReactDOM.findDOMNode(this.elementReferences[fieldName]);
            if (nativeElement) nativeElement.value = '';
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
        if (this.elementReferences[key]) {
            if (this.elementReferences[key].setValue && this.elementReferences[key].getValue) {
                this.elementReferences[key].setValue(key, value);
                values[key] = this.elementReferences[key].setValue();
                this.setState({values}, this._emitChange);
                return true;
            } else {
                const nativeElement = ReactDOM.findDOMNode(this.elementReferences[key]);
                if (nativeElement) {
                    if (nativeElement.type === 'checkbox') {
                        nativeElement.checked = !!value;
                        values[key] = !!value;
                    } else if (nativeElement.tagName === 'SELECT') {
                        const items = Array.from(nativeElement.children);
                        for (let i=0; i < items.length; i++) {
                            if (items[i].getAttribute('value') === value) {
                                items[i].selected = true;
                                values[key] = value;
                                break;
                            }
                        }
                    } else {
                        nativeElement.value = value;
                        values[key] = value;
                    }


                    this.setState({values}, this._emitChange);
                    return true;
                }
            }
        }

        return false;
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
                const element = React.cloneElement(child, Object.assign({
                    ...child.props,
                    ref: this._setElementReference(child),
                    onChange: this._handleElementChange(child.props.name, child.props)
                }, this._setElementDefaultValue(child)));

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
     * @private
     */
    _handleValidationCallback = (validationName, fieldName, resolve) => (result) => {
        const {messageProvider} = this.props;
        const errorMessages = this.state.errorMessages;
        errorMessages[fieldName] = [];
        console.log(this.elementReferences, fieldName);
        if (!result) {
            errorMessages[fieldName].push(messageProvider(validationName, result, this.elementReferences[fieldName]));
            return this.setState({errorMessages}, () => resolve(false));
        } else if (typeof result === 'object') {
            let valid = true;
            Object.keys(result).map(v => {
                if ((typeof result[v] === 'boolean' && !result[v]) || (result[v].hasOwnProperty('valid') && !result[v].valid)) {
                    errorMessages[fieldName].push(messageProvider(v, result[v], this.elementReferences[fieldName]));
                    valid = false;
                }
            });

            return this.setState({errorMessages}, () => resolve(valid));
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
        const isValid = child && child.props && !!child.props.name;
        if (isValid && child.props.value) {
            this.setState({values: this._setElementValue(child.props.name, child.props.value)})
        }

        return isValid;
    }

    /**
     * Parses and sets element value from the native elements events.
     *
     * @param key
     * @param value
     * @return {Object|{}}
     * @private
     */
    _setElementValue = (key, value) => {
        const {values} = this.state;
        if (value && value.target && value.target.hasOwnProperty('checked')) {
            values[key] = value.target.checked;
        } else if (value && value.target && value.target.options) {
            values[key] = [];
            for (let i = 0; i < value.target.options.length; i++) {
                const option = value.target.options[i];
                option.selected && values[key].push(option.value);
            }
        } else if (value && value.target && value.target.value) {
            values[key] = value.target.value;
        } else {
            values[key] = value && value.length && value.length > 0 ? value : '';
        }

        return values;
    };

    /**
     * Sets Element default value.
     *
     * @param child
     * @private
     */
    _setElementDefaultValue = (child)  => {
        const {values} = this.state;

        if (child.type === 'select' && child.props.multiple) {
            return {
                value: values[child.props.name] ?
                    Array.isArray(values[child.props.name]) ? values[child.props.name] : [values[child.props.name]] :
                    []
            };
        } else if (child.type === 'input' && child.props.type === 'checkbox') {
            return {checked: values[child.props.name] || false};
        } else {
            return {value: values[child.props.name] || ''};
        }
    };

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
        this.setState({values: this._setElementValue(name, value)}, this._emitChange)
    };

    /**
     * Emits that a form element change has occurred.
     *
     * @private
     */
    _emitChange = () => {
        this.props.onChange && this.props.onChange(this.state.values);
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
