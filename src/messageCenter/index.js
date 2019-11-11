import React from "react";
import { Route, Switch, Link } from 'react-router-dom';
import { Pagination, message, Icon } from "antd";
import { createHashHistory } from 'history';
import api from "../components/api";
import "./index.scss"

const history = createHashHistory();

export default class MessageCenter extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            page_number: 1,
            page_size: 10,
            total: 0,
            messageList: []
        }
    }

    componentDidMount() {
        this.getMessageList();
    }

    getMessageList = () => {
        const { page_number, page_size } = this.state;
        const data = {
            page_number,
            page_size
        };
        api.axiosPost("messageCenter", data).then((res) => {
            // console.log('res', res);
            if (res.data.code == 1) {
                const list = res.data.data.list;
                this.setState({
                    messageList: list,
                    total: res.data.data.total_row
                })
            }
        });
    };
    //消息已读
    isReadMessage=(message_id,orderId)=>{
        const data={message_id}
        api.axiosPost("read_message",data);
        history.push({
            pathname: `/home/orderDetail`,
            search: `?${orderId}`
        })
    };
    render() {
        const { messageList, total } = this.state;
        const pagination = {
            current: this.state.page_number,
            pageSize: 10,
            total: this.state.total,
            onChange: (page) => {
                this.setState({
                    page_number: page
                }, () => {
                    this.getMessageList();
                })
            }
        };
        // console.log('messageList', messageList);
        return (
            <div className="message-center-box">
                <div className="message-center-title">
                    <span>商家中心 <Icon type="right" /> </span>
                    <span>消息中心 <Icon type="right" /> </span>
                    <span className="blue">系统消息</span>
                </div>

                <div className='user-message-box1'>
                    <div className="user-message-head1">
                        <span>系统消息</span>
                    </div>
                    {/* {
                        messageList.length ? 
                    } */}
                    {
                        messageList.length ? 
                        messageList && messageList.map((item) => (
                            <div className="user-message-list1" key={item.id}>
                                <div>
                                    {
                                        item.is_read == 0 && <span> </span>
                                    }
                                    <h5>{item.content}</h5>
                                    {/* <Link to={{ pathname: '/home/orderDetail', search: `?${item.parent_order_id}` }}>查看订单></Link> */}
                                    <a href="javascript:;" onClick={()=>{this.isReadMessage(item.id,item.sub_order_id)}}>查看订单></a>
                                </div>
                                <p>{item.create_time}</p>
                            </div>
                        )) : <div className="empty"><div>暂无消息</div></div>
                    }
                    
                    <div className='user-message-pagination1'>
                        <Pagination 
                            // showQuickJumper 
                            hideOnSinglePage
                            defaultCurrent={1} 
                            itemRender={this.itemRender} 
                            total={total}
                            hideOnSinglePage={true}  {...pagination} />
                    </div> 
                    
                </div>
            </div>
        )
    }

}