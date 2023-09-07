import React, {Component} from "react";
import {Box, Card, CardHeader, CardBody, CardFooter, Notification, Button, Image, Text, TextArea, TextInput, Form, FormField, RangeInput, Layer, Spinner} from 'grommet';
import axios from 'axios';

import {useNavigate} from 'react-router-dom';

import RenderingPostAction from "../Components/PostActions/RenderingPostAction";
import SelectImage from "../Components/Image/Image";

import Cookies from 'js-cookie';

import {LoadScript, Autocomplete, useLoadScript} from '@react-google-maps/api';

class CreatePost extends Component {

    constructor(props){
        super(props);
        this.state = {
            place: null,
            file: null,
            image: null,
            createPost: null,
            visibility: false,
            showLoading: false,
            form: {
                placeName: "",
                geolocation: "",
                title: "",
                description: "",
                iso: "500",
                aperture: "4.0",
                focalLength: "50",
                fileName: "",
            }
        }

        this.enableCreatePost = this.enableCreatePost.bind(this);
        this.disableCreatePost = this.disableCreatePost.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleImageValue = this.handleImageValue.bind(this);
        this.handleFormIsoValue = this.handleFormIsoValue.bind(this);
        this.handleFormApertureValue = this.handleFormApertureValue.bind(this);
        this.handleFormFocalLengthValue = this.handleFormFocalLengthValue.bind(this);
        this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
    }

    handlePlaceSelect(place) {
        this.setState({place});
    }

    handleFileChange(value){
        console.log(value);
        this.setState({file: value});
    }

    handleImageValue(value){
        this.setState({image: value});
    }

    handleFormIsoValue(value){
        this.setState(prevState => {
            let form = Object.assign({}, prevState.form);
            form.iso = value;
            return { form }
        });
    }

    handleFormApertureValue(value){
        this.setState(prevState => {
            let form = Object.assign({}, prevState.form);
            form.aperture = value;
            return { form }
        });
    }

    handleFormFocalLengthValue(value){
        this.setState(prevState => {
            let form = Object.assign({}, prevState.form);
            form.focalLength = value;
            return { form }
        });
    }

    enableCreatePost(){
        this.setState({createPost: true});
    }

    disableCreatePost(){
        this.setState({file: null});
    }

    enableCreatePostEdit(){
        this.setState({file: true});
    }

    isJPEG() {
        if(this.state.image !== null){
            const image = this.state.image;
            return (image.type === 'image/jpeg') ? true : false;
        }
    }

    onChange = (e) => {
        this.setState({ form :{ ...this.state.form, [e.target.name]: e.target.value } });
    };
      
    saveImage = async (image) => {

        try{
            const formData = new FormData();
            formData.append('image', image);
           const response = await axios
            .post('https://photoarchive-a1hr.onrender.com/api/photos/saveImage', formData, {
                headers: {
                    'enctype': 'multipart/form-data',
                }
            });
            this.setState({form: Object.assign({}, this.state.form, {fileName: response.data.ImageName})});
            return response.data.ImageName;
        } catch (error) {
            console.error(error);
            throw new Error('Error saving image');
        }

            
    };
    
    async onSubmit(e, post) {
        e.preventDefault();
        
        if(post.state.form.title !== "" && post.state.form.description !== "" && post.state.form.geolocation !== "" && post.state.form.place !== "") {
            this.setState({showLoading: true});

            const imageName = await this.saveImage(post.state.image);

            const user = Cookies.get('user');
        
            const formData = {
                placeName: this.state.form.placeName,
                geolocation: this.state.form.geolocation,
                author: user,
                title: post.state.form.title,
                description: post.state.form.description,
                iso: post.state.form.iso.toString(),
                aperture: post.state.form.aperture.toString(),
                focalLength: post.state.form.focalLength.toString(),
                fileName: imageName,
                publishDate: Date.now().toString(),
            }

            console.log(formData);

            try{
                await axios
                .post('https://photoarchive-a1hr.onrender.com/api/photos', formData).then((res) => {
                    post.setState({form: {
                        title: "",
                        description: "",
                        iso: "",
                        aperture: "",
                        focalLength: "",
                        fileName: post.state.file,
                    }});
                    post.props.navigate("/");
                });
                console.log("Done");

            } catch(error) {
                console.log(error);
            } finally {
                console.log("Done Finally");
                this.setState({showLoading: false});
            }
        } else {
            post.setState({visibility: true});
        }
        


        
    }

