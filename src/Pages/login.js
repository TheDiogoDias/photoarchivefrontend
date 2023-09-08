import React, {Component} from 'react';
import {Box, Form, FormField, TextInput, Button} from 'grommet';

import { Link, useNavigate } from 'react-router-dom';

import User from '../Components/User/user';

import Cookies from 'js-cookie';

class Login extends Component {

    constructor(props){
        super(props);
        this.state = {
            username: null,
            password: null
        }

    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value } );
    };

    onSubmit = async (e) => {
        e.preventDefault();

        const user = new User(this.state.username, this.state.password);

        const result = await user.logIn();
        console.log(result);


        if(result){
            const createProfile = await user.checkProfile(result);
            console.log(createProfile);
            if(!createProfile.data) {
                this.props.navigate("/createProfile");
            } else {
                this.props.navigate("/");
                window.location.reload();
            }
        }

    }

    render(){
        return(
            <Box background="cardDescription" pad="large">
                <Form onSubmit={this.onSubmit}>
                    <FormField label="Username">
                        <TextInput name="username" onChange={this.onChange} />
                    </FormField>
                    <FormField label="Password">
                        <TextInput name="password" type='password' onChange={this.onChange} />
                    </FormField>
                    <Box direction="row" gap="small" align="center">
                        <Button type="submit" primary label="Login"/>
                        <Link to="/register"><Button type="button" label="Register"/></Link>
                    </Box>
                </Form>
            </Box>
        );
    };

}

const LoginWithNavigate = (props) => {
    let navigate = useNavigate();
    return(<Login {...props} navigate={navigate} />);
}


export default LoginWithNavigate;

export {LoginWithNavigate, Login};