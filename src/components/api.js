import Axios from "./axios";


//const port = "http://192.168.2.167:10082";
//const port = "http://192.168.2.167:82";
//const port = "http://192.168.2.144:10082"; //袁光志
// const port = "https://anmro.cn";

const port = "http://192.168.2.167:82";
// const port = "http://192.168.2.167:10082";
// const port = "http://192.168.2.139:8080"; //袁光志
// const port = "https://anmro.cn";

//const sign = 'http://14j508a766.iok.la:28430';

class api{
    urlApi = {
        getProductSign:port + "/getProductSign",  //获取上传图片的签名
        getProductSignDelete:port + "/delete",  //删除图片

        getCaptcha:port + "/merchant/register/getCaptcha", //获取验证码
        getArea:port + "/merchant/register/get_area", //获取省市区
        register:port + "/merchant/register",  //商户注册
        supplyInfo:port + "/merchant/register/supplyInfo",  //商户入驻（补充信息）
        checkIsPass:port + "/merchant/register/checkIsPass",  //查询商户是否通过审核
        checkState:port + "/merchant/register/checkState",  //检测商户状态
        updateState:port + "/merchant/register/updateState",  //审核成功
        getMerchantInfoById:port + "/merchant/register/getMerchantInfoById",  //获取补充信息

        login:port + "/merchant/login",  //登录
        sendCode:port + "/merchant/register/getCaptcha", //获取验证码
        submitCode:port + "/merchant/register/checkCode",//提交验证码
        submitNewPwd:port + "/merchant/register/resetPassword",//提交新密码
        getBasicInfor:port + "/merchant/register/baseInfo",//获取基础信息
        editorBasicInfor:port + "/merchant/register/editBaseInfo",//编辑基础信息
        changePwd:port + "/merchant/register/updatePwd",//修改密码
        changeTel:port + "/merchant/register/updatePhone",//修改手机号
        addMerchant:port + "/merchant/product/add",  //添加商品
        getListMerchant:port + "/merchant/get_list",  //得到分类列表
        getParamMerchant:port + "/merchant/get_param",  //得到三级分类的属性列表
        richTextEditorFile:port + "/merchant/product/richTextEditorFile",  //图片上传
        merchantOwnProductClass:port + "/merchant/product/merchant_own_product_class",  //获取商户已添加商品的三级分类
        productList:port + "/merchant/product/product_list",  //获取商户已添加商品的三级分类
        getProductId:port + "/merchant/product/get_product_id",  //获取商品id
        get_product_info:port + "/merchant/product/get_product_info",  //商品编辑时获取商品详细信息
        apply_sale:port + "/merchant/product/apply_sale",  //商品上架
        apply_backout:port + "/merchant/product/apply_backout",  //商品下架
        product_delete:port + "/merchant/product/delete",  //商品删除
        product_edit:port + "/merchant/product/edit",  //商品修改
        updateProductCount:port + "/merchant/product/update_product_count",  //修改图片数量

        autoReadLicense:port + "/merchant/register/autoReadLicense",  // 自动识别营业执照信息

        // -------8.15-------
            // --------订单-------
        getOrderList:port + "/merchant/order/orderList",     // 获取订单列表
        messageCenter: port + "/merchant/order/message_list", // 消息中心
        getOrderDetail: port + "/merchant/order/orderDetails", // 订单详情
        setDeliver: port + "/merchant/order/DeliverGoods",     // 设置发货
        read_message:port + "/merchant/order/read_message",        // 已读信息  
        merchantCenter: port + "/merchant/order/merchantIndex",    // 商家中心

        gitGoodsDetails: port + "/merchant/order/product_info",    // 获取商品详情
        jd_product_info: port + "/jd/product_info",                // 获取京东商品详情
    };
    axiosPost(url,data,form){
        const add = this.urlApi[url] ? this.urlApi[url] : url;
        return Axios(add,data,"post",form);
    };
    axiosGet(url,data){
        const add = this.urlApi[url];
        return Axios(add,data,"get");
    };
    imgUrl="http://img.anmro.cn/";

}

export default new api();
