import React from 'react';
import PropTypes from 'prop-types';
import ElementHOC from "../ElementHOC";

class Input extends React.Component {

    static propTypes = {
        name: PropTypes.string.isRequired,
        disabled: PropTypes.bool,
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
            case 'file':
                return (
                    <input {...props}
                           type={type}
                           onChange={this.handleChange}
                           onFocus={onTouch}
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

    handleChange = ({target}) => {
        const {type, onChange} = this.props;

        if (onChange) {
            if (type === 'checkbox') {
                onChange(target.checked);
            } else if (type === 'file') {
                onChange(target.files);
            } else {
                onChange(target.value);
            }
        }
    };

}

export default ElementHOC(Input);
