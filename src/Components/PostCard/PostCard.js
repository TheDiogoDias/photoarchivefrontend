import React, { useEffect, useState } from "react";
import {Box, Card, CardHeader, CardBody, Text, Button, Image, Layer, DropButton, Spinner, ResponsiveContext} from "grommet";

import { Location, FormClose } from 'grommet-icons';

import { Link, useNavigate } from 'react-router-dom';

import Cookies from 'js-cookie';

import axios from 'axios';

const PostCard = (props) => {
    const [imageUrl, setImageUrl] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [show, setShow] = useState();
    const [showDelete, setShowDelete] = useState();
    const [showLoading, setShowLoading] = useState();
    
    const size = React.useContext(ResponsiveContext);

    useEffect(() => {
        const fetchImage = async () => {
            const internetSpeed = Cookies.get('internetSpeed');
            console.log(internetSpeed);
            if(internetSpeed){
                const response = await fetch(`https://photoarchive-a1hr.onrender.com/api/photos/uploads/${props.imageName}/${internetSpeed}`);
                const blob = await response.blob();
                setImageUrl(URL.createObjectURL(blob));
            }
        };
        fetchImage();
    }, [props.imageName]);

    useEffect(() => {
        const fetchImage = async () => {
            const internetSpeed = Cookies.get('internetSpeed');
            if(internetSpeed){
                const response = await fetch(`https://photoarchive-a1hr.onrender.com/api/photos/uploadsProfileImg/${props.profileImg}/${internetSpeed}`);
                const blob = await response.blob();
                setProfileImageUrl(URL.createObjectURL(blob));
            }
        };
        fetchImage();
    }, [props.profileImage]);

    function goHome(){
        props.navigate("/");
    }

    const handleClose = () => {
        setShow(false);
        console.log(show);
      }
    
    return(
        <>
            {(props.geolocation && props.placeName) && (
                <Box style={{
                        position: "relative",
                        top: "10vh",
                        left: "2vw",
                        display: "inline-flex",
                        width: "200px",
                        padding: "10px",
                        borderRadius: "8px",
                        backgroundColor: "#2121218f"
                }} 
                    direction="row"
                    gap="small"
                    alignContent="center"
                >
                    <Location width="5px" />
                    <Button href={props.geolocation} size="small" target="_blank" ><Text size={(size !== "large")&&(size)} color="headerTitle" weight="bold">{props.placeName}</Text></Button>
                </Box>
            )}
            
            <Card style={(props.author)&&{marginTop: "-40px"}} >
                <CardHeader   background="cardInfo" pad={{horizontal: "medium"}} >
                    <Box 
                        direction="row"
                        gap="small"
                        maxWidth="small"
                        pad={{vertical: "small", horizontal: "small"}}
                        align="center"
                    >
                        <Button justify="center">
                            <Box direction="row" align="center">
                            <Box
                                direction="row"
                                align="center"
                                gap="small" 
                                pad={{horizontal: "xsmall", vertical: "xsmall"}}
                                >
                                <Image src={profileImageUrl} width="40px" height="40px" style={{borderRadius: "100px"}} fit="cover"/>
                            </Box>
                        <Box>
                                <Link to={`/profile/${props.authorId}`} style={{textDecoration: "none"}}><Text size={(size !== "large")&&(size)} color="headerTitle" weight="bold">{(size !== "small")&&(props.author)}</Text></Link>
                        </Box>
                        </Box>
                        </Button>
                    </Box> 
                    <Box background="cardDescription" width="400px" height="100%" direction="row" gap="small" fill="vertical" pad={{vertical: size, horizontal
                : size}} style={{padding: "30px", boxShadow: "rgb(12 11 11 / 43%) 0px 0px 10px"}} align="center">
                        <Text size="small" color="headerTitle" weight="bold">{(props.profileView === true) ? (props.title.slice(0, 5) + "...") : props.title}</Text>
                        <Text color="headerTitle">{(size !== "small" && props.description)&&("|")}</Text>
                        {(size !== "small")&&(<Text size={(size !== "large")&&(size)} color="headerTitle" style={{opacity: "70%"}}>{(props.description)&&(props.description.slice(0, 5) + "...")}</Text>)} 
                    </Box>
                    
                        {(props.focalLength && props.aperture && props.iso) && (
                            <Box
                            direction="row"
                            align="center"
                            gap="small"
                            >
                            <Text size={(size !== "large")&&(size)} color="headerTitle">{props.focalLength}{(size !== "small")&&("mm")} </Text>
                            <Text size={(size !== "large")&&(size)} color="headerTitle">{(size !== "small")&&("F/")}{props.aperture}</Text>
                            <Text size={(size !== "large")&&(size)} color="headerTitle">{props.iso} {(size !== "small")&&("ISO")}</Text>
                            </Box>
                        )}

                        {(props.options === true) && (
                             <DropButton
                    
                             dropContent={
                                 <Box pad="medium" gap="small" background="cardInfo" style={{borderRadius: "10px"}}>
                                     <Button>
                                         <Button onClick={() => setShowDelete(true)}>Delete</Button>
                                         {showDelete && (
                                            <Layer
                                            onEsc={() => setShowDelete(false)}
                                            onClickOutside={() => setShowDelete(false)}
                                            >
                                            <Button label="Confirm delete" onClick={async () => {
                                                setShowDelete(false);
                                                setShowLoading(true);
                                                
                                                const postId = props.postId;

                                                try {
                                                    await axios.delete(`https://photoarchive-a1hr.onrender.com/api/photos/${postId}`);
                                                  } catch (error) {
                                                    console.error('Error deleting post:', error);
                                                  } finally {
                                                    setShowLoading(false);
                                                    goHome();
                                                  }

                                                
                                            }
                                            
                                            } />
                                            </Layer>
                                        )}
                                     </Button>
                                 </Box>
                               }>
                                 <Button>
                                     <Text>...</Text>
                                 </Button>
                             </DropButton>
                        )}
                        
                    
                </CardHeader>
                <CardBody width="100%" background="cardDescription" direction="row">
                        <Box width="65%">

                        </Box>
                        <Button onClick={() => setShow(true)}>
                                {show && (
                                    <Layer
                                    onEsc={() => setShow(false)}
                                    onClickOutside={() => setShow(false)}
                                    background="cardDescription"
                                    style={{borderRadius: "15px"}}
                                    >
                                    <Box pad="xsmall" gap="small" align="center" margin="small">
                                    
                                        <Box>
                                            
                                        </Box>
                                        <Box>
                                            <Image src={imageUrl} width="400px" style={{borderRadius: "15px"}}/>
                                            <Text textAlign="center" color="headerTitle">{props.shortDescription}</Text>
                                        </Box>
                                    </Box>
                                    </Layer>
                                )}
                                <Image src={imageUrl} fit="cover" width="100%" />
                        </Button>
                        <Box  width="65%">

                        </Box>
                    
                </CardBody>
            </Card>
            {showLoading && (
                <Layer
                >
                <Box pad="large" align="center">
                    <Text>Deleting Post! Please Await</Text>
                    <Spinner />
                </Box>
                
                </Layer>
            )}
        </>
    );
};

const WithNavigate = (props) => {
    let navigate = useNavigate();
    return(<PostCard {...props} navigate={navigate} />);
}


export default WithNavigate;
export {WithNavigate, PostCard};
