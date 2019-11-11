import React from 'react';
import {Link} from 'react-router-dom';
import './homeFooter.scss';


export default class Header extends React.Component{
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <div className='home-footer-box'>
        <div className='home-footer-container'>
            <div className='footer-container-top'>
              <div>
                <img src={require('./../image/gouwuche.png')} alt='' />
                <span>品类齐全&emsp;一站购齐</span>
              </div>
              <div>
                <img src={require('./../image/pingzhi.png')} alt='' />
                <span>品质保障&emsp;购买无忧</span>
              </div>
              <div>
                <img src={require('./../image/fuwu.png')} alt='' />
                <span>特色服务&emsp;多种付款方式</span>
              </div>
              <div>
                <img src={require('./../image/woshou.png')} alt='' />
                <span>帮助中心&emsp;购物指南</span>
              </div>
            </div>
            {/* 列表 */}
            <div className='footer-list-box'>
              <ul>
                <li><Link to="#">店铺管理</Link></li>
                <li><Link to="#">订单管理</Link></li>
                <li><Link to="#">商家帮助中心</Link></li>
              </ul>
              <ul>
                <li><Link to="#">新手指南</Link></li>
                <li><Link to="#">购物指南</Link></li>
                <li><Link to="#">铁道物资采购目录</Link></li>
                <li><Link to="#">铁道行业标准查询</Link></li>
                <li><Link to="#">名词解释</Link></li>
              </ul>
              <ul>
                <li><Link to="#">商家入驻</Link></li>
                <li><Link to="#">合同</Link></li>
                <li><Link to="#">卖家入驻</Link></li>
                <li><Link to="#">入驻流程</Link></li>
              </ul>
              <ul>
                <li><Link to="#">售后服务</Link></li>
                <li><Link to="#">售后退款说明</Link></li>
                <li><Link to="#">售后物资及商品返</Link></li>
                <li><Link to="#">回售后政策（三方）</Link></li>
                <li><Link to="#">售后政策（自营）</Link></li>
                <li><Link to="#">退换货返修申请</Link></li>
              </ul>
              <ul>
                <li><Link to="#">商城服务</Link></li>
                <li><Link to="#">价格保护</Link></li>
                <li><Link to="#">配送方式</Link></li>
                <li><Link to="#">全球购</Link></li>
                <li><Link to="#">铁道商城代下单</Link></li>
                <li><Link to="#">一键购</Link></li>
                <li><Link to="#">知识产权维权</Link></li>
              </ul>
              <ul>
                <li><Link to="#">客服中心</Link></li>
                <li className='footer-list-red'>028-83368980</li>
                <li>服务时间：周一到周五</li>
                <li>(法定节假日除外)9:00-18:00</li>
              </ul>
            </div>
        </div>
      </div>
    )
  }
  
}