import Vue from 'vue'

// import { Message } from 'element-ui';

import BaiduMap from 'vue-baidu-map' //百度地图
import {BmlMarkerClusterer} from 'vue-baidu-map'//百度地图三方组件
import App from './App'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
//ElementUI
import ElementUI from 'element-ui'
//axios
import axios from 'axios'
import 'font-awesome/css/font-awesome.min.css'
import store from './store/Store'
import Router from './router'





axios.defaults.headers.post["Content-Type"]="application/json"
axios.defaults.headers.common["Accept"]="application/json"
axios.defaults.headers.common["api-key"]="=KOsIOm9hXPXCf8gaf92oKUsJyU="


Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use('Message');

Vue.use(BaiduMap, {
    ak: 'j6QsjQGhY8j37Fn7V8rBGuDI1TtWbGn4'
  })
Vue.component('bml-marker-cluster', BmlMarkerClusterer)
Vue.prototype.$axios = axios



axios.interceptors.response.use(
    res => {
        if(res.data.code!=undefined&&(res.data.code==1001||res.data.code==10086)){
            Vue.prototype.$message({
                type:'error',
                message:res.data.msg
            });
            sessionStorage.clear();
            Router.push({path: '/login'})
            return Promise.reject(res.data.msg);

        }
        // else if(res.data.code!=undefined&&res.data.code==10086){
        //     Vue.prototype.$message({
        //         type:'error',
        //         message:res.data.msg
        //     });
        //     sessionStorage.clear();
        //     Router.push({path: '/login'})
        //     return Promise.reject(res.data.msg);
        // }
        else if(res.data.errno!=undefined&&res.data.errno!=0){
            Vue.prototype.$message({
                type:'error',
                message:res.data.error
            });
            return Promise.reject(res.data.error);    
        }
    return res
    },
    error=>{
        Vue.prototype.$message({
            type:'error',
            time:'5000',
            message:error
        });
        return Promise.reject(error);
    }
)

/* eslint-disable no-new */


Vue.directive('hasPermission', {
    bind: function(el, binding, vnode) {
        let permissions = JSON.parse(sessionStorage.getItem('permissionStr'))
        var noPermission = true
        if (binding.value == undefined || binding.value == '') {
            noPermission = false
        } else if (permissions && permissions.length) {
            var permission = binding.value.split('|')
            var p
            for (p in permission) {
                if (permissions.includes(permission[p])) {
                    noPermission = false
                    break
                }
            }
        }
        if (noPermission) {
            el.parentNode.removeChild(el)
        }
    }
})


new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {
        App
    }

})

