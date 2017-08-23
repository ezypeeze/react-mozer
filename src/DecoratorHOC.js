import React from 'react';

export default function DecoratorHOC(Component) {
    return class extends React.Component {
        static defaultProps = {
            decorator: true
        };

        render() {
            return (
                <Component {...this.props} />
            );
        }
    };
}
