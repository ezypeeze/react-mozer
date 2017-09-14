import React from 'react';
import ReactDOM from 'react-dom';
import ExampleOneForm from './example-1';
import ExampleTwoForm from "./example-2";

class App extends React.Component {
    render() {
        return (
            <div>
                <ExampleOneForm />
                <br />
                <br />
                <br />
                <ExampleTwoForm/>
            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
