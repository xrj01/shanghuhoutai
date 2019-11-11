import React from "react";
import { Link } from 'react-router-dom';
import { Icon, Tabs, } from 'antd';
import OrderDetail from './orderDetails'
import "./index.scss";

const { TabPane } = Tabs;

export default class OrderOvarView extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            order_id: '',   // 订单id

        }
    }

    componentDidMount(){
        const order_id = this.props.location.search.split('?')[1];
        // console.log('order_id', this.props.location.search.split('?'));
        this.setState({ order_id });
    }

    render() {
        const { order_id } = this.state;
        return (
            <div className="order-manage-box">
                <div className="order-manage-title">
                    <span>商家中心 <Icon type="right" /> </span>
                    <span>订单管理 <Icon type="right" /> </span>
                    <span><Link className="hover-blue" to="/home/order">我的订单</Link> <Icon type="right" /> </span>
                    <span className="blue">订单详情</span>
                </div>
                <OrderDetail order_id={order_id} />
            </div>
        )
    }

}