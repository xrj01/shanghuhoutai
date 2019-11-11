import React from "react";
import {Link} from 'react-router-dom';
import { Button,Modal,Form,Input ,message,Icon} from 'antd';
import api from './../../components/api'
import ChangePwdForm from './changePwdForm'
import ChangeTelForm from './changeTelForm'
import "./index.scss";
import { styles } from "ansi-colors";

class AccountSecurity extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state={

            visible: false,
            visible1:false,
            threeTel:'',
            fourTel:'',
            telNumber:''
        }
    }
    
    
    render(){
        //console.log(this.state.telNumber);
        //表单
        const {getFieldDecorator} = this.props.form
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 4 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 20 },
            },
        };
        return(
            <div className='account-security-box'>
                <div className='account-security-title'> 
                    <span>商家中心 <Icon type="right" /> </span>
                    <span>安全管理 <Icon type="right" /> </span>
                    <span style={{color:'#2277E6'}}>账号安全</span>
                </div>
                <div className='account-security-content'>
                    <div className='account-security-row'>
                        <div className='text-center'>
                            <img src={require('./../../image/pwd.png')} alt='' className='account-icon'/>
                            {/* <Icon type="check-circle" className='account-icon' /> */}
                            <span className='account-security-col'>登录密码</span>
                            <span className='ft12'>建议您定期更换密码，设置安全性高的密码可以使账号更安全</span>
                        </div>
                        <div>
                            <Button type="primary" onClick={this.showModal} className='btn' style={{width:'64px',height:'32px'}}>
                                修改
                            </Button>
                            <Modal
                            className='account-security-amendPwd'
                            title="修改密码"
                            visible={this.state.visible}
                            onOk={this.handleOk}
                            width={520}
                            onCancel={this.handleCancel}
                            /* footer={[
                                <div style={{textAlign:'center',padding:'20px 0'}}>
                                    <Button key="back" onClick={this.handleCancel} style={{width:'120px',height:'42px'}}>
                                    取消
                                    </Button>
                                    <Button key="submit" type="primary" onClick={this.handleOk} style={{width:'120px',height:'42px'}}>
                                    确定
                                    </Button>
                                </div>
                            ]} */
                            >
                            <ChangePwdForm wrappedComponentRef={(e)=>{this.changePwdForm = e}}/>
                            </Modal>
                        </div>
                       
                    </div>
                   {/*  <div className='account-security-row'>
                        <div className='text-center'>
                            
                            <img src={require('./../../image/tel.png')} alt='' className='account-icon-tel' />
                            <span className='account-security-col'>安全手机<span>{this.state.threeTel}</span>****<span>{this.state.fourTel}</span></span>
                            <span className='ft12'>
                                安全手机可以用于登录账号，重置密码或其他安全验证
                            </span>
                        </div>
                        <div>
                            <Button type="primary" onClick={this.showModal1} style={{width:'120px',height:'42px'}}>
                                修改
                            </Button>
                            <Modal
                            className='account-security-amendTel'
                            title="修改验证手机号"
                            visible={this.state.visible1}
                            onOk={this.handleOk1}
                            onCancel={this.handleCancel1}
                            footer={[
                                <div style={{textAlign:'center',padding:'20px 0'}}>
                                    <Button key="back1" onClick={this.handleCancel1} style={{width:'120px',height:'42px'}}>
                                    取消
                                    </Button>,
                                    <Button key="submit1" type="primary" onClick={this.handleOk1} style={{width:'120px',height:'42px'}}>
                                    确定
                                    </Button>
                                </div>
                            ]}
                            >
                            <ChangeTelForm wrappedComponentRef={(e)=>{this.changeTelForm = e}} oldTelNumber={this.state.telNumber}/>
                            </Modal>
                        </div>
                        
                    </div> */}
                    <div className='account-security-reminder'>
                        <div className='account-reminder-title'>
                            安全服务提示
                        </div>
                        <ul className='account-reminder-list'>
                            <li className='ft12'>确认您登录的是企牛采网址，注意防范进入钓鱼网站，不要轻信各种即时通讯工具发送的商品或支付链接，谨防网购诈骗</li>
                            <li className='ft12'>建议您安装杀毒软件，并定期更新操作系统等软件补丁，确保账号及交易安全</li>
                        </ul>
                    </div>
                </div>

            </div>
        )
    }
    componentDidMount(){
        //console.log(1111,this.props.location.query.code);
        
        //获取原手机号
        let tel = {}
        api.axiosPost('getBasicInfor',tel).then((res)=>{
            
            if(res.data.code === 1){
                let a = res.data.data.contacter_phone.toString().slice(7)
                let b = res.data.data.contacter_phone.toString().substring(0,3)
                this.setState({
                    telNumber : res.data.data.contacter_phone,
                    threeTel : b,
                    fourTel : a
                })
            }
        })
    }
    showModal = () => {
        this.setState({
          visible: true,
        });
    };
    //修改密码
    handleOk = e => {
        let pwdDemo = this.changePwdForm
        //表单验证
        pwdDemo.props.form.validateFields((err, values) => {

          if (!err) {
            //发送修改密码请求
            let pwdData = {
                old_pwd : values.oldPassword,
                new_pwd : values.password,
            }
            api.axiosPost("changePwd",pwdData).then((res)=>{
                //console.log(res);
                if (res.data.code === 1) {
                    message.success('恭喜，修改成功！')
                    //清空表单
                    pwdDemo.props.form.resetFields()
                    //关闭弹窗
                    this.setState({
                        visible: false,
                    });
                }else if(res.data.code === 0){
                    message.error(res.data.msg)
                }
            });
            
          }
        });
        
    };
    
    handleCancel = e => {
        //console.log(e);
        this.setState({
            visible: false,
        });
    };

    showModal1 = () => {
        this.setState({
          visible1: true,
        });
    };
    //修改手机号
    handleOk1 = e => {
        // let telDemo = this.refs.changeTelForm
        let telDemo = this.changeTelForm
        //console.log(telDemo)
        //表单验证
        telDemo.props.form.validateFields((err, values) => {
          if (!err) {
            //console.log(values);
            
            //发送修改手机号请求
            let telData = {
                phone : values.notecode,
                code : +values.telnumber,
                old_phone : `${this.state.telNumber}`
            }
            
            api.axiosPost("changeTel",telData).then((res)=>{
                //console.log(res);
                if(res.data.code === 0){
                    message.error(res.data.msg)
                }else{
                    message.success('恭喜，修改成功！')
                    //清空表单
                    telDemo.props.form.resetFields()
                    //关闭弹窗
                    this.setState({
                        visible1: false,
                    });
                }
                 
            });
            
          }
        });
    };
    
    handleCancel1 = e => {
        //console.log(e);
        this.setState({
            visible1: false,
        });
    };
    
}


export default Form.create()(AccountSecurity)