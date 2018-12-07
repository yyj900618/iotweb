<template>
    <div>
        <p style="text-align: right;">
            <el-button type="primary" icon="el-icon-circle-plus" @click="addrole()" v-hasPermission="'system:role:add'">新增</el-button>
        </p>
        <el-table :data="tableData.filter(data => !search || data.rolename.toLowerCase().includes(search.toLowerCase()))" :header-cell-style="getRowClass" :row-style="tableRowStyle">

            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="ID">
                            <span>{{ props.row.id }}</span>
                        </el-form-item>
                        <el-form-item label="角色名">
                            <span>{{ props.row.rolename }}</span>
                        </el-form-item>
                        <el-form-item label="描述">
                            <span>{{ props.row.description }}</span>
                        </el-form-item>
                        <el-form-item label="角色类型">
                            <span v-if="props.row.roletype==1">管理员</span>
                            <span v-if="props.row.roletype!=1">普通</span>
                        </el-form-item>
                        <el-form-item label="创建时间">
                            <span>{{ props.row.createtime }}</span>
                        </el-form-item>
                        <el-form-item label="更新时间">
                            <span>{{ props.row.updatetime }}</span>
                        </el-form-item>
                        <el-form-item label="是否有效">
                            <span v-if="props.row.isvalid==1">有效</span>
                            <span v-if="props.row.isvalid!=1">无效</span>
                        </el-form-item>
                        <el-form-item label="当前权限列表">
                            <span v-for="item in props.row.authList">{{item}}<br></span>
                        </el-form-item>

                    </el-form>
                </template>
            </el-table-column>

            <el-table-column label="角色ID" prop="id"></el-table-column>
            <el-table-column label="描述" prop="description"></el-table-column>
            <el-table-column label="角色类型" prop="roletype"></el-table-column>
            <el-table-column label="角色名" prop="rolename"></el-table-column>

            <el-table-column align="right">
                <template slot="header" slot-scope="slot">
                    <el-input v-model="search" size="mini" placeholder="姓名过滤" v-hasPermission="'system:user:view'" />
                    
                </template>

                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" v-hasPermission="'system:role:update'">编辑</el-button>

                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" v-hasPermission="'system:role:delete'">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

    </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      search: ""
    };
  },
  methods: {



    handleEdit(index,row){
      console.log("点击了编辑角色按钮")
      this.$router.push({path: '/system/RoleEdit', query: {index:index,row:row}})
    },


    handleDelete(index, row) {
      this.$confirm(
        "是否确认删除该角色，删除角色后将导致属于该角色的人员权限不可用，请慎重操作",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        let params = new URLSearchParams();
        if (row.id != "" && row.id != null) params.append("roleid", row.id);
        this.$axios.post("/api/role/removerolebyid", params).then(data => {
          if (data.data.data == 1) {
            this.tableData.splice(index, 1);
            console.log("删除成功");
          } else {
            console.log("删除失败");
          }
        });
      }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },


    addrole(){
        console.log("点击了新增角色按钮")
        this.$router.push({path: '/system/RoleAdd'})
    },

    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background-color: #F7F6Fd;color: #606266;font-weight: 500;";
      }
    },

    tableRowStyle({ row, rowIndex }) {
      return "background-color: #F7F6Fd";
    }
  },
  created() {
    let roletype = sessionStorage.getItem("roletype");
    let roleparams = new URLSearchParams();
    roleparams.append("roletype", roletype);
    this.$axios({
      method: "post",
      url: "/api/role/rolelist",
      params: roleparams
    }).then(data => {
      this.tableData = data.data.data;
      console.log(this.tableData);
    });
  }
};
</script>
<style scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.roletitle {
  display: inline-block;
  width: 80px;
  text-align: right;
  color: #606266;
}
</style>