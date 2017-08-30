import React from 'react';
import PropTypes from 'prop-types';
import ElementHOC from "../ElementHOC";

class TextArea extends React.Component {

    static propTypes = {
        name: PropTypes.string.isRequired,
        disabled: PropTypes.bool,
        value: PropTypes.any
    };

    render() {
        const {valid, value, onTouch, ...props} = this.props;

        return (
            <textarea {...props} onChange={this.handleChange} onFocus={onTouch} value={value} />
        )
    }

    handleChange = ({target}) => {
        const {onChange} = this.props;

        onChange && onChange(target.value);
    };

}

export default ElementHOC(TextArea);
