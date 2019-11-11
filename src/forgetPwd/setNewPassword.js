import React from "react";
import {Link} from 'react-router-dom';
/* import Prompt from './../component/prompt' */
import {Row,Col,Steps, Button, message,Form,Input} from "antd";
import api from "./../components/api";
import "./index.scss";

class ForgetPwd extends React.PureComponent {
    constructor(props) {
        super(props);
        
        this.state={
            confirmDirty: false,
        }
    }
    componentDidMount(){
        
    }
    componentWillUnmount(){
        sessionStorage.removeItem('current')
        sessionStorage.removeItem('phone1')
    }
    render(){
        //表单
        const {getFieldDecorator} = this.props.form
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 7 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 },
            },
        };
        return(       
            <div className='set-new-password'>
                {/* 表单 */}
                <Form onSubmit={this.handleSubmit} {...formItemLayout} style={{width:"500px"}}>

                    <Form.Item label="新的密码">
                        {getFieldDecorator('password', {
                        rules: [
                            { required: true, message: '请输入登录密码' },
                            { message: '请填写6-8位数字和字母组成的密码' , pattern : /^([a-z0-9A-Z)]){6,8}$/i},
                            { validator: this.validateToNextPassword },
                        ]
                        })(
                        <Input.Password name='password' placeholder="请设置6至8位登录密码" />,
                        )}
                    </Form.Item>
                    <Form.Item label="重复密码">
                        {getFieldDecorator('confirmpwd', {
                        rules: [
                            { required: true,message: '请再次确认密码' },
                            { validator: this.compareToFirstPassword },
                        ]
                        })(
                        <Input.Password 
                            name='confirmpwd'
                            placeholder="请再次输入登录密码" 
                            onBlur={this.handleConfirmBlur}
                        />,
                        )}
                    </Form.Item>

                    <Form.Item wrapperCol={{span:16,offset:7}}>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            style={{width:336}}>
                            下一步
                        </Button>
                    </Form.Item>
                </Form>
            </div>
               
        )
    }
    
    //表单提交
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            //console.log('Received values of form: ', values);
            //提交新密码
            let data = {
                "password" : values.password,
                "phone":sessionStorage.getItem('phone1')
            }

            api.axiosPost("submitNewPwd",data).then((res)=>{
                //console.log(res);
                if(res.data.code === 0){
                    message.error('重置密码失败，请重新设置')
                }else if(res.data.code ===1){
                    //进入下一步
                    this.props.next()
                }
            });
          }
        });
        
    };
    
    // 第一次密码的验证
    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirmpwd'], { force: true });
        }
        callback();
    };
    // 确认密码的验证
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value !== form.getFieldValue('password')) {
            callback('两次密码不一致');
        } else {
            callback();
        }
    };
    // 确认密码失焦 判断两次密码是否一直
    handleConfirmBlur = e => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
}

export default Form.create()(ForgetPwd)