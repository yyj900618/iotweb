<template>
  <div>
    <h1>添加用户</h1>
    <div style="text-align: left;">

      <p>
        <span class="myusertitle">登录名</span>
        <el-input placeholder="请输入登录名" v-model="loginname" style="width:200px"></el-input>
        <span style="color:red;">*</span>
      </p>

      <p>
        <span class="myusertitle">密码</span>
        <el-input placeholder="请输入设备描述" v-model="password" style="width:200px"></el-input>
        <span style="color:red;">*</span>
      </p>

      <p>
        <span class="myusertitle">手机号码</span>
        <el-input placeholder="请输入手机号码" v-model="phonenum" style="width:200px"></el-input>
        <span style="color:red;">*</span>
      </p>
      <p>
        <span class="myusertitle">姓名</span>
        <el-input placeholder="请输入姓名" v-model="name" style="width:200px"></el-input>
        <span style="color:red;">*</span>
      </p>

      <!--穿梭框 <p>
                <el-transfer
                    filterable
                    filter-placeholder="请输入公司名字"
                    v-model="right"
                    :data="left"
                    style="margin-left:30px">
                </el-transfer>
            </p> -->

      <p>
        <span class="myusertitle">公司</span>
        <el-select v-model="companyid" filterable placeholder="请选择" style="width:200px">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <span style="color:red;">*</span>
      </p>

      <p>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="checkedRoles" @change="handleCheckedRolesChange">
          <el-checkbox v-for="role in roles" :label="role.id" :key="role.id">{{role.description}}</el-checkbox>
        </el-checkbox-group>
      </p>
      <p>
        <el-button type="primary" @click="submit()">提交</el-button>
      </p>

    </div>

  </div>
</template>
<script>
export default {
  data() {
    return {
      loginname: "",
      password: "",
      phonenum: "",
      name: "",
      // roleidstr:'',
      roletype: 2,
      companyid: "",

      options: [],
      // left: [],
      // right: [],

      checkAll: false,
      checkedRoles: [],
      roles: [],
      isIndeterminate: true
    };
  },
  methods: {
    handleCheckAllChange(val) {
      if (val) {
        let roleids = [];
        this.roles.forEach(elment => {
          roleids.push(elment.id);
        });
        this.checkedRoles = roleids;
      } else {
        this.checkedRoles = [];
      }
      this.isIndeterminate = false;
    },

    handleCheckedRolesChange(value) {
      let checkedCount = value.length;
      if (this.roles.length == checkedCount) this.checkAll = true;
      else this.checkAll = false;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.roles.length;
    },

    submit() {
      console.log("进入submit");
      var _this = this;
      var p = this.checkvalues();
      console.log(p);
      p.then(
        function(res) {
          console.log("resolve:" + res);
          _this.adduser();
        },
        function(res) {
          console.log(res);
        }
      ).catch(err => {
        console.log(err);
      });
    },

    adduser() {
      //获取公司ID,穿梭框
      // if(this.right.length>1){
      //     this.$message({
      //             type: 'error',
      //             message: "您只能从属于一个公司"
      //             });
      //     return false;
      // }

      let roleidstr = "";
      let params = new URLSearchParams();

      this.checkedRoles.forEach(element => {
        roleidstr += element + ",";
        if (element == 1) this.roletype = 1;
      });
      roleidstr = roleidstr.replace(/^,+/, "").replace(/,+$/, "");

      //获取角色ID，逗号拼接

      this.checkedRoles.forEach(element => {
        roleidstr +=  ","+element;
      });
      if (this.checkedRoles.indexOf(1) != -1) this.roletype = 1;
      else this.roletype = 2;

      roleidstr = roleidstr.replace(/^,+/, "").replace(/,+$/, "");

      params.append("loginname", this.loginname);
      params.append("password", this.password);
      params.append("phonenum", this.phonenum);
      params.append("name", this.name);
      params.append("companyid", this.companyid);
      params.append("roleids", roleidstr);
      params.append("roletype", this.roletype);
      this.$axios({
        method: "post",
        url: "/api/user/adduser",
        params: params
      })
        .then(data => {
          //   console.log(data);
          if (data.data.code == 0) {
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
        })
        .catch(err => {
          console.log(err);
          this.$message({
            type: "error",
            message: err
          });
        });
    },

    checkvalues() {
      console.log("companyid:" + this.companyid);
      if (this.companyid != 1) {
        for (let element in this.checkedRoles) {
          if (this.checkedRoles[element] == 1) {
            this.$message({
              type: "error",
              message: "超级管理员必须属于超管公司"
            });
            return Promise.reject(-1);
          }
        }
      }
      return Promise.resolve(1);
    }
  },

  created() {
    //获取公司列表
    let roletype = sessionStorage.getItem("roletype");
    let companyparams = new URLSearchParams();
    if (roletype != 1) {
      companyparams.append("companyid", sessionStorage.getItem("companyid"));
    }

    this.$axios.post("/api/company/getcompanylist", companyparams)
      .then(data => {
        let companylist = data.data.data;
        companylist.forEach(element => {
          if (element.isvalid == 1)
            //   this.left.push({label:element.companyname,key:element.id})
            this.options.push({
              label: element.companyname,
              key: element.id,
              value: element.id
            });
        });
      })
      .catch(err => {
        console.log(err);
        this.$message({
          type: "error",
          message: err
        });
      });
    //获取角色列表
    let params = new URLSearchParams();
    params.append("roletype", roletype);
    this.$axios({
      method: "post",
      url: "/api/role/rolelist",
      params: params
    })
      .then(data => {
        let rolelist = data.data.data;
        console.log(rolelist);
        this.roles = rolelist;
      })
      .catch(err => {
        console.log(err);
        this.$message({
          type: "error",
          message: err
        });
      });
  }
};
</script>
<style scoped>
.myusertitle {
  display: inline-block;
  width: 80px;
  text-align: right;
  color: #606266;
}

.usernotice {
  font-size: 5px;
  width: 100%;
  text-align: left;
  color: red;
  margin-left: 8px;
}
</style>