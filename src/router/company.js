
import Main from '@/components/Main'
import Companylist from '@/components/company/Companylist'
import AddCpmpany from '@/components/company/AddCompany'
import EditCompany from '@/components/company/EditCompany'


const CompanyRouter = [{
    path: '/company',
    name: '公司管理',
    component: Main,
    iconCls: 'fa fa-handshake-o',
    meta:{
        permission:'company:list|company:add|company:delete|company:update'
    },
    children: [{
        path: '/company/companylist',
        meta:{
            permission:'company:list|company:add|company:delete|company:update'
        },
        component: Companylist,
        name: '公司列表'
    },
    {
        path: '/company/companyadd',
        hidden:true,
        component: AddCpmpany,
        name: '公司添加'
    },
    {
        path: '/company/companyupdate',
        hidden:true,
        component: EditCompany,
        name: '公司更新'
    },
    ]

}]

export {
    CompanyRouter
}