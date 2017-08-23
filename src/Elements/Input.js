import React from 'react';
import PropTypes from 'prop-types';
import ElementHOC from "../ElementHOC";

class Input extends React.Component {

    static propTypes = {
        name: PropTypes.string.isRequired,
        value: PropTypes.any,
        radio: PropTypes.object
    };

    render() {
        const {value, onTouch, type, radio, wrapper, ...props} = this.props;

        if (radio && type === 'radio') {
            return (
                <span>
                    {Object.keys(radio).map((label, i) => {
                        const input = (
                            <input {...props}
                                   type={type}
                                   onChange={this.handleChange}
                                   onFocus={onTouch}
                                   value={radio[label]}
                                   checked={value === radio[label]}
                            />
                        );

                        return (
                            <span key={i}>
                                {wrapper && wrapper(input, label, value)}
                                {!wrapper && input}
                                {!wrapper && label}
                            </span>
                        );
                    })}
                </span>
            )
        }

        return (
            <input {...props}
                   type={type}
                   onChange={this.handleChange}
                   onFocus={onTouch}
                   value={type !== 'checkbox' ? value : undefined}
                   checked={type === 'checkbox' || type === 'radio' ? !!value : false}
            />
        );
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
