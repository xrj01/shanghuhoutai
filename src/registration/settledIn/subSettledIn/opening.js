import React from 'react';
import {Form,Buttom,Icon} from 'antd';
import {Link} from 'react-router-dom';
import api from './../../../components/api'
import './opening.scss';

class Opening extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      tel:'',
      threeTel:'',
      fourTel:''
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
      merchant_id :this.props.merchant_id //商户id
    })
    // 把当前步数存入session
    sessionStorage.setItem("current",3);
    sessionStorage.setItem("tel",this.props.tel);
    //发送请求
    api.axiosPost("updateState",{}).then((res)=>{
      //console.log(res);
      
    });
    
  }
  componentWillUnmount(){
    sessionStorage.removeItem('current')
  }
  render() {
    return(
      <div>
        <div className="opening-box">
          <div className="opening-tips">
            <div className="opening-status">
              {/* <Icon className="icon iconFails" type="check-circle" /> */}
              <img src={require('./../../../image/img_shtg.png')} className="icon" alt='' />
              <span>审核通过</span>
            </div>
            <p className="text">您好<span className="username"><span>{this.state.threeTel}</span>****<span>{this.state.fourTel}</span></span>，您已成功开通店铺</p>
            <div className="line">
              <Link to='/home' >您可以点击此处，进入商家中心</Link>
            </div>
            
          </div>
        </div>
      </div>
    )
  }
}

export default Form.create()(Opening);