import React from 'react';
import { Row, Col, Input, DatePicker, Button, Table, Pagination, Modal, Popover, Form } from 'antd';
import { Link } from 'react-router-dom'
import api from '../components/api';
import Public from '../components/public'
import SetDeliverModal from "./setDeliverModal";

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD'; // 规定日期选择器的格式


class orderList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            dateRange: [null, null],
            column: [
                {
                    title: '商品信息',
                    dataIndex: 'goods_info',
                    align: 'center',
                    width: 390,
                    render: (text, record) => {
                        const img = record.type == 'jd' ? record.pic : Public.imgUrl(record.merchant_id, record.product_id)
                        return (
                            <div className="order-goods-info">
                                <div className="goods-img">
                                    {/* require('../image/img_404.png') */}
                                    <img src={img} alt="" />
                                </div>
                                <div className="goods-info">
                                    <div className="goods-name">
                                        {/* <span title={record.product_name}>{record.product_name}</span> */}
                                        {/* <Link>{record.product_name}</Link> */}
                                        {
                                            record.type == 'jd' ? <Link to={`/AdminJDdetails?${record.product_id}`} target="_blank">{record.product_name}</Link>
                                                : <Link to={`/Admindetails?${record.product_id}+${record.sku}`} target="_blank">{record.product_name}</Link>
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
                    title: '价格',
                    dataIndex: 'price',
                    align: 'center',
                    width: 140,
                    render: (text, record) => {
                        return `￥${text} `
                    }
                },
                {
                    title: '数量',
                    dataIndex: 'count',
                    align: 'center',
                    width: 110,
                    render: (text, record) => {
                        return `${text} ${record.unit ? `/${record.unit}` : ''}`
                    }
                },
                {
                    title: '小计',
                    dataIndex: 'order_price',
                    align: 'center',
                    width: 150,
                    render: (text, record) => {
                        return `￥${text} `
                    }
                },
                {
                    title: '订单操作',
                    dataIndex: 'goods_opr',
                    align: 'center',
                    // width: 158,
                    render: (text, record) => {
                        return (
                            <div>
                                {
                                    record.state == 2 ? <div className='oprations'><Button onClick={() => { this.isShowModal('visible', true, record.order_num) }}>设置发货</Button></div> : ''
                                }
                                {
                                    record.state == 4 || record.state == 3 ?
                                        <div className='oprations'>
                                            <Popover placement="top" content={this.renderContent(record)} trigger="hover" >
                                                订单追踪
                                            </Popover>
                                        </div> : ''
                                }
                                <Link className="link-to-sub" to={{ pathname: '/home/orderDetail', search: `?${record.order_num}` }}>订单详情</Link>
                            </div>
                        )
                    }
                }
            ],
            data: [],                       // 表格数据
            product_info: '',                 // 订单编号或者商品名称
            time_begin: '',                   // 下单时间范围
            time_end: '',                     // 下单时间范围
            state: '',                        // 订单状态   订单状态 -2 已关闭 2 待发货  3待买家收货 4 已完成
            page_number: 1,                   // 页码数
            page_size: 10,                    // 每页数量
            total: '',                        // 总条数
            visible: false,                   // 弹窗的显示与隐藏
            istab: 1,                     // 用于控制是tab请求数据还是搜索请求数据  分别控制为空状态部分盒子的显示与隐藏
        }
    }
    // 订单追踪的内容
    renderContent = record => (
        <div>
            <p>物流名称：{record.courier_name}</p>
            <p>物流单号：{record.courier_id}</p>
        </div>
    )
    // 表格title
    renderTitle = (current) => {
        return (
            <div className="table-title">
                <div className="order-props">
                    <span>下单时间：{current[0].create_time}</span>
                    <span>订单编号：{current[0].order_num}</span>
                    <span>下单人：{current[0].username}</span>
                </div>
                <div className="status">
                    {
                        current[0].state === 2 ?
                            '待发货' : current[0].state === 3 ?
                                '待买家收货' : current[0].state === 4 ?
                                    '已完成' : current[0].state === -2 ?
                                        '已关闭' : ''
                    }
                </div>
            </div>
        )
    }

    // 修改上一步下一步的链接
    itemRender = (current, type, originalElement) => {
        if (type === 'prev') {
            return <a className="ant-pagination-item-link">上一页</a>;
        }
        if (type === 'next') {
            return <a className="ant-pagination-item-link">下一页</a>;
        }
        return originalElement;
    }
    // 控制编辑弹窗显示与隐藏
    isShowModal = (type, isTrue, id) => {
        this.setState({
            [type]: isTrue,
        }, () => {
            if (isTrue) {
                this.setDeliverModal.getIDandDetail(id)
            }
        });
    }

    // input ===> onChange
    handleOnchange = (type, val) => {
        this.setState({
            [type]: val
        })
    }
    // 日期
    DateChange = (dates, dateStrings) => {
        this.setState({
            time_begin: dateStrings[0],
            time_end: dateStrings[1],
            dateRange: dates
        })
    }
    // 获取订单列表
    getOrderList = (isTabs = false, isCheckAll = true) => {
        const { page_number, page_size, product_info, time_end, time_begin } = this.state;
        if (isTabs) {
            this.setState({
                time_end: '',
                time_begin: '',
                product_info: ''
            })
        }
        const param = {
            page_number,
            page_size,
            product_info: isCheckAll ? '' : product_info,
            time_end: isCheckAll ? '' : time_end,
            time_begin: isCheckAll ? '' : time_begin,
            state: this.props.state
        }
        // console.log('data=======>', param);
        api.axiosPost('getOrderList', param).then(res => {
            // console.log('res=======>', res);
            if (res.data.code === 1) {
                const { order_list, page_number, total_row, page_size } = res.data.data;
                let { istab } = this.state;
                // istab++
                // console.log('order_list', order_list);
                this.setState({
                    data: order_list,
                    total: total_row,
                    page_number,
                    page_size,
                    istab: isTabs ? 1 : ++istab,    // 如果是tab切换请求数据，无数据情况，用于隐藏搜索框以及分页器
                })
            }
        })
    }
    // 切换分页
    pageOnChange = (page) => {
        this.setState({
            page_number: page
        }, () => {
            this.getOrderList()
        })
    }


    componentDidMount() {
        this.getOrderList(true);
    }

    render() {
        const { dateRange, data, visible, column, page_size, total, istab } = this.state;
        const modalObj = {
            display: visible,
            isShowModal: this.isShowModal,
            refreshList: this.getOrderList
        }

        // console.log('istab', istab);
        return (
            <div className="order-main-list">
                {
                    istab === 1 && data.length > 0 || istab > 1 ?
                        <div>
                            <div className="search-main-box">
                                <div className="input-box">
                                    下单时间：
                                    <RangePicker
                                        value={dateRange}
                                        format={dateFormat}
                                        className='date'
                                        onChange={this.DateChange}
                                    />
                                </div>
                                <div className="input-box">
                                    <Input placeholder="请输入订单号/商品名称" className="name" onChange={(e) => { this.handleOnchange('product_info', e.target.value) }} />
                                </div>
                                <div className="btn-box">
                                    <Button onClick={() => { this.getOrderList(false, false) }}>搜索</Button>
                                </div>
                            </div>

                            {
                                data.length ?
                                    <div>
                                        <div className="common-title">
                                            <ul>
                                                <li className="w1">商品信息</li>
                                                <li className="w2">单价</li>
                                                <li className="w3">数量</li>
                                                <li className="w4">小计</li>
                                                <li className="w5">操作</li>
                                            </ul>
                                        </div>
                                        <div className="order-table-box">
                                            {
                                                data && data.length && data.map((item, index) => {
                                                    item[0].key = item[0].product_id
                                                    return (
                                                        <Table
                                                            dataSource={item}
                                                            key={index}
                                                            columns={column}
                                                            showHeader={false}
                                                            className="table"
                                                            bordered
                                                            pagination={false}
                                                            title={(currentPage) => { return this.renderTitle(currentPage) }}
                                                            footer={
                                                                (currentPage) => {
                                                                    return <div className="table-footer"><span>备注：</span><span>{currentPage[0].remark ? currentPage[0].remark : '暂无备注'}</span></div>
                                                                }}
                                                        />
                                                    )
                                                })
                                            }

                                        </div>
                                        <div className="order-page">
                                            <Pagination
                                                // showQuickJumper
                                                itemRender={this.itemRender}
                                                total={+total}
                                                pageSize={page_size}
                                                hideOnSinglePage
                                                onChange={this.pageOnChange}
                                            />
                                        </div>
                                    </div> : <div className="empty"><span>抱歉，没有找到搜索条件相关的订单！</span></div>
                            }

                        </div> : <div className="empty"><span>暂无订单信息...</span></div>
                }
                <SetDeliverModal {...modalObj} wrappedComponentRef={(ref) => { this.setDeliverModal = ref }} />
            </div>
        )
    }
}

export default orderList