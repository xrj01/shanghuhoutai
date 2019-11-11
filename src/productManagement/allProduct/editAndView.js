import React from 'react';
import {
    Row,
    Col,
    Input,
    Button,
    Checkbox,
    Table,
    Upload,
    Icon,
    Modal,
    message,
    InputNumber,
    Spin,
    Breadcrumb, Select
} from "antd";
import EditorConvertToHTML from "./editorConvertToHTML";
import api from "./../../components/api";
import publicFn from "./../../components/public";
import './index.scss';
import {createHashHistory} from "history";
const Option = Select.Option;
const history = createHashHistory();
export default class EditReleaseGoods extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            dataSource:[],
            columns:[
                {
                    title: <div><span className='color-red'>*</span>销售价格</div>,
                    dataIndex: 'address',
                    key: 'address',
                    render:(text,record)=>{
                        const {productPrice,isEdit} = this.state;
                        return(
                            <span>
                                <InputNumber
                                    disabled={!isEdit}
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
                        const {productPrice,isEdit} = this.state;
                        return(
                            <span>
                                <InputNumber
                                    min={0}
                                    disabled={!isEdit}
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
                        const {isEdit} = this.state;
                        return(
                            <div className='cursor-pointer'>
                                <span className={!isEdit ? "color-gray" : ""} onClick={()=>{isEdit && this.deleteCombination(record)}}>删除</span>
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
            selectedAttribute:{}, //选中属性列表
            attributeKey:[],// 用来记录属性名字的key值
            SKUValue:[],//数组排列组合后的数据，用于生成SKU
            productPrice:{},  //商品每个属性组合的sku和价格
            editProductPrice:{},//存储以前商品价格
            content:"",  //商品介绍
            article_number:"", //商品货号
            util:"", //商品单位
            price:100000000, //商品最小价格
            title:"",//商品名称
            product_price:[], //商品每个属性组合的sku和价格
            productId:"", //商品id
            signature:{}, //上传文件的签名
            pic_count:"", //图片张数
            class_id:"",//三级分类id
            areProductPrice:[],  //修改商品时已存在的suk
            attribute:{},
            isEdit:false,
            class_name_1:"",
            class_name_2:"",
            class_name_3:"",
            merchantsId:"",
            brand:{ brand:false, index:"", value:"" }
        }
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
    componentDidMount() {
        const productId = JSON.parse(publicFn.getSession("productId"));
        const merchantsId = JSON.parse(publicFn.getSession("merchantsId"));
        this.getProductSign();
        this.getProductInfo(productId.id,merchantsId);
        this.setState({productId:productId.id,isEdit:productId.isEdit,merchantsId})
    }
    //获取当前商品详细信息
    getProductInfo=(product_id,merchantsId)=>{
        const data={ product_id:product_id };
        const editorHtmlDom = this.refs.editorHtml;
        api.axiosPost("get_product_info",data).then((res)=>{
            if(res.data.code == 1){
                const editProductPrice = {};
                const data = res.data.data;
                const pic_count = data.pic_count;
                const {fileList} = this.state;
                const areProductPrice = data.product_price;

                const selectSku = [];
                const attribute={
                    1:{},//属性1所选的值
                    2:{},//属性2所选的值
                    3:{},//属性3所选的值
                    4:{},//属性4所选的值
                    5:{},//属性5所选的值
                };
                //单选框默认选中的数据
                areProductPrice && areProductPrice.map((item)=>{
                    const newSku = ""+item.sku;
                    const pushSku = newSku.substring(7);
                    editProductPrice[item.sku] = {
                        price:item.price,
                        inventory:item.inventory
                    };
                    selectSku.push(pushSku);
                    selectSku.map((itemSku)=>{
                        attribute[1][itemSku.substring(0,2)]=1;
                        attribute[2][itemSku.substring(2,4)]=1;
                        attribute[3][itemSku.substring(4,6)]=1;
                        attribute[4][itemSku.substring(6,8)]=1;
                        attribute[5][itemSku.substring(8)]=1;
                    })
                });

                //获取商品图片
                for(let i=0;i<pic_count;i++){
                    const imgSize = publicFn.imgSize("100",true);
                    const imgList=[
                        {
                            uid: i,
                            name: `${product_id}-${i}`,
                            status: 'done',
                            url: publicFn.imgUrl(merchantsId,product_id,i,1000,'product',true),
                        }
                    ];
                    fileList[i] = imgList
                }

                //富文本框
                editorHtmlDom.upHtml(data.content);
                this.setState({
                    article_number:data.article_number,
                    title:data.title,
                    util:data.util,
                    content:data.content,
                    class_id:data.class_id,
                    fileList,
                    areProductPrice,
                    attribute,
                    editProductPrice,
                    class_name_1:data.class_name_1,
                    class_name_2:data.class_name_2,
                    class_name_3:data.class_name_3,
                },()=>{
                    this.getParamMerchant(data.class_id);
                });
            }
        });
    };
    //得到三级分类的属性列表
    getParamMerchant=(id)=>{
        const data={id};
        api.axiosPost("getParamMerchant",data).then((res)=>{
            if(res.data.code == 1){
                const {columns,selectedAttribute,attributeKey,attribute} = this.state;
                const dataVal = res.data.data;
                //设置商品价格表格头部
                const tableTh = dataVal[0] && dataVal[0].name;
                tableTh && tableTh.map((item,index)=>{
                    if(dataVal[0].display[index]){
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
                });
                dataVal && dataVal.map((item)=>{
                    item.name && item.name.map((property,k)=>{
                        if(item.display[k]){
                            item.val[0][k] && item.val[0][k].map((val,j)=>{
                                if(attribute[k+1][publicFn.addZero(j+1)]){
                                    this.boxChange(true,{"attribute":property,"attributeKey":k,},{ "attributeVal":val, "attributeValKey":j})
                                }
                            })
                        }
                    })
                })
            }
        })
    };
    //价格改变时执行函数
    productPriceChange=(sku,value,type)=>{
        const {productPrice} = this.state;
        productPrice[sku][type] = value;
        this.setState({productPrice})
    };
    // 获取签名接口
    getProductSign=(file,index,fn)=>{
        const {productId} = this.state;
        const merchantsId = JSON.parse(publicFn.getSession("merchantsId"));
        const data={
            id:productId,
            dir:publicFn.getProductSign(`product`,merchantsId)
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
    //属性选择框事件
    boxChange=(checked,attribute,attributeVal)=>{
        const {selectedAttribute} = this.state;
        const setSelectedAttribute = selectedAttribute[attribute.attribute] ? selectedAttribute[attribute.attribute] : [];
        if(attribute.attributeKey == 0 && checked){ //判断选中品牌
            this.setState({
                brand:{ brand:true, index:attributeVal.attributeValKey, value:attributeVal.attributeVal }
            })
        }
        if(attribute.attributeKey == 0 && !checked){ //判断取消选中品牌
            this.setState({
                brand:{ brand:false, index:attributeVal.attributeValKey, value:"" }
            })
        }
        if(checked){
            //将当前选择好的数据存入数组
            setSelectedAttribute.push({
                key:attributeVal.attributeVal,
                valueKey:attributeVal.attributeValKey,
                attributeKey:attribute.attributeKey,
                attribute:attribute.attribute
            });
            selectedAttribute[attribute.attribute] = setSelectedAttribute;
        }else{
            selectedAttribute[attribute.attribute] = setSelectedAttribute.filter((item)=>{ return item.key != attributeVal.attributeVal });
        }
        this.setState({ selectedAttribute,loading:true },()=>{this.generateSKU()});
    };
    //数据生成sku
    generateSKU=()=>{
        const {selectedAttribute,attributeKey,productPrice,class_id,editProductPrice} = this.state;
        const level3Id = class_id;
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
            const SKUValue = this.doCombination(selectArr);
            // sku 组成逻辑为 三级分类ID + 当前选择数据的索引值 00 00 00 00 00 索引值从1开始 没有则用零不够10位
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
                if(editProductPrice[sku]){
                    newProductPrice[sku]={
                        price:productPrice[sku] ? productPrice[sku].price : editProductPrice[sku].price,
                        inventory:productPrice[sku] ? productPrice[sku].inventory : editProductPrice[sku].inventory};
                }
                else{
                    // delete newProductPrice[sku]
                    newProductPrice[sku]={
                        price:0,
                        inventory:0
                    }
                }
                dataSource.push(sourceObj);
            }
            this.setState({dataSource,productPrice:newProductPrice,loading:false});
        }else{
            this.setState({dataSource:[],productPrice:{},loading:false});
        }
    };
    //选中数据排列组合算法
    doCombination=(arr)=>{
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
        const {content,util,productPrice,title,article_number,productId,fileList,isEdit,class_id} = this.state;
        const product_price = [];
        if(!isEdit){message.error("查看时不能修改");return false}
        let  pic_count = 0;
        let fileListLen = fileList.length;
        let {price} = this.state;
        let productPriceLen = Object.keys(productPrice);
        if(!content || content==`<p></p>\n`){message.error("商品详情不能为空");return }
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
            class_id
        };
        if(data.title.length < 3){
            message.error("看清楚规则进行填写");
            return false;
        }
        if(!data.title || !data.pic_count || !data.util ){
            message.error("信息填写不完整");
            return false;
        }
        api.axiosPost("product_edit",data).then((res)=>{
            if(res.data.code == 1){
                message.success(res.data.msg);
                history.push('/home/AllProduct');
            }
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
    //图片删除
    deleteImg=(file,index)=>{
        const {fileList,productId} = this.state;
        const data={
            bucket:"cn-anmro",
            dir:publicFn.deleteImgDir("product"),
            file:`${file.name}.jpg`
        };
        return new Promise((resolve,reject)=>{
            api.axiosPost("getProductSignDelete",data).then((res)=>{
                if(res.status == 200){
                    resolve(true);
                    fileList[index] = [];
                    this.setState({fileList});
                    api.axiosPost('updateProductCount',{product_id:productId});
                }else{
                    resolve(false)
                }
            });
        });
    };
    render(){
        const { previewVisible, previewImage, fileList ,propertyList,fileUpDomNum,attribute,isEdit,class_name_1,class_name_2,class_name_3,brand,productId} = this.state;
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
            productId,
            isEdit
        };
        return(
            <div className='edit-and-view-box'>
                <Breadcrumb className='edit-title' separator={<Icon type="right" />}>
                    <Breadcrumb.Item>商家中心</Breadcrumb.Item>
                    <Breadcrumb.Item>产品管理</Breadcrumb.Item>
                    <Breadcrumb.Item>全部产品</Breadcrumb.Item>
                    <Breadcrumb.Item  className="blue">{isEdit ?  '编辑产品' : '查看产品'}</Breadcrumb.Item>
                    
                </Breadcrumb>
                <div className='edit-release-goods-box'>
                    <h4>商品基本信息</h4>
                    <Row className='line-height-30 margin-bottom-20'>
                        <Col span={5} className='text-right'>商品分类：</Col>
                        <Col span={19}>
                            {class_name_1}&nbsp;>&nbsp;
                            { class_name_2}&nbsp;>&nbsp;
                            { class_name_3}
                        </Col>
                    </Row>
                    <Row className='line-height-30 margin-bottom-20'>
                        <Col span={5} className='text-right'> <span className='color-red'>*</span>商品名称：</Col>
                        <Col span={19}>
                            <Input
                                disabled={!isEdit}
                                placeholder='请输入商品名称' maxLength={30} onChange={(e)=>{this.inputChange('title',e.target.value)}} className='width-300' value={this.state.title}/>
                            <p>商品标题名称长度至少3个字符，最长不超过30个</p>
                        </Col>
                    </Row>
                    <Row className='line-height-30 margin-bottom-20'>
                        <Col span={5} className='text-right'> <span className='color-red'>*</span>商品单位：</Col>
                        <Col span={19}>
                            <Input
                                maxLength={30}
                                disabled={!isEdit}
                                placeholder='请输入商品单位' value={this.state.util} onChange={(e)=>{this.inputChange('util',e.target.value)}} className='width-300'/>
                        </Col>
                    </Row>
                    <Row className='line-height-30 margin-bottom-20'>
                        <Col span={5} className='text-right'> <span className='color-red'>*</span>商品货号：</Col>
                        <Col span={19}>
                            {this.state.article_number}
                        </Col>
                    </Row>

                    <Spin spinning={this.state.loading} delay={500}>
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
                                                                            let defaultChecked = false;
                                                                            if(attribute[k+1][publicFn.addZero(j+1)]){
                                                                                defaultChecked = true;
                                                                            }
                                                                            return(
                                                                                <Checkbox key={val}
                                                                                          disabled={((brand.brand && brand.index !==j && k == 0) || !isEdit ? true : false)}
                                                                                          defaultChecked={defaultChecked}
                                                                                          onChange={(e)=>{this.boxChange(e.target.checked,{"attribute":property,"attributeKey":k,},{ "attributeVal":val, "attributeValKey":j})}} key={j}>
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
                                        <div key={index} className="goods-image-list" style={{position:"relative"}}>
                                            <Spin spinning={item}>
                                                <Upload
                                                    disabled={!isEdit}
                                                    accept='image/jpg, image/jpeg, image/png'
                                                    listType="picture-card"
                                                    fileList={fileList[index]}
                                                    beforeUpload={()=>{return false}}
                                                    onPreview={this.handlePreview}
                                                    onRemove={(file)=>{if(!isEdit)return false;this.deleteImg(file,index)}}
                                                    onChange={(file)=>{this.handleChange(file,index)}}
                                                >
                                                    {fileList[index].length>=1 ? null : uploadButton}
                                                </Upload>
                                            </Spin>
                                            {index == 0 && <p style={{position:"absolute",textAlign:"center",left:"42%",bottom:"-25px"}}>主图</p>}
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
                                <EditorConvertToHTML {...editorHtml} ref='editorHtml'/>
                            </div>
                        </Col>
                    </Row>

                    <div className="step-edit-goods-box" style={{display:isEdit ? "block" : "none"}}>
                        <Button type="link"  onClick={()=>{window.history.go(-1)}}>
                            返回上一页
                        </Button>
                        <Button type='primary' onClick={this.save}>
                            &emsp;&emsp;完成并发布产品&emsp;&emsp;
                        </Button>
                    </div>
                    {
                    !isEdit ? 
                        <Button type="link" style={{textAlign:'center',width:'100%'}} onClick={()=>{window.history.go(-1)}}>
                            返回上一页
                        </Button> : ''
                    }
                    
                </div>
                
            </div>
        )
    }

}