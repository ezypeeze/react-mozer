import React from 'react';
import PropTypes from 'prop-types';
import ElementHOC from "../ElementHOC";

class Select extends React.Component {

    static propTypes = {
        name: PropTypes.string.isRequired,
        value: PropTypes.any,
    };

    render() {
        let {valid, value, onTouch, children, ...props} = this.props;
        if (!Array.isArray(value)) value = [value];

        return (
            <select {...props} onChange={this.handleChange} onFocus={onTouch}>
                {children}
            </select>
        );
    }

    handleChange = (event) => {
        if (this.props.onChange) {
            const items = [];
            for (let i = 0; i < event.target.options.length; i++) {
                const option = event.target.options[i];
                option.selected && items.push(option.value);
            }

            this.props.onChange(items);
        }
    };

}

export default ElementHOC(Select);
