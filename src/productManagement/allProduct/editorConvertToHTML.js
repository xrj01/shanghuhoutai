import React, { Component } from 'react';
import api from "./../../components/api";
import { EditorState, convertToRaw ,ContentState} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import publicFn from "./../../components/public";
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {message} from "antd";




export default class EditorConvertToHTML extends Component {
    state = {
        editorState: EditorState.createEmpty(),
    };
    onEditorStateChange=(editorState)=> {
        this.setState({
            editorState,
        },()=>{
            //将富文本转换为html
            const htmlDom = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
            this.props.content(htmlDom);
        });
    };

    //将内容转变为富文本内容
    upHtml=(content)=>{
        const contentBlock = htmlToDraft(content);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                this.setState({ editorState })
            }
    };
    uploadImageCallBack=(file)=>{
        const frontend_sts_token = this.props.signature;
        const productId = this.props.productId;
        return publicFn.draftUpFile(file,frontend_sts_token,this.props.getProductSign,this.uploadImageCallBack,productId).catch((error)=>{
            message.warning("图片上传签名过期，点击取消从新上传");
        })
    };
    render() {
        const { editorState } = this.state;
        const {isEdit} = this.props;
        return (
            <div>
                <Editor
                    editorState={editorState}
                    readOnly={!isEdit}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    onEditorStateChange={this.onEditorStateChange}
                    localization={{ locale: 'zh'}}
                    onChange={this.onChange}
                    toolbar={{
                        options:['inline','blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'image', 'remove', 'history'],
                        list: { inDropdown: true },
                        history: { inDropdown: true },
                        image: {
                            previewImage: true,
                            inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                            uploadCallback: this.uploadImageCallBack,
                            alt: { present: false, mandatory: false }
                        },
                    }}
                />
            </div>
        );
    }
}
