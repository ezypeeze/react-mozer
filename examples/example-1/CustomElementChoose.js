import React from 'react';
import PropTypes from 'prop-types';
import {ElementHOC} from '../..';

class CustomElementChoose extends React.Component {
    static propTypes = {
        items: PropTypes.arrayOf(String)
    };

    static defaultProps = {
        items: []
    };

    render() {
        return (
            <div className="CustomElementChoose">
                {this.props.label}
                <ul>
                    {this.props.items.map((item, i) => (
                        <li key={i}><a onClick={() => this.props.onChange(item)} onMouseOver={this.props.onTouch}>{item}</a></li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default ElementHOC(CustomElementChoose);
