import React, {Component} from "react";
import {Box, Button} from 'grommet';

class RenderingPostAction extends Component {

    changeImage = () => {
        this.props.disablePost();
    }

    uploadImage = () => {
        this.props.enablePost();
    }

    render(){
        return(
            <>
                { (this.props.file == null && this.props.createPost == null) && (
                (<></>)
                ) }
                {(this.props.file != null && this.props.createPost == null) && (
                    <Box direction="row" gap="medium">
                        <Button label="Change Image" onClick={this.changeImage} />
                        <Button label="Upload Image" onClick={this.uploadImage} />
                        {}
                    </Box>
                ) }
            </>
        );
    }
}

export default RenderingPostAction;