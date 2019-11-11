import React from "react";
import {Link} from "react-router-dom";
import { Button,message } from 'antd';
import api from "./../../components/api";
import "./trateName_data.scss";
export default class Trate extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            // data :this.props.data
            collection:0
        }
    }
    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            collection:nextProps.collection
        })
    }
    //收藏店铺
    collection_merchant=(merchant_id)=>{
        const {collection} = this.state;
        const data={
            merchant_id,
            type: collection ? 0 : 1
        };
        api.axiosPost("collection_merchant",data).then((res)=>{
            if(res.data.code == 1){
                message.success(res.data.msg)
                this.setState({collection:collection == 0 ? 1 : 0})
            }else{
                message.error(res.data.msg)
            }
        })
    };
    render(){
        const {data,merchant_id} = this.props;
        const {collection} = this.state;
        const maxWidth = 15,
            textMaxWidth = 178;
        let title ="",
            text = "";
        if(data.title && data.title.length>maxWidth){
            title = data.title.substr(0,maxWidth)+"...";
            text = data.description.substr(0,textMaxWidth)+"...";
        }
        else {
            title = data.title;
            text = data.description
        }
        return(
            <div className="trateName_box">
                <div className="trateName">
                    <div className="c-title"title={title}>
                        <p>{title}</p>
                    </div>
                    <div className="tel_box">
                        <p><span>地址：</span>{data.district}</p>
                    </div>
                    <div className="button_box">
                        {/* <Button onClick={()=>{this.collection_merchant(merchant_id,collection)}}>
                            {collection == 1 ? "取消收藏" : "收藏店铺"}
                        </Button>
                        <Button>
                            <Link to={`/SupplierDetails?${merchant_id}`}>进入店铺</Link>
                        </Button> */}
                    </div>
                    <div className="description">
                        <p>{text}</p>
                    </div>
                </div>
            </div>
        )
    }
}