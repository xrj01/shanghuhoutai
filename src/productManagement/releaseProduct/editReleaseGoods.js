import React from 'react';
import {Row,Col,Input,Button,Checkbox,Table,Upload, Icon, Modal,message,InputNumber,Spin ,Select} from "antd";
import EditorConvertToHTML from "./editorConvertToHTML";
import api from "./../../components/api";
import publicFn from "./../../components/public";
const Option = Select.Option;
export default class EditReleaseGoods extends React.Component{
    constructor(props) {
        super(props);
        const time = new Date().getTime();
        const article_number = `P${time}`;
        this.state={
            dataSource:[],
            columns:[
                {
                    title: <div><span className='color-red'>*</span>销售价格</div>,
                    dataIndex: 'address',
                    key: 'address',
                    render:(text,record)=>{
                        const {productPrice} = this.state;
                        return(
                            <span>
                                <InputNumber
                                    min={0}
                                    onChange={(value)=>{this.productPriceChange(record.sku,value,"price")}}
                                    value={productPrice[record.sku]["price"]}
                                /> 元
                            </span>
                        )
                    }
                },
                {
                    title: <div><span className='color-red'>*</span>库存</div>,
                    dataIndex: 'inventory',
                    key: 'inventory',
                    render:(text,record)=>{
                        const {productPrice} = this.state;
                        return(
                            <span>
                                <InputNumber
                                    min={0}
                                    onChange={(value)=>{this.productPriceChange(record.sku,value,"inventory")}}
                                    value={productPrice[record.sku]["inventory"]}
                                    formatter={value => { return value.toString().replace(/\./g, '') }}
                                    parser={value =>{ return value}}
                                />{this.state.util}
                            </span>
                        )
                    }
                },
                {
                    title: '操作',
                    dataIndex: 'age2',
                    key: 'age2',
                    render:(text,record)=>{
                        return(
                            <div className='cursor-pointer'>
                                <span onClick={()=>{this.deleteCombination(record)}}>删除</span>
                            </div>
                        )
                    }
                },
            ],
            previewVisible: false,
            previewImage: '',
            fileList: [[],[],[],[],[]],
            fileUpDomNum:[false,false,false,false,false],
            loading:false,

            tableTh:[],
            propertyList:[], //获取的属性列表
            selectClass:[],  //上级所选分类的值
            selectedAttribute:{}, //选中属性列表
            attributeKey:[],// 用来记录属性名字的key值

            SKUValue:[],//数组排列组合后的数据，用于生成SKU

            productPrice:{},  //商品每个属性组合的sku和价格


            content:"",  //商品介绍
            article_number:article_number, //商品货号
            util:"", //商品单位
            price:100000000, //商品最小价格
            title:"",//商品名称
            product_price:[], //商品每个属性组合的sku和价格

            productId:"", //商品id
            brand:{
                brand:false,
                index:"",
                value:""
            },
            signature:{} //上传文件的签名
        };
        this.boxChange = this.boxChange.bind(this);
        this.doCombination = this.doCombination.bind(this);
        this.generateSKU = this.generateSKU.bind(this);
        this.editorHtml = React.createRef();
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
    handleChange = (file ,index) => {
        if(!file.fileList.length) return;
        const {fileUpDomNum,fileList} = this.state;
        if(index !== 0){
            if(!fileList[index-1].length){
                message.error('图片需要按照顺序上传');
                return;
            }
        }
        fileUpDomNum[index] = !fileUpDomNum[index];
        this.setState({
            fileUpDomNum
        },()=>{this.goodsImg(file,index)});
    };
    //获取商品ID;
    getProductId=()=>{
        api.axiosPost("getProductId").then((res)=>{
            if(res.data.code == 1){
                this.setState({
                    productId:res.data.data
                },()=>{
                    this.getProductSign();
                })
            }
        })
    };
    //删除排列组合的某一条数据
    deleteCombination=(record)=>{
        const {dataSource,productPrice} = this.state;
        delete productPrice[record.sku];
        const newdataSource = dataSource.filter((item)=>{
            return item.sku != record.sku
        });
       this.setState({dataSource:newdataSource,productPrice})
    };

    //价格改变时执行函数
    productPriceChange=(sku,value,type)=>{
        const {productPrice} = this.state;
        productPrice[sku][type] = value;
        this.setState({productPrice})
    };
    //控制步骤条
    changeStep=(type)=>{
        this.props.changeStep(type)
    };
    // 获取签名接口
    getProductSign=(file,index,fn)=>{
        const {productId} = this.state;
        const merchantsId = sessionStorage.getItem("merchantsId");
        const data={
            id:productId,
            dir:publicFn.getProductSign('product',merchantsId)
        };
        api.axiosGet("getProductSign",data).then((res)=>{
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
    //得到三级分类的属性列表
    getParamMerchant=(id)=>{
        const data={id};
        api.axiosPost("getParamMerchant",data).then((res)=>{
            if(res.data.code == 1){
                const {columns,selectedAttribute,attributeKey} = this.state;
                const dataVal = res.data.data;
                //设置商品价格表格头部
                const tableTh = dataVal[0] && dataVal[0].name;
                tableTh && tableTh.map((item,index)=>{
                    if(dataVal[0] && dataVal[0].display[index]){
                        columns.unshift({
                            title:item,
                            dataIndex: item,
                            key: index,
                        });
                        selectedAttribute[item]=[];
                        attributeKey.push(item);
                    }
                });

                this.setState({
                    propertyList:dataVal,
                    columns,
                    attributeKey
                })
            }else{
                message.error(res.data.msg)
            }
        })
    };
    //属性选择框事件
    boxChange(e,attribute,attributeVal){
        const {selectedAttribute} = this.state;
        const setSelectedAttribute = selectedAttribute[attribute.attribute] ? selectedAttribute[attribute.attribute] : [];
        if(attribute.attributeKey == 0 && e.target.checked){
            this.setState({
                brand:{
                    brand:true,
                    index:attributeVal.attributeValKey,
                    value:attributeVal.attributeVal
                }
            })  //判断选中品牌
        }
        if(attribute.attributeKey == 0 && !e.target.checked){
            this.setState({
                brand:{
                    brand:false,
                    index:attributeVal.attributeValKey,
                    value:""
                }
            })  //判断取消选中品牌
        }
        if(e.target.checked){
            //将当前选择好的数据存入数组
            setSelectedAttribute.push({
                key:attributeVal.attributeVal,
                valueKey:attributeVal.attributeValKey,
                attributeKey:attribute.attributeKey,
                attribute:attribute.attribute
            });
            selectedAttribute[attribute.attribute] = setSelectedAttribute
        }else{
            selectedAttribute[attribute.attribute] = setSelectedAttribute.filter((item)=>{ return item.key != attributeVal.attributeVal });
        }
        this.setState({ selectedAttribute,loading:true },()=>{this.generateSKU()});
    };
    //数据生成sku
    async generateSKU(){
        const {selectedAttribute,attributeKey,selectClass,productPrice} = this.state;
        const level3Id = selectClass[2].id;
        const selectArr=[];
        const dataSource=[];
        const newProductPrice={};
        attributeKey.map((item)=>{
            if(selectedAttribute[item].length){
                selectArr.push(selectedAttribute[item]);
            }
        });
        //判断是否有选择的值
        if(selectArr.length){
            const SKUValue = await this.doCombination(selectArr);
            let key1 = '00'; // (表示属性一的属性值的索引)
            let key2 = '00'; // (表示属性二的属性值的索引)
            let key3 = '00'; // (表示属性三的属性值的索引)
            let key4 = '00'; // (表示属性四的属性值的索引)
            let key5 = '00'; // (表示属性五的属性值的索引)
            for(let i=0;i<SKUValue.length;i++){
                const sourceObj = {};
                SKUValue[i].map((item,index)=>{
                    switch (item.attributeKey) {
                        case 0:
                            key1 = publicFn.addZero(item.valueKey + 1);
                            break;
                        case 1:
                            key2 = publicFn.addZero(item.valueKey + 1);
                            break;
                        case 2:
                            key3 = publicFn.addZero(item.valueKey + 1);
                            break;
                        case 3:
                            key4 = publicFn.addZero(item.valueKey + 1);
                            break;
                        case 4:
                            key5 = publicFn.addZero(item.valueKey + 1);
                            break;
                    }
                    sourceObj[item.attribute] = item.key;
                    sourceObj.key = index + i;
                });
                const sku = `${level3Id}${key1}${key2}${key3}${key4}${key5}`;
                sourceObj.sku = sku;

                if(productPrice[sku]){
                    newProductPrice[sku]={price:productPrice[sku].price,inventory:productPrice[sku].inventory};
                }else{
                    newProductPrice[sku]={price:0,inventory:0};
                }
                dataSource.push(sourceObj)
            }
            this.setState({dataSource,productPrice:newProductPrice,loading:false});
        }else{
            this.setState({dataSource:[],productPrice:{},loading:false});
        }
    };
    //选中数据排列组合
    async doCombination(arr){
        let count = arr.length - 1; //数组长度(从0开始)
        let tmp = [];
        let totalArr = [];// 总数组
        return doCombinationCallback(arr, 0);//从第一个开始
        function doCombinationCallback(arr, curr_index) {
            for(let val of arr[curr_index]) {
                tmp[curr_index] = val;
                if(curr_index < count) {
                    doCombinationCallback(arr, curr_index + 1);
                }else{
                    totalArr.push(tmp);
                }
                let oldTmp = tmp;
                tmp = [];
                for(let index of oldTmp) {
                    tmp.push(index);
                }
            }
            return totalArr;
        }
    };
    //获取所选分类数据
    getClassDate=(level1Select,level2Select,level3Select)=>{
        let {selectClass} = this.state;

        if(level3Select !== selectClass[2]){
            this.stepEmptyDate();
            this.setState({propertyList:[]})
            this.getParamMerchant(level3Select.id)
        }
        selectClass = [level1Select,level2Select,level3Select];
        this.setState({ selectClass });
    };

    //富文本内容商品介绍
    content=(content)=>{
        this.setState({content})
    };
    //输入框改变事件
    inputChange=(type,value)=>{
        this.setState({
            [type]:value
        })
    };
    //点击保存
    save=()=>{
        const {content,util,productPrice,title,article_number,productId,fileList} = this.state;
        let  pic_count = 0;
        const product_price=[];
        const fileListLen = fileList.length;
        let {price} = this.state;
        let productPriceLen = Object.keys(productPrice);
        if(!content){message.error("商品详情不能为空");return }
        if(!productPriceLen.length){message.error('请选择相应的商品属性与价格');return false}
        for(let key in productPrice){
            if(productPrice[key].price == 0 || productPrice[key].inventory == 0){
                message.error("商品价格或者库存不能为0");
                return false;
            }
            if(price > productPrice[key].price){
                price = productPrice[key].price;
            }
            product_price.push({
                sku:key,
                price:productPrice[key].price,
                inventory:productPrice[key].inventory
            })
        }

        for(let i=0;i<fileListLen;i++){
            let j = i+1;
            if(j >= fileListLen-1) j = fileListLen-1;
            if(!fileList[i][0] && fileList[j][0]){
                message.error('图片需要按照顺序传递');
                return false;
            }
            if(fileList[i][0]){
                pic_count +=1;
            }
        }

        const data={
            pic_count,
            id:productId,
            product_price,
            util,
            content,
            title,
            price,
            article_number,
            class_id:this.state.selectClass[2].id
        };
        if(data.title.length < 3){
            message.error("看清楚规则进行填写");
            return false;
        }
        if(!data.title || !data.pic_count || !data.util ){
            message.error("信息填写不完整");
            return false;
        }
        api.axiosPost("addMerchant",data).then((res)=>{
            if(res.data.code == 1){
                this.saveOkEmptyDate();
                this.stepEmptyDate();
                this.props.selectClassDom.emptyDate();
                this.changeStep("+");
            }
        });
    };

    //图片删除
    deleteImg=(file,index)=>{
        const {fileList,productId} = this.state;
        const data={
            bucket:"cn-anmro",
            dir:publicFn.deleteImgDir('product'),
            file:`${file.name}`
        };
        return new Promise((resolve,reject)=>{
            api.axiosPost("getProductSignDelete",data).then((res)=>{
                if(res.status == 200){
                    resolve(true);
                    fileList[index] = [];
                    this.setState({fileList});
                }else{
                    resolve(false)
                }
            });
        });
    };

    //返回上一步时数据初始化
    stepEmptyDate=()=>{
        this.setState({
            dataSource:[],
            columns:[
                {
                    title: <div><span className='color-red'>*</span>销售价格</div>,
                    dataIndex: 'address',
                    key: 'address',
                    render:(text,record)=>{
                        const {productPrice} = this.state;
                        return(
                            <span>
                                <InputNumber
                                    min={0}
                                    onChange={(value)=>{this.productPriceChange(record.sku,value,"price")}}
                                    value={productPrice[record.sku]["price"]}
                                /> 元
                            </span>
                        )
                    }
                },
                {
                    title: <div><span className='color-red'>*</span>库存</div>,
                    dataIndex: 'inventory',
                    key: 'inventory',
                    render:(text,record)=>{
                        const {productPrice} = this.state;
                        return(
                            <span>
                                <InputNumber
                                    min={0}
                                    onChange={(value)=>{this.productPriceChange(record.sku,value,"inventory")}}
                                    value={productPrice[record.sku]["inventory"]}
                                    formatter={value => {return value.toString().replace(/\./g, '') }}
                                    parser={value =>{ return value}}
                                />{this.state.util}
                            </span>
                        )
                    }
                },
                {
                    title: '操作',
                    dataIndex: 'age2',
                    key: 'age2',
                    render:(text,record)=>{
                        return(
                            <div className='cursor-pointer'>
                                <span onClick={()=>{this.deleteCombination(record)}}>删除</span>
                            </div>
                        )
                    }
                },
            ],
            productPrice:{},
            selectedAttribute:{},
            SKUValue:[],
            attributeKey:[],
            brand:{
                brand:false,
                index:"",
                value:""
            }
        })
    };
    //添加成功后数据初始化
    saveOkEmptyDate=()=>{
        this.setState({
            content:"",  //商品介绍
            util:"", //商品单位
            price:1, //商品最小价格
            title:"",//商品名称
            product_price:[], //商品每个属性组合的sku和价格
            fileList: [[],[],[],[],[]],
            fileUpDomNum:[false,false,false,false,false],
            propertyList:[],
            brand:{ brand:false, index:"", value:"" }
        },()=>{
            this.editorHtml.current.stepEmptyDate();
        });

    };
    //添加图片地址
    goodsImg=(file,index)=>{
        const {signature,fileList,fileUpDomNum,productId} = this.state;
        publicFn.antdUpFile(file,signature,productId,index).then((res)=>{
            fileUpDomNum[index] = !fileUpDomNum[index];
           if(res.status == 'ok'){
               fileList[index] = [res.data];
               this.setState({
                   fileList
               })
           }
           this.setState({fileUpDomNum})
        }).catch((error)=>{
            this.getProductSign(file,index,this.goodsImg);
        });
    };
    render(){
        const {steps} = this.props;
        const { previewVisible, previewImage, fileList ,selectClass,propertyList,fileUpDomNum,brand,productId} = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        const editorHtml={
            content:this.content,
            signature:this.state.signature,
            getProductSign:this.getProductSign,
            productId
        };
        return(
                <div className='edit-release-goods-box'  style={{display: steps == 1 ? "block" : "none"}}>
                    <h4>商品基本信息</h4>
                    <Row className='line-height-30 margin-bottom-20'>
                        <Col span={5} className='text-right'>商品分类：</Col>
                        <Col span={19}>
                            {selectClass[0] && selectClass[0].name}
                            { selectClass[1] ? ` > ${selectClass[1].name}`: null}
                            { selectClass[2] ? ` > ${selectClass[2].name}` : null}
                            &emsp;&emsp;&emsp;
                            <span className='color-blue cursor-pointer' onClick={()=>{this.changeStep("-")}}>
                            <Icon type="edit" style={{fontSize:"16px"}}/> 修改
                        </span>
                        </Col>
                    </Row>
                    <Row className='line-height-30 margin-bottom-20'>
                        <Col span={5} className='text-right'> <span className='color-red'>*</span>商品名称：</Col>
                        <Col span={19}>
                            <Input placeholder='请输入商品名称' maxLength={50} onChange={(e)=>{this.inputChange('title',e.target.value)}} className='width-300' value={this.state.title}/>
                            <p>商品标题名称长度至少3个字符，最长不超过30个</p>
                        </Col>
                    </Row>
                    <Row className='line-height-30 margin-bottom-20'>
                        <Col span={5} className='text-right'> <span className='color-red'>*</span>商品单位：</Col>
                        <Col span={19}>
                            <Input placeholder='请输入商品单位' maxLength={4} value={this.state.util} onChange={(e)=>{this.inputChange('util',e.target.value)}} className='width-300'/>
                        </Col>
                    </Row>
                    <Row className='line-height-30 margin-bottom-20'>
                        <Col span={5} className='text-right'> <span className='color-red'>*</span>商品货号：</Col>
                        <Col span={19}>
                            {this.state.article_number}
                        </Col>
                    </Row>

                    <Spin spinning={this.state.loading} delay={100}>
                        <h4>商品交易信息</h4>
                        <Row className='line-height-30 margin-bottom-20'>
                            <Col span={5} className='text-right'> <span className='color-red'>*</span>商品属性：</Col>
                            <Col span={19}>
                                <div className="attribute-table-box">
                                    <ul>
                                        {
                                            propertyList && propertyList.map((item)=>{
                                                return item.name && item.name.map((property,k)=>{
                                                    if(item.display[k]){
                                                        return(
                                                            <li key={property}>
                                                                <span>{property}</span>
                                                                <div className="attribute-list">
                                                                    {
                                                                        item.val[0][k] && item.val[0][k].map((val,j)=>{
                                                                            return(
                                                                                <Checkbox key={val}
                                                                                          disabled={(brand.brand && brand.index !==j && k == 0 ? true : false)}
                                                                                    onChange={(e)=>{this.boxChange(e,{"attribute":property,"attributeKey":k,},{ "attributeVal":val, "attributeValKey":j})}} key={j}>
                                                                                    {val}
                                                                                </Checkbox>
                                                                            )
                                                                        })
                                                                    }
                                                                </div>
                                                            </li>
                                                        )
                                                    }
                                                })
                                            })
                                        }
                                    </ul>
                                </div>
                            </Col>
                        </Row>


                        <Row className='line-height-30 margin-bottom-20'>
                            <Col span={5} className='text-right'> <span className='color-red'>*</span>商品价格与库存：</Col>
                            <Col span={19}>
                                <Table  pagination={false}
                                        bordered
                                        dataSource={this.state.dataSource} columns={this.state.columns} />
                            </Col>
                        </Row>
                    </Spin>

                    <h4>商品图片及详情</h4>

                    <Row className='line-height-30 margin-bottom-20'>
                        <Col span={5} className='text-right'> <span className='color-red'>*</span>商品图片：</Col>
                        <Col span={19}>
                            <div className="goods-image-box">
                                {
                                    fileUpDomNum.map((item,index)=>(
                                        <div key={index} className="goods-image-list">
                                            <Spin spinning={item}>
                                                <Upload
                                                    accept='image/jpg, image/jpeg, image/png'
                                                    listType="picture-card"
                                                    fileList={fileList[index]}
                                                    beforeUpload={()=>{return false}}
                                                    onPreview={this.handlePreview}
                                                    onRemove={(file)=>{this.deleteImg(file,index)}}
                                                    onChange={(file)=>{this.handleChange(file,index)}}
                                                >
                                                    {fileList[index].length>=1 ? null : uploadButton}
                                                </Upload>
                                            </Spin>
                                            {index == 0 && <p style={{textAlign:"center",marginTop:"-13px"}}>主图</p>}
                                        </div>
                                    ))
                                }

                                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                </Modal>
                            </div>
                            <p>
                                1.支持jpg、jpeg、png格式上传或从图片空间中选择   2.尺寸在800x800像素以上、大小不超过1M的正方形图片   3.每种规格上传数量限制在5张
                            </p>
                        </Col>
                    </Row>

                    <Row className='line-height-30 margin-bottom-20'>
                        <Col span={5} className='text-right'><span className='color-red'>*</span>商品详情描述：</Col>
                        <Col span={19}>
                            <div className="editor-convert-box">
                                <EditorConvertToHTML {...editorHtml} ref={this.editorHtml}/>
                            </div>
                        </Col>
                    </Row>

                    <div className="step-edit-goods-box">
                        <Button type='primary' onClick={this.save}>
                            &emsp;&emsp;完成并发布产品&emsp;&emsp;
                        </Button>
                    </div>
                </div>
        )
    }

}