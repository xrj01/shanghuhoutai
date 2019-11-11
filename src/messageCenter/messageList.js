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
            page_number: 1,                   // 页码数
            page_size: 10,                    // 每页数量
            total: 0,                        // 总条数
        }
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
    
    // 切换分页
    pageOnChange = (page) => {
        this.setState({
            page_number: page
        }, () => {
            this.getOrderList()
        })
    }


    componentDidMount() {
        
    }

    render() {
        const { page_size, total } = this.state;

        return (
            <div className="order-main-list">
                <div className="">

                </div>
                <div className="order-page">
                    <Pagination
                        // showQuickJumper={dalse}
                        itemRender={this.itemRender}
                        total={+total}
                        pageSize={page_size}
                        onChange={this.pageOnChange}
                    />
                </div>
            </div>
        )
    }
}

export default orderList