import React from 'react';
import PropTypes from 'prop-types';
import Form from "./Form";

export default function ElementHOC(Component) {
    return class extends React.Component {
        static displayName = 'ElementComponent';
        static propTypes = {
            label: PropTypes.string,
            onChange: PropTypes.func,
            onTouch: PropTypes.func,
            value: PropTypes.any,
            root: PropTypes.instanceOf(Form)
        };

        state = {
            touched: false,
            changed: false,
            disabled: this.props.disabled
        };

        /**
         * Renders the form element with event handling and some required props.
         *
         * @return {XML}
         */
        render() {
            const {root, ...props} = this.props;

            return (
                <Component
                    {...props}
                    disabled={this.state.disabled}
                    onChange={this.handleChange}
                    onTouch={this.handleTouch}
                />
            );
        }

        /**
         * Disables the form element.
         */
        disable() {
            !this.state.disabled && this.setState({disabled: true});

            return this;
        }

        /**
         * Enables the form element.
         */
        enable() {
            this.state.disabled && this.setState({disabled: false});

            return this;
        }

        /**
         * Resets the form element to its original state.
         */
        reset() {
            this.setState({
                changed: false,
                touched: false
            }, () => this.handleChange(''));
        }

        /**
         * Sets a value to the form element.
         *
         * @param value
         * @return {string}
         */
        setValue(value) {
            this.setState({value});

            return value;
        }

        /**
         * Gets the current value of the form element.
         *
         * @return {boolean}
         */
        getValue() {
            return this.props.value;
        }

        /**
         * Gets the form element name.
         *
         * @return {string}
         */
        getName() {
            return this.props.name;
        }

        /**
         * Gets the form element label.
         *
         * @return {string}
         */
        getLabel() {
            return this.props.label;
        }

        /**
         * Gets the root component.
         *
         * @return {*}
         */
        getRoot() {
            return this.props.root;
        }

        /**
         * Checks if the form element currently is disabled.
         *
         * @return {boolean}
         */
        isDisabled() {
            return this.state.disabled;
        }

        /**
         * Check if the form element is currently valid.
         *
         * @return {boolean}
         */
        isValid() {
            return this.props.valid;
        }

        /**
         * Checks if the value of form element has been changed since boot.
         *
         * @return {boolean}
         */
        isTouched() {
            return this.state.touched;
        }

        /**
         * Checks if the value of form element has been changed since boot.
         *
         * @return {boolean}
         */
        valueChanged() {
            return this.state.changed;
        }

        /**
         * Handler when the value of the form element is changed.
         */
        handleChange = value => {
            this.setState({changed: true});
            this.props.onChange && this.props.onChange(value);
        };

        /**
         * Handler when a 'touch' event is fired on the form element.
         */
        handleTouch = () => {
            this.setState({touched: true});
            this.props.onTouch && this.props.onTouch();
        };

    };
}
