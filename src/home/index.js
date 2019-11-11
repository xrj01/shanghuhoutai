import React from "react";
import {Link, Route} from 'react-router-dom';
import {Icon} from "antd";
import Header from "./../header";
import HomeFooter from "./../component/homeFooter";
import HomeFooterBottom from "./../component/homeFooterBottom";
import publicFn from "./../components/public";
import "./index.scss";

export default class Home extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state={
            menuList:[
                {
                    h4:"产品管理",
                    icon:require('../image/product1.png'),
                    child:[
                        {
                            path:"/home/ReleaseProduct",
                            name:"发布产品",
                            index:1
                        },
                        {
                            path:"/home/AllProduct",
                            name:"全部产品",
                            index:2
                        }
                    ]
                },
                {
                    h4:"订单管理",
                    icon:require('../image/order_sign2x.png'),
                    child:[
                        {
                            path:"/home/order",
                            name:"我的订单",
                            index:0
                        }
                    ]
                },
                {
                    h4:"信息管理",
                    icon:require('../image/info1.png'),
                    child:[
                        {
                            path:"/home/BasicInformation",
                            name:"基础信息",
                            index:3
                        },
                        {
                            path:"/home/AuthenticationInformation",
                            name:"认证信息",
                            index:4
                        }
                    ]
                },
                {
                    h4:"安全管理",
                    icon:require('../image/safety1.png'),
                    child:[
                        {
                            path:"/home/AccountSecurity",
                            name:"账户安全",
                            index:5
                        }
                    ]
                },
                {
                    h4:"消息中心",
                    icon:require('../image/message2x.png'),
                    child:[
                        {
                            path:"/home/messageCenter",
                            name:"消息中心",
                            index:6
                        }
                    ]
                }
            ],
            liActiveIndex:-1
        }
    }
    

    componentDidMount() {
        const liActiveIndex = publicFn.getSession("liActiveIndex");
        this.setState({liActiveIndex})
        //console.log(this.props.match.params);
    }

    listActive=(liActiveIndex)=>{
        publicFn.setSession("liActiveIndex",liActiveIndex);
        this.setState({liActiveIndex});
    };
    render(){
        //console.log(11111,window.location);
        const tel = sessionStorage.getItem('tel')
        const urlData = window.location.hash;
        //console.log(tel,7777)
        const {routes} = this.props;
        const {liActiveIndex,menuList} = this.state;
        return(
            <div className='merchants-warp'>
                <Header tel={tel}/>
                <div className='home-warp'>
                    <div className="menu-box">
                        {
                            menuList.map((item,index)=>{
                                return(
                                    <div className="menu-list" key={index}>
                                        <h4>
                                            <img src={item.icon} alt=''/> &nbsp;
                                            {item.h4}
                                        </h4>
                                        {
                                            item.child.map((child,i)=>{
                                                // console.log('child', this.props.match);
                                                let isMyOrder = false;
                                                let isProuct = false;
                                                if(child.name == "我的订单"){
                                                    if(urlData.indexOf("/merchant/home/orderDetail") > -1){
                                                        isMyOrder = true;
                                                        isProuct = false;
                                                    }
                                                }
                                                if(child.name == "全部产品"){
                                                    if(urlData.indexOf("/home/EditView") >-1){
                                                        isProuct = true;
                                                        isMyOrder = false;
                                                    }
                                                }
                                                return (
                                                    <Link onClick={()=>{this.listActive(child.index)}}
                                                        className={window.location.hash.slice(10) === child.path || isProuct || isMyOrder ? "active" : ""}
                                                        to={child.path} key={`${i}${child.name}`}>{child.name}</Link>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className='home-right'>
                        {
                            routes && routes.map((route,i)=>{
                                return (<Route exact={route.exact} key={i} path={route.path}
                                            render={ props => {
                                                return (
                                                <route.component {...props} routes={route.routes} />
                                            )}}
                                        />
                            )})
                        }
                    </div>
                </div>
                
                <HomeFooterBottom />
            </div>
        )
    }

}