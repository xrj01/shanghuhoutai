import Home from "./home";
import MerchantsHome from "./home/home";
import ForgetPwd from "./forgetPwd";
import Registration from "./registration";
import Order from "./orderManagement";
import ReleaseProduct from "./productManagement/releaseProduct";
import AllProduct from "./productManagement/allProduct";
import EditView from "./productManagement/allProduct/editAndView";
import BasicInformation from "./informationManagement/basicInformation";
import AuthenticationInformation from "./informationManagement/authenticationInformation";
import AccountSecurity from "./safetyManagement/accountSecurity";
import OrderDetail from "./orderManagement/orderDetail";
import MessageCenter from "./messageCenter";

import AdminJDdetails from "./adminJDdetails/index";
import Admindetails from "./adminDetails/index";
//路由配置 需要优化
const routes = [
    { path:"/home",component:Home, name:"首页",
        routes: [
            { path: "/home", component: MerchantsHome ,name:"商户首页",exact:true},
            { path: "/home/order", component: Order ,name:"我的订单"},
            { path: "/home/orderDetail", component: OrderDetail ,name:"订单详情"},
            { path: "/home/ReleaseProduct", component: ReleaseProduct ,name:"发布产品"},
            { path: "/home/AllProduct", component: AllProduct ,name:"全部产品"},
            { path: "/home/BasicInformation", component: BasicInformation ,name:"基础信息"},
            { path: "/home/AuthenticationInformation", component: AuthenticationInformation ,name:"认证信息"},
            { path: "/home/AccountSecurity", component: AccountSecurity ,name:"账户安全"},
            { path: "/home/EditView", component: EditView ,name:"修改商品"},
            { path: "/home/messageCenter", component: MessageCenter ,name:"消息中心"},
           
            
        ]
    },
    { path: "/forgetPwd", component: ForgetPwd ,name:"忘记密码"},
    { path: "/registration", component: Registration ,name:"申请入驻"},
    { path: "/AdminJDdetails",component:AdminJDdetails, name:"账户京东商品详情页面" },
    { path: "/Admindetails",component:Admindetails, name:"账户商品详情页面" },
    // { path: "/404", component: Error , name:"404"}
];
export default routes;