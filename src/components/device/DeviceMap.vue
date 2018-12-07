<template>
  <!-- <div id="allmap" ref="allmap"></div> -->
  <div>
    <!-- @click="getclickpoint" -->
    <baidu-map
      class="map"
      center="重庆"
      :zoom="13"
      :scroll-wheel-zoom="true"
      :inertial-dragging="true"
    >

      <!-- <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation> -->
      <bm-map-type
        :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']"
        anchor="BMAP_ANCHOR_TOP_LEFT"
      ></bm-map-type>
      <bm-geolocation
        anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
        :showAddressBar="true"
        :autoLocation="true"
      ></bm-geolocation>
      <bm-city-list anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-city-list>
      <bm-point-collection
        :points="points_offline"
        shape="BMAP_POINT_SHAPE_CIRCLE"
        color="red"
        size="BMAP_POINT_SIZE_NORMAL"
        @mouseout="mouseout"
        @mouseover="mouseover"
      ></bm-point-collection>
      <bm-point-collection
        :points="points_online"
        shape="BMAP_POINT_SHAPE_CIRCLE"
        color="green"
        size="BMAP_POINT_SIZE_NORMAL"
        @mouseout="mouseout"
        @mouseover="mouseover"
      ></bm-point-collection>

      <bm-info-window
        :position="this.position"
        title="设备信息"
        :show="infoWindow.show"
        :width="300"
      >
        设备ID：<span v-text="infoWindow.id"></span><br>
        设备名：<span v-text="infoWindow.title"></span><br>
        状态：<span v-text="infoWindow.online"></span><br>
        协议：<span v-text="infoWindow.protocol"></span><br>
        标签：<span v-text="infoWindow.tags"></span><br>
        位置：<span v-text="infoWindow.location"></span><br>
        描述：<span v-text="infoWindow.desc"></span><br>
        是否私有：<span v-text="infoWindow.private"></span><br>
        创建时间：<span v-text="infoWindow.create_time"></span><br>
        认证信息：<span v-text="infoWindow.auth_info"></span><br>
      </bm-info-window>
    </baidu-map>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // centerposition:{lng:106.59396,lat:29.574264},
      position: {},
      infoWindow: {
        show: false,
        id: "",
        title: "",
        online: "",
        protocol: "",
        tags: "",
        location: "",
        desc: "",
        private: "",
        create_time: "",
        auth_info: ""
      },

      devicceinfo_online: [],
      devicceinfo_offline: [],
      deviceinfo_all: [],
      points_online: [],
      points_offline: [],
      devicecount: ""
    };
  },

  methods: {
    mouseout(e) {
      this.position = {};
      this.infoWindow = {
        show: false,
        id: "",
        title: "",
        online: "",
        protocol: "",
        tags: "",
        location: "",
        desc: "",
        private: "",
        create_time: "",
        auth_info: ""
      };
    },

    mouseover(e) {
      for (let i = 0; i < this.deviceinfo_all.length; i++) {
        if (this.deviceinfo_all[i].location != undefined) {
          if (
            this.deviceinfo_all[i].location.lon == e.point.lng &&
            this.deviceinfo_all[i].location.lat == e.point.lat
          ) {
            this.infoWindow.id = this.deviceinfo_all[i].id;
            this.infoWindow.title = this.deviceinfo_all[i].title;
            if (this.deviceinfo_all[i].online) this.infoWindow.online = "在线";
            else this.infoWindow.online = "离线";
            this.infoWindow.protocol = this.deviceinfo_all[i].protocol;
            this.deviceinfo_all[i].tags.forEach(element => {
              this.infoWindow.tags += element + " ";
            });
            this.infoWindow.location =
              "经度：" + e.point.lng + "， 纬度：" + e.point.lat;

            this.infoWindow.desc = this.deviceinfo_all[i].desc;
            if (this.deviceinfo_all[i].private)
              this.infoWindow.private = "私有";
            else this.infoWindow.private = "公共";

            this.infoWindow.create_time = this.deviceinfo_all[i].create_time;
            this.infoWindow.auth_info = this.deviceinfo_all[i].auth_info;
            // this.centerposition={lng:e.point.lng,lat:e.point.lat}
            this.position.lng = e.point.lng;
            this.position.lat = e.point.lat;
            this.infoWindow.show = true;

            break;
          }
        }
      }
    },

    getDeviceInfo() {
      //获取设备信息并且打点
      let needpages = Math.ceil(this.devicecount / 100); //onenet平台最多一次请求100个设备，所以需要分多次请求
      for (let i = 1; i <= needpages; i++) {
        console.log("循环" + i + "次");
        let params = new URLSearchParams();
        params.append("pagesize", 100);
        params.append("pagenum", i);
        this.$axios.post("/api/device/getdevieidlist", params).then(data => {
          let deviceListStr = "";
          data.data.data.list.forEach(element => {
            deviceListStr += element + ",";
          });
          deviceListStr = deviceListStr.replace(/^,+/, "").replace(/,+$/, "");
          let paramsl = {};
          paramsl.device_id = deviceListStr;
          this.$axios.get("/iot/devices", { params: paramsl }).then(data => {
            data.data.data.devices.forEach(element => {
              if (element.online) this.devicceinfo_online.push(element);
              else this.devicceinfo_offline.push(element);
            });
            this.deviceinfo_all = this.devicceinfo_online.concat(
              this.devicceinfo_offline
            );
            //打点
            this.devicceinfo_online.forEach(element => {
              // console.log("进入在线循环");
              if (element.location != undefined) {
                this.points_online.push({
                  lng: element.location.lon,
                  lat: element.location.lat
                });
                // console.log(this.points_online);
              }
            });
            this.devicceinfo_offline.forEach(element => {
              // console.log("进入离线循环");
              if (element.location != undefined) {
                this.points_offline.push({
                  lng: element.location.lon,
                  lat: element.location.lat
                });
                // console.log(this.points_offline);
              }
            });
          });
        });
      }
    }
  },

  created() {
    this.$axios.post("/api/device/getdevicecount").then(data => {
      this.devicecount = data.data.data;
      this.getDeviceInfo();
      console.log(this.devicceinfo_online);
      console.log(this.devicceinfo_offline);
    });
  }
};
</script>
 
<style scoped>
.map {
  width: 100%;
  height: 500px;
}
</style>