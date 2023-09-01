import {useEffect} from 'react';
import axios from 'axios';

function SaveImage(image) {
    useEffect(() => {
        try{
            const formData = new FormData();
            formData.append('file', image);
           const response = axios
            .post('http://localhost:8082/api/photos/saveImage', formData, {
                headers: {
                    'enctype': 'multipart/form-data',
                }
            }).then(() => {
                return response.data.message;
            });
            
            return response.data.ImageName;
        } catch (error) {
            console.error(error);
            throw new Error('Error saving image');
        }
    });
}

export default SaveImage;