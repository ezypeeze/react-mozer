import React from 'react';
import PropTypes from 'prop-types';

export default function ElementHOC(Component) {
    return class extends React.Component {
        static isFormElementHOC = true;
        static displayName = Component.displayName || Component.name || 'ElementComponent';
        static propTypes = {
            label: PropTypes.string,
            onChange: PropTypes.func,
            onTouch: PropTypes.func,
            value: PropTypes.any,
        };

        state = {
            touched: false,
            changed: false
        };

        /**
         * Renders the form element with event handling and some required props.
         *
         * @return {XML}
         */
        render() {
            return (
                <Component
                    {...this.props}
                    onChange={this.handleChange}
                    onTouch={this.handleTouch}
                />
            );
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
            this.setState({touch: true});
            this.props.onTouch && this.props.onTouch();
        };

    };
}
