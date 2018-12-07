<template>
  <div>

    <div id="search">
      设备ID: <el-input
        placeholder="请输入设备ID"
        v-model="deviceID"
        clearable
        style="width:200px;margin-right:20px;"
      ></el-input>
      设备名：<el-input
        placeholder="请输入设备名"
        v-model="title"
        clearable
        style="width:200px;margin-right:20px;"
      ></el-input>
      状态:
      <el-select
        v-model="online"
        clearable
        placeholder="请选择状态"
        style="width:150px;margin-right:20px;"
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
      >搜索</el-button>
      <el-button
        type="primary"
        icon="el-icon-circle-plus"
        @click="addDevice()"
        v-hasPermission="'device:add'"
      >新增</el-button>

      <p v-show="roletype=='1'">
        <span>所属公司：</span>
        <el-select
          v-model="companyid"
          clearable
          placeholder="请选择所属公司"
          style="width:150px;margin-right:20px;"
        >
          <el-option
            v-for="item in companylist"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </p>
    </div>

    <el-table
      :data="tableData.filter(data => !search || data.id.toLowerCase().includes(search.toLowerCase()))"
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
            <el-form-item label="设备名">
              <span>{{ props.row.title }}</span>
            </el-form-item>
            <el-form-item label="设备ID">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="协议">
              <span>{{ props.row.protocol }}</span>
            </el-form-item>
            <el-form-item label="是否在线">
              <span v-if="props.row.online">在线</span>
              <span v-if="!props.row.online">离线</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ props.row.create_time }}</span>
            </el-form-item>
            <el-form-item label="认证信息">
              <span>{{ props.row.auth_info }}</span>
            </el-form-item>

            <el-form-item label="设备描述">
              <span>{{ props.row.desc }}</span>
            </el-form-item>

            <el-form-item label="设备位置">
              经度：<span v-if="props.row.location!=undefined">{{ props.row.location.lat }}</span>
              纬度：<span v-if="props.row.location!=undefined">{{ props.row.location.lon }}</span>
            </el-form-item>
            <el-form-item label="是否私有">
              <span v-if="props.row.private">私有</span>
              <span v-if="!props.row.private">公有</span>
            </el-form-item>

            <el-form-item label="标签">
              <span v-for="item in props.row.tags">{{ item }}</span>
            </el-form-item>

          </el-form>
        </template>
      </el-table-column>

      <el-table-column
        label="设备ID"
        prop="id"
      >
      </el-table-column>
      <el-table-column
        label="设备名"
        prop="title"
      >
      </el-table-column>
      <el-table-column
        label="是否在线"
        prop="online"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.online">在线</span>
          <span v-else-if="!scope.row.online">离线</span>
        </template>
      </el-table-column>

      <el-table-column
        label="是否私有"
        prop="private"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.private">私有</span>
          <span v-else-if="!scope.row.private">公有</span>
        </template>
      </el-table-column>

      <el-table-column align="right">
        <template
          slot="header"
          slot-scope="slot"
        >
          <el-input
            v-model="search"
            size="mini"
            placeholder="设备ID过滤"
          /><br>
        </template>

        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-document"
            circle
            title="详情"
            @click="handleView(scope.$index, scope.row)"
            v-hasPermission="'device:view'"
          ></el-button>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            circle
            title="编辑"
            @click="handleEdit(scope.$index, scope.row)"
            v-hasPermission="'device:update'"
          ></el-button>
          <el-button
            size="mini"
            type="success"
            icon="el-icon-sort"
            circle
            title="下发命令"
            @click="handleSendcmd(scope.$index, scope.row)"
            v-hasPermission="'device:cmd'"
          ></el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            circle
            title="删除"
            @click="handleDelete(scope.$index, scope.row)"
            v-hasPermission="'device:delete'"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align:center;margin-top:20px"
      background
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
      @prev-click="handlePrePage"
      @next-click="handleNextPage"
      :current-page="this.page"
      :page-size="this.per_page"
      :pager-count="11"
      :total="this.total_count"
    >
    </el-pagination>
  </div>
</template>


