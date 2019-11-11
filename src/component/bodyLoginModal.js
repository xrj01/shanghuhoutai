import React from 'react';
import {Button, Icon, Input, message} from 'antd';
import ReactDOM from 'react-dom';
import {Link,withRouter} from 'react-router-dom';
import { createHashHistory } from 'history';
import api from "../components/api";
import "./loginModal.scss";

const history = createHashHistory();
const styles = {
    mask: {
        position: 'fixed',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        height: '100%',
        zIndex: 1000,
    },
    modalWrap: {
        position: 'fixed',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        zIndex: 1000,
    },
    modal: {
        fontSize: 14,
        padding: 20,
        width: 520,
        height: 280,
        margin: '100px auto 0',
        backgroundColor: '#fff',
        borderRadius: 4,
        overflow: 'hidden',
        textAlign: 'center',
    },
    btnGroup: {
        padding: 10,
        textAlign: 'right'
    }
};


export default {
    dom: null, //被append的元素
    user_name:"",
    pass_word:"",
    success ({title, content, onOk, onCancel}) {
        this.close();
        this.dom = document.createElement('div');

        // JSX代码
        const JSXdom = (
            <div className='login-mobile-box'>
                <div style={styles.mask} />
                <div style={styles.modalWrap}>
                    <div style={styles.modal}>
                        <h2>{title}</h2>
                        <div className='login-input'>
                            <Input
                                onChange={(e)=>{this.inputChange("user_name",e.target.value)}}
                                placeholder="用户名"
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                onKeyDown={(e)=>{this.keyDown(e)}}
                            />
                        </div>
                        <div className='login-input'>
                            <Input
                                onKeyDown={(e)=>{this.keyDown(e)}}
                                onChange={(e)=>{this.inputChange("pass_word",e.target.value)}}
                                placeholder="密码"
                                type='password'
                                prefix={<Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            />
                        </div>
                        <div className='login-input'>
                            <Button type='primary' onKeyDown={(e)=>{this.keyDown(e)}} onClick={()=>{this.login()}}>登录</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
        ReactDOM.render(JSXdom, this.dom);
        document.body.appendChild(this.dom);
    },
    inputChange(type,value){
        this[type] = value;
    },
    keyDown(e){
        if(e.keyCode == 13){
            this.login()
        }
    },
    login () {
        const data={ pass_word:this.pass_word,user_name:this.user_name};
        if(!data.pass_word || !data.user_name){
            message.error("用户名密码不能为空");
            return false;
        }
        api.axiosPost("login",data).then((res)=>{
            if(res.data.code==1){
                message.success(res.data.msg);
                sessionStorage.setItem("token",res.data.data[0].token);
                sessionStorage.setItem("merchantsId",res.data.data[0].id);
                sessionStorage.setItem("tel",this.user_name);
                // this.props.history.push({pathname:"/home"+this.user_name});
                this.close();
            }else{
                message.error(res.data.msg)
            }
        });
    },
    close () {
        this.dom && this.dom.remove();
    }
}