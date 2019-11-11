import React from "react";
import { Link } from 'react-router-dom';
import Public from '../../components/public'
import { Icon, Tabs, Button, Steps, Table, Popover } from 'antd';
import SetDeliverModal from '../setDeliverModal'
import api from "../../components/api";

const { TabPane } = Tabs;
const { Step } = Steps

export default class OrderDetail extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            tableData: [],
            columns: [
                {
                    title: '商品信息',
                    dataIndex: 'product_name',
                    align: 'center',
                    className: 'thead-bg',
                    width: 391,
                    render: (text, record) => {
                        const img = record.type == 'jd' ? record.pic : Public.imgUrl(record.merchant_id, record.product_id)
                        return (
                            <div className="order-goods-info">
                                <div className="goods-img">
                                    {/* require('../image/img_404.png') */}
                                    <img src={img} alt="" />
                                </div>
                                <div className="goods-info">
                                    <div className="goods-name" title={text}>
                                        {/* {text} */}

                                        {
                                            record.type == 'jd' ? <Link to={`/AdminJDdetails?${record.product_id}`} target="_blank">{text}</Link>
                                                : <Link to={`/Admindetails?${record.product_id}+${record.sku}`} target="_blank">{text}</Link>
                                        }
                                    </div>
                                    

                                    <div className="goods-props">
                                        {record.product_standards}
                                    </div>
                                </div>
                            </div>
                        )
                    }
                },
                {
                    title: '单价',
                    dataIndex: 'price',
                    align: 'center',
                    width: '130px',
                    className: 'thead-bg',
                    render: (text, record) => {
                        return `￥${text} `
                    }
                },
                {
                    title: '数量',
                    dataIndex: 'count',
                    align: 'center',
                    className: 'thead-bg',
                    render: (text, record) => {
                        return `${text} ${record.unit ? `/${record.unit}` : '' }`
                    }
                },
                {
                    title: '小计',
                    dataIndex: 'order_price',
                    align: 'center',
                    className: 'thead-bg',
                    render: (text, record) => {
                        return <div>
                                <div>￥{text}</div>
                                {/* <div>（含运费：￥{record.freight.toString()? record.freight : '0.00'}）</div> */}
                               </div>
                    }
                },
            ],
            state: '',
            current: 1,
            visible: false,           // 弹窗的显示与隐藏
            address_info: '',         // 收货人的地址信息
            order_info: '',           // 订单详情信息
            order_id: '',             // 订单id
        }
    }
    // 控制编辑弹窗显示与隐藏
    isShowModal = (type, isTrue) => {
        this.setState({
            [type]: isTrue,
        },()=>{
            if(isTrue){
                this.setDeliverModal.getIDandDetail(this.state.order_info.order_num)
            }
        });
    }

    // 物流提示 ↓↓↓↓
    // 订单追踪的内容
    renderContent = () => (
        <div>
            <p>物流单号：{this.state.order_info.courier_id? this.state.order_info.courier_id : '暂无物流单号'}</p>
            <p>物流名称：{this.state.order_info.courier_name? this.state.order_info.courier_name : '暂无物流名称'}</p>
        </div>
    )

    getOrderDetail = () => {
        const param = {
            id: this.state.order_id
        }
        api.axiosPost('getOrderDetail', param).then(res => {
            console.log('ressss', res);
            if (res.data.code === 1) {
                const { address_info, order_info } = res.data.data;
                order_info.key = order_info.product_id
                let current = order_info.state === 2 ? 2 :  
                                order_info.state === 3 ? 3 :
                                order_info.state === 4 ? 4 : 2 
                
                this.setState({
                    address_info, order_info,tableData:[order_info], current
                })
            }
        })
    }

    componentWillReceiveProps(nextProps) {
        // console.log('order_id', nextProps);
        if (nextProps.order_id) {
            this.setState({
                order_id: nextProps.order_id
            },()=>{
                this.getOrderDetail()
            })
        }

    }



    render() {
        const { current, tableData, columns, visible, order_info, address_info } = this.state;
        // const 
        // 步骤条流程数组
        const steps = [
            {
                title: '提交订单',
                icon: (<img width={56} src={require('../../image/place_order.png')} />),
                iconActive: (<img width={56} src={require('../../image/place_order_active.png')} />),
                description: (<div className='description'>{order_info.create_time} </div>)
            },
            {
                title: '付款成功',
                icon: (<img width={56} src={require('../../image/successful_payment.png')} />),
                iconActive: (<img width={56} src={require('../../image/successful_payment_active.png')} />),
                description: (<div className='description'>{order_info.pay_time} </div>)
            },
            {
                title: '发货',
                icon: (<img width={56} src={require('../../image/deliver_goods.png')} />),
                iconActive: (<img width={56} src={require('../../image/deliver_goods_active.png')} />),
            },
            {
                title: '待买家收货',
                icon: (<img width={56} src={require('../../image/acceptance.png')} />),
                iconActive: (<img width={56} src={require('../../image/acceptance_active.png')} />),
                description: (<div className='description'>{order_info.delivery_time} </div>)
            },
            {
                title: '交易完成',
                icon: (<img width={56} src={require('../../image/deal_done.png')} />),
                iconActive: (<img width={56} src={require('../../image/deal_done_active.png')} />),
                description: (<div className='description'>{order_info.complete_time} </div>)
            },
        ]
        // 弹窗的参数
        const modalObj = {
            display: visible,
            isShowModal: this.isShowModal,
            refreshList: this.getOrderDetail
        }
        // 当前状态图
        const renderStatusImg = () => {
            switch (order_info.state) {
                case -2:
                    return 'close_status'
                    break;
                case 2:
                    return 'be_shipped'
                    break;
                case 3:
                    return 'be_received'
                    break;
                case 4:
                    return 'completed'
                    break;
                default:
                    return 'be_shipped'
                    break;
            }

        }

        return (
            <div className="order-detail-box">
                {/* 订单当前状态 以及 信息简介  设置订单发货 */}
                <div className="order-status-box">
                    <div className="order-status">
                        <div className="order-status-brief">
                            <div className="order-logo" >
                                <div className="img">
                                    <img src={require(`./../../image/${renderStatusImg()}.png`)} alt="" />
                                </div>
                                <div className="text">
                                    {
                                        order_info && order_info.state === 2 ? 
                                        '待发货' : order_info.state === 3 ?
                                        '待买家收货' : order_info.state === 4 ?
                                        <span className="green">已完成</span> : order_info.state === -2 ? 
                                        <span className="red">已关闭</span> : ''
                                    }
                                </div>
                            </div>
                            <div className="brief-introduction">
                                <div className="tit">订单编号</div>
                                <div className="text">{order_info.order_num}</div>
                            </div>
                            <div className="brief-introduction">
                                <div className="tit">下单时间</div>
                                <div className="text">{order_info.create_time}</div>
                            </div>
                            <div className="brief-introduction">
                                <div className="tit">订单金额</div>
                                <div className="text red">￥{order_info.order_price}</div>
                            </div>
                        </div>
                        {
                            order_info && order_info.state === 2 ?
                            <div className="oprations">
                                <Button onClick={() => { this.isShowModal('visible', true) }}>设置发货</Button>
                            </div> : ''
                        }
                        
                    </div>
                    {
                        order_info && order_info.state === -2 ?
                        <div className="close-reason">
                            <div className='tit'>
                                关闭原因
                            </div>
                            <div className="reason">
                                { order_info.close_reason }
                            </div>
                        </div> : ''
                    }
                    
                </div>
                {/* 订单详情以及具体信息 */}
                <div className="order-step-and-info">
                    {
                        order_info && order_info.state !== -2 ?
                        <Steps current={current} labelPlacement="vertical" className="order-step">
                            {steps.map((item, i) => (
                                <Step
                                    key={item.title}
                                    title={item.title}
                                    icon={current - i >= 1 || current === i ? item.iconActive : item.icon}
                                    description={item.description}
                                />
                            ))}
                        </Steps> : ''
                    }
                    

                    {
                        order_info && order_info.state === 3 || order_info.state === 4 ? 
                        <div className="order-track-box">
                            <div className="current-logistics">
                                {/* 2018-01-06 17:09:35  到达目的地网点广东深圳公司，快件将很快进行派送 */}
                            </div>
                            <div className="check-logistics">
                                <Popover 
                                    trigger="hover" 
                                    placement="top"
                                    content={this.renderContent()}
                                >
                                    <Button>追踪订单</Button>
                                </Popover>
                            </div>
                        </div> : ''
                    }
                    

                    <div className="goods-table-box">
                        <div className='tit'>
                            商品信息
                        </div>
                        <Table
                            dataSource={tableData}
                            columns={columns}
                            pagination={false}
                            className="table"
                            bordered
                            footer={
                                (currentPage) => {
                                      return <div className="table-footer">备注：<span>{currentPage.length && currentPage[0].remark ? currentPage[0].remark : '暂无备注'}</span></div>
                                }}
                        />
                    </div>
                    <div className="receiving-info">
                        <div className='tit'>
                            收货信息
                        </div>
                        <div className="info-box">
                            <div className="info-row"><span className="row-tit">收货人</span>：{address_info.consignee}</div>
                            <div className="info-row"><span className="row-tit">联系方式</span>：{address_info.phone}</div>
                            <div className="info-row"><span className="row-tit">收货地址</span>：{address_info.address}</div>
                        </div>
                    </div>
                </div>
                <SetDeliverModal {...modalObj} wrappedComponentRef={(ref) => { this.setDeliverModal = ref }}/>
            </div>
        )
    }

}