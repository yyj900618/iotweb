<template>
  <div>
    <div id="search">
      登录名: <el-input
        placeholder="请输入登录名"
        v-model="loginname"
        clearable
        style="width:200px"
      ></el-input>
      姓名: <el-input
        placeholder="请输入用户姓名"
        v-model="name"
        clearable
        style="width:200px"
      ></el-input>
      电话: <el-input
        placeholder="请输入联系电话"
        v-model="phonenum"
        clearable
        style="width:200px"
      ></el-input>
      状态: <el-select
        v-model="isvalid"
        clearable
        placeholder="请选择状态"
        style="width:150px"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="handleSearch()"
        style=" margin-left: 20px;"
      >搜索</el-button>

      <p style="text-align: left;">
        <el-button
          type="primary"
          icon="el-icon-circle-plus"
          @click="addUser()"
          v-hasPermission="'system:user:add'"
        >新增</el-button>
      </p>
    </div>

    <el-table
      :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      :header-cell-style="getRowClass"
      :row-style="tableRowStyle"
    >

      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form
            label-position="left"
            inline
            class="demo-table-expand"
          >
            <el-form-item label="姓名">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="用户ID">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="登录名">
              <span>{{ props.row.loginname }}</span>
            </el-form-item>
            <el-form-item label="联系电话">
              <span>{{ props.row.phonenum }}</span>
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
            <el-form-item label="角色类型">
              <span v-if="props.row.roletype==1">超级管理员</span>
              <span v-if="props.row.roletype!=1">普通人员</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column
        label="用户ID"
        prop="id"
      >
      </el-table-column>
      <el-table-column
        label="姓名"
        prop="name"
      >
      </el-table-column>
      <el-table-column
        label="联系电话"
        prop="phonenum"
      >
      </el-table-column>

      <el-table-column align="right">
        <template
          slot="header"
          slot-scope="slot"
        >
          <el-input
            v-model="search"
            size="mini"
            placeholder="姓名过滤"
            v-hasPermission="'system:user:view'"
          />
        </template>

        <template slot-scope="scope">

          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            circle
            title="编辑"
            @click="handleEdit(scope.$index, scope.row)"
            v-hasPermission="'system:user:update'"
          ></el-button>

          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            circle
            title="删除"
            @click="handleDelete(scope.$index, scope.row)"
            v-hasPermission="'system:user:delete'"
          ></el-button>

          <el-button
            v-show="scope.row.isvalid==0"
            size="mini"
            type="warning"
            icon="fa fa-unlock"
            circle
            title="解锁"
            @click="handleUnlockOrLock(scope.$index, scope.row,1)"
            v-hasPermission="'system:user:update'"
          ></el-button>

          <el-button
            v-show="scope.row.isvalid==1"
            size="mini"
            type="warning"
            icon="fa fa-lock"
            circle
            title="锁定"
            @click="handleUnlockOrLock(scope.$index, scope.row,0)"
            v-hasPermission="'system:user:update'"
          ></el-button>

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
      search: "",
      loginname: "",
      name: "",
      phonenum: "",

      options: [
        {
          value: "1",
          label: "有效"
        },
        {
          value: "0",
          label: "禁用"
        }
      ],
      isvalid: ""
    };
  },
  methods: {
    handleUnlockOrLock(index, row, isvalid) {
      console.log("锁定/解锁按钮");
      let params = new URLSearchParams();
      params.append("userid", row.id);
      params.append("isvalid", isvalid);
      this.$axios.post("/api/user/lockuserbyid", params).then(data => {
        if (data.data.code == 0) {
          this.tableData[index].isvalid = isvalid;
          this.$message({
            type: "success",
            message: "操作成功"
          });
        } else {
          this.$message({
            type: "error",
            message: "操作失败"
          });
        }
      });
    },

    handleEdit(index, row) {
      console.log("点击了编辑用户按钮");
      this.$router.push({
        path: "/system/ContractEdit",
        query: { index: index, row: row }
      });
    },

    addUser(index, row) {
      console.log("点击了新增用户按钮");
      this.$router.push({
        path: "/system/ContractAdd",
        query: { index: index, row: row }
      });
    },

    handleDelete(index, row) {
      //需要加入询问和meg显示
      this.$confirm("是否确认删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = new URLSearchParams();
          if (row.id != "" && row.id != null) params.append("userid", row.id);
          this.$axios.post("/api/user/removeuserbyid", params).then(data => {
            if (data.data.data == 1) {
              this.tableData.splice(index, 1);
              this.$message({
                type: "success",
                message: data.data.msg
              });
            } else {
              this.$message({
                type: "error",
                message: data.data.msg
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消"
          });
        });
    },
    handleSearch() {
      let params = new URLSearchParams();
      if (this.loginname != "" && this.loginname != null)
        params.append("loginname", this.loginname);
      if (this.name != "" && this.name != null)
        params.append("name", this.name);
      if (this.phonenum != "" && this.phonenum != null)
        params.append("phonenum", this.phonenum);
      if (this.isvalid != "" && this.isvalid != null)
        params.append("isvalid", this.isvalid);
      this.$axios.post("/api/user/getuserlist", params).then(data => {
        console.log(data.data.data);
        this.tableData = data.data.data;
      });
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
    let companyparams = new URLSearchParams();
    if (roletype != 1) {
      companyparams.append("companyid", sessionStorage.getItem("companyid"));
    }
    this.$axios.post("/api/user/getuserlist", companyparams).then(data => {
      this.tableData = data.data.data;
    });
  }
};
</script>
<style scope="scoped">
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

/* #el-input{
    width: 200px;
    margin-right: 20px;
  }
   */

#search {
  color: #606266;
  font-size: 16px;
  text-align: left;
  margin-top: 20px;
  margin-right: auto;
  margin-bottom: 20px;
  margin-left: auto;
}
</style>