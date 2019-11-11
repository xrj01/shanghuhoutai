import React from 'react';
import {Steps, Button, message,Row,Col,Form } from 'antd';
import Reg from './subSettledIn/reg';
import Supplement from './subSettledIn/supplement';
import Examine from './subSettledIn/examine';
import Opening from './subSettledIn/opening';
import ExamineFails from './subSettledIn/examineFails';
import api from './../../components/api'
const {Step} = Steps; 

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

export default class Registration extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      current:0,
      reject:false,
      merchant_id:'',//商户ID
      tel:'',//注册手机，
      audit_reson:''
    }
  }
  componentDidMount(){
    let data = {phone: `${this.props.data.tel || sessionStorage.getItem('tel')}`}

    
    //检测商户状态请求
    if(sessionStorage.getItem('current') ==2){
      api.axiosPost("checkState",data).then((res)=>{
        //console.log(res);
        if(res.data.data && res.data.data[0].state === 101){
          
          this.setState({current:3,reject:false})
          
        }else if(res.data.data && res.data.data[0].state === -1){
  
          this.setState({current:2,reject:true,audit_reson:res.data.data[0].audit_reason})
          sessionStorage.setItem("audit_reson",res.data.data[0].audit_reason);
  
          
        }else if(res.data.data && res.data.data[0].state === 0){
          this.setState({current:2,reject:false})
        }
        
      });
    }
    
    //获取session里面的当前步数
    
    
    this.setState({
      current:+this.props.data.current || +sessionStorage.getItem('current'),
      tel : +this.props.data.tel || +sessionStorage.getItem('tel'),
      reject :this.props.data.reject || false || sessionStorage.getItem('reject'),
      merchant_id : this.props.data.merchant_id || '',
    })
    //console.log(this.props);
    
  }
  //进入下一步
  next = () =>{
    const current = this.state.current + 1;
    this.setState({ current });
  }
  //返回上一步
  prev = () =>{
    const current = this.state.current - 1;
    this.setState({ current });
  }
  //判断审核成功还是失败
  changeStatus = (type) => {
    const obj = type === 1 ? {current: 3} : {reject: true}
    this.setState(obj)
  }
  //重新编辑
  changeSupplement = (type) => {
    
    this.setState({
      current: type.current,
      reject:false,
    })
  }
  render() {
    const {current} = this.state;

    const subSettledProps = {
      formItemLayout : formItemLayout,
      tailFormItemLayout : tailFormItemLayout,
      current : this.state.current,
      next : this.next,
      prev : this.prev,
      merchant_id : this.state.merchant_id,
      tel : this.state.tel,
      audit_reson :this.state.audit_reson
    }
    //商户账号和ID
    const setValues = (value) => {
      //value 就是子组件传回的数据
      //console.log(3333,value);
      this.setState({
        merchant_id:value.merchant_id,
        tel : value.tel
      })
      
    }
    const steps = [
      {
        title: '注册账号',
        icon: (<img width={56} src={require('../../image/reg.png')} />),
        iconActive: (<img width={56} src={require('../../image/reg-active.png')} />),
        content: (<Reg {...subSettledProps} setValues={setValues}/>)
      },
      {
        title: '补充信息',
        icon: (<img width={56} src={require('../../image/supplement.png')} />),
        iconActive: (<img width={56} src={require('../../image/supplement-active.png')} />),
        content: (<Supplement {...subSettledProps}/>)
      },
      {
        title: '提交审核',
        icon: (<img width={56} src={require('../../image/examine.png')} />),
        iconActive: (<img width={56} src={require('../../image/examine-active.png')} />),
        content: (<Examine changeStatus={this.changeStatus} {...subSettledProps} />),
        contentReject: (<ExamineFails {...subSettledProps} changeSupplement={this.changeSupplement}/>)
      },
      {
        title: '店铺开通',
        icon: (<img width={56} src={require('../../image/opening.png')} />),
        iconActive: (<img width={56} src={require('../../image/opening-active.png')} />),
        content: (<Opening {...subSettledProps}/>)
      },
    ]
    return(
      <div>
          <div className="step-box">
            <Steps current={current} labelPlacement="vertical ">
              {steps.map((item,i) => (
                <Step 
                  key={item.title} 
                  title={item.title}
                  icon={current-i >= 1 || current === i ? item.iconActive : item.icon }
                  />
              ))}
            </Steps>
          </div>
          <div className="form-box">
              {
                this.state.reject ? steps[current].contentReject : steps[current].content
                
              }
          </div>
      </div>
    )
  }
}