import React from "react";
import {Link} from "react-router-dom";
import "./content.scss";
// ↓ 引入标题模块
import GoodDetails_Title from "../goodDetails_Title/goodDetails_Title"
export default class Content extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            }
            // ---------------------------------------------
        }
    render(){

        return(
            <div className="content" dangerouslySetInnerHTML={{__html: this.props.content}}>

            </div>

        )
    }
}