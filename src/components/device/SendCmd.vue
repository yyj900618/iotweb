<template>
    <div>
         <div>
              <p>
                <span class="mytitle">设备ID：</span> 
                <el-input placeholder="设备ID" v-model="device_id" :disabled="true" style="width:200px"></el-input>
              </p>
              <p>  
                <span class="mytitle">设备名：</span> 
                <el-input placeholder="设备名" v-model="title" :disabled="true" style="width:200px"></el-input>
              </p>
            
              <p>  
                <span class="mytitle">离线命令有效期：</span> 
                <el-input placeholder="离线命令有效期" v-model="timeout" style="width:200px"></el-input>
                <span style="color:red ;margin-left:10px">仅对离线命令有效</span>
              </p>


              <p>  
                <span class="mytitle">状态：</span>
                <i v-if="this.online" class="fa fa-circle" style="font-size:20px;color:green;"></i>
                <span v-if="this.online" style="color:#343536; font-size: 20px;">在线</span>
                <i v-if="!this.online" class="fa fa-circle" style="font-size:20px;color:red;"></i>
                <span v-if="!this.online" style="color:#343536; font-size: 20px;">离线</span>
              </p>  
         </div>

         <div>
            <el-input
            type="textarea"
            :autosize="{ minRows: 2}"
            placeholder="请输入命令"
            v-model="cmdvalue">
            </el-input>
            <span style="color:red">离线命令默认有效期为120秒</span>
         </div>
         <div style="text-align:center; margin-top: 20px; margin-bottom: 20px;">
             <el-button type="primary" icon="el-icon-sort" @click="sendonline()"  v-hasPermission="'device:cmd'">在线发送</el-button>
             <el-button type="info" icon="el-icon-sort" @click="sendoffline()"  v-hasPermission="'device:cmd'">离线发送</el-button>
         </div>

        <div>
             开始时间: <el-date-picker v-model="start" type="datetime" placeholder="选择开始日期时间" value-format="yyyy-MM-ddTHH:mm:ss"></el-date-picker>
             结束时间：<el-date-picker v-model="end" type="datetime" placeholder="选择结束日期时间" value-format="yyyy-MM-ddTHH:mm:ss"></el-date-picker>
            <el-button type="primary" icon="el-icon-search" @click="gethistorycmd()" v-hasPermission="'device:cmd'">获取历史命令</el-button>
        </div>
        <p>
            <el-table :data="historycmdlist" stripe style="width: 100%; margin-top:20px">
                <el-table-column prop="cmd_uuid" label="命令ID" width="150"></el-table-column>
                <el-table-column prop="confirm_body" label="confirm_body" width="240"></el-table-column>
                <el-table-column prop="confirm_time" label="confirm_time" width="150"></el-table-column>
                <el-table-column prop="body" label="body" width="150"></el-table-column>
                <el-table-column prop="expire_time" label="expire_time" width="150"></el-table-column>
                <el-table-column prop="send_time" label="send_time" width="150"></el-table-column>
                <el-table-column prop="status" label="status"></el-table-column>
            </el-table>
        </p>
        <div style="text-align:center; margin-top: 20px; margin-bottom: 20px;">
            <el-button type="success" icon="el-icon-caret-left" @click="back()">返回</el-button>
        </div>   
    </div>
</template>
<script>
export default {
    data() {
      return {
       device_id:'',
       title:'',
       online:'',
       cmdvalue:'',
       timeout:120,
       row: {},
       device:{},
       historycmdlist:[],
       start:'',
       end:''
      }
    },

    methods:{
    back(){
        this.$router.go(-1);
    },


    gethistorycmd(){

        let paramsl={}
        if(this.start==''||this.start==null||this.start==undefined){
            this.$message({
                    type: 'error',
                    message: "开始时间必填，请选择开始时间"
                   });
            return false;
        }
        paramsl.start=this.start
        if(this.end!=''&&this.end!=null&&this.end!=undefined)
            paramsl.end=this.end
        this.$axios.get("/iot/cmds/history/"+this.device_id, {params: paramsl}).then(data=>{
            console.log(data)
            this.historycmdlist=data.data.data.items

        })

    },


    sendonline(){
     let params = new URLSearchParams()
     params.append('device_id', this.device_id)  
     this.$axios({
              method:"post",
              url:"/iot/cmds",
              params:params,
              data:this.cmdvalue
              }).then(data=>{
                  console.log(data)
                  if(data.data.error=="succ"){
                    this.$message({
                    type: 'success',
                    message: "在线命令下发成功,命令ID为:"+data.data.data.cmd_uuid
                   });
                }else{
                    this.$message({
                    type: 'error',
                    message: "在线命令下发失败："+data.data.error
                   });
                }
              })
    },
    sendoffline(){
        console.log("进入离线发送")
        let params = new URLSearchParams()
        params.append('device_id', this.device_id)
        params.append('qos', 1) 
        params.append('timeout', this.timeout) 
        this.$axios({
              method:"post",
              url:"/iot/cmds",
              params:params,
              data:this.cmdvalue
              }).then(data=>{
                //   console.log(data)
                  if(data.data.error=="succ"){
                    this.$message({
                    type: 'success',
                    message: "离线命令下发成功,命令ID为:"+data.data.data.cmd_uuid
                   });
                }else{
                    this.$message({
                    type: 'error',
                    message: "在线命令下发失败："+data.data.error
                   });
                }
              })
            },
        },

    created() {
        // console.log(this.$route.query.row)
        this.row = this.$route.query.row
        let paramsl={}
        if (this.row.id != "" && this.row.id != null && this.row.id != undefined) {
            sessionStorage.setItem("device_id", this.row.id);
            // params.append("device_id", this.row.id);
            paramsl.device_id=this.row.id
        }
        else{
            //  params.append("device_id", sessionStorage.getItem("device_id"));
             paramsl.device_id=sessionStorage.getItem("device_id")
        }
        this.$axios.get("/iot/devices", {params: paramsl}).then(data=>{
            //  console.log(data)
            this.device=data.data.data.devices[0]
            this.device_id=this.device.id
            this.title=this.device.title
            this.online=this.device.online
            // console.log(this.device)
        })
        
        // console.log(this.row)
        
    }
    
}

</script>
<style scope="scoped">
.mytitle {
  font-size: 20px;
  display: inline-block; 
  width: 200px;
  text-align: right;
  margin-left: auto;
  color: #343536;
  
}
</style>