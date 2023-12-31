import React, {Component} from 'react';

import {Box, Form, FormField, TextInput, Button, Notification, Text, Layer, Spinner} from 'grommet';

import {useNavigate, Link} from 'react-router-dom';

import axios from 'axios';

import User from '../Components/User/user';

class Register extends Component {

    constructor(props){
        super(props);
        this.state = {
            form: {
                showLoading: false,
                email: null,
                name: null,
                username: null,
                password: null,
                confirmPassword: null
            },
            alert: null
        }

    }

    onChange = (e) => {
        this.setState({form :{ ...this.state.form, [e.target.name]: e.target.value }} );
    };

    render(){
        return(
            <>
             {(this.state.alert) && (
                <Notification
                toast
                title="Alert!" 
                message={this.state.alert}
                onClose={()=>{ this.setState({alert: false}); }}/>
            )}
            <Box background="cardDescription" pad="large" style={{borderRadius: "15px"}}>
                <Form onSubmit={async () => {
                    //Cookies.set('name', 'value', { expires: 7 });
                    const exists = false;
                    const user = new User(this.state.form.username, this.state.form.password, this.state.form.confirmPassword, this.state.form.email, this.state.form.name);

                    if(user.isAllFields()) {
                        if(user.isPasswordCorrect()){
                            //insert user
                            this.setState({showLoading: true});

                            try {
                                const email = this.state.form.email;
                                const emailResponse = await axios.get(`https://photoarchive-a1hr.onrender.com/api/users/emailExist?email=${email}`);
                                const username = this.state.form.username;
                                const usernameResponse = await axios.get(`https://photoarchive-a1hr.onrender.com/api/users/usernameExist?username=${username}`);


                                if(!emailResponse.data.exists && !usernameResponse.data.exists){
                                    user.createUser();
                                    this.props.navigate("/");
                                }else{
                                    this.setState({alert: "User already exists!"});
                                }
                              } catch (error) {
                                console.error('Error checking email:', error);
                              } finally {
                                    this.setState({showLoading: false});
                              }
                            
                        } else {
                            //alert message
                            this.setState({alert: "Password don't match!"});
                        }   
                    } else {
                        this.setState({alert: "Fields are empty!"});
                    }
                    

                }}>
                    <FormField label="Email">
                        <TextInput name="email" type="email" placeholder="email@domain.com" onChange={this.onChange}/>
                    </FormField>
                    <FormField label="Name">
                        <TextInput name="name" placeholder="Name Surname" onChange={this.onChange}/>
                    </FormField>
                    <FormField label="Username">
                        <TextInput name="username" placeholder="username" onChange={this.onChange} />
                    </FormField>
                    <FormField label="Password">
                        <TextInput name="password" type="password" onChange={this.onChange}/>
                    </FormField>
                    <FormField label="Confirm Password">
                        <TextInput name="confirmPassword" type="password" onChange={this.onChange} />
                    </FormField>
                    <Box direction="row" gap="small" align="center">
                        <Button type="submit" label="Register"/>
                        <Link to="/login">
                        <Button type="button" primary label="Login" style={{backgroundColor: "#e9b542"}}/>
                        </Link>
                    </Box>
                </Form>
            </Box>
            {this.state.showLoading && (
                <Layer
                >
                <Box pad="large" align="center">
                    <Text>Creating Account!</Text>
                    <Spinner />
                </Box>
                
                </Layer>
            )}
            </>
        );
    };

}

const WithNavigate = (props) => {
    let navigate = useNavigate();
    return(<Register {...props} navigate={navigate} />);
}


export default WithNavigate;
export {WithNavigate, Register};