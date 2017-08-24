import React from 'react';
import PropTypes from 'prop-types';
import ElementHOC from "../ElementHOC";

class Input extends React.Component {

    static propTypes = {
        name: PropTypes.string.isRequired,
        value: PropTypes.any
    };

    render() {
        const {valid, value, onTouch, type, radioValue, ...props} = this.props;

        switch (type) {
            case 'radio':
                return (
                    <input {...props}
                           type={type}
                           onChange={this.handleChange}
                           onFocus={onTouch}
                           value={radioValue}
                           checked={value === radioValue}
                    />
                );
            case 'checkbox':
                return (
                    <input {...props}
                           type={type}
                           onChange={this.handleChange}
                           onFocus={onTouch}
                           checked={!!value}
                    />
                );
            default:
                return (
                    <input {...props}
                           type={type}
                           onChange={this.handleChange}
                           onFocus={onTouch}
                           value={value}
                    />
                );
        }
    }

    handleChange = (event) => {
        if (this.props.onChange) {
            if (this.props.type === 'checkbox') {
                this.props.onChange(event.target.checked);
            } else {
                this.props.onChange(event.target.value);
            }
        }
    };

}

export default ElementHOC(Input);
