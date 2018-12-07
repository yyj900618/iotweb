<template>

  <div>
    <h1>添加角色</h1>
    <p>
      <span class="myroleedittitle">角色名</span>
      <el-input
        placeholder="请输入角色名"
        v-model="rolename"
        style="width:200px"
      ></el-input>
      <span style="color:red;">*</span>
    </p>

    <p>
      <span class="myroleedittitle">描述</span>
      <el-input
        placeholder="请输描述"
        v-model="description"
        style="width:200px"
      ></el-input>
      <span style="color:red;">*</span>
    </p>

    <p>
      <span class="myroleedittitle">角色类型</span>
      <el-select
        v-model="roletype"
        placeholder="请选择"
        style="width: 200px"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <span style="color:red;">*</span>
    </p>

    <p>
      <span class="myroleedittitle">权限</span>
      <el-tree
        :data="authtree"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps"
        style="background-color: #d3d7d4;width: 200px; margin-left: 70px;"
      >
      </el-tree>
    </p>
    <p>
      <el-button
        type="primary"
        @click="submit()"
        style="margin-left: 70px;"
      >提交</el-button>
      <el-button
        type="success"
        @click="back()"
      >返回</el-button>
    </p>

  </div>
</template>
<script>
export default {
  data() {
    return {
      roleid: "",
      rolename: "",
      description: "",
      options: [
        {
          value: 1,
          label: "管理员"
        },
        {
          value: 2,
          label: "普通"
        }
      ],
      roletype: "",
      authtree: [],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },

  methods: {
    getCheckedKeys() {
      console.log(this.$refs.tree.getCheckedKeys());
    },

    setCheckedKeys(value) {
      console.log("进入设置权限");
      this.$refs.tree.setCheckedKeys(value);
    },

    submit() {
      this.$confirm("是否确认提交？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var _this = this;
          var p = this.checkvalues();
          console.log(p);
          p.then(
            function(res) {
              console.log("resolve:" + res);
              _this.updaterole();
            },
            function(res) {
              console.log(res);
            }
          ).catch(err => {
            console.log(err);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消"
          });
        });
    },

    updaterole() {
      let auth = "";
      let authArrary = this.$refs.tree.getCheckedKeys();
      console.log("addrole");
      console.log(authArrary);
      authArrary.forEach(element => {
        auth += "," + element;
      });
      auth = auth.replace(/^,+/, "").replace(/,+$/, "");
      let params = new URLSearchParams();
      params.append("roleid", this.roleid);
      params.append("roletype", this.roletype);
      params.append("rolename", this.rolename);
      params.append("description", this.description);
      params.append("auth", auth);

      this.$axios.post("/api/role/updaterole", params).then(data => {
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
    },

    checkvalues() {
      let authArrary = this.$refs.tree.getCheckedKeys();
      console.log("checekvalues");
      console.log(authArrary);
      if (
        authArrary.length == 0 ||
        this.rolename == "" ||
        this.description == "" ||
        this.roletype == ""
      ) {
        this.$message({
          type: "error",
          message: "必填项不能为空"
        });
        return Promise.reject(-1);
      } else return Promise.resolve(1);
    },

    back() {
      this.$router.go(-1);
    },

    initauthlist() {
      this.$axios({
        method: "post",
        url: "/api/role/getallauth"
      }).then(data => {
        let authlist = data.data.data;
        console.log(authlist);
        authlist.forEach(element => {
          this.authtree.push({
            id: element.id,
            label: element.description,
            children: []
          });
        });
        this.initcheckedauth();
      });
    },

    initcheckedauth() {
      //初始化角色信息
      let row = this.$route.query.row;
      let authlist = [];
      let params = new URLSearchParams();
      if (row.id != "" && row.id != undefined && row.id != null) {
        sessionStorage.setItem("roleid", row.id);
        params.append("roleid", row.id);
      } else params.append("roleid", sessionStorage.getItem("roleid"));

      this.$axios.post("/api/role/getrolebyid", params).then(data => {
        this.roleid = data.data.data.id;
        this.rolename = data.data.data.rolename;
        this.description = data.data.data.description;
        this.roletype = data.data.data.roletype;
        authlist = data.data.data.auth.split(",");
        //初始化已选中的权限
        console.log(authlist);
        this.setCheckedKeys(authlist);
      });
    }
  },

  created() {
    this.initauthlist();
  }
};
</script>
<style scoped>
.myroleedittitle {
  display: inline-block;

  width: 80px;
  text-align: right;
  color: #606266;
}
</style>