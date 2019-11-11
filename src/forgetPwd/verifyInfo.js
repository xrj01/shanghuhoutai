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
            codeText: false,
            secondText: false,
            yztime: 60,
            send:false,
            phone:'',
            code:"",
            
            canSendCode: false, // 是否可以发送验证码
        }
    }
    shouldGoOn() {
        const {phone = '', stameTime1} = JSON.parse(sessionStorage.getItem('phone')) || {} // , JSON.stringify({phone: getFieldsValue('phone'), stameTime1: new Date().getTime()})
        let d = new Date().getTime(), t = 60 - Math.floor((d - stameTime1) / 1000);
        return {flag: stameTime1 && (t > 0), phone, t}
    }
    componentDidMount() {
        const {flag, phone, t: yztime} = this.shouldGoOn();
        //console.log(phone);
        if(flag) {
            this.setState({yztime, codeText: true,canSendCode: true,secondText:true}, this.count);
            this.props.form.setFieldsValue({phone})
        }
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
            <div>
                <div className='forgetPwd-hint'>
                    遇到任何问题请联系您的销售经理或者
                    <span className='blue'>联系客服：028-83368980</span>
                </div>
                {/* 表单 */}
                <Form onSubmit={this.handleSubmit} {...formItemLayout} style={{width:"500px"}}>
                    <Form.Item label="手机号">
                        {getFieldDecorator('phone', {
                            rules: [{ required: true, message: '请输入手机号!' },{pattern: /^((\+)?86|((\+)?86)?)0?1[34589]\d{9}$/, message: '请输入正确的手机号!'},],
                            
                        })(
                            <Input name='phone' placeholder="请输入手机号" allowClear 
                                onBlur={this.checkTel.bind(this)}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="验证码">
                        {getFieldDecorator('notecode', {
                            rules: [{ required: true, message: '请输入短信验证码!'}],
                            validateTrigger: 'onBlur'
                        })(
                            <div className='note-code'>
                                <Input name='notecode' placeholder="短信验证码" allowClear />
                                
                                
                                <Button disabled={this.state.canSendCode}  className='send-code' onClick={this.sendCode.bind(this)}>
                                    {this.state.codeText ? this.state.yztime + '秒后重发' : this.state.secondText ?'重新获取':'发送验证码'}
                                </Button>
                            </div>
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
            
            //表单提交Api
            let data = {
                phone: values.phone,
                verification_code: +values.notecode,
                code_type: 2
            }
            //子传父
            //this.props.setValues(data)

            api.axiosPost("submitCode",data).then((res)=>{
                if(res.data.code === 1){
                    sessionStorage.setItem('phone1',values.phone)
                    //进入下一步
                    this.props.next()
                }else if(res.data.code ===0){
                    message.error(res.data.msg)
                }
            });
          }
        });
        
    };
    //验证手机号
    checkTel(e) {
        //与表单数据进行关联
        const {validateFields} = this.props.form;
        validateFields('phone', {force: true}, err => {
            const {flag} = this.shouldGoOn();
            if(!err && !flag) this.setState({canSendCode: false});
            else this.setState({canSendCode: true});
        })
    }

    //倒计60s
    count = () => {
        let { yztime } = this.state;
        let siv = setInterval(() => {
            if(yztime <= 0) {
                clearInterval(siv);　　//倒计时( setInterval() 函数会每秒执行一次函数)，用 clearInterval() 来停止执行:
                //与表单数据进行关联
                const {validateFields} = this.props.form;
                validateFields('phone', {force: true}, err => {
                    if(!err) this.setState({canSendCode: false});
                })
                this.setState({yztime: 60, codeText: false,canSendCode: false})
            }
            else {
                yztime--;
                this.setState({ yztime ,});
            }
        }, 1000);
    }
     
    //短信验证
    sendCode(){
        
        //与表单数据进行关联
        const {validateFields} = this.props.form;
        validateFields('phone', {force: true}, err => {
            if(!err){
                //发送验证码请求
                const {getFieldValue} = this.props.form;
                let data = JSON.stringify({phone: getFieldValue('phone'),code_type:'2'}) 
                //console.log(data);
                
                api.axiosPost("sendCode",data).then((res)=>{
                    //console.log(res);
                    if(res.data.code === 0){
                        message.info(res.data.msg)
                        this.setState({
                            codeText: false
                        })
                    }else if(res.data.code === 1){
                        this.setState({ codeText: true , send:true, canSendCode: true,secondText:true}, () => {
                            // 存入sessionStorage
                            const {getFieldValue} = this.props.form;
                            sessionStorage.setItem('phone', JSON.stringify({phone: getFieldValue('phone'), stameTime1: new Date().getTime()}))
                            this.count()
                        });
                        message.success('验证码已发送，请注意查收')
                    }
                    
                });
            }else{

            }
        })
    }
}

export default Form.create()(ForgetPwd)