import Main from '@/components/Main'
import Contract from '@/components/system/Contract'
import Role from '@/components/system/Role'
import ContractEdit from '@/components/system/ContractEdit'
import ContractAdd from '@/components/system/ContractAdd'
import RoleAdd from '@/components/system/RoleAdd'
import RoleEdit from '@/components/system/RoleEdit'



const SystemRouter = [{
    path: '/system',
    name: '系统中心',
    component: Main,
    iconCls: 'fa fa-address-card',
    meta:{
        permission:'system:user:view|system:user:delete|system:user:add|system:user:update|system:role:list|system:role:add|system:role:update|system:role:delete'
    },
    children: [{
        path: '/system/contract',
        component: Contract,
        meta:{
            permission:'system:user:view|system:user:delete|system:user:add|system:user:update'
        },
        name: '用户列表',
        
    },
    {
        path: '/system/ContractEdit',
        component: ContractEdit,
        name: '用户编辑',
        hidden:true
    },

    {
        path: '/system/ContractAdd',
        component: ContractAdd,
        name: '用户新增',
        hidden:true
    },

    {
        path: '/system/role',
        component: Role,
        meta:{
            permission:'system:role:list|system:role:add|system:role:update|system:role:delete'
        },
        name: '角色列表'
    },
    {
        path: '/system/RoleAdd',
        component: RoleAdd,
        name: '角色新增',
        hidden:true
    },
    {
        path: '/system/RoleEdit',
        component: RoleEdit,
        name: '角色编辑',
        hidden:true
    }
    ]
}]

export {
    SystemRouter
}

