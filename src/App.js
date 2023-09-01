import React from "react";

//Grommet
import {
  Grommet,
  grommet,
  Page,
  PageContent,
} from "grommet";
import { deepMerge } from "grommet/utils";
import AppHeader from './Layouts/Header/Header';
import appBackgound from './assets/images/background.jpg';

//Router
import {BrowserRouter, Routes, Route} from 'react-router-dom';

//Pages
import HomePage from './Pages/main';
import CreatePost from './Pages/createPost';
import CreateProfile from './Pages/createProfile';
import LogIn from './Pages/login';
import Register from './Pages/register';
import ProfilePage from './Pages/profile'

import axios from 'axios';

import Cookies from 'js-cookie';

const theme = deepMerge(grommet,{
  global: {
    colors: {
      brand: 'black',
      headerTitle: '#707070',
      doc: 'grey',
      cardInfo: '#212121',
      cardDescription: '#272727',
    },
    font: {
      family: "Segoe UI",
      size: "18px",
      height: "20px",
    },
  },
  page: {
    narrow: {
      width: {
        min: "medium",
        max: "1015px",
      }
    },
  },
});

const App = () => {

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const effectiveType = connection.effectiveType; // 'slow-2g', '2g', '3g', '4g', or '5g'

  axios.post('http://localhost:8082/api/photos/internetSpeed', { effectiveType })
  .then(response => {
      console.log(response.data.message);
      Cookies.set('internetSpeed', response.data.message, {expires: 7});

  })
  .catch(error => {
      console.error('Error sending connection info:', error.message);
  });
  console.log(Cookies.get('user'));
  return (
    <Grommet theme={theme} background={`url(${appBackgound})`} full>
    <Page kind="narrow" >
      <PageContent>
        <BrowserRouter>
        <AppHeader />
        <Routes>
          <Route path="/" element={<HomePage />}/>
          {(Cookies.get('user')) && (
            <Route path="/createPost" element={<CreatePost />}/>
          )}
          <Route path="/profile/:authorId" element={<ProfilePage />} />
          <Route path="/createProfile" element={<CreateProfile />}/>
          {(!Cookies.get('user')) && (
            <Route path="/login" element={<LogIn />}/>
          )}
          <Route path="/register" element={<Register />}/>
          
        </Routes>
        </BrowserRouter>
      </PageContent>
    </Page>
    </Grommet>
  );
}

export default App;