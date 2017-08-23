import React from 'react';
import ReactDOM from 'react-dom';
import ExampleOneForm from './example-1';

class App extends React.Component {
    render() {
        return (
            <div>
                <ExampleOneForm />
            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
