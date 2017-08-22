import React from 'react';
import ReactDOM from 'react-dom';
import SimpleForm from './simple-form';

class App extends React.Component {
    render() {
        return (
            <div>
                <SimpleForm />
            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
