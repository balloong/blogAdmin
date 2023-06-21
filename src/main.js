import { createApp } from 'vue'
import './style.css'
import '@/assets/icon/iconfont.css'
import App from './App.vue'
import store from '@/store'
import router from './router'
//全局引入element-plus以及其样式
import ElementPlus from 'element-plus' 
import 'element-plus/dist/index.css'
// 公用的js函数
import Request from '@/utils/Request';
import Confirm from '@/utils/Confirm';
import Message from '@/utils/Message'
import Verify from '@/utils/Verify'
// 使用频率高的封装的组件
import Table from '@/components/Table.vue'
import Dialog from '@/components/Dialog.vue'
import Cover from '@/components/Cover.vue'
import CoverUpload from '@/components/CoverUpload.vue'
import Window from '@/components/Window.vue'
import EditorMarkdown from '@/components/EditorMarkdown.vue'
import EditorHtml from '@/components/EditorHtml.vue'

import VueCookies from 'vue-cookies'

const app = createApp(App);
app.use(ElementPlus)
app.use(router);
app.use(store);

app.config.globalProperties.Request = Request;
app.config.globalProperties.Confirm = Confirm;
app.config.globalProperties.Message = Message;
app.config.globalProperties.Verify = Verify;
app.config.globalProperties.globalInfo = {
    imageUrl: "/api/file/getImage/"
}
app.config.globalProperties.VueCookies = VueCookies;
// app.use(axios)
// 表格组件全局引用
app.component("Table",Table)
// 插入图片组件
app.component("Cover",Cover)
// 插入图片
app.component("CoverUpload",CoverUpload)
// 弹窗组件
app.component("Dialog",Dialog)
// 修改博客弹窗组件
app.component("Window", Window);
// md编辑器组件
app.component("EditorMarkdown", EditorMarkdown);
// 富文本编辑器
app.component("EditorHtml", EditorHtml);

app.mount('#app');
