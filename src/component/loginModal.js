import React from "react";
import {Input,Icon,Button,message} from "antd";
import "./loginModal.scss";
import {Link,withRouter} from 'react-router-dom';
import { createHashHistory } from 'history';
import api from "./../components/api";
const history = createHashHistory();
@withRouter
 class Login extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state={
            user_name:"",
            pass_word:"",
        }
    }

    inputChange=(type,value)=>{
        this.setState({
            [type]:value
        })
    };
    login=()=>{
        const {user_name,pass_word} = this.state;
        if(!user_name || !pass_word){
            message.error("用户名或者密码不能为空");
            return false;
        }
        const data={pass_word,user_name};
        api.axiosPost("login",data).then((res)=>{
            if(res.data.code == 1){
                if(res.data.data[0].state === 1){
                    message.success(res.data.msg);
                    sessionStorage.setItem("token",res.data.data[0].token);
                    sessionStorage.setItem("merchantsId",res.data.data[0].id);
                    sessionStorage.setItem("tel",this.state.user_name)
                    this.props.history.push('/home');
                }else if(res.data && res.data.data[0].state === -2){
                    sessionStorage.setItem("token",res.data.data[0].token);
                    sessionStorage.setItem("merchantsId",res.data.data[0].id);
                    sessionStorage.setItem("tel",this.state.user_name)
                    this.props.history.push({ pathname:'/registration',state:{current : 1 ,tel:user_name} });//未提交
                }else if(res.data && res.data.data[0].state === 0){
                    sessionStorage.setItem("token",res.data.data[0].token);
                    sessionStorage.setItem("merchantsId",res.data.data[0].id);
                    sessionStorage.setItem("tel",this.state.user_name)
                    this.props.history.push({ pathname:'/registration',state:{current : 2 ,tel:user_name} });//待审核
                }else if(res.data && res.data.data[0].state === -1){
                    sessionStorage.setItem("token",res.data.data[0].token);
                    sessionStorage.setItem("merchantsId",res.data.data[0].id);
                    sessionStorage.setItem("tel",this.state.user_name)
                    sessionStorage.setItem("audit_reson",res.data.data[0].audit_reason);
                    this.props.history.push({ pathname:'/registration',state:{current : 2 ,tel:user_name ,reject:true,} });//审核不通过
                }else if(res.data && res.data.data[0].state === 101){
                    sessionStorage.setItem("token",res.data.data[0].token);
                    sessionStorage.setItem("merchantsId",res.data.data[0].id);
                    sessionStorage.setItem("tel",this.state.user_name)
                    this.props.history.push({ pathname:'/registration',state:{current : 3 ,tel:user_name } });//审核通过
                }else{
                    message.error(res.data.msg)
                }
            }else{
                message.error(res.data.msg)
            }
        });
    };
    //键盘事件回车
    keyDown=(e)=>{
        if(e.keyCode == 13){
            this.login();
        }
    };
    render(){
        return(
            <div className='login-modal-mask'>
                <div className="logon-mian-box">
                    <div className="login-box">
                        <h4>商户后台</h4>
                        <div className='login-input form-input'>
                            <Input
                                onChange={(e)=>{this.inputChange("user_name",e.target.value)}}
                                placeholder="用户名"
                                value={this.state.user_name}
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                onKeyDown={this.keyDown}
                            />
                        </div>
                        <div className='login-input form-input'>
                            <Input
                                onChange={(e)=>{this.inputChange("pass_word",e.target.value)}}
                                placeholder="密码"
                                type='password'
                                onKeyDown={this.keyDown}
                                value={this.state.pass_word}
                                prefix={<Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            />
                        </div>
                        
                        <div className='login-input'>
                            <Button type='primary' onKeyDown={this.keyDown} onClick={this.login}>登录</Button>
                        </div>
                        <div className='login-input opr'>
                            <Link to='/forgetPwd'>忘记密码？</Link>
                            <Link to='/registration'>申请入驻</Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default Login