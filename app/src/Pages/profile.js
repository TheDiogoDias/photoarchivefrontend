import React, {useState, useEffect} from "react";

import {Box, Text, Grid, Image} from "grommet";

import { useParams } from 'react-router-dom';

import axios from 'axios';

import PostCard from '../Components/PostCard/PostCard';

import Cookies from 'js-cookie';


const Profile = () => {
    const [data, setData] = useState([]);
    const [profile, setProfile] = useState();
    const [profileImg, setProfileImg] = useState();
    const [isLogin, setIsLogin] = useState();

    const {authorId} = useParams();

    useEffect(() => {
        async function fetchData() {

            const response = await axios.get(`http://localhost:8082/api/photos/profile/${authorId}`);

            if(response){
                const responseData = response.data;

                for(let i = 0; i < responseData.length; i++ ){
                    if(responseData[i].author){
                        const response = await axios.get(`http://localhost:8082/api/users/getName/${responseData[i].author}`);
                        const responseProfile = await axios.get(`http://localhost:8082/api/photographers/getProfile/${responseData[i].author}`);
                        responseData[i].profileImg = responseProfile.data.ProfileImg;
                        responseData[i].authorId = responseData[i].author;
                        responseData[i].author = response.data.name;
                    }
                }

                
            }

            setData(response.data);
            
        }
        fetchData();
    }, []);

        useEffect(() => {
            const fetchImage = async () => {

                if(data.length != null){
                    const responseProfile = await axios.get(`http://localhost:8082/api/photographers/getProfile/${data[0].authorId}`);
                    setProfile(responseProfile);
                    const responseImg = await fetch(`http://localhost:8082/api/photos/uploadsProfileImg/${data[0].profileImg}`);
                    const blob = await responseImg.blob();
                    setProfileImg(URL.createObjectURL(blob));
                }
            
            };
            fetchImage();
        }, [data]);

        useEffect(() => {

            if(Cookies.get('user')) setIsLogin(true);

        }, [Cookies.get('user')]);

        return(
            <>
            <Box direction="row"  background="cardInfo" pad="medium" margin={{vertical: "small"}}style={{borderRadius: "15px"}}> 
                <Box width="45%" justify="center" pad="medium">
                    <Image src={profileImg} width="100px" style={{borderRadius: "55px"}}/>
                </Box>
                <Box>
                    {(profile != null) && (
                        <>
                        <Text>Name: {profile.data.User}</Text>
                        <Text>Age: {profile.data.Age}</Text>
                        <Text>Gear</Text>
                        <Text>Camera: {profile.data.Camera}</Text>
                        <Text>Lens: {profile.data.Lens}</Text>
                        <Text>Experience: {profile.data.TimeOfExperience}</Text>
                        </>
                    )}
                </Box>
            </Box>
            
            <Grid columns={['medium', 'medium', 'medium']} gap="small">
            {(data.length < 1)? (
                <Box align="center" background="grey" pad="large" style={{borderRadius: "10px"}}>
                    <Text>
                        No posts created!
                    </Text>
                </Box>
            ) : (
                data.map((item) => {

                    

                    return(
                       
                   
                            <Box pad="xxsmall">
                            <PostCard
                                    postId={item._id}
                                    profileImg={item.profileImg}
                                    title={item.title}
                                    imageName={item.fileName}
                                    authorId={item.authorId}
                                    options={isLogin}
                                />
                            </Box>
                    
                        

                    )})
            )}
            </Grid>
            </>
        )

}

export default Profile;