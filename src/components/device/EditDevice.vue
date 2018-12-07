<template>

  <div>

    <baidu-map
      class="editdevicemap"
      :center="centerposition"
      :zoom="15"
      :scroll-wheel-zoom="true"
      :inertial-dragging="true"
    >
      <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"></bm-city-list>
      <bm-marker
        :position="{lng:lon,lat:lat}"
        :dragging="true"
        :raiseOnDrag="true"
        @dragging="dragging"
        @dragend="dragend"
      ></bm-marker>
    </baidu-map>

    <div style="text-align: left;">
      <p>
        <span class="mytitle2">设备ID</span>
        <el-input
          placeholder="请输入设备ID"
          v-model="device_id"
          :disabled="true"
          style="width:200px"
        ></el-input>
      </p>
      <p>
        <span class="mytitle2">设备名</span>
        <el-input
          placeholder="请输入设备名"
          v-model="title"
          style="width:200px"
        ></el-input>
        <span style="color:red;">*</span>
      </p>
      <p>
        <span class="mytitle2">设备描述</span>
        <el-input
          placeholder="请输入设备描述"
          v-model="desc"
          style="width:200px"
        ></el-input>
      </p>

      <p>
        <span class="mytitle2">所属公司</span>
        <el-select
          v-model="companyid"
          clearable
          placeholder="请选择所属公司"
          style="width:200px;margin-right:20px;"
        >
          <el-option
            v-for="item in companylist"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <span style="color:red;">*</span>
      </p>

      <p>
        <span class="mytitle2">标签</span>
        <el-input
          placeholder="请输入设备标签"
          v-model="tags"
          style="width:200px"
        ></el-input>
        <span class="notice2">不同标签请用逗号隔开</span>
      </p>
      <p>
        <span class="mytitle2">经度</span>
        <el-input
          placeholder="请输入设备经度"
          v-model="lon"
          style="width:200px"
        ></el-input>
      </p>

      <p>
        <span class="mytitle2">纬度</span>
        <el-input
          placeholder="请输入设备纬度"
          v-model="lat"
          style="width:200px"
        ></el-input>
      </p>

      <p>
        <span class="mytitle2">是否私有</span>
        <el-select
          v-model="private_str"
          clearable
          placeholder="请选择状态"
          style="width:200px"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </p>
      <p>
        <span class="mytitle2">鉴权字符串</span>
        <el-input
          placeholder="请输入鉴权字符串"
          v-model="auth_info"
          style="width:200px"
        ></el-input>
        <span class="notice2">设备间不能设置相同的字符串，最多512个字母、数字或字母与数字组合的字符串。</span>
      </p>

      <p>
        <span class="mytitle2">其他</span>
        <el-input
          placeholder="请输入设备其他信息"
          v-model="other_str"
          style="width:200px"
        ></el-input>
        <span class="notice2">请输入json格式的字符串</span>
      </p>

    </div>
    <div style="text-align: center;">
      <el-button
        type="primary"
        icon="el-icon-check"
        @click="handleSummit()"
      >提交</el-button>
      <el-button
        type="success"
        icon="el-icon-caret-left"
        @click="handleback()"
      >返回</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      centerposition: {},
      companylist: [],
      companyid: "",

      device_id: "",
      title: "",
      desc: "",
      tags: "",
      lon: "",
      lat: "",
      private_str: "",
      options: [
        {
          value: "1",
          label: "私有"
        },
        {
          value: "0",
          label: "公有"
        }
      ],
      auth_info: "",
      auth_info_old: "",
      other_str: ""
    };
  },
  methods: {
    dragging(e) {
      // console.log(e);
      this.lon = e.point.lng;
      this.lat = e.point.lat;
    },

    dragend(e){
      this.centerposition={lng:e.point.lng,lat:e.point.lat}

    },
    handleSummit() {
      console.log("进入提交");
      var _this = this;
      var p = this.checkvalues();
      console.log(p);
      p.then(
        function(res) {
          console.log("resolve:" + res);
          _this.updatedevice();
        },
        function(res) {
          console.log(res);
        }
      ).catch(err => {
        console.log(err);
      });
    },

    updatedevice() {
      console.log("进入updatedevice");
      let tagsArray = [];
      let location = {};
      let other = {};
      let summitdata = {};
      let myprivate = true;

      if (this.tags != "" && this.tags != null && this.tags != undefined)
        tagsArray = this.tags.split(",");

      if (this.lon != -1 || this.lat != -1) {
        location.lon = this.lon;
        location.lat = this.lat;
      }

      if (this.private_str == "0") myprivate = false;
      else myprivate = true;

      console.log(this.other_str);
      let other_trim = this.other_str.replace(/\s+/g, "");
      if (other_trim != "" && other_trim != null && other_trim != undefined) {
        other = JSON.parse(this.other_str);
      }

      summitdata.title = this.title;
      summitdata.desc = this.desc;
      summitdata.tags = tagsArray;
      summitdata.private = myprivate;
      if (Object.keys(location).length != 0) summitdata.location = location;
      if (this.auth_info != "" && this.auth_info_old != this.auth_info)
        summitdata.auth_info = this.auth_info;

      summitdata.other = other;

      this.$confirm("是否确认更新", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios({
            method: "put",
            url: "/iot/devices/" + this.device_id,
            data: summitdata
          }).then(data => {
            if (data.data.error == "succ") {
              this.$message({
                type: "success",
                message: "更新成功"
              });
            } else {
              this.$message({
                type: "error",
                message: "添加失败：" + data.data.error
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

    handleback() {
      this.$router.go(-1);
    },

    checkvalues() {
      let other_trim = this.other_str.replace(/\s+/g, "");
      if (this.title == "" || this.title == null || this.title == undefined) {
        this.$message({
          type: "error",
          message: "请填入设备名"
        });
        console.log("第一条");
        return Promise.reject(-1);
      } else if (
        other_trim != "" &&
        other_trim != null &&
        other_trim != undefined &&
        !this.isJSON(this.other_str)
      ) {
        this.$message({
          type: "error",
          message: "输入非json格式，请输入正确的格式"
        });
        return Promise.reject(-1);
      } else {
        return Promise.resolve(1);
      }
    },

    isJSON(str) {
      if (typeof str == "string") {
        try {
          var obj = JSON.parse(str);
          if (typeof obj == "object" && obj) {
            return true;
          } else {
            return false;
          }
        } catch (e) {
          console.log("error：" + str + "!!!" + e);
          return false;
        }
      }
      console.log("It is not a string!");
    },

    getdeviceid() {
      this.row = this.$route.query.row;
      let device_id = "";
      if (
        this.row.id != "" &&
        this.row.id != null &&
        this.row.id != undefined
      ) {
        sessionStorage.setItem("device_id", this.row.id);
        this.device_id = this.row.id;
      } else {
        this.device_id = sessionStorage.getItem("device_id");
      }
      return Promise.resolve(1);
    }
  },

  created() {
    this.getdeviceid().then(
      this.$axios.get("/iot/devices/" + this.device_id).then(data => {
        let dto = data.data.data;
        if (dto.id != undefined) this.device_id = dto.id;
        if (dto.title != undefined) this.title = dto.title;
        if (dto.desc != undefined) this.desc = dto.desc;
        if (dto.tags != undefined) {
          for (let i = 0; i < dto.tags.length; i++) {
            if (i < dto.tags.length - 1) this.tags += dto.tags[i] + ",";
            else this.tags += dto.tags[i];
          }
        }

        if (
          dto.location != undefined &&
          Object.keys(dto.location).length != 0
        ) {
          this.lon = dto.location.lon;
          this.lat = dto.location.lat;
          this.centerposition={lng:this.lon,lat:this.lat};
        } else {
          this.lon = 106.592522;
          this.lat = 29.570243;
          this.centerposition={lng:this.lon,lat:this.lat};
        }

        if (dto.private && dto.private != undefined) this.private_str = "1";
        if (!dto.private && dto.private != undefined) this.private_str = "0";
        if (dto.auth_info != undefined) {
          this.auth_info = dto.auth_info;
          this.auth_info_old = dto.auth_info;
        }

        if (dto.other != undefined && Object.keys(dto.other).length != 0)
          this.other_str = JSON.stringify(dto.other);
        //获取当前设备所属公司
        let params = new URLSearchParams();
        params.append("deviceid", this.device_id);
        this.$axios
          .post("/api/device/getcompanyidbydeviceid", params)
          .then(data => {
            this.companyid = data.data.data;
          });
      })
    );

    //获取公司列表
    this.$axios.post("/api/company/getcompanylist").then(data => {
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

    
  }
};
</script>
<style scope="scoped">
.mytitle2 {
  display: inline-block;
  width: 80px;
  text-align: right;
  color: #606266;
}

.notice2 {
  /* display: inline-block; */
  font-size: 5px;
  width: 100%;
  text-align: left;
  color: red;
  margin-left: 8px;
}

.editdevicemap {
  width: 50%;
  height: 400px;
  position: relative;
  float: right;
  margin-top: 10px;
  margin-right: 30px;
}

/* .mapdiv{
  height: 300px; 
  width: 1000px;
  position: relative;
  float: right;
  margin-top: 120px;
  margin-right: 30px;
} */
</style>