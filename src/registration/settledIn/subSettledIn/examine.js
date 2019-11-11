import React from 'react';
import {Icon,Modal,message} from 'antd';

import api from './../../../components/api'
import publicFn from './../../../components/public'
import './examine.scss'

class Examine extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      tel:'',
      threeTel:'',
      fourTel:'',
    }

  }

  componentDidMount() {
    /* api.axiosPost('checkIsPass','').then( (res) => {
      console.log(res);
      setTimeout(() => {
        this.props.changeStatus(0)
      }, 3000)
    }) */
    
    //获取注册手机号
    let a = this.props.tel.toString().slice(7)
    let b = this.props.tel.toString().substring(0,3)
    this.setState({
      tel : this.props.tel,
      threeTel : b,
      fourTel : a,
      merchant_id :sessionStorage.getItem('merchantsId') //商户id
    })
    // 把当前步数存入session
    sessionStorage.setItem("current",2);
    sessionStorage.setItem("tel",this.props.tel);
  
    /* let data = {phone: `${this.props.tel}`}

    //检测商户状态请求
    api.axiosPost("checkState",data).then((res)=>{
      //console.log(res);
      if(res.data.data && res.data.data[0].state === 101){
        sessionStorage.setItem("current",3);
        //进入下一步
        this.next()
      }else if(res.data.data && res.data.data[0].state === -1){

        sessionStorage.setItem('reject',true)
        sessionStorage.setItem("audit_reson",res.data.data[0].audit_reason);

        
      }else if(res.data.data && res.data.data[0].state === 0){
        sessionStorage.setItem("current",2);
      }
      
    }); */


    }
    
  componentWillUnmount(){
    // ['current', 'tel'].forEach(item => sessionStorage.removeItem(item))
    sessionStorage.removeItem('current')
  }
  render() {
    //console.log(this.state.merchant_id);
    
    return(
      <div className="examine-box">
        <div className="examine-tips">
          <div className="examine-status">
            {/* <Icon className="icon" type="clock-circle" /> */}
            <img src={require('./../../../image/img_shz.png')} className="icon" alt='' />
            <span>审核中</span>
          </div>
          <p className="text">您好，<span className="username"><span>{this.state.threeTel}</span>****<span>{this.state.fourTel}</span></span></p>
          <p className="line">您已成功上传了相关资料，我们将在3-7个工作日进行审核，在此期间，您有任何疑问，可以电话联系我们：<span>028-83368980</span></p>
        </div>
        {/* <div className="uploadMaterial">
          <h4 className="tit">已上传资料</h4>
          <div className="img-box">
            <div>
              <img src={`${publicFn.imgUrl(this.state.merchant_id,this.state.merchant_id,0,244,'merchant',true)}`} alt=""/>
              
            </div>
            <div>
              <img src={`${publicFn.imgUrl(this.state.merchant_id,this.state.merchant_id,1,244,'merchant',true)}`} alt=""/> 
            </div>
            <div>
              <img src={`${publicFn.imgUrl(this.state.merchant_id,this.state.merchant_id,2,244,'merchant',true)}`} alt=""/> 
            </div>
          </div> */}
          <div className='authentication-Information-box-reg'>已上传资料</div>
            <div className='authentication-Information-data-reg'>
                <div className='authentication-content'>
                    
                    <div className='authentication-img-box'>
                        {/* <img src={`${api.imgUrl}merchant/9-0.jpg${publicFn.imgSize(200)}`} alt=""/> */}
                        <img src={`${publicFn.imgUrl(this.state.merchant_id,this.state.merchant_id,0,244,'merchant',true)}`} alt=""/>
                    </div>
                    <div className='ft333'>营业执照副本</div>
                </div>
                <div className='authentication-content'>
                    
                    <div className='authentication-img-box'>
                        <img src={`${publicFn.imgUrl(this.state.merchant_id,this.state.merchant_id,1,244,'merchant',true)}`} alt=""/> 
                    </div>
                    <div className='ft333'>法人身份证电子版正面</div>
                </div>
                <div className='authentication-content'>
                    
                    <div className='authentication-img-box border-right'>
                        <img src={`${publicFn.imgUrl(this.state.merchant_id,this.state.merchant_id,2,244,'merchant',true)}`} alt=""/> 
                    </div>
                    <div className='ft333'>法人身份证电子版反面</div>
                </div>
            </div>
          </div>
      /* </div> */
    )
  }
  //下一步
  next = () =>{
    this.props.next();
  }
  
}

export default Examine;