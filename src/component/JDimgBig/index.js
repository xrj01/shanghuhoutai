import React from "react";
import "./index.scss";
import prompt from "../../component/prompt";
import api from "../../components/api";
export default class ImgBig extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            imgBox:["1-1","2-2","3-3","4-4"],
            imgList:["1-1-1","2-2-2","3-3-3","4-4-4"],
            imgBig:["1","2","3","4"],
            imgIndex:0,
            isTrue:false,
            imgBoxDom:null,
            imgDom:null,
            moveDivDom:null,
            bigImgDom:null,
            imgBigBoxDom:null
        }

    }

    async componentDidMount() {
        const imgBoxDom = this.refs.imgBoxDom;
        const imgDom = this.refs.imgDom;
        const moveDivDom = this.refs.moveDivDom;
        const bigImgDom = this.refs.bigImgDom;
        const imgBigBoxDom = this.refs.imgBigBoxDom;
        this.setState({moveDivDom,imgDom,imgBoxDom,bigImgDom,imgBigBoxDom})
    }

    //鼠标移入更换图片
    imgIndex=(imgIndex)=>{ 
        this.setState({imgIndex});  
    };
    //隐藏显示移动框div
    showMoveDiv=(isTrue)=>{this.setState({isTrue}); };

    //div跟随鼠标移动
    moveDiv=(e)=>{
        const scrollTop = document.documentElement.scrollTop;
        const {moveDivDom,imgBoxDom,bigImgDom,imgBigBoxDom} = this.state;
        const pageX = e.pageX;
        const pageY = e.pageY - scrollTop;
        // const imgBoxDomLeft = imgBoxDom.offsetLeft;
        const imgBoxDomLeft = imgBoxDom.getBoundingClientRect().left;
        const imgBoxDomTop = imgBoxDom.getBoundingClientRect().top;

        const imgBoxDomWidth = imgBoxDom.offsetWidth;
        const imgBoxDomHeight = imgBoxDom.offsetHeight;

        const moveDivDomWidth = moveDivDom.offsetWidth;
        const moveDivDomHeight = moveDivDom.offsetHeight;

        const bigImgDomWidth = bigImgDom.offsetWidth;
        const bigImgDomHeight = bigImgDom.offsetHeight;

        const imgBigBoxDomWidth = imgBigBoxDom.offsetWidth;
        const imgBigBoxDomHeight = imgBigBoxDom.offsetHeight;

        //获取右边图片与外框的比例
        const proportionX = bigImgDomWidth/imgBigBoxDomWidth;
        const proportionY = bigImgDomHeight/imgBigBoxDomHeight;

        let X = pageX - imgBoxDomLeft - moveDivDomWidth/2;
        let Y = pageY - imgBoxDomTop - moveDivDomHeight/2;

        if( X <= 0 ){  X = 0 }
        if( Y <= 0 ){ Y = 0 }
        if( X >= imgBoxDomWidth - moveDivDomWidth){ X = imgBoxDomWidth - moveDivDomWidth ;}
        if( Y >= imgBoxDomHeight - moveDivDomHeight){ Y = imgBoxDomHeight - moveDivDomHeight; }
        //左边图片移动的位置比列
        let imgMoveX = X / imgBoxDomWidth * (bigImgDomWidth - imgBigBoxDomWidth) * proportionX;
        let imgMoveY = Y / imgBoxDomHeight * (bigImgDomHeight - imgBigBoxDomHeight) * proportionY;

        moveDivDom.style.transform = `translate(${X}px,${Y}px)`;
        moveDivDom.style.width =`${imgBoxDomWidth / proportionX}px`;
        moveDivDom.style.height = `${imgBoxDomHeight / proportionY}px`;

        bigImgDom.style.transform = `translate(${-imgMoveX}px,${-imgMoveY}px)`;
    };

    render(){
        const {imgIndex,isTrue} = this.state;
        const{pic_cont} = this.props;

        const win_picture=[],win_HB_picture=[];

        pic_cont && pic_cont.map((item)=>{
            const replaceImg= item.replace('.com/n4/','.com/n1/');
            win_picture.push(replaceImg);
            win_HB_picture.push(replaceImg);
        })
        
        return(
            <div className='img-big' onClick={this.aaa}>
                <div className="img-box"
                     ref="imgBoxDom"
                     onMouseMove={this.moveDiv}
                     onMouseOut={()=>{this.showMoveDiv(false)}}
                     onMouseOver={()=>{this.showMoveDiv(true)}}>
                    <img src={win_picture[imgIndex]} alt="" ref='imgDom'/>
                    <div style={{display:isTrue ? "block" : "none"}} className="img-move-div" ref='moveDivDom'> </div>
                </div>
                <ul>
                    {
                        pic_cont && pic_cont.map((item,index)=>{
                            if(index<5){
                                return(
                                    <li className={imgIndex == index ? "active" : ""} key={index} onMouseOver={()=>{this.imgIndex(index)}}>
                                        <img src={item} alt=""/>
                                    </li>
                                )
                            }
                        })
                    }
                </ul>
                <div className="img-big-box" ref="imgBigBoxDom" style={{display:isTrue ? "block" : "none"}}>
                    <img src={win_HB_picture[imgIndex]} alt="" ref='bigImgDom'/>
                </div>
            </div>
        )
    }
}