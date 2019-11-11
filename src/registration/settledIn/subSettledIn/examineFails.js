import React from 'react';
import {Form,Buttom,Icon} from 'antd';
import './examine.scss'
import supplement from './supplement';

class ExamineFails extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      threeTel:'',
      fourTel:''
    }

  }
  componentDidMount(){
    
    
    //获取注册手机号
    let a = this.props.tel.toString().slice(7)
    let b = this.props.tel.toString().substring(0,3)
    this.setState({
      tel : this.props.tel,
      threeTel : b,
      fourTel : a,
      merchant_id :this.props.merchant_id, //商户id
      audit_reson : sessionStorage.getItem("audit_reson")?sessionStorage.getItem("audit_reson"):this.props.audit_reson
    })
    // 把当前步数存入session
    sessionStorage.setItem("current",2);
    sessionStorage.setItem("tel",this.props.tel);
    sessionStorage.setItem("reject",true);
  }
  componentWillUnmount(){
    sessionStorage.removeItem('current')
    sessionStorage.removeItem('reject')
    
  }
  render() {
    return(
      <div className="examine-box">
        <div className="examine-tips">
          <div className="examine-status">
            {/* <Icon className="icon iconFails" type="exclamation-circle" /> */}
            <img src={require('./../../../image/img_bh.png')} className='icon' alt=''/>
            <span>审核驳回</span>
          </div>
          <p className="text">非常抱歉<span className="username"><span>{this.state.threeTel}</span>****<span>{this.state.fourTel}</span></span></p>
          <p className="line">您已上传的相关资料，未达入驻条件,若您对审核结果，有任何疑问，可以电话联系我们： <span>028-83368980</span></p>
        </div>
        <div className="reject">
          <div className="reject-reason">
            <span>驳回原因：</span>
            {/* <span style={{color:'red'}}>{this.state.audit_reson}</span> */}
          </div>
          <div className="reEdit">
            <Icon type="form" />&nbsp;<span onClick={this.supplement.bind(this)}>重新编辑</span>
          </div>
        </div>
        <div className="reject border">
          <span>{this.state.audit_reson}</span>
        </div>
      </div>
    )
  }
  //重新编辑
  supplement(){
    this.props.changeSupplement({current:1,token:sessionStorage.getItem('token')})
    //console.log(2222,sessionStorage.getItem('token'));
    sessionStorage.removeItem('audit_reson')
  }
}

export default ExamineFails;