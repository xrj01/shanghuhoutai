import React from "react";
import {Form,Input} from 'antd';
import "./index.scss";

class ChangePwdForm extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state={
            confirmDirty: false,
        }
    }

    render(){
        //表单
        const {getFieldDecorator} = this.props.form
        const formItemLayout = {
            labelCol: {
              xs: { span: 6 },
              sm: { span: 5 },
            },
            wrapperCol: {
              xs: { span: 6 },
              sm: { span: 19 },
            },
        };
        return(
            
            <Form onSubmit={this.handleSubmit} className='account-pwd-form' {...formItemLayout}>
                <Form.Item label="原密码">
                    {getFieldDecorator('oldPassword', {
                        rules: [{ required: true, message: '请输入原密码!' },{pattern: /^([a-z0-9\.\@\!\#\$\%\^\&\*\(\)]){6,8}$/i, message: '只支持数字及英文输入，长度必须为6-8位!'}],
                        //validateTrigger: 'onBlur'
                    })(
                        <Input.Password placeholder="请输入原密码"
                        />
                    )}
                </Form.Item>

                <Form.Item label="新密码">
                    {getFieldDecorator('password', {
                    rules: [
                        { required: true, message: '请输入登录密码' },
                        { message: '请填写6-8位数字和字母组成的密码' , pattern : /^([a-z0-9A-Z)]){6,8}$/i},
                        { validator: this.validateToNextPassword },
                    ]
                    })(
                    <Input.Password placeholder="请设置6至8位登录密码"/>,
                    )}
                </Form.Item>
                <Form.Item label="输入新密码">
                    {getFieldDecorator('confirmpwd', {
                    rules: [
                        { required: true,message: '请再次确认密码' },
                        { validator: this.compareToFirstPassword },
                    ]
                    })(
                    <Input.Password 
                        placeholder="请再次输入登录密码" 
                        onBlur={this.handleConfirmBlur}
                        // style={{width:'310px'}}
                    />,
                    )}
                </Form.Item>
            </Form>
        )
    }
    
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

export default Form.create()(ChangePwdForm)