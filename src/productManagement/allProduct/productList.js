import React,{Component} from "react";
import { Row,Col,Table ,Input,Select,DatePicker,Button,Icon,Modal,message } from 'antd';
import api from "./../../components/api";
import publicFn from "./../../components/public";
import {createHashHistory} from "history";
const Option = Select.Option;
const {RangePicker} = DatePicker;
const history = createHashHistory();
export default class ProductList extends Component{
    constructor(props) {
        super(props);
        const state = this.props.state;
        let timeName = "创建时间";
        switch (state) {
            case 0:
                timeName = "下架时间";
                break;
            case 1:
                timeName = "上架时间";
                break;
        }
        this.state={
            columns:[
                {
                    title: '商品名称',
                    dataIndex: 'title',
                },
                {
                    title: '缩略图',
                    dataIndex: 'thumbnail',
                    render:(text,record)=>{
                        const {merchantsId} = this.state;
                        return(
                            <img className='img-50 cursor-pointer'
                                 src={publicFn.imgUrl(merchantsId,record.id)} 
                                 onClick={(e)=>{this.handleModalShow( e, true, merchantsId, record.id )}} 
                                 onError={this.imgError}
                                 alt=""/>
                        )
                    }
                },
                {
                    title: '商品分类',
                    dataIndex: 'class_name',
                },
                {
                    title: '销售价',
                    dataIndex: 'price',
                },
                {
                    title: '库存',
                    dataIndex: 'inventory',
                },
                {
                    title: '商品状态',
                    dataIndex: 'state',
                },
                {
                    title: timeName,
                    dataIndex: 'shelves_time',
                    render:(text,record)=>{
                        let spanName = text;
                        if(timeName == "创建时间"){
                            spanName = record.create_time;
                        }
                        return(
                            <span style={{"whiteSpace":"nowrap"}}>
                                {spanName}
                            </span>
                        )
                    }
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    render:(text,record)=>{
                        let upAndDown = "上架";
                        if(record.state == "已上架"){
                            upAndDown = "下架";
                        }
                        return(
                            <div className='cursor-pointer color-blue' style={{whiteSpace:"nowrap"}}>
                                <span onClick={()=>{this.lookAndEdit(record,false)}}>查看</span>&nbsp;|&nbsp;
                                <span onClick={()=>{this.lookAndEdit(record,true)}}>编辑</span>&nbsp;|&nbsp;
                                <span onClick={()=>{this.operation(record)}}>{ upAndDown }</span>
                                {/*<span onClick={()=>{this.delectList(record)}}>删除</span>*/}
                            </div>
                        )
                    }
                },
            ],
            dataSource:[],
            productClassList:[],
            merchantsId:"",
            product_info:"",
            class_id:-999,
            begin_time:"",
            end_time:"",
            page_number:1,
            page_size:10,
            total:0,
            product_id:[], //列表选中ID的集合

            previewVisible: false,  // 查看图片弹窗显示隐藏
            recordMerID: '',        // 对应当前行的商家id
            recordProID: '',        // 对应当前行的商品id
        }
    }
    // 图片404
    imgError = (e) => {
        //e.target.src= require('../../image/img_404.png');
        e.target.setAttribute('data-error', true)
        e.target.onerror = null;
    }
    // 处理弹窗关闭
    handleModalShow = (e, istrue, mid, pid ) => {
        if(!e.target.hasAttribute('data-error')){
            this.setState({
                previewVisible : istrue,
                recordMerID: mid,
                recordProID: pid
            })
        }
    }
    //输入框改变
    inputChange=(type,value)=>{
        this.setState({
            [type]:value
        })
    };
    //时间框事件
    timeChange=(data,dataStr)=>{
        this.setState({
            begin_time:dataStr[0],
            end_time:dataStr[1],
        })
    };
    //点击查看编辑
    lookAndEdit=(record,isEdit)=>{
        const prodectState={ id:record.id, isEdit };
        publicFn.setSession("productId",JSON.stringify(prodectState));
        history.push("/home/EditView");
    };
    //删除商品
    delectList=(record)=>{
        const _this = this;
        const {product_id} = this.state;
        const data={
            product_id:record && record.id ? [record.id] : product_id
        };
        if(!data.product_id.length){message.error("不能空操作");return}
        Modal.confirm({
            title: '是否删除当前商品?',
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                api.axiosPost("product_delete",data).then((res)=>{
                    if(res.data.code == 1){
                        message.success(res.data.msg);
                        _this.productList();
                    }
                })
            },
        });
    };
    //列表点击上\下架
    operation=(record)=>{
        const _this = this;
        let modalTitle = "下架商品";
        if(record.state == "待上架" || record.state == "已下架"){
            modalTitle = "上架商品"
        }
        Modal.confirm({
            title: modalTitle,
            content: '',
            onOk(){
                if(record.state == "待上架" || record.state == "已下架"){
                    _this.applySale(record)
                }
                if(record.state == "已上架"){
                    _this.applyBackout(record)
                }
            }
        });
    };
    // 商品上架
    applySale=(record)=>{
        const product_id = record ? [record.id] : this.state.product_id;
        const data={ product_id };
        if(!data.product_id.length){message.error("不能空操作");return}
        api.axiosPost("apply_sale",data).then((res)=>{
            if(res.data.code == 1){
                message.success(res.data.msg);
                this.productList()
            }
        })
    };
    //商品下架
    applyBackout=(record)=>{
        const product_id = record ? [record.id] : this.state.product_id;
        const data={ product_id };
        if(!data.product_id.length){message.error("不能空操作");return}
        api.axiosPost("apply_backout",data).then((res)=>{
            if(res.data.code == 1){
                message.success(res.data.msg);
                this.productList()
            }
        })
    };
    componentDidMount() {
        const merchantsId = sessionStorage.getItem("merchantsId");
        this.setState({merchantsId});
        this.merchantOwnProductClass();
        this.productList();
    }
    //获取商户已添加商品的三级分类
    merchantOwnProductClass=()=>{
        api.axiosPost("merchantOwnProductClass").then((res)=>{
            if(res.data.code == 1){
                this.setState({
                    productClassList:res.data.data
                })
            }
        })
    };
    //获取商品列表
    productList=(isTrue)=>{
        const {product_info,class_id,begin_time,end_time,page_number,page_size} = this.state;
        const {state} = this.props;
        let time_type = 0;
        if(state === 0 || state ===1){
            time_type = 1;
        }
        const data={ product_info,class_id,state,begin_time,end_time,page_number:isTrue ? 1 : page_number,page_size,time_type };
        api.axiosPost("productList",data).then((res)=>{
            if(res.data.code == 1){
                const dataSource = res.data.data.product_list;
                dataSource.map((item)=>{
                    item.key = item.id;
                });
                this.setState({
                    dataSource,
                    total:res.data.data.total_row
                })
            }
        })
    };
    render(){
        const rowSelection = {
            onChange: (selectedRowKeys) => {
                this.setState({product_id:selectedRowKeys})
            },
        };
        const pagination={
            pageSize:this.state.page_size,
            current:this.state.page_number,
            total:this.state.total,
            onChange:(page)=>{
                this.setState({
                    page_number:page
                },()=>{this.productList()})
            },
            onShowSizeChange:(current,size)=>{
                this.setState({
                    page_size:size
                },()=>{this.productList()})
            }
        };
        const {productClassList,merchantsId,previewVisible,recordMerID,recordProID} = this.state;
        const {state} = this.props;
        let searchText = "创建时间";
        switch (state) {
            case 1:
                searchText = "上架时间";
                break;
            case 0:
                searchText = "下架时间";
                break;
        }
        return(
            <div className='goods-table-list'>
                <Row className='line-height-42'>
                    <Col span={24} className="search-box">
                        <Input placeholder='请输入商品名称'
                               onChange={(e)=>{this.inputChange("product_info",e.target.value)}}
                               className='width-150 name-input' value={this.state.product_info}/> &emsp;
                        <Select value={this.state.class_id}
                                style={{color:this.state.class_id == -999 ? "#BFBFBF" :"#333"}}
                                onChange={(value)=>{this.inputChange("class_id",value)}}
                                className='width-200 select-input'>
                            <Option value={-999}>请选择</Option>
                            {
                                productClassList && productClassList.map((item,index)=>(
                                    <Option value={item.class_id} key={item.class_id}>
                                        {item.class_name}
                                    </Option>
                                ))
                            }
                        </Select> &emsp;
                        {searchText}：<RangePicker onChange={this.timeChange} className='width-250 date-input'/> &emsp;
                        <Button className="search-btn" onClick={()=>{this.productList(true)}}>搜索</Button>
                    </Col>
                </Row>
                <Row className='line-height-30 batch-nav'>
                    <Col span={12}>
                        {/* <Icon type="code-sandbox" /> */}
                        <img src={require('./../../image/img_spzs.png')} alt='' className='batch-nav-img'/>
                        商品种类 : {this.state.total}
                    </Col>
                    <Col span={12} className='text-right'>
                        <Button className='text-right-btn' style={{display: (state ===-999 || state === -1 || state === 0) ? "inline-block" : "none" }} onClick={()=>{this.applySale()}}>批量上架</Button>
                        <Button className='text-right-btn' style={{display: (state ===-999 || state === 1) ? "inline-block" : "none" }} onClick={()=>{this.applyBackout()}}>批量下架</Button>
                        {/*<Button onClick={()=>{this.delectList()}}>删除所选</Button> &emsp;*/}
                    </Col>
                </Row>
                <Table
                    bordered
                    pagination={pagination} rowSelection={rowSelection} columns={this.state.columns} dataSource={this.state.dataSource} />

                <Modal visible={previewVisible} footer={null} onCancel={(e)=>{this.handleModalShow(e, false)}}>
                    <img alt="example" style={{ width: '100%' }} src={publicFn.imgUrl(recordMerID, recordProID, 0, 1000)} />
                </Modal>
            </div>
        )
    }

}