<template>
  <div>
    <h1 style="text-align: center;">角色修改页面</h1>
    <div style="text-align: left;">
      <p>
        <span class="title">登录名：</span>
        <el-input v-model="user.loginname" :disabled="true" style="width:200px"></el-input>
      </p>
      <p>
        <span class="title"> 姓名：</span>
        <el-input v-model="user.name" placeholder="请输入用户姓名" style="width:200px"></el-input>
      </p>
      </p>
      <span class="title"> 联系电话：</span>
      <el-input v-model="user.phonenum" placeholder="请输入联系电话" style="width:200px"></el-input>
      </p>
      <p>
        <span class="title"> 密码：</span>
        <el-input v-model="user.password" placeholder="请输入密码：" style="width:200px"></el-input><br>
      </p>

      <p>
        <span class="title">公司</span>
        <el-select v-model="user.companyid" filterable placeholder="请选择" style="width:200px">
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

      <el-button type="primary" @click="submit()">提交</el-button>
      <el-button type="success" @click="back()">返回</el-button>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      row: {},
      user: {},
      options: [],
      // companyid:'',
      checkAll: false,
      checkedRoles: [],
      roles: [],
      isIndeterminate: true
    };
  },
  methods: {
    submit() {
      var _this = this;
      var p = this.checkvalues();
      console.log(p);
      p.then(
        function(res) {
          console.log("resolve:" + res);
          _this.updateuser();
        },
        function(res) {
          console.log(res);
        }
      ).catch(err => {
        console.log(err);
      });
    },

    updateuser() {
      console.log("进入submit1");
      this.$confirm("是否确认提交", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //获取角色ID，逗号拼接,若选择的角色含有超级管理员则将roletype设置为1
          let roleidstr = "";
          this.checkedRoles.forEach(element => {
            // console.log(element)
            roleidstr += "," + element;
          });
          if (this.checkedRoles.indexOf(1) != -1) this.user.roletype = 1;
          else this.user.roletype = 2;

          roleidstr = roleidstr.replace(/^,+/, "").replace(/,+$/, "");

          let params = new URLSearchParams();
          params.append("userid", this.user.id);
          params.append("name", this.user.name);
          params.append("password", this.user.password);
          params.append("phonenum", this.user.phonenum);
          params.append("companyid", this.user.companyid);
          params.append("roleids", roleidstr);
          params.append("roletype", this.user.roletype);
          this.$axios.post("/api/user/updateuserbyid", params).then(data => {
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
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消修改"
          });
        });
    },

    back() {
      this.$router.go(-1);
    },

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
      console.log(value);
      let checkedCount = value.length;
      if (this.roles.length == checkedCount) this.checkAll = true;
      else this.checkAll = false;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.roles.length;
    },

    checkvalues() {
      console.log("companyid:" + this.user.companyid);
      if (this.user.companyid != 1) {
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
    },

    initcompany() {
      let roletype = sessionStorage.getItem("roletype");
      let companyparams = new URLSearchParams();
      if (roletype != 1) {
        companyparams.append("companyid", sessionStorage.getItem("companyid"));
      }

      this.$axios
        .post("/api/company/getcompanylist", companyparams)
        .then(data => {
          let companylist = data.data.data;
          companylist.forEach(element => {
            if (element.isvalid == 1)
              this.options.push({
                label: element.companyname,
                key: element.id,
                value: element.id
              });
          });
          this.initrolelist();
        });
    },

    initrolelist() {
      let roletype = sessionStorage.getItem("roletype");
      let roleparams = new URLSearchParams();
      roleparams.append("roletype", roletype);
      this.$axios({
        method: "post",
        url: "/api/role/rolelist",
        params: roleparams
      })
        .then(data => {
          let rolelist = data.data.data;
          this.roles = rolelist;
          this.inituser();
        })
        .catch(err => {
          console.log(err);
          this.$message({
            type: "error",
            message: err
          });
        });
    },

    inituser() {
      this.row = this.$route.query.row;
      let params = new URLSearchParams();
      if (
        this.row.id != "" &&
        this.row.id != null &&
        this.row.id != undefined
      ) {
        sessionStorage.setItem("userid", this.row.id);
        params.append("userid", this.row.id);
      } else params.append("userid", sessionStorage.getItem("userid"));
      this.$axios.post("/api/user/getuserbyid", params).then(data => {
        this.user = data.data.data;
        this.user.password = "";
        // this.companyid=data.data.data.companyid
        let roleids_str = data.data.data.roleids;
        let checkedRolesStr = roleids_str.split(",");
        checkedRolesStr.forEach(item => {
          this.checkedRoles.push(Number(item));
        });
      });
    }
  },

  created() {
    this.initcompany();

    //初始化公司菜单
    // let roletype = sessionStorage.getItem("roletype");
    // let companyparams = new URLSearchParams();
    // if (roletype != 1) {
    //   companyparams.append("companyid", sessionStorage.getItem("companyid"));
    // }

    // this.$axios
    //   .post("/api/company/getcompanylist", companyparams)
    //   .then(data => {
    //     let companylist = data.data.data;
    //     companylist.forEach(element => {
    //       if (element.isvalid == 1)
    //         this.options.push({
    //           label: element.companyname,
    //           key: element.id,
    //           value: element.id
    //         });
    //     });
    //   });
    //初始化user信息
    // this.row = this.$route.query.row;
    // let params = new URLSearchParams();
    // if (this.row.id != "" && this.row.id != null && this.row.id != undefined) {
    //   sessionStorage.setItem("userid", this.row.id);
    //   params.append("userid", this.row.id);
    // } else params.append("userid", sessionStorage.getItem("userid"));
    // this.$axios.post("/api/user/getuserbyid", params).then(data => {
    //   this.user = data.data.data;
    //   this.user.password = "";
    //   // this.companyid=data.data.data.companyid
    //   let roleids_str = data.data.data.roleids;
    //   let checkedRolesStr = roleids_str.split(",");

    //   checkedRolesStr.forEach(item => {
    //     this.checkedRoles.push(Number(item));
    //   });
    // });
    //初始化角色列表
    // let roleparams = new URLSearchParams();
    // roleparams.append("roletype", roletype);
    // this.$axios({
    //   method: "post",
    //   url: "/api/role/rolelist",
    //   params: roleparams
    // })
    //   .then(data => {
    //     let rolelist = data.data.data;
    //     this.roles = rolelist;
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     this.$message({
    //       type: "error",
    //       message: err
    //     });
    //   });
  }
};
</script>
<style scope="scoped">
/* #el-input1{
    text-align: center;
    margin-right: 200px;
    margin-top: 20px;
    margin-bottom: 20px;
    width: 200px;
} */
.title {
  display: inline-block;
  width: 80px;
  text-align: right;
  color: #606266;
}
</style>