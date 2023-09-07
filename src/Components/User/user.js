import axios from 'axios';
import Cookies from 'js-cookie';
class User{
    constructor(username, password, confirmPassword = "", email = "", name = ""){
        this.email = email;
        this.name = name;
        this.username = username;
        this.password = password;
        this.confirmPassword = confirmPassword;
    }

    isPasswordCorrect(){
        if(this.password !== this.confirmPassword) return false;
        return true;
    }

    isAllFields(){
        if(this.email == null || this.name == null || this.username == null || this.password == null || this.confirmPassword == null) return false;
        if(this.email == "" || this.name == "" || this.username == "" || this.password == "" || this.confirmPassword == "") return false;
        return true;
    }

    createUser(){
        const userData = {
            name: this.name,
            username: this.username,
            password: this.password,
            email: this.email,
        }
        axios.post('https://photoarchive-a1hr.onrender.com/api/users/register', userData)
        .then((res) => {})
        .catch((err) => {console.log(err)});
    }

    async logIn(){
        const userData = {
            username: this.username,
            password: this.password
        }
        const response = await axios.post('https://photoarchive-a1hr.onrender.com/api/users/login', userData)
        .then((res) => {
            if(res.data.isValid){
                Cookies.set('user', res.data.isValid._id, {expires: 7});
                return res.data.isValid;
            }
            return false;
        })
        .catch((err) => {console.log(err)});

        return response;
    }

    async checkProfile(user){

        const idToCheck = user._id

        const response = await axios.get(`https://photoarchive-a1hr.onrender.com/api/photographers/getProfile/${idToCheck}`)
        
        return response;
    }
}

export default User;