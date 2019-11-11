import React from "react";
import {Link,withRouter} from "react-router-dom";
import { Menu, Dropdown,Icon } from 'antd';
import "./index.scss";

@withRouter
class Header extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state={
            tel:'',
            path:'',
            //isshow:true,
        }
    }
    clear=()=>{
        sessionStorage.clear()
    }
    componentDidMount(){
        // console.log(window.location)
    }
    componentWillMount(){
        this.setState({
         tel: sessionStorage.getItem('tel'),
        })
        // console.log(window.location.hash.slice(11));
        
    }
    /* componentWillReceiveProps(){
        
        this.setState({
            tel:sessionStorage.getItem('tel')
        })
    } */
    
    render(){
        //console.log(this.state.isshow)
        //监听路由
        this.props.history.listen(route => {
            this.setState({path:route.pathname.slice(1)})
        })
        const {path} = this.state
        //console.log(111,path);
        
        /* const menu = (
            <Menu>
                <Menu.Item>
                <Link to='/home'>安全设置</Link>
                </Menu.Item>
                <Menu.Item>
                <Link to='/' onClick={this.clear}>退出登录</Link>
                </Menu.Item>
            </Menu>
        ); */
        
        return(
            <header>
                <div className="header-nav-list">
                    {/* <div className="nav">
                        <div className='nav-title'>客服热线：028-83368980</div>
                        <div className='nav-title-right'>
                            <Dropdown overlay={menu}>
                                <span className='nav-dropdown'>
                                    {this.state.tel}<Icon type="down" />
                                </span>
                            </Dropdown>
                            <Link to="/home" className='nav-info'>个人中心</Link>
                        </div>
                        
                    </div> */}
                    <div className="header-nav-box">
                        <div className="header-nav">
                            <div className="header-position">
                                
                                客服热线：028-83368980
                            </div>
                            <div className="header-nav-list">
                                <div className="header-nav-content">
                                    {this.state.tel}<i className='iconfont iconshangla'></i>
                                    <div className="header-nav-secondary">
                                        {/* <a href="javascript:;">安全设置</a> */}
                                        <Link to='/home/AccountSecurity'>账户安全</Link>
                                        
                                        <Link to='/' onClick={this.clear}>退出登录</Link>
                                    </div>
                                </div>
                                <div className="header-nav-content">
                                    {/* <a href={`http://qnc.anmro.cn/#/SupplierDetails?${sessionStorage.getItem('merchantsId')}`}>商家主页</a> */}
                                    {/* <a href="javascript:;" onClick={()=>{window.location.reload()}}>商家主页</a> */}
                                    <Link to="/home">商家主页</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="header-user-nav-box">
                    <div className="header-user-nav">
                        <img src={require(`./../image/logo1.png`)} alt=""/>
                        <ul>
                            <li> <a href='http://www.tdsc360.com/mall/'>首页</a> </li>
                            {/* <li className={path === 'home' ? 'active': ''}> <Link to="/home">商家中心</Link> </li> */}
                            <li className={window.location.hash ==="#/merchant/home" ? 'active': ''}> <Link to="/home">商家中心</Link> </li>
                            {/* <li> <Link to="/home/AccountSecurity">账户安全</Link> </li> */}
                        </ul>
                    </div>
                </div>
            </header>
        )
        
    }

}
export default Header