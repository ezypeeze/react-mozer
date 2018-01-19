import React from 'react';
import {Form, DefaultDecorator, Validators, Input, Select, TextArea} from '../../src/index';
import BootstrapDecorator from '../BootstrapDecorator';
import CustomElementChoose from "./CustomElementChoose";

class ExampleOneForm extends React.Component {
    static propTypes = {};
    static defaultProps = {};
    state = {
        values: {},
        validations: {
            address: [Validators.required()],
            email: [Validators.email()],
            gender: [Validators.required()],
            passwordConfirmation: [Validators.equalTo('password')]
        }
    };

    componentDidMount() {
        setTimeout(() => this.setState({
            values: {
                firstname: 'Pedro',
                terms: true,
                country: 'spain'
            }
        }), 1000);
    }

    render() {
        const {values, validations, valid} = this.state;

        return (
            <div className="container">
                <h3>Example One Form</h3>
                <hr />
                {typeof valid === 'boolean' && (<pre>Is form valid: {valid ? 'yes' : 'no'}</pre>)}
                <pre>{JSON.stringify(values)}</pre>
                <Form ref="form"
                      onSubmit={this._handleSubmit}
                      validations={validations}
                      decorator={<BootstrapDecorator size="sm" horizontal={true}/>}
                      defaultValues={{number: 0}}
                      submitOnlyOnValid={false}
                      disableSubmitOnEnter
                >
                    <div className="row">
                        <div className="col">
                            <Input label="First Name" type="text" name="firstname"/>
                        </div>
                        <div className="col">
                            <DefaultDecorator>
                                <Input label="Last Name" type="text" name="lastname"/>
                            </DefaultDecorator>
                        </div>
                    </div>

                    <TextArea label="Description" name="description" />
                    <Input label="Email" type="text" name="email" />
                    <Input label="Number" type="number" name="number" />

                    <div>
                        <Input label="Address" type="text" name="address"/>
                    </div>

                    <Select name="country" multiple>
                        <option value="portugal">Portugal</option>
                        <option value="spain">Spain</option>
                        <option value="england">England</option>
                    </Select>

                    <CustomElementChoose name="choose" items={['first', 'second', 'third']}/>

                    <h4>Gender</h4>
                    <Input label="Male" type="radio" name="gender" radioValue="male"/>
                    <Input label="Female" type="radio" name="gender" radioValue="female"/>
                    <Input label="Both" type="radio" name="gender" radioValue="both"/>

                    <Input type="checkbox" name="terms"/>

                    <Input label="Password" type="text" name="password" />

                    <Input label="Confirm Password" type="text" name="passwordConfirmation" />

                    <Input label="Image" type="file" name="image" />

                    <TextArea label="About me" name="aboutMe" />

                    <button type="submit">Submit</button>
                </Form>

                <button type="button" onClick={() => this.refs.form.submit()}>
                    Manual Submit
                </button>


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

    _handleValidationLogic = (element) => {
        return element.getRoot().isSubmitted();
    };

    _handleChange = (values, element) => {
        if (element.getName() === 'lastname') {
            if (element.getValue()) {
                this.refs.form.setValidations('firstname', [Validators.required()]);
                this.refs.form.get('firstname').disable();
            } else {
                this.refs.form.cleanValidations('firstname');
                this.refs.form.get('firstname').enable();
            }
        }

        this.setState({values}, () => {
            this.refs.form.validate().then(valid => this.setState({valid}));
        });
    };

    _handleSubmit = (values, valid) => {
        alert('Form submit, valid:' + valid ? 'yes' : 'no');
    }
}

export default ExampleOneForm;
