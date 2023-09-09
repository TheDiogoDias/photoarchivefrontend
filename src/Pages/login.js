import React, {Component} from 'react';
import {Box, Form, FormField, TextInput, Button, Layer, Text, Spinner, Notification} from 'grommet';

import { Link, useNavigate } from 'react-router-dom';

import User from '../Components/User/user';

import Cookies from 'js-cookie';

class Login extends Component {

    constructor(props){
        super(props);
        this.state = {
            loginFailed: false,
            showLoading: false,
            alertMessage: false,
            username: null,
            password: null
        }

    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value } );
    };

    onSubmit = async (e) => {
        e.preventDefault();
        this.setState({showLoading: true});
        const user = new User(this.state.username, this.state.password);

        try{
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
            }else {
                this.setState({loginFailed: true});
            }
        } catch (error) {
            this.setState({loginFailed: true});
            console.log(error);
        } finally {
            this.setState({showLoading: false});
        }
        

    }

    render(){
        return(
            <>
            {(this.state.loginFailed) && (
                <Notification
                toast
                title="Alert!" 
                message="Login Failed! User does not exist!"
                onClose={()=>{ this.setState({loginFailed: false}); }}/>
            )}
            <Box background="cardDescription" pad="large" style={{borderRadius: "15px"}}>
                <Form onSubmit={this.onSubmit}>
                    <FormField label="Username">
                        <TextInput name="username" onChange={this.onChange} />
                    </FormField>
                    <FormField label="Password">
                        <TextInput name="password" type='password' onChange={this.onChange} />
                    </FormField>
                    <Box direction="row" gap="small" align="center">
                        <Button type="submit" primary label="Login" style={{backgroundColor: "#e9b542", border: "none"}}/>
                        <Link to="/register"><Button type="button" label="Register" style={{backgroundColor: "transparent", color: "#e9b542"}}/></Link>
                    </Box>
                </Form> 
            </Box>
            {this.state.showLoading && (
                <Layer
                >
                <Box pad="large" align="center">
                    <Text>Login, please Wait</Text>
                    <Spinner />
                </Box>
                
                </Layer>
            )}
            </>
        );
    };

}

const LoginWithNavigate = (props) => {
    let navigate = useNavigate();
    return(<Login {...props} navigate={navigate} />);
}


export default LoginWithNavigate;

export {LoginWithNavigate, Login};