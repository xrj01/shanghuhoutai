import React from "react";
import {Link} from 'react-router-dom';
import LoginModal from "./../component/loginModal";
import LoginFooter from "./../component/loginFooter";
import Header from './../component/header';
import "./index.scss";

export default class Login extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    render(){
        return(
            <div className='login'>
                <Header islogin={true}/>
                <LoginModal />
                <LoginFooter/>
            </div>
        )
    }

}