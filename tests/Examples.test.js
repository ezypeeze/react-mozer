import React from 'react';
import ReactDOM from 'react-dom';
import Example1 from '../examples/example-1';

it('Example 1 Form renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Example1 />, div);
});
