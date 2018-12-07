import Main from '@/components/Main'
import Receiver from '@/components/receiver/Receiver'


const ReceiverRouter = [{
    path: '/receiver',
    name: '接收器管理',
    component: Main,
    iconCls: 'fa fa-microchip',
    leaf:false,
    meta:{
        permission:'receiver:view'
    },
    children: [{
        path: '/receiver/receiver',
        meta:{
            permission:'receiver:view'
        },
        component: Receiver,
        name: '接收器'
    }]
}]

export {
    ReceiverRouter
}