import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {DecoratorHOC} from "../src";

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
        const child = children[0] || children;
        const {label, id} = getSpecialAttributes(child, horizontal);

        switch (child.props.type) {
            case 'checkbox':
                return this._renderCheckboxElement(child, label, id);
            case 'radio':
                return this._renderRadioElement(child, label, id);
            default:
                return this._renderGenericElement(child, label, id);
        }
    }

    _renderGenericElement(child, label, id) {
        const {className, errorMessages, horizontal, size} = this.props;

        const children = [
            React.cloneElement(child, {
                ...child.props,
                key: 1,
                id,
                className: cx(child.props.className, 'form-control', `form-control-${size}`, {
                    'is-invalid': errorMessages && errorMessages.length > 0,
                })
            }),
            errorMessages && errorMessages.length > 0 && (
                <div key="2" className="invalid-feedback">
                    {errorMessages.map((message, i) => (
                        <span key={i}>{message} <br/></span>
                    ))}
                </div>
            )
        ];

        return (
            <div className={cx("form-group", className, {row: horizontal})}>
                {label && (
                    <label htmlFor={id} className={cx({"col-sm-2 col-form-label": horizontal})}>{label}</label>
                )}
                {horizontal && (<div className="col-sm-10">{children}</div>)}
                {!horizontal && children}
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
                        id,
                        className: cx(child.props.className, 'form-check-input')
                    })}
                    {label}
                </label>
                {errorMessages && errorMessages.length > 0 && (
                    <div className="invalid-feedback">
                        {errorMessages.map((message, i) => (
                            <span key={i}>{message} <br/></span>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    _renderRadioElement(child, label, id) {
        const {className, errorMessages} = this.props;

        return (
            <label className={cx("custom-control custom-radio", className)}>
                {React.cloneElement(child, {
                    ...child.props,
                    id,
                    className: cx(child.props.className, 'custom-control-input'),
                })}
                <span className="custom-control-indicator" />
                <span className="custom-control-description">{label}</span>
                {errorMessages && errorMessages.length > 0 && (
                    <div className="invalid-feedback">
                        {errorMessages.map((message, i) => (
                            <span key={i}>{message} <br/></span>
                        ))}
                    </div>
                )}
            </label>
        );
    }
}

export default DecoratorHOC(BootstrapDecorator);
