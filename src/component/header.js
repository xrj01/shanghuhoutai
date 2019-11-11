import React from 'react';
import './header.scss';
import {Link} from 'react-router-dom'
const logo = require('../image/logo1.png');

export default class Header extends React.Component{
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <div className="header-box">
        <div className="wp">
          <div className="header">
            <div className="logo">
              <img src={logo} alt=""/>
              <span className='reg' style={this.props.isShow ? {display:'block'}:{display:'none'}}>商家入驻</span>
            </div>
            <div className="tit-text">
                {
                    this.props.islogin ? 
                    <a href="http://www.tdsc360.com/mall/" onClick={this.clear.bind(this)}>进入首页官网</a> : ''
                }
              
              {
                  !this.props.islogin && !this.props.checkOrder ? <Link to="/">返回登录</Link> : ""
              }
                
            </div>
          </div>
        </div>
      </div>
    )
  }
  componentDidMount(){
    //console.log(this.props.isShow);
    
  }
  clear(){
    sessionStorage.clear()
  }
}