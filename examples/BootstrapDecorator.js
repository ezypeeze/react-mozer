import React from 'react';
import PropTypes from 'prop-types';
import {DecoratorHOC} from "../index";
import cx from 'classnames';

let lastId = 0;

function getSpecialAttributes(child, forceLabel = false) {
    let label, id;
    if (child.props.label || forceLabel) {
        label = child.props.label || child.props.name;
        id = child.props.id ? child.props.id : `${label}:${lastId}`;
        lastId++;
    }

    return {label, id};
}

class BootstrapDecorator extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        errorMessages: PropTypes.arrayOf(String),
        size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
        horizontal: PropTypes.bool
    };

    static defaultProps = {
        size: 'md',
        horizontal: false
    };

    render() {
        const {horizontal, children} = this.props;

        return (
            <div>
                {React.Children.map(children, (child) => {
                    const {label, id} = getSpecialAttributes(child, horizontal);

                    switch (child.props.type) {
                        case 'checkbox':
                            return this._renderCheckboxElement(child, label, id);
                        default:
                            return this._renderGenericElement(child, label, id);
                    }
                })}
            </div>
        );
    }

    _renderGenericElement(child, label, id) {
        const {className, errorMessages, horizontal, size} = this.props;

        return (
            <div className={cx("form-group", className, {
                "has-danger": errorMessages && errorMessages.length > 0,
                row: horizontal
            })}>
                {label && (
                    <label htmlFor={id} className={cx({"col-sm-2 col-form-label": horizontal})}>{label}</label>
                )}
                <div className={cx({"col-sm-10": horizontal})}>
                    {React.cloneElement(child, {
                        ...child.props,
                        label: undefined,
                        id,
                        className: cx(child.props.className, 'form-control', `form-control-${size}`)
                    })}
                    {errorMessages && errorMessages.length > 0 && (
                        <div className="form-control-feedback">
                            {errorMessages.map((message, i) => (
                                <span key={i}>{message.replace('{label}', label)} <br/></span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    _renderCheckboxElement(child, label, id) {
        const {className, errorMessages} = this.props;

        return (
            <div className={cx("form-check", className, {"has-danger": errorMessages && errorMessages.length > 0})}>
                <label className="form-check-label">
                    {React.cloneElement(child, {
                        ...child.props,
                        label: undefined,
                        id,
                        className: cx(child.props.className, 'form-check-input')
                    })}
                    {label}
                </label>
                {errorMessages && errorMessages.length > 0 && (
                    <div className="form-control-feedback">
                        {errorMessages.map((message, i) => (
                            <span key={i}>{message.replace('{label}', label)} <br/></span>
                        ))}
                    </div>
                )}
            </div>
        );
    }
}

export default DecoratorHOC(BootstrapDecorator);
