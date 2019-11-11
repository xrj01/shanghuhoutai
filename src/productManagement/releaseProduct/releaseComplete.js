import React from "react";
import {Icon} from "antd";
import {Link} from "react-router-dom";
export default class ReleaseComplete extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    changeStep=()=>{
        this.props.changeStep("2")
    };
    render(){
        return(
            <div className='release-complete-box'>
                <div className='release-complete-title'>
                    <Icon type="check-circle" theme="filled" />
                    <h4>BINGO,商品发布成功</h4>
                </div>
                <div className="release-complete-operation">
                    <h4>您还可以&emsp;&emsp;</h4>
                    <p>1.继续 <span onClick={this.changeStep}>发布商品</span></p>
                    <p>2.查看 <Link to="/home/AllProduct">商品列表</Link></p>
                </div>
            </div>
        )
    }

}