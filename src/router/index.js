import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'

import Dashboard from '@/components/Dashboard'
import Main from '@/components/Main'
import Login from '@/components/Login'
import store from '../store/Store' 

// import ContractEdit from '@/components/system/ContractEdit'



Vue.use(Router)




let routes = [
    {
    path:'/main',
    component: Main,
    hidden: true,
    redirect:'/dashboard',
    name:"主页面",
    children: [{
        path: '/dashboard',
        component:Dashboard,
        name:'首页'
    }]
}
]



routes.push({
    path:'/',
    name:'跳转页',
    redirect:'/login',
    hidden: true
    }
)

routes.push({
    path:'/login',
    name:'登录',
    component:Login,
    hidden: true
    }
)


import {
    SystemRouter
} from './system'

import {
    DeviceRouter
} from './device'

import {
    ReceiverRouter
} from './receiver'

import {
    CompanyRouter
} from './company'


for (let i in SystemRouter){
    routes.push(SystemRouter[i])
}

for (let i in CompanyRouter){
    routes.push(CompanyRouter[i])
} 


for (let i in DeviceRouter){
    routes.push(DeviceRouter[i])
}

for (let i in ReceiverRouter){
    routes.push(ReceiverRouter[i])
}




const router = new Router({

    // base: '/iot/',
    scrollBehavior: () => ({ y: 0 }),
    routes: routes,
    // mode:"history"
})



router.beforeEach(function (to, from, next){
    //检查session是否已过期
    debugger
    if(to.path!='/login'&&to.path!='/'){
        axios.post("/api/islogin")
    }else if(to.path=='/login'&&from.path!='/login'&&from.path!='/'){
        sessionStorage.clear();
        axios.post('/api/logout')
    }else{
        sessionStorage.clear(); 
    }
    next();    

     

    // let userid=sessionStorage.getItem("userid_login")//登录成功之后设置进去的
    // const auth = store.getters.getisloginById(userid);//登录成功之后设置进去的
    // if(auth==null||!auth.islogin||auth==undefined||auth.islogin==undefined||auth.id==undefined){
    //     if(to.path=='/login'){
    //         next();
    //     }else{
    //         next('/login');
    //     }

    // }else{
    //     if(to.path=='/login'||to.path=='/'){
    //         alert("您已经登录，不能跳转至登录页，若需重新登录请关闭浏览器或注销用户")    
    //         next('/main');
    //     }else{
    //         next();
    //     }
    // }
})


export default router;

