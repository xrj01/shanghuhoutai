import React from "react";
import {Breadcrumb ,Steps,Icon } from "antd";
import SelectClass from "./selectClass";
import EditReleaseGoods from "./editReleaseGoods";
import ReleaseComplete from "./releaseComplete";
import api from "./../../components/api";
import "./index.scss";
import { array } from "prop-types";
const { Step } = Steps;
export default class ReleaseProduct extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state={
            steps:0,
            classSelect:[],
            editReleaseGoodsDom:null,
            selectClassDom:null
        };

        this.selectClass = React.createRef();
        this.editReleaseGoods = React.createRef();
    }
    componentDidMount() {
        const editReleaseGoodsDom = this.editReleaseGoods.current;
        const selectClassDom = this.selectClass.current;
        this.setState({selectClassDom,editReleaseGoodsDom});
    }

    deleteThird = (arr) => {
        arr.map(item=>{
            item.map(item2=>{
                delete item2.childrenMsgs
            })
        })
    }
    /* if(item.hasOwnProperty('childrenMsgs') && $index<2){
                index += 1
                deleteThird(item.childrenMsgs)
            }else {
                delete item.childrenMsgs
                return false
            } */

    changeStep=(type)=>{
        let {steps} = this.state;
        if(type == "+"){
            steps +=1;
        }else if(type == "-"){
            steps -=1;
        }else{
            steps = 0;
        }
        this.setState({steps})
    };
    //步骤条图形
    stepNode=(index)=>{
        
        const {steps} = this.state;
        console.log(steps);
        const iArr=[
            <img src={require('./../../image/img_sppl.png')} alt=''/>,
            <img src={require(steps === 1 || steps === 2 ?'./../../image/img_bj2.png':'./../../image/img_hbj.png')} alt=''/>,
            <img src={require(steps === 2 ?'./../../image/img_fbsp2.png':'./../../image/img_hfb.png')} alt=''/>
        ];
        return(
            <span className={ index <= steps ? "step-icon-bg step-icon-box" : "step-icon-box"}>
                {iArr[index]}
            </span>
        )
    };

    render(){
        const {steps,selectClassDom,editReleaseGoodsDom} = this.state;
        const changeStep={
            changeStep:this.changeStep,
            steps,
            editReleaseGoodsDom,
            selectClassDom
        };
        return(
            <div className='release-product-box'>
                <div className='account-security-title'>
                    <span>商家中心 <Icon type="right" /> </span>
                    <span>产品管理 <Icon type="right" /> </span>
                    <span className="blue">发布产品</span>
                </div>
                <div className="release-step-box">
                    <Steps current={steps} labelPlacement='vertical'>
                        <Step title="选择商品分类" icon={this.stepNode(0)}/>
                        <Step title="编辑基本信息" icon={this.stepNode(1)} />
                        <Step title="发布成功" icon={this.stepNode(2)}/>
                    </Steps>
                </div>

                <div className="commodities-editor-box">
                    <SelectClass {...changeStep} ref={this.selectClass}/>
                    <EditReleaseGoods {...changeStep} ref={this.editReleaseGoods} />
                    { steps == 2 ? <ReleaseComplete {...changeStep}/> : null }
                </div>
            </div>
        )
    }

}