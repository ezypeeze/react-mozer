import React from 'react';
import {Form, DefaultDecorator, Validators, Input} from '../../src/index';
import BootstrapDecorator from '../BootstrapDecorator';

class ExampleTwoForm extends React.Component {
    state = {
        values: {
            firstname: 'test'
        },
        validations: {
            firstname: [Validators.required()],
            email: [Validators.required(), Validators.email()],
        }
    };

    render() {
        const {values, shouldDisable, validations, valid} = this.state;

        return (
            <div className="container">
                <h3>Example Two Form</h3>
                <hr />
                {typeof valid === 'boolean' && (<pre>Is form valid: {valid ? 'yes' : 'no'}</pre>)}
                <pre>{JSON.stringify(values)}</pre>
                <Form values={values}
                      onChange={this._handleChange}
                      validations={validations}
                      decorator={<BootstrapDecorator size="sm" horizontal={true}/>}
                      displayErrorsCondition={this.handleDisplayErrorsCondition}
                >
                    <div className="row">
                        <div className="col">
                            <Input label="First Name" type="text" name="firstname" disabled={shouldDisable}/>
                        </div>
                        <div className="col">
                            <DefaultDecorator>
                                <Input label="Last Name" type="text" name="lastname"/>
                            </DefaultDecorator>
                        </div>
                    </div>

                    <Input label="Email" type="text" name="email" />

                    <button type="submit">Submit</button>
                </Form>
            </div>
        );
    }

    handleDisplayErrorsCondition = (element) => {
        return element.valueChanged();
    };

    _handleChange = (values, element) => {
        this.setState({values, valid: element.getRoot().isValid(), shouldDisable: !this.state.shouldDisable});
    };

}

export default ExampleTwoForm;
