import Main from '@/components/Main'
import DeviceList from '@/components/device/DeviceList'
import SendCmd from '@/components/device/SendCmd'
import AddDevice from '@/components/device/AddDevice'
import DeviceDTO from '@/components/device/DeviceDTO'
import EditDevice from '@/components/device/EditDevice'
import DeviceMap from '@/components/device/DeviceMap'
import DataPoint from '@/components/device/DataPoint'

const DeviceRouter = [{
    path: '/device',
    name: '设备管理',
    component: Main,
    iconCls: 'fa fa-server',
    meta:{
        permission:'device:add|device:delete|device:update|device:view|device:cmd'
    },
    leaf:false,
    children: [{
        path: '/device/devicelist',
        component: DeviceList,
        meta:{
            permission:'device:add|device:delete|device:update|device:view|device:cmd'
        },
        name: '设备列表'
    },
    
    {
        path: '/device/devicemap',
        component: DeviceMap,
        meta:{
            permission:'device:map'
        },
        name: '设备地图'
    },



    {
        path: '/device/sendcmd',
        component: SendCmd,
        name: '发送命令',
        hidden:true
    },
    {
        path: '/device/adddevice',
        component: AddDevice,
        name: '添加设备',
        hidden:true
    },
    {
        path: '/device/dto',
        component: DeviceDTO,
        name: '设备详情',
        hidden:true
    },
    {
        path: '/device/edit',
        component: EditDevice,
        name: '编辑设备',
        hidden:true
    },

    {
        path: '/device/datapoint',
        component: DataPoint,
        name: '设备数据点',
        hidden:true
    }

    ]
}]

export {
    DeviceRouter
}
