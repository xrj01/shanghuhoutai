import React from 'react';
import {Divider } from 'antd';
import {Link} from 'react-router-dom';
import './loginFooter.scss';

export default class Header extends React.Component{
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <div className="footer-box">
        <div>
          <Link to="/">关于我们</Link>
          <Divider type="vertical" className="Division"/>
          <Link to="/">帮助中心</Link>
          <Divider type="vertical" className="Division"/>
          <Link to="/">售后服务</Link>
          <Divider type="vertical" className="Division"/>
          <Link to="/">配送与验收</Link>
          <Divider type="vertical" className="Division"/>
          <Link to="/">商务合作</Link>
        </div>
        <div className="copyRight">
        CopyRight @ 企牛采 2015 - 2019  
        </div>
      </div>
    )
  }
}