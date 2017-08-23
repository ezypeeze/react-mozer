import React from 'react';
import PropTypes from 'prop-types';
import DecoratorHOC from "./DecoratorHOC";

/**
 * The default decorator which only takes care of the error messages.
 */
class DefaultDecorator extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        errorMessages: PropTypes.arrayOf(String)
    };

    render() {
        const {className, errorMessages, children} = this.props;

        return (
            <div className={className}>
                {children}
                {(errorMessages || []).map((message, i) => (
                    <span key={i} className="error-message">{message}<br /></span>
                ))}
            </div>
        );
    }
}

export default DecoratorHOC(DefaultDecorator);
