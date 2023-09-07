import React, {useState, useEffect} from "react";
import {Box, Text} from "grommet";

import axios from 'axios';

import PostCard from '../Components/PostCard/PostCard';

const Main = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const response = await axios.get('https://photoarchive-a1hr.onrender.com/api/photos/');

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

                console.log(response.data);

                setData(response.data);
            }
            
        }
        fetchData();
    }, []);
    
    return(
        <>
        <Box gap="small">
            {(data.length < 1)? (
                <Box align="center" background="grey" pad="large" style={{borderRadius: "10px"}}>
                    <Text>
                        No posts created!
                    </Text>
                </Box>
            ) : (
                data.map((item) => {

                    return(
                    <PostCard
                        placeName={item.placeName}
                        geolocation={item.geolocation}
                        profileImg={item.profileImg}
                        author={item.author}
                        title={item.title}
                        description={item.description}
                        focalLength={item.focalLength}
                        aperture={item.aperture}
                        iso={item.iso}
                        imageName={item.fileName}
                        authorId={item.authorId}
                    />
                    )})
            )}
        </Box>

        </>
    );
};

export default Main;