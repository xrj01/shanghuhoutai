import React from "react";
import ProductList from "./productList";
import "./index.scss";
import {Breadcrumb,Tabs, Icon } from "antd";
const { TabPane } = Tabs;
export default class AllProduct extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state={
            productList1:false,
            productList2:false,
            productList3:false,
            productList4:false,
        }

        this.productList1 = React.createRef();
        this.productList2 = React.createRef();
        this.productList3 = React.createRef();
        this.productList4 = React.createRef();
    }


    clickTabs=(key)=>{
        let {productList1,productList2,productList3,productList4} = this.state;
         switch (key) {
            case "1":
                if(productList1){
                    this.productList1.current.productList();
                }
                productList1 = true;
                break;
            case "2":
                if(productList2){
                    this.productList2.current.productList();
                }
                productList2 = true;
                break;
            case "3":
                if(productList3){
                    this.productList3.current.productList();
                }
                productList3 = true;
                break;
            case "4":
                if(productList4){
                    this.productList4.current.productList();
                }
                productList4 = true;
                break;
        } 

        this.setState({
            productList1,productList2,productList3,productList4
        })
    };
    render(){
        return(
            <div className='all-goods-box'>

                <div className='account-security-title'>
                    <span>商家中心 <Icon type="right" /> </span>
                    <span>产品管理 <Icon type="right" /> </span>
                    <span className="blue">全部产品</span>
                </div>
                 <div className="goods-list">
                    <Tabs defaultActiveKey="1" onTabClick={(key)=>{this.clickTabs(key)}}>
                        <TabPane tab="全部商品" key="1">
                            <ProductList state={-999} ref={this.productList1}/>
                        </TabPane>
                       <TabPane tab="待上架" key="2">
                            <ProductList state={-1} ref={this.productList2}/>
                        </TabPane>
                        <TabPane tab="已上架" key="4">
                            <ProductList state={1} ref={this.productList4}/>
                        </TabPane>
                        <TabPane tab="已下架" key="3">
                            <ProductList state={0} ref={this.productList3}/>
                        </TabPane> 
                    </Tabs> 
                </div>
            </div>
        )
    }

}