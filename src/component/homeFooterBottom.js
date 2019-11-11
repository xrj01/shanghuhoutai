import React from 'react';
import {Link} from 'react-router-dom';
import './homeFooterBottom.scss';


export default class Header extends React.Component{
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <div className='home-footer-bottom-box'>
        <div className='home-footer-bottom-cotainer'>
          {/* 上部分 */}
          <div className='home-footer-bottom-top'>
            <ul>
              {/* <li><Link to="">关于我们</Link></li>
              <li><Link to="">帮助中心</Link></li>
              <li><Link to="">售后服务</Link></li>
              <li><Link to="">配送与验收</Link></li>
              <li><Link to="">商务合作</Link></li> */}
              <li><a href="javascript:void(0);">关于我们</a></li>
              <li><a href="javascript:void(0);">帮助中心</a></li>
              <li><a href="javascript:void(0);">售后服务</a></li>
              <li><a href="javascript:void(0);">配送与验收</a></li>
              <li><a href="javascript:void(0);">商务合作</a></li>
            </ul>
            <div className='home-footer-bottom-icon' style={{marginLeft: '104px'}}>服务热线</div>
            <div className='home-footer-bottom-icon'>
              关注微信公众号
              <img src={require('./../image/weixin.png')} alt='' />
            </div>
          </div>
          {/* 下部分 */}
          <div className='home-footer-bottom-bottom'>
            <div>

              <p>铁路专用器具采购平台_100% 品质保证，超低折扣，品类齐全，正品行货，全国联保，全球领先的工业品商城。超过100万种商品在线热销!</p>
              <p>CopyRight © 昂牛商城 2016 - 2019 版权所有 蜀 ICP 16032302 号 -1</p>
              <p>增值电信业务经营许可证：川 B2-20170405 站长统计</p>
              <p>地址：四川省成都市天府新区天府三街 218 号峰汇中心</p>
            </div>
            <div className="footer-box_time">
              <p className='tel'>028-83368980</p>
              <p className='ft14'>服务时间：周一至周五</p>
              <p className='ft14'>(法定节假日除外)9:00-18:00</p>
            </div>
            <div>
              <img src={require('./../image/erweima.png')} alt='' />
            </div>
          </div>
        </div>
      </div>
    )
  }
  
}