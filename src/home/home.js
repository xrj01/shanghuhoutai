import React from "react";
import api from './../components/api'
import './home.scss'
export default class Home extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state={
            data:''
        }
    }

    render(){
        const {data} = this.state
        return(
            <div className='merchants-homepage-box'>
                {/* 头部信息 */}
                <div className='merchants-homepage-header'>
                    <div className='merchants-header-left'>
                        <div className='merchants-header-left-img'>
                            <img src={require('./../image/headportrait.png')} alt=''/>
                        </div>
                        <div className='text-center ft-12'>HI,{data.username}</div>
                        {/* <div className='text-center ft-12'>上午好,为梦想加油！</div> */}
                    </div>
                    <div className='merchants-header-middle'>
                        <div className='merchants-header-middle-top'>
                            <div className='ft-18'>{data.merchant_name}</div>
                            {/* <img src={require('./../image/editor.png')} className='merchants-header-top-img' alt=''/> */}
                        </div>
                        <div className='merchants-header-middle-center'>
                            (用户名：{<span>{data.username}</span>})
                        </div>
                        <div className='merchants-header-middle-bottom'>
                            <div>
                                <img src={require('./../image/img_certification.png')} alt=''/>
                                <span>企业认证</span>
                            </div>
                            <div>
                                <img src={require('./../image/img_certified.png')} alt=''/>
                                {/* <span className='attestation-text'>手机认证</span> */}
                            </div>
                        </div>
                    </div>
                    <div className='merchants-header-right'>
                        <div className='merchants-header-right-top'>店铺统计</div>
                        <div className='merchants-header-right-bottom'>
                            <div>
                                <div>{data.done_order_product}</div>
                                <div>已销售商品数</div>
                            </div>
                            <div>
                                <div>{data.done_product_month}</div>
                                <div>本月销量</div>
                            </div>
                            <div>
                                <div>{data.followed_count}</div>
                                <div>被关注数</div>
                            </div>
                            <div>
                                <div className='red'>￥{data.saled_money}</div>
                                <div>累计销售金额</div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 交易提示 */}
                <div className='merchants-homepage-trading'>
                    <div className='merchants-homepage-trading-title'>交易提示</div>
                    <div className='merchants-homepage-trading-content'>
                        <div>
                            <img src={require('./../image/img_shipped.png')} alt=''/>
                            <div>待发货</div>
                            <div>（{data.wait_deliver_order}）</div>
                        </div>
                        <div>
                            <img src={require('./../image/img_received.png')} alt=''/>
                            <div>待收货</div>
                            <div>（{data.wait_recieve_order}）</div>
                        </div>
                        <div>
                            <img src={require('./../image/img_Closed.png')} alt=''/>
                            <div>已关闭</div>
                            <div>（{data.had_close_order}）</div>
                        </div>
                        <div>
                            <img src={require('./../image/img_full_order.png')} alt=''/>
                            <div>全部订单</div>
                            <div>（{data.total_order}）</div>
                        </div>
                    </div>
                </div>
                {/* 商品统计 */}
                <div className='merchants-homepage-trading'>
                    <div className='merchants-homepage-trading-title'>商品统计</div>
                    <div className='merchants-homepage-trading-content'>
                        <div>
                            <img src={require('./../image/hasbeenon.png')} alt=''/>
                            <div>已上架</div>
                            <div>（{data.sale_product_count}）</div>
                        </div>
                        <div>
                            <img src={require('./../image/tostayon.png')} alt=''/>
                            <div>待上架</div>
                            <div>（{data.wait_sale_count}）</div>
                        </div>
                        <div>
                            <img src={require('./../image/remove.png')} alt=''/>
                            <div>已下架</div>
                            <div>（{data.withdrawn_count}）</div>
                        </div>
                        <div>
                            <img src={require('./../image/all.png')} alt=''/>
                            <div>全部商品</div>
                            <div>（{data.total_product_count}）</div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
    componentDidMount(){
        this.getBasicInfo()
    }
    //暂用获取基础信息接口
    getBasicInfo(){
        api.axiosPost("merchantCenter").then((res)=>{
            if(res.data.code === 1){
                this.setState({
                    data : res.data.data
                })
            }
        })
    }
}