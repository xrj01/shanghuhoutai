import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import RouterDom from './router';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'antd/dist/antd.css';
import moment from 'moment';
import 'moment/locale/zh-cn';
import * as serviceWorker from './serviceWorker';

// import 'babel-polyfill'
import 'react-app-polyfill/ie9';   // 兼容ie9
import 'react-app-polyfill/stable';
import 'core-js/es/map';
import 'core-js/es/set';

moment.locale('zh-cn');

// 自定义sessionStorage.removeItem
/* const _r = sessionStorage.removeItem;
sessionStorage.removeItem = function (...test) {
    test.forEach(item => _r(item));
} */

ReactDOM.render(<LocaleProvider locale={zh_CN}><RouterDom /></LocaleProvider>, document.getElementById('root'));

serviceWorker.unregister();
