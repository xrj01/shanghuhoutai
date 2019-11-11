import React from "react";
import {Link} from "react-router-dom";
import "./goodDetails_Title.scss";

export default class GoodDetails_Title extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        // ---------------------------------------------
    }

    render() {

        return (
            <div>
                <div className="title_box">
                    <div className="left_box"/>
                    <div className="conter_box">
                        <p className="zh">产品介绍</p>
                        <p className="us">Overvew</p>
                    </div>
                    <div className="sanjiao"/>
                </div>
            </div>
        )
    }
}