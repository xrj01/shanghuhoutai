import api from "./../components/api";
const Prompt = {
    userError:"请输入正确的用户名",  //提示语
    passwordError:"密码输入不正确",
    verificationCode:"验证码错误",
    verificationStatus:["success","warning","error","validating"], //输入框验证错误样式
    checkPhone:(phone)=>{  //验证手机号码
        if(!(/^1[345789]\d{9}$/.test(phone))){
            return false;
        }
        return true;
    },
    checkTel:(tel)=>{ //验证固定电话号码
        if(!/0\d{2,3}-\d{7,8}|\(?0\d{2,3}[)-]?\d{7,8}|\(?0\d{2,3}[)-]*\d{7,8}/.test(tel)){
            return false;
        }
        return true;
    },
    checkTelAndPhone:(number)=>{
        let tel = /0\d{2,3}-\d{7,8}|\(?0\d{2,3}[)-]?\d{7,8}|\(?0\d{2,3}[)-]*\d{7,8}/;
        let phone = /^1[345789]\d{9}$/;
        return tel.test(number) || phone.test(number)
    },
    checkUserId:(userId)=>{ //身份证验证
        if(!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(userId))){
            return false;
        }
        return true;
    },
    isNumber:(number)=>{ //数字验证
        if(!(/^[0-9]+$/).test(number)){
            return false;
        }
        return true;
    },
    setCookie:(name, value, day)=>{
        if(day !== 0){     //当设置的时间等于0时，不设置expires属性，cookie在浏览器关闭后删除
        let expires = day * 24 * 60 * 60 * 1000;
        let date = new Date(+new Date()+expires);
            document.cookie = name + "=" + escape(value) + ";expires=" + date.toUTCString();
          }else{
            document.cookie = name + "=" + escape(value);
          }
    },
    setSession:(key,value)=>{
        sessionStorage.setItem(key,value);
    },
    getSession:(key)=>{
        return sessionStorage.getItem(key);
    },
    addZero:(number)=>{
        if(number < 10){
            return "0" + number;
        }else{
            return "" + number;
        }
    },
    imgSize:(size)=>{
        const imgSize={
            '50':[50,50],
            '64':[64,64],
            '100':[100,100],
            "230":[230,230],
            '300':[300,300],
            '420':[420,420],
            '840':[840,840],
            '80':[80,80],
            '1260':[1260,1260],
            '387':[387,200]// ←优质供应商图片
        };
        return `?x-oss-process=image/auto-orient,1/resize,m_lfit,w_${imgSize[size][0]},h_${imgSize[size][1]}/format,png`;
    },
    imgUrl:(merchant_id,id,size = 230,i = 0)=>{
        // return `${api.imgUrl}product/test/${merchant_id}/${id}-${i}.jpg${Prompt.imgSize(`${size}`)}`;
        return `${api.imgUrl}product/${merchant_id}/${id}-${i}.jpg${Prompt.imgSize(`${size}`)}`;

    },
    getGoodsImgUrl:(merchant_id,id,size = 230,i = 0)=> {
        // return `${api.imgUrl}merchant/test/${merchant_id}/${id}-${i}.jpg${Prompt.imgSize(`${size}`)}`;
        return `${api.imgUrl}merchant/${merchant_id}/${id}-${i}.jpg${Prompt.imgSize(`${size}`)}`;
    },
    antdUpFile:(file,frontend_sts_token,productId)=>{
        return new Promise(
            (resolve, reject) => {
                // let name = `${productId}-${file.file.name}`;
                let name = file.file.name;
                let formData = new FormData();
                formData.append('name', name);
                formData.append('key',  frontend_sts_token.dir + name);
                formData.append('policy', frontend_sts_token.policy);
                formData.append('OSSAccessKeyId', frontend_sts_token.accessid);
                formData.append('success_action_status', '200');
                formData.append('signature', frontend_sts_token.signature);
                formData.append('file', file.file);
                api.axiosPost(frontend_sts_token.host,formData,"formData").then((res)=>{
                    const src = api.imgUrl + frontend_sts_token.dir + name;
                    const storageUrl = frontend_sts_token.dir + name;
                    resolve({
                        data:{
                            uid: Math.random()*100,
                            name: file.file.name,
                            status: 'done',
                            url: src,
                            storageUrl
                        },
                        status:"ok"
                    });
                }).catch(function (error) {
                    reject(error)
                })
            }
        );
    },
    getProductSign:(dir,id)=>{
        // return `${dir ? dir+"/" : ""}test/${id}`;
        return `${dir ? dir + "/" : ""}${id}`;
    },
    };
export default Prompt;