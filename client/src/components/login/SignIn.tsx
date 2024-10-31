import { useState} from "react";
import {TextField} from "./TextField";
import {PasswordField} from "./Password";
import "./login.css";

function SignIn(){
    const [formData, setFormData] = useState({name:"",lastName:"",email:"",password:"",passwordConfirm:""});
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.name == "" || formData.lastName == "" || formData.email == "" || formData.password == "" || formData.passwordConfirm == ""){
            e.stopPropagation();
            setError("Some fields are still empty")
        } else if (formData.password != formData.passwordConfirm){
            e.stopPropagation();
            setError("Passwords don't match")
        }
        else {
            console.log(formData);
            setFormData({...formData, password: "", passwordConfirm: ""});
        }
    };

    return (
        <form id="loginForm" onSubmit={handleSubmit}>
            <TextField id="name" content="Name" onChange={handleChange} value={formData.name}/>
            <TextField id="lastName" content="Last Name" onChange={handleChange} value={formData.lastName}/>
            <TextField id="email" content="Email" onChange={handleChange} value={formData.email}/>
            <PasswordField id="password" content="Password" onChange={handleChange} value={formData.password}/>
            <PasswordField id="passwordConfirm" content="Password Confirm" onChange={handleChange} value={formData.passwordConfirm}/>
            <button type="submit">Sign in</button>
            <p id="error">{error}</p>
        </form>
    )}
export {SignIn};