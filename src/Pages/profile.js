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

            const response = await axios.get(`https://photoarchive-a1hr.onrender.com/api/photos/profile/${authorId}`);

            if(response){
                const responseData = response.data;

                for(let i = 0; i < responseData.length; i++ ){
                    if(responseData[i].author){
                        const response = await axios.get(`https://photoarchive-a1hr.onrender.com/api/users/getName/${responseData[i].author}`);
                        const responseProfile = await axios.get(`https://photoarchive-a1hr.onrender.com/api/photographers/getProfile/${responseData[i].author}`);
                        responseData[i].profileImg = responseProfile.data.ProfileImg;
                        responseData[i].authorId = responseData[i].author;
                        responseData[i].author = response.data.name;
                    }
                }

                
            }

            console.log(response.data[0].author);

            setData(response.data);
            
        }
        fetchData();
    }, []);

        useEffect(() => {
            const fetchImage = async () => {

                if(data.length != null){
                    const internetSpeed = Cookies.get('internetSpeed');
                    const responseProfile = await axios.get(`https://photoarchive-a1hr.onrender.com/api/photographers/getProfile/${data[0].authorId}`);
                    setProfile(responseProfile);
                    const responseImg = await fetch(`https://photoarchive-a1hr.onrender.com/api/photos/uploadsProfileImg/${data[0].profileImg}/${internetSpeed}`);
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
            <Box direction="row"  background="cardInfo"   align="center" style={{borderRadius: "15px"}}> 
                <Box width="45%" justify="center" pad="medium">
                    <Image src={profileImg} width="150px" height="150px" style={{borderRadius: "20px"}} fit="cover"/>
                </Box>
                <Box background="cardDescription" fill pad="large" style={{borderRadius: "15px"}}>
                    {(profile != null && data != null) && (
                        <>
                        <Text>Name: {data[0].author}</Text>
                        <Text>Age: {profile.data.Age}</Text>
                        <Text>Gear</Text>
                        <Text>Camera: {profile.data.Camera}</Text>
                        <Text>Lens: {profile.data.Lens}</Text>
                        <Text>Experience: {profile.data.TimeOfExperience} year</Text>
                        </>
                    )}
                </Box>
            </Box>
            
            <Grid columns={['auto', 'auto', 'auto']} >
            {(data.length < 1)? (
                <Box align="center" background="grey" pad="large" style={{borderRadius: "10px"}}>
                    <Text>
                        No posts created!
                    </Text>
                </Box>
            ) : (
                data.map((item) => {

                    return(
                       
                   
                            <Box pad="small" fill >
                            <PostCard
                                    postId={item._id}
                                    profileImg={item.profileImg}
                                    title={item.title}
                                    description={item.description}
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