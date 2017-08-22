import React from 'react';
import {Form, DefaultDecorator, Validators} from '../../index';
import BootstrapDecorator from '../BootstrapDecorator';

class SimpleForm extends React.Component {
    static propTypes = {};
    static defaultProps = {};
    state = {
        values: {
            firstname: 'Pedro',
            terms: true,
            country: 'spain'
        },
        validations: {
            address: [Validators.required()]
        }
    };

    render() {
        const {values, validations, valid} = this.state;

        return (
            <div className="container">
                <h3>Simple Form</h3>
                {typeof valid === 'boolean' && (<pre>Is form valid: {valid ? 'yes' : 'no'}</pre>)}
                <pre>{JSON.stringify(values)}</pre>
                <Form ref="form"
                      onSubmit={this._handleSubmit}
                      onChange={this._handleChange}
                      values={values}
                      validations={validations}
                      decorator={<BootstrapDecorator size="sm" horizontal={true}/>}
                >
                    <div className="row">
                        <div className="col">
                            <input label="First Name" type="text" name="firstname"/>
                        </div>
                        <div className="col">
                            <DefaultDecorator>
                                <input label="Last Name" type="text" name="lastname"/>
                            </DefaultDecorator>
                        </div>
                    </div>
                    <div>
                        <input label="Address" type="text" name="address"/>
                    </div>

                    <select name="country" multiple>
                        <option value="portugal">Portugal</option>
                        <option value="spain">Spain</option>
                        <option value="england">England</option>
                    </select>

                    <input type="checkbox" name="terms"/>

                    <button type="submit">Submit</button>
                </Form>


                <div style={{marginTop: '30px'}}>
                    key:
                    <input type="text" onChange={event => this.setState({key: event.target.value})} name="key"/>

                    value:
                    <input type="text" onChange={event => this.setState({value: event.target.value})} name="value"/>

                    <button type="button" onClick={() => this.refs.form.setValue(this.state.key, this.state.value)}>
                        Change
                    </button>
                </div>
            </div>
        );
    }

    _handleChange = (values) => {
        this.setState({values});
    };

    _handleSubmit = (values, valid) => {
        this.setState({values, valid});
    };
}

export default SimpleForm;
