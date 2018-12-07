<template>
  <div>
    <h1>添加设备</h1>
     <baidu-map
      class="deviceaddmap"
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
        <span class="mytitle">设备名</span>
        <el-input
          placeholder="请输入设备名"
          v-model="title"
          style="width:200px"
        ></el-input>
        <span style="color:red;">*</span>
      </p>
      <p>
        <span class="mytitle">设备描述</span>
        <el-input
          placeholder="请输入设备描述"
          v-model="desc"
          style="width:200px"
        ></el-input>
      </p>

      <p>
        <span class="mytitle">所属公司</span>
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
        <span class="mytitle">标签</span>
        <el-input
          placeholder="请输入设备标签"
          v-model="tags"
          style="width:200px"
        ></el-input>
        <span class="notice">不同标签请用逗号隔开</span>
      </p>
      <p>
        <span class="mytitle">经度</span>
        <el-input
          placeholder="请输入设备经度"
          v-model="lon"
          style="width:200px"
        ></el-input>
      </p>

      <p>
        <span class="mytitle">纬度</span>
        <el-input
          placeholder="请输入设备纬度"
          v-model="lat"
          style="width:200px"
        ></el-input>
      </p>

      <p>
        <span class="mytitle">是否私有</span>
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
        <span class="mytitle">鉴权字符串</span>
        <el-input
          placeholder="请输入鉴权字符串"
          v-model="auth_info"
          style="width:200px"
        ></el-input>
        <span class="notice">设备间不能设置相同的字符串，最多512个字母、数字或字母与数字组合的字符串。</span>
      </p>

      <p>
        <span class="mytitle">其他</span>
        <el-input
          placeholder="请输入设备其他信息"
          v-model="other_str"
          style="width:200px"
        ></el-input>
        <span class="notice">请输入json格式的字符串</span>
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
      centerposition:{lng:106.592522,lat:29.570243},
      companylist: [],
      companyid: "",

      title: "",
      desc: "",
      tags: "",
      //    tagsArray:[],
      //    location:{},
      lon: 106.592522,
      lat: 29.570243,
      //    private:true,
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
      other_str: ""
      //    other:{}
    };
  },
  // -------------------------------------------------------
  methods: {

    dragging(e) {
      // console.log(e);
      this.lon = e.point.lng;
      this.lat = e.point.lat;
    },

    dragend(e){
      this.centerposition={lng:e.point.lng,lat:e.point.lat}

    },




    handleback() {
      this.$router.go(-1);
    },

    handleSummit() {
      console.log("进入提交");
      var _this = this;
      var p = this.checkvalues();
      console.log(p);
      p.then(
        function(res) {
          console.log("resolve:" + res);
          _this.adddevice();
        },
        function(res) {
          console.log(res);
        }
      ).catch(err => {
        console.log(err);
      });
    },

    adddevice() {
      console.log("进入adddevice");
      let tagsArray = [];
      let location = {};
      let other = {};
      let myprivate = true;
      if (this.tags != "" && this.tags != null && this.tags != undefined)
        tagsArray = this.tags.split(",");
      if (this.lon != "" || this.lat != "") {
        location.lon = this.lon;
        location.lat = this.lat;
      }
      if (this.private_str == "0") myprivate = false;
      else myprivate = true;

      let other_trim = this.other_str.replace(/\s+/g, "");
      if (other_trim != "" && other_trim != null && other_trim != undefined) {
        other = JSON.parse(this.other_str);
      }

      let summitdata = {};
      summitdata.title = this.title;
      if (this.desc != "") summitdata.desc = this.desc;
      if (tagsArray.length != 0) summitdata.tags = tagsArray;
      if (Object.keys(location).length != 0) summitdata.location = location;
      summitdata.private = myprivate;
      if (this.auth_info != "") summitdata.auth_info = this.auth_info;
      if (Object.keys(other).length != 0) summitdata.other = other;

      this.$axios({
        method: "post",
        url: "/iot/devices",
        data: summitdata
      }).then(data => {
        if (data.data.error == "succ") {
          let paramsadddevice = new URLSearchParams();
          paramsadddevice.append("deviceid", data.data.data.device_id);
          paramsadddevice.append("companyid", this.companyid);
          paramsadddevice.append("title", this.title);
          this.$axios({
            method: "post",
            url: "/api/device/adddevice",
            params: paramsadddevice
          }).then(data2 => {
            if (data2.data.code == 0) {
              this.$message({
                type: "success",
                message: "添加成功，设备ID：" + data.data.data.device_id
              });
            } else {
              //本地数据库添加失败，需要删除onenet平台刚刚添加的设备
              this.$message({
                type: "error",
                message: "本地数据库添加失败，进行数据回滚"
              });
              this.$axios
                .delete("/iot/devices/" + data.data.data.device_id)
                .then(data3 => {
                  if (data.data.error == "succ") {
                    this.$message({
                      type: "error",
                      message: "数据回滚成功"
                    });
                  } else {
                    this.$message({
                      type: "error",
                      message: "数据回滚失败，请到onenet平台手动删除设备"
                    });
                  }
                });
            }
          }).catch(err=>{
              this.$axios
                .delete("/iot/devices/" + data.data.data.device_id)
                .then(data3 => {
                  if (data.data.error == "succ") {
                    this.$message({
                      type: "error",
                      message: "本地数据库添加失败，进行数据回滚...数据回滚成功"
                    });
                  } else {
                    this.$message({
                      type: "error",
                      message: "数据回滚失败，请到onenet平台手动删除设备"
                    });
                  }
                });


          });
        } else {
          this.$message({
            type: "error",
            message: "添加失败：" + data.data.error
          });
        }
      });
    },

    checkvalues() {
      let other_trim = this.other_str.replace(/\s+/g, "");
      if (this.title == "" || this.title == null || this.title == undefined) {
        this.$message({
          type: "error",
          message: "请填入设备名"
        });
        return Promise.reject(-1);
      } else if (
        this.companyid == "" ||
        this.companyid == null ||
        this.companyid == undefined
      ) {
        this.$message({
          type: "error",
          message: "请选择所属公司"
        });
        return Promise.reject(-1);
      } else if (
        other_trim != "" &&
        other_trim != null &&
        other_trim != undefined &&
        !this.isJSON(this.other_str)
      ) {
        this.$message({
          type: "error",
          message: "请输入正确的JSON字符串"
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
    }
    // -----------------------------------------------------
  },

  created() {
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
  }
};
</script>
<style scope="scoped">
.mytitle {
  display: inline-block;
  width: 80px;
  text-align: right;
  color: #606266;
}

.notice {
  font-size: 5px;
  width: 100%;
  text-align: left;
  color: red;
  margin-left: 8px;
}

.deviceaddmap {
  width: 50%;
  height: 400px;
  position: relative;
  float: right;
  margin-top: 10px;
  margin-right: 30px;
}
</style>