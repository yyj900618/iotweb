<template>


    <div>

    <baidu-map
      class="deviceDTOmap"
      :center="{lng:dto.location.lon,lat:dto.location.lat}"
      :zoom="15"
      :scroll-wheel-zoom="true"
      :inertial-dragging="true"
      v-if="dto.location!=undefined"
    >
      <bm-marker
        :position="{lng:dto.location.lon,lat:dto.location.lat}"
        :dragging="false"
      ></bm-marker>
    </baidu-map>



              <p>
                <span class="mytitlec">设备ID：{{dto.id}}</span> 
              </p>
              <p>
                <span class="mytitlec">设备名：{{dto.title}}</span> 
              </p>
              <p>
                <span class="mytitlec"> 状态 ：</span> 
                <i v-if="dto.online" class="fa fa-circle" style="font-size:20px;color:green;"></i>
                <span class="mytitlec" v-if="dto.online">在线</span> 
                <i v-if="!dto.online" class="fa fa-circle" style="font-size:20px;color:red;"></i>
                <span class="mytitlec" v-if="!dto.online">离线</span> 
              </p>

              <p>
                <span class="mytitlec">创建时间：{{dto.create_time}}</span> 
              </p>
              <p>
                <span class="mytitlec">描述：{{dto.desc}}</span> 
              </p>
              <p>
                <span class="mytitlec">认证字符串：{{dto.auth_info}}</span> 
              </p>
             
              <p>
                <span class="mytitlec"> 是否私有 ：</span> 
                <span class="mytitlec" v-if="dto.private">私有</span> 
                <span class="mytitlec" v-if="!dto.private">公有</span> 
              </p>
              <p>
                <span class="mytitlec">协议：{{dto.protocol}}</span> 
              </p>

              <p v-if="dto.location!=undefined">
                <span class="mytitlec">经度：{{dto.location.lat}} ,</span> 
                <span class="mytitlec">纬度：{{dto.location.lon}}</span> 
              </p>

            <p v-if="dto.datastreams!=undefined&&dto.datastreams!=0"> 
              <span class="mytitlec">数据流：</span>   
              
              <el-table :data="this.dto.datastreams" stripe style="width: 100%; margin-top:20px">
                <el-table-column prop="id" label="数据流ID" width="180"></el-table-column>
                <el-table-column prop="unit" label="单位" width="180"></el-table-column>
                <el-table-column prop="unit_symbol" label="单位符号" width="180"></el-table-column>
                <el-table-column prop="create_time" label="创建时间"></el-table-column>
                <el-table-column prop="update_at" label="最新数据上传时间"></el-table-column>
                <el-table-column prop="current_value" label="最新数据点"></el-table-column>
              </el-table>
           </p>
           <p  style="text-align:center;">
               <el-button type="success" icon="el-icon-arrow-left" @click="handleBack()">返回</el-button>
           </p>
    </div>
</template>


<script>
    export default {
        data() {
            return {
                dto:{},
              
            }
        },
        methods:{
            handleBack(){
            this.$router.go(-1);
            },

          

        },
        created() {
           
            this.row = this.$route.query.row
            let device_id=''
            if (this.row.id != "" && this.row.id != null && this.row.id != undefined) {
              sessionStorage.setItem("device_id", this.row.id);
              device_id=this.row.id
            }else{
             device_id=sessionStorage.getItem("device_id")
            }
            this.$axios.get("/iot/devices/"+device_id).then(
                devicedata=>{
                    // console.log(data)
                    this.dto=devicedata.data.data
                    let deviceid=devicedata.data.data.id
                    let streamidstr=''
                    devicedata.data.data.datastreams.forEach(element => {
                      streamidstr+=element.id+","
                    });
                    streamidstr = streamidstr.replace(/^,+/, "").replace(/,+$/, "");
                    this.$axios.get("/iot/devices/"+deviceid+"/datastreams?datastream_ids="+streamidstr).then(streamdata=>{
                      this.dto.datastreams=streamdata.data.data
                      })
                    })

                    

        }





    }
</script>
<style scope="scoped">
.mytitlec {
  font-size: 20px;
  /* display: inline-block;  */
  width: 100%;
  text-align: left;
  margin-left: auto;
  color: #343536;
}

.deviceDTOmap {
  width: 50%;
  height: 400px;
  position: relative;
  float: right;
  margin-top: 10px;
  margin-right: 30px;
}
</style>