import React, {Component} from "react";
import {Box, Card, CardHeader, CardBody, CardFooter, Notification, Button, Image, Text, TextInput, FileInput, Form, FormField, RangeInput} from 'grommet';
import axios from 'axios';

import Cookies from 'js-cookie';

class CreateProfile extends Component{
    constructor(props){
        super(props);
        this.state = {
            previewImage: null,
            visibility: null,
            form: {
                user: Cookies.get('user'),
                age: 18,
                timeOfExperience: 1,
                Camera: null,
                Lens: null,
                ProfileImg: null,
            }
        }
    }

    onChange = (e) => {
        this.setState({ form :{ ...this.state.form, [e.target.name]: e.target.value } });
    };

    componentDidUpdate(prevProps, prevState){
        if(prevState.previewImage !== this.state.previewImage){
            
        }
    }

    saveImage = async (image) => {

        try{
            const formData = new FormData();
            formData.append('file', image);
           const response = await axios
            .post('http://localhost:8082/api/photos/saveImage', formData, {
                headers: {
                    'enctype': 'multipart/form-data',
                }
            });
            return response.data.ImageName;
        } catch (error) {
            console.error(error);
            throw new Error('Error saving image');
        }

            
    };

    onSubmit = async (imageName) => {

        const formData = {
            User: this.state.form.user,
            Age: this.state.form.age,
            TimeOfExperience: this.state.form.timeOfExperience,
            Camera: this.state.form.Camera,
            Lens: this.state.form.Lens,
            ProfileImg: imageName,
        }

        if(
            formData.User != null &&
            formData.Age != null &&
            formData.TimeOfExperience != null &&
            formData.Camera != null &&
            formData.Lens != null &&
            formData.ProfileImg != null
        )
        {
            console.log(formData);

            const profileCreated = await axios
            .post('http://localhost:8082/api/photographers/createProfile', formData).then((res) => {
                return true;
            })
            .catch((err) => {
                console.log(err);
            });

            // if(profileCreated){
            //     this.props.navigate("/");
            // }
            
        }
        else
        {
            this.setState({visibility: true});
        }
    }

    render(){
        return(
            <>
            {(this.state.visibility) && (
                <Notification
                toast
                title="Alert!" 
                message="Empty Fields!"
                onClose={()=>{ this.setState({visibility: false}); }}/>
            )}
            <Card>
                <CardHeader pad={{horizontal: "medium", vertical: "medium"}} justify="center" background="cardInfo">
                    <Text>Create Profile</Text>
                    
                </CardHeader>
                <CardBody background="cardDescription">
                    <Box direction="row" >
                            <Box fill pad="large">
                            {(this.state.previewImage == null)? (
                                <FormField label="Profile Image" name="fileName" htmlFor="fileName">
                                    <FileInput 
                                            name="fileName"
                                            id="fileName"
                                            onChange={(event, {files}) => {
                                                const fileList = files;

                                                if(fileList.length === 1){
                                                    this.setState( {previewImage: URL.createObjectURL(fileList[0])})
                                                    this.setState({form: {...this.state.form, ProfileImg: fileList[0]}});
                                                }
                                            }}
                                        />
                                </FormField>
                            ) : (
                                <Image src={this.state.previewImage} />
                            )}
                                

                        </Box>
                        <Box fill pad="large">
                            <Form
        
                            onSubmit={async (e) => {
                                const imageName = await this.saveImage(this.state.form.ProfileImg);
                                this.onSubmit(imageName);
                            }}
                            >
                                <FormField label="Age" name="iso">
                                    <RangeInput 
                                        value={this.state.form.age}
                                        name="age"
                                        onChange={this.onChange}
                                        min="18"
                                        max="100"
                                        step="1"
                                    />
                                    <Text>{this.state.form.age}</Text>
                                </FormField>
                                <FormField label="Time Of Experience" name="timeofExperience">
                                    <RangeInput 
                                        value={this.state.form.timeOfExperience}
                                        name="timeOfExperience"
                                        onChange={this.onChange}
                                        min="1"
                                        max="80"
                                        step="1"
                                    />
                                    <Text>{this.state.form.timeOfExperience} Years</Text>
                                </FormField>
                                <FormField label="Camera" name="Camera">
                                    <TextInput id="text-input-id" name="Camera" onChange={this.onChange}/>
                                </FormField>
                                <FormField label="Lens" name="Lens">
                                    <TextInput id="text-input-id" name="Lens" onChange={this.onChange}/>
                                </FormField>
                                <Button type="submit" primary label="Submit" />
                            </Form>                   
                        </Box>  
                    </Box>
                    
                </CardBody>
                <CardFooter background="cardInfo" pad="small" justify="center">
                    
                </CardFooter>
            </Card>
            </>
        )
    }
}

export default CreateProfile;