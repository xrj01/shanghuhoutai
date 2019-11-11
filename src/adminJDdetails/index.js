import React from "react";
// import Nav from "../components/nav";
import {Breadcrumb, Icon, Input, Button, Row, Spin , message} from 'antd';
import ImgBig from "../component/JDimgBig";
import prompt from "../component/prompt";
import {Link} from "react-router-dom";
import Footer from "./../component/homeFooterBottom"
import "./index.scss";
import api from "../components/api";
import Header from "../component/header"

class adminJDdetails extends React.Component{
    constructor(props) {
        super(props);
        this.state= {
            payNumber: 1,
            data: {},
            classBreadcrumb: {},
            attribute: {},
            
            inventory: 0,
            goodsId: "",
            spinLoad:true,

            // ↓ ------------- 获取同类商品接口数据 -----------
            product: {},
            product_id: "", // ←商品编号
            class_name_1:'',
            class_name_2:'',
            class_name_3:'',
            title:'',

            compare_Data: [],
            classId : "",
            jd_collection:0,

        }
    }
    // ↓ ---------- 页面载入时 根据传递来的ID 获取当前页面的数据 -------------
    componentDidMount(){
        //获取商品id
        this.setState({
            product_id : this.props.location.search.slice(1)
        },()=>{
            this.getJdGoos()
        })
    }
    
    // 获取京东商品详情api
    getJdGoos(){
        let data = {product_id : this.state.product_id}
        api.axiosPost('jd_product_info',data)
        .then((res)=>{

            if(res.data.code == 1){
                const class_name = res.data.data.class_name;
                let arr = class_name.split('-');
                if(res.data.data.title.length>10){
                    var str = res.data.data.title.substring(0,10)+'...'
                }else{
                    str = res.data.data.title
                }
                this.setState({
                    class_name_1 : arr[0],
                    class_name_2 : arr[1],
                    class_name_3 : arr[2],
                    title : str,
                    product:res.data.data,
                    isCollection:res.data.data.collection == 1 ? true : false,
                    total: res.data.data.total_row,
                    jd_collection:res.data.data.jd_collection
                })
            }else{
                message.error(res.data.msg)
            }


            this.setState({spinLoad:false})
        })
    }
    
    render(){
        const {product,spinLoad} = this.state;
        return(
            <div className="goodDetails">
                
                <Header/>
                <Spin spinning={spinLoad}>
                    <div className='mt20'>
                        <div className="goods-details-box">

                            <div className="goods-introduce">
                                <div className="goods-img-big-box">
                                    <ImgBig pic_cont={product.pic}/>
                                </div>
                                <div className="goods-introduce-box">
                                    <div className="goods-title-box">
                                        <h4>
                                            {product.title}
                                        </h4>
                                        <div className="goods-price">
                                            价格: <span>￥{product.jd_price}</span>
                                        </div>
                                        
                                    </div>
                                    <div className="goods-instructions-box">
                                        <ul>
                                            <li>
                                                <p>品&emsp;牌：<span>{product.brand_name}</span> </p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="jd_details_box">
                                <div className="jd_trateName_box">
                                    <div className="trateName_box_title">
                                        <p>四川省昂牛工铁贸科技有限公司</p>
                                    </div>
                                    <div className="trateName_box_tel">
                                        <p><span>地址：四川省 成都市 高新区 中国&emsp;（四川）自由贸易试验区成都府大道北段1700号9栋1单元6层627号</span></p>
                                    </div>
                                    
                                    <div className='jd_brief'>
                                        昂牛工铁贸科技有限公司创立于2016年,旗下包含昂牛铁道商城（www.tdsc360.com）和跨境电商平台(www.goforrail.com)及国内外线下永久体验馆三个业务版块。昂牛集团是专业做铁路物资、工程物资及MRO工业品的B2B、V2V全球电商交易平台。分别为客户供应铁道物资装备、工程物资装备、电力/市政工程物资、小批量零星采购（低值易耗品）、工程非安装设备物资、智能通信信号、强弱四电工程物资、机电设备及配件、电工电料、数码电子类综合、家电产品、酒店用品、劳保用品、办公用品的物资采购。
                                    </div>
                                </div>
                                {/* 后台返回html */}
                                <div className='commodity-product-content'>
                                    <div className='commodity-product-box'>
                                        <div className='commodity-product-title'>商品详情</div>
                                    </div>

                                    <div dangerouslySetInnerHTML={{__html:product.introduction}} className='commodity-product-img'>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </Spin>
                {/* <PriceConponents /> */}
                <Footer/>
                {/* <WinButton /> */}
            </div>
        )
    }
}

export default adminJDdetails