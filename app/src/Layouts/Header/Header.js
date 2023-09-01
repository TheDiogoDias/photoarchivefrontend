import React from "react";
import {Box, Button, Header, Text, Image, DropButton} from "grommet";
import appIcon from '../../assets/images/appIcon.png';

import gridViewIcon from '../../assets/icons/GridView.png';
import verticalViewIcon from '../../assets/icons/VerticalView.png';

import addPostIcon from '../../assets/icons/addPost.png';
import profileIcon from '../../assets/icons/ProfilePic.png';

import { Link } from 'react-router-dom';

import Cookies from 'js-cookie';

const Menu = () => {
    return(
        <Header pad={{vertical: 'medium'}} gap="xsmall">
        <Link to="/">
            <Button>
                <Box
                    maxWidth="medium" 
                    margin="auto"
                    direction="row"
                    align="center"
                    gap="small"

                    pad={{vertical: 'small'}}
                    responsive={false}
                >
                    <Image src={appIcon} />
            
                    <Box direction="row" gap="xsmall" wrap>
                        <Text color="headerTitle" >
                            Photo Archive
                        </Text>
                    </Box>

                    
                </Box>
            </Button>
        </Link>
            <Box
                maxWidth="small" 
                margin="auto"
                direction="row"
                align="center"
                gap="small">
                <Button>
                    <Image src={verticalViewIcon} />
                </Button>
                <Button>
                    < Image src={gridViewIcon} />
                </Button>
            </Box>

            {(Cookies.get('user')) ? (
                <Box direction="row" gap="small" align="center">
                    <Link to="/createPost">
                        <Button>
                            <Image src={addPostIcon} />
                        </Button>
                    </Link>
                    <DropButton
                    
                    dropContent={
                        <Box pad="medium" gap="small" background="cardInfo" style={{borderRadius: "10px"}}>
                            <Button>
                                <Text>Profile</Text>
                            </Button>
                            <Button onClick={() => {
                                Cookies.remove('user');
                            }}>
                                <Link to="/login" onClick={() => {window.location.reload()}}>
                                    <Text>Logout</Text>
                                </Link>
                            </Button>
                        </Box>
                      }>
                        <Button>
                            < Image src={profileIcon} />
                        </Button>
                    </DropButton>
                </Box>
            ) : 
            (
            <Link to="/login">
                <Box direction="row" gap="small" align="center">
                    <Button>
                        <Text style={{color: "black"}}>
                            Log In
                        </Text>
                    </Button>
                </Box>
            </Link>
        )}
            
        </Header>
    );
}

export default Menu;