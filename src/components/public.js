import api from "./api";
import {message} from "antd";

const Public = {
    //数字补零
    addZero:(number)=>{
        if(number<10){
            return `0${number}`
        }else{
            return number;
        }
    },
    draftUpFile:(file,frontend_sts_token,errorFn,callFn,productId)=>{ //富文本上传文件
        return new Promise(
            (resolve, reject) => {
                let name = file.name;
                let formData = new FormData();
                formData.append('name', productId + name);
                formData.append('key',  frontend_sts_token.dir + productId + name);
                formData.append('policy', frontend_sts_token.policy);
                formData.append('OSSAccessKeyId', frontend_sts_token.accessid);
                formData.append('success_action_status', '200');
                // formData.append('callback', frontend_sts_token.callback);
                formData.append('signature', frontend_sts_token.signature);
                formData.append('file', file);

                api.axiosPost(frontend_sts_token.host,formData,"formData").then((res)=>{
                    let img = new Image();
                    // img.src = api.imgUrl + frontend_sts_token.dir + frontend_sts_token.merchantId + name + `?v=${Math.random()}`;
                    img.src = api.imgUrl + frontend_sts_token.dir + productId + name + `?v=${Math.random()}`;
                    resolve({
                        data: {
                            link: img.src
                        }
                    });
                }).catch(function (error) {
                    errorFn && errorFn(file,true,callFn && callFn);
                    message.warning("图片上传中出了点小差，点击取消按钮后从新上传");
                })
            }
        );
    },
    antdUpFile:(file,frontend_sts_token,productId,index)=>{
        const imgSize = Public.imgSize('1000',true);
        return new Promise(
            (resolve, reject) => {
                let name = `${productId}-${index}.jpg`;
                let formData = new FormData();
                formData.append('name', name);
                formData.append('key',  frontend_sts_token.dir + name);
                formData.append('policy', frontend_sts_token.policy);
                formData.append('OSSAccessKeyId', frontend_sts_token.accessid);
                formData.append('success_action_status', '200');
                // formData.append('callback', frontend_sts_token.callback);
                formData.append('signature', frontend_sts_token.signature);
                formData.append('file', file.file);
                api.axiosPost(frontend_sts_token.host,formData,"formData").then((res)=>{

                    const src = api.imgUrl + frontend_sts_token.dir + name + imgSize;
                    resolve({
                        data:{
                            uid: index,
                            name: name,
                            status: 'done',
                            url: src,
                        },
                        status:"ok"
                    });
                    /*if(res.data.Status == "OK"){
                        const src = api.imgUrl + frontend_sts_token.dir + name + imgSize;
                        resolve({
                            data:{
                                uid: index,
                                name: name,
                                status: 'done',
                                url: src,
                            },
                            status:"ok"
                        });
                    }else{
                        reject(res)
                    }*/

                }).catch(function (error) {
                    reject(error)
                })
            }
        );
    },
    setSession:(key,value)=>{
        window.sessionStorage.setItem(key,value)
    },
    getSession:(key)=>{
        return window.sessionStorage.getItem(key)
    },
    setLocalStorage:(key,value)=>{
        window.localStorage.setItem(key,value)
    },
    getLocalStorage:(key)=>{
        return window.localStorage.getItem(key)
    },
    imgSize:(size=200,cache)=>{
        const sizeList={
            "50":["50","50"],  //0宽、1高
            "1000":["1000","1000"],  //0宽、1高
            "200":["200","185"],  //0宽、1高
            "100":["100","100"],
            "244":["244","182"],
            "300":["300","300"],
            "500":["400","400"],
            
        };

        //console.log(size)
        if(cache){
            return `?x-oss-process=image/auto-orient,1/resize,m_lfit,w_${sizeList[size][0]},h_${sizeList[size][1]}/format,png&png=${Math.random()}.png`;
        }
        return `?x-oss-process=image/auto-orient,1/resize,m_lfit,w_${sizeList[size][0]},h_${sizeList[size][1]}/format,png`
    },
    imgUrl:(merchantsId,goodsId,i=0,size=50,dir='product',cache)=>{
        return `${api.imgUrl}${dir}/test/${merchantsId}/${goodsId}-${i}.jpg${Public.imgSize(size,cache)}`
        // return `${api.imgUrl}${dir}/${merchantsId}/${goodsId}-${i}.jpg${Public.imgSize(size,cache)}`
    },

    imgUrlBasic:(merchantsId,goodsId,i=0,v=0,dir='product',size=50)=>{
        return `${api.imgUrl}${dir}/test/${merchantsId}/${goodsId}-${i}.jpg?${v}`
        // return `${api.imgUrl}${dir}/${merchantsId}/${goodsId}-${i}.jpg?${v}`
    },
    getProductSign:(dir,id)=>{
        return `${dir}/test/${id}`;
        // return `${dir}/${id}`;
    },
    deleteImgDir:(dir)=>{
        return `${dir}/test/`
        // return `${dir}/`
    }
};

export default Public