<script>
export default {
  data() {
    return {
      roletype: "",
      tableData: [],
      search: "",
      deviceID: "",
      title: "",
      online: "",
      total_count: 0,
      page: 1,
      per_page: 8,
      companylist: [],
      companyid: "",
      options: [
        {
          value: "1",
          label: "在线"
        },
        {
          value: "0",
          label: "离线"
        }
      ]
      // isvalid: ''
    };
  },
  methods: {
    handleCurrentChange(val) {
      console.log("当前页:" + val);
      this.page = val;
      this.refesh();
    },

    handlePrePage() {
      console.log("点击上一页");
      this.page = this.page - 1;
    },

    handleNextPage() {
      console.log("点击下一页");
      this.page = this.page + 1;
    },

    handleSearch() {
      this.page = 1;
      this.refesh();
    },

    handleEdit(index, row) {
      console.log("点击了编辑按钮");
      this.$router.push({
        path: "/device/edit",
        query: { index: index, row: row }
      });
    },

    handleSendcmd(index, row) {
      console.log("点击了下发命令按钮");
      this.$router.push({
        path: "/device/sendcmd",
        query: { index: index, row: row }
      });
    },

    handleView(index, row) {
      this.$router.push({
        path: "/device/dto",
        query: { index: index, row: row }
      });
      console.log("点击了详情按钮");
    },

    addDevice() {
      console.log("点击了添加设备按钮");
      this.$router.push({ path: "/device/adddevice" });
    },

    handleDelete(index, row) {
      console.log("点击了删除按钮");

      let deviceID = row.id;
      let url = "/iot/devices/" + deviceID;
      this.$confirm("是否确认删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = new URLSearchParams();
          params.append("deviceid", deviceID);
          this.$axios({
            method: "post",
            url: "/api/device/deletedevice",
            params: params
          }).then(data => {
            if (data.data.code == 0) {
              this.$axios.delete(url).then(data => {
                if (data.data.error == "succ") {
                  this.$message({
                    type: "success",
                    message: "删除成功"
                  });
                  this.refesh();
                } else {
                  this.$message({
                    type: "error",
                    message: "删除失败"
                  });
                }
              });
            } else {
              this.$message({
                type: "error",
                message: "删除失败"
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

    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background-color: #F7F6Fd;color: #606266;font-weight: 500;";
      }
    },

    tableRowStyle({ row, rowIndex }) {
      return "background-color: #F7F6Fd";
    },

    refesh() {
      console.log("应用当前参数刷新页面");
      let params = new URLSearchParams();
      params.append("pagesize", this.per_page);
      params.append("pagenum", this.page);
      if (this.title != "" && this.title != null && this.title != undefined)
        params.append("title", this.title);
      if (
        this.deviceID != "" &&
        this.deviceID != null &&
        this.deviceID != undefined
      )
        params.append("device_id", this.deviceID);
      if (
        this.companyid != "" &&
        this.companyid != null &&
        this.companyid != undefined
      )
        params.append("companyid", this.companyid);
      this.$axios({
        method: "post",
        url: "/api/device/getdevieidlist",
        params: params
      }).then(data => {
        this.total_count = data.data.data.total;
        let deviceListStr = "";

        if (data.data.data.list.length != 0) {
          data.data.data.list.forEach(element => {
            deviceListStr += element + ",";
          });
          deviceListStr = deviceListStr.replace(/^,+/, "").replace(/,+$/, "");
          let paramsl = {};
          paramsl.device_id = deviceListStr;
          if (this.online != "" && this.online == "1") paramsl.online = true;
          if (this.online != "" && this.online == "0") paramsl.online = false;
          this.$axios.get("/iot/devices", { params: paramsl }).then(data => {
            console.log(data);
            this.tableData = data.data.data.devices;
          });
        } else {
          this.tableData = [];
        }
      });
    }
  },

  created() {
    let params = new URLSearchParams();
    params.append("pagesize", this.per_page);
    params.append("pagenum", this.page);

    this.$axios({
      method: "post",
      url: "/api/device/getdevieidlist",
      params: params
    }).then(data => {
      this.total_count = data.data.data.total; //总数，给翻页参数
      let deviceListStr = "";
      data.data.data.list.forEach(element => {
        deviceListStr += element + ",";
      });
      deviceListStr = deviceListStr.replace(/^,+/, "").replace(/,+$/, "");
      let paramsl = {};
      paramsl.device_id = deviceListStr;
      this.$axios.get("/iot/devices", { params: paramsl }).then(data => {
        this.tableData = data.data.data.devices;
      });
    });

    let roletype = sessionStorage.getItem("roletype");
    let companyparams = new URLSearchParams();
    if (roletype != 1) {
      companyparams.append("companyid", sessionStorage.getItem("companyid"));
    }
    this.$axios
      .post("/api/company/getcompanylist", companyparams)
      .then(data => {
        let companyList = data.data.data;
        companyList.forEach(element => {
          if (element.isvalid == 1)
            this.companylist.push({
              label: element.companyname,
              key: element.id,
              value: element.id
            });
        });
      });
    this.roletype = sessionStorage.getItem("roletype");
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