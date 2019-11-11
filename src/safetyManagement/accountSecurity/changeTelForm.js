import React from "react";
import {Link} from 'react-router-dom';
import { Button,Modal,Form,Input,message} from 'antd';
import api from './../../components/api'

import "./index.scss";

class ChangeTelForm extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state={
            codeText: false,
            secondText: false,
            yztime: 60,
            send:false,
            telnumber:'',
            code:"",
            canSendCode: true, // 是否可以发送验证码
        }
    }
    shouldGoOn() {
        const {telnumber = '', stameTime} = JSON.parse(sessionStorage.getItem('phone')) || {} // , JSON.stringify({telnumber: getFieldsValue('telnumber'), stameTime: new Date().getTime()})
        let d = new Date().getTime(), t = 60 - Math.floor((d - stameTime) / 1000);
        return {flag: stameTime && (t > 0), telnumber, t}
    }
    componentDidMount() {
        const {flag, telnumber, t: yztime} = this.shouldGoOn();
        //console.log(telnumber);
        if(flag) {
            this.setState({yztime, codeText: true}, this.count);
            this.props.form.setFieldsValue({telnumber})
        }
    }

    render(){
        //表单
        const {getFieldDecorator} = this.props.form
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 6 },
                sm: { span: 16 },
            },
        };
        return(
            <Form className='account-tel-form' {...formItemLayout}>

                <div className='account-tel-form-text'>原手机号：<span>{this.props.oldTelNumber}</span></div>

                <Form.Item label="验证码">
                    {getFieldDecorator('telnumber', {
                        rules: [{ required: true, message: '请输入短信验证码!'}],
                        //validateTrigger: 'onBlur'
                    })(
                        <div className='note-code'>
                            <Input placeholder="请输入验证码" allowClear style={{width:'60%'}} />
                            
                            
                            <Button className='send-code' onClick={this.sendCode.bind(this)}>
                                {this.state.codeText ? this.state.yztime + '秒后重发' : this.state.secondText?'重新获取':'获取验证码'}
                            </Button>
                        </div>
                    )}
                </Form.Item>
                <Form.Item label="新手机号">
                    {getFieldDecorator('notecode', {
                        rules: [{ required: true, message: '请输入新手机号码!' },{pattern: /^((\+)?86|((\+)?86)?)0?1[3458]\d{9}$/, message: '请输入正确的手机号!'},],
                        //validateTrigger: 'onBlur'
                    })(
                        <Input placeholder="请输入新手机号码" allowClear style={{width:'301px'}}
                            
                        />
                    )}
                </Form.Item>
            </Form>
                   
        )
    }

    //倒计60s
    count = () => {
        let { yztime } = this.state;
        let siv = setInterval(() => {
            if(yztime <= 0) {
                clearInterval(siv);　　//倒计时( setInterval() 函数会每秒执行一次函数)，用 clearInterval() 来停止执行:
                //与表单数据进行关联
                const {validateFields} = this.props.form;
                validateFields('telnumber', {force: true}, err => {
                    if(!err) {}//this.setState({canSendCode: true});
                })
                this.setState({yztime: 60, codeText: false,canSendCode: true})
            }
            else {
                yztime--;
                this.setState({ yztime});
            }
        }, 1000);
    }
     
    //短信验证
    sendCode(){
    　　this.setState({ codeText: true , send:true, canSendCode: false}, () => {
            // 存入sessionStorage
            const {getFieldValue} = this.props.form;
            sessionStorage.setItem('phone', JSON.stringify({telnumber: getFieldValue('telnumber'), stameTime: new Date().getTime()}))
            this.count()
        });
        //发送验证码请求
        let data = JSON.stringify({phone: `${this.props.oldTelNumber}`,code_type:'3'}) 

        api.axiosPost("sendCode",data).then((res)=>{
            if(res.data.code === 0){
                message.info(res.data.msg)
            }else if(res.data.code === 1){
                this.setState({
                    secondText:true
                })
                message.success('验证码已发送，请注意查收')
            }
            
        });
        
    }
}


export default Form.create()(ChangeTelForm)