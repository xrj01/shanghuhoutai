import React from "react";
import {Link} from 'react-router-dom';
import {Row ,Col,Modal, Button,Icon } from 'antd';
import api from "./../../components/api";
import publicFn from "./../../components/public";
import "./index.scss";

export default class AuthenticationInformation extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state={
            
            issubmit:true,//提交状态
            issucceed:true,//认证状态
            visible:false,
            visible1:false,
            causeFailure:['企业法人身份证件，尚未加盖红章','企业法人身份证件，尚未加盖红章']
        }
        
    }
    componentDidMount(){
        this.setState({
            visible : this.state.issubmit ? false : true,
            merchant_id : sessionStorage.getItem('merchantsId')
           
        },()=>{this.setState({
            visible1 : this.state.visible ? false : this.state.issucceed ? false :true
            });
        })
    }
    render(){
        //console.log('merchant_id',this.state.merchant_id);
        
        return(
            <div className='authentication-Information-box' style={this.state.issubmit?{display:'block'}:{display:'none'}}>
                <div className='authentication-Information-title'> 
                    <span>商家中心 <Icon type="right" /> </span>
                    <span>信息管理 <Icon type="right" /> </span>
                    <span className="blue">认证信息</span>
                </div>
                {/* 通过认证 */}
                <div style={this.state.issucceed?{display:'block'}:{display:'none'}} className='authentication-Information-succeed'>
                    <div className='authentication-Information-info' >
                        <img src={require('./../../image/account.png')} style={{height:'30px'}} alt=''/>
                        {/* <Icon type="check-circle" className='authentication-icon' /> */}
                        <div className='green'>您的企业资质已通过认证</div>
                    </div>
                    <div className='authentication-Information-box ft333'>已认证资料</div>
                    <div className='authentication-Information-data'>
                        <div className='authentication-content'>
                            <div className='ft333'>营业执照电子版本</div>
                            <div className='authentication-img-box'>
                                {/* <img src={`${api.imgUrl}merchant/9-0.jpg${publicFn.imgSize(200)}`} alt=""/> */}
                                <img src={`${publicFn.imgUrl(this.state.merchant_id,this.state.merchant_id,0,244,'merchant',true)}`} alt=""/>
                            </div>
                        </div>
                        <div className='authentication-content'>
                            <div className='ft333'>法人身份证电子版（正面）</div>
                            <div className='authentication-img-box'>
                                <img src={`${publicFn.imgUrl(this.state.merchant_id,this.state.merchant_id,1,244,'merchant',true)}`} alt=""/> 
                            </div>
                        </div>
                        <div className='authentication-content'>
                            <div className='ft333'>法人身份证电子版（反面）</div>
                            <div className='authentication-img-box border-right'>
                                <img src={`${publicFn.imgUrl(this.state.merchant_id,this.state.merchant_id,2,244,'merchant',true)}`} alt=""/> 
                            </div>
                        </div>
                    </div>
                </div>
                {/* 认证失败 */}
                {/* <div className='authentication-failure' style={this.state.issucceed?{display:'none'}:{display:'block'}}>
                    <Row type='flex' align='middle'>
                        <Col span={2}><img src={require('./../../image/logo.png')} className=''></img></Col>
                        <Col span={13} className='ml10'>
                            <div className='red'>您的账户认证信息，审核失败</div>
                            <div className='mt10'>您可以：重新编辑认证信息（认证成功后方可使用，更多功能）</div>
                        </Col>
                        <Col span={8}>
                            <Link to='/'>编辑资料</Link>
                        </Col>
                    </Row>
                </div> */}
                {/* 认证弹窗 */}
                {/* <Modal
                    //title="Basic Modal"
                    visible={this.state.visible1}
                    onOk={this.handleOk1}
                    onCancel={this.handleCancel1}
                    okText = '前往编辑企业信息'
                    okType = 'danger'
                    >
                    <div className='authentication-failure-modal'>
                        <div className='modal-ft'>
                            非常抱歉，您的企业资质审核失败 <span className='modal-color'>(此功能，暂不可用)</span>
                        </div>
                        <div className='modal-color modal-margin'>
                            失败原因：
                        </div>
                        <div className='authentication-cause-failure'>
                            {this.state.causeFailure.map((item,index)=>{
                                return(
                                    <div>{item}</div>
                                )
                            })}
                        </div>
                    </div>
                    
                </Modal> */}
                {/* 提交弹窗 */}
               {/*  <Modal
                    //title="Basic Modal"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText = '前往补充企业信息'
                    okType = 'danger'
                    >
                    <div className='public-model'>
                        <div>
                            非常抱歉，您当前账户，尚未提交商家信息 <span className='modal-color'>(此功能，暂不可用)</span>
                        </div>
                    </div>
                    
                </Modal>      */}                
            </div>
        )
        
    }
    
    //认证弹窗
    /* showModal1 = () => {
        this.setState({
            visible1: false,
        });
    };
    
    handleOk1 = e => {
        console.log(e);
        this.setState({
            visible1: false,
        });
    };
    
    handleCancel1 = e => {
        console.log(e);
        this.setState({
            visible1: false,
        });
    }; */
    


}