import React from 'react';
import { Form,Button,Row,Col,Input,Checkbox,Cascader,DatePicker,Radio,Upload,Icon,message,Modal,Spin } from 'antd';
import './supplement.scss';
import api from './../../../components/api'
import publicFn from './../../../components/public'
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/lib/date-picker/locale/zh_CN'; 
import 'moment/locale/zh-cn'; 
moment.locale('zh-cn'); 

const { TextArea } = Input;

// 文件转成base64
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
} 

class Supplement extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      merchant_id:'',//商户ID
      fileList:[],
      IDBackimg:[],
      IDPositive:[],
      previewVisible: false,
      previewImage: '',
      fileUpDomNum:[false,false,false,false,false],
      signature:{}, //上传文件的签名

      address_json: "",  // 省市区地址
      areaOption: [],   // 级联选择器数据
      ischeckbox: '',
      uploadLoading: false,
      checked: false,
      isdisable:false,
      endTime:null,
      areaOptionDefault:[],//省市区的值
      flag: true,       // 定义回显省市区的开关  true：可以继续请求子集 、 false：不在往下一级请求
      spinload:false,//进度条
      IDPositiveLoad: false,
      IDBackLoad:false,
    }
  }
  // 切换地址
  onAddressChange = (val) =>{
    //console.log(val)
  }
   
  //下一步
  next = () =>{
    this.props.next();
  }

  render() {
    const { previewVisible, previewImage, fileList,areaOption,IDBackimg,IDPositive } = this.state;
    
    const { getFieldDecorator } = this.props.form;
    const {formItemLayout} = this.props;
    //省市区
    const fieldNames = {label: 'name', value: 'id', children: 'children'};
    // 上传按钮
    const ElectronicBLUploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text" style={{color:'#2277E6'}}>上传</div>
      </div>
    );
    const IDPositiveBtn = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text" style={{color:'#2277E6'}}>上传正面</div>
      </div>
    )
    const IDBack = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text" style={{color:'#2277E6'}}>上传背面</div>
      </div>
    )
    const dateFormat = 'YYYY-MM-DD';
    const imageUrl = this.state.imageUrl;
    
    console.log(111,fileList.length);
    
    return(
      <div className="form">
        <img 
            ref='img1'
            style={{position:"fixed",left:"0",top:"0",opacity:"0",zIndex:"-1"}}
            src={`${publicFn.imgUrlBasic(sessionStorage.getItem('merchantsId'),sessionStorage.getItem('merchantsId'),0,Math.random(),'merchant')}`} alt=""/>
        <img 
            ref='img2'
            style={{position:"fixed",left:"0",top:"0",opacity:"0",zIndex:"-1"}}
            src={`${publicFn.imgUrlBasic(sessionStorage.getItem('merchantsId'),sessionStorage.getItem('merchantsId'),1,Math.random(),'merchant')}`} alt=""/>
        <img 
            ref='img3'
            style={{position:"fixed",left:"0",top:"0",opacity:"0",zIndex:"-1"}}
            src={`${publicFn.imgUrlBasic(sessionStorage.getItem('merchantsId'),sessionStorage.getItem('merchantsId'),2,Math.random(),'merchant')}`} alt=""/>

        <Form onSubmit={this.handleSubmit} {...formItemLayout}>
          <h4 className="title">入驻联系人信息</h4>
          {/* 联系人姓名 */}
          <Form.Item label="联系人姓名">
            {getFieldDecorator('contactName', {
              rules: [{ required: true, message: '请输入联系人姓名' },
                      {
                        pattern: /^[\u4e00-\u9fa5]{1,20}$/,
                        message: '请输入中文名字(不能超过20字)'
                      },
              ],
              validateTrigger: 'onBlur'
            })(
              <Input
                placeholder="请输入联系人姓名"
              />,
            )}
          </Form.Item>
          {/* 联系人手机 */}
          <Form.Item label="联系人手机">
            {getFieldDecorator('contactPhone', {
              initialValue:this.props.tel
            })(
              <Input
                disabled={true}
                placeholder="请输入联系人手机号码"
              />,
            )}
          </Form.Item>
          <h4 className="title">营业执照信息</h4>
          {/* 营业执照电子版 */}
          <Form.Item label="营业执照电子版"  extra="请上传清晰营业执照图片，系统识别公司信息自动进行填写（仅支持三证合一类型哦，图片大小不能超过2Mb）">
            {getFieldDecorator('ElectronicBL', {
              //valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
              rules: [
                { required: fileList.length?false:true, message: '请上传营业执照电子版图片，大小不超过2Mb' },
              ],
            })(
              <div>
                <Spin spinning={this.state.spinload} className='fileList-spin'>
                  <Upload
                      accept='image/jpg, image/jpeg, image/png, image/gif'
                      listType="picture-card"
                      beforeUpload={()=>{return false}}
                      
                      fileList={fileList}
                      onPreview={this.handlePreview}
                      onRemove={(file)=>{this.deleteImg(file,0)}}                    
                      onChange={(file)=>{this.handleChange(file, 0)}}
                      >
                      {fileList.length ? null : ElectronicBLUploadButton}
                  </Upload>
                </Spin>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              </div>
            )}
          </Form.Item>
          {/* 公司名称 */}
          <Form.Item label="公司名称">
            {getFieldDecorator('companyName', {
              rules: [{ required: true, message: '请输入公司名称' },
                      {
                        max: 20,
                        message: '请输入中文(不能超过20个字)'
                      }
              ],
              validateTrigger: 'onBlur'
            })(
              <Input
                placeholder="请输入公司名称"
                autoComplete='off'
              />,
            )}
          </Form.Item>
          {/* 营业执照所在地 */}
          <Form.Item label="营业执照所在地" notFoundContent="暂时没有数据">
            {getFieldDecorator('registrationAddress', {
              rules: [{ type: 'array',required: true, message: '请选择营业执照注册地址' }],
              initialValue : this.state.areaOptionDefault
            })(
              <Cascader 
                
                placeholder="请选择" 
                options={this.state.areaOption}
                fieldNames={fieldNames}
                loadData={this.loadData}
                onChange={this.onChange}
                changeOnSelect
                // displayRender={displayRender}
                
              />
            )}
          </Form.Item>
          {/* 具体地址 */}
          <Form.Item label="详细地址">
            {getFieldDecorator('detailAddress', {
              rules: [{ required: true, message: '请填写具体地址' },
                      /* {
                        pattern: /^[a-zA-Z\u4e00-\u9fa5]+$/,
                        message: '请输入中文或英文'
                      } */
              ],
              
            })(
              <Input
                placeholder="请填写具体地址"
                autoComplete='off'
              />,
            )}
          </Form.Item>
          {/* 法定代表人 */}
          <Form.Item label="法定代表人">
            {getFieldDecorator('NamelegalRepresentative', {
              rules: [{ required: true, message: '请输入法定代表人' },
                      {
                        pattern: /^[\u4e00-\u9fa5]{1,20}$/,
                        message: '请输入中文名字'
                      }
              ],
              validateTrigger: 'onBlur'
            })(
              <Input
                placeholder="请输入法定代表人"
                autoComplete='off'
              />,
            )}
          </Form.Item>
          {/* 注册资本（万元） */}
          <Form.Item label="注册资本（万元）">
            {getFieldDecorator('registeredCapital', {
              rules: [{ required: true, message: '请输入注册资本（万元）' },
                      {
                        pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
                        message: '请输入正确数字'
                      }
              ],
            })(
              <Input
                placeholder="请填写注册资本（万元）"
                autoComplete='off'
              />,
            )}
          </Form.Item>
          {/* 成立日期 */}
          <Form.Item label="成立日期">
          {getFieldDecorator('establishDate', {
            //initialValue:moment(this.state.time, dateFormat),
            rules: [{ type: 'object', required: true, message: '请选择成立日期' }],
          })(<DatePicker style={{width:'100%'}}/>)}
          </Form.Item>
          {/* 营业执照有效期 */}
          <Form.Item label="营业执照有效期" style={{ marginBottom: 0 }}>
            <div className='flex'>
              <Form.Item
                style={{ display: 'inline-block', width: 'calc(50% - 60px)' }}
              >
                {getFieldDecorator('startDate', {
                  //initialValue:moment(this.state.startTime, dateFormat),
                  rules: [{ type: 'object', required: true, message: '请选择开始日期' }],
                })(<DatePicker />)}
              </Form.Item>
                <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
              <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 60px)' }}>
                {getFieldDecorator('endDate', {
                  // initialValue:moment(this.state.endTime, dateFormat),
                  rules: [{ type: 'object', required: !this.state.isdisable, message: '请选择结束日期' }],
                })(<DatePicker  disabled={this.state.isdisable}/>)}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('Checkbox', {

                })(<span className='marginLF'><Checkbox onChange={this.onCheckAllChange} checked={this.state.checked}>长期</Checkbox></span> )}
              
              </Form.Item>
           </div>
          </Form.Item>
          {/* 经营范围： */}
          <Form.Item label="经营范围">
            {getFieldDecorator('scopeBusiness', {
              rules: [{ required: true, message: '请输入经营范围' }],
            })(
              <TextArea rows={3} />
            )}
          </Form.Item>
          {/* 统一社会信用代码 */}
          <Form.Item label="统一社会信用代码">
            {getFieldDecorator('UnifiedSocialCreditCode', {
              rules: [{ required: true, message: '请输入统一社会信用代码' }],
            })(
              <Input placeholder="请输入统一社会信用代码" autoComplete='off'/>
            )}
          </Form.Item>
          <Form.Item label="法人代表身份证电子版">
            <Row>
              <Col span={8}>
                {/* 法人代表身份证电子版正面 */}
                <Form.Item>
                  {getFieldDecorator('IDPositive', {
                    //valuePropName: 'fileList',
                    rules: [{ required: IDPositive.length?false:true, message: '请上传法人代表身份证电子版正面图片，大小不超过2Mb' }],
                    getValueFromEvent: this.normFile,
                  })(
                    <div>
                      <Spin spinning={this.state.IDPositiveLoad} className='IDPositive-spin'>
                        <Upload
                            accept='image/jpg, image/jpeg, image/png, image/gif'
                            listType="picture-card"
                            beforeUpload={()=>{return false}}
                            
                            fileList={IDPositive}
                            onPreview={this.handlePreview}
                            onRemove={(file)=>{this.deleteImg(file,1)}} 
                            onChange={(file)=>{this.handleChange(file, 1)}}
                            >
                            {IDPositive.length ? null :  IDPositiveBtn}
                        </Upload>
                      </Spin>
                      <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                      </Modal>
                    </div>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                {/* 法人代表身份证电子版反面 */}
                <Form.Item>
                  {getFieldDecorator('IDBack', {
                    //valuePropName: 'fileList',
                    rules: [{ required: IDBackimg.length?false:true, message: '请上传法人代表身份证电子版反面图片，大小不超过2Mb' }],
                    getValueFromEvent: this.normFile,
                  })(
                    <div>
                      <Spin spinning={this.state.IDBackLoad} className='IDBack-spin'>
                        <Upload
                            accept='image/jpg, image/jpeg, image/png, image/gif'
                            listType="picture-card"
                            beforeUpload={()=>{return false}}
                            
                            fileList={IDBackimg}
                            onPreview={this.handlePreview}
                            onRemove={(file)=>{this.deleteImg(file,2)}}
                            onChange={(file)=>{this.handleChange(file, 2)}}
                            >
                            {IDBackimg.length ? null : IDBack}
                        </Upload>
                      </Spin>
                      <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                      </Modal>
                    </div>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          
          <Form.Item wrapperCol={{span:16,offset:6}}>
            {/* <Button onClick={this.next}>上一步</Button> */}
            <Button 
              type="primary" 
              htmlType="submit"
              style = {{width:200}}
            >
              下一步，提交审核
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
  componentDidMount(){

    //商户ID
    this.setState({
      merchant_id : sessionStorage.getItem('merchantsId'),
    },()=>{
      // 获取签名接口
      this.getProductSign()
      //console.log(111,this.state.merchant_id);
      
    })
    //this.getProductSign()
    // 获取首次下拉数据
    this.getAreas(0)
    
    //获取补充信息
    this.getMerchantInfoById()

    
    //图片更新保留 删除(清除缓存) 
    const imgDom1 = this.refs.img1;
    const imgDom2 = this.refs.img2;
    const imgDom3 = this.refs.img3;

    const id = sessionStorage.getItem('merchantsId')

    setTimeout(()=>{
        if((imgDom1.offsetWidth > 0 && imgDom1.offsetHeight > 0)){
            this.setState({fileList : [
                {   uid:0, name:`${id}-0.jpg`, 
                    status:"done", 
                    
                    //url:`${publicFn.imgUrlBasic(id,id,0,Math.random(),'merchant')}`
                    url:`${publicFn.imgUrl(id,id,0,1000,'merchant',true)}`
                }
            ]});
        }else{
            this.setState({fileList:[]})
        }
        if((imgDom2.offsetWidth > 0 && imgDom2.offsetHeight > 0)){
          this.setState({IDPositive : [
              {   uid:1, name:`${id}-1.jpg`, 
                  status:"done", 
                  
                  //url:`${publicFn.imgUrlBasic(id,id,1,Math.random(),'merchant')}`
                  url:`${publicFn.imgUrl(id,id,1,1000,'merchant',true)}`
              }
          ]})
        }else{
            this.setState({IDPositive:[]})
        }
        if((imgDom3.offsetWidth > 0 && imgDom3.offsetHeight > 0)){
          this.setState({IDBackimg : [
              {   uid:2, name:`${id}-2.jpg`, 
                  status:"done", 
                  
                  //url:`${publicFn.imgUrlBasic(id,id,2,Math.random(),'merchant')}`
                  url:`${publicFn.imgUrl(id,id,2,1000,'merchant',true)}`
              }
          ]})
        }else{
            this.setState({IDBackimg:[]})
        }
    },500)
    /* this.getImg(0,'fileList')
    this.getImg(1,'IDPositive')
    this.getImg(2,'IDBackimg') */
    
    // 把当前步数存入session
    sessionStorage.setItem("current",1);
    sessionStorage.setItem("tel",this.props.tel);
  }
  componentWillUnmount(){
    sessionStorage.removeItem('current')
  }
  //图片回填
  getImg = (index,type)=>{
    const id = sessionStorage.getItem('merchantsId')
    let xmlHttp;
    // 创建XMLHttpRequest对象
    if (window.ActiveXObject) {
       xmlHttp = new window.ActiveXObject("Microsoft.XMLHTTP");
    } else if (window.XMLHttpRequest) {
       xmlHttp = new XMLHttpRequest();
    }
    // 去请求图片
    xmlHttp.open("Get",publicFn.imgUrl(id,id,index,1000,'merchant',true),false);
    xmlHttp.send();
    
    
    if(xmlHttp.status==404){
        this.setState({
            [type]: []
        })
    }else{
        this.setState({
            [type]:[
                {
                    uid: index,
                    name: `${id}-${index}.jpg`,
                    status: 'done',
                    url: publicFn.imgUrl(id,id,index,1000,'merchant',true),
                }
            ]
        },()=>{
            //console.log(2222,this.state.type);
        })
    }
  }
  // 获取首次下拉数据
  getAreas = (id,tar) => {
    const data = {
      parent_id	: id
    }
    if(id === 0){
      api.axiosPost('getArea',data).then( (res) => {
        //console.log(res)
        const {data} = res.data;
        if(res.data.code === 1){
        //   console.log('country',data)
          this.setState({
            areaOption:data
          })
        }
      })
    }else if(id && id>0) {
      api.axiosPost('getArea',data).then( (res) => {
        const {data} = res.data;
        // console.log('city','--------',data)
        if(res.data.code === 1){
          tar.loading = false;
          tar.children = [];
          data.map( (item) => {
            tar.children.push( item )
          })
          this.setState({
            areaOption : [...this.state.areaOption]
          })
        }
      })
    }
  }
  // 动态加载市区
  loadData = (selectedOptions)  => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    const id = targetOption.id;
    //console.log(targetOption,selectedOptions);
    targetOption.loading = true;
    if(selectedOptions.length){
      this.getAreas(id,targetOption)
    }
    /* if(selectedOptions.length > 1){
      this.getAreas(id,targetOption)
    } */
  }

  //获取级联数据
  onChange = (value, selectedOptions) => {
    //console.log(selectedOptions);
    if(selectedOptions.length){
      let location ={
        province_id : selectedOptions[0].id,
        province_name : selectedOptions[0].name,
        city_id : selectedOptions.length > 1 ? selectedOptions[1].id : "",
        city_name : selectedOptions.length > 1 ? selectedOptions[1].name : "",
        country_id : selectedOptions.length > 2 ? selectedOptions[2].id : "",
        country_name : selectedOptions.length > 2 ? selectedOptions[2].name : "",
      }
      this.setState({
        location : JSON.stringify(location)
      })
    }
  };


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
      });
  };
  //图片改变回调
  handleChange = (file, type) => {
      const fieldList = ['fileList', 'IDPositive','IDBackimg'];
      const {fileUpDomNum} = this.state;
      if(!file.fileList.length){return false;}

      if(type ==0){
        this.setState({
          fileUpDomNum,
          spinload:true
        },()=>{this.goodsImg(file,type, fieldList[type])});
      }else if(type ==1){
        this.setState({
          fileUpDomNum,
          IDPositiveLoad:true
        },()=>{this.goodsImg(file,type, fieldList[type])});
      }else if(type ==2){
        this.setState({
          fileUpDomNum,
          IDBackLoad:true
        },()=>{this.goodsImg(file,type, fieldList[type])});
      }
     
      
  };

  // 获取签名接口
  getProductSign=(file,index,fn)=>{
      let merchantsId = sessionStorage.getItem('merchantsId')
      //console.log(merchantsId);
      
      const data={
          id:merchantsId,
          dir:publicFn.getProductSign('merchant',merchantsId)
      };
      //console.log(data);
      
      api.axiosGet("getProductSign",data).then((res)=>{
          //console.log(data);
          //console.log(res.data);
          
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
  goodsImg=(file,index, field)=>{
      const {signature} = this.state;

      let merchant_id = sessionStorage.getItem('merchantsId')
      
      publicFn.antdUpFile(file,signature,merchant_id,index).then((res)=>{
        
        if(res.status == 'ok'){

          const newFile = [res.data]
          //console.log('field',field);
          this.setState({
              [field] : newFile,
              spinload:false,
              IDPositiveLoad:false,
              IDBackLoad:false
          })
          //console.log(newFile[0].url);
          
          // 发送请求，获取自动识别
          if(field == 'fileList'){
            let data = {image:newFile[0].url}
            api.axiosPost('autoReadLicense',data).then((res)=>{
              if(res.data.code === 1){
                //回填表单
                const datas = res.data.data
                const dateFormat = 'YYYY/MM/DD';
                const obj = {
                  //contactName : datas.contacter, //联系人
                  companyName : datas.company, //公司名称
                  // location : '', //营业执照地址（省市区）
                  //registrationAddress : (datas.license_address || []).map(item => item.name), //营业执照地址（省市区）
                  registrationAddress: undefined,
                  detailAddress : datas.license_address_info, //营业执照详细地址
                  establishDate : moment(`${datas.set_up_time}`,dateFormat), //成立日期
                  //Checkbox : datas.license_time_type==1? this.setState({checked:true,isdisable:true}):this.setState({checked:false,isdisable:false}), //是否长期 1长期   0非长期
                  startDate : moment(datas.license_time_begin),//营业执照有效期开始时间
                  //endDate:'',
                  NamelegalRepresentative : datas.represent_name, //法定代表人姓名
                  registeredCapital : '' ,//datas.registered_capital, //注册资本（万元）
                  scopeBusiness : datas.business_scope, //经营范围
                  UnifiedSocialCreditCode : datas.unified_social_credit_code, //统一社会信用代码
                }
                // 级联
                this.setState({areaOptionDefault:''})
                
                if(datas.license_time_type==1){
                  this.setState({checked:true,isdisable:true,ischeckbox:1}) //是否长期 1长期   0非长期
                  obj.endDate = null
                }else{
                  this.setState({checked:false,isdisable:false,endTime : datas.license_time_end})
                  obj.endDate = moment(datas.license_time_end);
                }
                this.props.form.setFieldsValue(obj)
              }else{
                message.error(res.data.msg)
              }
            })
          }
          
      
        }
      })
      .catch((error)=>{
          //console.log('error');
          this.getProductSign(file,index,this.handleChange);
      });
  };
  //图片删除
  deleteImg=(file,index)=>{
    let {fileList,IDBackimg,IDPositive,merchant_id} = this.state;
    const data={
        bucket:"cn-anmro",
        dir:publicFn.deleteImgDir("merchant"),
        file:`${file.name}`
    };
    return new Promise((resolve,reject)=>{
        api.axiosPost("getProductSignDelete",data).then((res)=>{
            if(res.status == 200){
                resolve(true);
                if(index===0){
                  fileList = [];
                  this.setState({fileList});
                }else if(index ===1){
                  IDPositive =[]
                  this.setState({IDPositive});
                }else if(index ===2){
                  IDBackimg =[]
                  this.setState({IDBackimg});
                }
                
                //api.axiosPost('updateProductCount',{product_id:merchant_id});
            }else{
                resolve(false)
            }
        });
    });
  };

  //多选框事件
  onCheckAllChange =(e)=>{
    this.setState({ischeckbox:''})
    //console.log(this.state.checked);
    
    if(this.state.checked){
      this.setState({checked:false})

    }
    if(e.target.checked){
      //清空结束时间
      this.props.form.resetFields('endDate')  
      this.setState({
          isdisable : true,
          checked : true
      }) 
    }else{
      this.setState({
        isdisable : false,
        checked : false
      })
    };
    
    
  }
  // 请求旧的省市区所需要的所有数据
  async getNextArea (id,obj,cityid,length){
    const {flag} = this.state;
    await api.axiosPost('getArea',{parent_id:id}).then( (res) => {
      const {data} = res.data;
      if(res.data.code === 1){
        data.map((subitem)=>{
          if(data.length == 0){
            return
          }
          obj.children.push({
          id: subitem.id,
          name: subitem.name,
          isLeaf: length==2?true : !flag,
         })
        })
        this.setState({
          areaOption : [...this.state.areaOption]
        })
      }
    })
    // 请求第三级--- 区---- 的数据
    if(flag){
      obj.children.map((aitem)=>{
        if(aitem.id === cityid){
          if(length>2){
            aitem.children = [];
            aitem.isLeaf = false;
          }
          this.setState({
            flag:false
          })
          this.getNextArea(aitem.id,aitem)
        }
      })
    }
  }
  // 提交表单的操作
  handleSubmit = (e) =>{
    
    
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      /* const {fileList,IDBackimg,IDPositive} = this.state
      if(fileList.length ===0){
        message.error('请上传营业执照电子版图片，大小不超过2Mb')
      } */
      if (!err) {
        // console.log('values.Checkbox', values.Checkbox,'-------' ,this.state.ischeckbox);
        //console.log('Received values of form: ', values);
        //提交表单，发送请求
        console.log(values.Checkbox);
        
        let formData = {
          //type : 1, //类型1 入驻（补充信息）
          merchant_id:`${sessionStorage.getItem('merchantsId')}`,//商户ID
          contacter_phone : `${values.contactPhone}`, //联系人手机号
          contacter : values.contactName, //联系人
          company : values.companyName, //公司名称
          license_address : this.state.location, //营业执照地址（省市区）
          license_address_info : values.detailAddress, //营业执照详细地址
          set_up_time : values.establishDate.format('YYYY-MM-DD'), //成立日期
          license_time_type : this.state.ischeckbox ? this.state.ischeckbox : values.Checkbox ? 1: 0, //是否长期 1长期   0非长期
          license_time_begin : values.startDate.format('YYYY-MM-DD'),//营业执照有效期开始时间
          license_time_end : values.endDate?values.endDate.format('YYYY-MM-DD'):'', //营业执照有效期截止时间
          represent_name : values.NamelegalRepresentative, //法定代表人姓名
          registered_capital : values.registeredCapital, //注册资本（万元）
          business_scope : values.scopeBusiness, //经营范围
          unified_social_credit_code : values.UnifiedSocialCreditCode, //统一社会信用代码
          
          
        }

        //console.log(formData);
        api.axiosPost('supplyInfo',formData).then( (res) => {
          //console.log(res);
          if(res.data.code === 1){
            message.success('提交成功')
            //进入下一步
            this.next()
          }else if(res.data.code === 0){
            message.error(res.data.msg)
          }
        })
        
      }else{
        return;
      }
    });
  } 
  //获取补充信息回填
  async getMerchantInfoById(){
    let list = {}
    let res = await api.axiosPost("getMerchantInfoById",list)
    const {data} = res || {}
    const {code , data:datas} = data || {}
    //console.log(datas);
        if(code === 1){
            //回填表单
            //this.setState({ time : datas.set_up_time , startTime : datas.license_time_begin,})
            //获取提交表单省市区数据
            if(datas.license_address.length){
              let location ={
                province_id : datas.license_address[0].id,
                province_name : datas.license_address[0].name,
                city_id : datas.license_address.length > 1 ? datas.license_address[1].id : "",
                city_name : datas.license_address.length > 1 ? datas.license_address[1].name : "",
                country_id : datas.license_address.length > 2 ? datas.license_address[2].id : "",
                country_name : datas.license_address.length > 2 ? datas.license_address[2].name : "",
              }
              this.setState({
                location : JSON.stringify(location)
              })
            }

            //省市区回填(省)
            const defaultValue = []
            datas.license_address.map((item,index)=>{
              if(item.id!=''){
                defaultValue.push(item.id)
              }
              this.setState({areaOptionDefault:defaultValue})
            })
            //省市区回填(市,区)
            this.state.areaOption.map((item,index)=>{
              if(item.id === defaultValue[0]){
                item.children = [];
                item.isLeaf = false;
                this.getNextArea(item.id,item,defaultValue[1],defaultValue.length)
              }else{
                this.setState({defaultValue:[]})
              }
            })
            const dateFormat = 'YYYY/MM/DD';
            const obj = {
              contactName : datas.contacter, //联系人
              companyName : datas.company, //公司名称
              // location : '', //营业执照地址（省市区）
              //registrationAddress : (datas.license_address || []).map(item => item.name), //营业执照地址（省市区）
              detailAddress : datas.license_address_info, //营业执照详细地址
              establishDate : moment(`${datas.set_up_time}`,dateFormat), //成立日期
              //Checkbox : datas.license_time_type==1? this.setState({checked:true,isdisable:true}):this.setState({checked:false,isdisable:false}), //是否长期 1长期   0非长期
              startDate : moment(datas.license_time_begin),//营业执照有效期开始时间
              //endDate:'',
              NamelegalRepresentative : datas.represent_name, //法定代表人姓名
              registeredCapital : datas.registered_capital, //注册资本（万元）
              scopeBusiness : datas.business_scope, //经营范围
              UnifiedSocialCreditCode : datas.unified_social_credit_code, //统一社会信用代码
            }
            if(datas.license_time_type==1){
              this.setState({checked:true,isdisable:true,ischeckbox:1}) //是否长期 1长期   0非长期
            }else{
              this.setState({checked:false,isdisable:false,endTime : datas.license_time_end})
              obj.endDate = moment(datas.license_time_end);
            }
            this.props.form.setFieldsValue(obj)
          
        }
        
  }
}

export default Form.create()(Supplement);