    render() {
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
                    <Text>Create Post</Text>
                    
                </CardHeader>
                <CardBody background="cardDescription">
                    <Box fill align="center" justify="start">
                        {   
                            (this.state.file == null && this.state.createPost == null) && (
                                <Box width="medium" height="large" justify="center">
    
                                    <Form>
                                        <FormField label="Image" name="fileName" htmlFor="fileName">
                                            <SelectImage onFileChange={this.handleFileChange} onImageChange={this.handleImageValue} onIsoChange={this.handleFormIsoValue} onApertureChange={this.handleFormApertureValue} onFocalLenghtChange={this.handleFormFocalLengthValue} />
                                        </FormField> 
                                    </Form>
                                                            
                                </Box>
                            )                  
                        }
                        {
                            (this.state.file != null && this.state.createPost == null) && (
                            
                                (this.isJPEG()) ? (<Image src={this.state.file} alt="Image" fit="contain" width="500px" />) : (<p>Not valid Jpeg Image</p>)
                            
                            )
                        }
                        {
                            (this.state.file && this.state.createPost) && (
                            <Box direction="row">
                                <Box align="center" justify="center">
                                    <Image src={this.state.file} width="600px" fit="cover"/>
                                </Box>
                                <Box pad="large">
                                    <Form
    
                                    onSubmit={(e) => {
                                       
                                        this.onSubmit(e,this);
                                    
                                    }}
                                    >
                                        <FormField label="Geolocation" name="geolocation">
                                            <LoadScript googleMapsApiKey='AIzaSyATR-YA9XyJNyO7mj0iZDjeYQTZQwuv8LI' libraries={['places']}>
                                                <Autocomplete
                                                    onLoad={this.handlePlaceSelect}
                                                    onPlaceChanged={() => {
                                                        
                                                        if(this.state.place != null) {
                                                            
                                                            const searchResult = this.state.place;
                                                            const place = searchResult.getPlace();
                                                            const placeName = place.name;
                                                            const placeUrl = place.url;

                                                            this.setState({form: {...this.state.form, geolocation: placeUrl, placeName: placeName}});
                                                        }
                                                    }}
                                                >
                                                    <TextInput />
                                                </Autocomplete>
                                            </LoadScript>
                                        </FormField>                                        
                                        <FormField label="Image Title" name="image">
                                            <TextInput id="text-input-id" name="title" onChange={this.onChange}/>
                                        </FormField>
                                        <FormField label="Description" name="description">
                                            <TextArea  id="text-input-id" name="description" onChange={this.onChange}/>
                                        </FormField>
                                        <FormField label="ISO" name="iso">
                                            <RangeInput 
                                                value={this.state.form.iso}
                                                name="iso"
                                                onChange={this.onChange}
                                                min="100"
                                                max="10000"
                                                step="50"

                                                disabled={() => {
                                                    if(this.state.form.iso !== "500") return true;
                                                }}
                                            />
                                            <Text>{this.state.form.iso}</Text>
                                        </FormField>
                                        <FormField label="Aperture" name="aperture">
                                            <RangeInput 
                                                value={this.state.form.aperture}
                                                name="aperture"
                                                onChange={this.onChange}
                                                min="0.5"
                                                max="17"
                                                step="0.1"

                                                disabled={() => {
                                                    if(this.state.form.aperture !== "4.0") return true;
                                                }}
                                            />
                                            <Text>{this.state.form.aperture}</Text>
                                        </FormField>
                                        <FormField label="FocalLength" name="focalLength">
                                            <RangeInput 
                                                value={this.state.form.focalLength}
                                                name="focalLength"
                                                onChange={this.onChange}
                                                min="10"
                                                max="700"
                                                step="10"

                                                disabled={() => {
                                                    if(this.state.form.focalLength !== "50") return true;
                                                }}
                                            />
                                            <Text>{this.state.form.focalLength}</Text>
                                        </FormField>
                                        <Button type="submit" primary label="Submit" />
                                    </Form>
                                </Box>
                            </Box>
                            )
                        }
                    </Box>
                </CardBody>
                <CardFooter background="cardInfo" pad="small" justify="center">
    
                    <RenderingPostAction file={this.state.file} createPost={this.state.createPost} enablePost={this.enableCreatePost} disablePost={this.disableCreatePost} show={this.isJPEG()} />
                    
                </CardFooter>
            </Card>
            {this.state.showLoading && (
                <Layer
                >
                <Box pad="large" align="center">
                    <Text>Uploading Post! Please Await</Text>
                    <Spinner />
                </Box>
                
                </Layer>
            )}
            </>
        );
    }
    
}

const WithNavigate = (props) => {
    let navigate = useNavigate();
    return(<CreatePost {...props} navigate={navigate} />);
}


export default WithNavigate;
export {WithNavigate, CreatePost};

