import React, {Component} from 'react';
import EXIF from 'exif-js';

import { FileInput, Layer, Box, Button} from 'grommet';

class Image extends Component {
    constructor(props) {
        super(props);
        this.state = {
            iso: null,
            metadata: null,
            image: null,
            file: null,
        }

        this.getMetadataFromImage = this.getMetadataFromImage.bind(this);
    }

    componentDidUpdate(prevProps, prevState){

        if(prevState.image !== this.state.image) {
            console.log(this.state.image);
            this.getMetadataFromImage(this.state.image);
            
        }

        if(prevState.iso !== this.state.iso) {
            console.log(this.state.iso);
        }

        if(prevState.file !== this.state.file){
            console.log(this.state.file)
            this.props.onFileChange(this.state.file);
        }
    }

    getMetadataFromImage(imageFile) {

        const file = imageFile;

        EXIF.getData(file, () => {
            const metadata = EXIF.getAllTags(file);

            console.log(metadata);

            this.props.onImageChange(imageFile);

            this.props.onIsoChange(metadata.ISOSpeedRatings);
            this.props.onApertureChange((metadata.FNumber.numerator / metadata.FNumber.denominator));
            this.props.onFocalLenghtChange(metadata.FocalLength.numerator);
          });
          
    }
    
    render() {
        return(
            <FileInput 
                name="fileName"
                id="fileName"
                onChange={(event, {files}) => {
                    const fileList = files;
                    console.log(fileList[0]);
                    this.setState( {image: fileList[0]} );
                    if(fileList.length === 1){
                        this.setState( {file: URL.createObjectURL(fileList[0]) }, () => {
                            this.setState({iso: 100});
                        });
                        console.log(this.state.image);
                        
                    }
                }}
            />
        );
    }
}


export default Image;