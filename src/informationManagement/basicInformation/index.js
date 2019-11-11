import React from "react";
import {Link} from 'react-router-dom';
import { Form, Input, Button,Upload, Icon, message, Row ,Col ,Modal,Spin} from 'antd';

import api from "./../../components/api";
import publicFn from "./../../components/public";
import "./index.scss";

class BasicInformation extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state={

            location:'',
            issubmit:true,
            visible: false,
            
            previewVisible: false,
            previewImage: '',
            merchant_id:"", //商品id
            fileList:[],
            fileUpDomNum:[false,false,false,false,false],
            signature:{},//上传文件的签名,
            loading: false,
           
        }
        
    }
    
    render(){
        const { previewVisible, previewImage, fileList } = this.state;
        //上传图片
        const uploadButton = (
            <div>
                <Icon icon type="plus"/>
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        const { TextArea } = Input;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 3 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 12 },
            },
        };
        //console.log(111,fileList);
        //console.log(this.state.merchant_id)
        return(
            <div className='basic-Information-box' style={this.state.issubmit?{display:'block'}:{display:'none'}}>

               <img 
                    ref='img'
                    style={{position:"fixed",left:"0",top:"0",opacity:"0",zIndex:"-1"}}
                    
                    src={`${publicFn.imgUrlBasic(sessionStorage.getItem('merchantsId'),sessionStorage.getItem('merchantsId'),9,Math.random(),'merchant')}`}
                    alt=""
                />
                

                <div className='basic-Information-title'> 
                    <span>商家中心 <Icon type="right" /> </span>
                    <span>信息管理 <Icon type="right" /> </span>
                    <span className="blue">基础信息</span>
                </div>
                {/* 表单 */}
                <div className='basic-Information-form'> 
                    
                    {/* 图片上传 */}
                    <div className='basic-Information-form-img'>
                        <span className='basic-Information-img-title'>店铺logo：</span>
                        <Spin spinning={this.state.loading} className='spin'>
                            <Upload
                                accept='image/jpg, image/jpeg, image/png, image/gif'
                                listType="picture-card"
                                beforeUpload={()=>{return false}}
                                
                                fileList={fileList}
            
                                onPreview={this.handlePreview}
                                onRemove={(file)=>{this.deleteImg(file)}}
                                onChange={(file)=>{this.handleChange(file)}}
                                >
                                {fileList.length ? null : uploadButton}
                            </Upload>
                        </Spin>
                        <div className='basic-img-text'>
                            <div>建议上传图片尺寸152x80px(不超过100kb,文件类型jpg、png格式)</div>
                        </div>
                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                    </div>
                    {/* 基本信息 */}
                    <div className='basic-Information-form-info'>
                        <div>
                            <span>用户名：</span>
                            <p>{this.state.userName}</p>
                        </div>
                        <div>
                            <span>公司名称：</span>
                            <p>{this.state.companyName}</p>
                        </div>
                        <div>
                            <span>联系人姓名：</span>
                            <p>{this.state.contactName}</p>
                        </div>
                        <div>
                            <span>联系人电话：</span>
                            <p>{this.state.contactTel}</p>
                        </div>
                        <div>
                            <span>公司地址：</span>
                            <p>{this.state.companyAddress}</p>
                        </div>
                        <div>
                            <span>详细地址：</span>
                            <p>{this.state.detailedAddress}</p>
                        </div>
                    </div>
                    <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                        <Form.Item label="经纬度">
                            <Row gutter={16}>
                                <Col span={9}>
                                    <Form.Item >
                                        {getFieldDecorator('lng', {
                                            rules: [{ required: true, message: '请填写经纬度!', }],
                                            
                                        })(
                                            <Input placeholder='经度' 
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={9}>
                                    <Form.Item>
                                        {getFieldDecorator('lat', {
                                            rules: [{ required: true, message: '请填写经纬度!', }],
                                            
                                        })(
                                            <Input placeholder='纬度' 
                                            />
                                        )}
                                    </Form.Item>
                                </Col> 
                                <a onClick={this.queryLatLong}>查询经纬度</a>   
                            </Row>
                        </Form.Item>
                        <Form.Item label="商家简介">
                            {getFieldDecorator('businessProfile', {
                                
                                })(<TextArea placeholder='请输入商家简介' style={{height:"130px"}} />
                            )}
                        </Form.Item>
                        <Form.Item wrapperCol={{ span: 12, offset: 3 }}>
                            <Button type="primary" htmlType="submit">
                                保存修改
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                {/* 弹窗 */}
                <Modal
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
                    
                </Modal>     
            </div>
            
        )
        
    }
    componentDidMount(){
        /* this.setState({
            visible : this.state.issubmit ? false : true
        }) */
        //获取基础信息
        this.getBasicInfo()

        
        //图片更新保留 删除(清除缓存) 
        const imgDom = this.refs.img;

        const id = sessionStorage.getItem('merchantsId')

        setTimeout(()=>{
            if((imgDom.offsetWidth > 0 && imgDom.offsetHeight > 0)){
                this.setState({fileList : [
                    {   uid:9, name:`${id}-9.jpg`, 
                        status:"done", 
                        url:`${publicFn.imgUrl(id,id,9,1000,'merchant',true)}`
                    }
                ]});
                
            }else{
                this.setState({fileList:[]})
            }
        },500)
        // let xmlHttp;
        // // 创建XMLHttpRequest对象
        // if (window.ActiveXObject) {
        //    xmlHttp = new window.ActiveXObject("Microsoft.XMLHTTP");
        // } else if (window.XMLHttpRequest) {
        //    xmlHttp = new XMLHttpRequest();
        // }
        // // 去请求图片
        // xmlHttp.open("Get",publicFn.imgUrl(id,id,9,1000,'merchant',true),false);
        // xmlHttp.send();
        
        
        // if(xmlHttp.status==404){
        //     this.setState({
        //         fileList: []
        //     })
        // }else{
        //     this.setState({
        //         fileList:[
        //             {
        //                 uid: '9',
        //                 name: `${id}-9.jpg`,
        //                 status: 'done',
        //                 url: publicFn.imgUrl(id,id,9,1000,'merchant',true),
        //             }
        //         ]
        //     },()=>{
        //         //console.log(2222,this.state.fileList);
        //     })
        // }
        
        
        
    }
    

    //图片大图转换为base64
    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    //关闭图片大图查看
    handleCancel = () => this.setState({ previewVisible: false });
    //查看图片大图
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await this.getBase64(file.originFileObj);
        }
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        },()=>{
            //console.log(this.state.previewImage);
            
        });
    };
    //图片改变回调
    handleChange = (file) => {
        const {fileUpDomNum,fileList,merchant_id} = this.state;
        //console.log(file);
        
        
        if(!file.fileList.length){return false;}
        this.setState({
            fileUpDomNum,
            loading:true
        },()=>{this.goodsImg(file,9)});
    };
    // 获取签名接口
    getProductSign=(file,index,fn)=>{
        const {merchant_id} = this.state;
        //console.log(merchant_id)
        const data={
            id:merchant_id,
            dir:publicFn.getProductSign('merchant',merchant_id)
            /* dir:`merchant/${merchant_id}` */
        };
        api.axiosGet("getProductSign",data).then((res)=>{
            //console.log(data);
            
            if(res.status == 200){
                this.setState({
                    signature:res.data
                },()=>{
                    if(file && fn){
                        fn(file,index);
                    }
                })
            }
        })
    };
    //添加图片地址
    goodsImg=(file,index)=>{
        const {signature,fileList,fileUpDomNum,merchant_id} = this.state;
        
        publicFn.antdUpFile(file,signature,merchant_id,index).then((res)=>{
           if(res.status == 'ok'){
               const newFile = [res.data]
               console.log('newFile',newFile);
               //sessionStorage.setItem('newFile',JSON.stringify(newFile))
               this.setState({
                   fileList:newFile,
                   loading:false
               })
           }
        }).catch((error)=>{
            this.getProductSign(file,index,this.goodsImg);
        });
    };
    //图片删除
    deleteImg=(file,index)=>{
        let {fileList,merchant_id} = this.state;
        const data={
            bucket:"cn-anmro",
            dir:publicFn.deleteImgDir("merchant"),
            file:`${file.name}`
        };
        return new Promise((resolve,reject)=>{
            api.axiosPost("getProductSignDelete",data).then((res)=>{
                if(res.status == 200){
                    resolve(true);
                    
                    fileList = [];
                    this.setState({fileList});;
                    
                    //api.axiosPost('updateProductCount',{product_id:merchant_id});
                    //sessionStorage.removeItem('newFile')
                }else{
                    resolve(false)
                }
            });
        });
    };

    //获取基础信息
    async getBasicInfo(){
        let list = {}
        let res = await api.axiosPost("getBasicInfor",list)

        // then(response => response.json())
        const {data} = res || {}
        const {code , data:datas} = data || {}
        
        //console.log(datas);

            if(code === 1){
                //回填表单
                this.props.form.setFieldsValue({
                    userName : datas.phone,
                    companyName : datas.company,
                    contactName : datas.contacter,
                    contactTel : datas.contacter_phone,
                    companyAddress : datas.license_address,
                    detailedAddress : datas.license_address_info,
                    businessProfile : datas.introduce,
                    lng : datas && datas.coordinates.split(',')[0],
                    lat : datas && datas.coordinates.split(',')[1]
                })
                //设置地址
                this.setState({
                    location : datas.license_address + datas.license_address_info,
                    merchant_id:datas.merchant_id,
                    
                    userName : datas.phone,
                    companyName : datas.company,
                    contactName : datas.contacter,
                    contactTel : datas.contacter_phone,
                    companyAddress : datas.license_address,
                    detailedAddress : datas.license_address_info,

                },()=>{
                    this.getProductSign()
                })
                
            }
            
    }
    //查询经纬度
    queryLatLong = () =>{
        const {location} = this.state;
        let BMap = window.BMap
        let myGeo = new BMap.Geocoder();
        myGeo.getPoint(location, (point)=>{
            //console.log(point);
            if (point) {
                //截取小数后6位
                this.props.form.setFieldsValue({
                    lng : (+point.lng || 0).toFixed(6),
                    lat : (+point.lat || 0).toFixed(6)
                })
            }else{
                message.error("输入的地址百度地图不能解析");
            }
        }, "中国");
            
    }
    //表单提交按钮
    handleSubmit = e => {
        e.preventDefault();
        
        
        this.props.form.validateFields((err, values) => {
          if (!err) {
            //console.log('Received values of form: ', values);
            let strlng = String(values.lng)
            let strlat = String(values.lat)
            let formdata = {
                coordinates : `${strlng},${strlat}`,
                introduce : values.businessProfile || ""
            }
            //console.log(formdata);
            
            api.axiosPost("editorBasicInfor",formdata).then((res)=>{
                //console.log(res);
                if(res.data.code === 1){
                    message.success('恭喜，保存成功！')
                    //清空表单
                    /* this.props.form.setFieldsValue({
                        lng:'',
                        lat:'',
                        businessProfile:''
                    }) */
                }
                
            });
          }
        });
    };
    //提交弹窗
    showModal = () => {
        this.setState({
            visible: false,
        });
    };
    
    handleOk = e => {
        //console.log(e);
        this.setState({
            visible: false,
        });
    };
    
    //级联
    onChange(value) {
        //console.log(value);
    }
    
}

export default Form.create()(BasicInformation)