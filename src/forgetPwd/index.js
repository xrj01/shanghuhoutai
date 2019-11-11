import React from 'react';
import {Steps, Button, message,Row,Col,Form } from 'antd';
import {Link} from 'react-router-dom';
import VerifyInfo from './verifyInfo.js'
import SetNewPassword from './setNewPassword.js'
import SetSucceed from './setSucceed'
import "./index.scss";
export default class ForgetPwd extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      current:0,
    }
  }
  componentDidMount(){
    
    //刷新页面 保持当前步数
    let num = JSON.parse(sessionStorage.getItem('current'))
    //console.log(num);
    if(num){
      this.setState({
        current:num
      })
    }else{
        
    }
    
  }
  render() {
    const {Step} = Steps; 
    const {current} = this.state;

    const subSettledProps = {
      current : this.state.current,
      next : this.next,
    }
   
    const setCurrent = (type) => {
      //value 就是子组件传回的数据
      //console.log(11111,type);
      this.setState({
        current:type
      },()=>{
        sessionStorage.setItem('current',JSON.stringify(this.state.current))
      })
      
    }
    const steps = [
      {
        title: '验证信息',
        content: (<VerifyInfo {...subSettledProps}/>)
      },
      {
        title: '设置新密码',
        content: (<SetNewPassword {...subSettledProps}/>)
      },
      {
        title: '完成',
        content: (<SetSucceed {...subSettledProps} setCurrent={setCurrent}/>)
      },
  
    ]
    return(
      <div className='forgetPwd-box'>
        {/* 头部 */}
        <div className='forgetPwd-box-header'>
            <div className='forgetPwd-box-nav'>
                <div>
                    <img src={require(`./../image/logo1.png`)} style={{width:'128px',height:'42px'}} alt=""/>
                    <a href="http://www.tdsc360.com/mall/">首页</a>
                </div>
                <Link to="/">返回登录</Link>
            </div>   
        </div>
        {/* 内容 */}
        <div className='forgetPwd-box-container'>
          <div className='forgetPwd-container-title'>重置密码</div>
          <div className='forgetPwd-sub-container'>
            {/* 步骤条  */}
            <Steps current={current} labelPlacement='vertical'>
                {steps.map(item => (
                    <Step key={item.title} title={item.title}/>
                ))}
            </Steps>
            <div>{steps[current].content}</div>

          </div>
        </div>
      </div>
    )
  }
  //下一步
  next = () =>{
    const current = this.state.current + 1;
    
    this.setState({ current });
    //console.log(current);
    sessionStorage.setItem('current',JSON.stringify(current))
    sessionStorage.removeItem('phone')
  }
}