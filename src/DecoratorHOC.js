import React from 'react';

export default function DecoratorHOC(Component) {
    return class extends React.Component {

        static displayName = 'DecoratorElement';

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

DecoratorHOC.displayName = 'DecoratorElement';
