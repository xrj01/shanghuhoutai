import React from 'react';
import { Input, Modal, Form, Button, message } from 'antd';
import api from '../components/api';


const { Item } = Form;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
    },
};

class SetDeliverModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id : '',  //  订单id
        }
    }

    // 隐藏弹窗
    hideModal = () => {
        this.props.isShowModal('visible', false)
    }
    // 获取id
    getIDandDetail = (id) => {
        // console.log('iddddddddddddd', id);
        this.setState({ id })
       
    }
    // 设置发货的弹窗确认
    setDeliverGoods = (e) => {
        // 表单取值
        e.preventDefault();
        const { validateFieldsAndScroll, getFieldsValue } = this.props.form;
        // 保存之前验证表单
        validateFieldsAndScroll((err, values) => {
            if (!err) {
                const newData = getFieldsValue();
                const param = { id: this.state.id, }
                // console.log('Object.assign(param, newData)', Object.assign(param, newData));
                api.axiosPost('setDeliver',Object.assign(param, newData)).then(res=>{
                    if(res.data.code === 1) {
                        message.success(res.data.msg)
                        this.props.refreshList()
                        this.hideModal()
                    }else{
                        message.warning(res.data.msg)
                    }
                })
            } else {
                return;
            }
        })
    }

    render() {
        const {display} = this.props;
        const { getFieldDecorator } = this.props.form;
        const footer = (
            <div className="modal-footer">
                <Button type="primary" onClick={this.setDeliverGoods}>确定</Button>
            </div>
        )
        return (
            <Modal
                title="设置发货"
                visible={display}
                onOk={this.setDeliverGoods}
                onCancel={this.hideModal}
                width={520}
                destroyOnClose={true}
                className="setDeliver-modal"
                // footer={footer}
            >
                <Form {...formItemLayout}>
                    <Item label='快递名称'>
                        {getFieldDecorator('courier_name', {
                            rules: [
                                { required: true, message: '请输入快递名称！', }
                            ]
                        })(
                            <Input className="input" placeholder='请输入快递名称' />
                        )}
                    </Item>
                    <Item label='物流单号'>
                        {getFieldDecorator('courier_id', {
                            rules: [
                                { required: true, message: '请输入物流单号！', },
                                { pattern: /^[A-Za-z0-9]+$/, message: '订单编号只能有数字和英文组成'}
                            ]
                        })(
                            <Input className="input" placeholder='请输入物流单号' />
                        )}
                    </Item>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(SetDeliverModal)