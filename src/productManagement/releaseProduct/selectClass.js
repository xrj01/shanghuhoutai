import React from "react";
import {Select,Col,Row,Button,message} from "antd";
import api from "./../../components/api";
import publicFn from "./../../components/public";
const Option = Select.Option;
export default class SelectClass extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            parentId:1,
            levelList1:[],
            levelList2:[],
            levelList3:[],
            backup1List:[],
            backup2List:[],
            backup3List:[],
            level1Select:null,
            level2Select:null,
            level3Select:null,
            level1History:[],  //一级分类历史选项
            level2History:[],  //二级分类历史选项
            level3History:[],   //三级分类历史选项
            history1Value:[],
            history2Value:[],
            history3Value:[],
            history1Dom:null,
            history2Dom:null,
            history3Dom:null
        }
        this.history1 = React.createRef();
        this.history2 = React.createRef();
        this.history3 = React.createRef();
    };
    componentDidMount() {
        const level1History = publicFn.getLocalStorage("level1History");
        const level2History = publicFn.getLocalStorage("level2History");
        const level3History = publicFn.getLocalStorage("level3History");
        const history1Dom = this.history1.current;
        const history2Dom = this.history2.current;
        const history3Dom = this.history3.current;
        this.setState({
            level1History:level1History ? JSON.parse(level1History) : [],
            level2History:level2History ? JSON.parse(level2History) : [],
            level3History:level3History ? JSON.parse(level3History) : [],
            history1Dom,
            history2Dom,
            history3Dom
        });
        this.getListMerchant();
    }
    //获取分类列表
    getListMerchant=(itemId,level)=>{
        const {parentId} = this.state;
        const id = itemId ? itemId : parentId;
        const data={id};
        api.axiosPost("getListMerchant",data).then((res)=>{
            if(res.data.code == 1){
                const dataList = res.data.data;
                if(!dataList.length){message.error("没有子分类")}

                if(level == 2){
                    this.setState({
                        levelList2:dataList,
                        backup2List:dataList,
                        levelList3:[],
                        backup3List:[],
                        level2Select:null,
                        level3Select:null,
                    })
                }
                if(level == 3){
                    this.setState({
                        levelList3:dataList,
                        backup3List:dataList
                    })
                }
                if(!level){
                    this.setState({
                        levelList1:dataList,
                        backup1List:dataList,
                    })
                }
            }
        })
    };
    // 分类选择事件
    selectClass=(levelId,item,level)=>{
        switch (level) {
            case 2:
                this.setState({
                    history2Value:[],
                    history3Value:[]
                });
                this.listHistory(item.name,"history1Value",0);
                break;
            case 3:
                this.setState({
                    history3Value:[]
                });
                this.listHistory(item.name,"history2Value",1);
                break;
            case 4:
                this.listHistory(item.name,"history3Value",2);
                break;
        }
        this.setState({
            [levelId]:item
        });
        if(level !=4){
            this.getListMerchant(item.id,level)
        }
    };
    //控制步骤条
    changeStep=()=>{
        const {level1Select,level2Select,level3Select} = this.state;
        this.props.changeStep("+");
        //分类信息传递给下一页
        this.props.editReleaseGoodsDom.getClassDate(level1Select,level2Select,level3Select);
        this.props.editReleaseGoodsDom.getProductId();
    };
    //数据初始化
    emptyDate=()=>{
        this.setState({
            parentId:1,
            levelList1:[],
            levelList2:[],
            levelList3:[],
            level1Select:null,
            level2Select:null,
            level3Select:null,
        },()=>{
            this.getListMerchant();
        })
    };
    //点击列表时数据进行缓存
    listHistory=(value,type,index)=>{
        const {level1History,level2History,level3History} = this.state;
        const historyArr = [level1History,level2History,level3History];
        const selectValue = value;
        historyArr[index].unshift(selectValue ? selectValue : "");
        const isEmpty = historyArr[index].filter((item)=>{ if(item){  return item; } });
        const list = Array.from(new Set([...isEmpty]));
        publicFn.setLocalStorage(`level${index+1}History`,JSON.stringify(list.slice(0,10)));
        const setArr = `level${index+1}History`;
        this.setState({
            [setArr]:list.slice(0,10)
        });
    };
    //搜索历史框
    searchHistory=(value,type,index)=>{
        const {level1History,level2History,level3History,history1Dom,history2Dom,history3Dom} = this.state;
        const historyArr = [level1History,level2History,level3History];
        const historyDomArr = [history1Dom,history2Dom,history3Dom];
        const selectValue = value[value.length-1 < 0 ? 0 : value.length-1];
               historyArr[index].unshift(selectValue ? selectValue : "");
        const isEmpty = historyArr[index].filter((item)=>{ if(item){  return item; } });
        const list = Array.from(new Set([...isEmpty]));
        publicFn.setLocalStorage(`level${index+1}History`,JSON.stringify(list.slice(0,10)));
        const setArr = `level${index+1}History`;
        historyDomArr[index].blur();
        this.screeningList(selectValue,index);
        this.setState({
            [type]:selectValue,
            [setArr]:list.slice(0,10)
        });
    };
    //筛选出所选择的数据
    screeningList=(value,index)=>{
        const {levelList1,levelList2,levelList3,backup1List,backup2List,backup3List} = this.state;
        const levelLists=[levelList1,levelList2,levelList3];
        const backupLists=[backup1List,backup2List,backup3List];
        let newLevelList = [];
        if(!value){
            newLevelList = backupLists[index]
        }else{
            newLevelList = levelLists[index].filter((item)=> {
                if(item.name.indexOf(value) > -1){
                    return item;
                }
            });
        }
        const type = `levelList${index+1}`;
        this.setState({
            [type]:newLevelList
        })
    };
    render(){
        const {steps} = this.props;
        const {
            levelList1,levelList2,levelList3,
            level1Select,level2Select,level3Select,
            level1History,level2History,level3History,
            history1Value,history2Value,history3Value,
        } = this.state;
        return(
            <div style={{display: steps == 0 ? "block" : "none"}}>
                <div className="select-class-box">
                    <div className="select-class-list">
                        <div className="history-box">
                            <Select value={history1Value}
                                    ref={this.history1}
                                    mode="tags"
                                    onChange={(value)=>{this.searchHistory(value,"history1Value",0)}}
                                    placeholder="历史搜索" className='width-1' >
                                {
                                    level1History.map((item)=>(<Option key={item} value={item}>{item}</Option>))
                                }
                            </Select>
                        </div>
                        <ul>
                            {
                                levelList1 && levelList1.map((item)=>(
                                    <li key={item.id}
                                        className={level1Select && level1Select.id == item.id ? "active" : ""}
                                        onClick={()=>{this.selectClass("level1Select",item,2)}}>{item.name}</li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className="select-class-list">
                        <div className="history-box">
                            <Select value={history2Value}
                                    ref={this.history2}
                                    mode="tags"
                                    onChange={(value)=>{this.searchHistory(value,"history2Value",1)}}
                                    placeholder="历史搜索" className='width-1' >
                                {
                                    level2History.map((item)=>(<Option key={item} value={item}>{item}</Option>))
                                }
                            </Select>
                        </div>
                        <ul>
                            {
                                levelList2 && levelList2.map((item)=>(
                                    <li key={item.id}
                                        className={level2Select && level2Select.id == item.id ? "active" : ""}
                                        onClick={()=>{this.selectClass("level2Select",item,3)}}>{item.name}</li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className="select-class-list">
                        <div className="history-box">
                            <Select value={history3Value}
                                    mode="tags"
                                    ref={this.history3}
                                    onChange={(value)=>{this.searchHistory(value,"history3Value",2)}}
                                    placeholder="历史搜索" className='width-1' >
                                {
                                    level3History.map((item)=>(<Option key={item} value={item}>{item}</Option>))
                                }
                            </Select>
                        </div>
                        <ul>
                            {
                                levelList3 && levelList3.map((item)=>(
                                    <li key={item.id}
                                        className={level3Select && level3Select.id == item.id ? "active" : ""}
                                        onClick={()=>{this.selectClass("level3Select",item,4)}}>{item.name}</li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
                <div className="current-select">
                    您当前的选择是：
                    {level1Select && level1Select.name}
                    { level2Select ? ` > ${level2Select.name}`: null}
                    {level3Select ? ` > ${level3Select.name}` : null}
                </div>
                <div className="step-edit-goods-box">
                    <Button
                        disabled={level3Select ? false : true}
                        type='primary' onClick={this.changeStep}>
                        下一步，编辑产品信息
                    </Button>
                </div>
            </div>
        )
    }

}