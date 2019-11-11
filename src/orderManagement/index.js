import React from "react";
import { Link } from 'react-router-dom';
import { Icon, Tabs, } from 'antd';
import OrderList from './orderList'
import "./index.scss";

const { TabPane } = Tabs;

export default class Order extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            state: ''
        }
    }
    // 切换订单状态
    swatchKey = (key) => {
        switch (key) {
            case '1':
                this.setState({
                    state: ''
                },()=>{
                    this.orderList1.getOrderList(true)
                })
                break;
            case '2':
                this.setState({
                    state: '2'
                },()=>{
                    this.orderList2.getOrderList(true)
                })
                break;
            case '3':
                this.setState({
                    state: '3'
                },()=>{
                    this.orderList3.getOrderList(true)
                })
                break;
            case '4':
                this.setState({
                    state: '4'
                },()=>{
                    this.orderList4.getOrderList(true)
                })
                break;
            case '5':
                this.setState({
                    state: '-2'
                },()=>{
                    this.orderList5.getOrderList(true)
                })
                break;
        }
    }

    render() {
        const { state } = this.state;
        return (
            <div className="order-manage-box">
                <div className="order-manage-title">
                    <span>商家中心 <Icon type="right" /> </span>
                    <span>订单管理 <Icon type="right" /> </span>
                    <span className="blue">我的订单</span>
                </div>
                <div className="order-list">
                    <Tabs defaultActiveKey="1" onTabClick={(key)=>{this.swatchKey(key)}}>
                        <TabPane tab="全部订单" key="1">
                            <OrderList state={state} ref={(ref)=>{this.orderList1 = ref}}/>
                        </TabPane>
                        <TabPane tab="待发货" key="2">
                            <OrderList state={state} ref={(ref)=>{this.orderList2 = ref}}/>
                        </TabPane>
                        <TabPane tab="待买家收货" key="3">
                            <OrderList state={state} ref={(ref)=>{this.orderList3 = ref}}/>
                        </TabPane>
                        <TabPane tab="交易完成" key="4">
                            <OrderList state={state} ref={(ref)=>{this.orderList4 = ref}}/>
                        </TabPane>
                        <TabPane tab="已关闭" key="5">
                            <OrderList state={state} ref={(ref)=>{this.orderList5 = ref}}/>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }

}